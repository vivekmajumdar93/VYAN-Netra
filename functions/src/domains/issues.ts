import { onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { notFound } from "../shared/errors.js";

type IssueSeverity = "low" | "medium" | "high" | "critical";
type IssueStatus = "open" | "in_progress" | "resolved";

interface IssueDoc {
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  appId: string;
  assignedTo: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface IssueView extends IssueDoc {
  id: number;
}

interface CommentDoc {
  issueId: number;
  content: string;
  authorId: number;
  timestamp: number;
}

export interface IssueCommentView extends CommentDoc {
  id: number;
}

const issues = () => db.collection("issues");
const comments = () => db.collection("issueComments");

export const createIssue = onCall<
  {
    title: string;
    description: string;
    severity: IssueSeverity;
    appId: string;
    assignedTo: number | null;
  },
  Promise<IssueView>
>(async (request) => {
  const id = await nextId("issues");
  const now = nowMs();
  const doc: IssueDoc = {
    ...request.data,
    status: "open",
    createdAt: now,
    updatedAt: now,
  };
  await issues().doc(String(id)).set(doc);
  return { id, ...doc };
});

export const updateIssue = onCall<
  {
    id: number;
    title: string;
    description: string;
    severity: IssueSeverity;
    status: IssueStatus;
    assignedTo: number | null;
  },
  Promise<void>
>(async (request) => {
  const { id, ...rest } = request.data;
  const ref = issues().doc(String(id));
  const snap = await ref.get();
  if (!snap.exists) notFound("Issue");
  await ref.update({ ...rest, updatedAt: nowMs() });
});

export const resolveIssue = onCall<{ id: number }, Promise<void>>(
  async (request) => {
    const ref = issues().doc(String(request.data.id));
    const snap = await ref.get();
    if (!snap.exists) notFound("Issue");
    await ref.update({ status: "resolved", updatedAt: nowMs() });
  },
);

export const addIssueComment = onCall<
  { issueId: number; content: string; authorId: number },
  Promise<IssueCommentView>
>(async (request) => {
  const id = await nextId("comments");
  const doc: CommentDoc = { ...request.data, timestamp: nowMs() };
  await comments().doc(String(id)).set(doc);
  return { id, ...doc };
});

export const listIssues = onCall<
  {
    appId: string | null;
    status: IssueStatus | null;
    severity: IssueSeverity | null;
  },
  Promise<IssueView[]>
>(async (request) => {
  const { appId, status, severity } = request.data;
  const snap = await issues().get();
  return snap.docs
    .map((d) => ({ id: Number(d.id), ...(d.data() as IssueDoc) }))
    .filter((i) => {
      const aMatch = appId === null || i.appId === appId;
      const sMatch = status === null || i.status === status;
      const sevMatch = severity === null || i.severity === severity;
      return aMatch && sMatch && sevMatch;
    });
});

export const listIssueComments = onCall<
  { issueId: number },
  Promise<IssueCommentView[]>
>(async (request) => {
  const snap = await comments()
    .where("issueId", "==", request.data.issueId)
    .get();
  return snap.docs.map((d) => ({
    id: Number(d.id),
    ...(d.data() as CommentDoc),
  }));
});

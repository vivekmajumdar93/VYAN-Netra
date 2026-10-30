import { db } from "./admin.js";

// A linked app identifies itself by its current pairing code. The code can
// be regenerated while the app's stable id (the Firestore doc id) stays the
// same, so inbound calls always resolve the id from the code instead of
// treating the two as interchangeable.
export async function findAppIdByCode(appCode: string): Promise<string | null> {
  if (typeof appCode !== "string" || appCode === "") return null;
  const found = await db
    .collection("apps")
    .where("appCode", "==", appCode)
    .limit(1)
    .get();
  return found.empty ? null : found.docs[0].id;
}

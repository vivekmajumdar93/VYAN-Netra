import { HttpsError } from "firebase-functions/v2/https";

export function notFound(what: string): never {
  throw new HttpsError("not-found", `${what} not found`);
}

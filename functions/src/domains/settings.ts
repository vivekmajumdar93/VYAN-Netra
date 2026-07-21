import { onCall } from "firebase-functions/v2/https";
import { db, nowMs } from "../shared/admin.js";

export interface KillSwitchView {
  enabled: boolean;
  updatedAt: number;
}

const killSwitchRef = () => db.collection("settings").doc("killSwitch");

// Console-wide gate on every outbound/cross-app action the backend can
// take (email sends, inbound heartbeat processing). Defaults to disabled
// — see getKillSwitch below — so nothing that can incur cost or contact
// another app runs until an admin explicitly turns it on.
export async function isKillSwitchEnabled(): Promise<boolean> {
  const snap = await killSwitchRef().get();
  return (snap.data()?.enabled as boolean | undefined) ?? false;
}

export const getKillSwitch = onCall<void, Promise<KillSwitchView>>(
  async () => {
    const snap = await killSwitchRef().get();
    const data = snap.data();
    return {
      enabled: (data?.enabled as boolean | undefined) ?? false,
      updatedAt: (data?.updatedAt as number | undefined) ?? 0,
    };
  },
);

export const setKillSwitch = onCall<
  { enabled: boolean },
  Promise<KillSwitchView>
>(async (request) => {
  const updatedAt = nowMs();
  await killSwitchRef().set(
    { enabled: request.data.enabled, updatedAt },
    { merge: true },
  );
  return { enabled: request.data.enabled, updatedAt };
});

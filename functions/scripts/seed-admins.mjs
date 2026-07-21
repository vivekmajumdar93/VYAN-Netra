#!/usr/bin/env node
// Seeds (or updates) the `admins` allowlist collection Firestore rules
// deny direct client access to, so the requestAdminToken Cloud Function
// (the only thing that reads this collection) is the sole gate on who can
// sign in.
//
// Run against the Firebase Emulator Suite:
//   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/seed-admins.mjs
//
// Run against a real project (needs credentials — e.g. `gcloud auth
// application-default login`, or GOOGLE_APPLICATION_CREDENTIALS set):
//   node scripts/seed-admins.mjs

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const ADMINS = [
  { email: "admin@vyan.com", name: "VYAN Admin", role: "Super Admin" },
  {
    email: "vivek.majumdar93@gmail.com",
    name: "Vivek Majumdar",
    role: "Super Admin",
  },
];

initializeApp();
const db = getFirestore();

for (const admin of ADMINS) {
  await db.collection("admins").doc(admin.email).set(admin);
  console.log(`seeded admin: ${admin.email}`);
}

console.log(`done — ${ADMINS.length} admin(s) seeded`);
process.exit(0);

// Snapshots recent git history into public/version-history.json at build
// (and dev-start) time, so the Settings > Version History panel has
// something real to show without needing any backend/canister storage.
// Vercel (and most CI) may do a shallow clone, so this degrades gracefully
// to however many commits are actually available rather than failing.
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function safeExec(cmd) {
  try {
    return execSync(cmd, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

const raw = safeExec(
  'git log -n 20 --pretty=format:"%H%x1f%h%x1f%aI%x1f%s"',
);

const commits = raw
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [hash, short, date, message] = line.split("\x1f");
    return { hash, short, date, message };
  });

const branch = safeExec("git rev-parse --abbrev-ref HEAD") || "unknown";

const out = {
  generatedAt: new Date().toISOString(),
  branch,
  commits,
};

const publicDir = join(root, "public");
mkdirSync(publicDir, { recursive: true });
writeFileSync(
  join(publicDir, "version-history.json"),
  JSON.stringify(out, null, 2),
);

console.log(
  `[generate-version] wrote ${commits.length} commit(s) from branch "${branch}"`,
);

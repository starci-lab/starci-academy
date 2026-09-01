import fs from "node:fs";
import { spawnSync } from "node:child_process";

const preDirty = new Set([
  "CLAUDE.md",
  ".claude/fe/decision-ledger.json",
  ".storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories.tsx",
  "src/components/blocks/learn/ReactionButton/types.ts",
]);

const diff = spawnSync("git", ["diff", "--name-only", "139391b6"], { encoding: "utf8" })
  .stdout.split(/\r?\n/)
  .filter(Boolean);
const untracked = spawnSync("git", ["ls-files", "--others", "--exclude-standard"], {
  encoding: "utf8",
})
  .stdout.split(/\r?\n/)
  .filter(Boolean);
const productUntracked = untracked.filter(
  (f) =>
    /^(src\/|\.storybook\/|plugins\/)/.test(f) &&
    !f.includes("/nivo/") &&
    !f.includes("/nivoexpert/") &&
    !f.includes("/mia-mia/"),
);
const all = [...new Set([...diff, ...productUntracked])];
const b33 = all.filter((f) => !preDirty.has(f) && !f.startsWith(".artifacts/"));
const forbiddenHits = b33.filter((f) => {
  const n = f.replace(/\\/g, "/");
  return (
    n.includes(".storybook/components/nivo/") ||
    n.includes(".storybook/components/nivoexpert/") ||
    n.includes(".storybook/stories/nivo/") ||
    n.includes(".storybook/stories/nivoexpert/") ||
    n.includes(".storybook/components/mia-mia/") ||
    n.includes(".storybook/stories/mia-mia/")
  );
});

const out = {
  checkpoint: "139391b6",
  changedFileCount: b33.length,
  changedFiles: b33.sort(),
  excludedPreDirty: [...preDirty],
  newProductFiles: productUntracked.sort(),
  forbiddenHits,
  forbiddenPathDiffProof: forbiddenHits.length === 0,
};
fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-10-b33-changed-manifest.json",
  JSON.stringify(out, null, 2),
);
console.log(
  JSON.stringify(
    {
      count: b33.length,
      forbiddenHits,
      newProductFiles: productUntracked,
      proof: out.forbiddenPathDiffProof,
    },
    null,
    2,
  ),
);

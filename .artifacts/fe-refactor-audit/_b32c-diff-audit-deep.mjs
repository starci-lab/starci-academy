import fs from "node:fs";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const art = `${cwd}/.artifacts/fe-refactor-audit`;
const scope = JSON.parse(fs.readFileSync(`${art}/2026-08-10-b32c-scope.json`, "utf8"));
const manifest = scope.b32CertifyManifest || [];

const findings = [];
const twinPairs = [];

function norm(p) {
  return p.replace(/\\/g, "/");
}

function twinOf(p) {
  p = norm(p);
  if (p.startsWith(".storybook/components/")) {
    const rest = p.slice(".storybook/components/".length);
    // map Badge.tsx -> index.tsx under src
    const parts = rest.split("/");
    const file = parts.pop();
    const dir = parts.join("/");
    const base = file.replace(/\.tsx?$/, "");
    const candidates = [
      `src/components/${dir}/index.tsx`,
      `src/components/${dir}/${file}`,
      `src/components/${dir}/${base}/index.tsx`,
    ];
    return candidates;
  }
  if (p.startsWith("src/components/")) {
    const rest = p.slice("src/components/".length);
    const parts = rest.split("/");
    const file = parts.pop();
    const dir = parts.filter((x) => x !== "index.tsx" && x !== "index.ts").join("/");
    // Heuristic SB twin
    return [
      `.storybook/components/${dir}/${file}`,
      `.storybook/components/${dir.replace(/\/index$/, "")}/${parts.at(-1) || "X"}.tsx`,
    ];
  }
  return [];
}

for (const file of manifest) {
  const f = norm(file);
  if (!/\.(tsx|ts|mjs)$/.test(f)) continue;
  if (!fs.existsSync(f)) continue;

  const diff = spawnSync("git", ["diff", "9e86cbdf", "--", f], {
    encoding: "utf8",
    cwd,
    maxBuffer: 20 * 1024 * 1024,
  });
  const text = diff.stdout || "";
  if (!text.trim()) continue;

  const added = [];
  const removed = [];
  for (const line of text.split("\n")) {
    if (line.startsWith("+++") || line.startsWith("---") || line.startsWith("@@")) continue;
    if (line.startsWith("+")) added.push(line.slice(1));
    else if (line.startsWith("-")) removed.push(line.slice(1));
  }
  const addJoin = added.join("\n");
  const remJoin = removed.join("\n");

  // CSS door removed but raw className string literals / style objects added on hosts
  const removedDoor =
    /className\??\s*:/.test(remJoin) ||
    /classNames\??\s*:/.test(remJoin) ||
    /\bclassName\b/.test(remJoin);
  const addedRawCss =
    /className=\{?["'`][^"'`]+["'`]/.test(addJoin) ||
    /style=\{\{/.test(addJoin) ||
    /className=\{cn\(/.test(addJoin);

  if (removedDoor && addedRawCss && /no-public-classname|classNames/.test(text)) {
    // only flag if both door API removed AND new raw cn/className host strings appear that weren't style-only moves
    findings.push({
      file: f,
      kind: "possible-css-door-to-raw",
      note: "Door-related removals plus new className/cn/style literals in same diff",
    });
  }

  // Fake principle invent: principle("...") new strings
  const remPrinciples = [...remJoin.matchAll(/principle\(["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
  const addPrinciples = [...addJoin.matchAll(/principle\(["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
  const novel = addPrinciples.filter((p) => !remPrinciples.includes(p));
  if (novel.length) {
    findings.push({
      file: f,
      kind: "new-principle-tokens",
      tokens: [...new Set(novel)],
    });
  }

  // ReactNode fallback
  if (/:\s*ReactNode/.test(addJoin) && !/:\s*ReactNode/.test(remJoin)) {
    findings.push({ file: f, kind: "reactnode-fallback-added" });
  }

  // identity below root — crude: data-starci-identity after first return (
  if (/data-starci-identity|starciIdentity|require-identity/.test(text)) {
    const src = fs.readFileSync(f, "utf8");
    const ret = src.indexOf("return (");
    const id = src.indexOf("data-starci-identity");
    if (ret >= 0 && id > ret + 200) {
      // weak signal only
      findings.push({
        file: f,
        kind: "identity-possibly-deep",
        note: "identity attribute appears well after first return (",
      });
    }
  }

  // raw sentence hosts introduced: <div <section <main with className
  const rawHostAdds = added.filter((l) =>
    /<(div|section|main|aside|header|footer|nav)\b/.test(l) && /className=/.test(l),
  );
  if (rawHostAdds.length && /sentence|FillAvailable|RailShell|Stack|Flex/.test(text)) {
    findings.push({
      file: f,
      kind: "raw-host-with-classname-added",
      sample: rawHostAdds.slice(0, 3),
    });
  }
}

// Twin drift: for SB files in manifest, compare export prop names for className presence
for (const file of manifest) {
  const f = norm(file);
  if (!f.startsWith(".storybook/components/")) continue;
  if (!fs.existsSync(f)) continue;
  const sb = fs.readFileSync(f, "utf8");
  const sbHasClass =
    /className\??\s*:/.test(sb) || /classNames\??\s*:/.test(sb);
  // find src twin via path rewrite
  let rest = f.slice(".storybook/components/".length);
  // drop leaf filename → try index
  const leaf = rest.split("/").pop();
  const dir = rest.slice(0, -leaf.length);
  const candidates = [
    `src/components/${dir}index.tsx`,
    `src/components/${dir}${leaf}`,
    `src/components/${dir}${leaf.replace(/\.tsx$/, "")}/index.tsx`,
  ];
  const srcPath = candidates.find((c) => fs.existsSync(c));
  if (!srcPath) continue;
  const src = fs.readFileSync(srcPath, "utf8");
  const srcHasClass =
    /className\??\s*:/.test(src) || /classNames\??\s*:/.test(src);
  if (sbHasClass !== srcHasClass) {
    twinPairs.push({
      sb: f,
      src: srcPath,
      sbHasClass,
      srcHasClass,
      kind: "classname-api-drift",
    });
  }
}

const out = {
  batch: "B32c",
  phase: 4,
  generatedAt: new Date().toISOString(),
  manifestCount: manifest.length,
  findings,
  twinClassNameDrift: twinPairs,
  nivoLockedEdits: JSON.parse(fs.readFileSync(`${art}/2026-08-10-b32c-diff-audit.json`, "utf8"))
    .nivoLockedEdits,
  summary: {
    findings: findings.length,
    twinDrift: twinPairs.length,
    byKind: findings.reduce((acc, x) => {
      acc[x.kind] = (acc[x.kind] || 0) + 1;
      return acc;
    }, {}),
  },
};
fs.writeFileSync(`${art}/2026-08-10-b32c-diff-audit.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out.summary, null, 2));
if (twinPairs.length) console.log("twin drift sample", twinPairs.slice(0, 10));
if (findings.length) console.log("findings sample", findings.slice(0, 15));

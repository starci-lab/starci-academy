import fs from "node:fs";
import { spawnSync } from "node:child_process";

const scope = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35c-scope.json", "utf8"),
);
const paths = scope.retainedProduct
  .filter((x) => x.kind === "B35 product change" || x.kind === "B35 new file")
  .map((x) => x.path);

function gitDiff(p) {
  return spawnSync("git", ["diff", "-U2", "02011807", "--", p], {
    encoding: "utf8",
    maxBuffer: 20e6,
  }).stdout;
}

function extractAdded(diff) {
  return diff
    .split(/\n/)
    .filter((l) => l.startsWith("+") && !l.startsWith("+++"))
    .map((l) => l.slice(1));
}

function extractRemoved(diff) {
  return diff
    .split(/\n/)
    .filter((l) => l.startsWith("-") && !l.startsWith("---"))
    .map((l) => l.slice(1));
}

/** Find JSX open-tag clusters that contain principle= AND gap/padding/align/justify props. */
function findPrincipleWithCssProps(lines) {
  const hits = [];
  const text = lines.join("\n");
  // Split roughly on JSX component opens of Stack/Flex/Grid/Box/Cluster/Container
  const re =
    /<(Stack[VH]?|Flex|Grid|Box|Cluster|Container|RailShell)\b[\s\S]*?(?:\/>|>)/g;
  let m;
  while ((m = re.exec(text))) {
    const tag = m[0];
    // Truncate at first nested < to stay on one open tag when possible
    const open = tag.split(/\n/).slice(0, 12).join("\n");
    if (!/principle=/.test(open)) continue;
    const props = [];
    if (/\bgap=\{/.test(open) || /\bgap=/.test(open)) props.push("gap");
    if (/\bpadding=\{/.test(open) || /\bpadding=/.test(open)) props.push("padding");
    if (/\balign=\{/.test(open) || /\balign="/.test(open)) props.push("align");
    if (/\bjustify=\{/.test(open) || /\bjustify="/.test(open)) props.push("justify");
    if (/\bclassNames=\{/.test(open) || /\bclassName=/.test(open)) props.push("className(s)");
    if (!props.length) continue;
    const principle = (open.match(/principle=["'`]([^"'`]+)["'`]/) || [])[1];
    hits.push({
      principle,
      props,
      snippet: open.replace(/\s+/g, " ").trim().slice(0, 180),
    });
  }
  return hits;
}

const gapBeside = [];
const novelPrinciples = [];
const boxClassEscapes = [];
const rawHostSwaps = [];
const classDoorLocalCss = [];
const componentTypeRevert = [];
const identityDeep = [];

for (const p of paths) {
  if (!fs.existsSync(p)) continue;
  const diff = p.startsWith("src/hooks/") || p.startsWith("src/modules/")
    ? (() => {
        const st = spawnSync("git", ["status", "--short", "--", p], { encoding: "utf8" }).stdout.trim();
        if (st.startsWith("??")) {
          const body = fs.readFileSync(p, "utf8");
          return body
            .split(/\n/)
            .map((l) => `+${l}`)
            .join("\n");
        }
        return gitDiff(p);
      })()
    : gitDiff(p);
  if (!diff.trim()) continue;
  const added = extractAdded(diff);
  const removed = extractRemoved(diff);
  const addHits = findPrincipleWithCssProps(added);
  const remHits = findPrincipleWithCssProps(removed);
  const remKeys = new Set(remHits.map((h) => `${h.principle}|${h.props.sort().join(",")}`));
  for (const h of addHits) {
    const key = `${h.principle}|${[...h.props].sort().join(",")}`;
    // Only flag if NEW in this diff (not pre-existing same shape)
    // Pre-existing: if removed had same principle+props, it's churn not new regression
    // But retaining beside principle IS still a regression if the B35 edit touched the node.
    // Stricter: flag when principle was ADDED in this diff while gap/padding retained, OR both newly appear together.
    const principleAdded = added.some((l) => l.includes(`principle="${h.principle}"`) || l.includes(`principle='${h.principle}'`));
    const propsInAdded = h.props.some((prop) => {
      if (prop === "gap") return added.some((l) => /\bgap=/.test(l));
      if (prop === "padding") return added.some((l) => /\bpadding=/.test(l));
      if (prop === "align") return added.some((l) => /\balign=/.test(l));
      if (prop === "justify") return added.some((l) => /\bjustify=/.test(l));
      return added.some((l) => /className/.test(l));
    });
    if (principleAdded && propsInAdded) {
      gapBeside.push({ path: p, ...h, remHadSame: remKeys.has(key) });
    }
  }

  // Novel principles
  const remP = [...removed.join("\n").matchAll(/principle=["'`]([^"'`]+)["'`]/g)].map((x) => x[1]);
  const addP = [...added.join("\n").matchAll(/principle=["'`]([^"'`]+)["'`]/g)].map((x) => x[1]);
  const novel = [...new Set(addP.filter((x) => !remP.includes(x)))];
  if (novel.length) novelPrinciples.push({ path: p, novel });

  // Box + className introduced
  const boxAdd = added.filter((l) => /<Box\b/.test(l));
  const boxRem = removed.filter((l) => /<Box\b/.test(l));
  if (boxAdd.length > boxRem.length) {
    const withCn = [...added.join("\n").matchAll(/<Box\b[\s\S]{0,200}?>/g)].filter((m) =>
      /className=/.test(m[0]),
    );
    if (withCn.length) {
      boxClassEscapes.push({
        path: p,
        sample: withCn[0][0].replace(/\s+/g, " ").slice(0, 160),
      });
    }
  }

  // ComponentType -> ReactNode
  if (
    (/ComponentType/.test(removed.join("\n")) && /:\s*ReactNode\b/.test(added.join("\n"))) ||
    (/ComponentTypeWithSkeleton/.test(removed.join("\n")) && /:\s*ReactNode\b/.test(added.join("\n")))
  ) {
    componentTypeRevert.push(p);
  }
}

// Filter gapBeside: prefer cases where remHadSame is false OR principle was newly introduced with gap
const gapNew = gapBeside.filter((h) => !h.remHadSame);
const gapRetained = gapBeside.filter((h) => h.remHadSame);

console.log(
  JSON.stringify(
    {
      gapBesideNew: gapNew.length,
      gapBesideRetainedSameShape: gapRetained.length,
      gapBesideNewSample: gapNew.slice(0, 30),
      boxClassEscapes,
      componentTypeRevert,
      novelPrincipleCount: novelPrinciples.length,
      novelPrincipleSample: novelPrinciples.slice(0, 20),
    },
    null,
    2,
  ),
);

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/_b35c-gap-beside.json",
  JSON.stringify({ gapNew, gapRetained, boxClassEscapes, novelPrinciples, componentTypeRevert }, null, 2),
);

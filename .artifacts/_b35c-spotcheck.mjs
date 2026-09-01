import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const listBuf = fs.readFileSync(path.join(root, ".artifacts/_b35c-gap-paths.txt"))
const listText =
  listBuf[0] === 0xff && listBuf[1] === 0xfe
    ? listBuf.toString("utf16le")
    : listBuf[1] === 0
      ? listBuf.toString("utf16le")
      : listBuf.toString("utf8")
const files = listText
  .replace(/^\uFEFF/, "")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((s) => s.trim())
  .filter(Boolean)

const FRAME =
  /<(Stack[VH]?|Flex|Grid|Box|Cluster|Container|RailShell|Form)\b/g
const LAYOUT_PROPS = ["gap", "align", "padding", "justify"]

function findOpenEnd(src, absStart) {
  let j = absStart + 1
  let inStr = null
  let brace = 0
  while (j < src.length) {
    const c = src[j]
    const n = src[j + 1]
    if (inStr) {
      if (c === "\\" && j + 1 < src.length) {
        j += 2
        continue
      }
      if (c === inStr) inStr = null
      j++
      continue
    }
    if (c === "/" && n === "/") {
      const nl = src.indexOf("\n", j)
      j = nl < 0 ? src.length : nl + 1
      continue
    }
    if (c === "/" && n === "*") {
      const end = src.indexOf("*/", j + 2)
      j = end < 0 ? src.length : end + 2
      continue
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c
      j++
      continue
    }
    if (c === "{") {
      brace++
      j++
      continue
    }
    if (c === "}") {
      brace = Math.max(0, brace - 1)
      j++
      continue
    }
    if (brace === 0 && c === ">") return j
    j++
  }
  return -1
}

/** Own-attribute className only: before first nested `<` in the open tag. */
function ownClassDoor(open) {
  const head = open.split(/<(?![!?/])/)[0] // before nested JSX tag
  return /\bclassNames\s*=/.test(head) || /\bclassName\s*=/.test(head)
}

const residual = []
for (const rel of files) {
  const src = fs.readFileSync(path.join(root, rel), "utf8")
  FRAME.lastIndex = 0
  let m
  while ((m = FRAME.exec(src))) {
    const end = findOpenEnd(src, m.index)
    if (end < 0) continue
    const open = src.slice(m.index, end + 1)
    if (!/\bprinciple\s*=/.test(open)) continue
    const found = LAYOUT_PROPS.filter((p) =>
      new RegExp(`\\b${p}\\s*=`).test(open),
    )
    const classDoor = ownClassDoor(open)
    if (found.length || classDoor) {
      residual.push({
        path: rel,
        line: src.slice(0, m.index).split("\n").length,
        tag: m[1],
        props: found,
        classDoor,
        snippet: open.replace(/\s+/g, " ").trim().slice(0, 180),
      })
    }
  }
}

const sample = [
  "src/components/blocks/ai/AiQuotaSubscriptionPanel/index.tsx",
  ".storybook/components/starci/blocks/commerce/TrialConversionStrip/TrialConversionStrip.tsx",
  "src/components/overlays/modals/PremiumGateModal/component.tsx",
  "src/components/blocks/learn/CourseQaQuestionList/index.tsx",
  "src/components/blocks/navigation/Navbar/index.tsx",
]

const gapResidual = residual.filter((r) => r.props.length)
const sampleGap = gapResidual.filter((r) => sample.includes(r.path))

console.log(
  JSON.stringify(
    {
      gapResidualCount: gapResidual.length,
      gapResidual,
      classDoorOwnCount: residual.filter((r) => r.classDoor).length,
      classDoorOwn: residual.filter((r) => r.classDoor),
      sampleChecked: sample,
      sampleGapHits: sampleGap,
    },
    null,
    2,
  ),
)

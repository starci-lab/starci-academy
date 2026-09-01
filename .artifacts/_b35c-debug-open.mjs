import fs from "node:fs"

const files = [
  ".storybook/components/starci/blocks/learn/CourseQaQuestionList/CourseQaQuestionList.tsx",
  ".storybook/components/starci/overlays/modals/PremiumGateModal/PremiumGateModal.tsx",
]

const FRAME = /<(Stack[VH]?|Flex|Grid|Box|Cluster|Container|RailShell|Form)\b/g

function findOpenEnd(src, absStart) {
  let j = absStart + 1
  let inStr = null
  let brace = 0
  while (j < src.length) {
    const c = src[j]
    if (inStr) {
      if (c === "\\" && j + 1 < src.length) {
        j += 2
        continue
      }
      if (c === inStr) inStr = null
      j++
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
    if (brace === 0 && c === ">") {
      return j
    }
    // debug premature
    if (c === ">" && brace !== 0) {
      // nested
    }
    j++
  }
  return -1
}

for (const p of files) {
  const src = fs.readFileSync(p, "utf8")
  console.log("====", p)
  FRAME.lastIndex = 0
  let m
  let n = 0
  while ((m = FRAME.exec(src)) && n < 12) {
    const end = findOpenEnd(src, m.index)
    const open = end < 0 ? "<NO END>" : src.slice(m.index, end + 1)
    const hasP = /\bprinciple\s*=/.test(open)
    const hasG = /\bgap\s*=/.test(open)
    console.log(
      n,
      m[1],
      "line",
      src.slice(0, m.index).split("\n").length,
      "end",
      end,
      "principle",
      hasP,
      "gap",
      hasG,
      "len",
      open.length,
      "snip",
      open.replace(/\s+/g, " ").slice(0, 120),
    )
    n++
  }
}

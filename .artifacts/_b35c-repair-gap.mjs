import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const targets = process.argv.slice(2)

const FRAME =
  /<(Stack[VH]?|Flex|Grid|Box|Cluster|Container|RailShell|Form)\b/g

const LAYOUT_PROPS = ["gap", "align", "padding", "justify"]

function stripLayoutProps(openTag) {
  let out = openTag
  const removed = []
  for (const prop of LAYOUT_PROPS) {
    const re = new RegExp(
      `\\s+\\b${prop}\\s*=\\s*(?:\\{(?:[^{}]|\\{[^{}]*\\})*\\}|"[^"]*"|'[^']*')`,
      "g",
    )
    if (re.test(out)) {
      removed.push(prop)
      out = out.replace(re, "")
    }
  }
  return { out, removed }
}

/** Find end index of JSX open tag, skipping comments and respecting strings/braces. */
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

    // line comment
    if (c === "/" && n === "/") {
      const nl = src.indexOf("\n", j)
      j = nl < 0 ? src.length : nl + 1
      continue
    }
    // block comment
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
    if (brace === 0 && c === ">") {
      return j
    }
    j++
  }
  return -1
}

function repairSource(src) {
  const edits = []
  let result = ""
  let i = 0
  while (i < src.length) {
    FRAME.lastIndex = i
    const m = FRAME.exec(src)
    if (!m) {
      result += src.slice(i)
      break
    }
    const absStart = m.index
    result += src.slice(i, absStart)
    const end = findOpenEnd(src, absStart)
    if (end < 0) {
      // skip this match, keep scanning
      result += m[0]
      i = absStart + m[0].length
      continue
    }
    const openTag = src.slice(absStart, end + 1)
    if (/\bprinciple\s*=/.test(openTag)) {
      const hasLayout = LAYOUT_PROPS.some((p) =>
        new RegExp(`\\b${p}\\s*=`).test(openTag),
      )
      if (hasLayout) {
        const { out, removed } = stripLayoutProps(openTag)
        edits.push({
          tag: m[1],
          removed,
          before: openTag.replace(/\s+/g, " ").trim().slice(0, 160),
          after: out.replace(/\s+/g, " ").trim().slice(0, 160),
        })
        result += out
        i = end + 1
        continue
      }
    }
    result += openTag
    i = end + 1
  }
  return { result, edits }
}

const files =
  targets.length > 0
    ? targets
    : (() => {
        const listBuf = fs.readFileSync(path.join(root, ".artifacts/_b35c-gap-paths.txt"))
        const listText =
          listBuf[0] === 0xff && listBuf[1] === 0xfe
            ? listBuf.toString("utf16le")
            : listBuf[1] === 0
              ? listBuf.toString("utf16le")
              : listBuf.toString("utf8")
        return listText
          .replace(/^\uFEFF/, "")
          .trim()
          .split(/\r?\n/)
          .slice(1)
          .map((s) => s.trim())
          .filter(Boolean)
      })()

const repaired = []
for (const rel of files) {
  const full = path.join(root, rel)
  const src = fs.readFileSync(full, "utf8")
  const { result, edits } = repairSource(src)
  if (edits.length) {
    fs.writeFileSync(full, result)
    repaired.push({ path: rel, edits })
    console.log(`OK ${rel} (${edits.length} tags)`)
  } else {
    console.log(`SKIP ${rel}`)
  }
}

fs.writeFileSync(
  path.join(root, ".artifacts/_b35c-repair-gap-result2.json"),
  JSON.stringify({ repairedCount: repaired.length, repaired }, null, 2),
)

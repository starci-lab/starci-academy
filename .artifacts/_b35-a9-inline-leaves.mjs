import fs from "fs"
import path from "path"

/** Merge sibling .tsx helpers into a host file, then delete the siblings. */

function stripUseClient(src) {
  return src.replace(/^["']use client["'];?\r?\n\r?\n?/, "")
}

function splitImportsAndBody(src) {
  const lines = src.split(/\r?\n/)
  const imports = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith("import ") || (imports.length && imports[imports.length - 1].includes("{") && !imports[imports.length - 1].includes("from "))) {
      // multi-line import
      let block = line
      while (!block.includes("from ") && i + 1 < lines.length) {
        i++
        block += "\n" + lines[i]
      }
      // continue until closing if still open
      while ((block.match(/{/g) || []).length > (block.match(/}/g) || []).length && i + 1 < lines.length) {
        i++
        block += "\n" + lines[i]
      }
      imports.push(block)
      i++
      continue
    }
    if (line.trim() === "" && imports.length) {
      i++
      continue
    }
    break
  }
  const body = lines.slice(i).join("\n").replace(/^\n+/, "")
  return { imports, body }
}

function mergeInto(hostPath, siblingPaths, removeImportRes) {
  const hostRaw = fs.readFileSync(hostPath, "utf8")
  const hasClient = /^["']use client["']/.test(hostRaw)
  let host = stripUseClient(hostRaw)
  for (const re of removeImportRes) host = host.replace(re, "")
  const hostParts = splitImportsAndBody(host)

  const importSet = new Map()
  const addImports = (list) => {
    for (const imp of list) {
      const key = imp.replace(/\s+/g, " ").trim()
      if (!importSet.has(key)) importSet.set(key, imp)
    }
  }
  addImports(hostParts.imports)

  const bodies = []
  for (const sib of siblingPaths) {
    const raw = stripUseClient(fs.readFileSync(sib, "utf8"))
    const parts = splitImportsAndBody(raw)
    // drop imports that reference relative siblings being merged
    const filtered = parts.imports.filter((imp) => {
      if (/from ["']\.\/(ConceptNode|ShuffleBeacon|ChatPaneSkeleton|FlashcardSessionStatsSkeleton|FlashcardQuizResultSkeleton|recapBlocks|CvEditorToolbarBar|AiUsageHistory|ProfileActivity|ProfileAchievements)["']/.test(imp))
        return false
      return true
    })
    addImports(filtered)
    bodies.push(parts.body.trimEnd())
    fs.unlinkSync(sib)
    console.log("deleted", sib)
  }

  const out =
    (hasClient ? '"use client"\n\n' : "") +
    [...importSet.values()].join("\n") +
    "\n\n" +
    bodies.join("\n\n") +
    "\n\n" +
    hostParts.body.trimStart()
  fs.writeFileSync(hostPath, out.replace(/\n{3,}/g, "\n\n"))
  console.log("wrote", hostPath)
}

// KnowledgeGraph
mergeInto(
  "src/components/pages/LandingPage/KnowledgeGraph/index.tsx",
  [
    "src/components/pages/LandingPage/KnowledgeGraph/ConceptNode.tsx",
    "src/components/pages/LandingPage/KnowledgeGraph/ShuffleBeacon.tsx",
  ],
  [
    /import\s*\{[^}]*\}\s*from\s*["']\.\/ConceptNode["'];?\r?\n/,
    /import\s*\{[^}]*\}\s*from\s*["']\.\/ShuffleBeacon["'];?\r?\n/,
  ],
)

// ChatPane skeleton → component.tsx; re-export from index for parent
{
  const skel = fs.readFileSync(
    "src/components/pages/CommunityChatPage/ChatPane/ChatPaneSkeleton.tsx",
    "utf8",
  )
  const compPath = "src/components/pages/CommunityChatPage/ChatPane/component.tsx"
  let comp = fs.readFileSync(compPath, "utf8")
  // append skeleton before end — after stripping duplicate React import from skel
  const skelBody = stripUseClient(skel)
    .replace(/^import React from ["']react["'];?\r?\n/, "")
    .replace(/^import \{ Skeleton \} from ["']@\/components\/blocks\/skeleton\/Skeleton["'];?\r?\n/, "")
    .replace(/^import \{ Box \} from ["']@\/components\/frames\/Box["'];?\r?\n/, "")
    .replace(/^import \{ StackH, StackV \} from ["']@\/components\/frames\/Stack["'];?\r?\n/, "")
  // ensure Skeleton/Box/Stack already in component — they are
  if (!comp.includes("export const ChatPaneSkeleton")) {
    fs.writeFileSync(compPath, comp.trimEnd() + "\n\n" + skelBody.trimStart())
  }
  fs.unlinkSync("src/components/pages/CommunityChatPage/ChatPane/ChatPaneSkeleton.tsx")
  // update ChatPane index to re-export
  let idx = fs.readFileSync("src/components/pages/CommunityChatPage/ChatPane/index.tsx", "utf8")
  if (!idx.includes("ChatPaneSkeleton")) {
    idx = idx.replace(
      'import { _ChatPane } from "./component"',
      'import { _ChatPane, ChatPaneSkeleton } from "./component"\nexport { ChatPaneSkeleton }',
    )
    fs.writeFileSync("src/components/pages/CommunityChatPage/ChatPane/index.tsx", idx)
  }
  // parent import
  let parent = fs.readFileSync("src/components/pages/CommunityChatPage/index.tsx", "utf8")
  parent = parent.replace(
    'from "./ChatPane/ChatPaneSkeleton"',
    'from "./ChatPane"',
  )
  fs.writeFileSync("src/components/pages/CommunityChatPage/index.tsx", parent)
  console.log("ChatPane skeleton inlined")
}

// FlashcardSessionStats skeleton → component
{
  const skelPath = "src/components/pages/FlashcardsPage/FlashcardSessionStats/FlashcardSessionStatsSkeleton.tsx"
  const compPath = "src/components/pages/FlashcardsPage/FlashcardSessionStats/component.tsx"
  const skel = fs.readFileSync(skelPath, "utf8")
  let comp = fs.readFileSync(compPath, "utf8")
  const skelBody = stripUseClient(skel)
  if (!comp.includes("FlashcardSessionStatsSkeleton")) {
    fs.writeFileSync(compPath, comp.trimEnd() + "\n\n" + skelBody)
  }
  fs.unlinkSync(skelPath)
  let idx = fs.readFileSync("src/components/pages/FlashcardsPage/FlashcardSessionStats/index.tsx", "utf8")
  if (!idx.includes("FlashcardSessionStatsSkeleton")) {
    idx =
      'export { FlashcardSessionStatsSkeleton } from "./component"\n' + idx
    fs.writeFileSync("src/components/pages/FlashcardsPage/FlashcardSessionStats/index.tsx", idx)
  }
  let page = fs.readFileSync("src/components/pages/FlashcardsPage/index.tsx", "utf8")
  page = page.replace(
    'from "./FlashcardSessionStats/FlashcardSessionStatsSkeleton"',
    'from "./FlashcardSessionStats"',
  )
  fs.writeFileSync("src/components/pages/FlashcardsPage/index.tsx", page)
  console.log("FlashcardSessionStats skeleton inlined")
}

// FlashcardQuizResult: skeleton + recapBlocks → component
{
  const folder = "src/components/pages/FlashcardsPage/FlashcardQuizResult"
  const compPath = `${folder}/component.tsx`
  let comp = fs.readFileSync(compPath, "utf8")
  comp = comp.replace(
    /import \{ RecapEnrollUpsell, RecapReadinessCallout, RecapWeakTagsCard \} from ["']\.\/recapBlocks["'];?\r?\n/,
    "",
  )
  const recap = stripUseClient(fs.readFileSync(`${folder}/recapBlocks.tsx`, "utf8"))
  const skel = stripUseClient(fs.readFileSync(`${folder}/FlashcardQuizResultSkeleton.tsx`, "utf8"))
  fs.writeFileSync(compPath, comp.trimEnd() + "\n\n" + recap + "\n\n" + skel)
  fs.unlinkSync(`${folder}/recapBlocks.tsx`)
  fs.unlinkSync(`${folder}/FlashcardQuizResultSkeleton.tsx`)
  let idx = fs.readFileSync(`${folder}/index.tsx`, "utf8")
  if (!idx.includes("FlashcardQuizResultSkeleton")) {
    idx = 'export { FlashcardQuizResultSkeleton } from "./component"\n' + idx
    fs.writeFileSync(`${folder}/index.tsx`, idx)
  }
  let page = fs.readFileSync("src/components/pages/FlashcardsPage/index.tsx", "utf8")
  page = page.replace(
    'from "./FlashcardQuizResult/FlashcardQuizResultSkeleton"',
    'from "./FlashcardQuizResult"',
  )
  fs.writeFileSync("src/components/pages/FlashcardsPage/index.tsx", page)
  console.log("FlashcardQuizResult extras inlined")
}

console.log("leaf merges done")

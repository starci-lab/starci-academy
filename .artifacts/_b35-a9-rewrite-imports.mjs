import fs from "fs"
import path from "path"

/** Rewrite relative page-helper imports to new homes; then delete old sources. */

const replacements = [
  // Practice already done

  // Flashcards
  {
    fromRe: /from\s+["'](\.\.\/)+useFlashcardNav["']/g,
    to: 'from "@/hooks/useFlashcardNav"',
  },
  {
    fromRe: /from\s+["']\.\/useFlashcardNav["']/g,
    to: 'from "@/hooks/useFlashcardNav"',
  },
  {
    fromRe: /from\s+["'](\.\.\/)+useStartFlashcardReviewSession["']/g,
    to: 'from "@/hooks/useStartFlashcardReviewSession"',
  },
  {
    fromRe: /from\s+["']\.\/useStartFlashcardReviewSession["']/g,
    to: 'from "@/hooks/useStartFlashcardReviewSession"',
  },
  {
    fromRe: /from\s+["'](\.\.\/)+useStartFlashcardDueReviewSession["']/g,
    to: 'from "@/hooks/useStartFlashcardDueReviewSession"',
  },
  {
    fromRe: /from\s+["']\.\/useStartFlashcardDueReviewSession["']/g,
    to: 'from "@/hooks/useStartFlashcardDueReviewSession"',
  },
  {
    fromRe: /from\s+["'](\.\.\/)+constants["']/g,
    // too broad — handle flashcards specifically below
    skip: true,
  },
]

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".git") continue
      walk(p, acc)
    } else if (/\.(tsx?|jsx?|mjs)$/.test(ent.name)) acc.push(p)
  }
  return acc
}

const roots = [
  "src/components/pages/FlashcardsPage",
  "src/components/pages/DashboardPage",
  "src/components/pages/CourseDetailPage",
  "src/components/pages/SepayCheckoutPage",
  "src/components/pages/OauthRedirectPage",
  "src/components/pages/ArchitecturePage",
  "src/components/pages/LearningHistoryPage",
  "src/components/pages/AdminMpegDashTestPage",
  "src/components/pages/AdminUploadVideoPage",
  "src/components/pages/ChallengeResultPage",
  "src/components/pages/CourseContents",
  "src/components/pages/SystemStatusPage",
  "src/components/pages/LandingPage",
  "src/components/pages/ProfileChallengesPage",
  "src/components/pages/KpiPage",
  "src/components/pages/BlogListPage",
]

// Targeted string replacements per file pattern
const filePatches = []

const flashFiles = walk("src/components/pages/FlashcardsPage")
for (const f of flashFiles) {
  let s = fs.readFileSync(f, "utf8")
  const orig = s
  s = s.replaceAll('from "../useFlashcardNav"', 'from "@/hooks/useFlashcardNav"')
  s = s.replaceAll('from "./useFlashcardNav"', 'from "@/hooks/useFlashcardNav"')
  s = s.replaceAll('from "../useStartFlashcardReviewSession"', 'from "@/hooks/useStartFlashcardReviewSession"')
  s = s.replaceAll('from "./useStartFlashcardReviewSession"', 'from "@/hooks/useStartFlashcardReviewSession"')
  s = s.replaceAll('from "../useStartFlashcardDueReviewSession"', 'from "@/hooks/useStartFlashcardDueReviewSession"')
  s = s.replaceAll('from "./useStartFlashcardDueReviewSession"', 'from "@/hooks/useStartFlashcardDueReviewSession"')
  s = s.replaceAll('from "../constants"', 'from "@/modules/utils/flashcards"')
  s = s.replaceAll('from "../../constants"', 'from "@/modules/utils/flashcards"')
  s = s.replaceAll('from "./constants"', 'from "@/modules/utils/flashcards"')
  if (s !== orig) {
    fs.writeFileSync(f, s)
    filePatches.push(f)
  }
}

const dashFiles = walk("src/components/pages/DashboardPage")
for (const f of dashFiles) {
  let s = fs.readFileSync(f, "utf8")
  const orig = s
  s = s.replaceAll('from "./hooks/useDashboardTabUrlSync"', 'from "@/hooks/useDashboardTabUrlSync"')
  s = s.replaceAll('from "../hooks/useDashboardTabUrlSync"', 'from "@/hooks/useDashboardTabUrlSync"')
  s = s.replaceAll('from "../types"', 'from "@/modules/types/dashboard-tabs"')
  s = s.replaceAll('from "./types"', 'from "@/modules/types/dashboard-tabs"')
  s = s.replaceAll('from "./useResumeItems"', 'from "@/hooks/useResumeItems"')
  s = s.replaceAll('from "../ContinueLearning/useResumeItems"', 'from "@/hooks/useResumeItems"')
  if (s !== orig) {
    fs.writeFileSync(f, s)
    filePatches.push(f)
  }
}

console.log("patched", filePatches.length, "files")
for (const f of filePatches) console.log(" ", f)

// delete old flashcard + dashboard helpers
const toDelete = [
  "src/components/pages/FlashcardsPage/useFlashcardNav.ts",
  "src/components/pages/FlashcardsPage/useStartFlashcardReviewSession.ts",
  "src/components/pages/FlashcardsPage/useStartFlashcardDueReviewSession.ts",
  "src/components/pages/FlashcardsPage/constants/index.ts",
  "src/components/pages/DashboardPage/types.ts",
  "src/components/pages/DashboardPage/hooks/useDashboardTabUrlSync.ts",
  "src/components/pages/DashboardPage/ContinueLearning/useResumeItems.ts",
]
for (const f of toDelete) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f)
    console.log("deleted", f)
  }
}

// remove empty dirs
for (const d of [
  "src/components/pages/FlashcardsPage/constants",
  "src/components/pages/DashboardPage/hooks",
]) {
  if (fs.existsSync(d) && fs.readdirSync(d).length === 0) {
    fs.rmdirSync(d)
    console.log("rmdir", d)
  }
}

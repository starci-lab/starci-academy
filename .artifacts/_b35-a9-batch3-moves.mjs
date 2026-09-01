import fs from "fs"
import path from "path"

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
}
function moveFile(from, to, transform) {
  if (!fs.existsSync(from)) {
    console.log("skip missing", from)
    return
  }
  let s = fs.readFileSync(from, "utf8")
  if (transform) s = transform(s)
  ensureDir(to)
  fs.writeFileSync(to, s)
  fs.unlinkSync(from)
  console.log("moved", from, "->", to)
}
function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, acc)
    else if (/\.(tsx?|jsx?)$/.test(ent.name)) acc.push(p)
  }
  return acc
}
function rewriteIn(dirs, pairs) {
  for (const dir of dirs) {
    for (const f of walk(dir)) {
      let s = fs.readFileSync(f, "utf8")
      const orig = s
      for (const [a, b] of pairs) s = s.split(a).join(b)
      if (s !== orig) {
        fs.writeFileSync(f, s)
        console.log("patched", f)
      }
    }
  }
}
function rmEmpty(dir) {
  if (!fs.existsSync(dir)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) rmEmpty(path.join(dir, ent.name))
  }
  if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir)
    console.log("rmdir", dir)
  }
}

// LearningHistory
moveFile(
  "src/components/pages/LearningHistoryPage/hooks/useSelectedCourse.ts",
  "src/hooks/useSelectedCourse.ts",
)
rewriteIn(
  ["src/components/pages/LearningHistoryPage"],
  [['from "./hooks/useSelectedCourse"', 'from "@/hooks/useSelectedCourse"'],
   ['from "../hooks/useSelectedCourse"', 'from "@/hooks/useSelectedCourse"']],
)
rmEmpty("src/components/pages/LearningHistoryPage/hooks")

// ChallengeResult + CourseContents maps
moveFile(
  "src/components/pages/ChallengeResultPage/map.ts",
  "src/modules/utils/challenge-result-map.ts",
)
rewriteIn(
  ["src/components/pages/ChallengeResultPage"],
  [['from "./map"', 'from "@/modules/utils/challenge-result-map"']],
)

moveFile(
  "src/components/pages/CourseContents/map.ts",
  "src/modules/utils/course-contents-map.ts",
)
rewriteIn(
  ["src/components/pages/CourseContents"],
  [['from "./map"', 'from "@/modules/utils/course-contents-map"']],
)

// ProfileChallenges groupBy
moveFile(
  "src/components/pages/ProfileChallengesPage/ProfileChallenges/groupByCourse.ts",
  "src/modules/utils/group-challenges-by-course.ts",
)
rewriteIn(
  ["src/components/pages/ProfileChallengesPage"],
  [['from "./groupByCourse"', 'from "@/modules/utils/group-challenges-by-course"'],
   ['from "../ProfileChallenges/groupByCourse"', 'from "@/modules/utils/group-challenges-by-course"']],
)

// Kpi meta (JSX icons — still non-page home as shared util)
moveFile(
  "src/components/pages/KpiPage/kpiMeta.tsx",
  "src/modules/utils/kpi-meta.tsx",
)
rewriteIn(
  ["src/components/pages/KpiPage", "src/components/pages/DashboardPage"],
  [['from "./kpiMeta"', 'from "@/modules/utils/kpi-meta"'],
   ['from "../KpiPage/kpiMeta"', 'from "@/modules/utils/kpi-meta"'],
   ['from "../../KpiPage/kpiMeta"', 'from "@/modules/utils/kpi-meta"']],
)

// Landing constants
moveFile(
  "src/components/pages/LandingPage/constants/index.ts",
  "src/modules/utils/landing-constants.ts",
)
rewriteIn(
  ["src/components/pages/LandingPage"],
  [['from "../constants"', 'from "@/modules/utils/landing-constants"'],
   ['from "./constants"', 'from "@/modules/utils/landing-constants"'],
   ['from "../../constants"', 'from "@/modules/utils/landing-constants"']],
)
rmEmpty("src/components/pages/LandingPage/constants")

// KnowledgeGraph data
moveFile(
  "src/components/pages/LandingPage/KnowledgeGraph/data.ts",
  "src/modules/utils/knowledge-graph-data.ts",
  (s) =>
    s.replaceAll(
      'from "../constants"',
      'from "@/modules/utils/landing-constants"',
    ),
)
rewriteIn(
  ["src/components/pages/LandingPage/KnowledgeGraph"],
  [['from "./data"', 'from "@/modules/utils/knowledge-graph-data"']],
)

// LearningHistory CourseOutline map
if (fs.existsSync("src/components/pages/LearningHistoryPage/CourseOutline/map.ts")) {
  moveFile(
    "src/components/pages/LearningHistoryPage/CourseOutline/map.ts",
    "src/modules/utils/learning-history-outline-map.ts",
  )
  rewriteIn(
    ["src/components/pages/LearningHistoryPage"],
    [['from "./map"', 'from "@/modules/utils/learning-history-outline-map"']],
  )
}

// SystemStatus map
if (fs.existsSync("src/components/pages/SystemStatusPage/map.tsx")) {
  moveFile(
    "src/components/pages/SystemStatusPage/map.tsx",
    "src/modules/utils/system-status-map.tsx",
  )
  rewriteIn(
    ["src/components/pages/SystemStatusPage"],
    [['from "./map"', 'from "@/modules/utils/system-status-map"']],
  )
}

// WeeklyGoals map
if (fs.existsSync("src/components/pages/DashboardPage/WeeklyGoals/map.tsx")) {
  moveFile(
    "src/components/pages/DashboardPage/WeeklyGoals/map.tsx",
    "src/modules/utils/weekly-goals-map.tsx",
  )
  rewriteIn(
    ["src/components/pages/DashboardPage/WeeklyGoals"],
    [['from "./map"', 'from "@/modules/utils/weekly-goals-map"']],
  )
}

// Admin Upload enums + types + map
moveFile(
  "src/components/pages/AdminUploadVideoPage/enums/upload-status.ts",
  "src/modules/types/enums/upload-status.ts",
)
if (fs.existsSync("src/components/pages/AdminUploadVideoPage/enums/index.ts")) {
  fs.unlinkSync("src/components/pages/AdminUploadVideoPage/enums/index.ts")
}
moveFile(
  "src/components/pages/AdminUploadVideoPage/types/admin-upload-video.ts",
  "src/modules/types/admin-upload-video.ts",
  (s) => s.replaceAll('from "../enums"', 'from "@/modules/types/enums/upload-status"'),
)
if (fs.existsSync("src/components/pages/AdminUploadVideoPage/types/index.ts")) {
  fs.unlinkSync("src/components/pages/AdminUploadVideoPage/types/index.ts")
}
moveFile(
  "src/components/pages/AdminUploadVideoPage/map.tsx",
  "src/modules/utils/admin-upload-video-map.tsx",
  (s) =>
    s
      .replaceAll('from "./enums"', 'from "@/modules/types/enums/upload-status"')
      .replaceAll('from "./types"', 'from "@/modules/types/admin-upload-video"'),
)
rewriteIn(
  ["src/components/pages/AdminUploadVideoPage"],
  [
    ['from "./enums"', 'from "@/modules/types/enums/upload-status"'],
    ['from "./types"', 'from "@/modules/types/admin-upload-video"'],
    ['from "./map"', 'from "@/modules/utils/admin-upload-video-map"'],
    ['from "../enums"', 'from "@/modules/types/enums/upload-status"'],
    ['from "../types"', 'from "@/modules/types/admin-upload-video"'],
    ['from "../../map"', 'from "@/modules/utils/admin-upload-video-map"'],
    ['from "../map"', 'from "@/modules/utils/admin-upload-video-map"'],
  ],
)
rmEmpty("src/components/pages/AdminUploadVideoPage/enums")
rmEmpty("src/components/pages/AdminUploadVideoPage/types")

// Admin MpegDash
moveFile(
  "src/components/pages/AdminMpegDashTestPage/types/admin-mpeg-dash-test.ts",
  "src/modules/types/admin-mpeg-dash-test.ts",
)
if (fs.existsSync("src/components/pages/AdminMpegDashTestPage/types/index.ts")) {
  fs.unlinkSync("src/components/pages/AdminMpegDashTestPage/types/index.ts")
}
moveFile(
  "src/components/pages/AdminMpegDashTestPage/constants/quick-test-urls.ts",
  "src/modules/utils/admin-mpeg-dash-quick-urls.ts",
  (s) =>
    s.replaceAll(
      'from "../types"',
      'from "@/modules/types/admin-mpeg-dash-test"',
    ),
)
if (fs.existsSync("src/components/pages/AdminMpegDashTestPage/constants/index.ts")) {
  fs.unlinkSync("src/components/pages/AdminMpegDashTestPage/constants/index.ts")
}
moveFile(
  "src/components/pages/AdminMpegDashTestPage/map.tsx",
  "src/modules/utils/admin-mpeg-dash-map.tsx",
  (s) =>
    s.replaceAll(
      'from "./types"',
      'from "@/modules/types/admin-mpeg-dash-test"',
    ),
)
rewriteIn(
  ["src/components/pages/AdminMpegDashTestPage"],
  [
    ['from "./constants"', 'from "@/modules/utils/admin-mpeg-dash-quick-urls"'],
    ['from "../constants"', 'from "@/modules/utils/admin-mpeg-dash-quick-urls"'],
    ['from "./types"', 'from "@/modules/types/admin-mpeg-dash-test"'],
    ['from "../types"', 'from "@/modules/types/admin-mpeg-dash-test"'],
    ['from "./map"', 'from "@/modules/utils/admin-mpeg-dash-map"'],
    ['from "../map"', 'from "@/modules/utils/admin-mpeg-dash-map"'],
  ],
)
rmEmpty("src/components/pages/AdminMpegDashTestPage/constants")
rmEmpty("src/components/pages/AdminMpegDashTestPage/types")

// BlogList Masthead scene
if (fs.existsSync("src/components/pages/BlogListPage/Masthead/scene.ts")) {
  moveFile(
    "src/components/pages/BlogListPage/Masthead/scene.ts",
    "src/modules/utils/blog-masthead-scene.ts",
  )
  rewriteIn(
    ["src/components/pages/BlogListPage"],
    [['from "./scene"', 'from "@/modules/utils/blog-masthead-scene"']],
  )
}

console.log("batch3 done")

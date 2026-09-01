import fs from "fs"
import path from "path"

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
}

function moveFile(from, to, transform) {
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
  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir)
    console.log("rmdir", dir)
  }
}

// ---- CourseDetail ----
moveFile(
  "src/components/pages/CourseDetailPage/types.ts",
  "src/modules/types/course-detail.ts",
)
moveFile(
  "src/components/pages/CourseDetailPage/constants.ts",
  "src/modules/utils/course-detail.ts",
)
moveFile(
  "src/components/pages/CourseDetailPage/hooks/useCourseEnrollment.ts",
  "src/hooks/useCourseEnrollment.ts",
)
moveFile(
  "src/components/pages/CourseDetailPage/hooks/usePricingRows.ts",
  "src/hooks/usePricingRows.ts",
  (s) =>
    s.replaceAll(
      'from "@/components/pages/CourseDetailPage/types"',
      'from "@/modules/types/course-detail"',
    ),
)

rewriteIn(
  [
    "src/components/pages/CourseDetailPage",
    "src/hooks",
  ],
  [
    ['from "../hooks/usePricingRows"', 'from "@/hooks/usePricingRows"'],
    ['from "../hooks/useCourseEnrollment"', 'from "@/hooks/useCourseEnrollment"'],
    ['from "../constants"', 'from "@/modules/utils/course-detail"'],
    ['from "../../constants"', 'from "@/modules/utils/course-detail"'],
    ['from "@/components/pages/CourseDetailPage/types"', 'from "@/modules/types/course-detail"'],
    ['from "../types"', 'from "@/modules/types/course-detail"'], // careful — only CourseDetail dirs
  ],
)

// Fix PhaseRow which imported PHASE_LABEL_KEY from constants and CoursePriceRow from types in one block
{
  const f = "src/components/pages/CourseDetailPage/CoursePricingRail/PhaseRow/index.tsx"
  let s = fs.readFileSync(f, "utf8")
  s = s.replace(
    /import \{\s*PHASE_LABEL_KEY,\s*\}\s*from ["'][^"']+["']/,
    'import {\n    PHASE_LABEL_KEY,\n} from "@/modules/utils/course-detail"',
  )
  // CoursePriceRow already patched via types path
  fs.writeFileSync(f, s)
}

rmEmpty("src/components/pages/CourseDetailPage/hooks")

// ---- Sepay ----
moveFile(
  "src/components/pages/SepayCheckoutPage/types/sepay-checkout.ts",
  "src/modules/types/sepay-checkout.ts",
)
moveFile(
  "src/components/pages/SepayCheckoutPage/utils/parse-bank-details.ts",
  "src/modules/utils/parse-bank-details.ts",
  (s) => s.replaceAll('from "../types"', 'from "@/modules/types/sepay-checkout"'),
)
// remove barrel files
for (const f of [
  "src/components/pages/SepayCheckoutPage/types/index.ts",
  "src/components/pages/SepayCheckoutPage/utils/index.ts",
]) {
  if (fs.existsSync(f)) fs.unlinkSync(f)
}
rewriteIn(
  ["src/components/pages/SepayCheckoutPage"],
  [
    ['from "../types"', 'from "@/modules/types/sepay-checkout"'],
    ['from "../utils"', 'from "@/modules/utils/parse-bank-details"'],
  ],
)
rmEmpty("src/components/pages/SepayCheckoutPage/types")
rmEmpty("src/components/pages/SepayCheckoutPage/utils")

// ---- Oauth ----
moveFile(
  "src/components/pages/OauthRedirectPage/enums/oauth-action.ts",
  "src/modules/types/enums/oauth-action.ts",
)
moveFile(
  "src/components/pages/OauthRedirectPage/map.ts",
  "src/modules/utils/oauth-action-message.ts",
  (s) => s.replaceAll('from "./enums"', 'from "@/modules/types/enums/oauth-action"'),
)
for (const f of ["src/components/pages/OauthRedirectPage/enums/index.ts"]) {
  if (fs.existsSync(f)) fs.unlinkSync(f)
}
rewriteIn(
  ["src/components/pages/OauthRedirectPage", "src/app"],
  [
    ['from "./enums"', 'from "@/modules/types/enums/oauth-action"'],
    ['from "./map"', 'from "@/modules/utils/oauth-action-message"'],
    [
      'from "@/components/pages/OauthRedirectPage/enums/oauth-action"',
      'from "@/modules/types/enums/oauth-action"',
    ],
    ['export * from "./enums"', 'export { OauthAction } from "@/modules/types/enums/oauth-action"'],
  ],
)
rmEmpty("src/components/pages/OauthRedirectPage/enums")

// ---- Architecture pure helpers + hooks ----
moveFile(
  "src/components/pages/ArchitecturePage/metricsFormat.ts",
  "src/modules/utils/architecture-metrics.ts",
)
moveFile(
  "src/components/pages/ArchitecturePage/constants.ts",
  "src/modules/utils/architecture-catalog.ts",
)
moveFile(
  "src/components/pages/ArchitecturePage/modules.ts",
  "src/modules/utils/architecture-modules.ts",
)
moveFile(
  "src/components/pages/ArchitecturePage/hooks/useSystemHealthPoll.ts",
  "src/hooks/useSystemHealthPoll.ts",
  (s) =>
    s.replaceAll(
      'from "../constants"',
      'from "@/modules/utils/architecture-catalog"',
    ),
)
moveFile(
  "src/components/pages/ArchitecturePage/hooks/useArchitectureNode.ts",
  "src/hooks/useArchitectureNode.ts",
  (s) =>
    s
      .replaceAll('from "../constants"', 'from "@/modules/utils/architecture-catalog"')
      .replaceAll('from "../modules"', 'from "@/modules/utils/architecture-modules"'),
)
moveFile(
  "src/components/pages/ArchitecturePage/statusVisual.tsx",
  "src/modules/utils/architecture-status-visual.tsx",
  (s) =>
    s.replaceAll(
      'from "./hooks/useSystemHealthPoll"',
      'from "@/hooks/useSystemHealthPoll"',
    ),
)
moveFile(
  "src/components/pages/ArchitecturePage/ArchitectureMap/scene.ts",
  "src/modules/utils/architecture-live-scene.ts",
  (s) =>
    s
      .replaceAll('from "../hooks/useSystemHealthPoll"', 'from "@/hooks/useSystemHealthPoll"')
      .replaceAll('from "../constants"', 'from "@/modules/utils/architecture-catalog"')
      .replaceAll('from "../modules"', 'from "@/modules/utils/architecture-modules"'),
)
moveFile(
  "src/components/pages/ArchitecturePage/ArchitectureMap/future-scene.ts",
  "src/modules/utils/architecture-future-scene.ts",
)

rewriteIn(
  ["src/components/pages/ArchitecturePage"],
  [
    ['from "./hooks/useArchitectureNode"', 'from "@/hooks/useArchitectureNode"'],
    ['from "./hooks/useSystemHealthPoll"', 'from "@/hooks/useSystemHealthPoll"'],
    ['from "../hooks/useSystemHealthPoll"', 'from "@/hooks/useSystemHealthPoll"'],
    ['from "../../hooks/useSystemHealthPoll"', 'from "@/hooks/useSystemHealthPoll"'],
    ['from "../constants"', 'from "@/modules/utils/architecture-catalog"'],
    ['from "../../constants"', 'from "@/modules/utils/architecture-catalog"'],
    ['from "../modules"', 'from "@/modules/utils/architecture-modules"'],
    ['from "../../modules"', 'from "@/modules/utils/architecture-modules"'],
    ['from "../metricsFormat"', 'from "@/modules/utils/architecture-metrics"'],
    ['from "../statusVisual"', 'from "@/modules/utils/architecture-status-visual"'],
    ['from "../../statusVisual"', 'from "@/modules/utils/architecture-status-visual"'],
    ['from "./scene"', 'from "@/modules/utils/architecture-live-scene"'],
    ['from "./future-scene"', 'from "@/modules/utils/architecture-future-scene"'],
  ],
)
rmEmpty("src/components/pages/ArchitecturePage/hooks")

console.log("batch2 done")

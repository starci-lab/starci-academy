/**
 * Summarize page-folder extras (unlocked) for SAFE extract candidates.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { join, basename } from "node:path"

const pages = JSON.parse(
    readFileSync(".artifacts/fe-refactor-audit/_safe-struct-targets.json", "utf8"),
)["starci-fe/page-folder-two-files-only"]

const LOCKED = [
    "MockInterviewSession",
    "QuizSession",
    "LearnLoopScroll",
    "ContentAiChat",
    "ArchitectureScene",
    "BlockAnatomy",
    "/nivo/",
    "nivoexpert",
]

function locked(f) {
    return LOCKED.some((L) => f.includes(L))
}

const byScreen = new Map()
for (const p of pages) {
    const f = p.file.replace(/\\/g, "/").replace(/^.*?(src\/)/, "$1")
    if (locked(f)) continue
    const m = f.match(/^(src\/components\/(?:pages|overlays\/(?:modals|drawers)|layouts)\/[^/]+)/)
    if (!m) continue
    if (!byScreen.has(m[1])) byScreen.set(m[1], new Set())
    const rest = f.slice(m[1].length + 1)
    const top = rest.split("/")[0]
    byScreen.get(m[1]).add(top)
}

const candidates = []
for (const [screen, tops] of [...byScreen.entries()].sort()) {
    const arr = [...tops]
    const pascal = arr.filter((t) => /^[A-Z]/.test(t))
    const helpers = arr.filter((t) => /^(hooks|types|utils|constants|enums|map\.tsx?|map\.ts)$/.test(t) || t.endsWith(".ts") || t.endsWith(".tsx"))
    // A SAFE extract: top-level PascalCase folder that already has ONLY index.tsx (or component+index)
    // and is not deeply entangled — we still prefer SKIP.
    for (const name of pascal) {
        const dir = join(screen, name)
        if (!existsSync(dir)) continue
        const entries = readdirSync(dir)
        const hasIndex = entries.includes("index.tsx") || entries.includes("index.ts")
        const hasComponent = entries.includes("component.tsx")
        const nested = entries.filter((e) => {
            try {
                return statSync(join(dir, e)).isDirectory()
            } catch {
                return false
            }
        })
        // mechanical only if: leaf folder (no nested dirs) with index only — still SKIP by default
        if (hasIndex && nested.length === 0 && entries.length <= 3) {
            candidates.push({
                screen,
                name,
                entries,
                hasComponent,
                note: "leaf folder — still SKIP unless already mirrored in blocks/",
            })
        }
    }
}

writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-struct-page-candidates.json",
    JSON.stringify({ screenCount: byScreen.size, leafCandidates: candidates.slice(0, 80), sampleScreens: [...byScreen.entries()].slice(0, 15).map(([s, t]) => ({ s, tops: [...t] })) }, null, 2),
)
console.log(JSON.stringify({ screenCount: byScreen.size, leafCandidateCount: candidates.length, sample: candidates.slice(0, 25) }, null, 2))

import fs from "node:fs"

const r1 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-2026-08-07-result.json", "utf8"),
)
const r2 = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_burn-explain-only-pass2-result.json", "utf8"),
)

function norm(f) {
    return f.replace(/\\/g, "/").replace(/^.*\/src\//, "src/")
}

const byFile = new Map()
for (const c of [...r1.changed, ...r2.changed]) {
    const f = norm(c.file)
    byFile.set(f, (byFile.get(f) || 0) + c.fileFixed)
}

const files = [...byFile.keys()].sort()
const explainsAdded = [...byFile.values()].reduce((a, b) => a + b, 0)

const report = {
    baselineTotal: 426,
    lockedSkipped: 71,
    unlockedTarget: 355,
    explainsAdded,
    filesChanged: files.length,
    files,
    skips: [
        "SectionCard — dynamic principle={ternary}; cannot attach one static explain without inventing/splitting",
        "FlashcardsPage/QuizSession/** — locked (71 locked sites total incl MockInterviewSession, LearnLoopScroll)",
        "MockInterviewSession, LearnLoopScroll — locked",
        "nivo/nivoexpert, src/resources — none in explain-only inventory",
        "Storybook — 0 explain-only hits in baseline",
    ],
}
fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_burn-explain-files-touched.json",
    JSON.stringify(report, null, 2),
)
console.log(JSON.stringify({ ...report, files: undefined, fileCount: files.length }, null, 2))
console.log(files.join("\n"))

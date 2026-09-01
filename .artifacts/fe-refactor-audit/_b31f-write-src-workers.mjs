import fs from "node:fs"

const scan = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31f-attempt-hold-scan.json", "utf8"),
)
const inv = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31f-inventory.json", "utf8"),
)

const srcWorkers = {
    "src-composites": "src-composites",
    "src-blocks-learn-a": "src-blocks-learn-a",
    "src-blocks-learn-b": "src-blocks-learn-b",
    "src-blocks-commerce-dashboard-navigation": "src-blocks-commerce-dashboard-navigation",
    "src-blocks-profile-remaining": "src-blocks-profile-remaining",
    "src-pages-learning": "src-pages-learning",
    "src-pages-remaining": "src-pages-remaining",
}

for (const [worker, manifestKey] of Object.entries(srcWorkers)) {
    const files = inv.manifests[manifestKey] ?? []
    const holds = scan.hold.filter((h) => h.worker === manifestKey)
    const attempts = scan.attempt.filter((a) => a.worker === manifestKey)
    const fixed = worker === "src-blocks-profile-remaining"
        ? ["src/components/blocks/profile/ProfileLockedState/index.tsx"]
        : []
    const held = holds.map((h) => ({
        file: h.file,
        frag: h.frag,
        reason: h.holdReason,
    }))
    // ProfileLockedState was attempt and fixed — remove from held if present
    const heldFiltered = held.filter((h) => !fixed.includes(h.file))
    const artifact = {
        worker,
        status: "done",
        fixed,
        held: heldFiltered,
        findingsBefore: files.reduce((s, f) => {
            const row = [...scan.attempt, ...scan.hold].find((r) => r.file === f)
            return s + (row?.frag ?? 0)
        }, 0),
        findingsFixed: fixed.length === 0 ? 0 : 1,
        findingsHeld: heldFiltered.reduce((s, h) => s + h.frag, 0),
        note: fixed.length
            ? "Only ProfileLockedState was fragment-only; remaining files held for unrelated ESLint debt under zero-warn ratchet."
            : "All files held: zero-warn ratchet — unrelated debt cannot close with frame-items contract alone.",
        twinParity: "SB twins may be fixed while src remains held when src has other debt.",
    }
    fs.writeFileSync(
        `.artifacts/fe-refactor-audit/2026-08-09-b31f-worker-${worker}.json`,
        `${JSON.stringify(artifact, null, 2)}\n`,
    )
    console.log(worker, "fixed", fixed.length, "held", heldFiltered.length)
}

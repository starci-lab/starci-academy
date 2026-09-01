import fs from "node:fs"

const raw = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31f-eslint-raw.json", "utf8"),
)
const inv = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-09-b31f-inventory.json", "utf8"),
)

const root = "D:/Repositories/starci-academy/".toLowerCase()
const byFile = new Map()

for (const file of raw) {
    const abs = String(file.filePath).replaceAll("\\", "/")
    const lower = abs.toLowerCase()
    const rel = lower.startsWith(root) ? abs.slice(root.length) : abs
    const messages = file.messages ?? []
    const frag = messages.filter((m) => m.ruleId === "starci-fe/no-frame-fragment-item")
    const other = messages.filter((m) => m.ruleId !== "starci-fe/no-frame-fragment-item")
    if (frag.length === 0 && other.length === 0) continue
    byFile.set(rel.replaceAll("\\", "/"), {
        file: rel.replaceAll("\\", "/"),
        frag: frag.length,
        other: other.length,
        otherRules: [...new Set(other.map((m) => m.ruleId))],
        attempt: other.length === 0 && frag.length > 0,
        holdReason: other.length > 0
            ? `other-debt:${other.length} (${[...new Set(other.map((m) => m.ruleId))].slice(0, 4).join(",")})`
            : null,
    })
}

const attempt = []
const hold = []
for (const [name, files] of Object.entries(inv.manifests)) {
    for (const file of files) {
        const row = byFile.get(file) ?? { file, frag: 0, other: 0, attempt: false, holdReason: "missing-from-raw" }
        const entry = { worker: name, ...row }
        if (row.attempt) attempt.push(entry)
        else hold.push(entry)
    }
}

const scan = {
    batch: "31f",
    date: "2026-08-09",
    attemptCount: attempt.length,
    holdCount: hold.length,
    attemptFindings: attempt.reduce((s, r) => s + r.frag, 0),
    holdFindings: hold.reduce((s, r) => s + r.frag, 0),
    attempt,
    hold,
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/2026-08-09-b31f-attempt-hold-scan.json",
    `${JSON.stringify(scan, null, 2)}\n`,
)

console.log(JSON.stringify({
    attemptFiles: scan.attemptCount,
    holdFiles: scan.holdCount,
    attemptFindings: scan.attemptFindings,
    holdFindings: scan.holdFindings,
    attemptByWorker: Object.fromEntries(
        [...new Set(attempt.map((a) => a.worker))].map((w) => [
            w,
            attempt.filter((a) => a.worker === w).length,
        ]),
    ),
}, null, 2))

import fs from "node:fs"

const m = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-08-manifest-pages-core.json", "utf8"),
)
const { batch, deferred } = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_pages-core-batch.json", "utf8"),
)
const LOCKED =
    /MockInterview|QuizSession|LearnLoop|flashcard-quiz|start-mock-interview|MockInterviewSession|\/quiz\//i

const byPath = Object.fromEntries(m.files.map((f) => [f.path, f]))

const skippedInBatch = [
    {
        path: "src/modules/utils/computations/pow-10.ts",
        rules: ["starci-fe/prefer-arrow-export"],
        reason: "overload-signatures-block-arrow-export",
    },
]

const changed = batch
    .filter((p) => p !== "src/modules/utils/computations/pow-10.ts")
    .map((p) => ({
        path: p,
        rules: byPath[p]?.safeRules || [],
        reason: "safe-authoring-burn",
    }))

const skippedDeferred = deferred.map((p) => ({
    path: p,
    rules: byPath[p]?.safeRules || [],
    reason: "deferred-batch-size",
}))

const holdEntries = []
for (const f of m.files) {
    if (LOCKED.test(f.path)) {
        holdEntries.push({
            path: f.path,
            rules: [...f.safeRules, ...f.holdRules],
            reason: "locked-MockInterview-Quiz-LearnLoop-path",
        })
        continue
    }
    if (f.holdRules.length) {
        holdEntries.push({
            path: f.path,
            rules: f.holdRules,
            reason: f.holdRules.includes("starci-fe/page-folder-two-files-only")
                ? "hold-page-folder-two-files-only-and-or-raw-cn-heroui-piles"
                : "hold-non-safe-rules",
        })
    }
}

const status = {
    partition: "pages-core",
    generatedAt: new Date().toISOString(),
    changed,
    skipped: [...skippedInBatch, ...skippedDeferred],
    holds: holdEntries,
    verification: {
        eslintQuietChanged: "pass",
        eslintSafeRemainingInBatch: {
            "src/modules/utils/computations/pow-10.ts": ["starci-fe/prefer-arrow-export"],
        },
        tscNoEmit:
            "preexisting-fail:src/components/blocks/marketing/MicroservicesScene/index.tsx(TS1382); no errors in pages-core changed files",
        storybookTwinsInManifest: 0,
    },
    regressions: [
        {
            path: "src/app/[locale]/error.tsx",
            note: "pass1 arrow conversion briefly corrupted default export; repaired manually to ErrorBoundaryProps + arrow const",
            resolved: true,
        },
    ],
    counts: {
        manifestFiles: m.files.length,
        changed: changed.length,
        skipped: skippedInBatch.length + skippedDeferred.length,
        holds: holdEntries.length,
    },
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/2026-08-08-worker-pages-core.json",
    JSON.stringify(status, null, 2),
)
console.log(JSON.stringify(status.counts, null, 2))

/**
 * Apply safe export-matches-folder aliases:
 * - Skeleton/* members: export { SkeletonX as FolderName }
 * - Compound namespaces: export const Folder = { ...parts }
 * - Single rename aliases: export { LongName as Folder }
 * Does not rename public symbols; only adds folder-matching export.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { resolve, dirname, basename } from "node:path"

const ROOT = process.cwd()
const debt = JSON.parse(
    readFileSync(resolve(ROOT, ".artifacts/fe-refactor-audit/_skeleton-folder-debt.json"), "utf8"),
)

const files = debt["starci-fe/export-matches-folder"].unlocked.map((x) => x.file)

function folderName(file) {
    const m = file.replace(/\\/g, "/").match(/\/([A-Z][A-Za-z0-9]*)\/index\.tsx?$/)
    return m?.[1] ?? null
}

function alreadyExports(src, name) {
    // crude: named export of exact identifier
    const re = new RegExp(
        String.raw`export\s+(?:const|function|class|type|interface|enum)\s+${name}\b|export\s*\{[^}]*\b${name}\b`,
    )
    return re.test(src)
}

const results = { patched: [], skipped: [], hard: [] }

for (const file of files) {
    const abs = resolve(ROOT, file)
    if (!existsSync(abs)) {
        results.hard.push({ file, reason: "missing" })
        continue
    }
    const folder = folderName(file)
    if (!folder) {
        results.hard.push({ file, reason: "no-folder" })
        continue
    }
    let src = readFileSync(abs, "utf8")
    if (alreadyExports(src, folder)) {
        results.skipped.push({ file, reason: "already-exports" })
        continue
    }

    // Skeleton member folders: SkeletonButton in Button/ → alias Button
    if (file.includes("/blocks/skeleton/Skeleton/")) {
        const primary = [...src.matchAll(/export const (Skeleton[A-Za-z0-9]+)/g)].map((m) => m[1])
        if (primary.length === 1) {
            const alias = `\n/** Folder-matching alias (export-matches-folder) — keep \`${primary[0]}\` as the public name. */\nexport { ${primary[0]} as ${folder} }\n`
            if (!src.endsWith("\n")) src += "\n"
            src += alias
            writeFileSync(abs, src)
            results.patched.push({ file, kind: "skeleton-alias", alias: `${primary[0]} as ${folder}` })
            continue
        }
        results.hard.push({ file, reason: `skeleton-primary-count=${primary.length}` })
        continue
    }

    // GlobalSearch / Admin headers: LongName → Folder
    const longAliases = {
        "src/components/overlays/modals/GlobalSearchModal/Content/Block/index.tsx": "GlobalSearchContentBlock",
        "src/components/overlays/modals/GlobalSearchModal/Content/Empty/index.tsx": "GlobalSearchEmpty",
        "src/components/overlays/modals/GlobalSearchModal/Content/index.tsx": "GlobalSearchContent",
        "src/components/pages/AdminMpegDashTestPage/Header/index.tsx": "AdminMpegDashTestHeader",
        "src/components/pages/AdminUploadVideoPage/Header/index.tsx": "AdminUploadVideoHeader",
    }
    if (longAliases[file]) {
        const from = longAliases[file]
        const alias = `\n/** Folder-matching alias (export-matches-folder) — keep \`${from}\` as the public name. */\nexport { ${from} as ${folder} }\n`
        if (!src.endsWith("\n")) src += "\n"
        src += alias
        writeFileSync(abs, src)
        results.patched.push({ file, kind: "long-alias", alias: `${from} as ${folder}` })
        continue
    }

    // BlockRegistry: registry consts — hard (not a component)
    if (file.includes("BlockRegistry")) {
        results.hard.push({ file, reason: "registry-consts-not-component" })
        continue
    }

    // Compound namespace folders: build object from exported members
    const compoundPlans = {
        "src/components/atoms/data/Table/index.tsx": null, // derive
        // Values must be LOCAL bindings (not `export { X as Y }` aliases alone).
        "src/components/atoms/display/Progress/index.tsx": {
            Bar: "ProgressBar",
            Circle: "ProgressCircle",
            Gauge: "Meter",
        },
        "src/components/atoms/feedback/AlertDialog/index.tsx": null,
        "src/components/atoms/forms/ListBox/index.tsx": null,
        "src/components/atoms/forms/Select/index.tsx": null,
        "src/components/atoms/navigation/Link/index.tsx": {
            Back: "LinkBack",
            SeeMore: "LinkSeeMore",
        },
        "src/components/atoms/overlay/Drawer/index.tsx": null,
        "src/components/atoms/overlay/Modal/index.tsx": null,
        "src/components/composites/chips/Chip/index.tsx": {
            Enum: "EnumChip",
            Highlight: "HighlightChip",
            Removable: "RemovableToken",
        },
        "src/components/composites/data/KeyValue/index.tsx": {
            Row: "KeyValueRow",
            List: "KeyValueList",
        },
        "src/components/composites/layout/Page/index.tsx": {
            Header: "Header",
            BottomBar: "BottomBar",
        },
        "src/components/composites/lists/List/index.tsx": {
            Row: "Row",
            Labeled: "Labeled",
            Meta: "Meta",
            ToggleRow: "ToggleRow",
        },
    }

    if (!(file in compoundPlans)) {
        results.hard.push({ file, reason: "no-plan" })
        continue
    }

    let members = compoundPlans[file]
    if (!members) {
    // Derive from exports matching FolderPrefix*
        const prefix = folder
        const names = [
            ...src.matchAll(
                new RegExp(String.raw`export (?:const|function) (${prefix}[A-Za-z0-9]+)`, "g"),
            ),
        ].map((m) => m[1])
        // also `export { X as FolderY }`
        const aliased = [
            ...src.matchAll(new RegExp(String.raw`export\s*\{[^}]*\bas\s+(${prefix}[A-Za-z0-9]+)`, "g")),
        ].flatMap((m) => {
            const chunk = m[0]
            return [...chunk.matchAll(new RegExp(String.raw`\bas\s+(${prefix}[A-Za-z0-9]+)`, "g"))].map(
                (x) => x[1],
            )
        })
        const all = [...new Set([...names, ...aliased])].filter((n) => n !== folder && n !== `${folder}Props`)
        if (all.length === 0) {
            results.hard.push({ file, reason: "no-members-derived" })
            continue
        }
        members = Object.fromEntries(
            all.map((n) => {
                const key = n.startsWith(prefix) ? n.slice(prefix.length) || "Root" : n
                return [key || "Root", n]
            }),
        )
    }

    const entries = Object.entries(members)
        .map(([k, v]) => `    ${k}: ${v},`)
        .join("\n")
    const block = `\n/** Folder-matching compound namespace (export-matches-folder). Existing named exports stay public. */\nexport const ${folder} = {\n${entries}\n} as const\n`
    if (!src.endsWith("\n")) src += "\n"
    src += block
    writeFileSync(abs, src)
    results.patched.push({ file, kind: "compound", members })
}

writeFileSync(
    resolve(ROOT, ".artifacts/fe-refactor-audit/_export-matches-result.json"),
    JSON.stringify(results, null, 2),
)
console.log(JSON.stringify({ patched: results.patched.length, skipped: results.skipped.length, hard: results.hard.length }, null, 2))
console.log("hard:", results.hard)

/**
 * Apply SAFE skeleton heroui→house bar swaps for product files
 * (excludes blocks/skeleton/** wrappers).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const classify = JSON.parse(
    fs.readFileSync(
        path.join(ROOT, ".artifacts/fe-refactor-audit/_overlap-dropin-classify.json"),
        "utf8",
    ),
)

const HOUSE = "@/components/blocks/skeleton/Skeleton"
const results = { changed: [], skipped: [], errors: [] }

for (const entry of classify.skeletonSafe) {
    const file = entry.file
    if (file.includes("blocks/skeleton/")) {
        results.skipped.push({ file, reason: "house-wrapper" })
        continue
    }
    if (!fs.existsSync(file)) {
        results.skipped.push({ file, reason: "missing" })
        continue
    }
    let src = fs.readFileSync(file, "utf8")
    const before = src

    // Already imports house Skeleton?
    if (src.includes(`from "${HOUSE}"`) || src.includes(`from '${HOUSE}'`)) {
        // still may have HeroSkeleton from heroui
    }

    // Case 1: `import { Skeleton as HeroSkeleton } from "@heroui/react"`
    if (/import\s*\{\s*Skeleton\s+as\s+HeroSkeleton\s*\}\s*from\s*["']@heroui\/react["']/.test(src)) {
        src = src.replace(
            /import\s*\{\s*Skeleton\s+as\s+HeroSkeleton\s*\}\s*from\s*["']@heroui\/react["']\s*;?/,
            `import { Skeleton } from "${HOUSE}"`,
        )
        src = src.replace(/\bHeroSkeleton\b/g, "Skeleton")
    }
    // Case 2: `import { cn, Skeleton as HeroSkeleton } from "@heroui/react"`
    else if (
        /import\s*\{([^}]*)\}\s*from\s*["']@heroui\/react["']/.test(src) &&
        /Skeleton\s+as\s+HeroSkeleton/.test(src)
    ) {
        const m = src.match(/import\s*\{([^}]*)\}\s*from\s*["']@heroui\/react["']/)
        if (m) {
            const names = m[1]
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .filter((s) => !/Skeleton\s+as\s+HeroSkeleton/.test(s) && s !== "Skeleton")
            if (names.length === 0) {
                src = src.replace(
                    /import\s*\{[^}]*\}\s*from\s*["']@heroui\/react["']\s*;?/,
                    `import { Skeleton } from "${HOUSE}"`,
                )
            } else {
                src = src.replace(
                    /import\s*\{[^}]*\}\s*from\s*["']@heroui\/react["']\s*;?/,
                    `import { ${names.join(", ")} } from "@heroui/react"\nimport { Skeleton } from "${HOUSE}"`,
                )
            }
            src = src.replace(/\bHeroSkeleton\b/g, "Skeleton")
        }
    }
    // Case 3: bare `Skeleton` from heroui (not aliased)
    else if (/import\s*\{([^}]*)\}\s*from\s*["']@heroui\/react["']/.test(src)) {
        const m = src.match(/import\s*\{([^}]*)\}\s*from\s*["']@heroui\/react["']/)
        const names = m[1]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        if (names.some((n) => n === "Skeleton" || /^Skeleton\s+as\s+/.test(n))) {
            const rest = names.filter((n) => n !== "Skeleton" && !/^Skeleton\s+as\s+/.test(n))
            const alias = names.find((n) => /^Skeleton\s+as\s+/.test(n))
            const localName = alias ? alias.split(/\s+as\s+/)[1].trim() : "Skeleton"
            if (rest.length === 0) {
                src = src.replace(
                    /import\s*\{[^}]*\}\s*from\s*["']@heroui\/react["']\s*;?/,
                    `import { Skeleton } from "${HOUSE}"`,
                )
            } else {
                src = src.replace(
                    /import\s*\{[^}]*\}\s*from\s*["']@heroui\/react["']\s*;?/,
                    `import { ${rest.join(", ")} } from "@heroui/react"\nimport { Skeleton } from "${HOUSE}"`,
                )
            }
            if (localName !== "Skeleton") {
                src = src.replace(new RegExp(`\\b${localName}\\b`, "g"), "Skeleton")
            }
        } else {
            results.skipped.push({ file, reason: "no-skeleton-import" })
            continue
        }
    } else {
        results.skipped.push({ file, reason: "no-heroui-import" })
        continue
    }

    // If we still have heroui import that's empty or only whitespace — cleaned above
    // Deduplicate house Skeleton import if doubled
    const houseImport = `import { Skeleton } from "${HOUSE}"`
    const count = (src.match(new RegExp(houseImport.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || [])
        .length
    if (count > 1) {
        let seen = false
        src = src
            .split("\n")
            .filter((line) => {
                if (line.trim() === houseImport) {
                    if (seen) return false
                    seen = true
                }
                return true
            })
            .join("\n")
    }

    if (src === before) {
        results.skipped.push({ file, reason: "no-change" })
        continue
    }
    // Don't leave empty heroui import
    src = src.replace(/import\s*\{\s*\}\s*from\s*["']@heroui\/react["']\s*;?\n?/g, "")
    fs.writeFileSync(file, src)
    results.changed.push(file)
}

fs.writeFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/_overlap-skeleton-apply.json"),
    JSON.stringify(results, null, 2),
)
console.log("changed", results.changed.length)
results.changed.forEach((f) => console.log(" ", f))
console.log("skipped", results.skipped.length)
results.skipped.forEach((s) => console.log(" ", s.reason, s.file))

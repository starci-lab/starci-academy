/**
 * Scan unlocked inline-skeleton-branch hits and classify fixability.
 * Prints a short plan; does not edit.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const ROOT = process.cwd()
const debt = JSON.parse(
    readFileSync(resolve(ROOT, ".artifacts/fe-refactor-audit/_skeleton-folder-debt.json"), "utf8"),
)

for (const e of debt["starci-fe/no-inline-skeleton-branch"].unlocked) {
    const src = readFileSync(resolve(ROOT, e.file), "utf8")
    const lines = src.split(/\r?\n/)
    const line = lines[e.line - 1] || ""
    const around = lines.slice(Math.max(0, e.line - 2), e.line + 3).join("\n")
    // crude: look for same-component opportunity
    const hasTypographyBoth = /Typography/.test(around) && (around.match(/Typography/g) || []).length >= 2
    const hasProgressMeter = /ProgressMeter/.test(around) && /Skeleton|HeroSkeleton/.test(around)
    const hasLink = /LinkSeeMore|LinkBack/.test(around)
    const hasButton = /<Button/.test(around) && /Skeleton|HeroSkeleton|isSkeleton \?/.test(around)
    const tag = hasProgressMeter
        ? "progress-meter"
        : hasLink
            ? "link"
            : hasTypographyBoth
                ? "typography-ish"
                : hasButton
                    ? "button-ish"
                    : "other"
    console.log(`${tag}\t${e.file}:${e.line}\t${line.trim().slice(0, 80)}`)
}

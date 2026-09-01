/**
 * BATCH 24 — fixup after classNames door strip.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const log = JSON.parse(
  fs.readFileSync(path.join(ROOT, ".artifacts/fe-refactor-audit/2026-08-09-b24-apply-log.json"), "utf8"),
)

function fixup(source) {
  let s = source
  const before = s

  // Empty attribute remnants
  s = s.replace(/\s*classNames=\{\s*\}/g, "")
  s = s.replace(/\s*className=\{\s*\}/g, "")

  // cn(classNames) alone → remove cn wrapper usage on className props
  s = s.replace(/className=\{cn\(classNames\)\}/g, "")
  s = s.replace(/className=\{cn\(\s*classNames\s*\)\}/g, "")

  // cn("foo", classNames) already stripped comma form; handle leftover identifier
  s = s.replace(/cn\(([^)]*?),\s*classNames\s*\)/g, "cn($1)")
  s = s.replace(/cn\(\s*classNames\s*,\s*([^)]*?)\)/g, "cn($1)")
  s = s.replace(/cn\(\s*classNames\s*\)/g, 'cn("")')

  // Bare , classNames in cn already done

  // TriggerSkeleton / FieldSkeleton still destructuring classNames
  s = s.replace(
    /export const TriggerSkeleton = \(\{ classNames \}: TriggerSkeletonProps\) => \(\s*\n\s*<HeroSkeleton className=\{cn\("h-9 w-full rounded-xl", classNames\)\} \/>/,
    'export const TriggerSkeleton = (_props: TriggerSkeletonProps) => (\n    <HeroSkeleton className={cn("h-9 w-full rounded-xl")} />',
  )
  s = s.replace(
    /export const FieldSkeleton = \(\{ heightCls = "h-9", classNames \}: FieldSkeletonProps\) => \(\s*\n\s*<HeroSkeleton data-tier="atom" data-component="FieldSkeleton" className=\{cn\("w-full rounded-xl", heightCls, classNames\)\} \/>/,
    'export const FieldSkeleton = ({ heightCls = "h-9" }: FieldSkeletonProps) => (\n    <HeroSkeleton data-tier="atom" data-component="FieldSkeleton" className={cn("w-full rounded-xl", heightCls)} />',
  )

  // Generic: function params still listing classNames when prop removed from type
  // Remove from single-line destructure lists carefully
  s = s.replace(/,\s*classNames\b/g, "")
  s = s.replace(/\bclassNames,\s*/g, "")

  // Toast / ConfirmDialog patterns: className={cn(x, classNames)} after comma strip may be fine;
  // leftover bare classNames identifier in expressions
  // className={cn("…", classNames)} → already
  // template: ${classNames} unlikely

  // Fix cn("") noop - prefer removing className if empty cn
  s = s.replace(/\s*className=\{cn\(""\)\}/g, "")

  return { next: s, changed: s !== before }
}

const results = { fixed: [], skipped: [] }
for (const row of log.changed) {
  const abs = path.join(ROOT, row.file)
  if (!fs.existsSync(abs)) continue
  const src = fs.readFileSync(abs, "utf8")
  // Also always fix TriggerSkeleton / FieldSkeleton even if not in log as changed content
  const { next, changed } = fixup(src)
  if (changed) {
    fs.writeFileSync(abs, next)
    results.fixed.push(row.file)
  } else results.skipped.push(row.file)
}

// Explicitly fix TriggerSkeleton files
for (const rel of [
  ".storybook/components/atoms/forms/_select/TriggerSkeleton.tsx",
  "src/components/atoms/forms/_select/TriggerSkeleton.tsx",
]) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) continue
  let s = fs.readFileSync(abs, "utf8")
  const next = s
    .replace(/\{ classNames \}/g, "{}")
    .replace(/,\s*classNames/g, "")
    .replace(/classNames/g, "")
  // careful - above may over-strip. rewrite file properly:
  const rewritten = `import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { TriggerSkeletonProps } from "./types"

/** Trigger-box shimmer owned by the select atoms. */
export const TriggerSkeleton = (_props: TriggerSkeletonProps = {}) => (
    <HeroSkeleton className={cn("h-9 w-full rounded-xl")} />
)
`
  fs.writeFileSync(abs, rewritten)
  results.fixed.push(rel)
}

// FieldSkeleton
for (const rel of [
  ".storybook/components/atoms/forms/_input/FieldSkeleton.tsx",
  "src/components/atoms/forms/_input/FieldSkeleton.tsx",
]) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) continue
  fs.writeFileSync(
    abs,
    `import { Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { FieldSkeletonProps } from "./types"

/** Field-box shimmer owned by input atoms. */
export const FieldSkeleton = ({ heightCls = "h-9" }: FieldSkeletonProps) => (
    <HeroSkeleton data-tier="atom" data-component="FieldSkeleton" className={cn("w-full rounded-xl", heightCls)} />
)
`,
  )
  results.fixed.push(rel)
}

fs.writeFileSync(
  path.join(ROOT, ".artifacts/fe-refactor-audit/2026-08-09-b24-fixup-log.json"),
  JSON.stringify(results, null, 2),
)
console.log("fixed", results.fixed.length)

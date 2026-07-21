#!/usr/bin/env node
/**
 * Story-coverage gate: every canonical BLOCK (`src/components/blocks/<X>/index.tsx`)
 * must have a story at the mirror path (`.storybook/stories/blocks/<X>/*.stories.tsx`).
 * Features are compositions — they do NOT get stories.
 *
 *   node scripts/check-story-coverage.mjs         -> report (exit 1 if gaps)
 *   node scripts/check-story-coverage.mjs --json   -> machine-readable missing list
 *
 * PRIMITIVE_ALLOWLIST: stories that document HeroUI re-exports (no local index.tsx).
 */
import { readdirSync, existsSync, statSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const BLOCKS = join(ROOT, "src/components/blocks")
const STORIES = join(ROOT, ".storybook/stories/blocks")

// Story dirs with no local block — they document HeroUI primitives. Explicit so
// the gate stays clean instead of flagging them as orphans forever.
const PRIMITIVE_ALLOWLIST = new Set([
    "buttons/Button", "chips/Chip", "form/Input", "form/RadioGroup", "form/Switch",
    "form/TextField", "form/CVSubmissionForm", "layout/ScrollShadow", "lists/ListBox",
])

/** All `<cat>/<Name>` dirs that hold an `index.tsx` under a root. */
const collect = (base) => {
    const out = []
    if (!existsSync(base)) return out
    for (const cat of readdirSync(base)) {
        const catDir = join(base, cat)
        if (!statSync(catDir).isDirectory()) continue
        for (const name of readdirSync(catDir)) {
            const dir = join(catDir, name)
            if (statSync(dir).isDirectory() && existsSync(join(dir, "index.tsx"))) {
                out.push(`${cat}/${name}`)
            }
        }
    }
    return out
}

/** Does a mirror story folder hold at least one *.stories.tsx? */
const hasStory = (rel) => {
    const dir = join(STORIES, rel)
    return existsSync(dir) && readdirSync(dir).some((f) => f.endsWith(".stories.tsx"))
}

const blocks = collect(BLOCKS).sort()
const missing = blocks.filter((b) => !hasStory(b) && !PRIMITIVE_ALLOWLIST.has(b))

if (process.argv.includes("--json")) {
    process.stdout.write(JSON.stringify(missing))
    process.exit(0)
}

const covered = blocks.length - missing.length - blocks.filter((b) => PRIMITIVE_ALLOWLIST.has(b)).length
console.log(`Blocks: ${blocks.length} | có story: ${covered} | primitive (allowlist): ${blocks.filter((b) => PRIMITIVE_ALLOWLIST.has(b)).length} | THIẾU: ${missing.length}`)
if (missing.length) {
    console.log("\nBlock thiếu story:")
    for (const m of missing) console.log("  ✗ " + m)
    process.exit(1)
}
console.log("\n✅ Mọi block đều có story.")

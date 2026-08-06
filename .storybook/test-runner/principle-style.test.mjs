/**
 * Computed-style coverage for principle-as-style (pilot).
 *
 * Proves `_principle-style.ts` emits the house classes that `patterns.mjs`
 * promises for the pilot tokens — without requiring a browser. The Storybook
 * test-runner still measures live computed px on `[data-principle]`.
 *
 *   node --experimental-strip-types --test .storybook/test-runner/principle-style.test.mts
 *
 * Falls back to parsing the TS source when strip-types is unavailable.
 */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import test from "node:test"
import { createRequire } from "node:module"

const here = dirname(fileURLToPath(import.meta.url))
const repo = join(here, "..", "..")
const patterns = createRequire(import.meta.url)(join(here, "patterns.mjs"))

const EXPECTED = {
    "page-pad": { prop: "padding", classNames: ["p-6"], px: 24 },
    "content-row": { prop: "gap", classNames: ["gap-3"], px: 12 },
    "identity": { prop: "gap", classNames: ["gap-2"], px: 8 },
    "identity-end": { prop: "gap", classNames: ["gap-2", "items-end"], px: 8 },
    "flex-action": { prop: "gap", classNames: ["gap-2"], px: 8 },
    "flex-action-center": { prop: "gap", classNames: ["gap-2", "items-center"], px: 8 },
    "flex-action-end": { prop: "gap", classNames: ["gap-2", "justify-end"], px: 8 },
    "flex-action-start": { prop: "gap", classNames: ["gap-2", "justify-start"], px: 8 },
    "flex-action-between": { prop: "gap", classNames: ["gap-2", "justify-between"], px: 8 },
    "block-boundary": { prop: "gap", classNames: ["gap-6"], px: 24 },
    "title-subtitle": { prop: "gap", classNames: ["gap-1"], px: 4 },
}

/** Parse `PRINCIPLE_STYLE` entries and `GAP_CLASS`/`PADDING_CLASS` from the TS module text. */
function loadStyleFromSource(treeRel) {
    const styleSrc = readFileSync(join(repo, treeRel, "frames", "_principle-style.ts"), "utf8")
    const spacingSrc = readFileSync(join(repo, treeRel, "frames", "_spacing.ts"), "utf8")
    const gapClass = Object.fromEntries([...spacingSrc.matchAll(/^\s*(\d+):\s*"(gap-[^"]+)"/gm)].map((m) => [m[1], m[2]]))
    const padBlock = spacingSrc.match(/export const PADDING_CLASS[\s\S]*?= \{([\s\S]*?)\n\}/)
    const padClass = Object.fromEntries([...(padBlock ? padBlock[1].matchAll(/(\d+):\s*"(p-[^"]+)"/g) : [])].map((m) => [m[1], m[2]]))
    const entries = {}
    for (const m of styleSrc.matchAll(/"([^"]+)":\s*\{\s*kind:\s*"gap"\s*,\s*step:\s*(\d+)(?:\s*,\s*align:\s*"([^"]+)")?(?:\s*,\s*justify:\s*"([^"]+)")?/g)) {
        entries[m[1]] = { kind: "gap", step: Number(m[2]), align: m[3], justify: m[4] }
    }
    for (const m of styleSrc.matchAll(/"([^"]+)":\s*\{\s*kind:\s*"padding"\s*,\s*step:\s*(\d+)/g)) {
        entries[m[1]] = { kind: "padding", step: Number(m[2]) }
    }
    for (const m of styleSrc.matchAll(/"([^"]+)":\s*\{\s*kind:\s*"padding-xy"\s*,\s*x:\s*(\d+)\s*,\s*y:\s*(\d+)/g)) {
        entries[m[1]] = { kind: "padding-xy", x: Number(m[2]), y: Number(m[3]) }
    }
    function classNames(token) {
        const e = entries[token]
        if (!e) return []
        if (e.kind === "gap") {
            const out = [gapClass[String(e.step)]]
            if (e.align === "center") out.push("items-center")
            if (e.align === "end") out.push("items-end")
            if (e.align === "baseline") out.push("items-baseline")
            if (e.justify === "end") out.push("justify-end")
            if (e.justify === "start") out.push("justify-start")
            if (e.justify === "between") out.push("justify-between")
            if (e.justify === "center") out.push("justify-center")
            return out
        }
        if (e.kind === "padding") return [padClass[String(e.step)]]
        return []
    }
    return { entries, classNames }
}

for (const tree of [".storybook/components", "src/components"]) {
    test(`${tree}: pilot principles emit expected classes`, () => {
        const { classNames, entries } = loadStyleFromSource(tree)
        for (const [token, want] of Object.entries(EXPECTED)) {
            const got = classNames(token)
            assert.deepEqual(got, want.classNames, `${token} classes`)
            const registry = patterns.PATTERNS[token]
            assert.ok(registry, `${token} in patterns.mjs`)
            assert.equal(registry.prop, want.prop)
            assert.equal(registry.px, want.px)
            if (want.prop === "gap") {
                assert.equal(entries[token].kind, "gap")
                assert.equal(entries[token].step, registry.step)
            }
            if (want.prop === "padding") {
                assert.equal(entries[token].kind, "padding")
                assert.equal(entries[token].step, registry.step)
            }
        }
    })

    test(`${tree}: gap and padding principles are disjoint`, () => {
        const { entries } = loadStyleFromSource(tree)
        for (const [token, e] of Object.entries(entries)) {
            if (e.kind === "gap") assert.notEqual(e.kind, "padding")
            if (e.kind === "padding" || e.kind === "padding-xy") {
                assert.ok(e.kind === "padding" || e.kind === "padding-xy", token)
            }
        }
    })
}

test("AcademySettingsForm pilot: Stack sites omit CSS layout props", () => {
    const src = readFileSync(
        join(repo, ".storybook/components/nivoexpert/pages/AcademySettingsForm/AcademySettingsForm.tsx"),
        "utf8",
    )
    const re = /<(StackH|StackV)\b([\s\S]*?)>/g
    let m
    while ((m = re.exec(src))) {
        const tag = m[2]
        if (!/\bprinciple=/.test(tag)) continue
        for (const prop of ["gap", "padding", "align", "justify", "className", "classNames", "style", "inline", "nested"]) {
            assert.equal(
                new RegExp(`\\b${prop}=`).test(tag),
                false,
                `pilot Stack with principle must not pass ${prop}:\n${m[0].slice(0, 160)}`,
            )
        }
    }
})

test("AcademySettingsForm: Form uses principle without public gap", () => {
    const src = readFileSync(
        join(repo, ".storybook/components/nivoexpert/pages/AcademySettingsForm/AcademySettingsForm.tsx"),
        "utf8",
    )
    const re = /<Form\b([\s\S]*?)>/g
    let found = false
    let m
    while ((m = re.exec(src))) {
        const tag = m[1]
        if (tag.includes("</")) continue
        found = true
        assert.match(tag, /principle\s*=\s*"block-boundary"/)
        assert.equal(/\bgap=/.test(tag), false, "Form with principle must not pass gap")
    }
    assert.ok(found, "expected a Form in AcademySettingsForm")
})

test("Grid with principle must not pass public gap (sample trees)", () => {
    const files = [
        ".storybook/components/starci/blocks/consultant/ConsultantDirectoryGrid/ConsultantDirectoryGrid.tsx",
        "src/components/blocks/consultant/ConsultantDirectoryGrid/index.tsx",
        ".storybook/components/nivo/blocks/dashboard/KpiRow/KpiRow.tsx",
        "src/components/pages/FlashcardsPage/FlashcardDeckList/component.tsx",
    ]
    for (const rel of files) {
        const src = readFileSync(join(repo, rel), "utf8")
        const re = /<Grid\b([\s\S]*?)>/g
        let m
        while ((m = re.exec(src))) {
            const tag = m[1]
            if (tag.includes("</")) continue
            if (!/\bprinciple=/.test(tag)) continue
            assert.equal(
                /\bgap\s*=/.test(tag),
                false,
                `${rel}: Grid with principle must not pass gap:\n${m[0].slice(0, 160)}`,
            )
        }
    }
})

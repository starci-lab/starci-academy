/**
 * Apply identity={{ tier, component }} to SAFE single-root files.
 * Storybook twin first when present; then src.
 */
import fs from "node:fs"

const classify = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-burn-identity-classify.json", "utf8"),
)

// AsyncContent.Base does NOT accept identity (only Empty/Error do) — hard-case those.
const safe = classify.safe.filter((s) => s.rootTag !== "AsyncContent")
const skippedAsync = classify.safe.filter((s) => s.rootTag === "AsyncContent")

function findStorybookTwin(srcFile) {
    const f = srcFile.replace(/\\/g, "/")
    const candidates = []

    if (f.startsWith("src/components/blocks/")) {
        const rest = f
            .replace("src/components/blocks/", "")
            .replace(/\/index\.tsx$/, "")
            .replace(/\/component\.tsx$/, "")
            .replace(/\.tsx$/, "")
        const parts = rest.split("/")
        const name = parts[parts.length - 1]
        const dir = parts.slice(0, -1).join("/")
        candidates.push(`.storybook/components/starci/blocks/${dir}/${name}/${name}.tsx`)
        candidates.push(`.storybook/components/starci/blocks/${dir}/${name}/index.tsx`)
        candidates.push(`.storybook/components/blocks/${dir}/${name}/${name}.tsx`)
    } else if (f.startsWith("src/components/pages/")) {
        const rest = f
            .replace("src/components/pages/", "")
            .replace(/\/index\.tsx$/, "")
            .replace(/\/component\.tsx$/, "")
            .replace(/\.tsx$/, "")
        const parts = rest.split("/")
        const name = parts[parts.length - 1]
        const dir = parts.slice(0, -1).join("/")
        candidates.push(`.storybook/components/starci/pages/${dir}/${name}/${name}.tsx`)
        candidates.push(`.storybook/components/starci/pages/${dir}/${name}/index.tsx`)
        if (!dir) {
            candidates.push(`.storybook/components/starci/pages/${name}/${name}.tsx`)
        }
    } else if (f.startsWith("src/components/layouts/")) {
        const rest = f
            .replace("src/components/layouts/", "")
            .replace(/\/index\.tsx$/, "")
            .replace(/\.tsx$/, "")
        const parts = rest.split("/")
        const name = parts[parts.length - 1]
        candidates.push(`.storybook/components/starci/layouts/${rest}/${name}.tsx`)
    } else if (f.startsWith("src/components/overlays/")) {
        const rest = f
            .replace("src/components/overlays/", "")
            .replace(/\/index\.tsx$/, "")
            .replace(/\/component\.tsx$/, "")
            .replace(/\.tsx$/, "")
        const parts = rest.split("/")
        const name = parts[parts.length - 1]
        candidates.push(`.storybook/components/starci/overlays/${rest}/${name}.tsx`)
        candidates.push(`.storybook/components/overlays/${rest}/${name}.tsx`)
    }

    return candidates.find((c) => fs.existsSync(c)) || null
}

/**
 * Insert identity on every return-root opening of rootTag that lacks identity.
 * Returns number of insertions.
 */
function applyIdentity(src, rootTag, tier, component) {
    if (/\bidentity=\{\{\s*tier:/.test(src) && src.includes(`component: "${component}"`)) {
    // already has this component's identity somewhere — still add on roots missing it
    }

    const identityLit = `identity={{ tier: "${tier}", component: "${component}" }}`
    let count = 0
    let out = ""
    let i = 0

    // Find `<RootTag` occurrences that are return roots: preceded by return (optional paren/comments)
    const tagRe = new RegExp(`<${rootTag}(?=[\\s/>])`, "g")
    const matches = []
    let m
    while ((m = tagRe.exec(src))) {
    // Look back ~80 chars for a return
        const look = src.slice(Math.max(0, m.index - 120), m.index)
        const isReturn =
      /return\s*(?:\(|)\s*(?:\/\*[\s\S]*?\*\/\s*)*(?:\/\/[^\n]*\n\s*)*$/.test(look) ||
      /return\s*$/.test(look.trimEnd()) ||
      // also: assigned const x = ( <Tag  used as sole return via variable — skip those
      false
        // Broader: if look ends with return...(optional junk)
        const isReturn2 = /return[\s\S]*$/.test(look) && !/;\s*$/.test(look.trim()) && (
            /return\s*\(\s*$/.test(look) ||
      /return\s*$/.test(look) ||
      /return\s*\(\s*(?:\/\/[^\n]*\n\s*)*$/.test(look) ||
      /return\s*\(\s*(?:\/\*[\s\S]*?\*\/\s*)*$/.test(look)
        )
        if (!isReturn2) continue

        // Opening tag slice until `>` at depth 0
        let j = m.index
        let depth = 0
        let inStr = null
        let end = -1
        for (; j < src.length; j++) {
            const ch = src[j]
            if (inStr) {
                if (ch === "\\") { j++; continue }
                if (ch === inStr) inStr = null
                continue
            }
            if (ch === "\"" || ch === "'" || ch === "`") { inStr = ch; continue }
            if (ch === "{") { depth++; continue }
            if (ch === "}") { depth = Math.max(0, depth - 1); continue }
            if (depth === 0 && ch === ">") { end = j; break }
        }
        if (end < 0) continue
        const opening = src.slice(m.index, end + 1)
        if (/\bidentity=/.test(opening)) continue
        matches.push({ at: m.index + ("<" + rootTag).length, openingStart: m.index })
    }

    // Apply from end
    let result = src
    for (const hit of matches.sort((a, b) => b.at - a.at)) {
    // Detect newline style after tag name
        const after = result.slice(hit.at, hit.at + 20)
        let insertion
        if (after.startsWith("\n")) {
            // multiline opening — indent like following attrs
            const lineStart = result.lastIndexOf("\n", hit.openingStart) + 1
            const baseIndent = result.slice(lineStart, hit.openingStart).match(/^\s*/)?.[0] ?? ""
            insertion = `\n${baseIndent}    ${identityLit}`
        } else if (after.startsWith(" ") || after.startsWith("/") || after.startsWith(">")) {
            insertion = ` ${identityLit}`
        } else {
            insertion = ` ${identityLit}`
        }
        result = result.slice(0, hit.at) + insertion + result.slice(hit.at)
        count++
    }
    return { src: result, count }
}

/** Cheap require-export-jsdoc: if exported const Foo lacks JSDoc immediately above, add one-liner. */
function maybeJsdoc(src, component) {
    // Only if `export const Component` or `export { Component }` with missing jsdoc on the const
    const re = new RegExp(`(?:^|\\n)(export const ${component}\\b)`)
    const m = src.match(re)
    if (!m) return { src, added: false }
    const idx = src.indexOf(m[1])
    const before = src.slice(Math.max(0, idx - 80), idx)
    if (/\/\*\*[\s\S]*\*\/\s*$/.test(before)) return { src, added: false }
    // Also check for comment ending just above
    const lineBefore = src.slice(0, idx).split("\n").slice(-3).join("\n")
    if (/\/\*\*/.test(lineBefore)) return { src, added: false }
    const jsdoc = `/** ${component} — sentence-tier root; identity lives on the root frame. */\n`
    return { src: src.slice(0, idx) + jsdoc + src.slice(idx), added: true }
}

const changed = []
const hardExtra = skippedAsync.map((s) => ({
    file: s.file,
    reason: "AsyncContent.Base-no-identity-prop",
}))
let totalInserts = 0
let jsdocAdded = 0
let twinsUpdated = 0

for (const item of safe) {
    const { file, tier, component, rootTag } = item
    const twin = findStorybookTwin(file)
    const targets = []
    if (twin) targets.push({ path: twin, isTwin: true })
    targets.push({ path: file, isTwin: false })

    for (const t of targets) {
        if (!fs.existsSync(t.path)) continue
        let src = fs.readFileSync(t.path, "utf8")
        // For twins, still use same tier/component names (src identity names)
        const applied = applyIdentity(src, rootTag, tier, component)
        if (applied.count === 0) {
            // twin may use different structure — skip silently
            if (!t.isTwin) {
                hardExtra.push({ file, reason: "no-insert-site", rootTag })
            }
            continue
        }
        src = applied.src
        const jd = maybeJsdoc(src, component)
        src = jd.src
        if (jd.added) jsdocAdded++
        fs.writeFileSync(t.path, src)
        totalInserts += applied.count
        changed.push(t.path)
        if (t.isTwin) twinsUpdated++
    }
}

const report = {
    before: 703,
    safeClassified: classify.safe.length,
    safeAppliedEligible: safe.length,
    inserts: totalInserts,
    filesChanged: [...new Set(changed)].length,
    twinsUpdated,
    jsdocAdded,
    hardFromClassify: classify.hard.length,
    hardExtra,
    changed: [...new Set(changed)].sort(),
    hardClassifyReasons: classify.hard.reduce((a, h) => {
        a[h.reason] = (a[h.reason] || 0) + 1
        return a
    }, {}),
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_safe-burn-identity-result.json",
    JSON.stringify({ ...report, hardAll: [...classify.hard, ...hardExtra] }, null, 2),
)
console.log(JSON.stringify({
    ...report,
    changedSample: report.changed.slice(0, 25),
    hardExtraCount: hardExtra.length,
}, null, 2))

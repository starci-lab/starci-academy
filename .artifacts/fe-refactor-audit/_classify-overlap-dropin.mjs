/**
 * Classify true drop-in heroui→house swaps (SAFE only).
 * Writes JSON for the burn pass.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const scan = JSON.parse(
    fs.readFileSync(
        path.join(ROOT, ".artifacts/fe-refactor-audit/_overlap-safe-scan.json"),
        "utf8",
    ),
)

const locked = (rel) =>
    /MockInterviewSession|QuizSession|LearnLoopScroll|ContentAiChat|ArchitectureScene|BlockAnatomy|nivoexpert\/|\/nivo\/|components\/nivo\/|\/resources\/|MiaMia|mia-mia|Mia-Mia/i.test(
        rel,
    )

function extractUsages(src, name) {
    // crude: opening tags for Name
    const re = new RegExp(`<${name}\\b([^>]*)(\\/?)>`, "g")
    const selfClosing = []
    const open = []
    let m
    while ((m = re.exec(src))) {
        const attrs = m[1]
        const sc = m[2] === "/"
        if (sc) selfClosing.push(attrs)
        else open.push(attrs)
    }
    // also count closing for open tags with children - find simple text children
    return { selfClosing, open }
}

function hasComplexChildren(src, name) {
    // Chip.Label, Button with nested elements, etc.
    if (src.includes(`${name}.`)) return true
    // multi-line JSX children with tags
    const re = new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, "g")
    let m
    while ((m = re.exec(src))) {
        const body = m[1]
        if (/<[A-Za-z]/.test(body)) return true
    }
    return false
}

const spinnerSafe = []
const chipSafe = []
const skeletonSafe = []
const typographyHard = []
const buttonHard = []
const other = []

for (const c of scan.heroui.candidate) {
    if (locked(c.file)) continue
    if (!fs.existsSync(c.file)) continue
    const src = fs.readFileSync(c.file, "utf8")
    const sym = c.symbols

    if (sym.length === 1 && sym[0] === "Spinner") {
        // house Spinner: size, tone (not color), label (not aria-label alone ok), classNames not className
        const usages = [...src.matchAll(/<Spinner\b([^>]*)\/?>/g)].map((m) => m[0])
        const issues = []
        for (const u of usages) {
            if (/\bcolor=/.test(u) && !/\btone=/.test(u)) {
                // color can map to tone if value is known
                const cm = u.match(/color=["']([^"']+)["']/)
                if (cm && !["accent", "current", "danger", "success", "warning"].includes(cm[1])) {
                    issues.push(`bad-color:${cm[1]}`)
                }
            }
            if (/\bclassName=/.test(u)) issues.push("className")
            if (/<\/Spinner>/.test(src) && src.includes("<Spinner") && /<Spinner[^>]*>[^<]+/.test(src)) {
                // children?
            }
        }
        if (hasComplexChildren(src, "Spinner")) issues.push("children")
        if (issues.length === 0) spinnerSafe.push({ file: c.file, usages })
        else other.push({ file: c.file, kind: "spinner-issues", issues, usages })
        continue
    }

    if (sym.length === 1 && sym[0] === "Chip") {
        if (hasComplexChildren(src, "Chip") || src.includes("Chip.Label")) {
            other.push({ file: c.file, kind: "chip-complex" })
            continue
        }
        // require only color/size/variant/className attrs we can map
        const opens = [...src.matchAll(/<Chip\b([^>]*)>([\s\S]*?)<\/Chip>/g)]
        let ok = true
        const notes = []
        for (const o of opens) {
            const attrs = o[1]
            const body = o[2].trim()
            if (/<[A-Za-z]/.test(body)) {
                ok = false
                notes.push("jsx-children")
            }
            if (/\bonClose=|\bavatar=|\bstartContent=|\bendContent=/.test(attrs)) {
                ok = false
                notes.push("extra-slots")
            }
            // size sm is default-ish for house; house Chip has no size prop - visual may differ for md
            if (/\bsize=["']md["']/.test(attrs) || /\bsize=["']lg["']/.test(attrs)) {
                ok = false
                notes.push("non-sm-size")
            }
        }
        if (ok) chipSafe.push({ file: c.file, count: opens.length })
        else other.push({ file: c.file, kind: "chip-skip", notes })
        continue
    }

    if (sym.length === 1 && sym[0] === "Skeleton") {
        // only safe if used as bar with className — map to @/components/blocks/skeleton/Skeleton
        if (src.includes("Skeleton.") || src.includes("HeroSkeleton.")) {
            // compound usage may still be ok if only HeroSkeleton alias for bar
        }
        const aliased = /Skeleton\s+as\s+HeroSkeleton/.test(src) || /HeroSkeleton/.test(src)
        // skip if uses Skeleton as namespace compound from heroui (unlikely)
        if (/<Skeleton\.[A-Z]/.test(src)) {
            other.push({ file: c.file, kind: "skeleton-compound" })
            continue
        }
        skeletonSafe.push({ file: c.file, aliased })
        continue
    }

    if (sym.length === 1 && sym[0] === "Typography") {
        typographyHard.push(c.file) // house API is text= not children; usually hard
        continue
    }

    if (sym.length === 1 && sym[0] === "Button") {
        buttonHard.push(c.file)
        continue
    }

    other.push({ file: c.file, kind: "multi", symbols: sym })
}

const out = {
    spinnerSafe,
    chipSafe,
    skeletonSafe,
    typographyHardCount: typographyHard.length,
    buttonHardCount: buttonHard.length,
    otherCount: other.length,
    typographyHard: typographyHard.slice(0, 20),
    buttonHard: buttonHard.slice(0, 20),
    otherSample: other.slice(0, 40),
}
fs.writeFileSync(
    path.join(ROOT, ".artifacts/fe-refactor-audit/_overlap-dropin-classify.json"),
    JSON.stringify(out, null, 2),
)
console.log(
    JSON.stringify(
        {
            spinnerSafe: spinnerSafe.length,
            chipSafe: chipSafe.length,
            skeletonSafe: skeletonSafe.length,
            typographyHard: typographyHard.length,
            buttonHard: buttonHard.length,
            other: other.length,
        },
        null,
        2,
    ),
)
console.log("\n=== spinner ===")
spinnerSafe.forEach((s) => console.log(s.file))
console.log("\n=== chip ===")
chipSafe.forEach((s) => console.log(s.file))
console.log("\n=== skeleton (first 40) ===")
skeletonSafe.slice(0, 40).forEach((s) => console.log(s.file))

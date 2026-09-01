/**
 * Classify unlocked heroui hits into:
 * - cn-only (not atom swap)
 * - known-atom-candidate (all imported symbols map to existing atoms)
 * - mixed / unclear (hard-case)
 */
import fs from "node:fs"
import path from "node:path"

const data = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/eslint-product-2026-08-07-final.json", "utf8"),
)

const locked = (rel) =>
    /MockInterviewSession|QuizSession|LearnLoopScroll|ContentAiChat|ArchitectureScene|BlockAnatomy|nivoexpert\/|components\/nivo\/|\/resources\//.test(
        rel,
    )

function relPath(filePath) {
    const p = filePath.replace(/\\/g, "/")
    const i = p.indexOf("starci-academy/")
    return i >= 0 ? p.slice(i + "starci-academy/".length) : p
}

/** HeroUI export → existing house atom path (relative import style used in src). */
const ATOM_MAP = {
    Button: "@/components/atoms/buttons/Button",
    Spinner: "@/components/atoms/display/Spinner",
    Chip: "@/components/atoms/chips/Chip",
    Typography: "@/components/atoms/text/Typography",
    Link: "@/components/atoms/navigation/Link",
    Card: "@/components/atoms/display/Card",
    Progress: "@/components/atoms/display/Progress",
    Alert: "@/components/atoms/feedback/Alert",
    AlertDialog: "@/components/atoms/feedback/AlertDialog",
    Modal: "@/components/atoms/overlay/Modal",
    Drawer: "@/components/atoms/overlay/Drawer",
    Popover: "@/components/atoms/overlay/Popover",
    Pagination: "@/components/atoms/navigation/Pagination",
    Tabs: "@/components/atoms/navigation/Tabs",
    Accordion: "@/components/atoms/navigation/Accordion",
    Select: "@/components/atoms/forms/Select",
    Input: "@/components/atoms/forms/InputText",
    TextArea: "@/components/atoms/forms/InputTextarea",
    TextField: "@/components/atoms/forms/InputText", // often paired; may be hard
    Radio: "@/components/atoms/forms/Radio",
    Switch: "@/components/atoms/forms/Switch",
    Checkbox: "@/components/atoms/forms/Checkbox",
    Divider: "@/components/atoms/display/Divider",
    Separator: "@/components/atoms/display/Divider",
    Avatar: "@/components/atoms/display/Avatar",
    Badge: "@/components/atoms/display/Badge",
    Skeleton: "@/components/atoms/feedback/Skeleton", // may differ
    ButtonGroup: "@/components/atoms/buttons/ButtonGroup",
    CloseButton: null, // no atom found
    ScrollShadow: null,
    ListBox: null,
    Dropdown: null,
    Tooltip: null,
    Kbd: null,
    Calendar: null,
    DatePicker: null,
    DateField: null,
    Slider: null,
    Header: null,
    Table: null,
    Breadcrumbs: null,
    SearchField: null,
    InputOTP: null,
    ComboBox: null,
    Autocomplete: null,
    InputGroup: null,
    AvatarFallback: null,
    AvatarImage: null,
    CheckboxGroup: null,
    RadioGroup: null,
    ColorArea: null,
    ColorPicker: null,
    ColorSlider: null,
    ColorSwatch: null,
    ColorSwatchPicker: null,
    FieldError: null,
    Label: null,
    CardContent: null, // part of Card atom usually
    ProgressBar: "@/components/atoms/display/Progress",
}

const files = new Set()
for (const file of data) {
    const rel = relPath(file.filePath)
    if (locked(rel)) continue
    for (const m of file.messages || []) {
        if (m.ruleId === "starci-fe/no-heroui-outside-vocabulary") files.add(rel)
    }
}

const cnOnly = []
const candidate = []
const hard = []

for (const file of [...files].sort()) {
    if (!fs.existsSync(file)) {
        hard.push({ file, reason: "missing" })
        continue
    }
    const src = fs.readFileSync(file, "utf8")
    const blocks = src.match(/import\s*\{[^}]+\}\s*from\s*["']@heroui\/react["']/gs) || []
    if (blocks.length === 0) {
        if (/from\s*["']@heroui\/react["']/.test(src)) {
            hard.push({ file, reason: "non-named-import" })
        } else {
            hard.push({ file, reason: "no-import-found" })
        }
        continue
    }
    const names = new Set()
    for (const block of blocks) {
        for (const m of block.matchAll(/(?:^|[,{\s])([A-Za-z_][A-Za-z0-9_]*)(?:\s+as\s+[A-Za-z_][A-Za-z0-9_]*)?/g)) {
            const n = m[1]
            if (["import", "type", "typeof"].includes(n)) continue
            names.add(n)
        }
        // also catch `X as Y`
        for (const m of block.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)/g)) {
            names.add(m[1])
        }
    }
    // Clean false positives from regex
    const clean = [...names].filter((n) => !["import", "type", "from", "as"].includes(n))

    if (clean.length === 1 && clean[0] === "cn") {
        cnOnly.push(file)
        continue
    }

    const withoutCn = clean.filter((n) => n !== "cn")
    const unmapped = withoutCn.filter((n) => !(n in ATOM_MAP) || ATOM_MAP[n] === null)
    const mapped = withoutCn.filter((n) => ATOM_MAP[n])

    if (unmapped.length === 0 && mapped.length > 0) {
        candidate.push({ file, symbols: withoutCn, hasCn: clean.includes("cn") })
    } else {
        hard.push({
            file,
            reason: "unmapped-or-empty",
            symbols: withoutCn,
            unmapped,
        })
    }
}

console.log("files", files.size)
console.log("cn-only", cnOnly.length)
console.log("atom-candidate", candidate.length)
console.log("hard", hard.length)

console.log("\n=== atom candidates ===")
for (const c of candidate) {
    console.log(c.symbols.join(","), c.hasCn ? "+cn" : "", c.file)
}

console.log("\n=== hard sample (first 40) ===")
for (const h of hard.slice(0, 40)) {
    console.log(h.reason, (h.symbols || []).join(",") || "", h.file)
}

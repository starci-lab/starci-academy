/**
 * pages-core batch burn — safe authoring rules only, files from _pages-core-batch.json.
 * Do not run outside that list.
 */
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { VN_LETTER, hasEmoji } from "../../plugins/eslint/authoring.mjs"

const ROOT = process.cwd()
const { batch } = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_pages-core-batch.json", "utf8"),
)

const changed = []
const skipped = []

const PHRASES = [
    ["Footer hiện ở LANDING", "Footer renders on LANDING"],
    ["cả locale root", "both the locale root"],
    ["LẪN", "AND"],
    ["là bản ungated của CÙNG trang landing", "is the ungated version of the SAME landing page"],
    ["user đã login xem ở đây", "signed-in users see it here"],
    ["Mọi trang khác", "Every other page"],
    ["KHÔNG có footer", "do NOT have a footer"],
    ["thầy chốt", "teacher ruling"],
    ["Hỏi AI khi đọc bài (lesson tutor).", "Ask-AI while reading a lesson (lesson tutor)."],
    ["Hỏi AI khi đọc bài", "Ask-AI while reading a lesson"],
    ["Chấm bài (challenge + capstone).", "Grading (challenge + capstone)."],
    ["Chấm bài", "Grading"],
    ["Phỏng vấn thử (mock interview).", "Mock interview."],
    ["Phỏng vấn thử", "Mock interview"],
    ["hạng mục", "category"],
    ["\"đạt\"", "\"pass\""],
    ["\"chưa đạt\"", "\"borderline\""],
    ["\"không đạt\"", "\"fail\""],
    ["Bắt đầu\n * lab", "Start\n * lab"],
    ["Bắt đầu lab", "Start lab"],
    ["✨ AI viết\n * giúp", "AI rewrite helper"],
    ["AI viết giúp", "AI rewrite helper"],
    ["tháng", "month"],
]

const scrubEmoji = (text) => {
    let out = text
    const map = [
        [/…/g, "..."],
        [/→/g, "->"],
        [/←/g, "<-"],
        [/✨/g, ""],
        [/⭐/g, "*"],
        [/⚠/g, "WARNING"],
        [/✅/g, "[ok]"],
        [/❌/g, "[x]"],
        [/·/g, "-"],
    ]
    for (const [re, rep] of map) out = out.replace(re, rep)
    out = out.replace(/\p{Extended_Pictographic}/gu, "")
    out = out.replace(/[^\S\n]{2,}/g, " ")
    return out
}

const translate = (text) => {
    let out = text
    for (const [vi, en] of PHRASES) {
        if (out.includes(vi)) out = out.split(vi).join(en)
    }
    return scrubEmoji(out)
}

const findMatchingBrace = (src, openIdx) => {
    let depth = 0
    let inStr = null
    for (let i = openIdx; i < src.length; i++) {
        const ch = src[i]
        if (inStr) {
            if (ch === "\\") {
                i++
                continue
            }
            if (ch === inStr) inStr = null
            continue
        }
        if (ch === "\"" || ch === "'" || ch === "`") {
            inStr = ch
            continue
        }
        if (ch === "{") depth++
        else if (ch === "}") {
            depth--
            if (depth === 0) return i
        }
    }
    return -1
}

const convertArrowExports = (src) => {
    const nameCounts = {}
    for (const m of src.matchAll(/(?:^|\n)(?:export\s+(?:default\s+)?)?function\s+(\w+)/g)) {
        nameCounts[m[1]] = (nameCounts[m[1]] || 0) + 1
    }
    const overloaded = new Set(
        Object.entries(nameCounts)
            .filter(([, c]) => c > 1)
            .map(([n]) => n),
    )

    let out = src
    const defaultExportsToAdd = []
    const matches = [...out.matchAll(/(^|\n)([ \t]*)(export\s+default\s+function\s+|export\s+function\s+|function\s+)(\w+)/g)]
    for (let mi = matches.length - 1; mi >= 0; mi--) {
        const m = matches[mi]
        const name = m[4]
        if (overloaded.has(name)) continue
        const indent = m[2]
        const kind = m[3]
        const start = m.index + m[1].length
        const nameStart = m.index + m[1].length + indent.length + kind.length
        let i = nameStart + name.length
        let inStr = null
        let bodyOpen = -1
        while (i < out.length) {
            const ch = out[i]
            if (inStr) {
                if (ch === "\\") {
                    i += 2
                    continue
                }
                if (ch === inStr) inStr = null
                i++
                continue
            }
            if (ch === "\"" || ch === "'" || ch === "`") {
                inStr = ch
                i++
                continue
            }
            if (ch === "{") {
                bodyOpen = i
                break
            }
            i++
        }
        if (bodyOpen < 0) continue
        const bodyClose = findMatchingBrace(out, bodyOpen)
        if (bodyClose < 0) continue
        const sig = out.slice(nameStart + name.length, bodyOpen).trimEnd()
        // sig starts with (params) or <generics>(params) possibly with : ReturnType
        const isDefault = kind.includes("default")
        const isExport = kind.startsWith("export")
        let replacement
        if (isDefault) {
            replacement = `${indent}const ${name} = ${sig} => `
            defaultExportsToAdd.push(name)
        } else if (isExport) {
            replacement = `${indent}export const ${name} = ${sig} => `
        } else {
            replacement = `${indent}const ${name} = ${sig} => `
        }
        // Keep body including braces
        const body = out.slice(bodyOpen, bodyClose + 1)
        out = out.slice(0, start) + replacement + body + out.slice(bodyClose + 1)
    }
    if (defaultExportsToAdd.length) {
        for (const name of defaultExportsToAdd) {
            if (!new RegExp(`export\\s+default\\s+${name}\\b`).test(out)) {
                out = out.trimEnd() + `\n\nexport default ${name}\n`
            }
        }
    }
    return out
}

const hasJsdocImmediatelyAbove = (src, index) => {
    const before = src.slice(0, index)
    const m = before.match(/(\/\*\*[\s\S]*?\*\/)\s*$/)
    return Boolean(m)
}

const ensureExportJsdoc = (src, exportName, role) => {
    // Find export const/function/interface/type/enum Name
    const re = new RegExp(
        `(^|\\n)([ \\t]*)(export\\s+(?:default\\s+)?(?:async\\s+)?(?:const|function|interface|type|enum|class)\\s+${exportName}\\b)`,
        "g",
    )
    let out = src
    const matches = [...out.matchAll(re)]
    for (let mi = matches.length - 1; mi >= 0; mi--) {
        const m = matches[mi]
        const start = m.index + m[1].length
        if (hasJsdocImmediatelyAbove(out, start)) continue
        const indent = m[2]
        const jsdoc = `${indent}/** ${role} */\n`
        out = out.slice(0, start) + jsdoc + out.slice(start)
    }
    return out
}

const fixCommentsAndStringsLight = (src, { scrubProductVi = false } = {}) => {
    const kind = src.includes("</") || src.includes("/>") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    const sf = ts.createSourceFile("f.ts", src, ts.ScriptTarget.Latest, true, kind)
    const edits = []

    for (const c of sf.getFullText().matchAll(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g) || []) {
        // handled below via getChildren scan of comments through TS API
    }

    // Use TS comment ranges
    const ranges = [
        ...ts.getLeadingCommentRanges(src, 0) || [],
    ]
    const visit = (node) => {
        const lead = ts.getLeadingCommentRanges(src, node.pos) || []
        const trail = ts.getTrailingCommentRanges(src, node.end) || []
        for (const r of [...lead, ...trail]) ranges.push(r)
        ts.forEachChild(node, visit)
    }
    visit(sf)

    const seen = new Set()
    for (const r of ranges) {
        const key = `${r.pos}:${r.end}`
        if (seen.has(key)) continue
        seen.add(key)
        const text = src.slice(r.pos, r.end)
        if (!VN_LETTER.test(text) && !hasEmoji(text) && !text.includes("…") && !text.includes("✨")) continue
        const next = translate(text)
        if (next !== text) edits.push({ pos: r.pos, end: r.end, text: next })
    }

    // Scrub emoji ellipsis in string literals (not product VI)
    const visitLit = (node) => {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
            const raw = node.getText(sf)
            if (hasEmoji(raw) || raw.includes("…") || raw.includes("✨")) {
                const next = scrubEmoji(raw)
                if (next !== raw) edits.push({ pos: node.getStart(sf), end: node.end, text: next })
            }
        }
        ts.forEachChild(node, visitLit)
    }
    visitLit(sf)

    edits.sort((a, b) => b.pos - a.pos)
    let out = src
    for (const e of edits) out = out.slice(0, e.pos) + e.text + out.slice(e.end)
    return out
}

const pascal = (s) =>
    s.replace(/(^|[-_\s]+)([a-zA-Z])/g, (_, __, c) => c.toUpperCase()).replace(/[^A-Za-z0-9]/g, "")

const fixInlineParams = (src, rel) => {
    const kind = rel.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, kind)
    const usedNames = new Set()
    const visitNames = (node) => {
        if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
            usedNames.add(node.name.text)
        }
        ts.forEachChild(node, visitNames)
    }
    visitNames(sf)

    const uniqueName = (base) => {
        let name = base
        let n = 2
        while (usedNames.has(name)) {
            name = `${base}${n}`
            n++
        }
        usedNames.add(name)
        return name
    }

    const enclosingName = (node) => {
        let cur = node.parent
        while (cur) {
            if (ts.isVariableDeclaration(cur) && ts.isIdentifier(cur.name)) return cur.name.text
            if (ts.isFunctionDeclaration(cur) && cur.name) return cur.name.text
            if (ts.isFunctionExpression(cur) && cur.name) return cur.name.text
            cur = cur.parent
        }
        return null
    }

    const edits = []
    const checkParams = (params, hint) => {
        for (const param of params) {
            if (!param.type || param.type.kind !== ts.SyntaxKind.TypeLiteral) continue
            if (!ts.isObjectBindingPattern(param.name) && !ts.isIdentifier(param.name)) continue
            // Only flag destructured params with inline object types (rule focus)
            if (!ts.isObjectBindingPattern(param.name)) continue
            const typeText = param.type.getText(sf)
            const typeName = uniqueName(`${pascal(hint || "Inline")}Props`)
            edits.push({
                insertPos: param.getStart(sf),
                typeName,
                typeText,
                typeStart: param.type.getStart(sf),
                typeEnd: param.type.end,
            })
        }
    }

    const visit = (node) => {
        if (
            ts.isFunctionDeclaration(node) ||
            ts.isFunctionExpression(node) ||
            ts.isArrowFunction(node)
        ) {
            checkParams(node.parameters, enclosingName(node) || node.name?.text)
        }
        ts.forEachChild(node, visit)
    }
    visit(sf)

    if (!edits.length) return src

    // Insert interfaces before first export / after imports
    let insertAt = 0
    for (const stmt of sf.statements) {
        if (ts.isImportDeclaration(stmt)) {
            insertAt = stmt.end
            continue
        }
        break
    }

    const decls = edits
        .map((e) => `\n/** Props for ${e.typeName.replace(/Props$/, "")}. */\ninterface ${e.typeName} ${e.typeText}\n`)
        .join("")

    let out = src.slice(0, insertAt) + decls + src.slice(insertAt)
    // Adjust offsets after insert
    const delta = decls.length
    const sorted = [...edits].sort((a, b) => b.typeStart - a.typeStart)
    for (const e of sorted) {
        const start = e.typeStart + delta
        const end = e.typeEnd + delta
        out = out.slice(0, start) + e.typeName + out.slice(end)
    }
    return out
}

const JSDOC_ROLES = {
    InnerLayout: "Client app shell: providers, navbar/footer gates, and the content-AI rail.",
    CreateAttachAccessTokenLinkParams: "Options for {@link createAttachAccessTokenLink}.",
    createAttachAccessTokenLink: "Apollo link that attaches the Keycloak access token to outgoing GraphQL ops.",
    mutation1: "GraphQL document for the refresh-token mutation.",
    RefreshTokenData: "Typed payload returned by the refresh-token mutation.",
    defaultConsultantsListSorts: "Default sort order for the consultants list query.",
    defaultConsultantsListLimit: "Default page size for the consultants list query.",
    queryConsultants: "Fetches the paginated consultants list.",
    SandboxRepoUrlRequest: "Request body for {@link querySandboxRepoUrl}.",
    QuerySandboxRepoUrlResponse: "Apollo response shape for {@link querySandboxRepoUrl}.",
    querySandboxRepoUrl: "Fetches the sandbox repository URL for a playground slug.",
    GraphQLHeaders: "HTTP headers accepted by GraphQL helpers.",
    MutateParams: "Shared parameters for GraphQL mutate helpers.",
    MutateVariables: "Variables bag accepted by GraphQL mutate helpers.",
    GithubIconProps: "Props for {@link GithubIcon}.",
    GithubIcon: "GitHub mark SVG icon.",
    GoogleIconProps: "Props for {@link GoogleIcon}.",
    GoogleIcon: "Google mark SVG icon.",
    LogoProps: "Props for {@link Logo}.",
    Logo: "StarCi wordmark / logo SVG.",
    ToDecimalAmountParams: "Inputs for {@link toDecimalAmount}.",
    toDecimalAmount: "Converts a raw BN amount into a Decimal UI amount.",
    ToRawAmountParams: "Inputs for {@link toRawAmount}.",
    toRawAmount: "Converts a Decimal UI amount into a raw BN amount.",
    BnMulDecimalParams: "Inputs for BN × Decimal helpers.",
    bnDivDecimal: "Divides a BN by a Decimal with fixed precision.",
    bnDivBn: "Divides two BNs into a Decimal ratio.",
    BnDivBnParams: "Inputs for {@link bnDivBn}.",
    adjustSlippage: "Applies slippage adjustment to a Decimal amount.",
    AdjustSlippageParams: "Inputs for {@link adjustSlippage}.",
    decimalToBps: "Converts a Decimal fraction into basis points.",
    bpsToDecimal: "Converts basis points into a Decimal fraction.",
    ComputePercentageParams: "Inputs for percentage helpers.",
    ComputeRatioParams: "Inputs for ratio helpers.",
    pow10: "Returns 10^exponent as Decimal or BN.",
    RegressionPoint: "A single (x, y) sample for linear regression.",
    RegressionResult: "Slope/intercept result from {@link getSafeLinearRegression}.",
    getSafeLinearRegression: "Safe linear regression over points (empty-safe).",
    TruncateMiddleParams: "Inputs for {@link truncateMiddle}.",
    truncateMiddle: "Truncates a string in the middle with an ellipsis.",
    TruncateEndParams: "Inputs for {@link truncateEnd}.",
    truncateEnd: "Truncates a string at the end with an ellipsis.",
    Module: "Legacy module shape used by older course surfaces.",
    Course: "Legacy course shape used by older course surfaces.",
    Pricing: "Legacy pricing shape used by older course surfaces.",
}

const PRODUCT_VI_SKIP = new Set([
    // dayjs format literal embeds VI month word — product locale, not authoring comment
    "src/modules/dayjs/index.ts",
])

for (const rel of batch) {
    const abs = path.join(ROOT, rel)
    if (!fs.existsSync(abs)) {
        skipped.push({ path: rel, rules: [], reason: "missing-file" })
        continue
    }
    if (PRODUCT_VI_SKIP.has(rel)) {
        skipped.push({
            path: rel,
            rules: ["starci-fe/no-vietnamese-in-source-authoring"],
            reason: "product-locale-format-literal",
        })
        continue
    }

    let src = fs.readFileSync(abs, "utf8")
    const original = src

    // 1) comments / emoji scrub
    src = fixCommentsAndStringsLight(src)

    // 2) arrow exports
    if (
        rel.includes("challenge-section") ||
        rel.includes("content-body") ||
        rel.includes("content.ts") ||
        rel.includes("programming-language") ||
        rel.includes("pow-10") ||
        rel.includes("error.tsx")
    ) {
        src = convertArrowExports(src)
    }

    // 3) jsdoc for known exports
    for (const [name, role] of Object.entries(JSDOC_ROLES)) {
        if (src.includes(` ${name}`) || src.includes(` ${name}=`) || src.includes(` ${name} `)) {
            src = ensureExportJsdoc(src, name, role)
        }
    }

    // 4) inline params for route files
    if (
        rel.includes("/page.tsx") ||
        rel.includes("/layout.tsx") ||
        rel.includes("/error.tsx") ||
        rel.includes("home/page")
    ) {
        src = fixInlineParams(src, rel)
    }

    if (src !== original) {
        fs.writeFileSync(abs, src)
        changed.push(rel)
        console.log("changed", rel)
    } else {
        skipped.push({ path: rel, rules: [], reason: "no-op-after-pass" })
        console.log("noop", rel)
    }
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_pages-core-burn-pass1.json",
    JSON.stringify({ changed, skipped }, null, 2),
)
console.log("pass1 changed", changed.length, "skipped", skipped.length)

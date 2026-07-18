/**
 * `buildCvTexSource` — the ONE place the block document turns into a complete,
 * self-contained LaTeX (`.tex`) document. It REPLACES `buildCvExportHtml`: the
 * full-LaTeX pivot compiles this `.tex` server-side with `tectonic` → PDF (for
 * both the live preview and the export), and the same string is what the
 * "Tải .tex" button downloads.
 *
 * The per-block field-reading logic is ported verbatim from `CvHtmlDocument`'s
 * renderers (that file stays in the repo as the SSOT for WHICH `item.fields`
 * keys each `CvBlockType` reads) — only the OUTPUT changes from inline-styled
 * HTML to LaTeX sections. Keep the two in sync: a new field read here must
 * match how `CvHtmlDocument` reads it.
 *
 * SINGLE TEMPLATE: the 4 `style.template` variants (classic/modern/sidebar/
 * minimal) are FLATTENED to one clean single-column LaTeX layout — the pivot's
 * chosen scope. `style.template` is intentionally ignored here; `style.accent`
 * (section-title color) and `style.fontScale` (document font size) are honoured.
 * `style.font` is NOT mapped to a LaTeX font package (fragile + risks a missing-
 * package compile failure under tectonic) — the document uses the default face.
 */

import { CvBlockItemSource } from "@/modules/types/enums/cv-block-item-source"
import { CvBlockType } from "@/modules/types/enums/cv-block-type"
import type { CvBlock, CvDocument, CvFontScale } from "../types"

/**
 * Escapes a user-supplied string for safe interpolation into LaTeX source.
 * Order matters — the backslash MUST be replaced first, otherwise the
 * backslashes introduced by the later replacements would themselves be escaped.
 * EVERY interpolated user value passes through this.
 */
export const escapeLatex = (text: string | null | undefined): string => {
    if (text == null) return ""
    return String(text)
        .replace(/\\/g, "\\textbackslash{}")
        .replace(/&/g, "\\&").replace(/%/g, "\\%").replace(/\$/g, "\\$")
        .replace(/#/g, "\\#").replace(/_/g, "\\_")
        .replace(/\{/g, "\\{").replace(/\}/g, "\\}")
        .replace(/~/g, "\\textasciitilde{}").replace(/\^/g, "\\textasciicircum{}")
}

/** Trims an unknown field value to a string (non-strings → ""). Mirrors `CvHtmlDocument`. */
const str = (value: unknown): string => (typeof value === "string" ? value.trim() : "")

/** Trims AND LaTeX-escapes a field value in one step (the common case). */
const esc = (value: unknown): string => escapeLatex(str(value))

/** Reads a block's single fields set (personal / summary hold it on `items[0]`). */
const singleFields = (block: CvBlock): Record<string, unknown> => block.items[0]?.fields ?? {}

/** Splits a bullets textarea (one bullet per line) into non-empty lines. Mirrors `CvHtmlDocument`. */
const toBullets = (value: unknown): Array<string> =>
    str(value)
        .split("\n")
        .map((line) => line.replace(/^[-•*]\s*/, "").trim())
        .filter((line) => line.length > 0)

/** Joins a start/end date pair into a "start – end" range (omits empties). Mirrors `CvHtmlDocument`. */
const dateRange = (start: unknown, end: unknown): string => {
    const a = str(start)
    const b = str(end)
    if (a && b) {
        return `${a} – ${b}`
    }
    return a || b
}

/** `style.fontScale` → LaTeX base font size (the `\documentclass` option). */
const FONT_SIZE_PT: Record<CvFontScale, string> = {
    sm: "10pt",
    md: "11pt",
    lg: "12pt",
}

/** Resolves a stored `fontScale` (possibly absent on older documents) to its `\documentclass` size. */
const fontSizeOf = (fontScale: CvFontScale | undefined): string => FONT_SIZE_PT[fontScale ?? "md"]

/** Middot separator used to inline contacts / skills / languages (math mode = always available). */
const DOT = " $\\cdot$ "

/** Wraps bullet lines in an `itemize`, or returns "" when there are none. */
const itemize = (bullets: Array<string>): string => {
    if (bullets.length === 0) return ""
    const items = bullets.map((line) => `  \\item ${escapeLatex(line)}`).join("\n")
    return `\\begin{itemize}\n${items}\n\\end{itemize}`
}

/** One `\section*{title}` with escaped title, followed by pre-built body lines. Empty body → "". */
const section = (title: string, body: string): string => {
    if (!body.trim()) return ""
    return `\\section*{${escapeLatex(title)}}\n${body}`
}

/** Header (personal block): name + headline + contact line, centered. Mirrors `PersonalBlock`. */
const buildHeader = (block: CvBlock | undefined): string => {
    if (!block) return ""
    const f = singleFields(block)
    const name = str(f.name)
    const role = str(f.role)
    const contacts = [
        str(f.email),
        str(f.phone),
        str(f.location),
        str(f.birthDate),
        str(f.linkedinUrl),
        str(f.githubUsername),
    ].filter((value) => value.length > 0)
    const lines: Array<string> = []
    if (name) lines.push(`{\\huge\\bfseries ${escapeLatex(name)}}`)
    if (role) lines.push(`{\\large ${escapeLatex(role)}}`)
    if (contacts.length > 0) lines.push(contacts.map((value) => escapeLatex(value)).join(DOT))
    if (lines.length === 0) return ""
    return `\\begin{center}\n${lines.join(" \\\\[3pt]\n")}\n\\end{center}`
}

/** Summary paragraph. Mirrors `SummaryBlock`. */
const buildSummary = (block: CvBlock): string => section(block.title, esc(singleFields(block).text))

/** Work experience — role/company \hfill dates, then bullets. Mirrors `ExperienceBlock`. */
const buildExperience = (block: CvBlock): string => {
    const body = block.items.map((item) => {
        const f = item.fields
        const roleCompany = [str(f.role), str(f.company)].filter(Boolean).join(", ")
        const dates = dateRange(f.startDate, f.endDate)
        const head = `\\textbf{${escapeLatex(roleCompany)}} \\hfill {\\small ${escapeLatex(dates)}}`
        return [head, itemize(toBullets(f.bullets))].filter(Boolean).join("\n")
    }).filter(Boolean).join("\n\\smallskip\n")
    return section(block.title, body)
}

/** Education — school \hfill dates, then degree. Mirrors `EducationBlock`. */
const buildEducation = (block: CvBlock): string => {
    const body = block.items.map((item) => {
        const f = item.fields
        const head = `\\textbf{${esc(f.school)}} \\hfill {\\small ${escapeLatex(dateRange(f.startDate, f.endDate))}}`
        const degree = str(f.degree) ? `\\\\\n{\\small ${esc(f.degree)}}` : ""
        return `${head}${degree}`
    }).filter(Boolean).join("\n\\smallskip\n")
    return section(block.title, body)
}

/** Skills — one middot-joined line. Mirrors `SkillsBlock` (also serves `interest`). */
const buildSkills = (block: CvBlock): string => {
    const skills = block.items.map((item) => str(item.fields.name)).filter(Boolean)
    if (skills.length === 0) return ""
    return section(block.title, skills.map((value) => escapeLatex(value)).join(DOT))
}

/** Certifications — name \hfill date, issuer, credential URL (plain escaped text). Mirrors `CertificationBlock`. */
const buildCertification = (block: CvBlock): string => {
    const body = block.items.map((item) => {
        const f = item.fields
        const head = `\\textbf{${esc(f.name)}} \\hfill {\\small ${esc(f.date)}}`
        const issuer = str(f.issuer) ? `\\\\\n{\\small ${esc(f.issuer)}}` : ""
        const url = str(f.credentialUrl) ? `\\\\\n{\\small ${esc(f.credentialUrl)}}` : ""
        return `${head}${issuer}${url}`
    }).filter(Boolean).join("\n\\smallskip\n")
    return section(block.title, body)
}

/** Languages — "name: level" joined by middot. Mirrors `LanguageBlock`. */
const buildLanguage = (block: CvBlock): string => {
    const languages = block.items
        .map((item) => ({ name: str(item.fields.name), level: str(item.fields.level) }))
        .filter((language) => language.name.length > 0)
    if (languages.length === 0) return ""
    const line = languages
        .map(({ name, level }) => (level ? `${escapeLatex(name)}: ${escapeLatex(level)}` : escapeLatex(name)))
        .join(DOT)
    return section(block.title, line)
}

/** Project / achievement / activity — title (+ verified check) then description. Mirrors `TitleDescBlock`. */
const buildTitleDesc = (block: CvBlock): string => {
    const body = block.items.map((item) => {
        const f = item.fields
        const verified = item.source === CvBlockItemSource.Verified
        const check = verified ? " {\\small\\color{accent}\\checkmark\\ StarCi}" : ""
        const head = `\\textbf{${esc(f.title)}}${check}`
        const description = str(f.description) ? `\\\\\n${esc(f.description)}` : ""
        return `${head}${description}`
    }).filter(Boolean).join("\n\\smallskip\n")
    return section(block.title, body)
}

/** Dispatches one non-personal block to its LaTeX builder (mirrors `CvBlockView`'s switch). */
const buildBlock = (block: CvBlock): string => {
    switch (block.type) {
    case CvBlockType.Summary:
        return buildSummary(block)
    case CvBlockType.Experience:
        return buildExperience(block)
    case CvBlockType.Education:
        return buildEducation(block)
    case CvBlockType.Skills:
    case CvBlockType.Interest:
        return buildSkills(block)
    case CvBlockType.Project:
    case CvBlockType.Achievement:
    case CvBlockType.Activity:
        return buildTitleDesc(block)
    case CvBlockType.Certification:
        return buildCertification(block)
    case CvBlockType.Language:
        return buildLanguage(block)
    default:
        // `personal` is rendered as the header (not a section); unknown types skip.
        return ""
    }
}

/** Normalizes a stored accent (`#RRGGBB` or `RRGGBB`) to the 6-hex `xcolor` needs, with a fallback. */
const accentHexOf = (accent: string | undefined): string => {
    const hex = (accent ?? "").replace(/^#/, "").toUpperCase()
    return /^[0-9A-F]{6}$/.test(hex) ? hex : "E84393"
}

/**
 * Builds ONE complete `.tex` document from a {@link CvDocument} — the full-LaTeX
 * replacement for `buildCvExportHtml`. Blocks render in `order`; the `personal`
 * block becomes the centered header, every other block a `\section*`. Empty
 * blocks/sections are skipped so the output never carries a bare heading.
 *
 * @param doc - the CV document to serialize.
 * @returns a complete `\documentclass … \end{document}` LaTeX string.
 */
export const buildCvTexSource = (doc: CvDocument): string => {
    const accentHex = accentHexOf(doc.style.accent)
    const fontSize = fontSizeOf(doc.style.fontScale)
    const blocks = [...doc.blocks].sort((a, b) => a.order - b.order)
    const personal = blocks.find((block) => block.type === CvBlockType.Personal)
    const rest = blocks.filter((block) => block.type !== CvBlockType.Personal)

    const header = buildHeader(personal)
    const sections = rest.map((block) => buildBlock(block)).filter((part) => part.trim().length > 0)

    const bodyParts = [header, ...sections].filter((part) => part.trim().length > 0)
    const body = bodyParts.join("\n\n")

    return `\\documentclass[${fontSize},a4paper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{amssymb}
\\usepackage[dvipsnames]{xcolor}
\\usepackage{hyperref}
\\definecolor{accent}{HTML}{${accentHex}}
\\hypersetup{colorlinks=true,urlcolor=accent,linkcolor=accent}
\\titleformat{\\section}{\\large\\bfseries\\color{accent}}{}{0em}{}[{\\color{accent}\\titlerule}]
\\titlespacing{\\section}{0pt}{12pt}{6pt}
\\setlist[itemize]{leftmargin=1.2em,itemsep=2pt,parsep=0pt,topsep=2pt}
\\pagenumbering{gobble}
\\begin{document}
${body}
\\end{document}
`
}

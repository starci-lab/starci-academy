import React from "react"
import type { CSSProperties } from "react"
import { CvBlockType as BlockType } from "@/modules/types/enums/cv-block-type"
import { CvBlockItemSource } from "@/modules/types/enums/cv-block-item-source"
import type { CvBlock, CvBlockItem, CvDocument, CvFontScale, CvTemplate } from "../../types"
import { fontFamilyOf } from "./fonts"

/**
 * The self-contained, INLINE-STYLED React render of the block document. After
 * the full-LaTeX pivot this is NO LONGER the preview or the export path (both are
 * now the tectonic-compiled PDF — see `buildCvTexSource` + `CvPdfPreview`). It
 * lives on as (1) the CV GALLERY thumbnail render (a cheap client-side minimap of
 * each document) and (2) the executable SSOT for WHICH `item.fields` keys each
 * `CvBlockType` reads — `buildCvTexSource` ports its per-block field logic.
 *
 * Everything is inline `style` (no external CSS / classes). `style.accent` colors
 * the name + section rules; `style.font` selects a widely-available font stack.
 */


const TEXT_COLOR = "#1a1a1a"
const MUTED_COLOR = "#555555"

/** Relative multiplier applied to every font-size in the document, per {@link CvFontScale}. */
const FONT_SCALE_FACTOR: Record<CvFontScale, number> = {
    sm: 0.9,
    md: 1,
    lg: 1.12,
}

/** Resolves a stored `style.fontScale` (possibly absent on older documents) to its multiplier. */
const scaleFactorOf = (fontScale: CvFontScale | undefined): number => FONT_SCALE_FACTOR[fontScale ?? "md"]

/** Scales a base px font-size by the document's {@link CvFontScale} multiplier, rounded to whole px. */
const px = (base: number, scale: number): number => Math.round(base * scale)

const str = (value: unknown): string => (typeof value === "string" ? value.trim() : "")

/** Reads a block's single fields set (personal / summary hold it on items[0]). */
const singleFields = (block: CvBlock): Record<string, unknown> => block.items[0]?.fields ?? {}

/** Splits a bullets textarea (one bullet per line) into non-empty lines. */
const toBullets = (value: unknown): Array<string> =>
    str(value)
        .split("\n")
        .map((line) => line.replace(/^[-•*]\s*/, "").trim())
        .filter((line) => line.length > 0)

/** Joins a start/end date pair into a "start – end" range (omits empties). */
const dateRange = (start: unknown, end: unknown): string => {
    const a = str(start)
    const b = str(end)
    if (a && b) {
        return `${a} – ${b}`
    }
    return a || b
}

const sectionTitleStyle = (accent: string, scale: number): CSSProperties => ({
    margin: "18px 0 8px",
    paddingBottom: 4,
    fontSize: px(13, scale),
    fontWeight: 700,
    color: accent,
    borderBottom: `2px solid ${accent}`,
    letterSpacing: "0.02em",
})

const itemHeaderRowStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
}

/** Props shared by every per-type block renderer. */
interface CvBlockRenderProps {
    block: CvBlock
    accent: string
    /** The document's font-size multiplier — see {@link scaleFactorOf}. */
    scale: number
}

/** Renders one section heading (the block's own title). */
const SectionTitle = ({ title, accent, scale }: { title: string, accent: string, scale: number }) => (
    <div style={sectionTitleStyle(accent, scale)}>{title}</div>
)

/**
 * Header / contact block. `nameColor` lets a template render the person's NAME
 * in a color other than the section-heading `accent` (e.g. `classic` keeps the
 * name as plain foreground ink, reserving `accent` for the section-title rules
 * only) — defaults to `accent` for templates that don't override it (unchanged
 * behavior for `sidebar`).
 */
const PersonalBlock = ({ block, accent, scale, nameColor }: CvBlockRenderProps & { nameColor?: string }) => {
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
    return (
        <div style={{ marginBottom: 4 }}>
            {name ? (
                <div style={{ fontSize: px(26, scale), fontWeight: 700, color: nameColor ?? accent, lineHeight: 1.15 }}>{name}</div>
            ) : null}
            {role ? (
                <div style={{ fontSize: px(14, scale), color: MUTED_COLOR, marginTop: 2 }}>{role}</div>
            ) : null}
            {contacts.length > 0 ? (
                <div style={{ fontSize: px(12, scale), color: MUTED_COLOR, marginTop: 6 }}>{contacts.join("  ·  ")}</div>
            ) : null}
        </div>
    )
}

/** Summary paragraph. */
const SummaryBlock = ({ block, accent, scale }: CvBlockRenderProps) => {
    const text = str(singleFields(block).text)
    if (!text) {
        return null
    }
    return (
        <div>
            <SectionTitle title={block.title} accent={accent} scale={scale} />
            <p style={{ margin: 0, fontSize: px(13, scale), color: TEXT_COLOR }}>{text}</p>
        </div>
    )
}

/** Work experience list. */
const ExperienceBlock = ({ block, accent, scale }: CvBlockRenderProps) => {
    if (block.items.length === 0) {
        return null
    }
    return (
        <div>
            <SectionTitle title={block.title} accent={accent} scale={scale} />
            {block.items.map((item) => {
                const f = item.fields
                const bullets = toBullets(f.bullets)
                return (
                    <div key={item.id} style={{ marginBottom: 10 }}>
                        <div style={itemHeaderRowStyle}>
                            <span style={{ fontSize: px(13, scale), fontWeight: 700, color: TEXT_COLOR }}>
                                {[str(f.role), str(f.company)].filter(Boolean).join(", ")}
                            </span>
                            <span style={{ fontSize: px(12, scale), color: MUTED_COLOR, whiteSpace: "nowrap" }}>
                                {dateRange(f.startDate, f.endDate)}
                            </span>
                        </div>
                        {bullets.length > 0 ? (
                            <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                                {bullets.map((line, index) => (
                                    <li key={index} style={{ fontSize: px(13, scale), color: TEXT_COLOR, marginBottom: 2 }}>{line}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}

/** Education list. */
const EducationBlock = ({ block, accent, scale }: CvBlockRenderProps) => {
    if (block.items.length === 0) {
        return null
    }
    return (
        <div>
            <SectionTitle title={block.title} accent={accent} scale={scale} />
            {block.items.map((item) => {
                const f = item.fields
                return (
                    <div key={item.id} style={{ marginBottom: 8 }}>
                        <div style={itemHeaderRowStyle}>
                            <span style={{ fontSize: px(13, scale), fontWeight: 700, color: TEXT_COLOR }}>{str(f.school)}</span>
                            <span style={{ fontSize: px(12, scale), color: MUTED_COLOR, whiteSpace: "nowrap" }}>
                                {dateRange(f.startDate, f.endDate)}
                            </span>
                        </div>
                        {str(f.degree) ? (
                            <div style={{ fontSize: px(13, scale), color: MUTED_COLOR }}>{str(f.degree)}</div>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}

/** Skills — one comma/·-joined line. */
const SkillsBlock = ({ block, accent, scale }: CvBlockRenderProps) => {
    const skills = block.items.map((item) => str(item.fields.name)).filter(Boolean)
    if (skills.length === 0) {
        return null
    }
    return (
        <div>
            <SectionTitle title={block.title} accent={accent} scale={scale} />
            <div style={{ fontSize: px(13, scale), color: TEXT_COLOR }}>{skills.join("  ·  ")}</div>
        </div>
    )
}

/** Certification list (name + issuer + date). */
const CertificationBlock = ({ block, accent, scale }: CvBlockRenderProps) => {
    if (block.items.length === 0) {
        return null
    }
    return (
        <div>
            <SectionTitle title={block.title} accent={accent} scale={scale} />
            {block.items.map((item) => {
                const f = item.fields
                return (
                    <div key={item.id} style={{ marginBottom: 8 }}>
                        <div style={itemHeaderRowStyle}>
                            <span style={{ fontSize: px(13, scale), fontWeight: 700, color: TEXT_COLOR }}>{str(f.name)}</span>
                            <span style={{ fontSize: px(12, scale), color: MUTED_COLOR, whiteSpace: "nowrap" }}>
                                {str(f.date)}
                            </span>
                        </div>
                        {str(f.issuer) ? (
                            <div style={{ fontSize: px(13, scale), color: MUTED_COLOR }}>{str(f.issuer)}</div>
                        ) : null}
                        {str(f.credentialUrl) ? (
                            <div style={{ fontSize: px(12, scale) }}>
                                <a href={str(f.credentialUrl)} style={{ color: accent, textDecoration: "none" }}>
                                    {str(f.credentialUrl)}
                                </a>
                            </div>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}

/** Language list — one "name — level" line per item. */
const LanguageBlock = ({ block, accent, scale }: CvBlockRenderProps) => {
    const languages = block.items
        .map((item) => ({ name: str(item.fields.name), level: str(item.fields.level) }))
        .filter((language) => language.name.length > 0)
    if (languages.length === 0) {
        return null
    }
    return (
        <div>
            <SectionTitle title={block.title} accent={accent} scale={scale} />
            <div style={{ fontSize: px(13, scale), color: TEXT_COLOR }}>
                {languages.map(({ name, level }) => (level ? `${name}: ${level}` : name)).join("  ·  ")}
            </div>
        </div>
    )
}

/** Project / achievement / activity list (title + description; project items may be verified). */
const TitleDescBlock = ({ block, accent, scale }: CvBlockRenderProps) => {
    if (block.items.length === 0) {
        return null
    }
    return (
        <div>
            <SectionTitle title={block.title} accent={accent} scale={scale} />
            {block.items.map((item: CvBlockItem) => {
                const f = item.fields
                const verified = item.source === CvBlockItemSource.Verified
                return (
                    <div key={item.id} style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: px(13, scale), fontWeight: 700, color: TEXT_COLOR }}>
                            {str(f.title)}
                            {verified ? (
                                <span style={{ fontSize: px(11, scale), fontWeight: 600, color: accent, marginLeft: 8 }}>✓ StarCi</span>
                            ) : null}
                        </div>
                        {str(f.description) ? (
                            <div style={{ fontSize: px(13, scale), color: TEXT_COLOR, marginTop: 2 }}>{str(f.description)}</div>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}

/** Renders one block by type. */
const CvBlockView = ({ block, accent, scale }: CvBlockRenderProps) => {
    switch (block.type) {
    case BlockType.Personal:
        return <PersonalBlock block={block} accent={accent} scale={scale} />
    case BlockType.Summary:
        return <SummaryBlock block={block} accent={accent} scale={scale} />
    case BlockType.Experience:
        return <ExperienceBlock block={block} accent={accent} scale={scale} />
    case BlockType.Education:
        return <EducationBlock block={block} accent={accent} scale={scale} />
    case BlockType.Skills:
    case BlockType.Interest:
        return <SkillsBlock block={block} accent={accent} scale={scale} />
    case BlockType.Project:
    case BlockType.Achievement:
    case BlockType.Activity:
        return <TitleDescBlock block={block} accent={accent} scale={scale} />
    case BlockType.Certification:
        return <CertificationBlock block={block} accent={accent} scale={scale} />
    case BlockType.Language:
        return <LanguageBlock block={block} accent={accent} scale={scale} />
    default:
        return null
    }
}

/** Props shared by every TEMPLATE (layout) renderer — same data, different arrangement. */
interface CvTemplateProps {
    /** Blocks, already sorted by `order`. */
    blocks: Array<CvBlock>
    /** Accent color for headings/rules (a neutral is passed for the `minimal` template). */
    accent: string
    /** Font-size multiplier — see {@link scaleFactorOf}. */
    scale: number
}

/** Block types that go into the narrow LEFT column of the two-column (`sidebar`) template. */
const SIDEBAR_BLOCK_TYPES: ReadonlySet<BlockType> = new Set([
    BlockType.Skills,
    BlockType.Interest,
    BlockType.Language,
    BlockType.Certification,
])

/** Monochrome ink for the `minimal` template (no accent color). */
const MINIMAL_ACCENT = "#111111"

/** classic (default) — every block stacked in one column with accent section
 * rules. The NAME renders as plain foreground ink (TEXT_COLOR), not the accent
 * — accent is reserved for the section-title rules only (thầy: "mẫu cổ điển để
 * text-foreground"). Personal is special-cased (mirrors modern/sidebar below)
 * so only its name color is overridden; the rest still flow through the
 * generic `CvBlockView` with the real accent for their section headings. */
const ClassicTemplate = ({ blocks, accent, scale }: CvTemplateProps) => {
    const personal = blocks.find((block) => block.type === BlockType.Personal)
    const rest = blocks.filter((block) => block.type !== BlockType.Personal)
    return (
        <div style={{ padding: "40px 44px" }}>
            {personal ? <PersonalBlock block={personal} accent={accent} scale={scale} nameColor={TEXT_COLOR} /> : null}
            {rest.map((block) => <CvBlockView key={block.id} block={block} accent={accent} scale={scale} />)}
        </div>
    )
}

/** modern — an accent header band (name + contacts) over a single-column body. */
const ModernTemplate = ({ blocks, accent, scale }: CvTemplateProps) => {
    const personal = blocks.find((block) => block.type === BlockType.Personal)
    const rest = blocks.filter((block) => block.type !== BlockType.Personal)
    const f = personal ? singleFields(personal) : {}
    const contacts = [
        str(f.email),
        str(f.phone),
        str(f.location),
        str(f.birthDate),
        str(f.linkedinUrl),
        str(f.githubUsername),
    ].filter((value) => value.length > 0)
    return (
        <div>
            {personal ? (
                <div style={{ background: accent, color: "#ffffff", padding: "28px 44px" }}>
                    {str(f.name) ? (
                        <div style={{ fontSize: px(26, scale), fontWeight: 700, lineHeight: 1.15 }}>{str(f.name)}</div>
                    ) : null}
                    {str(f.role) ? (
                        <div style={{ fontSize: px(14, scale), opacity: 0.9, marginTop: 2 }}>{str(f.role)}</div>
                    ) : null}
                    {contacts.length > 0 ? (
                        <div style={{ fontSize: px(12, scale), opacity: 0.9, marginTop: 8 }}>{contacts.join("  ·  ")}</div>
                    ) : null}
                </div>
            ) : null}
            <div style={{ padding: "20px 44px 40px" }}>
                {rest.map((block) => <CvBlockView key={block.id} block={block} accent={accent} scale={scale} />)}
            </div>
        </div>
    )
}

/** sidebar — full-width name header, then a compact left column + a main column. */
const SidebarTemplate = ({ blocks, accent, scale }: CvTemplateProps) => {
    const personal = blocks.find((block) => block.type === BlockType.Personal)
    const body = blocks.filter((block) => block.type !== BlockType.Personal)
    const sideBlocks = body.filter((block) => SIDEBAR_BLOCK_TYPES.has(block.type))
    const mainBlocks = body.filter((block) => !SIDEBAR_BLOCK_TYPES.has(block.type))
    return (
        <div style={{ padding: "36px 40px" }}>
            {personal ? <PersonalBlock block={personal} accent={accent} scale={scale} /> : null}
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
                <div style={{ width: "34%", flexShrink: 0 }}>
                    {sideBlocks.map((block) => <CvBlockView key={block.id} block={block} accent={accent} scale={scale} />)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {mainBlocks.map((block) => <CvBlockView key={block.id} block={block} accent={accent} scale={scale} />)}
                </div>
            </div>
        </div>
    )
}

/** minimal — monochrome (no accent color), generous whitespace, one column. */
const MinimalTemplate = ({ blocks, scale }: CvTemplateProps) => (
    <div style={{ padding: "48px 52px" }}>
        {blocks.map((block) => <CvBlockView key={block.id} block={block} accent={MINIMAL_ACCENT} scale={scale} />)}
    </div>
)

/** Template registry — `CvHtmlDocument` dispatches on `doc.style.template`. */
const TEMPLATES: Record<CvTemplate, (props: CvTemplateProps) => React.ReactElement> = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    sidebar: SidebarTemplate,
    minimal: MinimalTemplate,
}

/** Props for {@link CvHtmlDocument}. */
export interface CvHtmlDocumentProps {
    /** The CV document to render. */
    doc: CvDocument
}

/**
 * The rendered CV "paper" — inline-styled, portable, single source for preview
 * + export. Dispatches to the template selected by `doc.style.template` (all
 * templates consume the same block data + funnel through the same serialize
 * path, so preview / PDF / Word never drift). Blocks render in `order`.
 *
 * @param props - {@link CvHtmlDocumentProps}
 */
export const CvHtmlDocument = ({ doc }: CvHtmlDocumentProps) => {
    const accent = doc.style.accent || "#E84393"
    const fontFamily = fontFamilyOf(doc.style.font)
    const scale = scaleFactorOf(doc.style.fontScale)
    const blocks = [...doc.blocks].sort((a, b) => a.order - b.order)
    const Template = TEMPLATES[doc.style.template ?? "classic"] ?? ClassicTemplate
    return (
        <div
            data-cv-root
            style={{
                fontFamily,
                color: TEXT_COLOR,
                fontSize: px(13, scale),
                lineHeight: 1.5,
                background: "#ffffff",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Template blocks={blocks} accent={accent} scale={scale} />
        </div>
    )
}

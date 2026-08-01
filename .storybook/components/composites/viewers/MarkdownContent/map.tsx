import React from "react"
// ATOM GAP — `Accordion` and `Table` (compound children: `.Item`/`.Heading`/`.Trigger`/`.Panel`/
// `.Body`/`.Column`/`.Cell`) come straight from the vendor because no house atom wraps either
// compound. `atoms/navigation/Accordion` wraps a DIFFERENT vendor primitive (`Disclosure`/
// `DisclosureGroup`) behind a data-driven `items` array — it cannot take this viewer's panels,
// which react-markdown dispatches to `accordionblock`/`accordionpanel` one node at a time, never
// as one upfront array a composite could pass through `items`. `composites/data/Table` is a
// separate, config-driven composite (`columns`/`items` data, `children` forbidden by its own
// contract) — a GFM table arrives as an already-rendered `thead`/`tbody` children tree, which
// cannot be reduced back into that shape without re-parsing the table by hand.
import { Accordion, Table as HeroTable, cn } from "@heroui/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { CodeToHtml } from "@sb-components/composites/viewers/MarkdownContent/CodeToHtml"
import { MermaidDiagram } from "@sb-components/composites/viewers/MarkdownContent/MermaidDiagram"
import { TabsBlock, TabPane } from "@sb-components/composites/viewers/MarkdownContent/TabsBlock"
import {
    MarkdownTable,
    MarkdownTableBody,
    MarkdownTableColumn,
    MarkdownTableHead,
    MarkdownTableRow,
} from "@sb-components/composites/viewers/MarkdownContent/MarkdownTableParts"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * The element-renderer MAP for `MarkdownContent` — one file so the whole grammar
 * (headings, tables, code, mermaid, the custom directive tags) is readable in one
 * place, same split as `src`'s own `map.tsx`.
 *
 * SCOPE (teacher's approved pass, 2026-07-29, in priority order): Shiki syntax
 * highlighting · mermaid diagrams · `:::tab`/`:::code`/`:::preview` → Preview↔Code
 * tabs · GFM tables → real HeroUI `Table` · `::::accordion`/`:::panel` → real
 * HeroUI `Accordion` with the correct surface chrome · `:::muted` + `:::chip` +
 * image captions + link routing + heading anchors. NOT in scope this pass:
 * `arcSections`, `plain` mode, the ` ```mdx ` live-render fence, the ` ```layout `
 * fence — each is its own viewer with its own runtime; half-porting one leaves a
 * body that looks finished and renders wrong.
 *
 * Vertical rhythm is owned by the single wrapper in `MarkdownContent.tsx` (compact
 * measure) or, in reading measure, by a plain `<div className={blockMy}>` wrapped
 * around each block-level renderer's own output right here — margin is a seam
 * between two blocks (`principles/margin.md`), so it is written at the one place
 * that sees both, not passed as a `className` prop into the block's own component
 * (COMPOSITE-4: `CodeToHtml` / `MermaidDiagram` / `MarkdownTable` take no `className`).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** UI copy for the code/table/mermaid chrome. Storybook has no i18n-aware runtime
 * for this tree (see the file header on `MarkdownContent.tsx`), so — like every
 * other composite in this design system — the copy is a hardcoded constant
 * instead of a `useTranslations()` call. Values mirror `src/messages/vi.json`'s
 * `markdown.*` keys so a reader comparing the two sees the same words. */
const TABLE_ARIA_LABEL = "Content table"
const MERMAID_LOADING_LABEL = "Drawing diagram..."
const MERMAID_EXPAND_LABEL = "Expand diagram"
const MERMAID_FALLBACK_LABEL = "Figure"
const HEADING_ANCHOR_LABEL = "Link to this section"

/** Anything the parser hands back with only children — most of the grammar. */
export interface MarkdownNodeProps {
    /** Whatever the parser put inside this element. */
    children?: React.ReactNode
}

/** A link node: the payload decides the target, the viewer only decides the skin. */
export interface MarkdownLinkProps extends MarkdownNodeProps {
    /** Link target as authored. */
    href?: string
}

/** An image node — a raw URL plus its alt text, both straight from the payload. */
export interface MarkdownImageProps {
    /** Image source as authored. */
    src?: string
    /** Alt text as authored; a non-empty alt doubles as a real figure caption. */
    alt?: string
}

/** A code node. A fenced block arrives with `language-*`; anything else is inline. */
export interface MarkdownCodeProps extends MarkdownNodeProps {
    /** `language-*` for a fenced block, absent for inline code. */
    className?: string
}

/** One `:::panel{title="…"}` inside an `::::accordion` block. */
export interface MarkdownPanelProps extends MarkdownNodeProps {
    /** Trigger-row title carried by the directive attribute. */
    title?: string
}

/** The `:::chip` directive's rewritten tag — one `|`-joined line of keywords. */
export interface MarkdownChipBlockProps {
    /** `|`-joined keyword list, one per authored line (see `remarkChip` in `MarkdownContent.tsx`). */
    items?: string
}

/** Config for one {@link buildTocHeading} level. */
interface TocHeadingConfig {
    /** Heading depth surfaced in the outline. */
    level: 2 | 3 | 4
    /** Tailwind text-size class. */
    sizeClass: string
    /** Tailwind margin class (asymmetric — reading measure only). */
    marginClass: string
    /** `true` (reading measure only) → render the hover `#` deep-link affordance. */
    showAnchor: boolean
}

/**
 * Recursively flattens a React children tree to its plain-text content — used to
 * derive a stable heading slug (and the "on this page" outline label) from the
 * rendered heading nodes.
 * @param node - The React node to read text from.
 * @returns The concatenated text content.
 */
const getNodeText = (node: React.ReactNode): string => {
    if (node === null || node === undefined || typeof node === "boolean") {
        return ""
    }
    if (typeof node === "string" || typeof node === "number") {
        return String(node)
    }
    if (Array.isArray(node)) {
        return node.map(getNodeText).join("")
    }
    if (React.isValidElement(node)) {
        return getNodeText((node.props as MarkdownNodeProps).children)
    }
    return ""
}

/**
 * Slugify heading text into a URL-safe anchor id (diacritics stripped, Vietnamese
 * Vietnamese d-with-stroke folded to `d`, non-alphanumerics collapsed to single hyphens). Deterministic so the
 * rendered heading id and any "on this page" outline reading it from the DOM agree.
 * @param text - The raw heading text.
 * @returns The anchor slug.
 */
const slugify = (text: string): string =>
    text
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[đĐ]/g, "d") // vn-ok: slug transliteration of the VI letter
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

/**
 * Heading renderer factory: renders a section heading carrying a slug `id` +
 * `data-toc` markers so an "on this page" rail can scan the rendered article
 * (`[data-toc]`) and anchor-scroll to it. `scroll-mt-20` clears a sticky navbar
 * when jumped to. The hover `#` deep-link only renders in reading measure — cards
 * / chat / modals have no shareable url for it.
 * @param config - {@link TocHeadingConfig}
 */
const buildTocHeading = ({ level, sizeClass, marginClass, showAnchor }: TocHeadingConfig) =>
    ({ children }: MarkdownNodeProps) => {
        const Tag = `h${level}` as "h2" | "h3" | "h4"
        const text = getNodeText(children)
        const id = slugify(text)
        return (
            <Tag
                id={id}
                data-toc=""
                data-toc-level={level}
                data-toc-label={text}
                className={cn("group scroll-mt-20 font-semibold", marginClass, sizeClass)}
            >
                {children}
                {showAnchor ? (
                    <a
                        href={`#${id}`}
                        aria-label={HEADING_ANCHOR_LABEL}
                        className="ml-2 text-muted no-underline opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        #
                    </a>
                ) : null}
            </Tag>
        )
    }

/** Params for {@link buildMarkdownRenderers}. */
export interface MarkdownRenderersParams {
    /** True when the Storybook toolbar theme is dark; selects mermaid/Shiki themes. */
    isDark: boolean
    /** Reading-grade typography (bigger type, generous rhythm) vs the compact scale. */
    reading: boolean
    /** Figure captions keyed by trimmed mermaid source, paired from the following paragraph. */
    mermaidCaptions: Record<string, string>
    /** `true` → tag the reused atoms (`SnippetIcon`, `Chip`) for a BlockAnatomy panel. */
}

/**
 * Builds the element-renderer map handed to `ReactMarkdown`. See the file header
 * for scope; each renderer stays margin-free in compact measure (the wrapper in
 * `MarkdownContent.tsx` owns the uniform rhythm there) and carries its own
 * asymmetric margin in reading measure.
 * @param params - {@link MarkdownRenderersParams}
 */
export const buildMarkdownRenderers = ({ isDark, reading, mermaidCaptions }: MarkdownRenderersParams) => {
    const blockMy = reading ? "my-4" : "my-3"
    // Link text rides the same body scale as the surrounding prose.
    const linkSize = reading ? "base" : "sm"

    return {
        h1: ({ children }: MarkdownNodeProps) => (
            <h1 className={cn("font-semibold text-foreground", reading ? "mt-8 mb-3 text-2xl" : "mt-6 mb-2 text-xl")}>{children}</h1>
        ),
        h2: buildTocHeading({
            level: 2,
            sizeClass: reading ? "text-xl" : "text-lg",
            marginClass: reading ? "mt-8 mb-3" : "mt-6 mb-2",
            showAnchor: reading,
        }),
        h3: buildTocHeading({
            level: 3,
            sizeClass: reading ? "text-lg" : "text-base",
            marginClass: reading ? "mt-6 mb-2" : "mt-4 mb-2",
            showAnchor: reading,
        }),
        h4: buildTocHeading({
            level: 4,
            sizeClass: reading ? "text-base" : "text-sm",
            marginClass: reading ? "mt-6 mb-2" : "mt-4 mb-2",
            showAnchor: reading,
        }),
        p: ({ children }: MarkdownNodeProps) => (
            <p className={cn("text-foreground", reading ? "my-3 text-base leading-7" : "my-2 text-sm leading-6")}>{children}</p>
        ),
        ul: ({ children }: MarkdownNodeProps) => (
            <ul className={cn("list-disc pl-6", reading ? "my-3 space-y-1" : "my-2 space-y-1")}>{children}</ul>
        ),
        ol: ({ children }: MarkdownNodeProps) => (
            <ol className={cn("list-decimal pl-6", reading ? "my-3 space-y-1" : "my-2 space-y-1")}>{children}</ol>
        ),
        li: ({ children }: MarkdownNodeProps) => (
            <li className={cn("text-foreground", reading ? "text-base leading-7" : "text-sm leading-6")}>{children}</li>
        ),
        strong: ({ children }: MarkdownNodeProps) => (
            <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }: MarkdownNodeProps) => <em className="italic">{children}</em>,
        // Internal (`/`-prefixed) links stay in the same tab; anything else is external and opens a
        // new tab. Reuses the `Typography` atom's `isLink` branch (HeroUI `Link` + a11y) rather than
        // hand-rolling an `<a>` — the atom already owns exactly this link skin everywhere else.
        a: ({ href, children }: MarkdownLinkProps) => {
            const isInternal = typeof href === "string" && href.startsWith("/")
            return (
                <Typography
                    size={linkSize}
                    isLink
                    href={href}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noopener noreferrer"}
                    text={children}
                />
            )
        },
        blockquote: ({ children }: MarkdownNodeProps) => (
            <blockquote className={cn("border-l-2 border-default pl-3 text-muted", reading ? "my-4" : "my-3")}>{children}</blockquote>
        ),
        hr: () => <hr className={cn("border-default", reading ? "my-8" : "my-6")} />,
        // Markdown `![caption](src)`: a non-empty alt doubles as a real figure caption; an empty
        // alt renders a bare (decorative) image — same rule `src` uses.
        img: ({ src, alt }: MarkdownImageProps) => (
            alt ? (
                <figure className={blockMy}>
                    <img src={src} alt={alt} className="w-full rounded-2xl" />
                    <figcaption className="mt-2 text-center text-sm italic text-muted">{alt}</figcaption>
                </figure>
            ) : (
                <img src={src} alt="" className={cn("w-full rounded-2xl", blockMy)} />
            )
        ),
        // GFM table → real HeroUI `Table` compound (see the file header on `MarkdownTableParts.tsx`
        // for why this is NOT the config-driven `composites/data/Table`). The block-rhythm margin
        // (COMPOSITE-4: `MarkdownTable` takes no `className`) is owned here, by the plain wrapping
        // `<div>` — margin is a seam between two blocks, not a prop of either one.
        table: ({ children }: MarkdownNodeProps) => (
            <div className={blockMy}>
                <MarkdownTable ariaLabel={TABLE_ARIA_LABEL}>{children}</MarkdownTable>
            </div>
        ),
        thead: MarkdownTableHead,
        tbody: MarkdownTableBody,
        tr: MarkdownTableRow,
        th: MarkdownTableColumn,
        td: ({ children }: MarkdownNodeProps) => <HeroTable.Cell>{children}</HeroTable.Cell>,
        // A fenced block's inner `code` carries `language-*`; anything else is inline.
        code: ({ children, className }: MarkdownCodeProps) => {
            if (className?.startsWith("language-")) {
                return children
            }
            return (
                // inset-exception: inline-code geometry, wider than tall by nature, not a surface inset
                <code className="rounded-md bg-default px-1 py-0 font-mono text-sm text-foreground [overflow-wrap:anywhere]">
                    {children}
                </code>
            )
        },
        // Fenced block dispatch: `mermaid` → diagram, everything else → Shiki.
        pre: ({ children }: MarkdownNodeProps) => {
            const child = React.Children.only(children) as React.ReactElement<MarkdownCodeProps>
            const lang = /language-(\w+)/.exec(child.props.className ?? "")?.[1] ?? "text"
            const code = String(child.props.children ?? "").replace(/\n$/, "")
            // Block-rhythm margin (COMPOSITE-4: neither viewer takes `className`) owned by the
            // plain wrapping `<div>` — margin is a seam between two blocks, not either one's prop.
            if (lang.toLowerCase() === "mermaid") {
                return (
                    <div className={blockMy}>
                        <MermaidDiagram
                            code={code}
                            theme={isDark ? "dark" : "default"}
                            loadingLabel={MERMAID_LOADING_LABEL}
                            expandLabel={MERMAID_EXPAND_LABEL}
                            caption={mermaidCaptions[code.trim()]}
                            fallbackLabel={MERMAID_FALLBACK_LABEL}
                        />
                    </div>
                )
            }
            return (
                <div className={blockMy}>
                    <CodeToHtml
                        code={code}
                        language={lang}
                        theme={isDark ? "material-theme-darker" : "material-theme-lighter"}

                    />
                </div>
            )
        },
        // Custom `:::muted` directive tags (see `remarkMuted` in `MarkdownContent.tsx`): small,
        // muted label text. `[&_*]:text-muted` forces the muted colour onto any inner `<p>`.
        mutedblock: ({ children }: MarkdownNodeProps) => (
            <div className="text-sm font-semibold text-muted [&_*]:text-muted">{children}</div>
        ),
        mutedtext: ({ children }: MarkdownNodeProps) => (
            <span className="text-sm font-semibold text-muted">{children}</span>
        ),
        // Custom `:::chip` directive tag: a wrapped row of chips, one per authored keyword line.
        // Reuses the `Chip` ATOM (soft/neutral) rather than HeroUI `Chip` directly.
        chipblock: ({ items }: MarkdownChipBlockProps) => (
            <StackH
                as="span"
                wrap
                gap={3}
                pattern="chip-row"
                className="my-2"
                body={String(items ?? "").split("|").filter(Boolean).map((keyword, index) => (
                    <Chip key={index} tone="default" text={keyword} />
                ))}
            />
        ),
        // :::tab → [ Preview | Code ] tabs; code/preview panes carry `kind` so `TabsBlock` matches them.
        tabblock: ({ children }: MarkdownNodeProps) => <TabsBlock>{children}</TabsBlock>,
        tabcode: ({ children }: MarkdownNodeProps) => <TabPane kind="code">{children}</TabPane>,
        tabpreview: ({ children }: MarkdownNodeProps) => <TabPane kind="preview">{children}</TabPane>,
        // ::::accordion / :::panel{title} → the CORRECT HeroUI `Accordion` compound directly (this
        // composite used to route this through the Disclosure-based `Accordion` ATOM, which is a
        // different underlying primitive with no surface chrome hook — wrong fit for a nested
        // "card inside a reading column" look). `variant="default"` keeps the item separator
        // FULL-BLEED, with the light hairline `--separator` re-point so dividers read the same as
        // the `SurfaceListCard` family; `border` delineates it as a nested surface.
        accordionblock: ({ children }: MarkdownNodeProps) => (
            <Accordion
                variant="default"
                style={{ "--separator": "color-mix(in oklab, var(--surface-foreground) 6%, transparent)" } as React.CSSProperties}
                className={cn("overflow-hidden border border-default bg-surface", blockMy)}
            >
                {children}
            </Accordion>
        ),
        accordionpanel: ({ title, children }: MarkdownPanelProps) => (
            <Accordion.Item aria-label={String(title ?? "")}>
                <Accordion.Heading>
                    <Accordion.Trigger>
                        <StackH
                            gap={4}
                            justify="between"
                            classNames={["w-full"]}
                            className="text-start"
                            body={
                                <>
                                    <span className={reading ? "text-base font-semibold" : "text-sm font-semibold"}>{title}</span>
                                    <Accordion.Indicator />
                                </>
                            }
                        />
                    </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                    <Accordion.Body>
                        <div className="space-y-2">{children}</div>
                    </Accordion.Body>
                </Accordion.Panel>
            </Accordion.Item>
        ),
    }
}

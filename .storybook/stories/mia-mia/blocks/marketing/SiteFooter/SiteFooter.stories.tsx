import type { Meta, StoryObj } from "@storybook/nextjs"
import { SiteFooter } from "@sb-components/mia-mia/blocks/marketing/SiteFooter"
import type { FooterColumn } from "@sb-components/mia-mia/blocks/marketing/SiteFooter"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SiteFooter`: the wordmark + tagline beside link columns, over a ruled
 * bottom bar. Presentational and props-only — every prop is required, there is
 * no fallback value, so each leaf below shows the prop's EFFECT by varying its
 * shape (length, item count) rather than an on/off switch.
 *
 * One prop = one leaf: `brand` · `tagline` · `columns` · `copyright` · `madeIn`.
 */
const meta: Meta<typeof SiteFooter> = {
    title: "MiaMia/SiteFooter",
    component: SiteFooter,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SiteFooter>

/**
 * SiteFooter composes no other tiered component — every node it renders is
 * plain markup (`footer` / `span` / `p` / `div` / `ul` / `a`), never an atom,
 * frame, or composite of ours. There is nothing with its own story to badge,
 * so this table stays empty on purpose rather than inventing parts that do
 * not exist.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {}

const BASE_TAGLINE = "Learn English, pass the exam — real practice, real play, exam together."
const BASE_COPYRIGHT = "© 2026 Mia Mia. Learn English, pass the exam."
const BASE_MADE_IN = "Made in Vietnam"

const THREE_COLUMNS: Array<FooterColumn> = [
    { key: "learn", heading: "Learn", items: [
        { label: "National exam practice", href: "#" },
        { label: "Vocabulary", href: "#" },
        { label: "Topics and grammar", href: "#" },
        { label: "Virtual exam room", href: "#" },
    ] },
    { key: "company", heading: "Mia Mia", items: [
        { label: "About us", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Privacy", href: "#" },
    ] },
    { key: "follow", heading: "Follow", items: [
        { label: "Facebook", href: "#" },
        { label: "Instagram", href: "#" },
        { label: "TikTok", href: "#" },
        { label: "YouTube", href: "#" },
    ] },
]

/** Leaf for prop `brand` — the wordmark text beside the tilted square glyph. */
export const Brand: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SiteFooter"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `brand`"
                reason="brand is the wordmark text printed next to the decorative rotated square, the same word the header repeats at the top of the page."
                states={[
                    {
                        name: "brand = \"mia mia\"",
                        why: "The two-word lowercase wordmark the product actually ships with sits comfortably beside the glyph, with room to spare in the column.",
                        code: `<SiteFooter
    brand="mia mia"
    tagline="${BASE_TAGLINE}"
    columns={THREE_COLUMNS}
    copyright="${BASE_COPYRIGHT}"
    madeIn="${BASE_MADE_IN}"
/>`,
                        render: (
                            <SiteFooter
                                brand="mia mia"
                                tagline={BASE_TAGLINE}
                                columns={THREE_COLUMNS}
                                copyright={BASE_COPYRIGHT}
                                madeIn={BASE_MADE_IN}
                            />
                        ),
                    },
                    {
                        name: "brand = \"Mia Mia Academy\"",
                        why: "A longer wordmark still sits on one line beside the glyph and the tagline underneath still wraps to its own width, confirming the column has no fixed budget reserved for the wordmark's length.",
                        code: `<SiteFooter
    brand="Mia Mia Academy"
    tagline="${BASE_TAGLINE}"
    columns={THREE_COLUMNS}
    copyright="${BASE_COPYRIGHT}"
    madeIn="${BASE_MADE_IN}"
/>`,
                        render: (
                            <SiteFooter
                                brand="Mia Mia Academy"
                                tagline={BASE_TAGLINE}
                                columns={THREE_COLUMNS}
                                copyright={BASE_COPYRIGHT}
                                madeIn={BASE_MADE_IN}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `tagline` — the one-line description under the wordmark, capped at `max-w-[26ch]`. */
export const Tagline: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SiteFooter"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `tagline`"
                reason="tagline is the short pitch under the wordmark, boxed to 26 characters wide so it wraps to a short paragraph rather than running the full column width."
                states={[
                    {
                        name: "tagline = \"Real practice, real results.\"",
                        why: "A short tagline fits on a single line inside the 26-character box, leaving most of the column's height for nothing but the wordmark above it.",
                        code: `<SiteFooter
    brand="mia mia"
    tagline="Real practice, real results."
    columns={THREE_COLUMNS}
    copyright="${BASE_COPYRIGHT}"
    madeIn="${BASE_MADE_IN}"
/>`,
                        render: (
                            <SiteFooter
                                brand="mia mia"
                                tagline="Real practice, real results."
                                columns={THREE_COLUMNS}
                                copyright={BASE_COPYRIGHT}
                                madeIn={BASE_MADE_IN}
                            />
                        ),
                    },
                    {
                        name: "tagline = full pitch sentence",
                        why: "The full pitch sentence wraps across three lines inside the same 26-character box instead of stretching the column wider, so a longer tagline changes the wordmark column's height, never its width.",
                        code: `<SiteFooter
    brand="mia mia"
    tagline="${BASE_TAGLINE}"
    columns={THREE_COLUMNS}
    copyright="${BASE_COPYRIGHT}"
    madeIn="${BASE_MADE_IN}"
/>`,
                        render: (
                            <SiteFooter
                                brand="mia mia"
                                tagline={BASE_TAGLINE}
                                columns={THREE_COLUMNS}
                                copyright={BASE_COPYRIGHT}
                                madeIn={BASE_MADE_IN}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `columns` — the link columns, `grid-cols-2` below `md`, `grid-cols-4` from `md` (wordmark + N columns share that row). */
export const Columns: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SiteFooter"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `columns`"
                reason="columns is the list of link groups the caller passes in; the grid has four slots from `md` up, one of which is always the wordmark, so the column count decides how full that row reads."
                states={[
                    {
                        name: "columns = 1 group (\"Learn\")",
                        why: "With the wordmark taking one grid slot and a single column taking the second, the row leaves two of its four `md` slots empty — the grid never stretches the lone column to fill the gap.",
                        code: `<SiteFooter
    brand="mia mia"
    tagline="${BASE_TAGLINE}"
    columns={[THREE_COLUMNS[0]]}
    copyright="${BASE_COPYRIGHT}"
    madeIn="${BASE_MADE_IN}"
/>`,
                        render: (
                            <SiteFooter
                                brand="mia mia"
                                tagline={BASE_TAGLINE}
                                columns={[THREE_COLUMNS[0]]}
                                copyright={BASE_COPYRIGHT}
                                madeIn={BASE_MADE_IN}
                            />
                        ),
                    },
                    {
                        name: "columns = 3 groups (Learn, Mia Mia, Follow)",
                        why: "Three link columns plus the wordmark fill the `md` grid's four slots exactly, one clean row — the shape this block is actually shipped with on the marketing pages.",
                        code: `<SiteFooter
    brand="mia mia"
    tagline="${BASE_TAGLINE}"
    columns={THREE_COLUMNS}
    copyright="${BASE_COPYRIGHT}"
    madeIn="${BASE_MADE_IN}"
/>`,
                        render: (
                            <SiteFooter
                                brand="mia mia"
                                tagline={BASE_TAGLINE}
                                columns={THREE_COLUMNS}
                                copyright={BASE_COPYRIGHT}
                                madeIn={BASE_MADE_IN}
                            />
                        ),
                    },
                    {
                        name: "columns = 4 groups (+ \"Support\")",
                        why: "A fourth column pushes the row past the four `md` slots the wordmark already shares — the grid wraps, so the fourth column drops to its own second row under the wordmark's column instead of forcing a fifth slot onto the first row.",
                        code: `<SiteFooter
    brand="mia mia"
    tagline="${BASE_TAGLINE}"
    columns={[
        ...THREE_COLUMNS,
        { key: "support", heading: "Support", items: [
            { label: "Help center", href: "#" },
            { label: "FAQ", href: "#" },
            { label: "Status", href: "#" },
        ] },
    ]}
    copyright="${BASE_COPYRIGHT}"
    madeIn="${BASE_MADE_IN}"
/>`,
                        render: (
                            <SiteFooter
                                brand="mia mia"
                                tagline={BASE_TAGLINE}
                                columns={[
                                    ...THREE_COLUMNS,
                                    { key: "support", heading: "Support", items: [
                                        { label: "Help center", href: "#" },
                                        { label: "FAQ", href: "#" },
                                        { label: "Status", href: "#" },
                                    ] },
                                ]}
                                copyright={BASE_COPYRIGHT}
                                madeIn={BASE_MADE_IN}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `copyright` — the left-aligned bottom-bar line, next to `madeIn`. */
export const Copyright: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SiteFooter"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `copyright`"
                reason="copyright is the bottom bar's left line — the legal notice, printed plain with no link and no icon."
                states={[
                    {
                        name: "copyright = \"© 2026 Mia Mia.\"",
                        why: "A bare copyright notice sits well clear of `madeIn` on the same row from `sm` up, since the bar only stacks the two lines below that breakpoint.",
                        code: `<SiteFooter
    brand="mia mia"
    tagline="${BASE_TAGLINE}"
    columns={THREE_COLUMNS}
    copyright="© 2026 Mia Mia."
    madeIn="${BASE_MADE_IN}"
/>`,
                        render: (
                            <SiteFooter
                                brand="mia mia"
                                tagline={BASE_TAGLINE}
                                columns={THREE_COLUMNS}
                                copyright="© 2026 Mia Mia."
                                madeIn={BASE_MADE_IN}
                            />
                        ),
                    },
                    {
                        name: "copyright = notice + pitch sentence",
                        why: "The longer notice still fits the bottom bar's row beside `madeIn` from `sm` up — the bar only wraps to two stacked lines once the pair genuinely runs out of width, at the narrowest sizes.",
                        code: `<SiteFooter
    brand="mia mia"
    tagline="${BASE_TAGLINE}"
    columns={THREE_COLUMNS}
    copyright="${BASE_COPYRIGHT}"
    madeIn="${BASE_MADE_IN}"
/>`,
                        render: (
                            <SiteFooter
                                brand="mia mia"
                                tagline={BASE_TAGLINE}
                                columns={THREE_COLUMNS}
                                copyright={BASE_COPYRIGHT}
                                madeIn={BASE_MADE_IN}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `madeIn` — the right-aligned bottom-bar note, beside `copyright`. */
export const MadeIn: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SiteFooter"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `madeIn`"
                reason="madeIn is the bottom bar's right line — a short provenance note, the one place on the page that says where the product is built."
                states={[
                    {
                        name: "madeIn = \"Made in Vietnam\"",
                        why: "The short note the product ships with sits at the far right of the bottom bar, level with the copyright line on the same row.",
                        code: `<SiteFooter
    brand="mia mia"
    tagline="${BASE_TAGLINE}"
    columns={THREE_COLUMNS}
    copyright="${BASE_COPYRIGHT}"
    madeIn="Made in Vietnam"
/>`,
                        render: (
                            <SiteFooter
                                brand="mia mia"
                                tagline={BASE_TAGLINE}
                                columns={THREE_COLUMNS}
                                copyright={BASE_COPYRIGHT}
                                madeIn="Made in Vietnam"
                            />
                        ),
                    },
                    {
                        name: "madeIn = \"Made with love in Ho Chi Minh City\"",
                        why: "A longer note still reads as one line at the bar's right edge, confirming the slot has no fixed character budget of its own beyond the row wrapping the whole bar takes on below `sm`.",
                        code: `<SiteFooter
    brand="mia mia"
    tagline="${BASE_TAGLINE}"
    columns={THREE_COLUMNS}
    copyright="${BASE_COPYRIGHT}"
    madeIn="Made with love in Ho Chi Minh City"
/>`,
                        render: (
                            <SiteFooter
                                brand="mia mia"
                                tagline={BASE_TAGLINE}
                                columns={THREE_COLUMNS}
                                copyright={BASE_COPYRIGHT}
                                madeIn="Made with love in Ho Chi Minh City"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

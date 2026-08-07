import type { Meta, StoryObj } from "@storybook/nextjs"
import { SiteHeader } from "@sb-components/mia-mia/blocks/marketing/SiteHeader"
import type { SiteNavLink } from "@sb-components/mia-mia/blocks/marketing/SiteHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SiteHeader`: the marketing top bar — wordmark, primary nav (hidden
 * below `md`), and the one `ChunkyButton` CTA. Presentational and props-only —
 * every prop is required, so each leaf shows the prop's EFFECT by varying its
 * shape rather than an on/off switch.
 *
 * One prop = one leaf: `brand` · `links` · `ctaLabel`. `ctaHref` is deliberately
 * left without a leaf — see the note above {@link CtaLabel}.
 */
const meta: Meta<typeof SiteHeader> = {
    title: "MiaMia/SiteHeader",
    component: SiteHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SiteHeader>

/**
 * The only composed part is the CTA — everything else (`nav` / `span` / `a`)
 * is plain markup with no story of its own to badge.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ChunkyButton": { tier: "atom", role: "the single CTA into the app; the bar never hand-rolls its own button chrome", storyId: "miamia-chunkybutton--default" },
}

const BASE_LINKS: Array<SiteNavLink> = [
    { label: "Learn", href: "#" },
    { label: "Practice exams", href: "#" },
    { label: "Play", href: "#" },
    { label: "Community", href: "#" },
]

const BASE_CTA_LABEL = "Start learning"
const CTA_HREF = "#"

/** Leaf for prop `brand` — the wordmark text beside the tilted square glyph. */
export const Brand: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SiteHeader"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `brand`"
                reason="brand is the wordmark text printed next to the decorative rotated square, the one item pinned to the bar's left edge."
                states={[
                    {
                        name: "brand = \"mia mia\"",
                        why: "The two-word lowercase wordmark the product actually ships with leaves the row plenty of room for the nav links and the CTA on the same line.",
                        code: `<SiteHeader
    brand="mia mia"
    links={BASE_LINKS}
    ctaLabel="${BASE_CTA_LABEL}"
    ctaHref="${CTA_HREF}"
/>`,
                        render: <SiteHeader brand="mia mia" links={BASE_LINKS} ctaLabel={BASE_CTA_LABEL} ctaHref={CTA_HREF} />,
                    },
                    {
                        name: "brand = \"Mia Mia Academy\"",
                        why: "A longer wordmark still sits on the bar's left edge without colliding with the nav links or the CTA — `justify-between` gives each of the three regions its own room instead of a shared fixed width.",
                        code: `<SiteHeader
    brand="Mia Mia Academy"
    links={BASE_LINKS}
    ctaLabel="${BASE_CTA_LABEL}"
    ctaHref="${CTA_HREF}"
/>`,
                        render: <SiteHeader brand="Mia Mia Academy" links={BASE_LINKS} ctaLabel={BASE_CTA_LABEL} ctaHref={CTA_HREF} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `links` — the primary nav row, `hidden` below `md`, `flex` from `md` up. */
export const Links: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SiteHeader"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `links`"
                reason="links is the primary-nav destination list; the bar has no hamburger of its own, so below `md` this whole row simply disappears and only the wordmark and the CTA remain."
                states={[
                    {
                        name: "links = [] (empty)",
                        why: "With nothing to iterate, the nav row renders no anchors at all — the bar quietly falls back to wordmark-and-CTA, the exact shape it also takes on a small screen.",
                        code: `<SiteHeader
    brand="mia mia"
    links={[]}
    ctaLabel="${BASE_CTA_LABEL}"
    ctaHref="${CTA_HREF}"
/>`,
                        render: <SiteHeader brand="mia mia" links={[]} ctaLabel={BASE_CTA_LABEL} ctaHref={CTA_HREF} />,
                    },
                    {
                        name: "links = 4 destinations",
                        why: "Four links is the set this bar ships with — the row it was actually measured against when the layout was built, comfortably inside the space between the wordmark and the CTA.",
                        code: `<SiteHeader
    brand="mia mia"
    links={BASE_LINKS}
    ctaLabel="${BASE_CTA_LABEL}"
    ctaHref="${CTA_HREF}"
/>`,
                        render: <SiteHeader brand="mia mia" links={BASE_LINKS} ctaLabel={BASE_CTA_LABEL} ctaHref={CTA_HREF} />,
                    },
                    {
                        name: "links = 6 destinations",
                        why: "Two more links grow the row further right, since the nav has no wrap rule of its own — the caller is expected to keep the list short rather than the bar reflowing to fit an arbitrary count.",
                        code: `<SiteHeader
    brand="mia mia"
    links={[
        ...BASE_LINKS,
        { label: "Pricing", href: "#" },
        { label: "Blog", href: "#" },
    ]}
    ctaLabel="${BASE_CTA_LABEL}"
    ctaHref="${CTA_HREF}"
/>`,
                        render: (
                            <SiteHeader
                                brand="mia mia"
                                links={[...BASE_LINKS, { label: "Pricing", href: "#" }, { label: "Blog", href: "#" }]}
                                ctaLabel={BASE_CTA_LABEL}
                                ctaHref={CTA_HREF}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `ctaLabel` — the label inside the `ChunkyButton`.
 *
 * `ctaHref` is deliberately given NO leaf of its own: it only sets the anchor's
 * `href`, which changes nothing a story's render can show — there is no visual
 * difference between two href values to enumerate. `ctaLabel` already exercises
 * the same slot's visible behaviour (a longer string growing the button).
 */
export const CtaLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SiteHeader"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `ctaLabel`"
                reason="ctaLabel is the text inside the one `ChunkyButton` the bar renders, the button's chrome and arrow icon owned entirely by that atom."
                states={[
                    {
                        name: "ctaLabel = \"Start learning\"",
                        why: "The short label the product ships with keeps the button compact, sized to the label plus the atom's own padding and trailing arrow.",
                        code: `<SiteHeader
    brand="mia mia"
    links={BASE_LINKS}
    ctaLabel="Start learning"
    ctaHref="${CTA_HREF}"
/>`,
                        render: <SiteHeader brand="mia mia" links={BASE_LINKS} ctaLabel="Start learning" ctaHref={CTA_HREF} />,
                    },
                    {
                        name: "ctaLabel = \"Create your free account today\"",
                        why: "A longer label grows the button wider on the same row rather than wrapping or truncating, since `ChunkyButton` sizes itself to its content — the header just supplies the string.",
                        code: `<SiteHeader
    brand="mia mia"
    links={BASE_LINKS}
    ctaLabel="Create your free account today"
    ctaHref="${CTA_HREF}"
/>`,
                        render: <SiteHeader brand="mia mia" links={BASE_LINKS} ctaLabel="Create your free account today" ctaHref={CTA_HREF} />,
                    },
                ]}
            />
        </div>
    ),
}

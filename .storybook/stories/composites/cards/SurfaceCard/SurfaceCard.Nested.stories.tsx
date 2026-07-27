import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardNestedSection } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher's call, 2026-07-25): `SurfaceCard.Nested` is the
 * CARD-IN-CARD frame — the only thing it adds over `.Base` is: a HEADER BAR sitting
 * INSIDE the frame (eyebrow icon + title + meta), a BODY split into sections by
 * dividers (`items`), a FOOTER bar, and a `radius` corner tier. The header section
 * OUTSIDE the card (label/see-more/action) belongs to `.Base` — NOT repeated here.
 *
 * 2026-07-26 (teacher, THREE INDEPENDENT AXES): `bordered?: boolean` →
 * `variant?: SurfaceCardVariant` (`"surface" | "nested"`), `compact?: boolean` →
 * `radius?: "xl" | "3xl"`. The two old single-value leaves (`Bordered`, `Compact`)
 * merge into two leaves named after the PROP (`Variant`, `Radius`), each rendering
 * the full union side by side instead of just the value that differs from default.
 *
 * 2026-07-27: migrated to the `states` API (§8) — each leaf's stacked renders are
 * now `states[]` entries with their own `why`/`code`, instead of hand-labelled
 * siblings inside `children`.
 */
const meta: Meta<typeof SurfaceCard.Nested> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCard.Nested",
    component: SurfaceCard.Nested,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Nested>

const relatedItems: ReadonlyArray<SurfaceCardNestedSection> = [
    {
        key: "normalization",
        eyebrow: "Relational databases",
        title: "Data normalization and normal forms",
        content: (
            <Typography type="body-sm" color="muted">
                Normalization splits data into multiple tables to reduce redundancy and update anomalies.
            </Typography>
        ),
        anatPart: "Section",
    },
    {
        key: "denormalize",
        eyebrow: "Database review deck",
        title: "When should you denormalize to optimize reads?",
        anatPart: "Section",
    },
]

/**
 * Default — `variant="surface"` (default): the card sits DIRECTLY on `bg-background`
 * so it owns its own background + shadow. Body is built from `items` (a REPEATING
 * list → data, not children).
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Nested"
                tier="composite"
                leaf="Default"
                renderClassName="max-w-md"
                reason="The card-in-card frame WITH A HEADER: a compact header bar sitting INSIDE the frame, over a flush section column separated by dividers (no per-row corners). `items` is data because the Body is a REPEATING list."
                states={[
                    {
                        name: "variant unset (defaults to \"surface\"), items = 2 sections",
                        why: "The header bar shows a plain eyebrow-less title, and the body renders as a flush column of two sections divided by a hairline, with no footer bar. This is the baseline shape a card-in-card takes when it sits directly on the page's bare background.",
                        code: `<SurfaceCard.Nested
    title="Related lessons"
    items={[
        { key: "normalization", eyebrow: "Relational databases", title: "Data normalization…", content: <Typography …/> },
        { key: "denormalize", eyebrow: "Database review deck", title: "When should you denormalize…" },
    ]}
/>`,
                        render: <SurfaceCard.Nested title="Related lessons" items={relatedItems} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * `variant` — the first INDEPENDENT axis (§1a): `"surface"` (default) carries its
 * own background + shadow when sitting DIRECTLY on `bg-background`; `"nested"`
 * switches to a border when this surface sits INSIDE a parent surface that
 * ALREADY HAS a background (chat panel / bubble / modal / page card) — a shadow
 * is nearly invisible on that background. Merged from two old single-value
 * leaves (`Default` implying `surface`, `Bordered`) into ONE `Variant` leaf
 * rendering both side by side.
 *
 * 2026-07-26 (teacher): changed from `bordered?: boolean` (`bordered=true` →
 * `variant="nested"`).
 */
export const Variant: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Nested"
                tier="composite"
                leaf="Variant"
                reason="`variant` decides where the card's edge comes from — its own shadow, or a border borrowed from sitting inside an already-filled parent. The composition underneath (header, divided sections, footer) never changes between the two values."
                states={[
                    {
                        name: "variant = \"surface\" (default)",
                        why: "The frame keeps its own `bg-surface` background and drop shadow, the same shape as `Default`. This is the correct shell whenever the card sits directly on the page's bare background rather than inside another filled panel.",
                        code: `<SurfaceCard.Nested
    title="Related lessons"
    variant="surface"
    items={items}
/>`,
                        render: (
                            <div className="max-w-md">
                                <SurfaceCard.Nested title="Related lessons" variant="surface" items={relatedItems} showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "variant = \"nested\"",
                        why: "The frame swaps its own shadow for a border on a transparent background, because it now sits inside a filled parent panel — here, a chat bubble column that already carries a background. A shadow would barely register against that surface, so a border reads instead.",
                        code: `<SurfaceCard.Nested
    title="Related lessons"
    variant="nested"
    items={items}
/>`,
                        render: (
                            <div className="flex max-w-md flex-col overflow-hidden rounded-2xl border border-default bg-surface">
                                <div className="flex flex-col gap-2 p-3">
                                    <div className="max-w-[85%] rounded-2xl bg-surface-secondary px-3 py-2">
                                        <Typography type="body-sm">
                                            It&apos;s usually when you see data repeated across many rows, or a column that depends on a non-primary-key column.
                                        </Typography>
                                    </div>
                                    <div className="max-w-[85%]">
                                        <SurfaceCard.Nested title="Related lessons" variant="nested" items={relatedItems} showAnatomy />
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Interactive section (ROW ≠ CARD, principles §7b) — an item takes `onPress`
 * (native `<button>`) or `href` (native `<a>`). Every row is focusable + keyboard
 * operable with a `focus-visible` ring and a title underline on hover (nav-link
 * affordance). NO press-scale/ripple — that belongs to the card, not the row. Tab
 * through it to check a11y.
 */
export const InteractiveSections: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Nested"
                tier="composite"
                leaf="InteractiveSections"
                renderClassName="max-w-md"
                reason="ROW ≠ CARD (§7b): a section only becomes a real interactive control when the caller hands it `onPress`/`href` — the frame never guesses intent from a hover style alone."
                states={[
                    {
                        name: "items[].onPress or items[].href set",
                        why: "Each interactive section renders as a native `<button>` or `<a>` instead of a plain `<div>`, so it is focusable and keyboard-operable, with the title underlining on hover. No press-scale or ripple is added, because that affordance belongs to the outer card, not to a row inside it.",
                        code: `<SurfaceCard.Nested
    title="Related lessons"
    items={[
        { key: "normalization", title: "Data normalization…", onPress: () => {} },
        { key: "denormalize", title: "When should you denormalize…", href: "#denormalize" },
    ]}
/>`,
                        render: (
                            <SurfaceCard.Nested
                                title="Related lessons"
                                showAnatomy
                                items={[
                                    { ...relatedItems[0], onPress: () => alert("Open: Data normalization") },
                                    { ...relatedItems[1], href: "#denormalize" },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `icon` + `meta` — the header bar's remaining two slots: an eyebrow icon on the left, meta pinned on the right. */
export const WithIconMeta: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Nested"
                tier="composite"
                leaf="WithIconMeta"
                renderClassName="max-w-md"
                reason="The header bar's two remaining slots — an eyebrow icon before the title, a meta node pinned to the trailing edge — read as one row, so both are demonstrated together rather than as separate leaves."
                states={[
                    {
                        name: "icon and meta set",
                        why: "The header bar gains a leading eyebrow icon before the title and a meta node pinned to the right edge that never shrinks. Both come in bare from the caller — the frame pins their size-4 dimension and muted colour itself, per §4/§5, so the caller never has to restate those choices.",
                        code: `<SurfaceCard.Nested
    icon={<FolderOpenIcon />}
    title="Related lessons"
    meta={<Typography type="body-xs" color="muted">2 items</Typography>}
    items={[…]}
/>`,
                        render: (
                            <SurfaceCard.Nested
                                icon={<FolderOpenIcon />}
                                title="Related lessons"
                                meta={<Typography type="body-xs" color="muted">2 items</Typography>}
                                items={relatedItems}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `footer` — a closing bar sitting INSIDE the frame (separated by `border-t`), unlike `.Base`'s `description`, which sits outside. */
export const WithFooter: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Nested"
                tier="composite"
                leaf="WithFooter"
                renderClassName="max-w-md"
                reason="`footer` is a closing bar owned by this frame, distinct from `.Base`'s `description` caption which sits outside the card entirely."
                states={[
                    {
                        name: "footer set",
                        why: "A closing bar renders inside the frame below the body, separated from it by a top border. It exists to hold a single trailing action (here, `View all`) without that action competing for space inside the divided section column above it.",
                        code: `<SurfaceCard.Nested
    title="Related lessons"
    items={[…]}
    footer={<Button size="sm" variant="tertiary">View all</Button>}
/>`,
                        render: (
                            <SurfaceCard.Nested
                                title="Related lessons"
                                items={relatedItems}
                                footer={<Button size="sm" variant="tertiary">View all</Button>}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** No `header`/`title`/`icon`/`meta` → the header bar does NOT render: only the frame + section column are left. */
export const Headerless: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Nested"
                tier="composite"
                leaf="Headerless"
                renderClassName="max-w-md"
                reason="`hasHeader` only ever turns on when at least one of `header`/`title`/`icon`/`meta` is present, so dropping all four is a real, supported shape rather than an edge case."
                states={[
                    {
                        name: "title, icon, meta, header all unset",
                        why: "The header bar drops out of the DOM entirely, leaving only the frame and the section column below it. No empty rule or blank strip is left behind where the header would have sat.",
                        code: `<SurfaceCard.Nested
    items={[…]}
/>`,
                        render: <SurfaceCard.Nested items={relatedItems} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** `children` — the WRAPPER frame still accepts free-form content when the Body is NOT a repeating list (`items` wins if both are given). */
export const FreeBody: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Nested"
                tier="composite"
                leaf="FreeBody"
                renderClassName="max-w-md"
                reason="`items` wins when both are given — `children` only takes over the Body when there is no repeating list to divide into sections."
                states={[
                    {
                        name: "children set, items unset",
                        why: "The body renders whatever free-form node the caller passes as `children`, instead of mapping `items` into a divided row of sections. No `Section` node appears in this tree because there is nothing repeating here to divide.",
                        code: `<SurfaceCard.Nested title="Notes">
    <div className="p-3">
        <Typography type="body-sm">…</Typography>
    </div>
</SurfaceCard.Nested>`,
                        render: (
                            <SurfaceCard.Nested title="Notes" showAnatomy>
                                <div className="p-3">
                                    <Typography type="body-sm">
                                        Normalize to 3NF first, only denormalize once you&apos;ve measured a real read bottleneck.
                                    </Typography>
                                </div>
                            </SurfaceCard.Nested>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * `radius` — the second INDEPENDENT axis: `"3xl"` (default) is the standard for an
 * outer frame; `"xl"` drops the corner one tier for tight contexts (a chat
 * bubble), usually paired with `variant="nested"` (a radius concentric with the
 * parent bubble). Merged from two old single-value leaves (`Default` implying
 * `3xl`, `Compact`) into ONE `Radius` leaf rendering both side by side.
 *
 * 2026-07-26 (teacher): changed from `compact?: boolean` (`compact=true` →
 * `radius="xl"`).
 */
export const Radius: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Nested"
                tier="composite"
                leaf="Radius"
                reason={"`radius` only tightens the outer corner by one step — it never touches the header, body, or footer composition, and it is usually paired with `variant=\"nested\"` so the corner stays concentric with the parent it sits inside."}
                states={[
                    {
                        name: "radius = \"3xl\" (default)",
                        why: "The frame's outer corner rounds at the standard 24px used for an outer card, the same shape as `Default`. This is the default because most `SurfaceCard.Nested` instances stand as the outermost frame on the page.",
                        code: `<SurfaceCard.Nested
    title="Related lessons"
    radius="3xl"
    items={items}
/>`,
                        render: (
                            <div className="max-w-md">
                                <SurfaceCard.Nested title="Related lessons" radius="3xl" items={relatedItems} showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "radius = \"xl\", variant = \"nested\"",
                        why: "The frame's corner drops one step to 16px, tightened to sit concentric with a `variant=\"nested\"` parent panel. Pairing the two props keeps the nested card's border and corner reading as one continuous shape with its host surface, instead of two independently rounded rectangles.",
                        code: `<SurfaceCard.Nested
    title="Related lessons"
    radius="xl"
    variant="nested"
    items={items}
/>`,
                        render: (
                            <div className="max-w-sm rounded-2xl bg-surface p-3 shadow-surface">
                                <SurfaceCard.Nested title="Related lessons" radius="xl" variant="nested" items={relatedItems} showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardNestedSection } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
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
 */
const meta: Meta<typeof SurfaceCard.Nested> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.Nested",
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
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="Default"
                    reason="The card-in-card frame WITH A HEADER: a compact header bar sitting INSIDE the frame, over a flush section column separated by dividers (no per-row corners). `items` is data because the Body is a REPEATING list."
                    code={`<SurfaceCard.Nested
  title="Related lessons"
  items={[
    { key: "normalization", eyebrow: "Relational databases", title: "Data normalization…", content: <Typography …/> },
    { key: "denormalize", eyebrow: "Database review deck", title: "When should you denormalize…" },
  ]}
/>`}
                >
                    <SurfaceCard.Nested title="Related lessons" items={relatedItems} showAnatomy />
                </BlockAnatomy>
            </div>
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
        <div className="flex flex-wrap items-start gap-6 p-8">
            <div className="max-w-md flex-1">
                <SurfaceCard.Nested title="Related lessons" variant="surface" items={relatedItems} />
            </div>
            <div className="flex max-w-md flex-1 flex-col overflow-hidden rounded-2xl border border-default bg-surface">
                <div className="flex flex-col gap-2 p-3">
                    <div className="max-w-[85%] rounded-2xl bg-surface-secondary px-3 py-2">
                        <Typography type="body-sm">
                            It&apos;s usually when you see data repeated across many rows, or a column that depends on a non-primary-key column.
                        </Typography>
                    </div>
                    <div className="max-w-[85%]">
                        <BlockAnatomy
                            name="SurfaceCard.Nested"
                            tier="primitive"
                            leaf="Variant"
                            note={"`variant=\"nested\"` (right, inside a bubble panel) switches the frame to a border instead of a shadow (surface-in-surface); `variant=\"surface\"` (left, the default) keeps its own background and shadow when it sits directly on bg-background — the composition is identical."}
                            code={`<SurfaceCard.Nested
  title="Related lessons"
  variant="nested"
  items={[…]}
/>`}
                        >
                            <SurfaceCard.Nested title="Related lessons" variant="nested" items={relatedItems} showAnatomy />
                        </BlockAnatomy>
                    </div>
                </div>
            </div>
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
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="InteractiveSections"
                    note="The composition does not change — only the Section inside Body becomes an <a>/<button> when an item carries `href`/`onPress` (ROW ≠ CARD, §7b)."
                    code={`<SurfaceCard.Nested
  title="Related lessons"
  items={[
    { key: "normalization", title: "Data normalization…", onPress: () => {} },
    { key: "denormalize", title: "When should you denormalize…", href: "#denormalize" },
  ]}
/>`}
                >
                    <SurfaceCard.Nested
                        title="Related lessons"
                        showAnatomy
                        items={[
                            { ...relatedItems[0], onPress: () => alert("Open: Data normalization") },
                            { ...relatedItems[1], href: "#denormalize" },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `icon` + `meta` — the header bar's remaining two slots: an eyebrow icon on the left, meta pinned on the right. */
export const WithIconMeta: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="WithIconMeta"
                    note="`icon` comes in BARE — the frame pins size-4 and the muted colour itself (§4/§5). `meta` is its own node, pinned right, never shrinking."
                    code={`<SurfaceCard.Nested
  icon={<FolderOpenIcon />}
  title="Related lessons"
  meta={<Typography type="body-xs" color="muted">2 items</Typography>}
  items={[…]}
/>`}
                >
                    <SurfaceCard.Nested
                        icon={<FolderOpenIcon />}
                        title="Related lessons"
                        meta={<Typography type="body-xs" color="muted">2 items</Typography>}
                        items={relatedItems}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `footer` — a closing bar sitting INSIDE the frame (separated by `border-t`), unlike `.Base`'s `description`, which sits outside. */
export const WithFooter: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="WithFooter"
                    note="`footer` renders INSIDE the frame (border-t), not as a caption outside the card — that is `.Base`'s `description`."
                    code={`<SurfaceCard.Nested
  title="Related lessons"
  items={[…]}
  footer={<Button size="sm" variant="tertiary">View all</Button>}
/>`}
                >
                    <SurfaceCard.Nested
                        title="Related lessons"
                        items={relatedItems}
                        footer={<Button size="sm" variant="tertiary">View all</Button>}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** No `header`/`title`/`icon`/`meta` → the header bar does NOT render: only the frame + section column are left. */
export const Headerless: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="Headerless"
                    note="Drop all four header slots and the frame drops the header bar with them (no empty rule left behind) — the Header node falls out of the DOM tree."
                    code={`<SurfaceCard.Nested
  items={[…]}
/>`}
                >
                    <SurfaceCard.Nested items={relatedItems} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `children` — the WRAPPER frame still accepts free-form content when the Body is NOT a repeating list (`items` wins if both are given). */
export const FreeBody: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="FreeBody"
                    note="When Body is one free-form block rather than a repeat, use `children`/`body` — the DOM carries no Section because there are no repeating rows."
                    code={`<SurfaceCard.Nested title="Notes">
  <div className="p-3">
    <Typography type="body-sm">…</Typography>
  </div>
</SurfaceCard.Nested>`}
                >
                    <SurfaceCard.Nested title="Notes" showAnatomy>
                        <div className="p-3">
                            <Typography type="body-sm">
                                Normalize to 3NF first, only denormalize once you&apos;ve measured a real read bottleneck.
                            </Typography>
                        </div>
                    </SurfaceCard.Nested>
                </BlockAnatomy>
            </div>
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
        <div className="flex flex-wrap items-start gap-6 p-8">
            <div className="max-w-md flex-1">
                <SurfaceCard.Nested title="Related lessons" radius="3xl" items={relatedItems} />
            </div>
            <div className="max-w-sm flex-1 rounded-2xl bg-surface p-3 shadow-surface">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="Radius"
                    note={"`radius=\"xl\"` (right, inside a bubble panel) drops the corner one step, pairing with `variant=\"nested\"` for a radius concentric with the parent; `radius=\"3xl\"` (left, the default) is the standard for an outer frame."}
                    code={`<SurfaceCard.Nested
  title="Related lessons"
  radius="xl"
  variant="nested"
  items={[…]}
/>`}
                >
                    <SurfaceCard.Nested title="Related lessons" radius="xl" variant="nested" items={relatedItems} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

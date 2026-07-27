import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SurfaceCard, type SurfaceCardSelectableGroupItem } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * LAYOUT — `SurfaceCard.SelectableGroup`: a select-one card group on top of HeroUI's
 * `RadioGroup`/`Radio`, each choice a neutral `Card`, an accent outline ring lights up
 * once selected.
 *
 * 2026-07-26 (teacher): moved from the ATOM tier (`atoms/navigation/SelectableCardGroup`)
 * into the `SurfaceCard` namespace — it composes multiple cards into ONE LAID-OUT CLUSTER
 * (a grid), which is layout-tier work, not a single atom leaf (§12a/§6b). It's the BLOOD
 * SIBLING of `SurfaceCard.PressableGroup` — same "card grid" shape — differing on exactly
 * one axis: PressableGroup is an ACTION grid (each cell presses on its own, `selected` is
 * just a decorative ring, not enforcing mutual exclusion); SelectableGroup is a REAL
 * select-one control (`role="radiogroup"`, roving tabindex, arrow-key navigation,
 * `value`/`onChange` enforcing exactly 1-of-N) — a different DOM/interaction contract,
 * not just a style difference, so it's split into its OWN MEMBER instead of stuffing
 * `selectedKey` into `PressableGroup`.
 *
 * Leaves KEPT AS-IS from the old atom version (not re-audited — only namespace + tier changed):
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — the ATOM TIER rule, still applies here because the
 * component body did NOT change, only its LOCATION did):
 * - `items` — data that builds N child cards ⇒ **leaf `Default`** (§12g.2, anchored to
 *   `Button.Group`). Every OPTIONAL field of an item (`description` · `icon` · `badge` ·
 *   `isDisabled`) is a SHAPE of `items`, not a separate atom axis ⇒ lives together INSIDE
 *   `Default`, does NOT spawn separate `Icon`/`Badge`/`Disabled` leaves — matching the
 *   anchor rule *"an item with a label renders a normal button, none render an icon-only
 *   button"*.
 * - `columns` — changes real pixels (grid column count) ⇒ **leaf `Columns`**, renders the
 *   FULL 1/2/3 stacked vertically on the SAME `items` so the eye sees only the column
 *   count change, nothing else moving with it.
 * - `value`/`onChange` — not a value union to enumerate, just a control wire; every leaf
 *   runs it through `ControlledGroup` itself so it needs no leaf of its own.
 * - `ariaLabel` — ONLY feeds `RadioGroup`'s `aria-label`, doesn't change a single pixel ⇒
 *   **NO leaf** (§12g.1, same family as `Choice.RadioGroup`'s `ariaLabel`).
 * - `className`/`showAnatomy` — escape hatch / dev flag, not part of the atom's visual
 *   form ⇒ no leaf.
 *
 * ⚠️ `tier` changed from `"atom"` (old version) to `"primitive"` — the layout tier of the
 * blueprint tree uses the `"primitive"` label for `BlockAnatomy` (unlike an atom, which
 * uses `"atom"` directly).
 *
 * ⚠️ UNFIXED DRIFT (recorded, not refactored in this pass): the component calls HeroUI's
 * `Radio`/`RadioGroup` DIRECTLY instead of the `Choice.Radio`/`Choice.RadioGroup` atom that
 * already has its own story (`.storybook/components/atoms/forms/Choice/Choice.tsx`).
 * `Icon`/`Label`/`Badge` emitted via `data-anat-part` are all internal SPANs (not an atom
 * with its own story) ⇒ there are NO real deps, so `annotate` is NOT passed (teacher
 * confirmed 2026-07-26, second pass — kept as-is here).
 *
 * ✍️ Text shown on the panel (`leaf`/`reason`/`note`/`code`) and demo labels are written
 * in ENGLISH; JSDoc/comments stay in Vietnamese.
 */

const meta: Meta<typeof SurfaceCard.SelectableGroup> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.SelectableGroup",
    component: SurfaceCard.SelectableGroup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.SelectableGroup>

type PlanValue = "free" | "pro" | "team" | "enterprise"

/** Pill used for the `badge` slot — neutral, not tied to a specific "discount" meaning. */
const badgePill = (text: string) => (
    <span className="rounded-full bg-accent-soft px-2 py-0 text-xs font-medium text-accent-soft-foreground">
        {text}
    </span>
)

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
            d="M8 1.5l1.9 4.2 4.6.5-3.4 3.2.9 4.6L8 11.8l-4 2.2.9-4.6-3.4-3.2 4.6-.5L8 1.5z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
        />
    </svg>
)

/**
 * ONE item set covering every optional field of `SurfaceCardSelectableGroupItem` — each
 * field shows up exactly once to contrast against the rest that lack it:
 * `free` has no `description`/`icon`/`badge` (baseline) · `pro` has `description` + `icon`
 * (marks the recommended pick) · `team` has `description` + `badge` ("Most popular") ·
 * `enterprise` has `description` + `isDisabled` (dimmed, has to contact sales instead of
 * selecting directly).
 */
const PLAN_ITEMS: Array<SurfaceCardSelectableGroupItem<PlanValue>> = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro", description: "For solo developers shipping side projects", icon: <StarIcon /> },
    { value: "team", label: "Team", description: "Shared workspaces and roles for a growing team", badge: badgePill("Most popular") },
    { value: "enterprise", label: "Enterprise", description: "Custom limits, SSO, and a dedicated success manager", isDisabled: true },
]

/** Owns the selection so the group is interactive (the block is fully controlled). */
const ControlledGroup = <T extends string>({
    items,
    initialValue,
    ariaLabel,
    columns,
    width = "480px",
    showAnatomy,
}: {
    items: Array<SurfaceCardSelectableGroupItem<T>>
    initialValue: T
    ariaLabel: string
    columns?: 1 | 2 | 3
    width?: string
    showAnatomy?: boolean
}) => {
    const [value, setValue] = useState<T>(initialValue)
    return (
        <div style={{ width }}>
            <SurfaceCard.SelectableGroup items={items} value={value} onChange={setValue} ariaLabel={ariaLabel} columns={columns} showAnatomy={showAnatomy} />
        </div>
    )
}

/**
 * Leaf prop `items` — the cluster is built from DATA; every optional field of an item
 * (`description`/`icon`/`badge`/`isDisabled`) lives RIGHT INSIDE this data set instead of
 * splitting into a separate leaf (§12g.2).
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.SelectableGroup"
                tier="primitive"
                leaf="Prop `items`"
                reason="The group is a cluster built from data, not JSX children — items is the whole surface worth reading. Free carries only a label, Pro adds a description and an identifying icon, Team adds a badge, and Enterprise is dimmed and unselectable — one array, four shapes an item can take."
                note="value/onChange make the group fully controlled — this story just owns the state locally so the ring can move when you click a card. ariaLabel never reaches the screen; it only feeds the RadioGroup's accessible name, so it gets no leaf of its own."
                code={`<SurfaceCard.SelectableGroup
  items={[
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro", description: "For solo developers shipping side projects", icon: <StarIcon /> },
    { value: "team", label: "Team", description: "Shared workspaces and roles for a growing team", badge: badgePill("Most popular") },
    { value: "enterprise", label: "Enterprise", description: "Custom limits, SSO, and a dedicated success manager", isDisabled: true },
  ]}
  value={value}
  onChange={setValue}
  ariaLabel="Select plan"
/>`}
            >
                <ControlledGroup items={PLAN_ITEMS} initialValue="pro" ariaLabel="Select plan" columns={2} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `columns` — the FULL 1/2/3 stacked vertically on the SAME `PLAN_ITEMS`, so
 * the eye sees only the grid column count change, nothing else moving with it.
 */
export const Columns: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.SelectableGroup"
                tier="primitive"
                leaf="Prop `columns`"
                reason="columns is the group's own grid: stack cards in a sidebar with 1, pair them at 2 (the default), or line up more options side by side at 3."
                note="All three rows use the same PLAN_ITEMS array — the only thing that changes on screen is the grid-template-columns count, nothing about item shape."
                code={`<SurfaceCard.SelectableGroup items={PLAN_ITEMS} value={value} onChange={setValue} ariaLabel="Select plan" columns={1} />
<SurfaceCard.SelectableGroup items={PLAN_ITEMS} value={value} onChange={setValue} ariaLabel="Select plan" columns={2} />  // default
<SurfaceCard.SelectableGroup items={PLAN_ITEMS} value={value} onChange={setValue} ariaLabel="Select plan" columns={3} />`}
            >
                <div className="flex flex-col gap-6">
                    <ControlledGroup items={PLAN_ITEMS} initialValue="free" ariaLabel="Select plan (1 column)" columns={1} width="360px" showAnatomy />
                    <ControlledGroup items={PLAN_ITEMS} initialValue="pro" ariaLabel="Select plan (2 columns)" columns={2} width="480px" />
                    <ControlledGroup items={PLAN_ITEMS} initialValue="team" ariaLabel="Select plan (3 columns)" columns={3} width="720px" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

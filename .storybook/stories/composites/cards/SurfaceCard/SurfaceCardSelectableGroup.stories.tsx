import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SurfaceCardSelectableGroup, type SurfaceCardSelectableGroupItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * `SurfaceCardSelectableGroup` — a select-one card group over HeroUI `RadioGroup`/`Radio`;
 * each choice is a neutral `Card` with an accent outline ring on selection. Blood sibling of
 * `SurfaceCardPressableGroup` but a real select-one control (`role="radiogroup"`, roving
 * tabindex, arrow-key nav, `value`/`onChange` enforcing 1-of-N). Leaves: `items` (`Default`,
 * with per-item description/icon/badge/isDisabled) and `columns` (`Columns`, full 1/2/3).
 */
const meta: Meta<typeof SurfaceCardSelectableGroup> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCardSelectableGroup",
    component: SurfaceCardSelectableGroup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof SurfaceCardSelectableGroup>
type PlanValue = "free" | "pro" | "team" | "enterprise"
/** Pill used for the `badge` slot — neutral, not tied to a specific "discount" meaning. */
const badgePill = (text: string) => (
    <span data-tier="fixture" className="rounded-full bg-accent-soft px-2 py-0 text-xs font-medium text-accent-soft-foreground">
        {text}
    </span>
)
const StarIcon = () => (
    <svg data-tier="fixture" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
/** `badge` slot fixture for {@link PLAN_ITEMS}'s "team" plan — a component reference (COMPOSITE-8), not a built node. */
const MostPopularBadge = () => badgePill("Most popular")
const PLAN_ITEMS: Array<SurfaceCardSelectableGroupItem<PlanValue>> = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro", description: "For solo developers shipping side projects", icon: StarIcon },
    { value: "team", label: "Team", description: "Shared workspaces and roles for a growing team", badge: MostPopularBadge },
    { value: "enterprise", label: "Enterprise", description: "Custom limits, SSO, and a dedicated success manager", isDisabled: true },
]
/** Owns the selection so the group is interactive (the block is fully controlled). */
const ControlledGroup = <T extends string>({
    items,
    initialValue,
    ariaLabel,
    columns,
    width = "480px",
}: {
    items: Array<SurfaceCardSelectableGroupItem<T>>
    initialValue: T
    ariaLabel: string
    columns?: 1 | 2 | 3
    width?: string
}) => {
    const [value, setValue] = useState<T>(initialValue)
    return (
        <div data-tier="fixture" style={{ width }}>
            <SurfaceCardSelectableGroup items={items} value={value} onChange={setValue} ariaLabel={ariaLabel} columns={columns} />
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardSelectableGroup"
                tier="composite"
                leaf="Prop `items`"
                reason="The group is a cluster built from data, not JSX children, so items is the whole surface worth reading. value/onChange make the group fully controlled, which is why this story just owns the state locally so the ring can move when you click a card, and ariaLabel never reaches the screen because it only feeds the RadioGroup's accessible name, so neither prop earns a leaf of its own."
                states={[
                    {
                        name: "items = mixed shapes (label only, description+icon, description+badge, description+isDisabled)",
                        why: "Each card renders a different shape from the same array: Free shows only a label, Pro adds a description and an identifying icon, Team adds a description and a badge, and Enterprise adds a description and turns dimmed and unselectable. The array is written this way so every optional field an item can carry shows up at least once, contrasted against a card that lacks it.",
                        code: `<SurfaceCardSelectableGroup
  items={[
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro", description: "For solo developers shipping side projects", icon: <StarIcon /> },
    { value: "team", label: "Team", description: "Shared workspaces and roles for a growing team", badge: badgePill("Most popular") },
    { value: "enterprise", label: "Enterprise", description: "Custom limits, SSO, and a dedicated success manager", isDisabled: true },
  ]}
  value={value}
  onChange={setValue}
  ariaLabel="Select plan"
/>`,
                        render: <ControlledGroup items={PLAN_ITEMS} initialValue="pro" ariaLabel="Select plan" columns={2} />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `columns` — the FULL 1/2/3 stacked vertically on the SAME `PLAN_ITEMS`, so
 * the eye sees only the grid column count change, nothing else moving with it.
 */
export const Columns: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardSelectableGroup"
                tier="composite"
                leaf="Prop `columns`"
                reason="columns is the group's own grid, stacking cards in a sidebar with 1, pairing them at 2 (the default), or lining up more options side by side at 3. All three states below share the same PLAN_ITEMS array, so the grid-template-columns count is the only thing that changes on screen, nothing about item shape."
                states={[
                    {
                        name: "columns = 1",
                        why: "The cards stack straight down in a single column. This is the shape for a narrow sidebar where the group has no room to sit side by side.",
                        code: "<SurfaceCardSelectableGroup items={PLAN_ITEMS} value={value} onChange={setValue} ariaLabel=\"Select plan\" columns={1} />",
                        render: <ControlledGroup items={PLAN_ITEMS} initialValue="free" ariaLabel="Select plan (1 column)" columns={1} width="360px" />,
                    },
                    {
                        name: "columns = 2",
                        why: "The grid pairs cards two to a row, the default column count. Two columns balance most plan pickers without shrinking any single card too much.",
                        code: "<SurfaceCardSelectableGroup items={PLAN_ITEMS} value={value} onChange={setValue} ariaLabel=\"Select plan\" columns={2} />  // default",
                        render: <ControlledGroup items={PLAN_ITEMS} initialValue="pro" ariaLabel="Select plan (2 columns)" columns={2} width="480px" />,
                    },
                    {
                        name: "columns = 3",
                        why: "The grid lines up three cards in a row. This suits a wider surface where more options can sit side by side for a direct comparison.",
                        code: "<SurfaceCardSelectableGroup items={PLAN_ITEMS} value={value} onChange={setValue} ariaLabel=\"Select plan\" columns={3} />",
                        render: <ControlledGroup items={PLAN_ITEMS} initialValue="team" ariaLabel="Select plan (3 columns)" columns={3} width="720px" />,
                    },
                ]}
            />
        </div>
    ),
}
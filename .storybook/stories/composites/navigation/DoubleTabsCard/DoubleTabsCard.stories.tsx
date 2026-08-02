import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { DoubleTabsCard } from "@sb-components/composites/navigation/DoubleTabsCard/DoubleTabsCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `DoubleTabsCard` — a `Toolbar` (two tab groups) living inside a `SurfaceCard` face instead of
 * sitting bare on the page canvas. Composes `SurfaceCard`'s `header` slot rather than reinventing
 * it. Leaves by structure: a second tab group appearing, or the card face switching to `nested`;
 * which tab is selected is data.
 */
const meta: Meta<typeof DoubleTabsCard> = {
    title: "Composites/Navigation/DoubleTabsCard/DoubleTabsCard",
    component: DoubleTabsCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DoubleTabsCard>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the card face the tab row and body sit inside", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "Toolbar": { tier: "composite", role: "the two tab groups themselves, placed in the card's own header slot", storyId: "composites-navigation-toolbar-toolbar--two-groups" },
    "Typography": { tier: "atom", role: "the card body text", storyId: "atoms-text-typography-typography--overview" },
}

const LeftOnlyDemo = () => {
    const [key, setKey] = useState("overview")
    return (
        <DoubleTabsCard

           
            leftTabs={{
                items: [
                    { key: "overview", label: "Overview" },
                    { key: "activity", label: "Activity" },
                ],
                selectedKey: key,
                ariaLabel: "Switch tab",
                onSelectionChange: (k) => setKey(String(k)),
            }}
            body={() => <Typography size="sm" color="muted" text={key === "overview" ? "Overview content." : "Activity content."} />}
        />
    )
}

const TwoGroupsDemo = () => {
    const [left, setLeft] = useState("overview")
    const [right, setRight] = useState("week")
    return (
        <DoubleTabsCard

           
            leftTabs={{
                items: [
                    { key: "overview", label: "Overview" },
                    { key: "activity", label: "Activity" },
                ],
                selectedKey: left,
                ariaLabel: "Switch tab",
                onSelectionChange: (k) => setLeft(String(k)),
            }}
            rightTabs={{
                items: [
                    { key: "week", label: "Week" },
                    { key: "month", label: "Month" },
                ],
                selectedKey: right,
                ariaLabel: "Time range",
                onSelectionChange: (k) => setRight(String(k)),
            }}
            rightTabsNeutral
            body={() => <Typography size="sm" color="muted" text={`${left} · ${right}`} />}
        />
    )
}

/** LEAF — one tab group, plain card face. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DoubleTabsCard"
                tier="composite"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "1 tab group",
                        why: "The plain shape: a card face, a tab row in its header slot, content below that swaps with the selected tab.",
                        code: `<DoubleTabsCard leftTabs={{ items, selectedKey, ariaLabel, onSelectionChange }}>
    <Typography size="sm" color="muted" text="..." />
</DoubleTabsCard>`,
                        render: <LeftOnlyDemo />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — two tab groups (left + right), matching `Toolbar`'s own two-group shape. */
export const TwoGroups: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DoubleTabsCard"
                tier="composite"
                leaf="Prop `rightTabs`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "leftTabs + rightTabs (neutral)",
                        why: "A second group pins right, NEUTRAL chrome — same accent-discipline `Toolbar` itself enforces (one accent signal per row).",
                        code: "<DoubleTabsCard leftTabs={...} rightTabs={...} rightTabsNeutral>...</DoubleTabsCard>",
                        render: <TwoGroupsDemo />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `cardVariant="nested"`, for a card sitting INSIDE another face. */
export const Nested: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DoubleTabsCard"
                tier="composite"
                leaf="Prop `cardVariant`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "cardVariant = \"nested\"",
                        why: "Border instead of shadow, for when this card already sits inside another surface (§1a) — same vocabulary as `SurfaceCard.variant=\"nested\"`.",
                        code: "<DoubleTabsCard cardVariant=\"nested\" leftTabs={...}>...</DoubleTabsCard>",
                        render: (
                            <DoubleTabsCard

                               
                                cardVariant="nested"
                                leftTabs={{
                                    items: [
                                        { key: "overview", label: "Overview" },
                                        { key: "activity", label: "Activity" },
                                    ],
                                    selectedKey: "overview",
                                    ariaLabel: "Switch tab",
                                    onSelectionChange: () => {},
                                }}
                                body={() => <Typography size="sm" color="muted" text="Overview content." />}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

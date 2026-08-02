import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { type AnatomyTier } from "@sb-utils/AnatomyOverlay/anatomy-context"
import { AnatomyOverlay } from "@sb-utils/AnatomyOverlay/AnatomyOverlay"

/**
 * UTIL — AnatomyOverlay: an ABSOLUTE annotation (dashed outline + corner tag)
 * drawn on top of a component, so it never changes layout. Drop it inside a
 * `relative` + `data-anat` root. Colour = TIER (accent=frame/composite · green=design ·
 * amber=block). Components expose it through a `showAnatomy` prop that cascades
 * down their composition tree (see `Block/Learn/FlashcardDeckList` → Anatomy).
 */
const meta: Meta<typeof AnatomyOverlay> = {
    title: "Utils/AnatomyOverlay",
    component: AnatomyOverlay,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof AnatomyOverlay>

/** Props for the `Box` helper — a demo surface annotated with `AnatomyOverlay`. */
interface BoxProps {
    /** Corner tag text drawn by the overlay. */
    label: string
    /**
     * Tier colour of the overlay tag. Typed from {@link AnatomyTier} rather than a hand-listed
     * union — a demo that hard-codes the tier names goes stale silently.
     */
    tier: AnatomyTier
    /** Content rendered inside the annotated box. */
    children: React.ReactNode
}

const Box = ({ label, tier, children }: BoxProps) => (
    <div data-tier="fixture" className="relative rounded-large bg-surface p-6 shadow-surface" data-anat>
        {children}
        <AnatomyOverlay label={label} tier={tier} />
    </div>
)

/** TIERS — one tag colour per tier, drawn as absolute overlays (layout untouched). */
export const Tiers: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-wrap gap-8 p-12">
            <Box label="Grid" tier="frame"><Typography type="body-sm">frame</Typography></Box>
            <Box label="EnumChip" tier="composite"><Typography type="body-sm">composite</Typography></Box>
            <Box label="DeckCard" tier="block"><Typography type="body-sm">design</Typography></Box>
            <Box label="FlashcardDeckList" tier="block"><Typography type="body-sm">block</Typography></Box>
        </div>
    ),
}

/**
 * NESTED — hover the OUTER box → the INNER overlay peels away (so you read that
 * level cleanly); the hovered box keeps its own tag. Real usage cascades this via
 * each component's `showAnatomy` prop.
 */
export const Nested: Story = {
    render: () => (
        <div data-tier="fixture" className="p-12">
            <div className="relative rounded-large bg-surface p-10 shadow-surface" data-anat>
                <div className="relative rounded-large bg-default/40 p-8" data-anat>
                    <Typography type="body-sm">inner content</Typography>
                    <AnatomyOverlay label="DeckCard" tier="block" />
                </div>
                <AnatomyOverlay label="FlashcardDeckList" tier="block" />
            </div>
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { AnatomyOverlay } from "./AnatomyOverlay"

/**
 * PRIMITIVE — AnatomyOverlay: an ABSOLUTE annotation (dashed outline + corner tag)
 * drawn on top of a component, so it never changes layout. Drop it inside a
 * `relative` + `data-anat` root. Colour = TIER (accent=primitive · green=design ·
 * amber=block). Components expose it through a `showAnatomy` prop that cascades
 * down their composition tree (see `Block/Learn/FlashcardDeckList` → Anatomy).
 */
const meta: Meta<typeof AnatomyOverlay> = {
    title: "Primitives/Layout/AnatomyOverlay",
    component: AnatomyOverlay,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof AnatomyOverlay>

const Box = ({ label, tier, children }: { label: string; tier: "primitive" | "design" | "block"; children: React.ReactNode }) => (
    <div className="relative rounded-large bg-surface p-6 shadow-surface" data-anat>
        {children}
        <AnatomyOverlay label={label} tier={tier} />
    </div>
)

/** TIERS — the three tag colours drawn as absolute overlays (layout untouched). */
export const Tiers: Story = {
    render: () => (
        <div className="flex flex-wrap gap-8 p-12">
            <Box label="StatusChip" tier="primitive"><Typography type="body-sm">primitive</Typography></Box>
            <Box label="DeckCard" tier="design"><Typography type="body-sm">design</Typography></Box>
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
        <div className="p-12">
            <div className="relative rounded-large bg-surface p-10 shadow-surface" data-anat>
                <div className="relative rounded-large bg-default/40 p-8" data-anat>
                    <Typography type="body-sm">inner content</Typography>
                    <AnatomyOverlay label="DeckCard" tier="design" />
                </div>
                <AnatomyOverlay label="FlashcardDeckList" tier="block" />
            </div>
        </div>
    ),
}

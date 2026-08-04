import type { Meta, StoryObj } from "@storybook/nextjs"
import { MegaMenu, type MegaMenuItem } from "@sb-components/nivo/blocks/landing/MegaMenu/MegaMenu"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MegaMenu` — the navbar's intent-based product dropdown: real, buyable
 * products beside honestly roadmap-flagged layers. `items` is the leaf —
 * `defaultOpen` pins the panel open so the (portal-rendered) rows are visible
 * for review, the same convention `Popover`'s own story uses.
 */
const meta: Meta<typeof MegaMenu> = {
    title: "Nivo/Blocks/Landing/MegaMenu/MegaMenu",
    component: MegaMenu,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MegaMenu>

const NOOP = () => {}

// The four real entries this menu is grounded in: two route straight to the
// two buyable products, two are honestly flagged roadmap (CRM/Workflow,
// Dashboard) — the same reconciliation `ProductQuickSelector` already uses.
const FOUR_ENTRIES: Array<MegaMenuItem> = [
    { key: "academy", title: "AI Academy", description: "Site + academy from a template", onPress: NOOP },
    { key: "agent", title: "nivo AI Agent", description: "Multi-agent AI assistant for customers", onPress: NOOP },
    { key: "crm", title: "CRM · Workflow (roadmap)", description: "Not sold yet — the expanding infrastructure layer", isRoadmap: true, onPress: NOOP },
    { key: "dashboard", title: "Dashboard (roadmap)", description: "Not sold yet — measure growth and bottlenecks", isRoadmap: true, onPress: NOOP },
]

// A shorter list (two entries) — the menu reflows on real data, not a fixed four-row shape.
const TWO_ENTRIES: Array<MegaMenuItem> = FOUR_ENTRIES.slice(0, 2)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Popover: { tier: "atom", role: "the click-panel trigger + portal chrome" },
    SurfaceCardPressableGroup: { tier: "composite", role: "the pressable row list inside the panel — not visible here, it renders through Popover's portal" },
}

/** LEAF — `items`: which entries are real vs roadmap is DATA; a shorter list proves the panel reflows. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MegaMenu"
                tier="block"
                leaf="items"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Whether an entry's description reads as a real product or a roadmap layer is DATA (`isRoadmap`) — this menu never claims a roadmap layer is buyable today. Feeding a shorter list reflows the same panel instead of leaving empty rows, proving the row count comes from `items.length`. The panel body renders through `Popover`'s portal, outside this component's own render box, so it will not show in the Structure tree — `defaultOpen` still pins it open for visual review, the same convention `Popover`'s own story uses."
                states={[
                    {
                        name: "four entries (the grounded default)",
                        why: "The real four-entry menu: two route straight to the two buyable products, two are honestly roadmap-flagged.",
                        code: `<MegaMenu
    triggerLabel="Products"
    ariaLabel="Browse nivo products"
    items={[
        { key: "academy", title: "AI Academy", description: "Site + academy from a template", onPress: openAcademy },
        { key: "agent", title: "nivo AI Agent", description: "Multi-agent AI assistant for customers", onPress: openAgent },
        { key: "crm", title: "CRM · Workflow (roadmap)", description: "Not sold yet — the expanding infrastructure layer", isRoadmap: true, onPress: openAudit },
        { key: "dashboard", title: "Dashboard (roadmap)", description: "Not sold yet — measure growth and bottlenecks", isRoadmap: true, onPress: openAudit },
    ]}
    defaultOpen
/>`,
                        render: <MegaMenu triggerLabel="Products" ariaLabel="Browse nivo products" items={FOUR_ENTRIES} defaultOpen />,
                    },
                    {
                        name: "two entries",
                        why: "A shorter catalog of entries still lays out cleanly — the panel reflows from real data instead of assuming a fixed four-row shape.",
                        code: `<MegaMenu triggerLabel="Products" ariaLabel="Browse nivo products" items={fourEntries.slice(0, 2)} defaultOpen />`,
                        render: <MegaMenu triggerLabel="Products" ariaLabel="Browse nivo products" items={TWO_ENTRIES} defaultOpen />,
                    },
                ]}
            />
        </div>
    ),
}

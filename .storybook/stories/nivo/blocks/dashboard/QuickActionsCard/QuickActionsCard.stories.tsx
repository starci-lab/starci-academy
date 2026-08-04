import type { Meta, StoryObj } from "@storybook/nextjs"
import { GlobeIcon, PencilSimpleIcon, RobotIcon, WalletIcon } from "@phosphor-icons/react"
import {
    QuickActionsCard,
    type QuickActionItem,
    type QuickActionsCardLabels,
} from "@sb-components/nivo/blocks/dashboard/QuickActionsCard/QuickActionsCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `QuickActionsCard` — the dashboard's shortcut list: one full-width button
 * per destination the operator reaches for most. One shape, `isSkeleton` is
 * the only state, since every account gets the same shortcut set once it has
 * something to manage.
 */
const meta: Meta<typeof QuickActionsCard> = {
    title: "Nivo/Blocks/Dashboard/QuickActionsCard/QuickActionsCard",
    component: QuickActionsCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof QuickActionsCard>

const NOOP = () => {}

const LABELS: QuickActionsCardLabels = { title: "Quick actions" }

const ITEMS: Array<QuickActionItem> = [
    { id: "manage-agent", label: "Manage AI Agent", icon: RobotIcon, onPress: NOOP },
    { id: "edit-site", label: "Edit expert site", icon: PencilSimpleIcon, onPress: NOOP },
    { id: "top-up", label: "Top up wallet", icon: WalletIcon, onPress: NOOP },
    { id: "register-domain", label: "Register a domain", icon: GlobeIcon, onPress: NOOP },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the card face and its skeleton mirror" },
    Button: { tier: "atom", role: "one full-width shortcut per destination" },
}

/** LEAF — `items`: the shortcut set, plus its own `isSkeleton` mirror. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-sm p-8">
            <BlockAnatomy
                name="QuickActionsCard"
                tier="block"
                leaf="items"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. There is no empty leaf here — every account gets the same shortcut set once it has something to manage, so `isSkeleton` is the only state this card models."
                states={[
                    {
                        name: "the real shortcut set",
                        why: "The four destinations an operator reaches for most: the AI Agent, the expert site, the wallet, and domain registration.",
                        code: `<QuickActionsCard
    items={[
        { id: "manage-agent", label: "Manage AI Agent", icon: RobotIcon, onPress: openAgent },
        { id: "edit-site", label: "Edit expert site", icon: PencilSimpleIcon, onPress: openSite },
        // …
    ]}
    labels={labels}
/>`,
                        render: <QuickActionsCard items={ITEMS} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The shortcut set's own first fetch hasn't resolved yet — the title and every button shimmer, and the presses lock.",
                        code: "<QuickActionsCard items={items} labels={labels} isSkeleton />",
                        render: <QuickActionsCard items={ITEMS} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

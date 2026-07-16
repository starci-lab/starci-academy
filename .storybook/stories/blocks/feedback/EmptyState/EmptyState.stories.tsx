import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { MagnifyingGlassIcon, TrayIcon, WarningCircleIcon } from "@phosphor-icons/react"

import { EmptyState } from "@/components/blocks/feedback/EmptyState"

/**
 * `EmptyState` — a presentational, props-only empty-state placeholder.
 * All copy is passed in as `ReactNode`; the block never calls a translation
 * hook itself, so every story below uses static copy.
 */
const meta = {
    title: "Blocks/Feedback/EmptyState",
    component: EmptyState,
    // default title satisfies the required prop for render-only stories (they render their own).
    args: {
        title: "No data",
    },
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Use when you just need to report "nothing here" quickly — no icon/description/action needed, e.g. a secondary result slot with no data yet.
 */
export const Default: Story = {
    args: {
        title: "No data",
    },
    parameters: {
        usage: "Use when you just need to report \"nothing here\" quickly — no icon/description/action needed, e.g. a secondary result slot with no data yet.",
    },
}

/**
 * Pick the right level of detail for the real situation: an empty course list (icon only), a search with no results (icon + suggestion), or an empty list page with an action button to create a new item.
 */
export const Compositions: Story = {
    parameters: {
        usage: "Pick the right level of detail for the real situation: an empty course list (icon only), a search with no results (icon + suggestion), or an empty list page with an action button to create a new item.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Icon and title only</Label>
                    <Typography type="body-sm" color="muted">Use for a normal empty list, when you just need to report emptiness without guidance or a next action.</Typography>
                </div>
                <EmptyState
                    icon={<TrayIcon weight="duotone" />}
                    title="No courses yet"
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Add a description</Label>
                    <Typography type="body-sm" color="muted">Use when you need to hint at what to do next, e.g. a search with no results should suggest changing filters or keywords.</Typography>
                </div>
                <EmptyState
                    icon={<MagnifyingGlassIcon weight="duotone" />}
                    title="No results found"
                    description="Try adjusting your filters or search keywords to see more results."
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>With an action</Label>
                    <Typography type="body-sm" color="muted">Use when there's a clear create-new action so the user can leave the empty state right here.</Typography>
                </div>
                <EmptyState
                    icon={<TrayIcon weight="duotone" />}
                    title="Empty list"
                    description="You haven't saved any items to this list yet."
                    action={<Button variant="primary">Add new item</Button>}
                />
            </div>
        </div>
    ),
}

/**
 * Use when data loading fails (network error, API error) — a warning icon + a "Try again" button so the user can recover, not an ordinary empty state.
 */
export const ErrorTone: Story = {
    args: {
        icon: <WarningCircleIcon weight="duotone" />,
        title: "Couldn't load data",
        description: "Something went wrong. Please try again later.",
        action: <Button variant="danger">Try again</Button>,
    },
    parameters: {
        usage: "Use when data loading fails (network error, API error) — a warning icon + a \"Try again\" button so the user can recover, not an ordinary empty state.",
    },
}

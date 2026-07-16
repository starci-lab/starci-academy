import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { OutlineRail } from "@/components/blocks/navigation/OutlineRail"
import { Controlled, mockGroups } from "./components"

const meta: Meta<typeof OutlineRail> = {
    title: "Features/Learn/OutlineRail",
    component: OutlineRail,
}
export default meta
type Story = StoryObj<typeof OutlineRail>

/** Use when showing the course navigation rail with overall progress, a search box, and modules that already have data. */
export const Default: Story = {
    parameters: { usage: "Use when showing the course navigation rail with overall progress, a search box, and modules that already have data." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With data</Label>
                <Typography type="body-sm" color="muted">
                    The course navigation rail with overall progress, a search box, and modules that already have data.
                </Typography>
            </div>
            <Controlled
                header={{
                    label: "Progress",
                    progress: { done: 3, total: 9 },
                    countLabel: "3/9 lessons",
                    continue: { label: "Continue learning", onPress: () => {} },
                }}
                groups={mockGroups}
                async={{
                    isLoading: false,
                    skeleton: null,
                    isEmpty: false,
                    emptyTitle: "No content yet",
                    errorTitle: "Couldn't load content",
                    onRetry: () => {},
                    retryLabel: "Retry",
                    noMatchLabel: "No matching lessons found",
                }}
            />
        </div>
    ),
}

/** Use when the module data is loading for the first time, before there is any progress to show in the header. */
export const Loading: Story = {
    parameters: { usage: "Use when the module data is loading for the first time, before there is any progress to show in the header." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Loading</Label>
                <Typography type="body-sm" color="muted">
                    When the module data is loading for the first time, before there is any progress to show in the header.
                </Typography>
            </div>
            <Controlled
                groups={[]}
                async={{
                    isLoading: true,
                    skeleton: (
                        <div className="flex flex-col gap-3">
                            <div className="h-14 w-full animate-pulse rounded-lg bg-default-100" />
                            <div className="h-14 w-full animate-pulse rounded-lg bg-default-100" />
                            <div className="h-14 w-full animate-pulse rounded-lg bg-default-100" />
                        </div>
                    ),
                    isEmpty: false,
                    emptyTitle: "No content yet",
                    errorTitle: "Couldn't load content",
                    onRetry: () => {},
                    retryLabel: "Retry",
                    noMatchLabel: "No matching lessons found",
                }}
            />
        </div>
    ),
}

/** Use when the course has no published modules/lessons yet. */
export const Empty: Story = {
    parameters: { usage: "Use when the course has no published modules/lessons yet." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Empty</Label>
                <Typography type="body-sm" color="muted">
                    When the course has no published modules/lessons yet.
                </Typography>
            </div>
            <Controlled
                groups={[]}
                async={{
                    isLoading: false,
                    skeleton: null,
                    isEmpty: true,
                    emptyTitle: "No content for this course yet",
                    errorTitle: "Couldn't load content",
                    onRetry: () => {},
                    retryLabel: "Retry",
                    noMatchLabel: "No matching lessons found",
                }}
            />
        </div>
    ),
}

/** Use when the search term doesn't match any lesson in the available modules. */
export const NoMatch: Story = {
    parameters: { usage: "Use when the search term doesn't match any lesson in the available modules." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>No search match</Label>
                <Typography type="body-sm" color="muted">
                    When the search term doesn't match any lesson in the available modules.
                </Typography>
            </div>
            <Controlled
                initialQuery="advanced 3d graphics"
                groups={[]}
                async={{
                    isLoading: false,
                    skeleton: null,
                    isEmpty: false,
                    emptyTitle: "No content yet",
                    errorTitle: "Couldn't load content",
                    onRetry: () => {},
                    retryLabel: "Retry",
                    noMatchLabel: "No lessons match your search",
                }}
            />
        </div>
    ),
}

/** Use when loading the module data fails and the user needs a way to retry. */
export const ErrorState: Story = {
    parameters: { usage: "Use when loading the module data fails and the user needs a way to retry." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Load error</Label>
                <Typography type="body-sm" color="muted">
                    When loading the module data fails and the user needs a way to retry.
                </Typography>
            </div>
            <Controlled
                groups={[]}
                async={{
                    isLoading: false,
                    skeleton: null,
                    isEmpty: false,
                    emptyTitle: "No content yet",
                    errorTitle: "Couldn't load the lesson list",
                    error: new Error("Network request failed"),
                    onRetry: () => {},
                    retryLabel: "Retry",
                    noMatchLabel: "No matching lessons found",
                }}
            />
        </div>
    ),
}

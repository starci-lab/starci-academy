import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"

const meta: Meta<typeof ResponsiveBreadcrumb> = {
    title: "Block/Navigation/ResponsiveBreadcrumb",
    component: ResponsiveBreadcrumb,
}
export default meta
type Story = StoryObj<typeof ResponsiveBreadcrumb>

/**
 * The FULL `Home › … › Current` on desktop — this is exactly what makes ResponsiveBreadcrumb DIFFERENT from BackLink
 * (BackLink only has a single "Back" arrow). Shown only when the trail is short (<4 crumbs) AND the width is >= sm; narrower and it
 * collapses itself into a BackLink. Drop it into the `breadcrumb` slot of `PageHeader`.
 */
export const Default: Story = {
    parameters: {
        usage: "The FULL `Home › … › Current` on desktop — this is what makes ResponsiveBreadcrumb differ from `BackLink` (which only has a single \"Back\" arrow). Shown only when the trail is short (<4 crumbs) AND the screen is >= sm; narrower and it collapses itself into a `BackLink`. Drop it into the `breadcrumb` slot of `PageHeader`.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Full trail</Label>
                <Typography type="body-sm" color="muted">
                    The full Home › … › Current on desktop — this is the difference from BackLink. It shows only when the trail is short (under 4 crumbs) and the screen is sm or wider; narrower and it collapses itself.
                </Typography>
            </div>
            <ResponsiveBreadcrumb
                items={[
                    { key: "home", label: "Home", onPress: () => { } },
                    { key: "courses", label: "Courses", onPress: () => { } },
                    { key: "current", label: "Fullstack Mastery" },
                ]}
            />
        </div>
    ),
}

/**
 * From 4 crumbs up (or on mobile) → it REUSES the very same `BackLink` "Back". This is DELIBERATE reuse,
 * not duplication: a long trail wraps + eats vertical height, but a deep descendant was reached from the top nav so it only needs one
 * way back. The back target = the nearest still-clickable ancestor.
 */
export const Collapsed: Story = {
    parameters: {
        usage: "From 4 crumbs up (or on mobile) → it REUSES the very same `BackLink` \"Back\" (deliberate reuse, not duplication): a long trail wraps + eats vertical height, and a deep descendant was reached from the top nav. The back target = the nearest still-clickable ancestor.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Collapsed (≥4 crumbs → BackLink)</Label>
                <Typography type="body-sm" color="muted">
                    From 4 crumbs up (or on mobile) it reuses the very same BackLink — deliberate reuse, not duplication. A long trail wraps and eats vertical height, and a deep descendant was reached from the top nav.
                </Typography>
            </div>
            <ResponsiveBreadcrumb
                items={[
                    { key: "home", label: "Home", onPress: () => { } },
                    { key: "courses", label: "Courses", onPress: () => { } },
                    { key: "fullstack", label: "Fullstack Mastery", onPress: () => { } },
                    { key: "current", label: "Lesson 4: API design" },
                ]}
            />
        </div>
    ),
}

/** Use when the current page is itself the navigation root, with no ancestor to return to, so no back button is rendered. */
export const RootOnly: Story = {
    parameters: {
        usage: "Use when the current page is itself the navigation root, with no ancestor to return to, so no back button is rendered.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Root page</Label>
                <Typography type="body-sm" color="muted">
                    When the current page is itself the navigation root — no ancestor to return to, so no back button is rendered.
                </Typography>
            </div>
            <ResponsiveBreadcrumb
                items={[
                    { key: "current", label: "Home" },
                ]}
            />
        </div>
    ),
}

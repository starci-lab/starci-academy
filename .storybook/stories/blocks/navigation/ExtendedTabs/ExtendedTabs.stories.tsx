import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Tabs, Typography } from "@heroui/react"
import { HouseIcon, CompassIcon, GraduationCapIcon } from "@phosphor-icons/react"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import { Controlled } from "./components"

/**
 * `ExtendedTabs` — the standard StarCi tab strip, 3 TYPES by `variant` × `size`:
 * 1. Tabs-as-input (`primary` `sm`) — a small segmented control/toggle, w-fit.
 * 2. Large primary (`primary` `md`) — full-width, switches the WHOLE page content.
 * 3. Secondary (`secondary`) — hug-content underline, a content filter; sits BELOW
 *    the primary tabs when the system has two tab tiers.
 */
const meta: Meta<typeof ExtendedTabs> = {
    title: "Primitives/Navigation/ExtendedTabs",
    component: ExtendedTabs,
}
export default meta
type Story = StoryObj<typeof ExtendedTabs>

/**
 * TYPE 1 — Tabs as input: a small segmented strip (`variant="primary" size="sm"`) used as
 * a compact control/toggle (billing cycle, view mode) in a narrow area. Defaults to
 * w-fit (hugs the label); forcing w-full stretches the segments evenly and truncates long labels.
 */
export const TabsAsInput: Story = {
    parameters: {
        usage: "Type 1 — tabs as INPUT: a small segmented strip (`variant=\"primary\" size=\"sm\"`) used as a compact control/toggle in a narrow area (billing cycle, view mode). Defaults to w-fit (hugs the label, does not fill the row). Placed in a fixed narrow container, the segments split the width evenly and long labels truncate instead of overflowing. To change just one setting in place (the large content below stays), use this `primary size=\"sm\"` version (pill toggle).",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>w-fit — hugs the content</Label>
                    <Typography type="body-sm" color="muted">
                        Default: the strip hugs its labels, used as a toggle inside a panel/modal.
                    </Typography>
                </div>
                <Controlled defaultKey="monthly" variant="primary" size="sm">
                    <Tabs.ListContainer>
                        <Tabs.List aria-label="Billing cycle">
                            <Tabs.Tab id="monthly" aria-controls="panel-monthly">
                                Monthly
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="yearly" aria-controls="panel-yearly">
                                Yearly
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Controlled>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>w-full — stretched evenly, long labels truncate</Label>
                    <Typography type="body-sm" color="muted">
                        In a fixed narrow container: segments split the width evenly, labels wider than the cell are clipped.
                    </Typography>
                </div>
                <div className="w-64">
                    <Controlled defaultKey="grid" variant="primary" size="md">
                        <Tabs.ListContainer>
                            <Tabs.List aria-label="View mode">
                                <Tabs.Tab id="grid" aria-controls="panel-grid" aria-label="Detailed grid view" className="min-w-0">
                                    <span className="block truncate">Detailed grid view</span>
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab id="list" aria-controls="panel-list" aria-label="Compact list view" className="min-w-0">
                                    <span className="block truncate">Compact list view</span>
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.ListContainer>
                    </Controlled>
                </div>
            </div>
        </div>
    ),
}

/**
 * TYPE 2 — Large primary: `variant="primary" size="md"` full-width, evenly stretched.
 * Tabs switch the WHOLE page content (top-level section switch), e.g. a dashboard's main sections.
 */
export const PagePrimary: Story = {
    parameters: {
        usage: "Type 2 — LARGE tabs (`variant=\"primary\" size=\"md\"`): a full-width segmented strip that switches the ENTIRE page content. Use for page-level section switching (a dashboard's Overview/Explore/Courses). Pair with icons for stronger visual cues.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Controls the whole page</Label>
                <Typography type="body-sm" color="muted">
                    Tabs switch the entire page content — moving between a dashboard's main sections.
                </Typography>
            </div>
            <Controlled defaultKey="overview" variant="primary">
                <Tabs.ListContainer>
                    <Tabs.List aria-label="Dashboard navigation">
                        <Tabs.Tab id="overview" aria-controls="panel-overview">
                            <span className="flex items-center gap-2">
                                <HouseIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                <span>Overview</span>
                            </span>
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="explore" aria-controls="panel-explore">
                            <span className="flex items-center gap-2">
                                <CompassIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                <span>Explore</span>
                            </span>
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="courses" aria-controls="panel-courses">
                            <span className="flex items-center gap-2">
                                <GraduationCapIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                <span>Courses</span>
                            </span>
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </Controlled>
        </div>
    ),
}

/**
 * TYPE 3 — Secondary: `variant="secondary"` underline, hug-content. A content filter
 * beside a reading column (language switch, post filter) — usually sits BELOW the primary
 * strip when the page has two tab tiers (primary switches the page, secondary filters within it). Icons optional.
 */
export const SecondaryFilter: Story = {
    parameters: {
        usage: "Type 3 — SECONDARY tabs (`variant=\"secondary\"`, default): a hug-content underline that filters content within a page (language switch, post filter). In a two-tier tab system, secondary sits BELOW the primary strip — primary switches the page, secondary filters within the panel. May include icons; on narrow screens they go icon-only, with labels reappearing from md up.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Content filter</Label>
                    <Typography type="body-sm" color="muted">
                        Hug-content underline, beside a reading column — language switch, post filter. Sits below the primary tabs in a two-tier setup.
                    </Typography>
                </div>
                <Controlled defaultKey="overview">
                    <Tabs.ListContainer>
                        <Tabs.List aria-label="Content filter">
                            <Tabs.Tab id="overview" aria-controls="panel-overview">
                                Overview
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="reviews" aria-controls="panel-reviews">
                                Reviews
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="qna" aria-controls="panel-qna">
                                Q&A
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Controlled>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>With icons</Label>
                    <Typography type="body-sm" color="muted">
                        Icon + label for stronger visual cues; narrow screens go icon-only, labels reappear from md up.
                    </Typography>
                </div>
                <Controlled defaultKey="courses">
                    <Tabs.ListContainer>
                        <Tabs.List aria-label="Learning categories">
                            <Tabs.Tab id="courses" aria-controls="panel-courses">
                                <span className="flex items-center gap-2">
                                    <GraduationCapIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                    <span className="hidden @app-md:inline">Courses</span>
                                </span>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id="explore" aria-controls="panel-explore">
                                <span className="flex items-center gap-2">
                                    <CompassIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                    <span className="hidden @app-md:inline">Explore</span>
                                </span>
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Controlled>
            </div>
        </div>
    ),
}

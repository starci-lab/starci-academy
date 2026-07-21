import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Tabs } from "@heroui/react"
import { HouseIcon, CompassIcon, GraduationCapIcon } from "@phosphor-icons/react"
import { ExtendedTabs } from "./ExtendedTabs"

const meta: Meta<typeof ExtendedTabs> = {
    title: "Primitives/Navigation/ExtendedTabs",
    component: ExtendedTabs,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ExtendedTabs>

/** Owns the selected-tab state since `ExtendedTabs` is fully controlled. */
const Controlled = ({
    defaultKey,
    variant,
    size,
    children,
}: {
    defaultKey: string
    variant?: "primary" | "secondary"
    size?: "sm" | "md"
    children: ReactNode
}) => {
    const [selectedKey, setSelectedKey] = useState(defaultKey)
    return (
        <ExtendedTabs selectedKey={selectedKey} onSelectionChange={setSelectedKey} variant={variant} size={size}>
            {children}
        </ExtendedTabs>
    )
}

/** Type 1 — tabs as INPUT: a compact `primary`/`sm` segmented control, `w-fit`. */
export const InputWFit: Story = {
    render: () => (
        <div className="p-8">
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
    ),
}

/** `primary`/`md` in a fixed-width box: segments split evenly, long labels truncate. */
export const FullWidthTruncate: Story = {
    render: () => (
        <div className="p-8">
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
    ),
}

/** Type 2 — large `primary`/`md`: full-width segmented pill that switches the WHOLE page. */
export const PrimaryLarge: Story = {
    render: () => (
        <div className="p-8">
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

/** Type 3 — `secondary` (default): hug-content underline filter within a page. */
export const Secondary: Story = {
    render: () => (
        <div className="p-8">
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
    ),
}

/** `secondary` with an icon + label — icon-only on mobile, label returns from `md` up. */
export const SecondaryWithIcons: Story = {
    render: () => (
        <div className="p-8">
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
    ),
}

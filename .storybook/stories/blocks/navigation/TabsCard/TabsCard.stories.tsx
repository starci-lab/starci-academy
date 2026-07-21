import { useState } from "react"
import type { Key, ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Card, CardContent, Typography } from "@heroui/react"
import { GearIcon, GlobeIcon, PlusIcon } from "@phosphor-icons/react"
import { TabsCard, type TabsCardItem, type TabsCardProps } from "./TabsCard"

const meta: Meta<typeof TabsCard> = {
    title: "Primitives/Navigation/TabsCard",
    component: TabsCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TabsCard>

const CONTENT_TABS: Array<TabsCardItem> = [
    { key: "overview", label: "Overview" },
    { key: "content", label: "Content" },
    { key: "reviews", label: "Reviews" },
]

const LANGUAGE_TABS: Array<TabsCardItem> = [
    { key: "vi", label: "Tiếng Việt", icon: <GlobeIcon size={16} /> },
    { key: "en", label: "English", icon: <GlobeIcon size={16} /> },
]

const PANEL_CONTENT: Record<string, { title: string; body: string }> = {
    overview: { title: "Overview", body: "Introduces the course, its learning outcomes and the week-by-week study path." },
    content: { title: "Content", body: "The list of lessons and exercises for each module, with their durations." },
    reviews: { title: "Reviews", body: "Feedback and ratings from learners who have completed the course." },
    start: { title: "Start", body: "Initial configuration and the steps to get this area up and running." },
    history: { title: "History", body: "Every activity that has taken place, ordered from most recent." },
    stats: { title: "Stats", body: "The area's aggregate metrics — currently locked." },
}

/** The panel card changes with the selected tab — pressing a tab re-renders the block below. */
const TabPanel = ({ selectedKey }: { selectedKey: string }) => {
    const panel = PANEL_CONTENT[selectedKey]
    return (
        <Card>
            <CardContent>
                <div className="flex flex-col gap-2">
                    <Typography type="h4" weight="semibold">{panel?.title}</Typography>
                    <Typography type="body-sm" color="muted">{panel?.body}</Typography>
                </div>
            </CardContent>
        </Card>
    )
}

/** Owns left/right selected-tab state since `TabsCard`'s groups are fully controlled. */
const Controlled = (props: Omit<TabsCardProps, "leftTabs" | "rightTabs"> & {
    leftItems: Array<TabsCardItem>
    leftAriaLabel?: string
    defaultLeftKey: string
    rightItems?: Array<TabsCardItem>
    rightAriaLabel?: string
    defaultRightKey?: string
}) => {
    const {
        leftItems,
        leftAriaLabel = "Course sections",
        defaultLeftKey,
        rightItems,
        rightAriaLabel = "Language",
        defaultRightKey,
        ...rest
    } = props
    const [leftKey, setLeftKey] = useState(defaultLeftKey)
    const [rightKey, setRightKey] = useState(defaultRightKey ?? "")
    return (
        <div className="flex w-[36rem] max-w-full flex-col gap-3">
            <TabsCard
                {...rest}
                leftTabs={{
                    items: leftItems,
                    selectedKey: leftKey,
                    ariaLabel: leftAriaLabel,
                    onSelectionChange: (key: Key) => setLeftKey(String(key)),
                }}
                rightTabs={rightItems ? {
                    items: rightItems,
                    selectedKey: rightKey,
                    ariaLabel: rightAriaLabel,
                    onSelectionChange: (key: Key) => setRightKey(String(key)),
                } : undefined}
            />
            <TabPanel selectedKey={leftKey} />
        </div>
    )
}

const addButton: ReactNode = (
    <Button isIconOnly variant="ghost" size="sm" aria-label="Add new section">
        <PlusIcon size={16} />
    </Button>
)

/** One tab group that switches the WHOLE panel below (secondary underline). */
export const SingleGroup: Story = {
    render: () => (
        <div className="p-8">
            <Controlled leftItems={CONTENT_TABS} defaultLeftKey="overview" />
        </div>
    ),
}

/** Two groups: left content (accent) + right language (`rightTabsNeutral`, `collapseRightOnMobile`). */
export const TwoGroups: Story = {
    render: () => (
        <div className="p-8">
            <Controlled
                leftItems={CONTENT_TABS}
                defaultLeftKey="overview"
                rightItems={LANGUAGE_TABS}
                rightAriaLabel="Language"
                defaultRightKey="vi"
                rightTabsNeutral
                collapseRightOnMobile
            />
        </div>
    ),
}

/** `leftEnd`: an action pinned right after the left group (sibling of the tab list). */
export const WithLeftEnd: Story = {
    render: () => (
        <div className="p-8">
            <Controlled leftItems={CONTENT_TABS} defaultLeftKey="overview" leftEnd={addButton} />
        </div>
    ),
}

/** `variant="primary"` — full-width segmented pill with a locked (disabled) tab. */
export const PrimaryWithLocked: Story = {
    render: () => (
        <div className="p-8">
            <Controlled
                leftItems={[
                    { key: "start", label: "Start", icon: <GearIcon size={16} /> },
                    { key: "history", label: "History" },
                    { key: "stats", label: "Stats", isDisabled: true },
                ]}
                leftAriaLabel="Area"
                defaultLeftKey="start"
                variant="primary"
            />
        </div>
    ),
}

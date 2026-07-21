import { useState } from "react"
import type { Key } from "react"
import { GlobeIcon } from "@phosphor-icons/react"
import { Card, CardContent, Typography } from "@heroui/react"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import type { TabsCardItem, TabsCardProps } from "@/components/blocks/navigation/TabsCard"

export const CONTENT_TABS: Array<TabsCardItem> = [
    { key: "overview", label: "Overview" },
    { key: "content", label: "Content" },
    { key: "reviews", label: "Reviews" },
]

export const LANGUAGE_TABS: Array<TabsCardItem> = [
    { key: "vi", label: "Tiếng Việt", icon: <GlobeIcon size={16} /> },
    { key: "en", label: "English", icon: <GlobeIcon size={16} /> },
]

export const PANEL_CONTENT: Record<string, { title: string, body: string }> = {
    overview: { title: "Overview", body: "Introduces the course, its learning outcomes and the week-by-week study path." },
    content: { title: "Content", body: "The list of lessons and exercises for each module, with their durations." },
    reviews: { title: "Reviews", body: "Feedback and ratings from learners who have completed the course." },
    start: { title: "Start", body: "Initial configuration and the steps to get this area up and running." },
    history: { title: "History", body: "Every activity that has taken place, ordered from most recent." },
    stats: { title: "Stats", body: "The area's aggregate metrics — currently locked." },
}

/** The panel card changes with the selected tab — pressing a tab in TabsCard re-renders the whole card block below.
 * Top-level card: HeroUI `Card` bakes in shadow-surface + no-border + p-3 (don't hand-roll a bordered div). */
export const TabPanel = ({ selectedKey }: { selectedKey: string }) => {
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

/** Wrapper that owns left/right selected-tab state since `TabsCard`'s groups are fully controlled. */
export const Controlled = (props: Omit<TabsCardProps, "leftTabs" | "rightTabs"> & {
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
        <div className="flex w-[36rem] max-w-full flex-col gap-4">
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

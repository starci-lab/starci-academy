import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import type { Key } from "react"
import { GearIcon, PlusIcon } from "@phosphor-icons/react"
import { Button, Label, Typography } from "@heroui/react"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { CONTENT_TABS, LANGUAGE_TABS, TabPanel } from "./components"

const meta: Meta<typeof TabsCard> = {
    title: "Core/Card/TabsCard",
    component: TabsCard,
}
export default meta
type Story = StoryObj<typeof TabsCard>

/**
 * TabCard — ONE tab group in a toolbar row: pressing a tab switches the WHOLE panel below, or
 * jumps to another route (navigation → underline strip). To change just one setting in place while the
 * large content below stays the same (VND⇆USD, Grid⇆List) → use this same TabsCard at `variant="primary" size="sm"` (small in-place pill).
 * The number of tabs doesn't decide it: 2 tabs is still a TabsCard if it switches the panel.
 */
export const TabCard: Story = {
    parameters: {
        usage:
            "TabCard (1 group) — pressing a tab SWITCHES THE WHOLE PANEL below or jumps to another route (navigation, underline strip). " +
            "To change just one compact setting in place while the large content below stays (VND⇆USD, Grid⇆List) → use this same TabsCard at `variant=\"primary\" size=\"sm\"` (small in-place pill). " +
            "The number of choices doesn't decide it: 2 tabs is still a TabsCard if it switches the panel — WHAT it controls is what decides.",
    },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("overview")
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>One tab group (switches the whole panel)</Label>
                    <Typography type="body-sm" color="muted">
                        Pressing a tab switches the whole panel below or jumps to another route — navigation, underline strip.
                    </Typography>
                </div>
                <div className="flex w-[36rem] flex-col gap-4">
                    <TabsCard
                        leftTabs={{
                            items: CONTENT_TABS,
                            selectedKey,
                            ariaLabel: "Course sections",
                            onSelectionChange: (key: Key) => setSelectedKey(String(key)),
                        }}
                    />
                    <TabPanel selectedKey={selectedKey} />
                </div>
            </div>
        )
    },
}

/**
 * DoubleTabsCard — TWO tab groups sharing one row: `leftTabs` (the main content axis, accent)
 * pinned left + `rightTabs` (a secondary switcher, e.g. language) pinned right. `rightTabsNeutral`
 * keeps the right group neutral (a single accent on the row). `collapseRightOnMobile` = the right group
 * collapses into a dropdown Select below `sm` and expands back into tabs from `sm` up (the MOBILE version).
 */
export const DoubleTabsCard: Story = {
    parameters: {
        usage:
            "DoubleTabsCard (2 groups) — `leftTabs` (the main content axis, accent) + `rightTabs` (a secondary switcher like language). " +
            "`rightTabsNeutral` keeps the right group neutral so the row has just one accent signal. `collapseRightOnMobile` = the right group " +
            "collapses into a dropdown below `sm` (the mobile version) then expands back into tabs from `sm` up — try resizing the screen to see. " +
            "Use when the right group is a set-once preference (language) that easily crowds a narrow reading column.",
    },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("overview")
        const [lang, setLang] = useState("vi")
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Two tab groups + mobile version</Label>
                    <Typography type="body-sm" color="muted">
                        Main content axis on the left (accent) + secondary switcher on the right (neutral); on narrow screens the switcher collapses into a dropdown.
                    </Typography>
                </div>
                <div className="flex w-[36rem] max-w-full flex-col gap-4">
                    <TabsCard
                        leftTabs={{
                            items: CONTENT_TABS,
                            selectedKey,
                            ariaLabel: "Course sections",
                            onSelectionChange: (key: Key) => setSelectedKey(String(key)),
                        }}
                        rightTabs={{
                            items: LANGUAGE_TABS,
                            selectedKey: lang,
                            ariaLabel: "Language",
                            onSelectionChange: (key: Key) => setLang(String(key)),
                        }}
                        rightTabsNeutral
                        collapseRightOnMobile
                    />
                    <TabPanel selectedKey={selectedKey} />
                </div>
            </div>
        )
    },
}

/** Use when you need to attach a related action (add, manage) right next to the left tab group without nesting it inside a tab itself. */
export const WithLeftEndAction: Story = {
    parameters: { usage: "Use when you need to attach a related action (add, manage) right next to the left tab group, without nesting it inside a tab itself (`leftEnd` is a sibling of the tab list, not a Tabs.Tab)." },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("overview")
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>With an action beside the tabs</Label>
                    <Typography type="body-sm" color="muted">
                        Attach a related action (add, manage) right next to the left tab group, without nesting it inside a tab itself.
                    </Typography>
                </div>
                <div className="flex w-[36rem] flex-col gap-4">
                    <TabsCard
                        leftTabs={{
                            items: CONTENT_TABS,
                            selectedKey,
                            ariaLabel: "Course sections",
                            onSelectionChange: (key: Key) => setSelectedKey(String(key)),
                        }}
                        leftEnd={(
                            <Button isIconOnly variant="ghost" size="sm" aria-label="Add new section">
                                <PlusIcon size={16} />
                            </Button>
                        )}
                    />
                    <TabPanel selectedKey={selectedKey} />
                </div>
            </div>
        )
    },
}

/** Use for tabs that switch a page-level area (not a content filter) — a full-width segmented strip that can contain a locked/disabled tab. */
export const PrimaryVariant: Story = {
    parameters: { usage: "Use for tabs that switch a page-level area (`variant=\"primary\"`, not a content filter) — a full-width segmented strip that can contain a locked/disabled tab." },
    render: () => {
        const [selectedKey, setSelectedKey] = useState("start")
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Primary variant</Label>
                    <Typography type="body-sm" color="muted">
                        Tabs that switch a page-level area (not a content filter) — a full-width segmented strip that can contain a locked tab.
                    </Typography>
                </div>
                <div className="flex w-[36rem] flex-col gap-4">
                    <TabsCard
                        variant="primary"
                        leftTabs={{
                            items: [
                                { key: "start", label: "Start", icon: <GearIcon size={16} /> },
                                { key: "history", label: "History" },
                                { key: "stats", label: "Stats", isDisabled: true },
                            ],
                            selectedKey,
                            ariaLabel: "Area",
                            onSelectionChange: (key: Key) => setSelectedKey(String(key)),
                        }}
                    />
                    <TabPanel selectedKey={selectedKey} />
                </div>
            </div>
        )
    },
}

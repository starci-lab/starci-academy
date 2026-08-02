import { useState } from "react"
import type { Key, ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { GearIcon, GlobeIcon, PlusIcon } from "@phosphor-icons/react"
import { Toolbar, type ToolbarBaseProps, type ToolbarTabItem } from "@sb-components/composites/navigation/Toolbar/Toolbar"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Toolbar` — the nav/control-row frame sitting above a panel: the primary tab group pinned
 * left (+ an action cluster `leftEnd` right after it), a secondary tab group pinned right,
 * collapsing into a dropdown below `@app-sm`. No chrome; root is
 * `flex items-center justify-between gap-3`. Tab groups come in as data
 * (`items`/`selectedKey`/`onSelectionChange`), and each tab's display state (disabled/muted) is drawn here.
 */
const meta: Meta<typeof Toolbar> = {
    title: "Composites/Navigation/Toolbar/Toolbar",
    component: Toolbar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Toolbar>

const CONTENT_TABS: Array<ToolbarTabItem> = [
    { key: "overview", label: "Overview" },
    { key: "content", label: "Content" },
    { key: "reviews", label: "Reviews" },
]

// A tab's `icon` is a pre-built NODE, so the story forces its own size + weight:
// `size-4` is smaller than `size-5` ⇒ compensate with `weight="bold"` so the stroke
// doesn't thin out (§5.0a).
const LANGUAGE_TABS: Array<ToolbarTabItem> = [
    { key: "vi", label: "Vietnamese", icon: <GlobeIcon data-tier="fixture" className="size-4" weight="bold" /> },
    { key: "en", label: "English", icon: <GlobeIcon data-tier="fixture" className="size-4" weight="bold" /> },
]

/** One row of the `PANEL_CONTENT` lookup — the title/body shown for a single tab key. */
interface PanelRow {
    /** Panel heading shown for this tab. */
    title: string
    /** Panel body copy shown for this tab. */
    body: string
}

const PANEL_CONTENT: Record<string, PanelRow> = {
    overview: { title: "Overview", body: "Course overview, expected outcomes, and the week-by-week roadmap." },
    content: { title: "Content", body: "The lesson and exercise list for each module, with durations." },
    reviews: { title: "Reviews", body: "Feedback and ratings from students who have finished the course." },
    start: { title: "Start", body: "Initial setup and the steps needed to get this area running." },
    history: { title: "History", body: "Every past activity, newest first." },
    stats: { title: "Stats", body: "Aggregate stats for this area — currently locked." },
    pro: { title: "Pro", body: "Content reserved for the paid plan — the caller blocks selection to open the paywall." },
}

/** Props for the `TabPanel` helper. */
interface TabPanelProps {
    /** Key of the currently selected tab, used to look up `PANEL_CONTENT`. */
    selectedKey: string
}

/** Panel content follows the selected tab — clicking a tab re-renders the block below (proof the tabs are live). */
const TabPanel = ({ selectedKey }: TabPanelProps) => {
    const panel = PANEL_CONTENT[selectedKey]
    return (
        <SurfaceCard
            body={() => (
                <div className="flex flex-col gap-2">
                    <Typography text={panel?.title} weight="bold" />
                    <Typography size="sm" text={panel?.body} color="muted" />
                </div>
            )}
        />
    )
}

/** Holds the left/right tab state for the story — both of `Toolbar`'s groups are CONTROLLED. */
const Controlled = (props: Omit<ToolbarBaseProps, "leftTabs" | "rightTabs"> & {
    leftItems: Array<ToolbarTabItem>
    leftAriaLabel?: string
    defaultLeftKey: string
    rightItems?: Array<ToolbarTabItem>
    rightAriaLabel?: string
    defaultRightKey?: string
}) => {
    const {
        leftItems,
        leftAriaLabel = "Course section",
        defaultLeftKey,
        rightItems,
        rightAriaLabel = "Language",
        defaultRightKey,
        ...rest
    } = props
    const [leftKey, setLeftKey] = useState(defaultLeftKey)
    const [rightKey, setRightKey] = useState(defaultRightKey ?? "")
    return (
        <div data-tier="fixture" className="flex w-[36rem] max-w-full flex-col gap-3">
            <Toolbar
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

// Pass the icon as a COMPONENT down to the atom — the atom forces its own size + weight (§5.0a); the story doesn't pick the stroke.
const addButton: ReactNode = (
    <Button isIconOnly prefixIcon={PlusIcon} ariaLabel="Add new section" variant="ghost" size="sm" onPress={() => {}} />
)

// Parts Toolbar composes DIRECTLY — LeftTabs (main group) · LeftEnd (the action
// cluster beside it) · RightTabs (secondary group, inline or collapsed to a Select
// below `@app-sm`). Each leaf only declares exactly what it renders.
const LEFT_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "TabsExtended", tier: "atom", role: "the main tab group, driving the whole panel below it", storyId: "atoms-navigation-tabs-tabsextended--default" },
]
const TWO_GROUPS_PARTS: Array<AnatomyNode> = [
    { name: "TabsExtended", tier: "atom", role: "the content tab group (accent), pinned left", storyId: "atoms-navigation-tabs-tabsextended--default" },
    { name: "TabsExtended", tier: "atom", role: "the secondary tab group, pinned right", storyId: "atoms-navigation-tabs-tabsextended--default" },
]
// Collapsed right group mounts BOTH real components at once (one hidden under `@app-sm` via CSS),
// so it gets two nodes instead of one wrapper name that could only honestly describe one of them.
const COLLAPSE_PARTS: Array<AnatomyNode> = [
    { name: "TabsExtended", tier: "atom", role: "the content tab group (accent), pinned left", storyId: "atoms-navigation-tabs-tabsextended--default" },
    { name: "Select.Root", tier: "heroui", role: "the collapsed language group below `@app-sm`, an icon-only dropdown" },
    { name: "TabsExtended", tier: "atom", role: "the language group (neutral), inline from `@app-sm` up", storyId: "atoms-navigation-tabs-tabsextended--default" },
]
// `leftEnd` is an arbitrary caller-supplied slot (any node beside the left group) — the toolbar
// never fixes what renders there and never claims it as its own anatomy (§11a caller-slot rule),
// so it carries no badge even though this demo fills it with a `Button`.
const LEFT_END_PARTS: Array<AnatomyNode> = [
    { name: "TabsExtended", tier: "atom", role: "the main tab group", storyId: "atoms-navigation-tabs-tabsextended--default" },
]

/** One tab group that switches the ENTIRE panel below (secondary, underline) — the minimal shape. */
export const SingleGroup: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="SingleGroup"
                parts={LEFT_ONLY_PARTS}
                reason="A navigation/control ROW that sits above a panel: pin the left tab group, optionally an action cluster right after it, optionally a right tab group. It carries no function of its own, it doesn't know what the panel below is, it only fires `onSelectionChange` for the caller. The old name `TabsCard` was dropped because there is no card here at all, no background, border, radius, or padding."
                states={[
                    {
                        name: "only leftTabs passed",
                        why: "Only the LeftTabs group renders; there is no LeftEnd cluster and no RightTabs group. This is the minimal shape, a single tab group that switches the whole panel below it.",
                        code: `<Toolbar
  leftTabs={{ items, selectedKey, ariaLabel: "Course section", onSelectionChange }}
/>`,
                        render: <Controlled leftItems={CONTENT_TABS} defaultLeftKey="overview" />,
                    },
                ]}
            />
        </div>
    ),
}

/** `leftEnd`: an action pinned right AFTER the left group — a sibling of the tab list, never nested inside a Tab. */
export const WithLeftEnd: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="WithLeftEnd"
                parts={LEFT_END_PARTS}
                states={[
                    {
                        name: "leftEnd passed",
                        why: "A LeftEnd node appears right after LeftTabs as its sibling, gathered tight with `gap-1`, not nested inside any Tab. react-aria forbids nesting an interactive element inside `Tabs.Tab`, so an action like adding a new section has to live beside the tab list instead of inside it.",
                        code: `<Toolbar
  leftTabs={…}
  leftEnd={<Button isIconOnly prefixIcon={PlusIcon} ariaLabel="Add new section" variant="ghost" size="sm" />}
/>`,
                        render: <Controlled leftItems={CONTENT_TABS} defaultLeftKey="overview" leftEnd={addButton} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Two groups on the same row — the right group INLINE, sharing the same accent chrome as the left one. */
export const TwoGroups: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="TwoGroups"
                parts={TWO_GROUPS_PARTS}
                states={[
                    {
                        name: "leftTabs and rightTabs both passed",
                        why: "A second RightTabs group appears at the far right, pushed there by `justify-between`, with `gap-3` between the two groups. By default the right group carries the same accent chrome as the left one and always stays inline.",
                        code: "<Toolbar leftTabs={…} rightTabs={…} />",
                        render: (
                            <Controlled
                                leftItems={CONTENT_TABS}
                                defaultLeftKey="overview"
                                rightItems={LANGUAGE_TABS}
                                defaultRightKey="vi"
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * `rightTabsNeutral` + `collapseRightOnMobile` — the right group is a "same content,
 * different presentation" switch (a language toggle): NEUTRAL chrome so the row
 * carries only ONE accent signal, and it collapses into an icon-only dropdown
 * below `@app-sm`.
 */
export const RightNeutralCollapsed: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="RightNeutralCollapsed"
                parts={COLLAPSE_PARTS}
                states={[
                    {
                        name: "rightTabsNeutral = true, collapseRightOnMobile = true",
                        why: "The right group's chrome drops to neutral so only one accent signal remains on the row, and under `@app-sm` it collapses into an icon-only Select with an `sr-only` label instead of inline tabs. This is for a right group that is a presentation switch, such as language, rather than a second real navigation choice.",
                        code: `<Toolbar
  leftTabs={…}
  rightTabs={…}
  rightTabsNeutral
  collapseRightOnMobile
/>`,
                        render: (
                            <Controlled
                                leftItems={CONTENT_TABS}
                                defaultLeftKey="overview"
                                rightItems={LANGUAGE_TABS}
                                defaultRightKey="vi"
                                rightTabsNeutral
                                collapseRightOnMobile
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * `variant="primary"` — a full-width segmented pill, for a row that replaces the
 * panel content ENTIRELY.
 *
 * MERGED INTO ONE LEAF (§14d.2): `size="sm"` (the old name of its own separate
 * leaf, `Compact`) changes NO node — it's still the exact same LeftTabs cluster,
 * only shrunk to `w-fit` with smaller text/padding. Same tree ⇒ a STATE of this
 * leaf, not a second leaf. `size` also only affects `variant="primary"` (secondary
 * is already hug-content).
 *
 * Only the default `size` sits inside `BlockAnatomy`; the `size="sm"` version is
 * a reference sibling outside the panel, so this leaf keeps exactly one state.
 */
export const PrimaryVariant: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="PrimaryVariant"
                states={[
                    {
                        name: "variant = \"primary\"",
                        why: "LeftTabs switches to a segmented, full-width pill instead of the secondary underline style, still the only part rendered, no rightTabs and no leftEnd. This is for a row where selecting a tab replaces the panel content entirely, so the tab group itself deserves the loudest chrome.",
                        code: "<Toolbar variant=\"primary\" leftTabs={…} />",
                        render: (
                            <Controlled
                                leftItems={[
                                    // icon tab `size-4` < `size-5` ⇒ `weight="bold"` (§5.0a).
                                    { key: "start", label: "Start", icon: <GearIcon data-tier="fixture" className="size-4" weight="bold" /> },
                                    { key: "history", label: "History" },
                                    { key: "stats", label: "Stats" },
                                ]}
                                leftAriaLabel="Area"
                                defaultLeftKey="start"
                                variant="primary"
                               
                            />
                        ),
                    },
                ]}
            />
            {/* Reference sibling: same leaf at size="sm" — the strip shrinks to w-fit with
                smaller text/padding, but the composition is identical to the state above. */}
            <Controlled
                leftItems={[
                    { key: "start", label: "Start", icon: <GearIcon data-tier="fixture" className="size-4" weight="bold" /> },
                    { key: "history", label: "History" },
                    { key: "stats", label: "Stats" },
                ]}
                leftAriaLabel="Area (size sm)"
                defaultLeftKey="start"
                variant="primary"
                size="sm"
            />
        </div>
    ),
}

/**
 * State of EACH tab is drawn by the frame: `isDisabled` (locks selection, can't be
 * pressed) vs `muted` (still pressable — the parent blocks it to open a paywall).
 * Two DIFFERENT things — don't conflate them.
 */
export const TabStates: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Toolbar"
                tier="composite"
                leaf="TabStates"
                parts={LEFT_ONLY_PARTS}
                states={[
                    {
                        name: "one tab isDisabled, one tab muted",
                        why: "The `Stats` tab locks hard, no focus and no selection reach it, while the `Pro` tab still selects normally but renders muted. `isDisabled` is a hard lock the toolbar itself enforces; `muted` still lets the caller's own handler run so it can open a paywall instead.",
                        code: `leftTabs={{ items: [
  { key: "start", label: "Start" },
  { key: "stats", label: "Stats", isDisabled: true },
  { key: "pro", label: "Pro", muted: true },
], … }}`,
                        render: (
                            <Controlled
                                leftItems={[
                                    { key: "start", label: "Start" },
                                    { key: "history", label: "History" },
                                    { key: "stats", label: "Stats", isDisabled: true },
                                    { key: "pro", label: "Pro", muted: true },
                                ]}
                                leftAriaLabel="Area"
                                defaultLeftKey="start"
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

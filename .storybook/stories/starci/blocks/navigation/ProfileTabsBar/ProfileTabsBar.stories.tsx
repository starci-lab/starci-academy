import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProfileTabsBar, type ProfileTab } from "@sb-components/starci/blocks/navigation/ProfileTabsBar/ProfileTabsBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ProfileTabsBar`: the public-profile route strip (overview / projects
 * / challenges / skills / cv / activity).
 *
 * ⭐ GATING STAYS UPSTREAM. The real component computes `visibleTabs` from
 * `isSelf`/`hasPublicCv`/`sectionVisibility` and pushes routes itself; this
 * block only draws the ALREADY-GATED list the caller hands it and reports a
 * pick back via `onTabChange` — see the component file header.
 *
 * ⭐ `TabsExtended`, not `TabsBase` — a plain `items` atom cannot express one
 * region (icon) staying visible while another (label + owner marker) drops out
 * below `@app-md`, so this composes the compound `Tabs.*` children directly.
 *
 * 📐 ONE LEAF by STRUCTURE: which tabs show, which is active, and which
 * carries the "· ẩn" marker are DATA — states inside one leaf, not separate
 * leaves.
 */
const meta: Meta<typeof ProfileTabsBar> = {
    title: "StarCi/Blocks/Navigation/ProfileTabsBar/ProfileTabsBar",
    component: ProfileTabsBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProfileTabsBar>

const ALL_TABS: ReadonlyArray<ProfileTab> = ["overview", "projects", "challenges", "skills", "cv", "activity"]
const VISITOR_TABS: ReadonlyArray<ProfileTab> = ["overview", "projects", "challenges", "skills", "activity"]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TabsExtended": { tier: "atom", role: "wraps the HeroUI `Tabs` root so the block can compose the compound `Tabs.*` children itself — chosen over the data-only `TabsBase` because each tab needs an icon that stays visible while its label independently drops out below @app-md", storyId: "atoms-navigation-tabs-tabsextended--default" },
    "StackH": { tier: "frame", role: "the icon-then-label track inside one tab, seam `tight` because the label is a mark attached to its icon", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "the tab's label text, and — on a section the owner hid — the muted \"· ẩn\" marker riding beside it", storyId: "atoms-text-typography-typography--overview" },
    "Tabs.Tab": { tier: "heroui", role: "one tab in the HeroUI `Tabs` compound — the block builds this tree itself (see `TabsExtended`'s children contract), no story of its own" },
    "Tabs.Indicator": { tier: "heroui", role: "the accent underline HeroUI slides beneath the selected tab" },
}

/** LEAF — every destination, own-profile view. */
export const OwnerView: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ProfileTabsBar"
                tier="block"
                leaf="Icon + responsive label"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                states={[
                    {
                        name: "activeTab = overview, no hidden sections",
                        why: "The owner is looking at their own profile and every section is public, so all six tabs render plainly with the first one selected. This is the row's resting shape before any gating enters the picture.",
                        code: `<ProfileTabsBar
    ariaLabel="Hồ sơ"
    activeTab="overview"
    visibleTabs={["overview", "projects", "challenges", "skills", "cv", "activity"]}
    onTabChange={goTab}
/>`,
                        render: (
                            <ProfileTabsBar
                                anatPart="ProfileTabsBar"
                                showAnatomy
                                ariaLabel="Hồ sơ"
                                activeTab="overview"
                                visibleTabs={ALL_TABS}
                                onTabChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "activeTab = challenges",
                        why: "The indicator moves to a middle tab and nothing else about the row changes width or order — selection is the only thing this block tracks.",
                        code: `<ProfileTabsBar
    ariaLabel="Hồ sơ"
    activeTab="challenges"
    visibleTabs={allTabs}
    onTabChange={goTab}
/>`,
                        render: (
                            <ProfileTabsBar
                                ariaLabel="Hồ sơ"
                                activeTab="challenges"
                                visibleTabs={ALL_TABS}
                                onTabChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "hiddenTabs = [skills, activity]",
                        why: "The owner switched \"Skills\" and \"Activity\" off for visitors. They still see both tabs — visitors are simply never handed those keys at all — but each carries a muted \"· ẩn\" marker beside its label so the owner can tell which sections are currently private without opening settings.",
                        code: `<ProfileTabsBar
    ariaLabel="Hồ sơ"
    activeTab="overview"
    visibleTabs={allTabs}
    hiddenTabs={["skills", "activity"]}
    onTabChange={goTab}
/>`,
                        render: (
                            <ProfileTabsBar
                                ariaLabel="Hồ sơ"
                                activeTab="overview"
                                visibleTabs={ALL_TABS}
                                hiddenTabs={["skills", "activity"]}
                                onTabChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a visitor without a public CV: the "cv" tab never reaches this block at all. */
export const VisitorView: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ProfileTabsBar"
                tier="block"
                leaf="Icon + responsive label"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                states={[
                    {
                        name: "visitor, no public CV",
                        why: "The viewed user has no public CV and the visitor isn't the owner, so the caller never includes \"cv\" in visibleTabs — the tab doesn't render muted or disabled, it simply isn't one of the five keys this row was handed. No hiddenTabs marker applies here either: that marker is for the OWNER's own view, and a visitor never receives a withheld tab's key to begin with.",
                        code: `<ProfileTabsBar
    ariaLabel="Hồ sơ"
    activeTab="overview"
    visibleTabs={["overview", "projects", "challenges", "skills", "activity"]}
    onTabChange={goTab}
/>`,
                        render: (
                            <ProfileTabsBar
                                anatPart="ProfileTabsBar"
                                showAnatomy
                                ariaLabel="Hồ sơ"
                                activeTab="overview"
                                visibleTabs={VISITOR_TABS}
                                onTabChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

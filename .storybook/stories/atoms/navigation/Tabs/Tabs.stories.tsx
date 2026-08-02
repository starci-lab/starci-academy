import type { Meta, StoryObj } from "@storybook/nextjs"
import { HouseIcon, ChartBarIcon, ClockIcon } from "@phosphor-icons/react"
import { Tabs } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Tabs` wraps HeroUI `Tabs` directly. The `data-anat-part`s it emits
 * (`Tabs.Tab`/`Tabs.Indicator`/`Badge.Anchor`/`Badge`/`Skeleton`) are sub-parts of a real
 * HeroUI compound — each declares `tier: "heroui"` in `ANNOTATE` with its name matching the
 * import identifier exactly (no `storyId`). The `Icon` span wrapping the caller-supplied
 * Phosphor glyph is not tagged — it isn't a real component.
 * 
 * The `Skeleton` leaf carries the prop's name (`isSkeleton`) and renders every step with a
 * known visible shape; `variant` ("primary"/"secondary") is that axis, known ahead of time
 * at call. `secondary` produces a label+underline shimmer instead of a solid pill.
 */

const meta: Meta<typeof Tabs> = {
    title: "Atoms/Navigation/Tabs/Tabs",
    component: Tabs,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Tabs>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Tabs.Tab": { tier: "heroui", role: "one tab — selectable, or disabled per item.isDisabled" },
    "Tabs.Indicator": { tier: "heroui", role: "the moving highlight/underline marking the selected tab" },
    "Badge.Anchor": { tier: "heroui", role: "anchors the count badge to the corner of a tab's label" },
    "Badge": { tier: "heroui", role: "the floated unread/pending count" },
    "Skeleton": { tier: "heroui", role: "shimmer bar standing in for a tab's label or underline" },
}

const BASE_ITEMS = [
    { key: "overview", label: "Overview" },
    { key: "lessons", label: "Lessons" },
    { key: "reviews", label: "Reviews" },
]

/**
 * Default — plain-text tabs. ONE leaf renders ALL VARIANTS + STATES (§14d.2):
 * `primary` (segmented pill) · `secondary` (in-page underline) · a strip with
 * one `isDisabled` item. All three share the SAME DOM TREE (Tab × n +
 * Indicator) — only the skin/per-item flag differs — so they are NOT split
 * into separate leaves.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Tabs"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Default"
                reason="The one tab-strip atom wrapping HeroUI Tabs. Its variants (icon, badge, disabled) come from per-item props rather than separate components, so the leaf is the composition itself."
                states={[
                    {
                        name: "variant = \"primary\" (default)",
                        why: "The three tabs render as a segmented pill strip with the selected tab's background filled in. This is the look for a page-level switch that stands on its own, not nested inside another surface.",
                        code: `<Tabs ariaLabel="Course" selectedKey="overview" onSelectionChange={fn}
  items={[{ key: "overview", label: "Overview" }, ...]} />`,
                        render: (
                            <Tabs ariaLabel="Course" selectedKey="overview" onSelectionChange={() => {}} items={BASE_ITEMS} />
                        ),
                    },
                    {
                        name: "variant = \"secondary\"",
                        why: "The same three tabs render as plain labels with a thin underline tracking the selected one instead of a filled pill. This is the look for a switch living in-page, inside a surface that already carries its own background.",
                        code: `<Tabs variant="secondary" ariaLabel="Course" selectedKey="overview" onSelectionChange={fn}
  items={[{ key: "overview", label: "Overview" }, ...]} />`,
                        render: (
                            <Tabs
                                variant="secondary"
                                ariaLabel="Course (secondary)"
                                selectedKey="overview"
                                onSelectionChange={() => {}}
                                items={BASE_ITEMS}
                               
                            />
                        ),
                    },
                    {
                        name: "items[2].isDisabled = true",
                        why: "The third tab still renders in place but dims and stops responding to focus or click, while the other two tabs behave normally. The strip stays the same Tab-times-N tree, one item just carries a disabled flag.",
                        code: "items={[…, { key: \"premium\", label: \"Premium\", isDisabled: true }]}",
                        render: (
                            <Tabs
                                ariaLabel="Content"
                                selectedKey="free"
                                onSelectionChange={() => {}}
                                items={[
                                    { key: "free", label: "Free" },
                                    { key: "pro", label: "Pro" },
                                    { key: "premium", label: "Premium", isDisabled: true },
                                ]}
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** WithIcon — each tab's `icon` is passed as a COMPONENT reference (phosphor `*Icon`, not JSX); the atom forces size-4. */
export const WithIcon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Tabs"
                tier="atom"
                annotate={ANNOTATE}
                leaf="WithIcon"
                states={[
                    {
                        name: "items[].icon set",
                        why: "Each tab gains a leading glyph rendered at size-4 to match the label's height, ahead of the same text every plain tab already shows. The story passes the icon as a component reference, not JSX, and the atom picks its own stroke weight without being told.",
                        code: "items={[{ key: \"home\", label: \"Home\", icon: HouseIcon }, ...]}",
                        render: (
                            <Tabs
                                ariaLabel="Dashboard"
                                selectedKey="home"
                                onSelectionChange={() => {}}
                                items={[
                                    { key: "home", label: "Home", icon: HouseIcon },
                                    { key: "stats", label: "Stats", icon: ChartBarIcon },
                                    { key: "history", label: "History", icon: ClockIcon },
                                ]}
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** WithBadge — `badge` floats an unread count over the label (HeroUI Badge). */
export const WithBadge: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Tabs"
                tier="atom"
                annotate={ANNOTATE}
                leaf="WithBadge"
                states={[
                    {
                        name: "items[].badge set",
                        why: "A small count or notice floats over the corner of a tab's label wherever `badge` is set, and the tab with no `badge` prop shows none. It marks unread or pending items without needing a separate row of chips elsewhere on the page.",
                        code: "items={[{ key: \"inbox\", label: \"Inbox\", badge: 3 }, ...]}",
                        render: (
                            <Tabs
                                ariaLabel="Notifications"
                                selectedKey="inbox"
                                onSelectionChange={() => {}}
                                items={[
                                    { key: "inbox", label: "Inbox", badge: 3 },
                                    { key: "mentions", label: "Mentions", badge: "9+" },
                                    { key: "archived", label: "Archived" },
                                ]}
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Skeleton — the atom draws its own skeleton leaf; it does not use `Skeleton.*`.
 * Renders BOTH SHAPES in full (§12g): `primary` (solid pill) · `secondary`
 * (label + thin underline) — matching exactly the shape each variant will
 * produce once data lands, instead of one shared pill for both.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Tabs"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="isSkeleton's shape follows variant instead of always drawing the same shimmer pill, the same pixel commitment `size` makes on Button's own skeleton."
                states={[
                    {
                        name: "isSkeleton = true, variant = \"primary\"",
                        why: "A filled pill shimmer stands where the segmented selected tab would sit, matching the primary variant's own resting shape. Nothing about the eventual tab labels shifts the strip's width once real data lands.",
                        code: "<Tabs isSkeleton ariaLabel=\"…\" selectedKey=\"\" onSelectionChange={fn} items={[…]} />",
                        render: (
                            <Tabs isSkeleton ariaLabel="Course" selectedKey="overview" onSelectionChange={() => {}} items={BASE_ITEMS} />
                        ),
                    },
                    {
                        name: "isSkeleton = true, variant = \"secondary\"",
                        why: "A label-bar-plus-underline shimmer stands where the underline tab strip would sit, instead of reusing the primary variant's filled pill. Each variant now rests in the exact shape it will land in once the real tabs render.",
                        code: "<Tabs isSkeleton variant=\"secondary\" ariaLabel=\"…\" selectedKey=\"\" onSelectionChange={fn} items={[…]} />",
                        render: (
                            <Tabs
                                isSkeleton
                                variant="secondary"
                                ariaLabel="Course (secondary)"
                                selectedKey="overview"
                                onSelectionChange={() => {}}
                                items={BASE_ITEMS}
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

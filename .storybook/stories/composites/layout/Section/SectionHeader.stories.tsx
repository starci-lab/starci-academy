import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRightIcon, GearIcon } from "@phosphor-icons/react"
import { SectionHeader } from "@sb-components/composites/layout/Section/Section"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * `SectionHeader` — the title frame of ONE region in a page: `eyebrow` ·
 * `title` · `description` stack in the left column, `action` pins right. NO
 * children (everything is a named slot), NO chrome (no background/border/
 * radius/padding) — it sits directly on the page background.
 *
 * ⚠️ STATE SCOPE (§12f/§13): this file only renders states this component
 * ITSELF produces — toggling each slot + `level` (the type scale). The
 * vertical rhythm header ↔ body ↔ footer belongs to `Section` (`gap`), so it
 * is NOT repeated here. Tier distinction: `PageHeader` = chrome for the whole
 * ROUTE (breadcrumb + H3 + meta, one per page) · `SectionCard` (design) = a
 * card WITH chrome · `SectionHeader` = a region's title, many per page,
 * scaling with `level`.
 */
const meta: Meta<typeof SectionHeader> = {
    title: "Composites/Layout/Section/SectionHeader",
    component: SectionHeader,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof SectionHeader>
/**
 * ANATOMY IS PER-LEAF: each story declares only the parts IT ITSELF renders.
 * `Eyebrow`/`Description`/`Action` only exist on the leaf that actually
 * passes that slot.
 */
const TITLE_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "atom", role: "the region's title, rendered at the size the level sets, always bold weight", storyId: "atoms-text-typography-typography--overview" },
]
const EYEBROW_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "atom", role: "a muted kicker sitting above the title, context rather than a second title", storyId: "atoms-text-typography-typography--overview" },
    { name: "Typography", tier: "atom", role: "the region's title", storyId: "atoms-text-typography-typography--overview" },
]
const DESCRIPTION_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "atom", role: "the region's title", storyId: "atoms-text-typography-typography--overview" },
    { name: "Typography", tier: "atom", role: "a supporting line under the title, muted and one size smaller", storyId: "atoms-text-typography-typography--overview" },
]
// `Action` is an arbitrary caller-supplied slot (docs: "pass a Button.* atom node") — the frame
// never fixes which one and never claims it as its own anatomy (§11a caller-slot rule), so it
// carries no badge even though this demo happens to fill it with a Button.
const ACTION_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "atom", role: "the region's title", storyId: "atoms-text-typography-typography--overview" },
]
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "atom", role: "a muted kicker above the title", storyId: "atoms-text-typography-typography--overview" },
    { name: "Typography", tier: "atom", role: "the region's title", storyId: "atoms-text-typography-typography--overview" },
    { name: "Typography", tier: "atom", role: "a muted supporting line", storyId: "atoms-text-typography-typography--overview" },
]
/** Minimal — only `title`. Still a flex row frame, just with one text column. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="SectionHeader"
                    tier="composite"
                    leaf="Default"
                    parts={TITLE_PARTS}
                    reason="The heading of ONE region inside a page. It carries no function of its own: it doesn't know what sits below it, it only lays out an eyebrow, a title and a description on the left and one action slot on the right."
                    states={[
                        {
                            name: "only title passed",
                            why: "Just the title text renders, no eyebrow above it and no description or action beside it. This is the bare frame, the shape every other leaf below adds one slot on top of.",
                            code: "<SectionHeader title=\"My courses\" />",
                            render: <SectionHeader title="My courses" />,
                        },
                    ]}
                />
            </div>
        </div>
    ),
}
/** `eyebrow` — a muted context line above the title (course/module name), in the same `gap-1` text cluster. */
export const WithEyebrow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="SectionHeader"
                    tier="composite"
                    leaf="WithEyebrow"
                    parts={EYEBROW_PARTS}
                    states={[
                        {
                            name: "eyebrow set",
                            why: "A muted kicker line grows above the title, one size smaller and in the same tight text cluster. The eyebrow names the course or module the region belongs to, so it stays context rather than climbing into a second title (§9a).",
                            code: "<SectionHeader eyebrow=\"Fullstack Mastery\" title=\"Module 3 · Databases\" />",
                            render: <SectionHeader eyebrow="Fullstack Mastery" title="Module 3 · Databases" />,
                        },
                    ]}
                />
            </div>
        </div>
    ),
}
/** `description` — one supporting muted line under the title. */
export const WithDescription: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="SectionHeader"
                    tier="composite"
                    leaf="WithDescription"
                    parts={DESCRIPTION_PARTS}
                    states={[
                        {
                            name: "description set",
                            why: "A muted line grows below the title, tied to it with the same tight `gap-1` used inside a single text cluster rather than the looser rhythm between regions. Title and description read as one unit, not two separate stacked blocks.",
                            code: `<SectionHeader
  title="My courses"
  description="The courses you're enrolled in, sorted by most recently studied."
/>`,
                            render: (
                                <SectionHeader
                                    title="My courses"
                                    description="The courses you're enrolled in, sorted by most recently studied."
                                   
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}
/** `action` — the right slot takes a `Button.*` node (the frame does NOT decide what the action is). */
export const WithAction: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="SectionHeader"
                    tier="composite"
                    leaf="WithAction"
                    parts={ACTION_PARTS}
                    states={[
                        {
                            name: "action set",
                            why: "A control slot grows on the right, pinned `shrink-0` so it never squeezes the text column. The header only reserves the slot and pins it there; the caller decides what the button actually does (§13).",
                            code: `<SectionHeader
  title="My courses"
  action={<Button label="View all" variant="ghost" size="sm" prefixIcon={ArrowRightIcon} />}
/>`,
                            render: (
                                <SectionHeader
                                    title="My courses"
                                    action={() => <Button label="View all" variant="ghost" size="sm" prefixIcon={ArrowRightIcon} onPress={() => {}} />}
                                   
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}
/** All 4 slots at once — a 3-line text column on the left, action anchored to the TOP (`items-start`). */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="SectionHeader"
                    tier="composite"
                    leaf="Full"
                    parts={FULL_PARTS}
                    states={[
                        {
                            name: "eyebrow, title, description, and action all set",
                            why: "All four slots render at once: eyebrow above the title, description below it, and the action pinned to the right, anchored to the TOP of the row (`items-start`). With a three-line text column on the left, the action must anchor at the top or it would drift down to the middle.",
                            code: `<SectionHeader
  eyebrow="Fullstack Mastery"
  title="Submitted assignments"
  description="AI grades within minutes; you can resubmit up to 3 times."
  action={<Button label="Settings" variant="secondary" size="sm" prefixIcon={GearIcon} />}
/>`,
                            render: (
                                <SectionHeader
                                    eyebrow="Fullstack Mastery"
                                    title="Submitted assignments"
                                    description="AI grades within minutes; you can resubmit up to 3 times."
                                    action={() => <Button label="Settings" variant="secondary" size="sm" prefixIcon={GearIcon} onPress={() => {}} />}
                                   
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}
/**
 * `level` — ONE dial that turns the type scale of the WHOLE header (title +
 * description + eyebrow move together), so a header never mixes scales by hand.
 */
export const Levels: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="SectionHeader"
                    tier="composite"
                    leaf="Levels"
                    parts={DESCRIPTION_PARTS}
                    reason="Level picks the Typography size for every line at once, so title, description and eyebrow move together and a header never mixes scales by hand at a single call site."
                    states={[
                        {
                            name: "level = 1",
                            why: "Title renders at `lg` bold and description at `sm`, the largest band a page uses. The tree stays the same as every other level; only the type scale steps up.",
                            code: "<SectionHeader level={1} title=\"…\" description=\"…\" />",
                            render: <SectionHeader level={1} title="Learning roadmap" description="level 1 — the biggest band of the page." />,
                        },
                        {
                            name: "level = 2 (default)",
                            why: "Title renders at `base` bold and description at `sm`, the scale used for a normal section on the page. This is the level a header takes when the caller passes none.",
                            code: "<SectionHeader level={2} title=\"…\" description=\"…\" />",
                            render: <SectionHeader level={2} title="Current module" description="level 2 — a normal region (default)." />,
                        },
                        {
                            name: "level = 3",
                            why: "Title renders at `sm` medium and description drops to `xs`, the scale for a sub-section nested under another header. Weight drops from bold to medium too, so a level-3 header never competes with the header above it.",
                            code: "<SectionHeader level={3} title=\"…\" description=\"…\" />",
                            render: <SectionHeader level={3} title="Lesson in module" description="level 3 — a sub-region nested under another header." />,
                        },
                    ]}
                />
            </div>
        </div>
    ),
}
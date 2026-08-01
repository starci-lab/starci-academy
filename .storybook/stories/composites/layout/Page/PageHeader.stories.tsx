import type { Meta, StoryObj } from "@storybook/nextjs"
import { Breadcrumbs, Button, Chip, Typography } from "@heroui/react"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { BlockAnatomy, type AnatomyAnnotation, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PageHeader` — the breadcrumb/title/description/actions/meta frame of a route.
 * NOT a generic wrapper: it takes no `children`, only its own semantic slots.
 *
 * COMPOSITE-8: `breadcrumb`/`actions`/`meta` take a COMPONENT reference, not a
 * built node — the frame calls it itself so it can forward `isSkeleton`.
 */
const meta: Meta<typeof PageHeader> = {
    title: "Composites/Layout/Page/PageHeader",
    component: PageHeader,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PageHeader>

// Bare set: no breadcrumb, no meta, no actions.
const TITLE_DESCRIPTION_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "atom", role: "primary title, an H3 heading, or body-bold text when size=\"compact\"", storyId: "atoms-text-typography-typography--plain" },
    { name: "Typography", tier: "atom", role: "supporting line under the title, muted, clamps to 2 lines on mobile", storyId: "atoms-text-typography-typography--plain" },
]

// Full set leaf: breadcrumb row + actions slot + a meta chip/stat strip below. Breadcrumb/Actions/Meta
// are arbitrary caller-supplied COMPONENT REFERENCES (COMPOSITE-8) — this leaf's own demo happens to
// fill them with a HeroUI Breadcrumbs/Button/Chip, but the frame itself never fixes what renders
// there. PageHeader never claims them as its own anatomy (§11a caller-slot rule), so only the two
// Typography.Base nodes it actually BUILDS itself carry a badge.
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "atom", role: "primary title, an H3 heading", storyId: "atoms-text-typography-typography--plain" },
    { name: "Typography", tier: "atom", role: "supporting line under the title, muted", storyId: "atoms-text-typography-typography--plain" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header itself: while `isSkeleton` it renders a title bar, a description bar, and two pill meta-chip bars in place of real content", storyId: "composites-layout-page-pageheader--skeleton" },
}

/** `Full` story fixtures — component references passed into `breadcrumb`/`actions`/`meta` (COMPOSITE-8). */
// TODO: swap for ResponsiveBreadcrumb local when ported.
const FullBreadcrumb = () => (
    <Breadcrumbs data-tier="fixture">
        <Breadcrumbs.Item href="#">Courses</Breadcrumbs.Item>
        <Breadcrumbs.Item>Fullstack Mastery</Breadcrumbs.Item>
    </Breadcrumbs>
)
const FullActions = () => (
    <Button data-tier="fixture" variant="secondary" size="sm" onPress={() => {}}>Edit course</Button>
)
const FullMeta = () => (
    <div data-tier="fixture" className="flex flex-wrap items-center gap-2">
        {/* status chip leading (far left); stat strip = dot-separated TEXT */}
        <Chip size="sm" variant="soft" color="success"><Chip.Label>Open</Chip.Label></Chip>
        <Typography type="body-xs" color="muted">24 Modules · 87 Lessons · 32 hours</Typography>
    </div>
)

/** Minimal set: a title + one description line — a page entered straight from a menu, no breadcrumb. */
export const Minimal: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-3xl">
                <BlockAnatomy
                    name="PageHeader"
                    tier="composite"
                    leaf="Minimal"
                    parts={TITLE_DESCRIPTION_PARTS}
                    states={[
                        {
                            name: "only title and description passed",
                            why: "Only the Title and Description nodes render; Breadcrumb/Actions/Meta are all absent because no prop for them was passed. This is for a page a learner reaches straight from a menu, where a breadcrumb trail would have nothing meaningful to show.",
                            code: "<PageHeader title=\"Manage students\" description=\"View and edit every enrolled student.\" />",
                            render: (
                                <PageHeader
                                    title="Manage students"
                                    description="View and edit every enrolled student."
                                    showAnatomy
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Full set: breadcrumb + title + description + actions + meta strip — a page deep in the hierarchy. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-3xl">
                <BlockAnatomy
                    name="PageHeader"
                    tier="composite"
                    leaf="Full"
                    parts={FULL_PARTS}
                    reason="This frame gathers breadcrumb, title, description, actions, and meta into ONE place instead of every page laying out its own header by hand."
                    states={[
                        {
                            name: "all five slots passed",
                            why: "All five slots turn on at once: the breadcrumb row above the title, the actions control at the right, and the meta chip/stat strip below. This is for a page deep in the site hierarchy, where the breadcrumb tells the learner how they got there and the meta strip surfaces a quick summary.",
                            code: `<PageHeader
  breadcrumb={CourseBreadcrumb}
  title="Fullstack Mastery"
  description="A path from the fundamentals to shipping a real product, graded by AI."
  actions={EditCourseAction}
  meta={CourseMeta}
/>`,
                            render: (
                                <PageHeader
                                    breadcrumb={FullBreadcrumb}
                                    title="Fullstack Mastery"
                                    description="A path from the fundamentals to shipping a real product, graded by AI."
                                    actions={FullActions}
                                    meta={FullMeta}
                                    showAnatomy
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Long description clamps to 2 lines — the narrow frame below is intentional, to expose the clamp point. */
export const DescriptionClamped: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-sm">
                <BlockAnatomy
                    name="PageHeader"
                    tier="composite"
                    leaf="DescriptionClamped"
                    parts={TITLE_DESCRIPTION_PARTS}
                    states={[
                        {
                            name: "description longer than the frame width",
                            why: "The composition stays identical to Minimal, but the description text now runs past two lines inside this narrow frame, so `line-clamp-2` cuts it off. This proves the description never pushes the header taller no matter how long the copy runs.",
                            code: "<PageHeader title=\"Configure payment gateways\" description=\"Set up SePay and PayOS, choose the default gateway…\" />",
                            render: (
                                <PageHeader
                                    title="Configure payment gateways"
                                    description="Set up SePay and PayOS, choose the default gateway for new students, configure installment plans applied per course, and track transaction status in real time."
                                    showAnatomy
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}

/** `size="page"` (default) — the title renders at H3, for the OWN title of a whole route. */
export const SizePage: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PageHeader"
                tier="composite"
                leaf="SizePage"
                parts={TITLE_DESCRIPTION_PARTS}
                states={[
                    {
                        name: "size = \"page\" (default)",
                        why: "Title renders through `Typography.Heading` at level 3. This is for a header that owns an entire route on its own, where the title should read as the page's real heading.",
                        code: "<PageHeader title=\"Set up your machine\" description=\"Before entering the playground, install the CLI and connect the StarCi Agent.\" />",
                        render: (
                            <PageHeader
                                title="Set up your machine"
                                description="Before entering the playground, install the CLI and connect the StarCi Agent."
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `size="compact"` — body-scale bold, for a header labelling a PANE/PHASE inside an existing page shell. */
export const SizeCompact: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PageHeader"
                tier="composite"
                leaf="SizeCompact"
                parts={TITLE_DESCRIPTION_PARTS}
                states={[
                    {
                        name: "size = \"compact\"",
                        why: "The same two nodes, Title and Description, still render, but Title switches from an H3 heading to body-bold text. This is for a header labelling a pane or a phase inside a page that already has its own H3 elsewhere, so this title doesn't compete with it.",
                        code: "<PageHeader size=\"compact\" title=\"Set up your machine\" description=\"Before entering the playground, install the CLI and connect the StarCi Agent.\" />",
                        render: (
                            <PageHeader
                                size="compact"
                                title="Set up your machine"
                                description="Before entering the playground, install the CLI and connect the StarCi Agent."
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the real shape (breadcrumb/description/meta presence) isn't known before the route's data arrives, so the shimmer assumes the full header shape. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PageHeader"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isSkeleton = true, size = \"page\"",
                        why: "The real shape (breadcrumb/description/meta presence) isn't known before the route's data arrives, so the shimmer assumes the full header: a title bar, a description bar, and two pill meta-chip bars below.",
                        code: "<PageHeader isSkeleton />",
                        render: <PageHeader isSkeleton size="page" anatPart="PageHeader" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

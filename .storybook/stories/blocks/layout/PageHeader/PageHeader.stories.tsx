import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Label, Typography } from "@heroui/react"

import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"

const meta: Meta<typeof PageHeader> = {
    title: "Layout/PageHeader",
    component: PageHeader,
}

export default meta

type Story = StoryObj<typeof PageHeader>

/** Use for the title of A PAGE — it doesn't draw a card frame itself, so place it straight into the layout; if you need a surface, the caller wraps it. For the title of a BLOCK inside a page, don't use this block; use LabeledCard (label outside + Card inside): two stacked PageHeaders on one page is a sign that one of them is really a block, not a page. */
export const Default: Story = {
    parameters: { usage: "Use for the title of A PAGE — it doesn't draw a card frame itself, so place it straight into the layout; if you need a surface, the caller wraps it. For the title of a BLOCK inside a page, don't use this block; use `LabeledCard` (label outside + Card inside): two stacked `PageHeader`s on one page is a sign that one of them is really a block, not a page." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Minimal</Label>
                <Typography type="body-sm" color="muted">
                    the smallest still-usable set: a title and one line of description. Enough for an admin page the user reaches straight from the menu, with no hierarchy path to show.
                </Typography>
            </div>
            <div className="max-w-3xl">
                <PageHeader
                    title="Manage students"
                    description="View and edit every enrolled student."
                />
            </div>
        </div>
    ),
}

/** Use when a page sits DEEP in a hierarchy and the user needs to know where they are — that's when you show all the tiers: breadcrumb, title, meta. Breadcrumb = `ResponsiveBreadcrumb` (short trail on desktop; mobile / trail >=4 → "Back"). */
export const Full: Story = {
    parameters: { usage: "Use when a page sits DEEP in a hierarchy and the user needs to know where they are — that's when you show all of it: breadcrumb, title, meta. The `breadcrumb` slot uses `ResponsiveBreadcrumb`: desktop shows a short trail; mobile or a trail >=4 collapses to \"Back\". For a page reached straight from the menu, don't invent a breadcrumb; use the minimal set in the Default story." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Full depth</Label>
                <Typography type="body-sm" color="muted">
                    the layout of a detail page sitting deep in a hierarchy: it differs from the minimal set by having a ResponsiveBreadcrumb above and a meta strip below. The status chip sits at the far left; the rest of the meta strip is dot-separated text, not several chips side by side. Narrow the viewport (or a trail of 4+ crumbs) to see the Back button.
                </Typography>
            </div>
            <div className="max-w-3xl">
                <PageHeader
                    breadcrumb={
                        <ResponsiveBreadcrumb
                            items={[
                                { key: "courses", label: "Courses", onPress: () => {} },
                                { key: "current", label: "Fullstack Mastery" },
                            ]}
                        />
                    }
                    title="Fullstack Mastery"
                    description="A path from the fundamentals to shipping a real product, graded by AI."
                    meta={
                        <div className="flex flex-wrap items-center gap-2">
                            {/* status chip leading (far left); stat strip = dot-separated TEXT */}
                            <Chip size="sm" variant="soft" color="success"><Chip.Label>Open</Chip.Label></Chip>
                            <Typography type="body-xs" color="muted">24 Modules · 87 Lessons · 32 hours</Typography>
                        </div>
                    }
                />
            </div>
        </div>
    ),
}

/** Use to inspect the text-overflow branch: a long description meeting a narrow width is clamped to 2 lines, so the header doesn't swallow the page's first screen. */
export const LongDescriptionClamped: Story = {
    parameters: { usage: "Use to inspect the text-overflow branch: a long description meeting a narrow width is clamped to 2 lines, so the header doesn't swallow the page's first screen." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long description clamped</Label>
                <Typography type="body-sm" color="muted">
                    the state when the description is longer than the space it has: it stops at 2 lines and no more. The narrow frame below is intentional, to show the clamp point — the same text on a wide page would show in full.
                </Typography>
            </div>
            <div className="max-w-sm">
                <PageHeader
                    title="Configure payment gateways"
                    description="Set up SePay and PayOS, choose the default gateway for new students, configure installment plans applied per course, and track transaction status in real time."
                />
            </div>
        </div>
    ),
}

/** `size="compact"` beside the default, so the two scales can be compared: use compact when the header labels a PANE/PHASE inside a page that already has its own header, where an H3 out-shouts the surface it names. */
export const Compact: Story = {
    parameters: { usage: "`size=\"compact\"` renders the title at body scale (font-base bold) instead of H3. Use it when the header labels a PANE or PHASE inside a page shell that already carries its own header + nav — an H3 there reads as a second page title. Real use: the playground Setup pane (`PlaygroundPrepare`), which sits under the session back-link + Chuẩn bị/Lab tab strip." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label>size=&quot;page&quot; (default)</Label>
                <PageHeader
                    title="Chuẩn bị máy"
                    description="Trước khi vào playground, cài công cụ dòng lệnh rồi nối StarCi Agent."
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>size=&quot;compact&quot;</Label>
                <PageHeader
                    size="compact"
                    title="Chuẩn bị máy"
                    description="Trước khi vào playground, cài công cụ dòng lệnh rồi nối StarCi Agent."
                />
            </div>
        </div>
    ),
}

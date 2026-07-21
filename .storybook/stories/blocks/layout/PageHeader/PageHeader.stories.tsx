import type { Meta, StoryObj } from "@storybook/nextjs"
import { Breadcrumbs, Chip, Typography } from "@heroui/react"
import { PageHeader } from "./PageHeader"

const meta: Meta<typeof PageHeader> = {
    title: "Primitives/Layout/PageHeader",
    component: PageHeader,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PageHeader>

/** Minimal set: a title + one description line — a page entered straight from a menu, no breadcrumb. */
export const Minimal: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-3xl">
                <PageHeader
                    title="Manage students"
                    description="View and edit every enrolled student."
                />
            </div>
        </div>
    ),
}

/** Full set: breadcrumb + title + description + meta strip — a page deep in the hierarchy. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-3xl">
                <PageHeader
                    breadcrumb={
                        // TODO: swap for ResponsiveBreadcrumb local when ported.
                        <Breadcrumbs>
                            <Breadcrumbs.Item href="#">Courses</Breadcrumbs.Item>
                            <Breadcrumbs.Item>Fullstack Mastery</Breadcrumbs.Item>
                        </Breadcrumbs>
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

/** Long description clamps to 2 lines — the narrow frame below is intentional, to expose the clamp point. */
export const DescriptionClamped: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-sm">
                <PageHeader
                    title="Configure payment gateways"
                    description="Set up SePay and PayOS, choose the default gateway for new students, configure installment plans applied per course, and track transaction status in real time."
                />
            </div>
        </div>
    ),
}

/** `size="page"` (default) — the title renders at H3, for the OWN title of a whole route. */
export const SizePage: Story = {
    render: () => (
        <div className="p-8">
            <PageHeader
                title="Chuẩn bị máy"
                description="Trước khi vào playground, cài công cụ dòng lệnh rồi nối StarCi Agent."
            />
        </div>
    ),
}

/** `size="compact"` — body-scale bold, for a header labelling a PANE/PHASE inside an existing page shell. */
export const SizeCompact: Story = {
    render: () => (
        <div className="p-8">
            <PageHeader
                size="compact"
                title="Chuẩn bị máy"
                description="Trước khi vào playground, cài công cụ dòng lệnh rồi nối StarCi Agent."
            />
        </div>
    ),
}

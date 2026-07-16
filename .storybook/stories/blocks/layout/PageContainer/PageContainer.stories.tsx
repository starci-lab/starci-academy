import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { PageContainer } from "@/components/blocks/layout/PageContainer"

const meta: Meta<typeof PageContainer> = {
    title: "Layout/PageContainer",
    component: PageContainer,
}
export default meta
type Story = StoryObj<typeof PageContainer>

/** The outermost layer of a page — full width, flush to the left edge, keeping only the right gutter + py. Features inside don't set `p-*` themselves. */
export const Default: Story = {
    parameters: {
        usage: "The outermost layer of A page: full width, flush to the left edge (no `mx-auto`, no `pl-*`). Only the right gutter + `py-16`. Features inside don't (and must not) set `p-*` themselves. Don't wrap it in another container.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Left-flush page frame</Label>
                <Typography type="body-sm" color="muted">
                    Full width, not centered — only the right gutter + py. The bordered card below is just to show the content edge; the block doesn't draw a border itself.
                </Typography>
            </div>
            {/* `-ml-8 mr-0`: cancel the left-edge decorator, keep mr = 0 (not `-mx-8`). */}
            <div className="-ml-8 mr-0">
                <PageContainer>
                    <div className="rounded-2xl border border-default">
                        <Typography type="h3">My courses</Typography>
                        <Typography type="body-sm" color="muted" className="mt-2">
                            The list of courses you've enrolled in, along with your most recent learning progress.
                        </Typography>
                    </div>
                </PageContainer>
            </div>
        </div>
    ),
}

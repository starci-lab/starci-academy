import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { PageContainer } from "./PageContainer"

const meta: Meta<typeof PageContainer> = {
    title: "Primitives/Layout/PageContainer",
    component: PageContainer,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PageContainer>

/**
 * Left-flush page frame: the outermost layer of a route — full width, flush at
 * the left edge (no `mx-auto`, no `pl-*`), only a right gutter + `py-16`.
 * Features inside do not (and must not) set their own `p-*`.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <PageContainer>
                <div className="rounded-2xl border border-default p-4">
                    <Typography type="h3">My courses</Typography>
                    <Typography type="body-sm" color="muted" className="mt-2">
                        The list of courses you've enrolled in, along with your most recent learning progress.
                    </Typography>
                </div>
            </PageContainer>
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { SectionHeading } from "./SectionHeading"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof SectionHeading> = {
    title: "Block/Marketing/SectionHeading",
    component: SectionHeading,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SectionHeading>

const ANATOMY = {
    primitives: [
        { name: "Chip", role: "eyebrow soft accent phía trên tiêu đề" },
        { name: "Typography.Heading", role: "tiêu đề section (level 2/3, bold)" },
    ],
    reason:
        "Mọi section marketing lặp lại đúng nhịp: eyebrow màu → tiêu đề đậm → một dòng dẫn mờ. Gói vào một block để mọi section dùng cùng type-scale + spacing, feature chỉ truyền chữ; anchorId thêm '#' deep-link để mục lục/menu tham chiếu trực tiếp.",
}

export const CenteredDefault: Story = {
    render: () =>
        blockShell(
            <SectionHeading
                eyebrow="Real learning"
                title="A learning path designed for working professionals"
                intro="From fundamentals to hands-on projects, every course is tied to a tangible product you can hold."
            />,
            ANATOMY,
        ),
}

export const AlignStart: Story = {
    render: () =>
        blockShell(
            <SectionHeading
                align="start"
                title="Frequently asked questions"
                intro="The most common questions before you enroll in a course."
            />,
            ANATOMY,
        ),
}

export const WithAnchor: Story = {
    render: () =>
        blockShell(
            <SectionHeading
                title="Tuition and offers"
                intro="See the full details of tuition plans, installment options, and current offers."
                anchorId="hoc-phi"
            />,
            ANATOMY,
        ),
}

export const TitleOnly: Story = {
    render: () => blockShell(<SectionHeading title="Training partners" />, ANATOMY),
}

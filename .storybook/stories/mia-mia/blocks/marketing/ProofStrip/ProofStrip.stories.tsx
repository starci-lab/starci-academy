import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProofStrip } from "@sb-components/mia-mia/blocks/marketing/ProofStrip"

const meta: Meta<typeof ProofStrip> = {
    title: "MiaMia/ProofStrip",
    component: ProofStrip,
    args: {
        items: [
            { key: "exams", value: "39", label: "đề THPT thật" },
            { key: "games", value: "4", label: "game từ vựng" },
            { key: "tutor", value: "Mia", label: "trợ giảng AI" },
            { key: "live", value: "Live", label: "phòng thi ảo" },
        ],
    },
}

export default meta

type Story = StoryObj<typeof ProofStrip>

/** The pink proof band, directly under the hero. Use it to back the pitch with a few hard figures — four cells reads best (two-up on mobile). Not for long feature copy; each cell is a number and a two-word label. */
export const Default: Story = {
    parameters: { usage: "The pink proof band, directly under the hero. Use it to back the pitch with a few hard figures — four cells reads best (two-up on mobile). Not for long feature copy; each cell is a number and a two-word label." },
    render: (args) => <ProofStrip {...args} />,
}

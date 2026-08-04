import type { Meta, StoryObj } from "@storybook/nextjs"
import { CtaBanner } from "@sb-components/mia-mia/blocks/marketing/CtaBanner"

const meta: Meta<typeof CtaBanner> = {
    title: "MiaMia/CtaBanner",
    component: CtaBanner,
    args: {
        title: "Bắt đầu đề đầu tiên hôm nay",
        description: "Miễn phí, không cần thẻ. Mia đợi sẵn để kèm bạn từ câu đầu tiên.",
        ctaLabel: "Vào học miễn phí",
        ctaHref: "#",
    },
}

export default meta

type Story = StoryObj<typeof CtaBanner>

/** The closing call-to-action, near the foot of the page. Use it once, to repeat the primary action after the pitch. The dark fill is deliberate — it is the last, loudest beat, so it does not double as a mid-page section. */
export const Default: Story = {
    parameters: { usage: "The closing call-to-action, near the foot of the page. Use it once, to repeat the primary action after the pitch. The dark fill is deliberate — it is the last, loudest beat, so it does not double as a mid-page section." },
    render: (args) => <CtaBanner {...args} />,
}

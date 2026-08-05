import type { Meta, StoryObj } from "@storybook/nextjs"
import { SiteHeader } from "@sb-components/mia-mia/blocks/marketing/SiteHeader"

const meta: Meta<typeof SiteHeader> = {
    title: "MiaMia/SiteHeader",
    component: SiteHeader,
    args: {
        brand: "mia mia",
        links: [
            { label: "Learn", href: "#" },
            { label: "Practice exams", href: "#" },
            { label: "Play", href: "#" },
            { label: "Community", href: "#" },
        ],
        ctaLabel: "Start learning",
        ctaHref: "#",
    },
}

export default meta

type Story = StoryObj<typeof SiteHeader>

/** The marketing top bar. One per page, above the hero. The nav links collapse below `md`, leaving the wordmark and the single CTA — so the bar never needs a hamburger of its own. */
export const Default: Story = {
    parameters: { usage: "The marketing top bar. One per page, above the hero. The nav links collapse below `md`, leaving the wordmark and the single CTA — so the bar never needs a hamburger of its own." },
    render: (args) => <SiteHeader {...args} />,
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { SiteFooter } from "@sb-components/mia-mia/blocks/marketing/SiteFooter"

const meta: Meta<typeof SiteFooter> = {
    title: "MiaMia/SiteFooter",
    component: SiteFooter,
    args: {
        brand: "mia mia",
        tagline: "Học tiếng Anh, pass the exam — luyện thật, chơi thật, thi cùng nhau.",
        columns: [
            { key: "learn", heading: "Learn", items: [
                { label: "National exam practice", href: "#" },
                { label: "Vocabulary", href: "#" },
                { label: "Topics and grammar", href: "#" },
                { label: "Virtual exam room", href: "#" },
            ] },
            { key: "company", heading: "Mia Mia", items: [
                { label: "About us", href: "#" },
                { label: "Contact", href: "#" },
                { label: "Terms", href: "#" },
                { label: "Privacy", href: "#" },
            ] },
            { key: "follow", heading: "Follow", items: [
                { label: "Facebook", href: "#" },
                { label: "Instagram", href: "#" },
                { label: "TikTok", href: "#" },
                { label: "YouTube", href: "#" },
            ] },
        ],
        copyright: "© 2026 Mia Mia. Học tiếng Anh, pass the exam.",
        madeIn: "Made in Vietnam",
    },
}

export default meta

type Story = StoryObj<typeof SiteFooter>

/** The site footer, at the foot of every marketing page. One wordmark column beside the link columns, over a ruled bottom bar. Use it as the last block; it is navigation, not a call to action — the loud CTA is `CtaBanner` above it. */
export const Default: Story = {
    parameters: { usage: "The site footer, at the foot of every marketing page. One wordmark column beside the link columns, over a ruled bottom bar. Use it as the last block; it is navigation, not a call to action — the loud CTA is `CtaBanner` above it." },
    render: (args) => <SiteFooter {...args} />,
}

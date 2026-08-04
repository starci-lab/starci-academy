import type { Meta, StoryObj } from "@storybook/nextjs"
import { SiteFooter } from "@sb-components/mia-mia/blocks/marketing/SiteFooter"

const meta: Meta<typeof SiteFooter> = {
    title: "MiaMia/SiteFooter",
    component: SiteFooter,
    args: {
        brand: "mia mia",
        tagline: "Học tiếng Anh, đậu THPT — luyện thật, chơi thật, thi cùng nhau.",
        columns: [
            { key: "learn", heading: "Học", items: [
                { label: "Luyện đề THPT", href: "#" },
                { label: "Ôn từ vựng", href: "#" },
                { label: "Chuyên đề & ngữ pháp", href: "#" },
                { label: "Phòng thi ảo", href: "#" },
            ] },
            { key: "company", heading: "Mia Mia", items: [
                { label: "Về chúng tôi", href: "#" },
                { label: "Liên hệ", href: "#" },
                { label: "Điều khoản", href: "#" },
                { label: "Bảo mật", href: "#" },
            ] },
            { key: "follow", heading: "Theo dõi", items: [
                { label: "Facebook", href: "#" },
                { label: "Instagram", href: "#" },
                { label: "TikTok", href: "#" },
                { label: "YouTube", href: "#" },
            ] },
        ],
        copyright: "© 2026 Mia Mia. Học tiếng Anh, đậu THPT.",
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

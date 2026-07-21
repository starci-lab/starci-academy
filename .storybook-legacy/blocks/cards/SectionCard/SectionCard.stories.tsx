import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { LightningIcon } from "@phosphor-icons/react"

import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { body } from "./components"

const meta: Meta<typeof SectionCard> = {
    title: "Legacy/Blocks/Cards/SectionCard",
    component: SectionCard,
}

export default meta

type Story = StoryObj<typeof SectionCard>

/** The standard "bordered" frame: a header (icon + title on the left, action on the right) separated by a rule, then the body. Used across profile + dashboard for every titled section. */
export const Default: Story = {
    parameters: { usage: "Standard bordered frame: header (icon+title left, action right) + body. For every titled section in profile/dashboard." },
    render: () => (
        <div className="max-w-md">
            <SectionCard
                title="Review & practice"
                icon={<LightningIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                action={<Button variant="tertiary" size="sm">View all</Button>}
            >
                {body}
            </SectionCard>
        </div>
    ),
}

/** `accent` — border + a lightly tinted background in the accent color, for a card that is "the viewer's own" / highlighted. */
export const Accent: Story = {
    parameters: { usage: "accent: a lightly tinted accent border — for the viewer's own card / a highlighted one." },
    render: () => (
        <div className="max-w-md">
            <SectionCard
                accent
                title="Your profile"
                icon={<LightningIcon className="size-5 text-accent" aria-hidden focusable="false" />}
            >
                {body}
            </SectionCard>
        </div>
    ),
}

/** No header — drop title/icon/action → just the frame + body, for a section whose content speaks for itself. */
export const Plain: Story = {
    parameters: { usage: "No header: just the frame + body, for a section whose content is self-explanatory." },
    render: () => (
        <div className="max-w-md">
            <SectionCard>{body}</SectionCard>
        </div>
    ),
}

/** `withVerdict` — dải viền TRÁI dày, chồng lên viền sẵn có của card, đánh dấu card mang TÍN HIỆU TỪ DATA (band verdict · tier · zone). 2 cách truyền màu: `variant` (4 token semantic — an toàn tuyệt đối, Tailwind quét được literal) hoặc `color` (màu Tailwind thô + độ đậm, vd `"amber-500"` — build động `border-l-${color}`, cần safelist `@source inline(...)` trong `globals.css`, đã có sẵn cho cả bảng màu × shade). KHÔNG dùng dải này để trang trí hay phân biệt "vùng active" (đó là ca đã bị revert — `card.md` §3g). */
export const WithVerdict: Story = {
    tags: ["news"],
    parameters: { usage: "Chờ duyệt — withVerdict: dải viền TRÁI = tín hiệu từ DATA (band verdict/tier/zone). `variant` = 4 token semantic (accent/success/warning/danger). `color` = màu Tailwind thô (vd \"amber-500\") cho ramp không map vào token. Cấm dùng để trang trí/phân biệt vùng active (card.md §3g/§3i)." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <SectionCard withVerdict={{ enable: true, variant: "danger" }}>
                Trí nhớ đang tuột — bạn nạp thẻ mới nhanh hơn tốc độ ghi nhớ.
            </SectionCard>
            <SectionCard withVerdict={{ enable: true, variant: "warning" }}>
                Chưa ổn định — vài chủ đề đang rơi, cần ôn đều hơn.
            </SectionCard>
            <SectionCard withVerdict={{ enable: true, variant: "success" }}>
                Trí nhớ khỏe — giữ được phần lớn kiến thức đã học.
            </SectionCard>
            {/* màu Tailwind thô (không phải 1 trong 4 token semantic) — ramp riêng của caller (vd tier/zone không map vào accent/success/warning/danger) */}
            <SectionCard withVerdict={{ enable: true, color: "amber-500" }}>
                Màu thô theo thang riêng của caller (vd ramp độ khó của challenge).
            </SectionCard>
            {/* enable=false → không có dải, card thường */}
            <SectionCard withVerdict={{ enable: false, variant: "danger" }}>
                enable=false → về card thường, không dải viền.
            </SectionCard>
        </div>
    ),
}

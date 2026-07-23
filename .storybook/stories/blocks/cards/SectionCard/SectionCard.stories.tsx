import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { LightningIcon } from "@phosphor-icons/react"
import { SectionCard } from "./SectionCard"

const meta: Meta<typeof SectionCard> = {
    title: "Design/Cards/SectionCard",
    component: SectionCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SectionCard>

const body = (
    <Typography type="body-sm" color="muted">
        Nội dung của section nằm trong khung viền, dưới header.
    </Typography>
)

/** The standard "bordered" frame: header (icon + title left, action right) separated by a rule, then the body. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <SectionCard
                    title="Review & practice"
                    icon={<LightningIcon aria-hidden focusable="false" />}
                    action={<Button variant="tertiary" size="sm">View all</Button>}
                >
                    {body}
                </SectionCard>
            </div>
        </div>
    ),
}

/** `accent` — a lightly tinted accent border, for a card that is "the viewer's own" / highlighted. */
export const Accent: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <SectionCard
                    accent
                    title="Your profile"
                    icon={<LightningIcon aria-hidden focusable="false" />}
                >
                    {body}
                </SectionCard>
            </div>
        </div>
    ),
}

/** `icon` + `title`, KHÔNG `action` — tổ hợp header phổ biến nhất ngoài thực tế (WhoToFollow, UpcomingLivestreamCard, StreakFreezeCard đều dùng đúng tổ hợp này). */
export const IconTitleNoAction: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <SectionCard
                    title="Ai đó nên follow"
                    icon={<LightningIcon aria-hidden focusable="false" />}
                >
                    {body}
                </SectionCard>
            </div>
        </div>
    ),
}

/** No header — drop title/icon/action → just the frame + body, for a section whose content speaks for itself. */
export const Plain: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <SectionCard>{body}</SectionCard>
            </div>
        </div>
    ),
}

/** STATE loading — `isSkeleton` tự vẽ skeleton mirror (icon/title/action bars + body paragraph), KHÔNG skeleton rời. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <SectionCard
                    isSkeleton
                    title="Review & practice"
                    icon={<LightningIcon aria-hidden focusable="false" />}
                    action={<Button variant="tertiary" size="sm">View all</Button>}
                >
                    {body}
                </SectionCard>
            </div>
        </div>
    ),
}

/**
 * `withVerdict` — a LEFT band on top of the card border, marking the card as carrying a
 * SIGNAL FROM DATA (band / tier / zone). `variant` = one of 4 semantic tokens; `color` =
 * a raw Tailwind palette ramp; `enable: false` → a plain card. Never decorative (`card.md` §3g/§3i).
 */
export const WithVerdict: Story = {
    render: () => (
        <div className="p-8">
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
                <SectionCard withVerdict={{ enable: true, color: "amber-500" }}>
                    Màu thô theo thang riêng của caller (vd ramp độ khó của challenge).
                </SectionCard>
                <SectionCard withVerdict={{ enable: false, variant: "danger" }}>
                    enable=false → về card thường, không dải viền.
                </SectionCard>
            </div>
        </div>
    ),
}

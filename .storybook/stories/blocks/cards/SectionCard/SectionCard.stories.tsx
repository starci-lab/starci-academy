import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { LightningIcon } from "@phosphor-icons/react"
import { SectionCard } from "@sb-components/blocks/cards/SectionCard/SectionCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

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

// FULL — header row (Icon + Title left, Action right) separated by a rule, then Body.
// Shared by Default and Loading (same composition; Loading swaps each node for its skeleton mirror).
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "icon đầu header (muted/accent theo `accent`) — hiện khi có prop `icon`" },
    { name: "Title", tier: "primitive", role: "tiêu đề header (text-base semibold) — hiện prop `title`" },
    { name: "Action", tier: "primitive", role: "action ghim phải header (vd nút 'View all') — hiện khi có prop `action`" },
    { name: "Body", tier: "design", role: "nội dung section dưới header — children" },
]

// HEADER_NO_ACTION — Icon + Title, no Action (WhoToFollow/UpcomingLivestreamCard/StreakFreezeCard combo).
const HEADER_NO_ACTION_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "icon đầu header" },
    { name: "Title", tier: "primitive", role: "tiêu đề header" },
    { name: "Body", tier: "design", role: "nội dung section dưới header — children" },
]

// PLAIN — no header at all (title/icon/action all omitted) → only Body.
const BODY_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Body", tier: "design", role: "nội dung section — children (không header)" },
]

/** The standard "bordered" frame: header (icon + title left, action right) separated by a rule, then the body. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SectionCard"
                    tier="design"
                    leaf="Default"
                    parts={FULL_PARTS}
                    reason="Card viền chuẩn: header (icon + title trái, action phải) ngăn cách bằng rule, rồi tới body — dùng lặp lại khắp profile/dashboard."
                >
                    <SectionCard
                        title="Review & practice"
                        icon={<LightningIcon aria-hidden focusable="false" />}
                        action={<Button variant="tertiary" size="sm">View all</Button>}
                        showAnatomy
                    >
                        {body}
                    </SectionCard>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `accent` — a lightly tinted accent border, for a card that is "the viewer's own" / highlighted. */
export const Accent: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SectionCard"
                    tier="design"
                    leaf="Accent"
                    parts={HEADER_NO_ACTION_PARTS}
                    note="`accent` — viền tô nhạt accent + icon đổi màu accent; không có Action."
                >
                    <SectionCard
                        accent
                        title="Your profile"
                        icon={<LightningIcon aria-hidden focusable="false" />}
                        showAnatomy
                    >
                        {body}
                    </SectionCard>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `icon` + `title`, KHÔNG `action` — tổ hợp header phổ biến nhất ngoài thực tế (WhoToFollow, UpcomingLivestreamCard, StreakFreezeCard đều dùng đúng tổ hợp này). */
export const IconTitleNoAction: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SectionCard"
                    tier="design"
                    leaf="IconTitleNoAction"
                    parts={HEADER_NO_ACTION_PARTS}
                    note="Tổ hợp header phổ biến nhất: Icon + Title, không Action."
                >
                    <SectionCard
                        title="Ai đó nên follow"
                        icon={<LightningIcon aria-hidden focusable="false" />}
                        showAnatomy
                    >
                        {body}
                    </SectionCard>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** No header — drop title/icon/action → just the frame + body, for a section whose content speaks for itself. */
export const Plain: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SectionCard"
                    tier="design"
                    leaf="Plain"
                    parts={BODY_ONLY_PARTS}
                    note="Bỏ hết title/icon/action → không header, chỉ khung + Body."
                >
                    <SectionCard showAnatomy>{body}</SectionCard>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** STATE loading — `isSkeleton` tự vẽ skeleton mirror (icon/title/action bars + body paragraph), KHÔNG skeleton rời. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SectionCard"
                    tier="design"
                    leaf="Loading"
                    parts={FULL_PARTS}
                    note="`isSkeleton` — CÙNG composition leaf Default; mỗi node đổi sang skeleton mirror (Icon/Title/Action bar + Body paragraph)."
                >
                    <SectionCard
                        isSkeleton
                        title="Review & practice"
                        icon={<LightningIcon aria-hidden focusable="false" />}
                        action={<Button variant="tertiary" size="sm">View all</Button>}
                        showAnatomy
                    >
                        {body}
                    </SectionCard>
                </BlockAnatomy>
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
            <div className="max-w-md">
                <BlockAnatomy
                    name="SectionCard"
                    tier="design"
                    leaf="WithVerdict"
                    parts={BODY_ONLY_PARTS}
                    note="5 card không header (chỉ Body) — `withVerdict` chỉ đổi className viền trái (không phải node render riêng), nên anatomy chỉ badge Body ở mỗi card."
                    reason="`withVerdict` là dải viền TRÁI báo tín hiệu TỪ DATA (band/tier/zone) — không phải decoration, không phải node cấu trúc riêng của SectionCard."
                >
                    <div className="flex flex-col gap-3">
                        <SectionCard withVerdict={{ enable: true, variant: "danger" }} showAnatomy>
                            Trí nhớ đang tuột — bạn nạp thẻ mới nhanh hơn tốc độ ghi nhớ.
                        </SectionCard>
                        <SectionCard withVerdict={{ enable: true, variant: "warning" }} showAnatomy>
                            Chưa ổn định — vài chủ đề đang rơi, cần ôn đều hơn.
                        </SectionCard>
                        <SectionCard withVerdict={{ enable: true, variant: "success" }} showAnatomy>
                            Trí nhớ khỏe — giữ được phần lớn kiến thức đã học.
                        </SectionCard>
                        <SectionCard withVerdict={{ enable: true, color: "amber-500" }} showAnatomy>
                            Màu thô theo thang riêng của caller (vd ramp độ khó của challenge).
                        </SectionCard>
                        <SectionCard withVerdict={{ enable: false, variant: "danger" }} showAnatomy>
                            enable=false → về card thường, không dải viền.
                        </SectionCard>
                    </div>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

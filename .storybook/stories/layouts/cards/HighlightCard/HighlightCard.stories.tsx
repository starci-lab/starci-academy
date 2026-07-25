import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Card, CardContent } from "@heroui/react"
import { HighlightCard } from "@sb-components/layouts/cards/HighlightCard/HighlightCard"
import { Avatar as AtomAvatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

const meta: Meta<typeof HighlightCard> = {
    title: "Layouts/Cards/HighlightCard",
    component: HighlightCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof HighlightCard>

/** Mock-content chuẩn (C-fixture) = ProfileCard: Card + avatar + title + description. */
const ProfileCard = () => (
    <Card>
        <CardContent className="flex-row items-center gap-3">
            <Avatar className="size-10 shrink-0">
                <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">StarCi Academy</span>
                <span className="truncate text-xs text-muted">
                    Học fullstack, system design và DevOps theo lộ trình phỏng vấn.
                </span>
            </div>
        </CardContent>
    </Card>
)

/** Skeleton mirror của ProfileCard — cùng khung, swap từng node sang Skeleton.*. */
const ProfileCardSkeleton = () => (
    <Card>
        <CardContent className="flex-row items-center gap-3">
            <AtomAvatar.Base isSkeleton size="md" className="shrink-0" />
            <div className="flex min-w-0 grow flex-col">
                <Typography size="sm" isSkeleton className="w-1/3" />
                <Typography size="xs" isSkeleton className="w-2/3" />
            </div>
        </CardContent>
    </Card>
)

/**
 * Một cung accent quét quanh card được bọc (lớp trong = hiệu ứng, card nằm trước). Trang trí
 * "nổi bật" thuần — KHÔNG phải tín hiệu data như `withVerdict`. Dùng cho ĐÚNG một card nhấn
 * mạnh trên bề mặt. Content bên trong = ProfileCard (fixture chuẩn).
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <HighlightCard>
                    <ProfileCard />
                </HighlightCard>
            </div>
        </div>
    ),
}

/**
 * Nội dung bên trong đang tải — sweep bị MUTE (không nhấn mạnh sai vào skeleton),
 * `children` vẫn hiển thị đúng trạng thái loading của nó (mirror ProfileCard).
 */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <HighlightCard isSkeleton>
                    <ProfileCardSkeleton />
                </HighlightCard>
            </div>
        </div>
    ),
}

import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Card, CardContent } from "@heroui/react"
import { AsyncContent } from "./AsyncContent"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

const meta: Meta<typeof AsyncContent> = {
    title: "Primitives/Async/AsyncContent",
    component: AsyncContent,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AsyncContent>

/**
 * Fixture chuẩn cho MỌI ví dụ content: một Card thật gồm avatar + title +
 * description. Bất cứ thứ gì "liên quan tới content" trong story họ Async đều
 * render dạng card này.
 */
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

/**
 * Skeleton MIRROR của ProfileCard — giữ nguyên cây layout (Card + CardContent,
 * gap, cột text), chỉ swap từng node nội dung sang `Skeleton.<Piece>` cùng cỡ,
 * nên khi resolve card không giật chiều cao.
 */
const ProfileCardSkeleton = () => (
    <Card>
        <CardContent className="flex-row items-center gap-3">
            <Skeleton.Avatar size="md" className="shrink-0" />
            <div className="flex min-w-0 grow flex-col">
                <Skeleton.Typography type="body-sm" width="1/3" />
                <Skeleton.Typography type="body-xs" width="2/3" />
            </div>
        </CardContent>
    </Card>
)

/** State lúc LOAD lần đầu — `isLoading` bật, switch render skeleton mirror của card. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <AsyncContent isLoading skeleton={<ProfileCardSkeleton />}>
                <ProfileCard />
            </AsyncContent>
        </div>
    ),
}

/** Resolve xong, có dữ liệu — switch render children (card thật, cùng layout với mirror). */
export const Content: Story = {
    render: () => (
        <div className="p-8">
            <AsyncContent isLoading={false} skeleton={<ProfileCardSkeleton />}>
                <ProfileCard />
            </AsyncContent>
        </div>
    ),
}

/** Load xong nhưng rỗng — EmptyContent nhận PROPS (không phải node). */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <AsyncContent
                isLoading={false}
                isEmpty
                emptyContent={{
                    title: "Chưa có nội dung",
                    description: "Khi có bài học liên quan, chúng sẽ hiện ở đây.",
                }}
                skeleton={<ProfileCardSkeleton />}
            >
                <ProfileCard />
            </AsyncContent>
        </div>
    ),
}

/** Lỗi (ưu tiên cao nhất, thắng cả loading) — ErrorContent nhận PROPS + retry. */
export const Error: Story = {
    render: () => (
        <div className="p-8">
            <AsyncContent
                isLoading
                error={new globalThis.Error("network")}
                errorContent={{
                    title: "Không tải được nội dung",
                    description: "Kiểm tra kết nối rồi thử lại.",
                    onRetry: () => {},
                    retryLabel: "Thử lại",
                }}
                skeleton={<ProfileCardSkeleton />}
            >
                <ProfileCard />
            </AsyncContent>
        </div>
    ),
}

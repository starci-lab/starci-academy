import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Card, CardContent } from "@heroui/react"
import { AsyncContent } from "@sb-components/layouts/async/AsyncContent/AsyncContent"
import { Skeleton } from "@sb-components/atoms/display/Skeleton/Skeleton"
import { Avatar as AvatarAtom } from "@sb-components/atoms/display/Avatar/Avatar"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `AsyncContent.Base` là KHUNG CHUYỂN
 * TRẠNG THÁI — tài sản riêng của nó là VIỆC CHỌN NHÁNH (error → loading → empty →
 * content) chứ không phải hình hài của từng thông điệp. Nên ở đây mỗi story là MỘT
 * nhánh, và nhánh rỗng/lỗi chỉ lấy shape TỐI GIẢN để chứng minh switch chạy đúng;
 * đủ bộ biến thể của thông điệp nằm ở story `AsyncContent.Empty` / `AsyncContent.Error`,
 * KHÔNG lặp lại tại đây.
 */
const meta: Meta<typeof AsyncContent.Base> = {
    title: "Layouts/Async/AsyncContent/AsyncContent.Base",
    component: AsyncContent.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AsyncContent.Base>

/**
 * Fixture chuẩn (C-fixture) cho MỌI ví dụ content: một Card thật gồm avatar +
 * title + description.
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
            <AvatarAtom.Base isSkeleton size="md" className="shrink-0" />
            <div className="flex min-w-0 grow flex-col">
                <Skeleton.Typography type="body-sm" width="1/3" />
                <Skeleton.Typography type="body-xs" width="2/3" />
            </div>
        </CardContent>
    </Card>
)

const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/**
 * ANATOMY IS PER-LEAF: mỗi nhánh render một cây KHÁC HẲN, nên mỗi story mang bộ
 * parts của riêng nó. Khung không tự vẽ gì cả — nó chỉ CHỌN một trong bốn node.
 */
const CONTENT_PARTS: Array<AnatomyNode> = [
    { name: "Content", tier: "primitive", role: "nhánh content — node caller truyền vào (slot `content` / `children`)" },
]
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "primitive", role: "nhánh loading — cây skeleton mirror do caller truyền qua slot `skeleton`" },
]
const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "AsyncContent.Empty", tier: "primitive", role: "nhánh rỗng — khung dựng từ PROPS `emptyContent`, không phải node" },
]
const ERROR_PARTS: Array<AnatomyNode> = [
    { name: "AsyncContent.Error", tier: "primitive", role: "nhánh lỗi — khung dựng từ PROPS `errorContent`; ưu tiên cao nhất" },
]
const SILENT_PARTS: Array<AnatomyNode> = []

/** CONTENT — resolve xong, có dữ liệu: `children` là lối rút gọn của slot `content`. */
export const Content: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="Content"
                parts={CONTENT_PARTS}
                reason="Mọi vùng dữ liệu async cần đúng MỘT chỗ giữ hợp đồng render của SWR: error → loading → empty → content. Gom bốn nhánh vào một khung để không bề mặt nào tự viết lại chuỗi if/else, và để skeleton luôn mirror đúng layout thật thay vì một spinner chung chung."
                code={`<AsyncContent.Base isLoading={false} skeleton={<ProfileCardSkeleton />}>
  <ProfileCard />
</AsyncContent.Base>`}
            >
                <AsyncContent.Base isLoading={false} skeleton={<ProfileCardSkeleton />} showAnatomy>
                    <ProfileCard />
                </AsyncContent.Base>
            </BlockAnatomy>,
        ),
}

/** CONTENT (slot có tên) — `content` là đường CHÍNH của tầng khung; thắng `children`. */
export const ContentSlot: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="ContentSlot"
                parts={CONTENT_PARTS}
                note="Cùng nhánh content nhưng đi qua slot CÓ TÊN `content` thay vì `children` — §13b: khung BỌC lấy slot tên làm đường chính, `children` chỉ là lối rút gọn."
                code={`<AsyncContent.Base
  isLoading={false}
  skeleton={<ProfileCardSkeleton />}
  content={<ProfileCard />}
/>`}
            >
                <AsyncContent.Base
                    isLoading={false}
                    skeleton={<ProfileCardSkeleton />}
                    content={<ProfileCard />}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** LOADING — lần load đầu: khung đổi sang cây skeleton mirror, không sập chiều cao. */
export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="Loading"
                parts={LOADING_PARTS}
                note="`isLoading` → khung render đúng node `skeleton`; composition khác leaf content (mirror thay vì card thật)."
                code={`<AsyncContent.Base isLoading skeleton={<ProfileCardSkeleton />}>
  <ProfileCard />
</AsyncContent.Base>`}
            >
                <AsyncContent.Base isLoading skeleton={<ProfileCardSkeleton />} showAnatomy>
                    <ProfileCard />
                </AsyncContent.Base>
            </BlockAnatomy>,
        ),
}

/** EMPTY — load xong nhưng rỗng: `emptyContent` nhận PROPS (không phải node). */
export const Empty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="`isEmpty` → khung dựng `AsyncContent.Empty` TỪ PROPS. Shape tối giản (tiêu đề + mô tả) là đủ để thấy switch chạy — biến thể nút/icon nằm ở story AsyncContent.Empty."
                code={`<AsyncContent.Base
  isLoading={false}
  isEmpty
  emptyContent={{ title: "Chưa có nội dung", description: "Khi có bài học liên quan, chúng sẽ hiện ở đây." }}
  skeleton={<ProfileCardSkeleton />}
>
  <ProfileCard />
</AsyncContent.Base>`}
            >
                <AsyncContent.Base
                    isLoading={false}
                    isEmpty
                    emptyContent={{
                        title: "Chưa có nội dung",
                        description: "Khi có bài học liên quan, chúng sẽ hiện ở đây.",
                    }}
                    skeleton={<ProfileCardSkeleton />}
                    showAnatomy
                >
                    <ProfileCard />
                </AsyncContent.Base>
            </BlockAnatomy>,
        ),
}

/**
 * EMPTY IM LẶNG — `isEmpty` nhưng KHÔNG truyền `emptyContent`: khung render null,
 * section tự ẩn. Đây là một nhánh RIÊNG của switch, không phải biến thể thông điệp.
 */
export const EmptySilent: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="EmptySilent"
                parts={SILENT_PARTS}
                note="Rỗng mà bỏ trống `emptyContent` → KHÔNG node nào được render (cây parts trống). Dùng khi một section phải biến mất hẳn thay vì hiện lời nhắn."
                code={`<AsyncContent.Base isLoading={false} isEmpty skeleton={<ProfileCardSkeleton />}>
  <ProfileCard />
</AsyncContent.Base>`}
            >
                <AsyncContent.Base isLoading={false} isEmpty skeleton={<ProfileCardSkeleton />} showAnatomy>
                    <ProfileCard />
                </AsyncContent.Base>
            </BlockAnatomy>,
        ),
}

/** ERROR — ưu tiên CAO NHẤT, thắng cả loading; `errorContent` cũng nhận PROPS. */
export const Error: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="Error"
                parts={ERROR_PARTS}
                note="`error` truthy + có `errorContent` → khung bỏ qua cả `isLoading` (ở đây vẫn đang bật) để render nhánh lỗi. ⚠️ Thiếu `errorContent` thì nhánh lỗi KHÔNG kích hoạt — khung rơi tiếp xuống loading."
                code={`<AsyncContent.Base
  isLoading
  error={new Error("network")}
  errorContent={{ title: "Không tải được nội dung", onRetry: () => {}, retryLabel: "Thử lại" }}
  skeleton={<ProfileCardSkeleton />}
>
  <ProfileCard />
</AsyncContent.Base>`}
            >
                <AsyncContent.Base
                    isLoading
                    error={new globalThis.Error("network")}
                    errorContent={{
                        title: "Không tải được nội dung",
                        description: "Kiểm tra kết nối rồi thử lại.",
                        onRetry: () => {},
                        retryLabel: "Thử lại",
                    }}
                    skeleton={<ProfileCardSkeleton />}
                    showAnatomy
                >
                    <ProfileCard />
                </AsyncContent.Base>
            </BlockAnatomy>,
        ),
}

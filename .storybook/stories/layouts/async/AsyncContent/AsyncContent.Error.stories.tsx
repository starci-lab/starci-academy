import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { ArrowClockwiseIcon, WifiSlashIcon } from "@phosphor-icons/react"
import { AsyncContent } from "@sb-components/layouts/async/AsyncContent/AsyncContent"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `AsyncContent.Error` là KHUNG THÔNG ĐIỆP
 * LỖI — cùng bộ slot với `.Empty` nhưng `tone="danger"`. State ở đây sinh ra từ việc
 * BẬT/TẮT slot của chính nó (description · action · icon). Thứ tự ưu tiên nhánh
 * (lỗi thắng loading) là state của `AsyncContent.Base`, KHÔNG lặp lại tại đây.
 *
 * ANATOMY IS PER-LEAF: mỗi story là một leaf riêng, mang cây parts của chính nó.
 */
const meta: Meta<typeof AsyncContent.Error> = {
    title: "Layouts/Async/AsyncContent/AsyncContent.Error",
    component: AsyncContent.Error,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AsyncContent.Error>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// Lớp MỎNG trên primitive `Feedback.Empty` (tone danger). Icon cảnh báo/title/description
// là GIÁ TRỊ truyền vào prop nên KHÔNG tách node; chỉ `action` là node được compose vào.
const MESSAGE_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "primitive",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
    },
]
const RETRY_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "primitive",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
        children: [
            { name: "Button", tier: "primitive", role: "shorthand onRetry + retryLabel → nút thử lại trong slot action", state: "secondary" },
        ],
    },
]
const ACTION_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "primitive",
        role: "khung căn giữa cho trạng thái lỗi",
        state: "danger",
        children: [
            { name: "Action", tier: "primitive", role: "slot action tổng quát — node bất kỳ do caller truyền" },
        ],
    },
]

/** BASIC — chỉ tiêu đề: icon cảnh báo mặc định + title, không mô tả, không nút. */
export const Basic: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContent.Error"
                tier="primitive"
                leaf="Basic"
                parts={MESSAGE_PARTS}
                reason={"Trạng thái lỗi của một vùng dữ liệu async cần đúng anatomy của Feedback.Empty tone=\"danger\" (icon cảnh báo + tiêu đề + mô tả + hành động canh giữa). AsyncContent.Error chỉ thêm WarningIcon mặc định và gói onRetry/retryLabel vào slot action — một lớp mỏng trên Feedback.Empty, không tự vẽ lại."}
                code={`<AsyncContent.Error
  title="Đã có lỗi xảy ra"
/>`}
            >
                <AsyncContent.Error title="Đã có lỗi xảy ra" showAnatomy />
            </BlockAnatomy>,
        ),
}

/** WITH DESCRIPTION — bật slot `description`: thêm dòng muted nói nguyên nhân/việc cần làm. */
export const WithDescription: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContent.Error"
                tier="primitive"
                leaf="WithDescription"
                parts={MESSAGE_PARTS}
                note="Thêm dòng mô tả muted dưới tiêu đề — vẫn chưa có nút hành động."
                code={`<AsyncContent.Error
  title="Không tải được dữ liệu"
  description="Máy chủ tạm thời không phản hồi. Vui lòng thử lại sau."
/>`}
            >
                <AsyncContent.Error
                    title="Không tải được dữ liệu"
                    description="Máy chủ tạm thời không phản hồi. Vui lòng thử lại sau."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** WITH RETRY — shorthand `onRetry` + `retryLabel` tự gói thành Button vào slot action. */
export const WithRetry: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContent.Error"
                tier="primitive"
                leaf="WithRetry"
                parts={RETRY_PARTS}
                note="onRetry + retryLabel → khung TỰ dựng Button secondary size sm cho slot action. Thiếu một trong hai → không có nút (nhiều nguồn thật đang rơi vào ca này)."
                code={`<AsyncContent.Error
  title="Không tải được dữ liệu"
  description="Đã có lỗi xảy ra khi tải nội dung."
  onRetry={() => {}}
  retryLabel="Thử lại"
/>`}
            >
                <AsyncContent.Error
                    title="Không tải được dữ liệu"
                    description="Đã có lỗi xảy ra khi tải nội dung."
                    onRetry={() => {}}
                    retryLabel="Thử lại"
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** WITH ACTION — slot `action` tổng quát: node bất kỳ, THẮNG shorthand retry. */
export const WithAction: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContent.Error"
                tier="primitive"
                leaf="WithAction"
                parts={ACTION_PARTS}
                note="Khi lỗi cần một hành động không phải 'thử lại' đơn thuần (tải lại trang, liên hệ hỗ trợ…) thì truyền thẳng node qua `action` — nó thắng cặp onRetry/retryLabel."
                code={`<AsyncContent.Error
  title="Phiên làm việc đã hết hạn"
  description="Đăng nhập lại để tiếp tục."
  action={<Button size="sm" variant="secondary" icon={<ArrowClockwiseIcon />}>Tải lại trang</Button>}
/>`}
            >
                <AsyncContent.Error
                    title="Phiên làm việc đã hết hạn"
                    description="Đăng nhập lại để tiếp tục."
                    action={<Button size="sm" variant="secondary" icon={<ArrowClockwiseIcon />}>Tải lại trang</Button>}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** CUSTOM ICON — ghi đè slot `icon`; các slot còn lại giữ nguyên shape đầy đủ. */
export const CustomIcon: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContent.Error"
                tier="primitive"
                leaf="CustomIcon"
                parts={RETRY_PARTS}
                note="Cùng shape đầy đủ (mô tả + nút thử lại), chỉ thay icon mặc định bằng icon caller truyền vào — icon là giá trị prop nên cây parts không đổi."
                code={`<AsyncContent.Error
  icon={<WifiSlashIcon weight="duotone" />}
  title="Mất kết nối mạng"
  description="Kiểm tra kết nối rồi thử lại."
  onRetry={() => {}}
  retryLabel="Thử lại"
/>`}
            >
                <AsyncContent.Error
                    icon={WifiSlashIcon}
                    title="Mất kết nối mạng"
                    description="Kiểm tra kết nối rồi thử lại."
                    onRetry={() => {}}
                    retryLabel="Thử lại"
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

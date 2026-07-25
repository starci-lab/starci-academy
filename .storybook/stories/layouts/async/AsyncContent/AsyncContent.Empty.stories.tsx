import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react"
import { AsyncContent } from "@sb-components/layouts/async/AsyncContent/AsyncContent"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `AsyncContent.Empty` là KHUNG THÔNG ĐIỆP
 * RỖNG — tài sản riêng của nó là các SLOT thông điệp (icon · title · description ·
 * action). Nên mọi state ở đây sinh ra từ việc BẬT/TẮT slot của chính nó. Việc
 * "khi nào thì nhánh rỗng được chọn" là state của `AsyncContent.Base`, KHÔNG lặp lại
 * tại đây.
 *
 * ANATOMY IS PER-LEAF: mỗi story là một leaf riêng, mang cây parts của chính nó.
 */
const meta: Meta<typeof AsyncContent.Empty> = {
    title: "Layouts/Async/AsyncContent/AsyncContent.Empty",
    component: AsyncContent.Empty,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AsyncContent.Empty>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// Khung này là một lớp MỎNG trên primitive `Feedback.Empty`. Icon/title/description là
// GIÁ TRỊ truyền vào prop của Feedback.Empty nên KHÔNG tách thành node riêng — chỉ
// `action` mới là một node được COMPOSE vào, nên nó xuất hiện ở cây của leaf có nút.
const MESSAGE_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "primitive",
        role: "khung icon + tiêu đề + mô tả + action, canh giữa",
    },
]
const RETRY_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "primitive",
        role: "khung icon + tiêu đề + mô tả + action, canh giữa",
        children: [
            { name: "Button", tier: "primitive", role: "shorthand onRetry + retryLabel → nút đặt vào slot action", state: "secondary" },
        ],
    },
]
const ACTION_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "primitive",
        role: "khung icon + tiêu đề + mô tả + action, canh giữa",
        children: [
            { name: "Action", tier: "primitive", role: "slot action tổng quát — node bất kỳ do caller truyền" },
        ],
    },
]

/** BASIC — chỉ tiêu đề: shape gọn nhất (icon mặc định + title). */
export const Basic: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Empty"
                tier="primitive"
                leaf="Basic"
                parts={MESSAGE_PARTS}
                reason="Trạng thái rỗng của một vùng dữ liệu async cần đúng anatomy của Feedback.Empty (icon + tiêu đề + mô tả + action canh giữa). AsyncContent.Empty chỉ thêm TrayIcon mặc định và gói onRetry/retryLabel thành nút cho slot action — một lớp mỏng trên Feedback.Empty, không tự vẽ lại."
                code={`<AsyncContent.Empty
  title="Chưa có dữ liệu"
/>`}
            >
                <AsyncContent.Empty title="Chưa có dữ liệu" showAnatomy />
            </BlockAnatomy>,
        ),
}

/** WITH DESCRIPTION — bật slot `description`: thêm một dòng muted dưới tiêu đề. */
export const WithDescription: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Empty"
                tier="primitive"
                leaf="WithDescription"
                parts={MESSAGE_PARTS}
                note="Thêm dòng mô tả dưới tiêu đề — khác leaf 'Basic' (leaf đó không có dòng mô tả)."
                code={`<AsyncContent.Empty
  title="Danh sách trống"
  description="Bạn chưa lưu mục nào vào danh sách này."
/>`}
            >
                <AsyncContent.Empty
                    title="Danh sách trống"
                    description="Bạn chưa lưu mục nào vào danh sách này."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** WITH RETRY — shorthand `onRetry` + `retryLabel` tự gói thành Button vào slot action. */
export const WithRetry: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Empty"
                tier="primitive"
                leaf="WithRetry"
                parts={RETRY_PARTS}
                note="onRetry + retryLabel → khung TỰ dựng Button secondary size sm cho slot action (composition khác các leaf không nút). Thiếu một trong hai → không có nút."
                code={`<AsyncContent.Empty
  title="Không tìm thấy kết quả"
  description="Thử đổi bộ lọc hoặc tải lại để xem thêm."
  onRetry={() => {}}
  retryLabel="Tải lại"
/>`}
            >
                <AsyncContent.Empty
                    title="Không tìm thấy kết quả"
                    description="Thử đổi bộ lọc hoặc tải lại để xem thêm."
                    onRetry={() => {}}
                    retryLabel="Tải lại"
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** WITH ACTION — slot `action` tổng quát: node bất kỳ, THẮNG shorthand retry. */
export const WithAction: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Empty"
                tier="primitive"
                leaf="WithAction"
                parts={ACTION_PARTS}
                note="Khi việc cần làm không phải 'thử lại' (tạo mới, mở hướng dẫn…) thì truyền thẳng node qua `action` — nó thắng cặp onRetry/retryLabel."
                code={`<AsyncContent.Empty
  title="Chưa có bộ thẻ nào"
  description="Tạo bộ thẻ đầu tiên để bắt đầu ôn tập."
  action={<Button size="sm" icon={<PlusIcon />}>Tạo bộ thẻ</Button>}
/>`}
            >
                <AsyncContent.Empty
                    title="Chưa có bộ thẻ nào"
                    description="Tạo bộ thẻ đầu tiên để bắt đầu ôn tập."
                    action={<Button size="sm" icon={<PlusIcon />}>Tạo bộ thẻ</Button>}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** CUSTOM ICON — ghi đè slot `icon`; shape còn lại giống leaf WithDescription. */
export const CustomIcon: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Empty"
                tier="primitive"
                leaf="CustomIcon"
                parts={MESSAGE_PARTS}
                note="Ghi đè icon mặc định (TrayIcon → MagnifyingGlassIcon). Icon là GIÁ TRỊ truyền vào Feedback.Empty nên cây parts không đổi."
                code={`<AsyncContent.Empty
  icon={<MagnifyingGlassIcon weight="duotone" />}
  title="Không có kết quả khớp"
  description="Không có mục nào khớp với từ khoá bạn nhập."
/>`}
            >
                <AsyncContent.Empty
                    icon={MagnifyingGlassIcon}
                    title="Không có kết quả khớp"
                    description="Không có mục nào khớp với từ khoá bạn nhập."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

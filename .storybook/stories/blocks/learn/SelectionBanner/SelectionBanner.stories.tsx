import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { SelectionBanner } from "./SelectionBanner"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the warning-toned "asking about this passage" banner pinned at the top
 * of a content-AI side-thread: quoted excerpt (clamped 2 lines) + dismiss, plus an
 * optional muted note explaining the side-thread is born-archived. Ported from
 * `ContentAiChat/index.tsx:1296-1313`.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof SelectionBanner> = {
    title: "Block/Learn/SelectionBanner",
    component: SelectionBanner,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SelectionBanner>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="p-8">{node}</div>

/** The banner is pinned at the top of the narrow side-thread rail. */
const RailWidth = ({ children }: { children: React.ReactNode }) => <div className="w-96">{children}</div>

const SHORT_PASSAGE = "Closure trong JavaScript là gì?"
const MEDIUM_PASSAGE = "Event loop xử lý hết microtask queue trước khi chạy macrotask tiếp theo."
const LONG_PASSAGE =
    "Closure là khi một hàm bên trong vẫn giữ được tham chiếu tới các biến của hàm bên ngoài, ngay cả sau khi hàm bên ngoài đã chạy xong và trả về — nhờ đó dữ liệu không bị dọn dẹp bởi garbage collector như bình thường."
const ARCHIVED_NOTE =
    "Phiên hỏi riêng đoạn này được lưu trữ sẵn — không nằm ở danh sách thường, nhưng tìm lại được bằng search."

// Immediate children this block composes: InlineIconLabel (icon + clamped passage,
// tone warning) + Button (icon-only dismiss). The Typography note row only exists
// in leaves where `note` is passed — its ABSENCE changes the leaf's own tree, per
// canon (no phantom/optional node when the prop isn't set).
const inlineIconLabelNode: AnatomyNode = {
    name: "InlineIconLabel",
    tier: "primitive",
    role: "icon trích dẫn + đoạn văn đã chọn (line-clamp-2), tone warning — sở hữu icon+màu",
}
const buttonNode: AnatomyNode = {
    name: "Button",
    tier: "primitive",
    role: "nút bỏ chọn (icon-only, ghost, size sm) — xoá selection hiện tại",
}
const noteNode: AnatomyNode = {
    name: "Typography",
    tier: "primitive",
    role: "ghi chú phiên hỏi-theo-đoạn được lưu trữ riêng (born-archived), body-xs muted",
}

const NO_NOTE_PARTS: Array<AnatomyNode> = [inlineIconLabelNode, buttonNode]
const WITH_NOTE_PARTS: Array<AnatomyNode> = [inlineIconLabelNode, buttonNode, noteNode]

export const ShortPassage: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SelectionBanner"
                tier="block"
                leaf="Đoạn ngắn"
                parts={WITH_NOTE_PARTS}
                reason="Bôi đen một đoạn để hỏi riêng cần một banner ghim ở đầu rail, tách biệt khỏi luồng chat chính (viền+nền warning) — gồm icon trích dẫn + đoạn đã chọn (line-clamp-2) + nút bỏ chọn, cộng ghi chú rằng phiên này được lưu trữ riêng."
            >
                <RailWidth>
                    <SelectionBanner passage={SHORT_PASSAGE} note={ARCHIVED_NOTE} onDismiss={() => {}} showAnatomy />
                </RailWidth>
            </BlockAnatomy>,
        ),
}

export const LongPassageClamped: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SelectionBanner"
                tier="block"
                leaf="Đoạn dài (line-clamp-2 cắt)"
                parts={WITH_NOTE_PARTS}
                note="Đoạn chọn dài hơn 2 dòng → InlineIconLabel clamp phần chữ ở đúng 2 dòng (cắt bằng '…'), không đẩy banner cao vô hạn."
            >
                <RailWidth>
                    <SelectionBanner passage={LONG_PASSAGE} note={ARCHIVED_NOTE} onDismiss={() => {}} showAnatomy />
                </RailWidth>
            </BlockAnatomy>,
        ),
}

export const WithArchivedNote: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SelectionBanner"
                tier="block"
                leaf="Có ghi chú born-archived"
                parts={WITH_NOTE_PARTS}
                note="`note` có giá trị → thêm hàng Typography body-xs muted bên dưới, báo phiên hỏi-theo-đoạn được lưu trữ sẵn (không nằm ở danh sách thường)."
            >
                <RailWidth>
                    <SelectionBanner passage={MEDIUM_PASSAGE} note={ARCHIVED_NOTE} onDismiss={() => {}} showAnatomy />
                </RailWidth>
            </BlockAnatomy>,
        ),
}

export const WithoutNote: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SelectionBanner"
                tier="block"
                leaf="Không có ghi chú"
                parts={NO_NOTE_PARTS}
                note="Bỏ trống `note` → cây leaf này KHÔNG có node Typography — banner dừng lại ở hàng icon+đoạn+nút bỏ chọn, không để lại khoảng trống thay chỗ ghi chú."
            >
                <RailWidth>
                    <SelectionBanner passage={MEDIUM_PASSAGE} onDismiss={() => {}} showAnatomy />
                </RailWidth>
            </BlockAnatomy>,
        ),
}

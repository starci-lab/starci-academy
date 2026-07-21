import type { Meta, StoryObj } from "@storybook/nextjs"
import { RichText } from "./RichText"

const meta: Meta<typeof RichText> = {
    title: "Primitives/Rendering/RichText",
    component: RichText,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RichText>

/** Empty `text` → renders nothing (Typography with no children), takes no unexpected space. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="" />
        </div>
    ),
}

/** No marker matches → the text renders verbatim, no wrapping node. */
export const PlainText: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="Bấm nút Nộp bài để gửi câu trả lời, hệ thống sẽ chấm điểm ngay." />
        </div>
    ),
}

/** `` `code` `` — backtick span; NOT recursed, so its label prints literally. */
export const Code: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="Dùng `useEffect` để đồng bộ state với DOM sau khi render." />
        </div>
    ),
}

/** `**bold**` — emphasis for a warning or a key condition inside instructions. */
export const Bold: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="**Lưu ý:** bài tập này tính điểm cộng vào bảng xếp hạng tuần." />
        </div>
    ),
}

/** `_italic_` — softer emphasis than bold, e.g. an optional note. */
export const Italic: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="_Không bắt buộc_, nhưng nên hoàn thành trước khi qua module kế tiếp." />
        </div>
    ),
}

/** `[label](url)` — always opens a new tab (`target=_blank`, `rel=noopener`). */
export const Link: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="Xem thêm tại [tài liệu React Hooks](https://react.dev/reference/react)." />
        </div>
    ),
}

/** Each `\n` becomes a `<br/>` — short step lists without a real `<ul>`. */
export const LineBreaks: Story = {
    render: () => (
        <div className="p-8">
            <RichText text={"Bước 1: đọc đề bài.\nBước 2: viết code.\nBước 3: chạy test."} />
        </div>
    ),
}

/** `renderInline` recurses on the remainder, so one sentence can mix code + bold + link. */
export const Combined: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="Điền `npm install` rồi **build lại** trước khi nộp, xem [hướng dẫn](https://starci.dev/docs) nếu bí." />
        </div>
    ),
}

/** Nested markers (bold containing italic) — both `recurse: true`, so the inner label is re-parsed. */
export const Nested: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="**Cảnh báo: _sắp hết thời gian_, nộp bài ngay** trước khi hệ thống tự đóng." />
        </div>
    ),
}

/** Malformed / unmatched marker → falls back to plain text, no throw, no broken layout. */
export const MalformedFallback: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="Dấu backtick lẻ ` không khép sẽ hiện nguyên văn, không vỡ layout." />
        </div>
    ),
}

/** `size` mirrors the `Typography` type scale (body-xs → body-sm default → body → h4). */
export const SizeScale: Story = {
    render: () => (
        <div className="p-8 flex flex-col gap-3">
            <RichText size="body-xs" text="Cỡ `body-xs` — chú thích rất nhỏ." />
            <RichText size="body-sm" text="Cỡ `body-sm` — mặc định khi không truyền size." />
            <RichText size="body" text="Cỡ `body` — thân bài đọc bình thường." />
            <RichText size="h4" text="Cỡ `h4` — tiêu đề nhỏ có markup" />
        </div>
    ),
}

/** `color` omitted → inherits Typography default; `muted` for secondary asides. */
export const ColorScale: Story = {
    render: () => (
        <div className="p-8 flex flex-col gap-3">
            <RichText color="default" text="Màu `default` — nội dung chính." />
            <RichText color="muted" text="Màu `muted` — phụ chú, ít quan trọng hơn." />
        </div>
    ),
}

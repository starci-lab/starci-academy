import type { Meta, StoryObj } from "@storybook/nextjs"
import { RichText } from "@sb-components/composites/viewers/RichText/RichText"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof RichText> = {
    title: "Composites/Viewers/RichText",
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
            <RichText text="" anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** No marker matches → the text renders verbatim, no wrapping node. */
export const PlainText: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="Bấm nút Nộp bài để gửi câu trả lời, hệ thống sẽ chấm điểm ngay." anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** `` `code` `` — backtick span; NOT recursed, so its label prints literally. */
export const Code: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="Dùng `useEffect` để đồng bộ state với DOM sau khi render." anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** `**bold**` — emphasis for a warning or a key condition inside instructions. */
export const Bold: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="**Lưu ý:** bài tập này tính điểm cộng vào bảng xếp hạng tuần." anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** `_italic_` — softer emphasis than bold, e.g. an optional note. */
export const Italic: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="_Không bắt buộc_, nhưng nên hoàn thành trước khi qua module kế tiếp." anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** `[label](url)` — always opens a new tab (`target=_blank`, `rel=noopener`). */
export const Link: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="Xem thêm tại [tài liệu React Hooks](https://react.dev/reference/react)." anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** Each `\n` becomes a `<br/>` — short step lists without a real `<ul>`. */
export const LineBreaks: Story = {
    render: () => (
        <div className="p-8">
            <RichText text={"Bước 1: đọc đề bài.\nBước 2: viết code.\nBước 3: chạy test."} anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** `renderInline` recurses on the remainder, so one sentence can mix code + bold + link. */
export const Combined: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="Điền `npm install` rồi **build lại** trước khi nộp, xem [hướng dẫn](https://starci.dev/docs) nếu bí." anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** Nested markers (bold containing italic) — both `recurse: true`, so the inner label is re-parsed. */
export const Nested: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="**Cảnh báo: _sắp hết thời gian_, nộp bài ngay** trước khi hệ thống tự đóng." anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** Malformed / unmatched marker → falls back to plain text, no throw, no broken layout. */
export const MalformedFallback: Story = {
    render: () => (
        <div className="p-8">
            <RichText text="Dấu backtick lẻ ` không khép sẽ hiện nguyên văn, không vỡ layout." anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** `size` mirrors the `Typography` type scale (body-xs → body-sm default → body → h4). */
export const SizeScale: Story = {
    render: () => (
        <div className="p-8 flex flex-col gap-3">
            <RichText size="body-xs" text="Cỡ `body-xs` — chú thích rất nhỏ." anatPart="RichText" showAnatomy />
            <RichText size="body-sm" text="Cỡ `body-sm` — mặc định khi không truyền size." anatPart="RichText" showAnatomy />
            <RichText size="body" text="Cỡ `body` — thân bài đọc bình thường." anatPart="RichText" showAnatomy />
            <RichText size="h4" text="Cỡ `h4` — tiêu đề nhỏ có markup" anatPart="RichText" showAnatomy />
        </div>
    ),
}

/** `color` omitted → inherits Typography default; `muted` for secondary asides. */
export const ColorScale: Story = {
    render: () => (
        <div className="p-8 flex flex-col gap-3">
            <RichText color="default" text="Màu `default` — nội dung chính." anatPart="RichText" showAnatomy />
            <RichText color="muted" text="Màu `muted` — phụ chú, ít quan trọng hơn." anatPart="RichText" showAnatomy />
        </div>
    ),
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "RichText": { tier: "composite", role: "the single HeroUI `Typography` that carries the rendered inline-markdown subset", storyId: "composites-viewers-richtext--plain-text" },
    "Skeleton": { tier: "heroui", role: "the single-line shimmer bar standing in for the not-yet-loaded inline copy while `isSkeleton`" },
}

/** LEAF — the caller flips `isSkeleton`; a single shimmer bar stands in for the short inline copy (§12g.0a), matching that `RichText` only ever holds one line/measure of text, unlike `MarkdownContent`'s multi-line document mirror. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="RichText"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The atom-level `HeroSkeleton` bar stands in for whatever inline copy hasn't loaded yet — a title, a caption, a short instruction — since `RichText` never knows its own length ahead of the real `text`.",
                        code: "<RichText isSkeleton />",
                        render: <RichText isSkeleton anatPart="RichText" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { UpNextCard } from "./UpNextCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the completion-handoff card: "you just finished → here's the next
 * rung". A static, props-only surface fired at the completion moment of a learn
 * surface to hand the learner to the next step while momentum is high.
 *
 * ANATOMY IS PER-LEAF: each scenario below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — the
 * shape changes with which optional parts (check · eyebrow · description ·
 * secondary action) are present. There is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof UpNextCard> = {
    title: "Design/Learn/UpNextCard",
    component: UpNextCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof UpNextCard>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// MINIMAL leaf: bare shape — frame + title + one CTA (no check/eyebrow/description/secondary).
const MINIMAL_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "design", role: "khung viền tự đóng gom khối hoàn thành" },
    { name: "Typography", tier: "primitive", role: "tiêu đề bước kế (semibold)" },
    { name: "Button", tier: "primitive", role: "CTA chính (accent, size lg, mũi tên)" },
]

// CHECK+EYEBROW leaf: adds the completion check + muted eyebrow above the title.
const CHECK_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "design", role: "khung viền tự đóng gom khối hoàn thành" },
    {
        name: "CheckCircleIcon",
        tier: "primitive",
        role: "check hoàn thành — micro-feedback 'vừa xong ✓'",
        state: "showCheck",
    },
    { name: "Typography", tier: "primitive", role: "eyebrow muted · tiêu đề bước kế (semibold)" },
    { name: "Button", tier: "primitive", role: "CTA chính (accent, size lg, mũi tên)" },
]

// DESCRIPTION leaf: check + eyebrow + an outcome-framed description line under the title.
const DESCRIPTION_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "design", role: "khung viền tự đóng gom khối hoàn thành" },
    {
        name: "CheckCircleIcon",
        tier: "primitive",
        role: "check hoàn thành — micro-feedback 'vừa xong ✓'",
        state: "showCheck",
    },
    {
        name: "Typography",
        tier: "primitive",
        role: "eyebrow muted · tiêu đề (semibold) · mô tả hướng outcome",
    },
    { name: "Button", tier: "primitive", role: "CTA chính (accent, size lg, mũi tên)" },
]

// SECONDARY leaf: bare shape but the CTA row gains a quiet tertiary secondary action.
const SECONDARY_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "design", role: "khung viền tự đóng gom khối hoàn thành" },
    { name: "Typography", tier: "primitive", role: "tiêu đề bước kế (semibold)" },
    {
        name: "Button",
        tier: "primitive",
        role: "CTA chính (accent, size lg, mũi tên) + hành động phụ nhẹ (tertiary)",
    },
]

// FULL leaf: every part present — check + eyebrow + description + CTA primary/secondary.
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "design", role: "khung viền tự đóng gom khối hoàn thành" },
    {
        name: "CheckCircleIcon",
        tier: "primitive",
        role: "check hoàn thành — micro-feedback 'vừa xong ✓'",
        state: "showCheck",
    },
    {
        name: "Typography",
        tier: "primitive",
        role: "eyebrow muted · tiêu đề (semibold) · mô tả hướng outcome",
    },
    {
        name: "Button",
        tier: "primitive",
        role: "CTA chính (accent, size lg, mũi tên) + hành động phụ nhẹ (tertiary)",
    },
]

export const Minimal: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="UpNextCard"
                tier="design"
                leaf="Tối giản"
                parts={MINIMAL_PARTS}
                note="Chỉ khung + tiêu đề + ĐÚNG MỘT CTA — không check/eyebrow/mô tả/hành động phụ."
            >
                <UpNextCard
                    title="Làm 2 thử thách của bài này"
                    ctaLabel="Bắt đầu"
                    onPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const CheckAndEyebrow: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="UpNextCard"
                tier="design"
                leaf="Check + eyebrow"
                parts={CHECK_PARTS}
                note="Thêm check hoàn thành + eyebrow muted trên tiêu đề — CTA đọc như đang cưỡi đà 'vừa xong'."
            >
                <UpNextCard
                    showCheck
                    eyebrow="Đã xong · Tiếp theo"
                    title="Ôn lại cụm từ vừa học bằng flashcard"
                    ctaLabel="Ôn ngay"
                    onPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const WithDescription: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="UpNextCard"
                tier="design"
                leaf="Có mô tả"
                parts={DESCRIPTION_PARTS}
                note="Thêm một dòng mô tả hướng outcome dưới tiêu đề — nói rõ 'làm xong để tiến tới đâu'."
            >
                <UpNextCard
                    showCheck
                    eyebrow="Đã xong · Tiếp theo"
                    title="Làm bài kiểm tra cuối chương 3"
                    description="Hoàn thành bài này để mở khoá dải năng lực Junior Backend trong lộ trình của bạn."
                    ctaLabel="Vào bài kiểm tra"
                    onPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const WithSecondaryAction: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="UpNextCard"
                tier="design"
                leaf="Có hành động phụ"
                parts={SECONDARY_PARTS}
                note="Hàng CTA có thêm một hành động phụ nhẹ (tertiary) cạnh CTA chính — vẫn giữ MỘT hành động nổi."
            >
                <UpNextCard
                    title="Làm 2 thử thách của bài này"
                    ctaLabel="Bắt đầu"
                    onPress={() => {}}
                    secondaryLabel="Làm capstone chương"
                    secondaryOnPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const Full: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="UpNextCard"
                tier="design"
                leaf="Đầy đủ"
                parts={FULL_PARTS}
                reason="Điểm hoàn thành một bề mặt học cần MỘT surface tự đóng khung (SectionCard) gom lại: micro-feedback 'vừa xong ✓' + eyebrow, bước tiếp theo (title + outcome), và ĐÚNG MỘT CTA chính (accent, size lg, mũi tên) + một hành động phụ nhẹ. Gói vào một block để mỗi màn hoàn thành chỉ truyền bước kế + handler điều hướng — không dựng lại khung, thứ tự nhấn, và cặp CTA chính/phụ."
            >
                <UpNextCard
                    showCheck
                    eyebrow="Đã xong · Tiếp theo"
                    title="Làm dự án cá nhân: API giỏ hàng có phân trang"
                    description="Ghép kiến thức REST và phân trang vừa học thành một dự án chấm điểm, đưa bạn gần hơn tới dải năng lực Middle Backend."
                    ctaLabel="Xem đề bài"
                    onPress={() => {}}
                    secondaryLabel="Xem lại bài học"
                    secondaryOnPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

export const LongContent: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="UpNextCard"
                tier="design"
                leaf="Nội dung dài"
                parts={FULL_PARTS}
                note="Cùng composition với leaf 'Đầy đủ' — chỉ tiêu đề/mô tả/nhãn dài hơn để soi cách chữ xuống dòng."
            >
                <UpNextCard
                    showCheck
                    eyebrow="Đã xong · Tiếp theo"
                    title="Xây dựng hệ thống thông báo realtime dùng WebSocket kết hợp hàng đợi tin nhắn để xử lý lượng lớn kết nối đồng thời"
                    description="Bài này nối tiếp phần kiến trúc event-driven đã học, đưa bạn tới gần hơn dải năng lực System Design cho vị trí Senior Backend trong lộ trình hiện tại."
                    ctaLabel="Vào bài học tiếp theo"
                    onPress={() => {}}
                    secondaryLabel="Xem lại toàn bộ chương này trước khi tiếp tục"
                    secondaryOnPress={() => {}}
                />
            </BlockAnatomy>,
        ),
}

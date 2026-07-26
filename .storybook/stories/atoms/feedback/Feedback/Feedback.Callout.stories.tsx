import type { Meta, StoryObj } from "@storybook/nextjs"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Feedback, type FeedbackCalloutStatus } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (layout tier) — `Feedback.Callout`: dải tint PHẲNG đặt BÊN TRONG một
 * surface (surface-in-surface), không phải card nổi. Khung sở hữu tint + icon
 * theo `status`; nội dung đi bằng slot có tên `title`/`description`/`body`
 * (+`children`)/`action` + nút đóng tuỳ chọn.
 *
 * ⚠️ PHẠM VI STATE (§12f): mỗi story dưới đây chỉ render state do CHÍNH khung này
 * đẻ ra — `status`, có/không `description`, `body`, `action`, `onClose`, `icon`.
 * State của nút CTA (pending/disabled) sống ở story `Atoms/Buttons/Button` — khung
 * này chỉ nhận `actionLabel`/`onAction`, không nhận node.
 *
 * 📐 LEAF = CẤU TRÚC (§14d.2, thầy chốt 2026-07-26): `status` KHÔNG đổi cây DOM —
 * mọi tone dùng chung `Icon · Content(Title · Description)`, chỉ khác tint + glyph
 * mặc định + màu Title ⇒ chúng là STATE, gộp trong MỘT leaf. Mấy leaf còn lại giữ
 * riêng vì mỗi cái thêm/bớt node THẬT (bỏ `Description`, thêm `Body`/`Action`/`Close`).
 */
const meta: Meta<typeof Feedback.Callout> = {
    title: "Layouts/Feedback/Feedback/Feedback.Callout",
    component: Feedback.Callout,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Feedback.Callout>

/** Icon · Content(Title · Description) — bộ part chung của mọi tone. */
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "biểu tượng tone (mặc định theo status, hoặc icon custom)" },
    {
        name: "Content",
        tier: "primitive",
        role: "cột nội dung — Alert.Content",
        children: [
            { name: "Title", tier: "primitive", role: "dòng tiêu đề (Alert.Title, tô theo status)" },
            { name: "Description", tier: "primitive", role: "dòng mô tả phụ (Alert.Description)" },
        ],
    },
]

const TITLE_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "biểu tượng tone mặc định" },
    {
        name: "Content",
        tier: "primitive",
        role: "cột nội dung — chỉ còn Title",
        children: [{ name: "Title", tier: "primitive", role: "dòng tiêu đề (Alert.Title)" }],
    },
]

const WITH_BODY_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "biểu tượng tone" },
    {
        name: "Content",
        tier: "primitive",
        role: "cột nội dung — Alert.Content",
        children: [
            { name: "Title", tier: "primitive", role: "dòng tiêu đề" },
            { name: "Description", tier: "primitive", role: "dòng mô tả phụ" },
            { name: "Body", tier: "primitive", role: "slot TỰ DO dưới mô tả (`body`/`children`) — nội dung do caller soạn" },
        ],
    },
]

const WITH_ACTION_PARTS: Array<AnatomyNode> = [
    ...BASE_PARTS,
    { name: "Action", tier: "primitive", role: "slot CTA phụ (node do caller truyền), đứng trước nút đóng" },
]

const DISMISSIBLE_PARTS: Array<AnatomyNode> = [
    ...TITLE_ONLY_PARTS,
    { name: "Close", tier: "atom", role: "`Button.Base` (`XIcon`, ghost) tô theo tone — đóng dải" },
]

/**
 * Trục `status` — cùng cây DOM, chỉ đổi tint + glyph mặc định + màu Title. Vì thế
 * cả bộ nằm TRONG một leaf (§14d.2), không tách mỗi tone một story.
 */
const TONES: Array<{ status: FeedbackCalloutStatus, title: string, description: string }> = [
    { status: "default", title: "Bản nháp đã lưu", description: "Thay đổi của bạn được giữ tự động." },
    { status: "accent", title: "Chương 3 vừa có phần thực hành mới", description: "Mở lại chương để làm phần vừa thêm." },
    { status: "success", title: "Nộp bài thành công", description: "Kết quả sẽ có sau ít phút." },
    { status: "warning", title: "Sắp hết hạn", description: "Còn 2 ngày để hoàn thành milestone." },
    { status: "danger", title: "Không kết nối được máy chủ", description: "Kiểm tra mạng rồi thử lại." },
]

/** Leaf gốc — render ĐỦ tone của khung (state, không phải leaf riêng). */
export const Default: Story = {
    name: "Tones",
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="Đủ tone"
                parts={BASE_PARTS}
                reason="Khung THÔNG BÁO TẠI CHỖ: một dải tint phẳng (`shadow-none`) nằm TRONG surface có sẵn, để nó đọc như một vệt nhấn chứ không phải card-trong-card. Khung sở hữu tint + icon theo `status`; caller chỉ đưa chữ."
                note="Mọi tone (default/accent/success/warning/danger) CÙNG bộ part — chỉ khác icon mặc định + tint + màu Title, nên chung MỘT leaf (§14d.2)."
                code={`<Feedback.Callout
  status="success"
  title="Nộp bài thành công"
  description="Kết quả sẽ có sau ít phút."
/>`}
            >
                <div className="flex flex-col gap-4">
                    {TONES.map(({ status, title, description }, index) => (
                        <Feedback.Callout
                            key={status}
                            showAnatomy={index === 0}
                            status={status}
                            title={title}
                            description={description}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Biên: chỉ `title` — Content thu về đúng MỘT dòng, không có Description. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="TitleOnly"
                parts={TITLE_ONLY_PARTS}
                note="Bỏ `description` → Content chỉ còn Title (dải mỏng nhất của khung)."
                code={`<Feedback.Callout
  status="accent"
  title="Mẹo: bôi đen đoạn văn để hỏi AI"
/>`}
            >
                <Feedback.Callout showAnatomy status="accent" title="Mẹo: bôi đen đoạn văn để hỏi AI" />
            </BlockAnatomy>
        </div>
    ),
}

/** `body` (≡ `children`) — slot TỰ DO dưới mô tả, cho nội dung không phải một dòng chữ. */
export const WithBody: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="WithBody"
                parts={WITH_BODY_PARTS}
                note="Khung BỌC (§13b): `body` là slot thân tự do, `children` là shorthand của nó — dùng khi thông điệp cần nhiều hơn một dòng mô tả."
                code={`<Feedback.Callout status="warning" title="Bài nộp thiếu 2 mục" description="…">
  <ul className="list-disc pl-4">…</ul>
</Feedback.Callout>`}
            >
                <Feedback.Callout
                    showAnatomy
                    status="warning"
                    title="Bài nộp còn thiếu 2 mục"
                    description="Bổ sung rồi nộp lại để được chấm."
                    body={(
                        <ul className="list-disc space-y-1 pl-4">
                            <li><Typography.Base size="xs" text="README mô tả cách chạy dự án" color="muted" /></li>
                            <li><Typography.Base size="xs" text="Ảnh chụp màn hình kết quả" color="muted" /></li>
                        </ul>
                    )}
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * `actionLabel`/`onAction` — CTA phụ nằm cùng hàng. Khung TỰ dựng nút và tự bôi
 * skin đặc màu theo `status`; caller chỉ đưa CHỮ, không cầm `Button` (thầy chốt
 * 2026-07-25: screen tuyệt đối không xài atom).
 */
export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="WithAction"
                parts={WITH_ACTION_PARTS}
                note="`actionLabel` = slot footer nằm ngang, trước nút đóng. Khung tự dựng nút + tự bôi bg đặc theo status — caller không đưa node."
                code={`<Feedback.Callout
  status="accent"
  title="Nâng cấp để mở khoá AI"
  actionLabel="Nâng cấp"
/>`}
            >
                <Feedback.Callout
                    showAnatomy
                    status="accent"
                    title="Nâng cấp để mở khoá AI"
                    description="Gói trả phí cho phép chấm nâng cao."
                    actionLabel="Nâng cấp"
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `icon` — thay glyph mặc định của tone bằng một icon COMPONENT khác (khung vẫn ép size-6). */
export const CustomIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="CustomIcon"
                parts={WITH_ACTION_PARTS}
                note="`icon` nhận COMPONENT (không JSX) — khung tự ép size-6 + màu theo tone, caller không set class icon."
                code={`<Feedback.Callout
  status="warning"
  icon={GithubLogoIcon}
  title="Bạn chưa vào team GitHub"
  …
/>`}
            >
                <Feedback.Callout
                    showAnatomy
                    status="warning"
                    icon={GithubLogoIcon}
                    title="Bạn chưa vào team GitHub của khoá"
                    description="Nội dung premium nằm trong repo GitHub của khoá, nên bạn cần vào team mới mở được."
                    actionLabel="Vào team"
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `onClose` — dải tự tắt được: thêm node `Close` (atom `Button.Base`) ở cuối hàng. */
export const Dismissible: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="Dismissible"
                parts={DISMISSIBLE_PARTS}
                note="`onClose` bật nút × (atom `Button.Base` ghost, tô theo tone). §11a: badge dừng ở node Close, không drill vào ruột atom."
                code={`<Feedback.Callout
  status="accent"
  title="…"
  onClose={() =>
  {}} closeAriaLabel="Đóng gợi ý"
/>`}
            >
                <Feedback.Callout
                    showAnatomy
                    status="accent"
                    title="Mẹo: bôi đen để hỏi AI"
                    onClose={() => {}}
                    closeAriaLabel="Đóng gợi ý"
                />
            </BlockAnatomy>
        </div>
    ),
}

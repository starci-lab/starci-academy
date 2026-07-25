import type { Meta, StoryObj } from "@storybook/nextjs"
import { LogoGithub } from "@gravity-ui/icons"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Feedback, CALLOUT_ACTION_CLASS } from "@sb-components/blocks/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (layout tier) — `Feedback.Callout`: dải tint PHẲNG đặt BÊN TRONG một
 * surface (surface-in-surface), không phải card nổi. Khung sở hữu tint + icon
 * theo `status`; nội dung đi bằng slot có tên `title`/`description`/`body`
 * (+`children`)/`action` + nút đóng tuỳ chọn.
 *
 * ⚠️ PHẠM VI STATE (§12f): mỗi story dưới đây chỉ render state do CHÍNH khung này
 * đẻ ra — `status`, có/không `description`, `body`, `action`, `onClose`, `icon`.
 * State của thứ caller nhét vào `action` (pending/disabled của Button) sống ở story
 * `Atoms/Buttons/Button`.
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
    { name: "Close", tier: "atom", role: "`Button.Icon` (Xmark, ghost) tô theo tone — đóng dải" },
]

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="Default"
                parts={BASE_PARTS}
                reason="Khung THÔNG BÁO TẠI CHỖ: một dải tint phẳng (`shadow-none`) nằm TRONG surface có sẵn, để nó đọc như một vệt nhấn chứ không phải card-trong-card. Khung sở hữu tint + icon theo `status`; caller chỉ đưa chữ."
                code={`<Feedback.Callout
  title="Bản nháp đã lưu"
  description="Thay đổi của bạn được giữ tự động."
/>`}
            >
                <Feedback.Callout showAnatomy title="Bản nháp đã lưu" description="Thay đổi của bạn được giữ tự động." />
            </BlockAnatomy>
        </div>
    ),
}

export const Success: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="Success"
                parts={BASE_PARTS}
                note="Mọi tone (success/warning/danger/accent) CÙNG bộ part — chỉ khác icon mặc định + tint + màu Title."
                code={`<Feedback.Callout
  status="success"
  title="Nộp bài thành công"
  description="…"
/>`}
            >
                <Feedback.Callout showAnatomy status="success" title="Nộp bài thành công" description="Kết quả sẽ có sau ít phút." />
            </BlockAnatomy>
        </div>
    ),
}

export const Warning: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="Warning"
                parts={BASE_PARTS}
                code={`<Feedback.Callout
  status="warning"
  title="Sắp hết hạn"
  description="…"
/>`}
            >
                <Feedback.Callout showAnatomy status="warning" title="Sắp hết hạn" description="Còn 2 ngày để hoàn thành milestone." />
            </BlockAnatomy>
        </div>
    ),
}

export const Danger: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="Danger"
                parts={BASE_PARTS}
                code={`<Feedback.Callout
  status="danger"
  title="Không kết nối được máy chủ"
  description="…"
/>`}
            >
                <Feedback.Callout showAnatomy status="danger" title="Không kết nối được máy chủ" description="Kiểm tra mạng rồi thử lại." />
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
                            <li><Typography.Xs text="README mô tả cách chạy dự án" color="muted" /></li>
                            <li><Typography.Xs text="Ảnh chụp màn hình kết quả" color="muted" /></li>
                        </ul>
                    )}
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * `action` — CTA phụ nằm cùng hàng, dùng `CALLOUT_ACTION_CLASS[status]` để nút
 * đặc màu tone nổi trên nền tint (khung export bảng màu này cho caller).
 */
export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="WithAction"
                parts={WITH_ACTION_PARTS}
                note="`action` = slot footer nằm ngang, trước nút đóng. Nút CTA lấy skin từ `CALLOUT_ACTION_CLASS[status]` (bg đặc trên nền tint)."
                code={`<Feedback.Callout
  status="accent"
  title="Nâng cấp để mở khoá AI"
  action={<Button.Base label="Nâng cấp" size="sm" className={CALLOUT_ACTION_CLASS.accent} />}
/>`}
            >
                <Feedback.Callout
                    showAnatomy
                    status="accent"
                    title="Nâng cấp để mở khoá AI"
                    description="Gói trả phí cho phép chấm nâng cao."
                    action={<Button.Base label="Nâng cấp" size="sm" className={CALLOUT_ACTION_CLASS.accent} />}
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
  icon={LogoGithub}
  title="Bạn chưa vào team GitHub"
  …
/>`}
            >
                <Feedback.Callout
                    showAnatomy
                    status="warning"
                    icon={LogoGithub}
                    title="Bạn chưa vào team GitHub của khoá"
                    description="Nội dung premium nằm trong repo GitHub của khoá, nên bạn cần vào team mới mở được."
                    action={<Button.Base label="Vào team" size="sm" className={CALLOUT_ACTION_CLASS.warning} />}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `onClose` — dải tự tắt được: thêm node `Close` (atom `Button.Icon`) ở cuối hàng. */
export const Dismissible: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Callout"
                tier="primitive"
                leaf="Dismissible"
                parts={DISMISSIBLE_PARTS}
                note="`onClose` bật nút × (atom `Button.Icon` ghost, tô theo tone). §11a: badge dừng ở node Close, không drill vào ruột atom."
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

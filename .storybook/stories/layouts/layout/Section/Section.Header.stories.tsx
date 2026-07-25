import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRightIcon, GearIcon } from "@phosphor-icons/react"
import { Section } from "@sb-components/layouts/layout/Section/Section"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Section.Header` — khung tiêu đề của MỘT VÙNG trong trang: `eyebrow` · `title` ·
 * `description` xếp cột trái, `action` ghim phải. KHÔNG children (mọi thứ là slot
 * có tên), KHÔNG chrome (không nền/viền/bo/padding) — nó ngồi thẳng trên nền trang.
 *
 * ⚠️ PHẠM VI STATE (§12f/§13): file này chỉ render state SINH RA TỪ CHÍNH nó — bật/tắt
 * từng slot + `level` (thang chữ). Nhịp dọc header ↔ body ↔ footer là tài sản của
 * `Section.Base` (`gap`), nên KHÔNG lặp ở đây. Phân biệt tầng: `Page.Header` = chrome
 * của cả ROUTE (breadcrumb + H3 + meta, một cái/trang) · `SectionCard` (design) = thẻ
 * CÓ chrome · `Section.Header` = tiêu đề vùng, nhiều cái/trang, co theo `level`.
 */
const meta: Meta<typeof Section.Header> = {
    title: "Layouts/Layout/Section/Section.Header",
    component: Section.Header,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Section.Header>

/**
 * ANATOMY IS PER-LEAF: mỗi story khai đúng những part CHÍNH NÓ render. `Eyebrow`/
 * `Description`/`Action` chỉ tồn tại ở leaf thực sự truyền slot đó.
 */
const TITLE_PARTS: Array<AnatomyNode> = [
    { name: "Title", tier: "primitive", role: "tiêu đề vùng — Typography.<size theo level>, weight bold" },
]
const EYEBROW_PARTS: Array<AnatomyNode> = [
    { name: "Eyebrow", tier: "primitive", role: "kicker muted TRÊN title (ngữ cảnh, không phải title thứ hai)" },
    { name: "Title", tier: "primitive", role: "tiêu đề vùng" },
]
const DESCRIPTION_PARTS: Array<AnatomyNode> = [
    { name: "Title", tier: "primitive", role: "tiêu đề vùng" },
    { name: "Description", tier: "primitive", role: "dòng bổ trợ dưới title, muted, nhỏ hơn 1 bậc" },
]
const ACTION_PARTS: Array<AnatomyNode> = [
    { name: "Title", tier: "primitive", role: "tiêu đề vùng" },
    { name: "Action", tier: "primitive", role: "slot điều khiển ghim phải (`shrink-0`) — nhận node Button.* từ caller" },
]
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Eyebrow", tier: "primitive", role: "kicker muted trên title" },
    { name: "Title", tier: "primitive", role: "tiêu đề vùng" },
    { name: "Description", tier: "primitive", role: "dòng bổ trợ muted" },
    { name: "Action", tier: "primitive", role: "slot điều khiển ghim phải" },
]

/** Tối thiểu — chỉ `title`. Khung vẫn là hàng flex, chỉ có một cột chữ. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="Section.Header"
                    tier="primitive"
                    leaf="Default"
                    parts={TITLE_PARTS}
                    reason="Khung tiêu đề của một VÙNG trong trang. Không mang chức năng: nó không biết vùng dưới nó là gì, chỉ xếp eyebrow/title/description bên trái và một slot action bên phải."
                    code={"<Section.Header title=\"Khoá của tôi\" />"}
                >
                    <Section.Header title="Khoá của tôi" showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `eyebrow` — ngữ cảnh muted phía trên title (tên khoá/module), cùng cụm chữ `gap-1`. */
export const WithEyebrow: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="Section.Header"
                    tier="primitive"
                    leaf="WithEyebrow"
                    parts={EYEBROW_PARTS}
                    note="`eyebrow` nhỏ hơn title 1 bậc và luôn muted — nó là NGỮ CẢNH, không leo lên thành title thứ hai (§9a)."
                    code={"<Section.Header eyebrow=\"Fullstack Mastery\" title=\"Module 3 · Cơ sở dữ liệu\" />"}
                >
                    <Section.Header eyebrow="Fullstack Mastery" title="Module 3 · Cơ sở dữ liệu" showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `description` — một dòng bổ trợ muted dưới title. */
export const WithDescription: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="Section.Header"
                    tier="primitive"
                    leaf="WithDescription"
                    parts={DESCRIPTION_PARTS}
                    note="Title ↔ description là MỘT cụm chữ → `gap-1` (tight, §10b), không phải nhịp giữa các vùng."
                    code={`<Section.Header
  title="Khoá của tôi"
  description="Những khoá bạn đã ghi danh, sắp theo lần học gần nhất."
/>`}
                >
                    <Section.Header
                        title="Khoá của tôi"
                        description="Những khoá bạn đã ghi danh, sắp theo lần học gần nhất."
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `action` — slot phải nhận node `Button.*` (khung KHÔNG tự quyết hành động là gì). */
export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="Section.Header"
                    tier="primitive"
                    leaf="WithAction"
                    parts={ACTION_PARTS}
                    note="Action là SLOT: khung chỉ ghim `shrink-0` bên phải và giữ cột chữ `min-w-0`. Caller đưa atom Button.* vào — khung không mang chức năng (§13)."
                    code={`<Section.Header
  title="Khoá của tôi"
  action={<Button.Base label="Xem tất cả" variant="ghost" size="sm" icon={ArrowRightIcon} />}
/>`}
                >
                    <Section.Header
                        title="Khoá của tôi"
                        action={<Button.Base label="Xem tất cả" variant="ghost" size="sm" icon={ArrowRightIcon} onPress={() => {}} />}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Đủ 4 slot cùng lúc — cột chữ 3 dòng bên trái, action canh TRÊN (`items-start`). */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="Section.Header"
                    tier="primitive"
                    leaf="Full"
                    parts={FULL_PARTS}
                    note="`items-start` để action neo mép TRÊN khi cột chữ cao 3 dòng — không trôi xuống giữa."
                    code={`<Section.Header
  eyebrow="Fullstack Mastery"
  title="Bài tập đã nộp"
  description="AI chấm trong vài phút; bạn có thể nộp lại tối đa 3 lần."
  action={<Button.Base label="Cấu hình" variant="secondary" size="sm" icon={GearIcon} />}
/>`}
                >
                    <Section.Header
                        eyebrow="Fullstack Mastery"
                        title="Bài tập đã nộp"
                        description="AI chấm trong vài phút; bạn có thể nộp lại tối đa 3 lần."
                        action={<Button.Base label="Cấu hình" variant="secondary" size="sm" icon={GearIcon} onPress={() => {}} />}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/**
 * `level` — MỘT nút xoay đổi thang chữ của CẢ header (title + description + eyebrow
 * đi cùng nhau), nên header không bao giờ trộn cỡ bằng tay.
 */
export const Levels: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex max-w-2xl flex-col gap-6">
                <BlockAnatomy
                    name="Section.Header"
                    tier="primitive"
                    leaf="Levels"
                    parts={DESCRIPTION_PARTS}
                    note="level 1 = Typography.Lg bold · 2 (mặc định) = Base bold · 3 = Sm medium; description tụt theo (Sm → Sm → Xs). Composition KHÔNG đổi, chỉ đổi cỡ."
                    code={`<Section.Header level={1} title="…" description="…" />
<Section.Header level={2} title="…" description="…" />
<Section.Header level={3} title="…" description="…" />`}
                >
                    <Section.Header
                        level={1}
                        title="Lộ trình học"
                        description="level 1 — dải lớn nhất của trang."
                        showAnatomy
                    />
                </BlockAnatomy>
                <Section.Header
                    level={2}
                    title="Module đang học"
                    description="level 2 — vùng thường (mặc định)."
                />
                <Section.Header
                    level={3}
                    title="Bài trong module"
                    description="level 3 — vùng con nằm dưới một header khác."
                />
            </div>
        </div>
    ),
}

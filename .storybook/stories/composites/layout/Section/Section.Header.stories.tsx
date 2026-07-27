import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRightIcon, GearIcon } from "@phosphor-icons/react"
import { Section } from "@sb-components/composites/layout/Section/Section"
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
    title: "Composites/Layout/Section/Section.Header",
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
    { name: "Title", tier: "composite", role: "the region's title, rendered at the size the level sets, always bold weight" },
]
const EYEBROW_PARTS: Array<AnatomyNode> = [
    { name: "Eyebrow", tier: "composite", role: "a muted kicker sitting above the title, context rather than a second title" },
    { name: "Title", tier: "composite", role: "the region's title" },
]
const DESCRIPTION_PARTS: Array<AnatomyNode> = [
    { name: "Title", tier: "composite", role: "the region's title" },
    { name: "Description", tier: "composite", role: "a supporting line under the title, muted and one size smaller" },
]
const ACTION_PARTS: Array<AnatomyNode> = [
    { name: "Title", tier: "composite", role: "the region's title" },
    { name: "Action", tier: "composite", role: "the right-pinned control slot, shrink-0, holding whatever Button.* node the caller passes" },
]
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Eyebrow", tier: "composite", role: "a muted kicker above the title" },
    { name: "Title", tier: "composite", role: "the region's title" },
    { name: "Description", tier: "composite", role: "a muted supporting line" },
    { name: "Action", tier: "composite", role: "the right-pinned control slot" },
]

/** Tối thiểu — chỉ `title`. Khung vẫn là hàng flex, chỉ có một cột chữ. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="Section.Header"
                    tier="composite"
                    leaf="Default"
                    parts={TITLE_PARTS}
                    reason="The heading of ONE region inside a page. It carries no function of its own: it doesn't know what sits below it, it only lays out an eyebrow, a title and a description on the left and one action slot on the right."
                    states={[
                        {
                            name: "only title passed",
                            why: "Just the title text renders, no eyebrow above it and no description or action beside it. This is the bare frame, the shape every other leaf below adds one slot on top of.",
                            code: "<Section.Header title=\"Khoá của tôi\" />",
                            render: <Section.Header title="Khoá của tôi" showAnatomy />,
                        },
                    ]}
                />
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
                    tier="composite"
                    leaf="WithEyebrow"
                    parts={EYEBROW_PARTS}
                    states={[
                        {
                            name: "eyebrow set",
                            why: "A muted kicker line grows above the title, one size smaller and in the same tight text cluster. The eyebrow names the course or module the region belongs to, so it stays context rather than climbing into a second title (§9a).",
                            code: "<Section.Header eyebrow=\"Fullstack Mastery\" title=\"Module 3 · Cơ sở dữ liệu\" />",
                            render: <Section.Header eyebrow="Fullstack Mastery" title="Module 3 · Cơ sở dữ liệu" showAnatomy />,
                        },
                    ]}
                />
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
                    tier="composite"
                    leaf="WithDescription"
                    parts={DESCRIPTION_PARTS}
                    states={[
                        {
                            name: "description set",
                            why: "A muted line grows below the title, tied to it with the same tight `gap-1` used inside a single text cluster rather than the looser rhythm between regions. Title and description read as one unit, not two separate stacked blocks.",
                            code: `<Section.Header
  title="Khoá của tôi"
  description="Những khoá bạn đã ghi danh, sắp theo lần học gần nhất."
/>`,
                            render: (
                                <Section.Header
                                    title="Khoá của tôi"
                                    description="Những khoá bạn đã ghi danh, sắp theo lần học gần nhất."
                                    showAnatomy
                                />
                            ),
                        },
                    ]}
                />
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
                    tier="composite"
                    leaf="WithAction"
                    parts={ACTION_PARTS}
                    states={[
                        {
                            name: "action set",
                            why: "A control slot grows on the right, pinned `shrink-0` so it never squeezes the text column. The header only reserves the slot and pins it there; the caller decides what the button actually does (§13).",
                            code: `<Section.Header
  title="Khoá của tôi"
  action={<Button.Base label="Xem tất cả" variant="ghost" size="sm" prefixIcon={ArrowRightIcon} />}
/>`,
                            render: (
                                <Section.Header
                                    title="Khoá của tôi"
                                    action={<Button.Base label="Xem tất cả" variant="ghost" size="sm" prefixIcon={ArrowRightIcon} onPress={() => {}} />}
                                    showAnatomy
                                />
                            ),
                        },
                    ]}
                />
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
                    tier="composite"
                    leaf="Full"
                    parts={FULL_PARTS}
                    states={[
                        {
                            name: "eyebrow, title, description, and action all set",
                            why: "All four slots render at once: eyebrow above the title, description below it, and the action pinned to the right, anchored to the TOP of the row (`items-start`). With a three-line text column on the left, the action must anchor at the top or it would drift down to the middle.",
                            code: `<Section.Header
  eyebrow="Fullstack Mastery"
  title="Bài tập đã nộp"
  description="AI chấm trong vài phút; bạn có thể nộp lại tối đa 3 lần."
  action={<Button.Base label="Cấu hình" variant="secondary" size="sm" prefixIcon={GearIcon} />}
/>`,
                            render: (
                                <Section.Header
                                    eyebrow="Fullstack Mastery"
                                    title="Bài tập đã nộp"
                                    description="AI chấm trong vài phút; bạn có thể nộp lại tối đa 3 lần."
                                    action={<Button.Base label="Cấu hình" variant="secondary" size="sm" prefixIcon={GearIcon} onPress={() => {}} />}
                                    showAnatomy
                                />
                            ),
                        },
                    ]}
                />
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
            <div className="max-w-2xl">
                <BlockAnatomy
                    name="Section.Header"
                    tier="composite"
                    leaf="Levels"
                    parts={DESCRIPTION_PARTS}
                    reason="Level picks the Typography size for every line at once, so title, description and eyebrow move together and a header never mixes scales by hand at a single call site."
                    states={[
                        {
                            name: "level = 1",
                            why: "Title renders at `lg` bold and description at `sm`, the largest band a page uses. The tree stays the same as every other level; only the type scale steps up.",
                            code: "<Section.Header level={1} title=\"…\" description=\"…\" />",
                            render: <Section.Header level={1} title="Lộ trình học" description="level 1 — dải lớn nhất của trang." showAnatomy />,
                        },
                        {
                            name: "level = 2 (default)",
                            why: "Title renders at `base` bold and description at `sm`, the scale used for a normal section on the page. This is the level a header takes when the caller passes none.",
                            code: "<Section.Header level={2} title=\"…\" description=\"…\" />",
                            render: <Section.Header level={2} title="Module đang học" description="level 2 — vùng thường (mặc định)." />,
                        },
                        {
                            name: "level = 3",
                            why: "Title renders at `sm` medium and description drops to `xs`, the scale for a sub-section nested under another header. Weight drops from bold to medium too, so a level-3 header never competes with the header above it.",
                            code: "<Section.Header level={3} title=\"…\" description=\"…\" />",
                            render: <Section.Header level={3} title="Bài trong module" description="level 3 — vùng con nằm dưới một header khác." />,
                        },
                    ]}
                />
            </div>
        </div>
    ),
}

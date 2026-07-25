import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowLeftIcon, ArrowRightIcon, FloppyDiskIcon, TrashIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Button.Base`: nút có NHÃN.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — luật của TẦNG ATOM, thầy chốt 2026-07-26).
 * Mỗi prop có hình được một leaf, và leaf đó render ĐỦ giá trị của prop:
 * `variant` · `size` · `icon` · `isDisabled` · `isPending` · `isSkeleton`.
 *
 * ⚠️ Đừng lẫn với §14d.2 (leaf = CẤU TRÚC) — luật đó dành cho design/block/screen.
 * Bản trước của file này viện §14d.2 để nhồi variant + disabled + skeleton vào chung
 * leaf `Default`; ở tầng atom thế là SAI: atom là bảng tra, người đọc đến để xem "prop
 * này làm được gì", nên mỗi prop phải đứng riêng.
 *
 * 🎨 Icon = Phosphor (§5.0). Atom ép cả scale lẫn `weight` theo `size` (§5.0a) —
 * story chỉ chọn "hình gì", không chọn cỡ.
 */
const meta: Meta<typeof Button.Base> = {
    title: "Atoms/Buttons/Button/Button.Base",
    component: Button.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Button.Base>

const LABEL_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "nhãn nút (prop `label`)" },
]
const ICON_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "atom", role: "glyph dẫn đầu — `icon` truyền COMPONENT, atom ép size + weight theo `size`" },
    { name: "Label", tier: "atom", role: "nhãn nút (prop `label`)" },
]
const SUFFIX_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "nhãn nút (prop `label`)" },
    { name: "SuffixIcon", tier: "atom", role: "glyph ĐUÔI — sau nhãn; `iconSlide` cho nó trượt → khi hover (§5b)" },
]
const PENDING_PARTS: Array<AnatomyNode> = [
    { name: "Spinner", tier: "atom", role: "atom tự vẽ (react-aria isPending không tự vẽ) — thay glyph dẫn đầu" },
    { name: "Label", tier: "atom", role: "nhãn nút (prop `label`)" },
]

/** ĐỦ giá trị của union `ButtonVariant` — thiếu một giá trị là giá trị đó sẽ mọc thành leaf lạc chỗ. */
const VARIANTS = [
    { variant: "primary", label: "Lưu bài" },
    { variant: "secondary", label: "Xem trước" },
    { variant: "ghost", label: "Huỷ" },
    { variant: "danger", label: "Xoá" },
    { variant: "danger-soft", label: "Bỏ khỏi danh sách" },
] as const

const SIZES = ["sm", "md", "lg"] as const

/** Leaf TRẦN — chưa bật prop nào, để thấy hình mặc định (`variant="primary"`, `size="md"`). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Nút trần"
                parts={LABEL_PARTS}
                reason="Atom nút DUY NHẤT bọc HeroUI Button. Leaf này là MỐC: mọi leaf dưới đây chỉ khác nó đúng MỘT prop."
                note="Mặc định variant=primary, size=md. Cây DOM tối giản: button > Label."
                code={"<Button.Base label=\"Lưu bài\" />"}
            >
                <Button.Base label="Lưu bài" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `variant` — 4 Ý NGHĨA hành động, render ĐỦ union. */
export const Variants: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `variant`"
                parts={LABEL_PARTS}
                reason="variant = Ý NGHĨA hành động, không phải màu. `danger` map thẳng xuống variant destructive của fork HeroUI, KHÔNG phải prop `color`."
                note="Hai bậc danger: `danger` ĐẶC cho nút chốt của hộp thoại xác nhận · `danger-soft` cho hành động phá huỷ ở ngữ cảnh nhẹ (xoá một dòng trong danh sách). HeroUI không có bản soft nên atom mượn variant trung tính rồi đắp token."
                code={`<Button.Base variant="primary" label="Lưu bài" />
<Button.Base variant="secondary" label="Xem trước" />
<Button.Base variant="ghost" label="Huỷ" />
<Button.Base variant="danger" label="Xoá" />
<Button.Base variant="danger-soft" label="Bỏ khỏi danh sách" />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {VARIANTS.map(({ variant, label }, index) => (
                        <Button.Base key={variant} variant={variant} label={label} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — 3 bậc TỈ LỆ, trục độc lập với `variant` (§12d). */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `size`"
                parts={LABEL_PARTS}
                reason="size = TỈ LỆ, độc lập với variant (§12d). Hộp nút co theo breakpoint container (@app-md), không phải viewport."
                note="Không có prop icon-size: icon suy từ size (§12d) — xem leaf `Icon`."
                code={`<Button.Base size="sm" label="Lưu bài" />
<Button.Base size="md" label="Lưu bài" />   // default
<Button.Base size="lg" label="Lưu bài" />`}
            >
                <div className="flex items-center gap-3">
                    {SIZES.map((size, index) => (
                        <Button.Base key={size} size={size} label="Lưu bài" showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `icon` — glyph DẪN ĐẦU (prefix). Node `Icon` đứng trước `Label`. */
export const Icon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `icon` (dẫn đầu)"
                parts={ICON_PARTS}
                reason="Icon KHÔNG có prop cỡ riêng: atom suy từ `size` theo thang 1:1 font-size (sm/md chữ 14px → size-3.5; lg chữ 16px → size-4) và tự ép weight `bold` vì cả ba bậc đều dưới size-5 (§5.0a)."
                note="icon = COMPONENT (`icon={FloppyDiskIcon}`, KHÔNG phải JSX) — caller chọn hình, atom chọn cỡ + nét. Hàng trên đổi hình, hàng dưới cùng hình đổi size."
                code={`<Button.Base icon={ArrowLeftIcon} label="Quay lại" />
<Button.Base icon={FloppyDiskIcon} label="Lưu" />
<Button.Base size="lg" icon={FloppyDiskIcon} label="Lưu" />`}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button.Base icon={ArrowLeftIcon} label="Quay lại" showAnatomy />
                        <Button.Base icon={FloppyDiskIcon} label="Lưu" />
                        <Button.Base variant="danger" icon={TrashIcon} label="Xoá" />
                    </div>
                    <div className="flex items-center gap-3">
                        {SIZES.map((size) => (
                            <Button.Base key={size} size={size} icon={FloppyDiskIcon} label="Lưu" />
                        ))}
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `suffixIcon` — glyph ĐUÔI. Node `SuffixIcon` đứng SAU `Label`. */
export const SuffixIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `suffixIcon` (đuôi)"
                parts={SUFFIX_PARTS}
                reason="Vị trí glyph mang NGHĨA: dẫn đầu = loại hành động (lưu, xoá) · đuôi = hướng đi tiếp (→, mở ngoài). Không có ô đuôi thì nút “Tiếp tục →” phải chèn tay ở caller — đúng thứ §4 cấm."
                note="Dùng được CẢ HAI cùng lúc (hàng dưới) — atom xếp Icon · Label · SuffixIcon."
                code={`<Button.Base label="Tiếp tục" suffixIcon={ArrowRightIcon} />
<Button.Base icon={FloppyDiskIcon} label="Lưu và tiếp" suffixIcon={ArrowRightIcon} />`}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button.Base label="Tiếp tục" suffixIcon={ArrowRightIcon} showAnatomy />
                        <Button.Base variant="secondary" label="Mở tài liệu" suffixIcon={ArrowRightIcon} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button.Base icon={FloppyDiskIcon} label="Lưu và tiếp" suffixIcon={ArrowRightIcon} />
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `iconSlide` (§5b) — mũi tên TRƯỢT khi hover. Rê chuột mới thấy. */
export const IconSlide: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `iconSlide`"
                parts={SUFFIX_PARTS}
                reason="§5b: mũi tên trượt theo HƯỚNG NGHĨA của nó — prefix lùi ← (quay lại), suffix tiến → (đi tiếp). CHỈ cho mũi tên điều hướng; bật cho caret/glyph tĩnh là gây nhiễu."
                note="Tailwind v4 tách `translate` thành property RIÊNG nên atom dùng `transition-[translate]`, KHÔNG phải `transition-transform` — viết sai thì hover giật cục. ⚠️ Phải RÊ CHUỘT vào nút mới thấy hiệu ứng."
                code={`<Button.Base label="Tiếp tục" suffixIcon={ArrowRightIcon} iconSlide />
<Button.Base icon={ArrowLeftIcon} label="Quay lại" iconSlide />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <Button.Base label="Tiếp tục" suffixIcon={ArrowRightIcon} iconSlide showAnatomy />
                    <Button.Base variant="secondary" icon={ArrowLeftIcon} label="Quay lại" iconSlide />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isDisabled` — khoá press, KHÔNG kèm Spinner (khác `isPending`). */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isDisabled`"
                parts={LABEL_PARTS}
                reason="isDisabled = CHƯA ĐỦ ĐIỀU KIỆN (form invalid, thiếu quyền) — khác `isPending` là ĐANG CHỜ tác vụ. Hai tín hiệu khác nghĩa, không dùng thay nhau."
                note="Forward thẳng xuống HeroUI: khoá press + giảm opacity, KHÔNG có Spinner."
                code={"<Button.Base variant=\"primary\" isDisabled label=\"Lưu bài\" />"}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {VARIANTS.map(({ variant, label }, index) => (
                        <Button.Base key={variant} variant={variant} label={label} isDisabled showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isPending` — Spinner THAY glyph dẫn đầu (không chồng hai tín hiệu cùng chỗ). */
export const Pending: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isPending`"
                parts={PENDING_PARTS}
                reason="react-aria `isPending` KHÔNG tự vẽ spinner — atom phải render tay, nếu không nút im lặng suốt lúc chờ."
                note="Spinner (size=sm, color=current) THAY icon, không đứng cạnh: hai glyph cùng vị trí dẫn đầu là hai tín hiệu chồng nhau. Vì thế nút CÓ icon và nút KHÔNG icon khi pending ra hình y hệt — nên ở đây chỉ đổi `size`, render cả hai là render trùng."
                code={"<Button.Base variant=\"primary\" isPending label=\"Đang lưu…\" />"}
            >
                <div className="flex items-center gap-3">
                    {SIZES.map((size, index) => (
                        <Button.Base key={size} size={size} isPending label="Đang lưu…" showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isSkeleton` — pill shimmer CO-LOCATED, khớp hộp nút từng size (§12c). */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                parts={LABEL_PARTS}
                reason="Chủ của hình là chủ của skeleton (§12c) — atom tự vẽ pill shimmer đúng hộp nút. KHÔNG có component skeleton dùng chung."
                note="Chiều rộng shimmer bám theo `size` để hàng nút không nhảy khi dữ liệu về."
                code={`<Button.Base isSkeleton />
<Button.Base size="lg" isSkeleton />`}
            >
                <div className="flex items-center gap-3">
                    {SIZES.map((size) => (
                        <Button.Base key={size} size={size} isSkeleton />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

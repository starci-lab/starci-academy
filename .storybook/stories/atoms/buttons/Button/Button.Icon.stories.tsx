import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Button.Icon`: nút CHỈ-icon (a11y qua `ariaLabel`).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — luật của TẦNG ATOM): `variant` · `size` · `icon` ·
 * `isDisabled` · `isPending` · `isSkeleton`, mỗi prop một leaf, render đủ giá trị.
 *
 * ⚠️ Bản trước viện §14d.2 (leaf = cấu trúc) để gộp size + disabled + skeleton vào
 * chung `Default` — luật đó là của design/block/screen, không phải atom.
 *
 * 🎨 Icon = Phosphor (§5.0). Atom ép scale + `weight` theo `size` (§5.0a).
 */
const meta: Meta<typeof Button.Icon> = {
    title: "Atoms/Buttons/Button/Button.Icon",
    component: Button.Icon,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Button.Icon>

const ICON_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "atom", role: "glyph duy nhất — `icon` truyền COMPONENT, atom ép size + weight theo `size`" },
]
const PENDING_PARTS: Array<AnatomyNode> = [
    { name: "Spinner", tier: "atom", role: "atom tự vẽ, thay icon khi isPending + khoá press" },
]

const SIZES = ["sm", "md", "lg"] as const

/** ĐỦ giá trị union `ButtonVariant`. */
const VARIANTS = [
    { variant: "primary", ariaLabel: "Thêm mục" },
    { variant: "secondary", ariaLabel: "Xem trước" },
    { variant: "ghost", ariaLabel: "Huỷ" },
    { variant: "danger", ariaLabel: "Xoá" },
] as const

/** Leaf TRẦN — mốc so sánh: `variant="primary"`, `size="md"`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Nút chỉ-icon trần"
                parts={ICON_PARTS}
                reason="Nút CHỈ-icon: `icon` = component reference, atom sở hữu glyph scale + nét (§4/§5). KHÔNG có nhãn nhìn thấy nên `ariaLabel` là BẮT BUỘC — thiếu nó nút câm với screen-reader."
                note="Cây DOM tối giản: button > Icon. Mọi leaf dưới chỉ khác leaf này đúng MỘT prop."
                code={"<Button.Icon icon={PlusIcon} ariaLabel=\"Thêm mục\" />"}
            >
                <Button.Icon icon={PlusIcon} ariaLabel="Thêm mục" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `variant` — 4 ý nghĩa hành động. */
export const Variants: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Prop `variant`"
                parts={ICON_PARTS}
                reason="variant = Ý NGHĨA hành động, không phải màu — giống `Button.Base`, một trục dùng chung cả họ Button."
                note={"Nút chỉ-icon dễ mơ hồ hơn nút có nhãn, nên `danger` ở đây càng cần `ariaLabel` nói rõ hành động (\"Xoá\" chứ không phải \"Nút\")."}
                code={`<Button.Icon variant="primary" icon={PlusIcon} ariaLabel="Thêm mục" />
<Button.Icon variant="danger" icon={TrashIcon} ariaLabel="Xoá" />`}
            >
                <div className="flex items-center gap-3">
                    {VARIANTS.map(({ variant, ariaLabel }, index) => (
                        <Button.Icon
                            key={variant}
                            variant={variant}
                            icon={variant === "danger" ? TrashIcon : PlusIcon}
                            ariaLabel={ariaLabel}
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — box to theo size, glyph vẫn bám FONT. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Prop `size`"
                parts={ICON_PARTS}
                reason="Glyph bám FONT y như nút có nhãn — MỘT luật, không có thang riêng theo box: sm/md (chữ 14px) → size-3.5 · lg (chữ 16px) → size-4. Cả ba đều dưới size-5 nên weight `bold` (§5.0a). Box thì vẫn to theo size (size-9/10/11)."
                note="Vì thế nút sm và md có glyph BẰNG NHAU, chỉ khác hộp — đúng ý đồ, không phải lỗi."
                code={`<Button.Icon size="sm" icon={PlusIcon} ariaLabel="Thêm mục" />
<Button.Icon size="md" icon={PlusIcon} ariaLabel="Thêm mục" />   // default
<Button.Icon size="lg" icon={PlusIcon} ariaLabel="Thêm mục" />`}
            >
                <div className="flex items-center gap-3">
                    {SIZES.map((size, index) => (
                        <Button.Icon
                            key={size}
                            size={size}
                            icon={PlusIcon}
                            ariaLabel={`Thêm mục (${size})`}
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `icon` — cùng hộp, đổi glyph. */
export const Icon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Prop `icon`"
                parts={ICON_PARTS}
                reason="`icon` nhận COMPONENT (`icon={PlusIcon}`), KHÔNG phải JSX — caller chọn hình, atom chọn cỡ + nét. Truyền JSX là caller giành mất quyền ép size của atom."
                note="`ariaLabel` phải đổi THEO glyph: cùng một hộp nhưng bốn hành động khác nhau."
                code={`<Button.Icon icon={ArrowLeftIcon} ariaLabel="Quay lại" />
<Button.Icon icon={ArrowRightIcon} ariaLabel="Tiếp tục" />
<Button.Icon icon={TrashIcon} ariaLabel="Xoá" />`}
            >
                <div className="flex items-center gap-3">
                    <Button.Icon icon={ArrowLeftIcon} ariaLabel="Quay lại" showAnatomy />
                    <Button.Icon icon={ArrowRightIcon} ariaLabel="Tiếp tục" />
                    <Button.Icon icon={PlusIcon} ariaLabel="Thêm mục" />
                    <Button.Icon icon={TrashIcon} ariaLabel="Xoá" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isDisabled` — khoá press, KHÔNG Spinner. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Prop `isDisabled`"
                parts={ICON_PARTS}
                reason="isDisabled = CHƯA ĐỦ ĐIỀU KIỆN, khác `isPending` = ĐANG CHỜ. Hai tín hiệu khác nghĩa."
                note="Forward thẳng xuống HeroUI: khoá press + giảm opacity, không đổi node."
                code={"<Button.Icon icon={PlusIcon} ariaLabel=\"Thêm mục\" isDisabled />"}
            >
                <div className="flex items-center gap-3">
                    {VARIANTS.map(({ variant, ariaLabel }, index) => (
                        <Button.Icon
                            key={variant}
                            variant={variant}
                            icon={variant === "danger" ? TrashIcon : PlusIcon}
                            ariaLabel={ariaLabel}
                            isDisabled
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isPending` — Spinner THAY icon. */
export const Pending: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Prop `isPending`"
                parts={PENDING_PARTS}
                reason="react-aria `isPending` KHÔNG tự vẽ spinner — atom render tay, nếu không nút im lặng suốt lúc chờ."
                note="Spinner THAY icon (nút chỉ có một ô glyph, không chỗ đứng cạnh) + khoá press."
                code={"<Button.Icon icon={PlusIcon} ariaLabel=\"Thêm mục\" isPending />"}
            >
                <div className="flex items-center gap-3">
                    {SIZES.map((size, index) => (
                        <Button.Icon
                            key={size}
                            size={size}
                            icon={PlusIcon}
                            ariaLabel={`Đang thêm (${size})`}
                            isPending
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isSkeleton` — shimmer vuông khớp hộp iconOnly (§12c). */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Prop `isSkeleton`"
                parts={ICON_PARTS}
                reason="Chủ của hình là chủ của skeleton (§12c) — atom tự vẽ shimmer đúng hộp vuông của nút chỉ-icon, KHÔNG dùng component skeleton chung."
                note="Hộp vuông theo `size` để hàng nút không nhảy khi dữ liệu về."
                code={`<Button.Icon icon={PlusIcon} ariaLabel="Thêm mục" isSkeleton />
<Button.Icon size="lg" icon={PlusIcon} ariaLabel="Thêm mục" isSkeleton />`}
            >
                <div className="flex items-center gap-3">
                    {SIZES.map((size) => (
                        <Button.Icon key={size} size={size} icon={PlusIcon} ariaLabel={`Thêm mục (${size})`} isSkeleton />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

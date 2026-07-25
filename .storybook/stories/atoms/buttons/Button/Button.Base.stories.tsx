import type { Meta, StoryObj } from "@storybook/nextjs"
import { FloppyDisk } from "@gravity-ui/icons"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Button.Base> = {
    title: "Atoms/Buttons/Button/Button.Base",
    component: Button.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Button.Base>

// LEAF = composition (theo prop). Mỗi state/variant = 1 export, anatomy đúng parts của nó.
const LABEL_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "nhãn nút (prop `label`)" },
]
const PENDING_PARTS: Array<AnatomyNode> = [
    { name: "Spinner", tier: "atom", role: "atom tự vẽ (react-aria isPending không tự vẽ) — trước nhãn" },
    { name: "Label", tier: "atom", role: "nhãn nút (prop `label`)" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton pill do atom tự sở hữu (khớp box nút)" },
]
const ICON_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "atom", role: "glyph dẫn đầu — `icon` truyền COMPONENT, atom ép size-4 (khớp nhãn)" },
    { name: "Label", tier: "atom", role: "nhãn nút (prop `label`)" },
]

/** Sizes — `size` là TRỤC RIÊNG với `variant`; icon TỰ SUY theo size (bám font). */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Sizes"
                parts={ICON_PARTS}
                reason="variant = Ý NGHĨA, size = TỈ LỆ — hai trục độc lập. Icon KHÔNG có prop riêng: suy từ size theo luật gravity 'size icon = size chữ' (sm/md chữ 14px → size-3.5; lg chữ 16px → size-4)."
                code={`<Button.Base size="sm" icon={FloppyDisk} label="Lưu" />
<Button.Base size="md" icon={FloppyDisk} label="Lưu" />   // default
<Button.Base size="lg" icon={FloppyDisk} label="Lưu" />`}
            >
                <div className="flex items-center gap-3">
                    <Button.Base size="sm" icon={FloppyDisk} label="Lưu" showAnatomy />
                    <Button.Base size="md" icon={FloppyDisk} label="Lưu" />
                    <Button.Base size="lg" icon={FloppyDisk} label="Lưu" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithIcon — `icon` nằm NGAY trong Base (component reference); Spinner sẽ thay glyph khi pending. */
export const WithIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="WithIcon"
                parts={ICON_PARTS}
                note="icon = COMPONENT (`icon={FloppyDisk}`, không JSX) — atom ép size-4; glyph-duy-nhất của Button.Icon to hơn (size-5)."
                code={`<Button.Base variant="primary" icon={FloppyDisk} label="Lưu bài" />`}
            >
                <Button.Base variant="primary" icon={FloppyDisk} label="Lưu bài" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Primary — action chính; `variant` mặc định. */
export const Primary: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Primary"
                parts={LABEL_PARTS}
                reason="Atom nút DUY NHẤT bọc HeroUI Button; biến thể thị giác phân bằng prop `variant` → leaf = composition."
                code={`<Button.Base variant="primary" label="Lưu bài" />`}
            >
                <Button.Base variant="primary" label="Lưu bài" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Secondary — action phụ. */
export const Secondary: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Secondary"
                parts={LABEL_PARTS}
                note="variant=secondary — action ngang hàng/ít nhấn hơn primary."
                code={`<Button.Base variant="secondary" label="Xem trước" />`}
            >
                <Button.Base variant="secondary" label="Xem trước" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Ghost — action nền phẳng (toolbar/inline). */
export const Ghost: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Ghost"
                parts={LABEL_PARTS}
                note="variant=ghost — nền phẳng, dùng cho action nhẹ/inline."
                code={`<Button.Base variant="ghost" label="Huỷ" />`}
            >
                <Button.Base variant="ghost" label="Huỷ" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Danger — action phá huỷ (xoá/undo). */
export const Danger: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Danger"
                parts={LABEL_PARTS}
                note="variant=danger — map thẳng xuống HeroUI variant destructive (không phải color prop)."
                code={`<Button.Base variant="danger" label="Xoá" />`}
            >
                <Button.Base variant="danger" label="Xoá" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled — khoá tương tác. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Disabled"
                parts={LABEL_PARTS}
                note="isDisabled → forward xuống HeroUI (khoá press, giảm opacity)."
                code={`<Button.Base variant="primary" isDisabled label="Lưu bài" />`}
            >
                <Button.Base variant="primary" isDisabled label="Lưu bài" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Pending — BUSY: atom tự chèn Spinner + khoá press. */
export const Pending: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Pending"
                parts={PENDING_PARTS}
                note="isPending → atom render TAY <Spinner size=sm color=current> (react-aria không tự vẽ) + khoá press."
                code={`<Button.Base variant="primary" isPending label="Đang lưu…" />`}
            >
                <Button.Base variant="primary" isPending label="Đang lưu…" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton pill; không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → pill shimmer OWNED bởi atom (hybrid C), khớp box nút."
                code={`<Button.Base isSkeleton label="Lưu bài" />`}
            >
                <Button.Base isSkeleton label="Lưu bài" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

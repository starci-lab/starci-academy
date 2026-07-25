import type { Meta, StoryObj } from "@storybook/nextjs"
import { Plus } from "@gravity-ui/icons"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Button.Icon> = {
    title: "Atoms/Buttons/Button/Button.Icon",
    component: Button.Icon,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Button.Icon>

const ICON_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "atom", role: "glyph duy nhất — `icon` truyền COMPONENT, atom ép scale theo `size` (bám font)" },
]
const PENDING_PARTS: Array<AnatomyNode> = [
    { name: "Spinner", tier: "atom", role: "atom tự vẽ, thay icon khi isPending + khoá press" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton VUÔNG do atom tự sở hữu (khớp box iconOnly)" },
]

/** Default — nút chỉ-icon; `ariaLabel` bắt buộc cho a11y. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Default"
                parts={ICON_PARTS}
                reason="Nút CHỈ-icon: `icon` = component reference, atom sở hữu glyph scale (§4/§5) — a11y qua `ariaLabel`."
                code={"<Button.Icon icon={Plus} ariaLabel=\"Thêm mục\" />"}
            >
                <Button.Icon icon={Plus} ariaLabel="Thêm mục" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Sizes — glyph bám FONT y như nút có nhãn (MỘT luật, không thang riêng theo box). */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Sizes"
                parts={ICON_PARTS}
                reason="Thầy chốt: nút chỉ-icon vẫn bám FONT như icon kèm nhãn — sm/md (chữ 14px) → size-3.5, lg (chữ 16px) → size-4. Box vẫn to theo size (h-8/9/10)."
                code={`<Button.Icon size="sm" icon={Plus} ariaLabel="Thêm mục" />
<Button.Icon size="md" icon={Plus} ariaLabel="Thêm mục" />   // default
<Button.Icon size="lg" icon={Plus} ariaLabel="Thêm mục" />`}
            >
                <div className="flex items-center gap-3">
                    <Button.Icon size="sm" icon={Plus} ariaLabel="Thêm mục (sm)" showAnatomy />
                    <Button.Icon size="md" icon={Plus} ariaLabel="Thêm mục (md)" />
                    <Button.Icon size="lg" icon={Plus} ariaLabel="Thêm mục (lg)" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled — khoá tương tác. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Disabled"
                parts={ICON_PARTS}
                note="isDisabled → forward xuống HeroUI (khoá press, giảm opacity)."
                code={"<Button.Icon icon={Plus} ariaLabel=\"Thêm mục\" isDisabled />"}
            >
                <Button.Icon icon={Plus} ariaLabel="Thêm mục" isDisabled showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton vuông; không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → square shimmer OWNED bởi atom (hybrid C), khớp box iconOnly."
                code={"<Button.Icon icon={Plus} ariaLabel=\"Thêm mục\" isSkeleton />"}
            >
                <Button.Icon icon={Plus} ariaLabel="Thêm mục" isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Pending — BUSY: Spinner thay icon + khoá press. */
export const Pending: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Icon"
                tier="atom"
                leaf="Pending"
                parts={PENDING_PARTS}
                note="isPending → atom render Spinner THAY icon + khoá press (react-aria không tự vẽ)."
                code={"<Button.Icon icon={Plus} ariaLabel=\"Thêm mục\" isPending />"}
            >
                <Button.Icon icon={Plus} ariaLabel="Thêm mục" isPending showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

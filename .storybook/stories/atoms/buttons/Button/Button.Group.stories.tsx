import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrashIcon, FloppyDiskIcon } from "@phosphor-icons/react"
import { Button, type ButtonGroupItem, type ButtonSize } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `Button.Group` KHÔNG đẻ nghĩa mới — nó
 * chỉ layout + dựng lại `Button.Base`/`Button.Icon` từ `items`. Nên story ở đây
 * CHỈ render state THUỘC VỀ CỤM: mapping items · `size` cấp cụm · skeleton cả cụm.
 * Các state của TỪNG NÚT (WithIcon · Pending · Disabled · variant) sống ở story
 * `Button.Base`/`Button.Icon` — KHÔNG lặp lại ở đây.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — tầng atom): `items` · `size` · `isSkeleton`, mỗi prop
 * một leaf. Đây là bộ prop ĐẦY ĐỦ của cụm — ít hơn `Button.Base` vì §12f: prop nào chỉ
 * chuyển tiếp xuống từng nút (`variant`/`icon`/`isPending`/`isDisabled`) thì thuộc về
 * `Button.Base`, cụm KHÔNG được mở leaf cho chúng.
 *
 * ⚠️ Bản trước viện §14d.2 để gộp cả ba vào một leaf — luật đó của design/block/screen.
 *
 * 🎨 Icon = Phosphor (§5.0); nét do atom ép theo `size` cụm (§5.0a).
 */
const meta: Meta<typeof Button.Group> = {
    title: "Atoms/Buttons/Button/Button.Group",
    component: Button.Group,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Button.Group>

const GROUP_PARTS: Array<AnatomyNode> = [
    {
        name: "Group",
        tier: "atom",
        role: "cluster layout — xếp hàng nút từ `items` (gap §10), KHÔNG đẻ nghĩa mới (§4)",
        children: [
            { name: "Label", tier: "atom", role: "nhãn item có `label` (dựng Button.Base)" },
            { name: "Icon", tier: "atom", role: "glyph item (leading khi có nhãn; duy nhất khi không)" },
        ],
    },
]

/** Ba bậc tỉ lệ — `size` đặt ở CẤP CỤM, item chỉ mang vai trò/hành vi. */
const SIZES: Array<ButtonSize> = ["sm", "md", "lg"]

/** Cùng một bộ `items` cho mọi hàng — khác nhau chỉ là prop của CỤM. */
const items = (suffix: string): Array<ButtonGroupItem> => [
    { key: "cancel", label: "Huỷ", variant: "ghost" },
    { key: "save", label: "Lưu", icon: FloppyDiskIcon, variant: "primary" },
    { key: "delete", icon: TrashIcon, ariaLabel: `Xoá ${suffix}`, variant: "danger" },
]

/** Leaf prop `items` — cụm dựng từ DỮ LIỆU; item không có `label` thành nút chỉ-icon. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Group"
                tier="atom"
                leaf="Prop `items`"
                parts={GROUP_PARTS}
                reason="Group = CLUSTER thuần layout; `items` là DỮ LIỆU (§4 STRICT — caller không truyền JSX con nên không lắp sai cấu trúc/size). Item không có `label` → nút chỉ-icon."
                note="Mỗi item tự chọn `variant`/`icon` của nó, nhưng đó là prop của Button.Base — xem leaf tương ứng bên đó, cụm không lặp lại (§12f)."
                code={`<Button.Group
  items={[
    { key: "cancel", label: "Huỷ", variant: "ghost" },
    { key: "save", label: "Lưu", icon: FloppyDiskIcon, variant: "primary" },
    { key: "delete", icon: TrashIcon, ariaLabel: "Xoá", variant: "danger" },
  ]}
/>`}
            >
                <Button.Group items={items("(mặc định)")} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — đặt ở CẤP CỤM: hàng nút luôn đồng cỡ (§12d). */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Group"
                tier="atom"
                leaf="Prop `size`"
                parts={GROUP_PARTS}
                reason="Cụm luôn ĐỒNG CỠ nên `size` đặt ở group, KHÔNG ở từng item (§12d) — mở size cho item là cho phép dựng hàng nút cao thấp lệch nhau."
                note="Size cụm ép xuống cả hộp nút lẫn glyph của từng item."
                code={`<Button.Group size="sm" items={[…]} />
<Button.Group items={[…]} />          // md = default
<Button.Group size="lg" items={[…]} />`}
            >
                <div className="flex flex-col items-start gap-4">
                    {SIZES.map((size, index) => (
                        <Button.Group
                            key={size}
                            size={size}
                            items={items(`(${size})`)}
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isSkeleton` — bật ở cấp cụm, từng item tự vẽ shimmer của mình. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Group"
                tier="atom"
                leaf="Prop `isSkeleton`"
                parts={GROUP_PARTS}
                reason="Cụm chỉ CHUYỂN cờ xuống; mỗi item tự vẽ skeleton của chính nó (§12c) — nút có nhãn ra pill dài, nút chỉ-icon ra ô vuông."
                note="Footprint hàng nút giữ nguyên nên layout không nhảy khi dữ liệu về."
                code={"<Button.Group isSkeleton items={[…3 item…]} />"}
            >
                <div className="flex flex-col items-start gap-4">
                    {SIZES.map((size) => (
                        <Button.Group key={size} size={size} isSkeleton items={items(`(${size})`)} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

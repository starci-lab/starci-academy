import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrashBin, FloppyDisk } from "@gravity-ui/icons"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `Button.Group` KHÔNG đẻ nghĩa mới — nó
 * chỉ layout + dựng lại `Button.Base`/`Button.Icon` từ `items`. Nên story ở đây
 * CHỈ render state THUỘC VỀ CỤM: mapping items · `size` cấp cụm · skeleton cả cụm.
 * Các state của TỪNG NÚT (WithIcon · Pending · Disabled · variant) sống ở story
 * `Button.Base`/`Button.Icon` — KHÔNG lặp lại ở đây.
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
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Group", tier: "atom", role: "cluster giữ nguyên footprint", children: [{ name: "Skeleton", tier: "atom", role: "pill/vuông mirror từng item" }] },
]

/** Default — mapping `items`: item có `label` → nút nhãn; không `label` → nút chỉ-icon. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Group"
                tier="atom"
                leaf="Default"
                parts={GROUP_PARTS}
                reason="Group = CLUSTER thuần layout; `items` là DỮ LIỆU (§4 STRICT — caller không truyền JSX con nên không lắp sai cấu trúc/size). Item không có `label` → nút chỉ-icon."
                code={`<Button.Group
  items={[
    { key: "cancel", label: "Huỷ", variant: "ghost" },
    { key: "save", label: "Lưu", icon: FloppyDisk, variant: "primary" },
    { key: "delete", icon: TrashBin, ariaLabel: "Xoá", variant: "danger" },
  ]}
/>`}
            >
                <Button.Group
                    showAnatomy
                    items={[
                        { key: "cancel", label: "Huỷ", variant: "ghost" },
                        { key: "save", label: "Lưu", icon: FloppyDisk, variant: "primary" },
                        { key: "delete", icon: TrashBin, ariaLabel: "Xoá", variant: "danger" },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Sizes — `size` ở CẤP CỤM (cluster luôn đồng cỡ), item chỉ mang vai trò/hành vi. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Group"
                tier="atom"
                leaf="Sizes"
                parts={GROUP_PARTS}
                reason="Cụm nút luôn ĐỒNG CỠ nên `size` đặt ở group, không ở từng item — đây là prop RIÊNG của cụm (member không có)."
                code={`<Button.Group size="sm" items={[…]} />
<Button.Group size="md" items={[…]} />   // default
<Button.Group size="lg" items={[…]} />`}
            >
                <div className="flex flex-col items-start gap-3">
                    <Button.Group
                        showAnatomy
                        size="sm"
                        items={[
                            { key: "cancel", label: "Huỷ", variant: "ghost" },
                            { key: "save", label: "Lưu", icon: FloppyDisk, variant: "primary" },
                            { key: "delete", icon: TrashBin, ariaLabel: "Xoá (sm)", variant: "danger" },
                        ]}
                    />
                    <Button.Group
                        size="md"
                        items={[
                            { key: "cancel", label: "Huỷ", variant: "ghost" },
                            { key: "save", label: "Lưu", icon: FloppyDisk, variant: "primary" },
                            { key: "delete", icon: TrashBin, ariaLabel: "Xoá (md)", variant: "danger" },
                        ]}
                    />
                    <Button.Group
                        size="lg"
                        items={[
                            { key: "cancel", label: "Huỷ", variant: "ghost" },
                            { key: "save", label: "Lưu", icon: FloppyDisk, variant: "primary" },
                            { key: "delete", icon: TrashBin, ariaLabel: "Xoá (lg)", variant: "danger" },
                        ]}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — skeleton mirror CẢ CỤM: đúng số nút + đúng hình từng nút (pill / vuông). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Group"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton ở cấp cụm → mỗi item tự vẽ skeleton của chính nó (hybrid C); footprint hàng nút giữ nguyên nên không nhảy layout."
                code={"<Button.Group isSkeleton items={[…3 item…]} />"}
            >
                <Button.Group
                    showAnatomy
                    isSkeleton
                    items={[
                        { key: "cancel", label: "Huỷ", variant: "ghost" },
                        { key: "save", label: "Lưu", variant: "primary" },
                        { key: "delete", icon: TrashBin, ariaLabel: "Xoá", variant: "danger" },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

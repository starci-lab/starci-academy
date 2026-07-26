import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrashIcon, FloppyDiskIcon } from "@phosphor-icons/react"
import { Button, type ButtonGroupItem, type ButtonSize } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `Button.Group` KHÔNG đẻ nghĩa mới — nó
 * chỉ layout + `import { ButtonBase }` rồi dựng lại từ `items`. Nên story ở đây CHỈ
 * render state THUỘC VỀ CỤM: mapping items · `size` cấp cụm · skeleton cả cụm.
 * Các state của TỪNG NÚT (prefixIcon · Pending · Disabled · variant) sống ở story
 * `Button.Base` — KHÔNG lặp lại ở đây.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — tầng atom): `items` · `size` · `isSkeleton`, mỗi prop
 * một leaf. Đây là bộ prop ĐẦY ĐỦ của cụm — ít hơn `Button.Base` vì §12f: prop nào chỉ
 * chuyển tiếp xuống từng nút (`variant`/`prefixIcon`/`isPending`/`isDisabled`) thì thuộc
 * về `Button.Base`, cụm KHÔNG được mở leaf cho chúng.
 *
 * ⚠️ Bản trước viện §14d.2 để gộp cả ba vào một leaf — luật đó của design/block/screen.
 *
 * 🧮 **Tab States**: bảng phủ chỉ khai giá trị của prop SỞ HỮU leaf. Hệ quả của §12f —
 * bảng của cụm cũng không được liệt kê giá trị `variant`/`isPending` của item, dù item
 * mang chúng: chúng có nhà ở `Button.Base`, kê lại là kể hai lần.
 *
 * ✍️ Chữ hiện trên panel (`leaf`/`reason`/`note`/`role`/`hint`/`code`) và nhãn demo
 * trong khung render viết TIẾNG ANH; JSDoc/comment giữ tiếng Việt, neo § nằm ở đây.
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

/**
 * DEPS = story KHÁC mà cụm này dựa vào (thầy chốt 2026-07-26). CHỈ liệt kê component
 * có story riêng — `Label`/`Icon`/`Spinner` là span BÊN TRONG atom, không có story nên
 * không phải deps. `Button.Base` để deps RỖNG (nó bọc thẳng HeroUI); cụm này thì CÓ,
 * và là component duy nhất trong họ có deps.
 *
 * Chỉ MỘT node: từ 2026-07-26 `Button.Icon` đã xoá, item không nhãn cũng là
 * `ButtonBase` với `isIconOnly`.
 */
const GROUP_PARTS: Array<AnatomyNode> = [
    {
        name: "Button.Base",
        tier: "atom",
        role: "the group imports it and rebuilds one per item — with a label it's a normal button, without one it's icon-only",
        storyId: "atoms-buttons-button-button-base--default",
    },
]

/** Ba bậc tỉ lệ — `size` đặt ở CẤP CỤM, item chỉ mang vai trò/hành vi. */
const SIZES: Array<ButtonSize> = ["sm", "md", "lg"]

/** Cùng một bộ `items` cho mọi hàng — khác nhau chỉ là prop của CỤM. */
const items = (suffix: string): Array<ButtonGroupItem> => [
    { key: "cancel", label: "Cancel", variant: "ghost" },
    { key: "save", label: "Save", prefixIcon: FloppyDiskIcon, variant: "primary" },
    { key: "delete", prefixIcon: TrashIcon, ariaLabel: `Delete ${suffix}`, variant: "danger" },
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
                reason="The group is a cluster — layout and nothing else. `items` is data, not JSX children, so a caller can't wire up the wrong structure or a mismatched size. An item with no `label` comes out as an icon-only button."
                note="Each item picks its own variant and icon, but those belong to Button.Base — read them in that story; the cluster doesn't repeat them."
                states={[
                    {
                        value: "{ key, label, variant }",
                        hint: "With a label: a normal button.",
                        rendered: true,
                    },
                    {
                        value: "{ key, prefixIcon, ariaLabel }",
                        hint: "No label: an icon-only button.",
                        rendered: true,
                    },
                ]}
                code={`<Button.Group
  items={[
    { key: "cancel", label: "Cancel", variant: "ghost" },
    { key: "save", label: "Save", prefixIcon: FloppyDiskIcon, variant: "primary" },
    { key: "delete", prefixIcon: TrashIcon, ariaLabel: "Delete", variant: "danger" },
  ]}
/>`}
            >
                <Button.Group items={items("(default)")} showAnatomy />
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
                reason="A cluster is always one size, so `size` sits on the group, never on an item — putting it on items would let anyone build a row of buttons at mismatched heights."
                note="The group size flows down to both the button box and the glyph of every item."
                states={[
                    { value: "sm", hint: "Dense toolbars.", rendered: true },
                    { value: "md", hint: "Default.", rendered: true },
                    { value: "lg", hint: "Roomy footers and dialogs.", rendered: true },
                ]}
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
                reason="The group only passes the flag down; every item draws its own shimmer — a pill for a labelled button, a square for an icon-only one."
                note="The row keeps its footprint, so nothing shifts when the data lands."
                states={[
                    {
                        value: "isSkeleton",
                        hint: "Flag goes down to every item.",
                        rendered: true,
                    },
                    {
                        value: "isSkeleton on a labelled item",
                        hint: "Shimmers as a pill.",
                        rendered: true,
                    },
                    {
                        value: "isSkeleton on an icon-only item",
                        hint: "Shimmers as a square.",
                        rendered: true,
                    },
                    {
                        value: "isSkeleton + size=\"sm|md|lg\"",
                        hint: "Boxes follow the group size.",
                        rendered: true,
                    },
                ]}
                code={"<Button.Group isSkeleton items={[…3 items…]} />"}
            >
                <div className="flex flex-col items-start gap-4">
                    {SIZES.map((size) => (
                        <Button.Group
                            key={size}
                            size={size}
                            isSkeleton
                            items={items(`(${size})`)}
                            // Skeleton VẪN đi qua ButtonBase (cụm chỉ chuyển cờ xuống) nên
                            // phải bật showAnatomy ở đây, không thì cây báo "0 part" và
                            // trông như cụm tự vẽ shimmer — sai hẳn nguồn.
                            showAnatomy={size === "sm"}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

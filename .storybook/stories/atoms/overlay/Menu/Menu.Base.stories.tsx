import type { Meta, StoryObj } from "@storybook/nextjs"
import { CaretDownIcon, CopyIcon, GearIcon, PencilSimpleIcon, SignOutIcon, TrashIcon, UserIcon } from "@phosphor-icons/react"
import { Menu } from "@sb-components/atoms/overlay/Menu/Menu"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Menu.Base> = {
    title: "Atoms/Overlay/Menu/Menu.Base",
    component: Menu.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Menu.Base>

// Trigger (Button) nằm TRONG render-box (được badge); Popover/Menu/Item portal ra body →
// chỉ hiện ở legend + Cây.
const FLAT_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "atom", role: "nút mở menu (DropdownTrigger + Button) — prop `triggerLabel`" },
    { name: "Popover", tier: "atom", role: "surface menu (DropdownPopover), portal ra body" },
    { name: "Menu", tier: "atom", role: "danh sách (DropdownMenu) — onAction(key)" },
    { name: "Item", tier: "atom", role: "một dòng chọn (DropdownItem) — từ `items`" },
]
const ICON_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "atom", role: "nút mở menu (DropdownTrigger + Button) — prop `triggerLabel`" },
    { name: "Popover", tier: "atom", role: "surface menu (DropdownPopover), portal ra body" },
    { name: "Menu", tier: "atom", role: "danh sách (DropdownMenu) — onAction(key)" },
    { name: "Item", tier: "atom", role: "dòng chọn có `icon` (COMPONENT phosphor, size-4)" },
]
const SECTION_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "atom", role: "nút mở menu (DropdownTrigger + Button) — prop `triggerLabel`" },
    { name: "Popover", tier: "atom", role: "surface menu (DropdownPopover), portal ra body" },
    { name: "Menu", tier: "atom", role: "danh sách (DropdownMenu) — onAction(key)" },
    { name: "Section", tier: "atom", role: "nhóm dòng (DropdownSection) — từ `sections`" },
    { name: "SectionHeader", tier: "atom", role: "tiêu đề nhóm (react-aria Header) — `section.title`" },
    { name: "Item", tier: "atom", role: "một dòng chọn trong nhóm (DropdownItem)" },
]
const DISABLED_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "atom", role: "nút mở menu (DropdownTrigger + Button) — prop `triggerLabel`" },
    { name: "Popover", tier: "atom", role: "surface menu (DropdownPopover), portal ra body" },
    { name: "Menu", tier: "atom", role: "danh sách (DropdownMenu) — onAction(key)" },
    { name: "Item", tier: "atom", role: "dòng chọn bình thường (DropdownItem)" },
    { name: "Item.Disabled", tier: "atom", role: "dòng không chọn được (`isDisabled`) — mờ, không onAction" },
]
const TRIGGER_ICON_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "atom", role: "nút mở menu (DropdownTrigger + Button) — prop `triggerLabel`" },
    { name: "TriggerIcon", tier: "atom", role: "glyph dẫn đầu trigger (`triggerIcon` COMPONENT) — atom ép size-3.5" },
    { name: "Popover", tier: "atom", role: "surface menu (DropdownPopover), portal ra body" },
    { name: "Menu", tier: "atom", role: "danh sách (DropdownMenu) — onAction(key)" },
    { name: "Item", tier: "atom", role: "một dòng chọn (DropdownItem) — từ `items`" },
]

/** Default — danh sách phẳng, không icon. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="Default"
                parts={FLAT_PARTS}
                reason="Atom menu DUY NHẤT bọc HeroUI Dropdown; consumer truyền DỮ LIỆU (items/sections + triggerLabel), atom dựng Item + sở hữu layout/icon-scale."
                note="defaultOpen pin menu mở khi load để soi. `items` phẳng, chọn → onAction(key). Nhãn nút đi bằng `triggerLabel` — atom KHÔNG nhận children."
                code={"<Menu.Base triggerLabel=\"Tài khoản\" items={[{ key: \"profile\", label: \"Hồ sơ\" }, …]} onAction={fn} />"}
            >
                <div className="flex justify-center py-4">
                    <Menu.Base
                        triggerLabel="Tài khoản"
                        ariaLabel="Tài khoản"
                        defaultOpen
                        showAnatomy
                        onAction={() => {}}
                        items={[
                            { key: "profile", label: "Hồ sơ của tôi" },
                            { key: "billing", label: "Thanh toán" },
                            { key: "settings", label: "Cài đặt" },
                        ]}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithIcons — mỗi dòng có leading icon (COMPONENT phosphor `*Icon`). */
export const WithIcons: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="WithIcons"
                parts={ICON_PARTS}
                note="`icon` truyền COMPONENT phosphor (`GearIcon`, §5⃣0), atom ép size-4 + weight (§5⃣0a) — story KHÔNG truyền `weight`. Dùng icon khi nó tải nghĩa/hành động rõ."
                code={"<Menu.Base triggerLabel=\"Thao tác\" items={[{ key: \"edit\", label: \"Sửa\", icon: PencilSimpleIcon }, …]} />"}
            >
                <div className="flex justify-center py-4">
                    <Menu.Base
                        triggerLabel="Thao tác"
                        ariaLabel="Thao tác"
                        defaultOpen
                        showAnatomy
                        onAction={() => {}}
                        items={[
                            { key: "edit", label: "Sửa", icon: PencilSimpleIcon },
                            { key: "duplicate", label: "Nhân bản", icon: CopyIcon },
                            { key: "settings", label: "Cài đặt", icon: GearIcon },
                            { key: "delete", label: "Xoá", icon: TrashIcon },
                        ]}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithTriggerIcon — nhãn nút kèm glyph dẫn đầu (prop `triggerIcon`). */
export const WithTriggerIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="WithTriggerIcon"
                parts={TRIGGER_ICON_PARTS}
                note="`triggerIcon` là COMPONENT phosphor (`*Icon`, §5⃣0); atom ép `size-3.5` (icon = size chữ nút) + weight theo §5⃣0a nên caller không chèn sai scale/nét — story KHÔNG truyền `weight`."
                code={"<Menu.Base triggerLabel=\"Sắp xếp\" triggerIcon={CaretDownIcon} items={[…]} />"}
            >
                <div className="flex justify-center py-4">
                    <Menu.Base
                        triggerLabel="Sắp xếp"
                        triggerIcon={CaretDownIcon}
                        ariaLabel="Sắp xếp"
                        defaultOpen
                        showAnatomy
                        onAction={() => {}}
                        items={[
                            { key: "recent", label: "Mới nhất" },
                            { key: "popular", label: "Phổ biến" },
                            { key: "az", label: "A → Z" },
                        ]}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithSections — nhóm dòng có tiêu đề. */
export const WithSections: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="WithSections"
                parts={SECTION_PARTS}
                note="`sections` gộp dòng theo nhóm; `section.title` render header (react-aria Header)."
                code={"<Menu.Base triggerLabel=\"Menu\" sections={[{ key: \"acct\", title: \"Tài khoản\", items: [...] }, …]} />"}
            >
                <div className="flex justify-center py-4">
                    <Menu.Base
                        triggerLabel="Menu tài khoản"
                        ariaLabel="Menu tài khoản"
                        defaultOpen
                        showAnatomy
                        onAction={() => {}}
                        sections={[
                            {
                                key: "account",
                                title: "Tài khoản",
                                items: [
                                    { key: "profile", label: "Hồ sơ", icon: UserIcon },
                                    { key: "settings", label: "Cài đặt", icon: GearIcon },
                                ],
                            },
                            {
                                key: "session",
                                title: "Phiên",
                                items: [{ key: "logout", label: "Đăng xuất", icon: SignOutIcon }],
                            },
                        ]}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** DisabledItem — một dòng không chọn được. */
export const DisabledItem: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="DisabledItem"
                parts={DISABLED_PARTS}
                note="`isDisabled` làm dòng mờ + không phát onAction (vd: chưa đủ quyền)."
                code={"<Menu.Base triggerLabel=\"Thao tác\" items={[{ key: \"archive\", label: \"Lưu trữ\", isDisabled: true }, …]} />"}
            >
                <div className="flex justify-center py-4">
                    <Menu.Base
                        triggerLabel="Thao tác"
                        ariaLabel="Thao tác"
                        defaultOpen
                        showAnatomy
                        onAction={() => {}}
                        items={[
                            { key: "edit", label: "Sửa", icon: PencilSimpleIcon },
                            { key: "archive", label: "Lưu trữ (cần quyền)", icon: CopyIcon, isDisabled: true },
                            { key: "delete", label: "Xoá", icon: TrashIcon },
                        ]}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

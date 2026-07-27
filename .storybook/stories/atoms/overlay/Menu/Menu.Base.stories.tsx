import type { Meta, StoryObj } from "@storybook/nextjs"
import { CaretDownIcon, CopyIcon, GearIcon, PencilSimpleIcon, SignOutIcon, TrashIcon, UserIcon } from "@phosphor-icons/react"
import { Menu } from "@sb-components/atoms/overlay/Menu/Menu"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Menu.Base`: atom menu DUY NHẤT, bọc thẳng HeroUI `Dropdown` (Trigger ·
 * Popover · Menu · Section · Item). Không có atom con nào tách ra story riêng —
 * `items`/`sections`/icon/disabled đều là LEAF prop-driven của chính `Menu.Base`.
 *
 * ⛔ KHÔNG dùng `annotate`/`parts` (bỏ 2026-07-26) — hai lý do cộng lại:
 * 1. `DropdownPopover` render qua **PORTAL** ra `document.body`, nằm NGOÀI render-box
 *    mà {@link BlockAnatomy} quét (nó leo ancestor BÊN TRONG `hostRef`). Khai part cho
 *    `Menu`/`Item`/`Section`/`SectionHeader` chỉ tạo entry không bao giờ vào cây —
 *    trôi trong im lặng, không ai biết.
 * 2. `Trigger` tuy nằm TRONG render-box nhưng là `HeroButton` thô (không phải
 *    `Button.Base` có story riêng) — kể cả không bị chặn portal, nó cũng không có
 *    `storyId` thật để bấm nhảy tới. Atom lá bọc thẳng HeroUI ⇒ không có deps thật.
 *
 * ✍️ Chữ hiện ra UI (label menu, `triggerLabel`, `why`/`reason`) viết TIẾNG ANH
 * (thầy chốt 2026-07-26) — kể cả nội dung demo, không riêng phần chú giải panel.
 *
 * 2026-07-27: di trú toàn bộ leaf sang API `states[]` (§8/§4a).
 */

const meta: Meta<typeof Menu.Base> = {
    title: "Atoms/Overlay/Menu/Menu.Base",
    component: Menu.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Menu.Base>

/** Leaf TRẦN — danh sách phẳng, không icon, không section. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="Default"
                reason="The one action-menu atom wrapping HeroUI Dropdown. Callers pass data, items or sections plus a trigger label, and the atom builds every row itself, owning both layout and icon scale."
                states={[
                    {
                        name: "items = 3 flat rows, no icon, no section",
                        why: "The three items render as a plain list with no leading icon and no group header, and picking a row fires onAction with that row's key. defaultOpen pins the menu open here purely so the popover is visible without a click.",
                        code: "<Menu.Base triggerLabel=\"Account\" items={[{ key: \"profile\", label: \"My profile\" }, …]} onAction={fn} />",
                        render: (
                            <div className="flex justify-center py-4">
                                <Menu.Base
                                    triggerLabel="Account"
                                    ariaLabel="Account"
                                    defaultOpen
                                    showAnatomy
                                    onAction={() => {}}
                                    items={[
                                        { key: "profile", label: "My profile" },
                                        { key: "billing", label: "Billing" },
                                        { key: "settings", label: "Settings" },
                                    ]}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `triggerVariant` — ĐỦ union 4 giá trị, đổi HÌNH nút trigger, thấy ngay cả khi menu đóng. */
export const TriggerVariants: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="Prop `triggerVariant`"
                reason="The trigger is a real HeroButton, so it carries the same four visuals as every button in the system. Picking the variant decides how loud the menu's entry point reads next to its neighbours, a toolbar full of primary triggers would shout."
                states={[
                    {
                        name: "triggerVariant = primary | secondary | tertiary | ghost, menu closed",
                        why: "All four buttons already differ from each other before anyone opens a menu, because the prop paints the trigger button itself rather than anything inside the popover. Each menu is shown closed on purpose, since that is the only moment the four variants can be compared side by side.",
                        code: `<Menu.Base triggerVariant="primary" triggerLabel="Primary" items={[…]} />
<Menu.Base triggerVariant="secondary" triggerLabel="Secondary" items={[…]} />
<Menu.Base triggerVariant="tertiary" triggerLabel="Tertiary" items={[…]} />
<Menu.Base triggerVariant="ghost" triggerLabel="Ghost" items={[…]} />`,
                        render: (
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <Menu.Base
                                    triggerVariant="primary"
                                    triggerLabel="Primary"
                                    ariaLabel="Primary"
                                    showAnatomy
                                    onAction={() => {}}
                                    items={[
                                        { key: "profile", label: "My profile" },
                                        { key: "settings", label: "Settings" },
                                    ]}
                                />
                                <Menu.Base
                                    triggerVariant="secondary"
                                    triggerLabel="Secondary"
                                    ariaLabel="Secondary"
                                    onAction={() => {}}
                                    items={[
                                        { key: "profile", label: "My profile" },
                                        { key: "settings", label: "Settings" },
                                    ]}
                                />
                                <Menu.Base
                                    triggerVariant="tertiary"
                                    triggerLabel="Tertiary"
                                    ariaLabel="Tertiary"
                                    onAction={() => {}}
                                    items={[
                                        { key: "profile", label: "My profile" },
                                        { key: "settings", label: "Settings" },
                                    ]}
                                />
                                <Menu.Base
                                    triggerVariant="ghost"
                                    triggerLabel="Ghost"
                                    ariaLabel="Ghost"
                                    onAction={() => {}}
                                    items={[
                                        { key: "profile", label: "My profile" },
                                        { key: "settings", label: "Settings" },
                                    ]}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `icon` trên item — leading icon là COMPONENT phosphor. */
export const WithIcons: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="Prop `icon` (per item)"
                states={[
                    {
                        name: "items[].icon set on every row",
                        why: "Each of the four rows gains a leading Phosphor icon pinned to size-4 with a fixed stroke weight, the atom sets both, no story ever passes a weight itself. Reach for an icon on a row when its action reads faster as a symbol than as text alone.",
                        code: "<Menu.Base triggerLabel=\"Actions\" items={[{ key: \"edit\", label: \"Edit\", icon: PencilSimpleIcon }, …]} />",
                        render: (
                            <div className="flex justify-center py-4">
                                <Menu.Base
                                    triggerLabel="Actions"
                                    ariaLabel="Actions"
                                    defaultOpen
                                    showAnatomy
                                    onAction={() => {}}
                                    items={[
                                        { key: "edit", label: "Edit", icon: PencilSimpleIcon },
                                        { key: "duplicate", label: "Duplicate", icon: CopyIcon },
                                        { key: "settings", label: "Settings", icon: GearIcon },
                                        { key: "delete", label: "Delete", icon: TrashIcon },
                                    ]}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `triggerIcon` — nhãn nút kèm glyph dẫn đầu. */
export const WithTriggerIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="Prop `triggerIcon`"
                states={[
                    {
                        name: "triggerIcon set",
                        why: "The trigger label gains a leading caret icon sized to the trigger's own text size, with the same fixed stroke weight every icon in the system uses. Callers never pass a weight themselves, so a sort trigger and any other trigger icon stay visually identical.",
                        code: "<Menu.Base triggerLabel=\"Sort\" triggerIcon={CaretDownIcon} items={[…]} />",
                        render: (
                            <div className="flex justify-center py-4">
                                <Menu.Base
                                    triggerLabel="Sort"
                                    triggerIcon={CaretDownIcon}
                                    ariaLabel="Sort"
                                    defaultOpen
                                    showAnatomy
                                    onAction={() => {}}
                                    items={[
                                        { key: "recent", label: "Newest" },
                                        { key: "popular", label: "Popular" },
                                        { key: "az", label: "A to Z" },
                                    ]}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `sections` — nhóm dòng có tiêu đề, thay cho danh sách phẳng. */
export const WithSections: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="Prop `sections`"
                states={[
                    {
                        name: "sections passed instead of items",
                        why: "The rows split into two titled groups, Account and Session, each with its own react-aria header above it, instead of one flat list. sections and items are mutually exclusive, so a menu picks one shape or the other, never both at once.",
                        code: "<Menu.Base triggerLabel=\"Menu\" sections={[{ key: \"acct\", title: \"Account\", items: [...] }, …]} />",
                        render: (
                            <div className="flex justify-center py-4">
                                <Menu.Base
                                    triggerLabel="Account menu"
                                    ariaLabel="Account menu"
                                    defaultOpen
                                    showAnatomy
                                    onAction={() => {}}
                                    sections={[
                                        {
                                            key: "account",
                                            title: "Account",
                                            items: [
                                                { key: "profile", label: "Profile", icon: UserIcon },
                                                { key: "settings", label: "Settings", icon: GearIcon },
                                            ],
                                        },
                                        {
                                            key: "session",
                                            title: "Session",
                                            items: [{ key: "logout", label: "Sign out", icon: SignOutIcon }],
                                        },
                                    ]}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `isDisabled` trên item — một dòng không chọn được. */
export const DisabledItem: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="Prop `isDisabled` (per item)"
                states={[
                    {
                        name: "items[1].isDisabled = true",
                        why: "The Archive row dims and stops firing onAction while Edit and Delete on either side of it stay fully active. A disabled row is for an action the reader can see exists but cannot use yet, such as one gated behind a permission.",
                        code: "<Menu.Base triggerLabel=\"Actions\" items={[{ key: \"archive\", label: \"Archive\", isDisabled: true }, …]} />",
                        render: (
                            <div className="flex justify-center py-4">
                                <Menu.Base
                                    triggerLabel="Actions"
                                    ariaLabel="Actions"
                                    defaultOpen
                                    showAnatomy
                                    onAction={() => {}}
                                    items={[
                                        { key: "edit", label: "Edit", icon: PencilSimpleIcon },
                                        { key: "archive", label: "Archive (needs permission)", icon: CopyIcon, isDisabled: true },
                                        { key: "delete", label: "Delete", icon: TrashIcon },
                                    ]}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c), số row bám theo số item thật. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Menu.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the popover shape owns its resting state, so the atom draws its own shimmer instead of pulling in a shared skeleton component."
                states={[
                    {
                        name: "isSkeleton = true, items.length = 3",
                        why: "Three shimmer rows render in place of the three real items, since the row count follows the real items array rather than a fixed guess. Matching the real count keeps the trigger's popover from changing height once the real rows arrive.",
                        code: "<Menu.Base isSkeleton triggerLabel=\"Account\" items={[{ key: \"profile\", label: \"My profile\" }, …]} />",
                        render: (
                            <div className="flex justify-center py-4">
                                <div className="w-56">
                                    <Menu.Base
                                        triggerLabel="Account"
                                        ariaLabel="Account"
                                        isSkeleton
                                        showAnatomy
                                        onAction={() => {}}
                                        items={[
                                            { key: "profile", label: "My profile" },
                                            { key: "billing", label: "Billing" },
                                            { key: "settings", label: "Settings" },
                                        ]}
                                    />
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

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
 * ✍️ Chữ hiện ra UI (label menu, `triggerLabel`, `reason`/`note`) viết TIẾNG ANH
 * (thầy chốt 2026-07-26) — kể cả nội dung demo, không riêng phần chú giải panel.
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
                reason="The one action-menu atom wrapping HeroUI Dropdown. Callers pass DATA — items or sections plus a trigger label — and the atom builds every row itself, owning layout and icon scale."
                note="defaultOpen pins the menu open so you can see it here. Flat items render as a plain list; picking one fires onAction(key). The trigger label goes through triggerLabel — the atom does not accept children."
                code={"<Menu.Base triggerLabel=\"Account\" items={[{ key: \"profile\", label: \"My profile\" }, …]} onAction={fn} />"}
            >
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
            </BlockAnatomy>
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
                reason="The trigger is a real HeroButton, so it carries the same four visuals as every button in the system. Picking the variant is picking how loud the menu's entry point reads next to its neighbours — a toolbar full of primary triggers would shout."
                note="Closed here on purpose: the prop paints the button itself, so all four differ before anyone opens the menu. Default is secondary."
                code={`<Menu.Base triggerVariant="primary" triggerLabel="Primary" items={[…]} />
<Menu.Base triggerVariant="secondary" triggerLabel="Secondary" items={[…]} />
<Menu.Base triggerVariant="tertiary" triggerLabel="Tertiary" items={[…]} />
<Menu.Base triggerVariant="ghost" triggerLabel="Ghost" items={[…]} />`}
            >
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
            </BlockAnatomy>
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
                note="icon takes a Phosphor COMPONENT (GearIcon, §5.0); the atom pins it to size-4 plus a fixed stroke weight (§5.0a) — stories never pass weight. Reach for an icon when the row's action reads faster as a symbol."
                code={"<Menu.Base triggerLabel=\"Actions\" items={[{ key: \"edit\", label: \"Edit\", icon: PencilSimpleIcon }, …]} />"}
            >
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
            </BlockAnatomy>
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
                note="triggerIcon is a Phosphor COMPONENT (§5.0); the atom pins it to size-3.5 — the trigger's own text size — plus the fixed stroke weight from §5.0a, so callers never pass weight themselves."
                code={"<Menu.Base triggerLabel=\"Sort\" triggerIcon={CaretDownIcon} items={[…]} />"}
            >
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
                            { key: "az", label: "A → Z" },
                        ]}
                    />
                </div>
            </BlockAnatomy>
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
                note="sections groups rows under an optional title. Pass sections instead of items and the atom renders a header (react-aria Header) above each group — the two props are mutually exclusive."
                code={"<Menu.Base triggerLabel=\"Menu\" sections={[{ key: \"acct\", title: \"Account\", items: [...] }, …]} />"}
            >
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
            </BlockAnatomy>
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
                note="isDisabled dims a row and blocks onAction — use it for a row the user can see but cannot act on yet, such as a permission gate."
                code={"<Menu.Base triggerLabel=\"Actions\" items={[{ key: \"archive\", label: \"Archive\", isDisabled: true }, …]} />"}
            >
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
            </BlockAnatomy>
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
                reason="Whoever owns the popover shape owns its resting state, so the atom draws its own shimmer instead of pulling a shared skeleton component."
                note="Row count follows the real items array — three items in, three shimmer rows out — so the layout does not jump once the data lands."
                code={"<Menu.Base isSkeleton triggerLabel=\"Account\" items={[{ key: \"profile\", label: \"My profile\" }, …]} />"}
            >
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
            </BlockAnatomy>
        </div>
    ),
}

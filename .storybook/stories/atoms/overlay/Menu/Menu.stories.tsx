import type { Meta, StoryObj } from "@storybook/nextjs"
import { CaretDownIcon, CopyIcon, GearIcon, PencilSimpleIcon, SignOutIcon, TrashIcon, UserIcon } from "@phosphor-icons/react"
import { Menu } from "@sb-components/atoms/overlay/Menu/Menu"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Menu`: the one menu atom, wrapping HeroUI `Dropdown` directly (Trigger · Popover ·
 * Menu · Section · Item). No child atom splits into its own story — `items`/`sections`/icon/
 * disabled are all leaf prop-driven states of `Menu` itself.
 * 
 * `annotate`: every HeroUI import `Menu.tsx` renders directly declares `tier: "heroui"` (no
 * `storyId`), the node name matching the real import name (`DropdownTrigger`/`DropdownPopover`/
 * `DropdownMenu`/`DropdownSection`/`Header`/`DropdownItem`).
 * 
 * PORTAL LIMITATION: `DropdownPopover` and everything nested inside it renders into
 * `document.body`, outside the render-box {@link BlockAnatomy} scans, so even with `annotate`
 * declared they do not show up in the Structure tree — declaring the correct name is about
 * data honesty, not visibility. Only `DropdownTrigger` and `Skeleton` actually reach the tree.
 * 
 * Text shown on the UI (menu labels, `triggerLabel`, `why`/`reason`) is written in English.
 */

/**
 * Every `@heroui/react` import (+ `Header` from `react-aria-components`, same
 * situation: an outside library, no story of ours) that `Menu` renders directly.
 * Shared ACROSS every leaf in this file — the actual tree still depends on what the
 * open leaf renders.
 */
const MENU_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "DropdownTrigger": { tier: "heroui", role: "Pressable trigger wrapper (react-aria DialogTrigger) around the HeroButton." },
    "DropdownPopover": { tier: "heroui", role: "Portal surface the menu opens into (renders into document.body — never reachable here)." },
    "DropdownMenu": { tier: "heroui", role: "The react-aria Menu collection (renders into document.body — never reachable here)." },
    "DropdownSection": { tier: "heroui", role: "A titled group of rows (renders into document.body — never reachable here)." },
    "Header": { tier: "heroui", role: "react-aria-components section label (renders into document.body — never reachable here)." },
    "DropdownItem": { tier: "heroui", role: "One selectable row, flat or grouped (renders into document.body — never reachable here)." },
    "Skeleton": { tier: "heroui", role: "Shimmer placeholder bar/circle standing in for one resting row." },
}

const meta: Meta<typeof Menu> = {
    title: "Atoms/Overlay/Menu/Menu",
    component: Menu,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Menu>

/** Bare leaf — a flat list, no icon, no section. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Menu"
                tier="atom"
                annotate={MENU_ANNOTATE}
                leaf="Default"
                reason="The one action-menu atom wrapping HeroUI Dropdown. Callers pass data, items or sections plus a trigger label, and the atom builds every row itself, owning both layout and icon scale."
                states={[
                    {
                        name: "items = 3 flat rows, no icon, no section",
                        why: "The three items render as a plain list with no leading icon and no group header, and picking a row fires onAction with that row's key. defaultOpen pins the menu open here purely so the popover is visible without a click.",
                        code: "<Menu triggerLabel=\"Account\" items={[{ key: \"profile\", label: \"My profile\" }, …]} onAction={fn} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-4">
                                <Menu
                                    triggerLabel="Account"
                                    ariaLabel="Account"
                                    defaultOpen
                                   
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

/** Leaf for prop `triggerVariant` — FULL 4-value union, changing the trigger button's LOOK, visible even with the menu closed. */
export const TriggerVariants: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Menu"
                tier="atom"
                annotate={MENU_ANNOTATE}
                leaf="Prop `triggerVariant`"
                reason="The trigger is a real HeroButton, so it carries the same four visuals as every button in the system. Picking the variant decides how loud the menu's entry point reads next to its neighbours, a toolbar full of primary triggers would shout."
                states={[
                    {
                        name: "triggerVariant = \"primary\"",
                        why: "The trigger renders as a primary HeroButton, the loudest visual weight in the button system, while the menu stays closed so the trigger's own look is what the reader compares. Reach for primary when this menu is the main action in its area and should draw the eye first.",
                        code: "<Menu triggerVariant=\"primary\" triggerLabel=\"Primary\" items={[…]} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-4">
                                <Menu
                                    triggerVariant="primary"
                                    triggerLabel="Primary"
                                    ariaLabel="Primary"
                                   
                                    onAction={() => {}}
                                    items={[
                                        { key: "profile", label: "My profile" },
                                        { key: "settings", label: "Settings" },
                                    ]}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "triggerVariant = \"secondary\"",
                        why: "The trigger renders as a secondary HeroButton, one step down from primary, while the menu stays closed. Reach for secondary when the menu is useful but should not compete with a primary action sitting nearby.",
                        code: "<Menu triggerVariant=\"secondary\" triggerLabel=\"Secondary\" items={[…]} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-4">
                                <Menu
                                    triggerVariant="secondary"
                                    triggerLabel="Secondary"
                                    ariaLabel="Secondary"
                                   
                                    onAction={() => {}}
                                    items={[
                                        { key: "profile", label: "My profile" },
                                        { key: "settings", label: "Settings" },
                                    ]}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "triggerVariant = \"tertiary\"",
                        why: "The trigger renders as a tertiary HeroButton, quieter again, while the menu stays closed. Reach for tertiary when the menu is a minor option that should recede into the surrounding layout.",
                        code: "<Menu triggerVariant=\"tertiary\" triggerLabel=\"Tertiary\" items={[…]} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-4">
                                <Menu
                                    triggerVariant="tertiary"
                                    triggerLabel="Tertiary"
                                    ariaLabel="Tertiary"
                                   
                                    onAction={() => {}}
                                    items={[
                                        { key: "profile", label: "My profile" },
                                        { key: "settings", label: "Settings" },
                                    ]}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "triggerVariant = \"ghost\"",
                        why: "The trigger renders as a ghost HeroButton with no fill, while the menu stays closed. Reach for ghost when the menu should sit almost invisibly until the reader hovers or focuses it.",
                        code: "<Menu triggerVariant=\"ghost\" triggerLabel=\"Ghost\" items={[…]} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-4">
                                <Menu
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

/** Leaf for prop `icon` on an item — the leading icon is a Phosphor COMPONENT. */
export const WithIcons: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Menu"
                tier="atom"
                annotate={MENU_ANNOTATE}
                leaf="Prop `icon` (per item)"
                states={[
                    {
                        name: "items[].icon set on every row",
                        why: "Each of the four rows gains a leading Phosphor icon pinned to size-4 with a fixed stroke weight, the atom sets both, no story ever passes a weight itself. Reach for an icon on a row when its action reads faster as a symbol than as text alone.",
                        code: "<Menu triggerLabel=\"Actions\" items={[{ key: \"edit\", label: \"Edit\", icon: PencilSimpleIcon }, …]} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-4">
                                <Menu
                                    triggerLabel="Actions"
                                    ariaLabel="Actions"
                                    defaultOpen
                                   
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

/** Leaf for prop `triggerIcon` — the trigger label with a leading glyph. */
export const WithTriggerIcon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Menu"
                tier="atom"
                annotate={MENU_ANNOTATE}
                leaf="Prop `triggerIcon`"
                states={[
                    {
                        name: "triggerIcon set",
                        why: "The trigger label gains a leading caret icon sized to the trigger's own text size, with the same fixed stroke weight every icon in the system uses. Callers never pass a weight themselves, so a sort trigger and any other trigger icon stay visually identical.",
                        code: "<Menu triggerLabel=\"Sort\" triggerIcon={CaretDownIcon} items={[…]} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-4">
                                <Menu
                                    triggerLabel="Sort"
                                    triggerIcon={CaretDownIcon}
                                    ariaLabel="Sort"
                                    defaultOpen
                                   
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

/** Leaf for prop `sections` — titled row groups, replacing the flat list. */
export const WithSections: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Menu"
                tier="atom"
                annotate={MENU_ANNOTATE}
                leaf="Prop `sections`"
                states={[
                    {
                        name: "sections passed instead of items",
                        why: "The rows split into two titled groups, Account and Session, each with its own react-aria header above it, instead of one flat list. sections and items are mutually exclusive, so a menu picks one shape or the other, never both at once.",
                        code: "<Menu triggerLabel=\"Menu\" sections={[{ key: \"acct\", title: \"Account\", items: [...] }, …]} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-4">
                                <Menu
                                    triggerLabel="Account menu"
                                    ariaLabel="Account menu"
                                    defaultOpen
                                   
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

/** Leaf for prop `isDisabled` on an item — one row that cannot be picked. */
export const DisabledItem: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Menu"
                tier="atom"
                annotate={MENU_ANNOTATE}
                leaf="Prop `isDisabled` (per item)"
                states={[
                    {
                        name: "items[1].isDisabled = true",
                        why: "The Archive row dims and stops firing onAction while Edit and Delete on either side of it stay fully active. A disabled row is for an action the reader can see exists but cannot use yet, such as one gated behind a permission.",
                        code: "<Menu triggerLabel=\"Actions\" items={[{ key: \"archive\", label: \"Archive\", isDisabled: true }, …]} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-4">
                                <Menu
                                    triggerLabel="Actions"
                                    ariaLabel="Actions"
                                    defaultOpen
                                   
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

/** Leaf for prop `isSkeleton` — CO-LOCATED shimmer (§12c), row count tracks the real item count. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Menu"
                tier="atom"
                annotate={MENU_ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the popover shape owns its resting state, so the atom draws its own shimmer instead of pulling in a shared skeleton component."
                states={[
                    {
                        name: "isSkeleton = true, items.length = 3",
                        why: "Three shimmer rows render in place of the three real items, since the row count follows the real items array rather than a fixed guess. Matching the real count keeps the trigger's popover from changing height once the real rows arrive.",
                        code: "<Menu isSkeleton triggerLabel=\"Account\" items={[{ key: \"profile\", label: \"My profile\" }, …]} />",
                        render: (
                            <div data-tier="fixture" className="flex justify-center py-4">
                                <div className="w-56">
                                    <Menu
                                        triggerLabel="Account"
                                        ariaLabel="Account"
                                        isSkeleton
                                       
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

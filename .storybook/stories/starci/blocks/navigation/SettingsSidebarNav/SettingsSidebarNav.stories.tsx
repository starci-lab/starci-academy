import type { Meta, StoryObj } from "@storybook/nextjs"
import { SettingsSidebarNav, type SettingsNavGroup } from "@sb-components/starci/blocks/navigation/SettingsSidebarNav/SettingsSidebarNav"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SettingsSidebarNav`: the account-settings destination list, drawn as
 * a collapsible desktop rail and, below `@app-md`, a sticky horizontal pill bar.
 * See the component file header for the reused `CollapsibleSidebar` gap, the
 * two still-inlined gaps (`SidebarNavGroup`/`SidebarNavItem`), and why the
 * enum-owned destination vocabulary diverges from `src`'s `ReactNode`+i18n-key
 * table.
 *
 * 📐 TWO LEAVES, by STRUCTURE — unlike `NavLinks` (whose narrow width only
 * HIDES the same row, staying one leaf), here a genuinely different shape
 * replaces the rail below `@app-md`, which earns a second leaf:
 *   • `DesktopRail`    — the collapsible rail, `Link`-shaped rows, a divider
 *     between groups.
 *   • `MobilePillBar`  — the flattened, rounded-full chip row.
 * Both leaves render the SAME component; only the demo container's WIDTH
 * differs, so each story shows the branch its own `@app-md` query resolves to
 * (a fresh `@container` per story — see each leaf's `renderClassName`).
 * `activeHref` is DATA, so within each leaf it is a state, not a leaf of its
 * own — same split `NavLinks`'s `Row` leaf uses for `isActive`.
 */
const meta: Meta<typeof SettingsSidebarNav> = {
    title: "StarCi/Blocks/Navigation/SettingsSidebarNav/SettingsSidebarNav",
    component: SettingsSidebarNav,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SettingsSidebarNav>

/** Same grouping `src`'s `getSettingsGroups` builds — account / learning / ai / content. */
const GROUPS: Array<SettingsNavGroup> = [
    {
        key: "account",
        items: [
            { key: "editProfile", href: "/profile/edit" },
            { key: "appearance", href: "/profile/appearance" },
            { key: "security", href: "/profile/security" },
            { key: "sessions", href: "/profile/sessions" },
        ],
    },
    {
        key: "learning",
        items: [{ key: "courseHistory", href: "/profile/learning" }],
    },
    {
        key: "ai",
        items: [
            { key: "aiSettings", href: "/profile/ai-settings" },
            { key: "aiSubscription", href: "/profile/ai-subscription" },
            { key: "aiUsage", href: "/profile/ai-usage" },
        ],
    },
    {
        key: "content",
        items: [
            { key: "bookmarks", href: "/profile/bookmarks" },
            { key: "membership", href: "/profile/membership" },
            { key: "installments", href: "/profile/installments" },
        ],
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "CollapsibleSidebar": { tier: "block", role: "the collapse/expand chrome this block reuses verbatim — width animation, the toggle, `localStorage` persistence, and its own scroll region; this block only feeds it dividers + rows as `children`", storyId: "starci-blocks-navigation-collapsiblesidebar-collapsiblesidebar--default" },
    "Divider": { tier: "atom", role: "the rule this block draws above every group but the first, the inlined `SidebarNavGroup` gap", storyId: "atoms-display-divider-divider--default" },
    "StackV": { tier: "frame", role: "the column holding one group's rows, `flush` because each row already carries its own vertical padding", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the row inside a nav row (icon + label) or the mobile bar's own horizontal scroll strip, depending on which leaf it appears in", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "a destination's label — real text in the expanded rail and the mobile pills, dropped entirely from a collapsed rail row", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the desktop collapsible rail, visible once the demo container clears `@app-md` (48rem). */
export const DesktopRail: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SettingsSidebarNav"
                tier="block"
                leaf="Desktop rail"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="@container h-[560px] w-full max-w-5xl overflow-y-auto"
                states={[
                    {
                        name: "activeHref = \"/profile/security\"",
                        why: "The reader is on the security page, so that row alone carries the accent-soft fill and `aria-current=\"page\"` while every other row in every other group stays plain text. The desktop rail is wide enough here (past @app-md) that this leaf's row shape — icon + label, a divider between groups — is the one on screen.",
                        code: `<SettingsSidebarNav
    groups={groups}
    activeHref="/profile/security"
    onNavigate={router.push}
    title="Cài đặt"
    collapseLabel="Thu gọn"
    expandLabel="Mở rộng"
    storageKey="starci.settings.sidebar.collapsed"
/>`,
                        render: (
                            <SettingsSidebarNav
                                anatPart="SettingsSidebarNav"
                                showAnatomy
                                groups={GROUPS}
                                activeHref="/profile/security"
                                onNavigate={() => {}}
                                title="Cài đặt"
                                collapseLabel="Thu gọn"
                                expandLabel="Mở rộng"
                                storageKey="storybook.settings.sidebar.collapsed.a"
                            />
                        ),
                    },
                    {
                        name: "activeHref = \"/profile/bookmarks\"",
                        why: "Moving the active destination to the LAST group proves the accent-soft fill follows `activeHref` itself rather than a fixed row position — the security row from the previous state returns to plain text the moment it stops being the active one.",
                        code: `<SettingsSidebarNav
    groups={groups}
    activeHref="/profile/bookmarks"
    onNavigate={router.push}
    title="Cài đặt"
    collapseLabel="Thu gọn"
    expandLabel="Mở rộng"
    storageKey="starci.settings.sidebar.collapsed"
/>`,
                        render: (
                            <SettingsSidebarNav
                                groups={GROUPS}
                                activeHref="/profile/bookmarks"
                                onNavigate={() => {}}
                                title="Cài đặt"
                                collapseLabel="Thu gọn"
                                expandLabel="Mở rộng"
                                storageKey="storybook.settings.sidebar.collapsed.b"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the mobile pill bar, forced on by a demo container narrower than `@app-md` (48rem). */
export const MobilePillBar: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SettingsSidebarNav"
                tier="block"
                leaf="Mobile pill bar"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="@container w-full max-w-sm"
                states={[
                    {
                        name: "activeHref = \"/profile/ai-settings\"",
                        why: "Below @app-md the desktop rail is absent entirely and every destination — flattened out of its group — sits in one horizontal-scroll strip of rounded-full pills. The active pill gets the accent border + soft fill; the rest stay muted outline chips.",
                        code: `<SettingsSidebarNav
    groups={groups}
    activeHref="/profile/ai-settings"
    onNavigate={router.push}
    title="Cài đặt"
    collapseLabel="Thu gọn"
    expandLabel="Mở rộng"
    storageKey="starci.settings.sidebar.collapsed"
    mobileNavAriaLabel="Điều hướng cài đặt"
/>`,
                        render: (
                            <SettingsSidebarNav
                                anatPart="SettingsSidebarNav"
                                showAnatomy
                                groups={GROUPS}
                                activeHref="/profile/ai-settings"
                                onNavigate={() => {}}
                                title="Cài đặt"
                                collapseLabel="Thu gọn"
                                expandLabel="Mở rộng"
                                storageKey="storybook.settings.sidebar.collapsed.c"
                                mobileNavAriaLabel="Điều hướng cài đặt"
                            />
                        ),
                    },
                    {
                        name: "activeHref = \"/profile/installments\"",
                        why: "Same proof as the rail's second state, on the pill row: the active pill follows `activeHref` to the LAST group's destination rather than staying pinned to whichever pill happened to be first.",
                        code: `<SettingsSidebarNav
    groups={groups}
    activeHref="/profile/installments"
    onNavigate={router.push}
    title="Cài đặt"
    collapseLabel="Thu gọn"
    expandLabel="Mở rộng"
    storageKey="starci.settings.sidebar.collapsed"
/>`,
                        render: (
                            <SettingsSidebarNav
                                groups={GROUPS}
                                activeHref="/profile/installments"
                                onNavigate={() => {}}
                                title="Cài đặt"
                                collapseLabel="Thu gọn"
                                expandLabel="Mở rộng"
                                storageKey="storybook.settings.sidebar.collapsed.d"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

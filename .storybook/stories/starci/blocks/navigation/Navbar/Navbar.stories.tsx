import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    FileTextIcon,
    GearIcon,
    SignInIcon,
    SignOutIcon,
    SquaresFourIcon,
    UserIcon,
    UserPlusIcon,
} from "@phosphor-icons/react"
import { Navbar } from "@sb-components/starci/blocks/navigation/Navbar/Navbar"
import type {
    NavbarAccountData,
    NavbarLanguageOption,
    NavbarNotificationsData,
    NavLinkItem,
} from "@sb-components/starci/blocks/navigation/Navbar/Navbar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `Navbar`: the sticky top app bar. See the component's own file
 * header for the full port/reuse ledger; this story only exercises what a
 * caller actually configures.
 *
 * TWO LEAVES, by STRUCTURE (this run's own `LEAVES` line): the desktop row
 * (route pills + inline language/theme) and the mobile collapsed row (icon
 * bar + drawer trigger) are two DIFFERENT compositions — the desktop row has
 * no drawer trigger at all, the mobile row has no pills. Everything else
 * (signed-in vs guest, empty vs busy badges, drawer open vs closed) is DATA,
 * so it lives as a state tab inside the matching leaf, not a third leaf.
 *
 * Viewport note: both leaves render the SAME component (the `@app-md:` rules
 * live in its own className, not a separate prop), so the "Mobile" leaf pins a
 * narrow `renderClassName` frame to force the collapsed row into view instead
 * of relying on the Storybook canvas width.
 */
const meta: Meta<typeof Navbar> = {
    title: "StarCi/Blocks/Navigation/Navbar/Navbar",
    component: Navbar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Navbar>

/** Shared desktop-route fixture — reused across every state so the pills read identically. */
const NAV_ITEMS: Array<NavLinkItem> = [
    { id: "home", label: "Trang chủ", isActive: true, onPress: () => {} },
    { id: "courses", label: "Khoá học", isActive: false, onPress: () => {} },
    { id: "contact", label: "Liên hệ", isActive: false, onPress: () => {} },
]

/** Shared locale fixture. */
const LANGUAGES: Array<NavbarLanguageOption> = [
    { code: "vi", label: "Tiếng Việt" },
    { code: "en", label: "English" },
]

/** A signed-in viewer's notification data — 3 rows, 2 unread. */
const NOTIFICATIONS_WITH_DATA: NavbarNotificationsData = {
    unreadCount: 2,
    items: [
        { id: "n1", title: "Bài nộp đã được chấm", subtitle: "Module 3 · Container hoá", timeLabel: "5 phút trước", isRead: false },
        { id: "n2", title: "Nhắc lịch ôn flashcard", subtitle: "12 thẻ đến hạn hôm nay", timeLabel: "2 giờ trước", isRead: false },
        { id: "n3", title: "Khoá học có bài giảng mới", subtitle: "DevOps Mastery", timeLabel: "1 ngày trước", isRead: true },
    ],
    isLoading: false,
    error: null,
    onItemPress: () => {},
    onMarkAllRead: () => {},
    onSeeAll: () => {},
    onRetry: () => {},
}

/** No unread, no rows — the badge disappears and the popover falls to its empty branch. */
const NOTIFICATIONS_QUIET: NavbarNotificationsData = {
    unreadCount: 0,
    items: [],
    isLoading: false,
    error: null,
    onItemPress: () => {},
    onMarkAllRead: () => {},
    onSeeAll: () => {},
    onRetry: () => {},
}

/** The authed account menu — dashboard/profile/CV/settings, then a separated sign-out row. */
const ACCOUNT_AUTHED: NavbarAccountData = {
    isAuthed: true,
    user: { username: "tranminhanh", email: "tranminhanh@gmail.com", avatarUrl: undefined },
    isLoading: false,
    menuItems: [
        { id: "dashboard", label: "Bảng điều khiển", icon: SquaresFourIcon, onPress: () => {} },
        { id: "profile", label: "Hồ sơ", icon: UserIcon, onPress: () => {} },
        { id: "cv", label: "CV", icon: FileTextIcon, onPress: () => {} },
        { id: "settings", label: "Cài đặt", icon: GearIcon, onPress: () => {} },
        { id: "logout", label: "Đăng xuất", icon: SignOutIcon, isDanger: true, onPress: () => {} },
    ],
}

/** The guest account menu — sign in / sign up only, no header user. */
const ACCOUNT_GUEST: NavbarAccountData = {
    isAuthed: false,
    isLoading: false,
    menuItems: [
        { id: "sign-in", label: "Đăng nhập", icon: SignInIcon, onPress: () => {} },
        { id: "sign-up", label: "Đăng ký", icon: UserPlusIcon, onPress: () => {} },
    ],
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the primary bar's row track (outer justify-between split, and each inner cluster of controls)", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the notification popover's own column, and the mobile drawer's stacked regions", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "a route pill's label, the popover's own title/timestamps, or the guest prompt line", storyId: "atoms-text-typography-typography--plain" },
    "Button": { tier: "atom", role: "every plain trigger this block owns directly — the desktop pills' shared control, the mobile search icon, the mark-all-read action, the \"see all\" footer, and each mobile drawer row", storyId: "atoms-buttons-button-button--default" },
    "Divider": { tier: "atom", role: "the rule between the account header and its action list, and between the drawer's nav rows and its language/theme rows", storyId: "atoms-display-divider-divider--default" },
    "Switch": { tier: "heroui", role: "the dark/light toggle — raw HeroUI Switch, see the component's file header for why no atom fits" },
    "Dropdown.Popover": { tier: "heroui", role: "the language menu's and the account menu's floating panel" },
    "Dropdown.Menu": { tier: "heroui", role: "the selectable list inside each of those panels" },
    "Dropdown.Section": { tier: "heroui", role: "the one section each of those menus groups its rows into" },
    "Dropdown.Item": { tier: "heroui", role: "one selectable row — a locale, or an account action" },
    "PopoverContent": { tier: "heroui", role: "the notification bell's floating panel" },
}

/** LEAF — the `@app-md:` desktop row: brand + pills on the left, search/locale/theme/cart/bell/account on the right. */
export const Desktop: Story = {
    render: () => (
        <BlockAnatomy
            name="Navbar"
            tier="block"
            leaf="Desktop"
            annotate={ANNOTATE}
            renderClassName="w-full"
            states={[
                {
                    name: "account.isAuthed = true, cartCount = 3, notifications.unreadCount = 2",
                    why: "The common signed-in case: a tote in the cart, a couple of unread notifications, and the account avatar in place of the generic user glyph. Every badge is visible without opening anything, which is exactly what a returning learner glances at first.",
                    code: `// props for this state — navItems / languages fixtures omitted
{
    isDarkMode: false,
    cartCount: 3,
    notifications: notificationsWithData, // unreadCount = 2
    account: authedAccount,               // isAuthed = true
    isMobileDrawerOpen: false,
}`,
                    render: (
                        <Navbar
                            onLogoPress={() => {}}
                            navItems={NAV_ITEMS}
                            searchPlaceholder="Tìm bài học, khoá học…"
                            shortcutLabel="Ctrl K"
                            onSearchPress={() => {}}
                            languages={LANGUAGES}
                            activeLocale="vi"
                            onLocaleChange={() => {}}
                            isDarkMode={false}
                            onThemeToggle={() => {}}
                            cartCount={3}
                            onCartPress={() => {}}
                            notifications={NOTIFICATIONS_WITH_DATA}
                            account={ACCOUNT_AUTHED}
                            isMobileDrawerOpen={false}
                            onMobileDrawerOpenChange={() => {}}
                        />
                    ),
                },
                {
                    name: "account.isAuthed = false",
                    why: "A guest still gets the full bar — cart and search work without an account, per the real component's own `if (!authenticated) return null` on the bell alone. The account trigger falls back to a plain user glyph and its menu offers sign in / sign up instead of dashboard/profile/sign out.",
                    code: `// props for this state
{
    cartCount: 1,
    notifications: quietNotifications,   // bell hides — no account
    account: { isAuthed: false, isLoading: false, menuItems: guestMenuItems },
    isMobileDrawerOpen: false,
}`,
                    render: (
                        <Navbar
                            onLogoPress={() => {}}
                            navItems={NAV_ITEMS}
                            searchPlaceholder="Tìm bài học, khoá học…"
                            shortcutLabel="Ctrl K"
                            onSearchPress={() => {}}
                            languages={LANGUAGES}
                            activeLocale="vi"
                            onLocaleChange={() => {}}
                            isDarkMode={false}
                            onThemeToggle={() => {}}
                            cartCount={1}
                            onCartPress={() => {}}
                            notifications={NOTIFICATIONS_QUIET}
                            account={ACCOUNT_GUEST}
                            isMobileDrawerOpen={false}
                            onMobileDrawerOpenChange={() => {}}
                        />
                    ),
                },
                {
                    name: "cartCount = 0, notifications.unreadCount = 0, isDarkMode = true",
                    why: "The quiet baseline: no badges anywhere, so the bell and cart glyphs sit bare, and the theme switch shows its dark (moon) position. Confirms the bar never collapses or shifts width just because a count drops to zero.",
                    code: `// props for this state
{
    cartCount: 0,
    notifications: quietNotifications,
    isDarkMode: true,
}`,
                    render: (
                        <Navbar
                            onLogoPress={() => {}}
                            navItems={NAV_ITEMS}
                            searchPlaceholder="Tìm bài học, khoá học…"
                            shortcutLabel="Ctrl K"
                            onSearchPress={() => {}}
                            languages={LANGUAGES}
                            activeLocale="en"
                            onLocaleChange={() => {}}
                            isDarkMode
                            onThemeToggle={() => {}}
                            cartCount={0}
                            onCartPress={() => {}}
                            notifications={NOTIFICATIONS_QUIET}
                            account={ACCOUNT_AUTHED}
                            isMobileDrawerOpen={false}
                            onMobileDrawerOpenChange={() => {}}
                        />
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — the collapsed mobile row: brand + search icon + cart/bell/account + the drawer trigger, no pills, no inline locale/theme. */
export const Mobile: Story = {
    render: () => (
        <BlockAnatomy
            name="Navbar"
            tier="block"
            leaf="Mobile"
            annotate={ANNOTATE}
            renderClassName="mx-auto w-[390px] border-x border-default"
            states={[
                {
                    name: "isMobileDrawerOpen = false",
                    why: "The collapsed bar a phone-width viewport actually shows: brand, a bare search icon (no field), cart/bell/account, and the expand icon standing in for the pills and the inline locale/theme controls this width can't fit.",
                    code: "// props for this state\n{ isMobileDrawerOpen: false }",
                    render: (
                        <Navbar
                            onLogoPress={() => {}}
                            navItems={NAV_ITEMS}
                            searchPlaceholder="Tìm bài học, khoá học…"
                            shortcutLabel="Ctrl K"
                            onSearchPress={() => {}}
                            languages={LANGUAGES}
                            activeLocale="vi"
                            onLocaleChange={() => {}}
                            isDarkMode={false}
                            onThemeToggle={() => {}}
                            cartCount={3}
                            onCartPress={() => {}}
                            notifications={NOTIFICATIONS_WITH_DATA}
                            account={ACCOUNT_AUTHED}
                            isMobileDrawerOpen={false}
                            onMobileDrawerOpenChange={() => {}}
                        />
                    ),
                },
                {
                    name: "isMobileDrawerOpen = true",
                    why: "The expand icon's whole reason to exist: the drawer carries the SAME `navItems` as full-width rows, then the language + theme controls this width hid from the primary bar — the one place they still live on mobile.",
                    code: "// props for this state\n{ isMobileDrawerOpen: true }",
                    render: (
                        <Navbar
                            onLogoPress={() => {}}
                            navItems={NAV_ITEMS}
                            searchPlaceholder="Tìm bài học, khoá học…"
                            shortcutLabel="Ctrl K"
                            onSearchPress={() => {}}
                            languages={LANGUAGES}
                            activeLocale="vi"
                            onLocaleChange={() => {}}
                            isDarkMode={false}
                            onThemeToggle={() => {}}
                            cartCount={3}
                            onCartPress={() => {}}
                            notifications={NOTIFICATIONS_WITH_DATA}
                            account={ACCOUNT_AUTHED}
                            isMobileDrawerOpen
                            onMobileDrawerOpenChange={() => {}}
                        />
                    ),
                },
            ]}
        />
    ),
}

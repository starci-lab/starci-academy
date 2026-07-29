import React, { useEffect, useState } from "react"
import {
    cn,
    Button as HeroButton,
    Dropdown,
    Kbd,
    Label,
    Popover,
    PopoverContent,
    Switch as HeroSwitch,
} from "@heroui/react"
import {
    BellIcon,
    ChecksIcon,
    CircleIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    ShoppingCartIcon,
    SidebarSimpleIcon,
    SunIcon,
    TranslateIcon,
    UserIcon,
} from "@phosphor-icons/react"
import { Logo } from "@sb-components/atoms/display/Logo/Logo"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Badge } from "@sb-components/atoms/display/Badge/Badge"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { UserCell } from "@sb-components/atoms/display/UserCell/UserCell"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button, ButtonRadioGroup, type IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import { InputButtonLike } from "@sb-components/composites/buttons/InputButtonLike/InputButtonLike"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { ListRow } from "@sb-components/composites/lists/List/List"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `Navbar`: the sticky top app bar. It owns the whole "what lives in
 * the header" vocabulary — brand + home link, the primary route nav, the
 * search entry point, locale + theme, cart/notifications/account, and the ONE
 * local (non-overlay-store) drawer that stands in for the desktop row on a
 * narrow viewport.
 *
 * PORTED FROM `src/components/features/navbar/Navbar` (the LIVE one — a sibling
 * `src/components/blocks/layout/shell/Navbar` also exists and is NOT wired into
 * `InnerLayout`; verified via `grep` before starting, see the run's research
 * notes). Structure, wording and behaviour below faithfully mirror that file
 * and its eight children (`Logo`/`NavLinks`/`SearchButton`/`LanguageDropdown`/
 * `DarkLightModeSwitch`/`CartButton`/`NotificationBell`/`AccountMenuDropdown`)
 * plus its `MobileNavbar` drawer — all folded into ONE file because this run's
 * contract is exactly two files (this component + its story).
 *
 * ⭐⭐ REUSE LEDGER — every child is either a real composite/atom already in this
 * Storybook, or (where none exists) a deliberate, documented drop to raw HeroUI:
 *   • desktop search field → `InputButtonLike` composite (verbatim placeholder +
 *     icon + `Kbd` suffix contract, same as `PriceTag`'s `Popover.Trigger` use).
 *   • desktop route pills → `Button.RadioGroup` atom. The real app hand-draws a
 *     `bg-accent-soft` pill; the atom's own selected/unselected skin (filled
 *     `tertiary` vs hollow `ghost`) is the closest CONTROL shape already owned by
 *     the system (single-select, one active value) — reusing it beats hand-
 *     rolling a third pill style. Judgement call, flagged here on purpose.
 *   • notification list rows → `ListRow` composite (`isSkeleton` mirrors the
 *     loading branch, same shape the real `ListRow` block gives them).
 *   • notification/account states → `AsyncContent` composite (error → loading →
 *     empty → content, same priority order as the real SWR-backed bell/menu).
 *   • account header row → `UserCell` atom (co-located skeleton, same shape the
 *     real `UserSummary` renders).
 *   • mobile nav panel → `DrawerShell` composite (per this run's instructions —
 *     NOT a hand-rolled `Drawer.Backdrop > … > Drawer.Dialog` tree).
 *   • theme switch (sun/moon glyph RIDING INSIDE the thumb) and the account /
 *     language dropdowns (a STATIC header region + a SEPARATOR + a sectioned
 *     action list, one single-select CHECK indicator) have no existing atom
 *     that reaches that anatomy — `Choice.Switch` has no thumb-icon slot,
 *     `Menu`/`Popover` atoms take a single flat/sectioned `items` list with no
 *     room for a non-item header block, and neither exposes a check indicator.
 *     These compose raw HeroUI (`Switch`, `Dropdown`/`Dropdown.Popover`/
 *     `Dropdown.Menu`/`Dropdown.Item`/`Dropdown.ItemIndicator`) directly, the
 *     same justified drop `PriceTag` already takes for its breakdown `Popover`.
 *   • cart / bell / account triggers → also raw HeroUI `Button` (`HeroButton`),
 *     for a THIRD reason: our `Button` atom's `isIconOnly` mode takes one bare
 *     `prefixIcon` COMPONENT — there is no slot for the `Badge` (cart/bell) or
 *     `Avatar` (authed account) each trigger anchors its glyph inside. Same
 *     "no `children`" gap `InputButtonLike` already documents for itself.
 *
 * ⭐ THE MOBILE DRAWER IS LOCAL STATE OWNED BY THE CALLER, NOT AN OVERLAY-STORE
 * SINGLETON (per this run's Rule 13 boundary: only `isMobileDrawerOpen` +
 * `onMobileDrawerOpenChange` are threaded in). The notification popover and the
 * two dropdown menus stay UNCONTROLLED (bare HeroUI open state) — nothing in
 * this run's prop contract asks for them to be controlled, and the atoms they
 * are built from (`Popover`/`Dropdown`) already default that way.
 *
 * ⭐ Ctrl/Cmd+K IS CARRIED OVER FROM THE REAL COMPONENT (not new wiring): the
 * real `Navbar` registers this listener on `window` itself and calls the SAME
 * `onSearchPress` prop it already owns — no new dependency, so it stays here
 * rather than being pushed out as "app wiring".
 *
 * ⛔ NO ReactNode SLOT ABOVE THIS BLOCK'S OWN ITEMS. Every list (`navItems`,
 * `languages`, `notifications.items`, `account.menuItems`) is typed DOMAIN DATA
 * (§14d.1) — a caller cannot smuggle a one-off node into any of these rows.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One top-level desktop/mobile route entry. */
export interface NavLinkItem {
    /** Stable id — also the value reported to the desktop pill group. */
    id: string
    /** Visible label, already localized by the caller. */
    label: string
    /** Whether this entry matches the current route. */
    isActive?: boolean
    /** Fired when the entry is picked (desktop pill or mobile drawer row). */
    onPress: () => void
}

/** One selectable locale in the language dropdown. */
export interface NavbarLanguageOption {
    /** Locale code (e.g. `"vi"`), also the value reported to `onLocaleChange`. */
    code: string
    /** Visible language name, already localized by the caller. */
    label: string
}

/** One row in the notification popover's list. */
export interface NavbarNotificationItem {
    /** Stable id. */
    id: string
    /** Primary line, already resolved/translated by the caller. */
    title: string
    /** Optional secondary line. */
    subtitle?: string
    /** Already-formatted relative time (e.g. "3 giờ trước") — locale math is app wiring. */
    timeLabel: string
    /** `false` renders the unread dot leading the row. */
    isRead: boolean
}

/** Notification bell data + the callbacks its popover fires. */
export interface NavbarNotificationsData {
    /** Drives the bell's count badge; `0` hides it. */
    unreadCount: number
    /** Most-recent page, newest first. */
    items: Array<NavbarNotificationItem>
    /** `true` while the FIRST page is loading (no cache yet). */
    isLoading: boolean
    /** Already-translated error message; `null`/absent → no error branch. */
    error?: string | null
    /** Fired when a row is pressed (mark-read + navigate is the caller's job). */
    onItemPress: (item: NavbarNotificationItem) => void
    /** Fired by the header's bulk action. */
    onMarkAllRead: () => void
    /** Fired by the footer's deep-link action. */
    onSeeAll: () => void
    /** Fired by the error branch's retry button. */
    onRetry: () => void
}

/** The signed-in viewer, as far as the account menu's header row needs to know. */
export interface NavbarAccountUser {
    /** Drives the avatar fallback + the header row's primary line. */
    username: string
    /** Shown as the header row's secondary `@handle` line. */
    email?: string
    /** Uploaded avatar URL; `Avatar`'s own fallback chain covers the rest. */
    avatarUrl?: string | null
}

/** One row of the account dropdown's action list — covers BOTH the guest rows
 * (sign in / sign up) and the authed rows (dashboard / profile / sign out); the
 * caller decides which set to hand in via {@link NavbarAccountData.isAuthed}. */
export interface NavbarAccountMenuItem {
    /** Stable id. */
    id: string
    /** Visible label, already localized. */
    label: string
    /** Leading glyph, atom-scale (`size-5`) as this block owns the icon column. */
    icon?: IconComponent
    /** `true` → renders in the destructive tone (e.g. "Sign out"). */
    isDanger?: boolean
    /** Fired when the row is pressed. */
    onPress: () => void
}

/** Account menu data + the one state flag its header/list branch on. */
export interface NavbarAccountData {
    /** `true` → header shows {@link NavbarAccountData.user}; `false` → the guest prompt. */
    isAuthed: boolean
    /** Present only when {@link NavbarAccountData.isAuthed}. */
    user?: NavbarAccountUser
    /** `true` while the shared "who am I" query has not resolved yet. */
    isLoading: boolean
    /** The action rows below the header (see {@link NavbarAccountMenuItem}). */
    menuItems: Array<NavbarAccountMenuItem>
}

/** Props for {@link Navbar}. */
export interface NavbarProps {
    /** Fired when the brand mark is pressed — routing "home" is the caller's call. */
    onLogoPress: () => void
    /** Route entries — the ONE source both the desktop pills and the mobile drawer read. */
    navItems: Array<NavLinkItem>

    /** Placeholder text for the desktop search field; doubles as the mobile icon's aria-label. */
    searchPlaceholder: string
    /** Already-formatted shortcut hint (e.g. `"Ctrl K"`, `"⌘K"`) — OS detection is app wiring. */
    shortcutLabel: string
    /** Fired when the search trigger (field or icon) is pressed, or Ctrl/Cmd+K is hit. */
    onSearchPress: () => void

    /** Selectable locales. */
    languages: Array<NavbarLanguageOption>
    /** Currently active locale — must match one entry's `code`. */
    activeLocale: string
    /** Fired with the newly picked locale code. */
    onLocaleChange: (code: string) => void

    /** Dark-mode on/off (controlled). */
    isDarkMode: boolean
    /** Fired with the new on/off state. */
    onThemeToggle: (isDark: boolean) => void

    /** Items currently in the cart; `0` hides the count badge. */
    cartCount: number
    /** Fired when the cart icon is pressed. */
    onCartPress: () => void

    /** Notification bell data + callbacks. */
    notifications: NavbarNotificationsData
    /** Account menu data + callbacks. */
    account: NavbarAccountData

    /** Whether the mobile navigation drawer is open. Controlled by the caller. */
    isMobileDrawerOpen: boolean
    /** Fired on backdrop click / Escape / the close button / a row navigating away. */
    onMobileDrawerOpenChange: (isOpen: boolean) => void

    /** Extra class on the root `<nav>` (placement only). */
    className?: string
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/** Props for the internal {@link NavbarLanguageMenu} control (desktop icon + mobile drawer row share it). */
interface NavbarLanguageMenuProps {
    languages: Array<NavbarLanguageOption>
    activeLocale: string
    onLocaleChange: (code: string) => void
    showAnatomy?: boolean
}

/**
 * Locale picker — raw HeroUI `Dropdown` (see file header: no atom here supports a
 * single-select CHECK indicator). Shared verbatim by the desktop icon row and the
 * mobile drawer row so the two never drift.
 */
const NavbarLanguageMenu = ({ languages, activeLocale, onLocaleChange, showAnatomy }: NavbarLanguageMenuProps) => (
    <Dropdown>
        <Button
            isIconOnly
            variant="ghost"
            prefixIcon={TranslateIcon}
            ariaLabel="Ngôn ngữ"
            anatPart={showAnatomy ? "Button" : undefined}
        />
        <Dropdown.Popover data-anat-part={showAnatomy ? "Dropdown.Popover" : undefined}>
            <Dropdown.Menu
                aria-label="Ngôn ngữ"
                selectionMode="single"
                selectedKeys={new Set([activeLocale])}
                onSelectionChange={(keys) => {
                    if (keys === "all") return
                    const next = [...keys][0]
                    if (next != null) onLocaleChange(String(next))
                }}
                data-anat-part={showAnatomy ? "Dropdown.Menu" : undefined}
            >
                <Dropdown.Section data-anat-part={showAnatomy ? "Dropdown.Section" : undefined}>
                    {languages.map((language) => (
                        <Dropdown.Item
                            key={language.code}
                            id={language.code}
                            textValue={language.label}
                            data-anat-part={showAnatomy ? "Dropdown.Item" : undefined}
                        >
                            <Dropdown.ItemIndicator />
                            <Label>{language.label}</Label>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Section>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown>
)

/** Props for the internal {@link NavbarThemeSwitch} control (desktop icon row + mobile drawer row share it). */
interface NavbarThemeSwitchProps {
    isDarkMode: boolean
    onThemeToggle: (isDark: boolean) => void
    showAnatomy?: boolean
}

/**
 * Dark/light toggle — raw HeroUI `Switch` (see file header: `Choice.Switch` has no
 * icon-in-thumb slot). Shared verbatim by the desktop row and the mobile drawer row.
 */
const NavbarThemeSwitch = ({ isDarkMode, onThemeToggle, showAnatomy }: NavbarThemeSwitchProps) => (
    <HeroSwitch
        isSelected={isDarkMode}
        onChange={onThemeToggle}
        aria-label="Bật/tắt giao diện tối"
        data-anat-part={showAnatomy ? "Switch" : undefined}
    >
        {({ isSelected }) => (
            <HeroSwitch.Content>
                <HeroSwitch.Control>
                    <HeroSwitch.Thumb>
                        <HeroSwitch.Icon>
                            {isSelected ? <MoonIcon className="size-5 text-inherit" /> : <SunIcon className="size-5 text-inherit" />}
                        </HeroSwitch.Icon>
                    </HeroSwitch.Thumb>
                </HeroSwitch.Control>
            </HeroSwitch.Content>
        )}
    </HeroSwitch>
)

/**
 * The sticky top app bar. See the file header for the full reuse ledger and the
 * judgement calls this port makes.
 *
 * @param props - {@link NavbarProps}
 */
const Navbar = ({
    onLogoPress,
    navItems,
    searchPlaceholder,
    shortcutLabel,
    onSearchPress,
    languages,
    activeLocale,
    onLocaleChange,
    isDarkMode,
    onThemeToggle,
    cartCount,
    onCartPress,
    notifications,
    account,
    isMobileDrawerOpen,
    onMobileDrawerOpenChange,
    className,
    anatPart,
    showAnatomy = false,
}: NavbarProps) => {
    const [isNotificationsOpen, setNotificationsOpen] = useState(false)
    const [isAccountOpen, setAccountOpen] = useState(false)

    // Ctrl/Cmd+K — carried over from the real component (see file header): it only
    // ever calls a prop this block already owns, so it is not new app wiring.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const isK = event.key?.toLowerCase() === "k"
            if (!isK || !(event.ctrlKey || event.metaKey)) return
            event.preventDefault()
            onSearchPress()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [onSearchPress])

    const activeNavId = navItems.find((item) => item.isActive)?.id ?? ""

    return (
        <nav
            data-anat-part={anatPart}
            className={cn("sticky top-0 z-50 border-b border-default bg-surface", className)}
        >
            {/* primary row — fixed 4rem tall, matching the real bar's height contract */}
            <StackH gap="section" justify="between" className="h-16 min-h-16 px-3" anatPart={showAnatomy ? "StackH" : undefined}>
                <StackH gap="section" anatPart={showAnatomy ? "StackH" : undefined}>
                    <span
                        role="button"
                        tabIndex={0}
                        aria-label="StarCi Academy"
                        onClick={onLogoPress}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") onLogoPress()
                        }}
                        className="inline-flex cursor-pointer items-center"
                    >
                        <Logo className="h-8 w-auto" />
                    </span>
                    {/* desktop-only route pills; the mobile drawer renders the same `navItems` as full rows */}
                    <ButtonRadioGroup
                        items={navItems.map((item) => ({
                            value: item.id,
                            content: <Typography size="sm" text={item.label} anatPart={showAnatomy ? "Typography" : undefined} />,
                        }))}
                        value={activeNavId}
                        onChange={(id) => navItems.find((item) => item.id === id)?.onPress()}
                        ariaLabel="Điều hướng chính"
                        className="hidden @app-md:flex"
                    />
                </StackH>

                <StackH gap="related" anatPart={showAnatomy ? "StackH" : undefined}>
                    {/* desktop: full input-style search field; mobile: icon only */}
                    <InputButtonLike
                        placeholder={searchPlaceholder}
                        icon={<MagnifyingGlassIcon className="size-5 text-muted" />}
                        suffix={<Kbd><Kbd.Content>{shortcutLabel}</Kbd.Content></Kbd>}
                        onPress={onSearchPress}
                        className="hidden w-[260px] @app-md:flex"
                    />
                    <Button
                        isIconOnly
                        variant="ghost"
                        prefixIcon={MagnifyingGlassIcon}
                        ariaLabel={searchPlaceholder}
                        onPress={onSearchPress}
                        className="@app-md:hidden"
                        anatPart={showAnatomy ? "Button" : undefined}
                    />

                    {/* desktop: language + theme inline; the mobile drawer carries them instead */}
                    <StackH gap="related" className="hidden @app-md:flex" anatPart={showAnatomy ? "StackH" : undefined}>
                        <NavbarLanguageMenu
                            languages={languages}
                            activeLocale={activeLocale}
                            onLocaleChange={onLocaleChange}
                            showAnatomy={showAnatomy}
                        />
                        <NavbarThemeSwitch isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} showAnatomy={showAnatomy} />
                    </StackH>

                    {/* cart — always shown (guests included), count badge only when non-empty.
                        Raw HeroUI `Button` (not our atom, see file header): the atom's
                        `isIconOnly` mode takes a single bare `prefixIcon` COMPONENT, with no
                        room for the `Badge` this trigger anchors around its glyph. */}
                    <HeroButton
                        isIconOnly
                        variant="tertiary"
                        className="rounded-full"
                        aria-label="Giỏ hàng"
                        onPress={onCartPress}
                        data-anat-part={showAnatomy ? "Button" : undefined}
                    >
                        <Badge color="accent" count={cartCount}>
                            <ShoppingCartIcon className="size-5" />
                        </Badge>
                    </HeroButton>

                    {/* notification bell — only meaningful for a signed-in viewer (carried over
                        from the real component's own `if (!authenticated) return null`). Raw
                        HeroUI Popover + Button (see file header: same badge-around-glyph gap as
                        the cart trigger above). */}
                    {account.isAuthed ? (
                        <Popover isOpen={isNotificationsOpen} onOpenChange={setNotificationsOpen}>
                            <HeroButton
                                isIconOnly
                                variant="tertiary"
                                className="rounded-full"
                                aria-label="Thông báo"
                                data-anat-part={showAnatomy ? "Button" : undefined}
                            >
                                <Badge color="danger" count={notifications.unreadCount}>
                                    <BellIcon className="size-5" />
                                </Badge>
                            </HeroButton>
                            <PopoverContent placement="bottom right" className="w-[360px]" data-anat-part={showAnatomy ? "PopoverContent" : undefined}>
                                <StackV gap="tight" className="px-2 py-1" anatPart={showAnatomy ? "StackV" : undefined}>
                                    <StackH gap="related" justify="between" anatPart={showAnatomy ? "StackH" : undefined}>
                                        <Typography size="sm" weight="bold" text="Thông báo" anatPart={showAnatomy ? "Typography" : undefined} />
                                        {notifications.unreadCount > 0 ? (
                                            <Button
                                                isIconOnly
                                                variant="ghost"
                                                size="sm"
                                                prefixIcon={ChecksIcon}
                                                ariaLabel="Đánh dấu tất cả đã đọc"
                                                onPress={notifications.onMarkAllRead}
                                                anatPart={showAnatomy ? "Button" : undefined}
                                            />
                                        ) : null}
                                    </StackH>
                                    <AsyncContent
                                        isLoading={notifications.isLoading && notifications.items.length === 0}
                                        skeleton={(
                                            <StackV gap="flush" anatPart={showAnatomy ? "StackV" : undefined}>
                                                {[0, 1, 2].map((row) => (
                                                    <ListRow key={row} title="" isSkeleton showAnatomy={showAnatomy} />
                                                ))}
                                            </StackV>
                                        )}
                                        isEmpty={notifications.items.length === 0}
                                        emptyContent={{ title: "Chưa có thông báo nào" }}
                                        error={notifications.error}
                                        errorContent={{
                                            title: notifications.error ?? "",
                                            onRetry: notifications.onRetry,
                                            retryLabel: "Thử lại",
                                        }}
                                    >
                                        <StackV gap="flush" className="max-h-[420px] overflow-y-auto" anatPart={showAnatomy ? "StackV" : undefined}>
                                            {notifications.items.map((item, index) => (
                                                <ListRow
                                                    key={item.id}
                                                    leading={!item.isRead ? (
                                                        <CircleIcon weight="fill" aria-hidden focusable="false" className="size-2 text-accent-soft-foreground" />
                                                    ) : undefined}
                                                    title={item.title}
                                                    subtitle={item.subtitle}
                                                    meta={<Typography size="xs" color="muted" text={item.timeLabel} anatPart={showAnatomy ? "Typography" : undefined} />}
                                                    onPress={() => notifications.onItemPress(item)}
                                                    divider={index < notifications.items.length - 1}
                                                    showAnatomy={showAnatomy}
                                                />
                                            ))}
                                        </StackV>
                                    </AsyncContent>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full"
                                        label="Xem tất cả"
                                        onPress={notifications.onSeeAll}
                                        anatPart={showAnatomy ? "Button" : undefined}
                                    />
                                </StackV>
                            </PopoverContent>
                        </Popover>
                    ) : null}

                    {/* account menu — raw HeroUI Dropdown + Button (see file header): the
                        authed trigger swaps its glyph for an `Avatar`, another shape the
                        atom's bare-`IconComponent` slot cannot host. */}
                    <Dropdown isOpen={isAccountOpen} onOpenChange={setAccountOpen}>
                        <HeroButton
                            isIconOnly
                            variant="tertiary"
                            className="rounded-full"
                            aria-label="Tài khoản"
                            data-anat-part={showAnatomy ? "Button" : undefined}
                        >
                            {account.isAuthed ? (
                                <Avatar
                                    size="sm"
                                    name={account.user?.username}
                                    src={account.user?.avatarUrl ?? undefined}
                                    seed={account.user?.email ?? account.user?.username}
                                />
                            ) : (
                                <UserIcon className="size-5" />
                            )}
                        </HeroButton>
                        <Dropdown.Popover placement="bottom right" className="w-[300px]" data-anat-part={showAnatomy ? "Dropdown.Popover" : undefined}>
                            <div className="p-3">
                                <AsyncContent
                                    isLoading={account.isLoading}
                                    skeleton={<UserCell username="" isSkeleton />}
                                >
                                    {account.isAuthed && account.user ? (
                                        <UserCell
                                            username={account.user.username}
                                            avatar={account.user.avatarUrl}
                                            handle={account.user.email}
                                        />
                                    ) : (
                                        <StackH gap="related" anatPart={showAnatomy ? "StackH" : undefined}>
                                            <Avatar icon={UserIcon} fallback="icon" />
                                            <Typography size="sm" color="muted" text="Đăng nhập để lưu tiến trình học tập" anatPart={showAnatomy ? "Typography" : undefined} />
                                        </StackH>
                                    )}
                                </AsyncContent>
                            </div>
                            <Divider anatPart={showAnatomy ? "Divider" : undefined} />
                            <Dropdown.Menu aria-label="Tài khoản" data-anat-part={showAnatomy ? "Dropdown.Menu" : undefined}>
                                <Dropdown.Section data-anat-part={showAnatomy ? "Dropdown.Section" : undefined}>
                                    {account.menuItems.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <Dropdown.Item
                                                key={item.id}
                                                id={item.id}
                                                textValue={item.label}
                                                className={item.isDanger ? "text-danger-soft-foreground" : undefined}
                                                onPress={item.onPress}
                                                data-anat-part={showAnatomy ? "Dropdown.Item" : undefined}
                                            >
                                                {Icon ? <Icon className="size-5" /> : null}
                                                <Label className={item.isDanger ? "text-danger-soft-foreground" : undefined}>{item.label}</Label>
                                            </Dropdown.Item>
                                        )
                                    })}
                                </Dropdown.Section>
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown>

                    {/* mobile: expand icon → the navigation drawer */}
                    <Button
                        isIconOnly
                        variant="ghost"
                        prefixIcon={SidebarSimpleIcon}
                        ariaLabel="Mở menu di động"
                        onPress={() => onMobileDrawerOpenChange(true)}
                        className="@app-md:hidden"
                        anatPart={showAnatomy ? "Button" : undefined}
                    />
                </StackH>
            </StackH>

            {/* mobile navigation drawer — the ONE local (non-overlay-store) drawer this run's
                contract calls for; every other overlay in this system opens through the global
                store (see canon Rule 13), this one is controlled straight by the caller. */}
            <DrawerShell
                isOpen={isMobileDrawerOpen}
                onOpenChange={onMobileDrawerOpenChange}
                placement="right"
                title="Menu di động"
                showAnatomy={showAnatomy}
            >
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                    <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined}>
                        {navItems.map((item) => (
                            <Button
                                key={item.id}
                                variant={item.isActive ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                label={item.label}
                                onPress={() => {
                                    item.onPress()
                                    onMobileDrawerOpenChange(false)
                                }}
                                anatPart={showAnatomy ? "Button" : undefined}
                            />
                        ))}
                    </StackV>
                    <Divider anatPart={showAnatomy ? "Divider" : undefined} />
                    {/* controls hidden from the mobile bar live here: language + theme */}
                    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                        <StackH gap="related" justify="between" anatPart={showAnatomy ? "StackH" : undefined}>
                            <Typography size="sm" text="Ngôn ngữ" anatPart={showAnatomy ? "Typography" : undefined} />
                            <NavbarLanguageMenu
                                languages={languages}
                                activeLocale={activeLocale}
                                onLocaleChange={onLocaleChange}
                                showAnatomy={showAnatomy}
                            />
                        </StackH>
                        <StackH gap="related" justify="between" anatPart={showAnatomy ? "StackH" : undefined}>
                            <Typography size="sm" text="Giao diện" anatPart={showAnatomy ? "Typography" : undefined} />
                            <NavbarThemeSwitch isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} showAnatomy={showAnatomy} />
                        </StackH>
                    </StackV>
                </StackV>
            </DrawerShell>
        </nav>
    )
}

export { Navbar }

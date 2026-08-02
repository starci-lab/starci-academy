import React, { useEffect, useState } from "react"
import { type SkeletonProps } from "@sb-components/composites/_slot"
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
import { UserCell } from "@sb-components/composites/lists/UserCell/UserCell"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button, type IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import { ButtonRadioGroup } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { InputButtonLike } from "@sb-components/composites/buttons/InputButtonLike/InputButtonLike"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { ListRow } from "@sb-components/composites/lists/List/List"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `Navbar` — the sticky top app bar. Two structural leaves: the desktop row
 * (route pills + inline language/theme) and the mobile collapsed row (icon bar
 * + drawer trigger) are different compositions. Signed-in vs guest, empty vs
 * busy badges, and drawer open vs closed are data, so they are states inside
 * the matching leaf. Both leaves render the same component (the `@app-md:`
 * rules live in its className), so the mobile leaf pins a narrow
 * `renderClassName` frame to force the collapsed row into view.
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
    /** Already-formatted relative time (e.g. "3 hours ago") — locale math is app wiring. */
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
}

/** Props for the internal {@link NavbarLanguageMenu} control (desktop icon + mobile drawer row share it). */
interface NavbarLanguageMenuProps {
    languages: Array<NavbarLanguageOption>
    activeLocale: string
    onLocaleChange: (code: string) => void
}

/**
 * Locale picker — raw HeroUI `Dropdown` (see file header: no atom here supports a
 * single-select CHECK indicator). Shared verbatim by the desktop icon row and the
 * mobile drawer row so the two never drift.
 */
const NavbarLanguageMenu = ({ languages, activeLocale, onLocaleChange }: NavbarLanguageMenuProps) => (
    <Dropdown>
        <Button
            isIconOnly
            variant="ghost"
            prefixIcon={TranslateIcon}
            ariaLabel="Language"

        />
        <Dropdown.Popover>
            <Dropdown.Menu
                aria-label="Language"
                selectionMode="single"
                selectedKeys={new Set([activeLocale])}
                onSelectionChange={(keys) => {
                    if (keys === "all") return
                    const next = [...keys][0]
                    if (next != null) onLocaleChange(String(next))
                }}

            >
                <Dropdown.Section>
                    {languages.map((language) => (
                        <Dropdown.Item
                            key={language.code}
                            id={language.code}
                            textValue={language.label}

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
}

/**
 * Dark/light toggle — raw HeroUI `Switch` (see file header: `Choice.Switch` has no
 * icon-in-thumb slot). Shared verbatim by the desktop row and the mobile drawer row.
 */
const NavbarThemeSwitch = ({ isDarkMode, onThemeToggle }: NavbarThemeSwitchProps) => (
    <HeroSwitch
        isSelected={isDarkMode}
        onChange={onThemeToggle}
        aria-label="Toggle dark mode"

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

    // desktop-only route pills; the mobile drawer renders the same `navItems` as full rows.
    // `hidden @app-md:flex` is the WRAPPER's call (showing/hiding at a breakpoint is the
    // surrounding frame's decision, not the atom's — ATOM-5), so it sits on this span,
    // not on `ButtonRadioGroup`'s own `className`.
    const logoAndNavPills = (
        <>
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
                <Logo />
            </span>
            <span className="hidden @app-md:flex">
                <ButtonRadioGroup
                    items={navItems.map((item) => ({
                        value: item.id,
                        content: <Typography size="sm" text={item.label} />,
                    }))}
                    value={activeNavId}
                    onChange={(id) => navItems.find((item) => item.id === id)?.onPress()}
                    ariaLabel="Main navigation"
                />
            </span>
        </>
    )

    // desktop: language + theme inline; the mobile drawer carries them instead
    const quickControls = (
        <>
            <NavbarLanguageMenu
                languages={languages}
                activeLocale={activeLocale}
                onLocaleChange={onLocaleChange}

            />
            <NavbarThemeSwitch isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />
        </>
    )

    const notificationSkeletonRows = [0, 1, 2].map((row) => (
        <ListRow key={row} title="" isSkeleton />
    ))

    const notificationRows = notifications.items.map((item, index) => (
        <ListRow
            key={item.id}
            leading={!item.isRead ? (
                ({ isSkeleton }: SkeletonProps) =>
                    isSkeleton ? null : <CircleIcon weight="fill" aria-hidden focusable="false" className="size-2 text-accent-soft-foreground" />
            ) : undefined}
            title={item.title}
            subtitle={item.subtitle}
            meta={() => <Typography size="xs" color="muted" text={item.timeLabel} />}
            onPress={() => notifications.onItemPress(item)}
            divider={index < notifications.items.length - 1}

        />
    ))

    const notificationHeader = (
        <>
            <Typography size="sm" weight="bold" text="Notifications" />
            {notifications.unreadCount > 0 ? (
                <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    prefixIcon={ChecksIcon}
                    ariaLabel="Mark all as read"
                    onPress={notifications.onMarkAllRead}

                />
            ) : null}
        </>
    )

    // notification popover body: header row → async list → footer link
    const notificationPanel = (
        <>
            <StackH gap={3} principles={["sibling-stack"]} justify="between" items={[() => notificationHeader]} />
            <AsyncContent
                isLoading={notifications.isLoading && notifications.items.length === 0}
                skeleton={() => <StackV gap={1} items={[() => notificationSkeletonRows]} />}
                isEmpty={notifications.items.length === 0}
                emptyContent={{ title: "No notifications yet" }}
                error={notifications.error}
                errorContent={{
                    title: notifications.error ?? "",
                    onRetry: notifications.onRetry,
                    retryLabel: "Try again",
                }}
                content={() => (
                    <div className="max-h-[420px] overflow-y-auto">
                        <StackV gap={1} items={[() => notificationRows]} />
                    </div>
                )}
            />
            <Button
                variant="ghost"
                size="sm"
                classNames={["w-full"]}
                label="See all"
                onPress={notifications.onSeeAll}

            />
        </>
    )

    const guestAccountRow = (
        <>
            <Avatar icon={UserIcon} fallback="icon" />
            <Typography size="sm" color="muted" text="Sign in to save your learning progress" />
        </>
    )

    const accountMenuHeader = (
        <AsyncContent
            isLoading={account.isLoading}
            skeleton={() => <UserCell username="" isSkeleton />}
            content={() => (account.isAuthed && account.user ? (
                <UserCell
                    username={account.user.username}
                    avatar={account.user.avatarUrl}
                    handle={account.user.email}
                />
            ) : (
                <StackH gap={3} items={[() => guestAccountRow]} />
            ))}
        />
    )

    // `InputButtonLike.suffix` is now a component reference (COMPOSITE-4/8), so the
    // keyboard-shortcut hint is wrapped as a small local component closing over
    // `shortcutLabel` instead of being built inline.
    const ShortcutHint = () => (
        <Kbd><Kbd.Content>{shortcutLabel}</Kbd.Content></Kbd>
    )

    // actions cluster: search · language/theme · cart · notifications · account · mobile menu
    const barActions = (
        <>
            {/* desktop: full input-style search field; mobile: icon only */}
            <span className="hidden w-[260px] @app-md:flex">
                <InputButtonLike
                    placeholder={searchPlaceholder}
                    icon={MagnifyingGlassIcon}
                    suffix={ShortcutHint}
                    onPress={onSearchPress}
                />
            </span>
            {/* `@app-md:hidden` moved off the atom onto this wrapper — a breakpoint
                show/hide is the surrounding frame's decision, not the atom's (ATOM-5). */}
            <span className="@app-md:hidden">
                <Button
                    isIconOnly
                    variant="ghost"
                    prefixIcon={MagnifyingGlassIcon}
                    ariaLabel={searchPlaceholder}
                    onPress={onSearchPress}

                />
            </span>

            <div className="hidden @app-md:flex">
                <StackH gap={3} items={[() => quickControls]} />
            </div>

            {/* cart — always shown (guests included), count badge only when non-empty.
                Raw HeroUI `Button` (not our atom, see file header): the atom's
                `isIconOnly` mode takes a single bare `prefixIcon` COMPONENT, with no
                room for the `Badge` this trigger anchors around its glyph. */}
            <HeroButton
                isIconOnly
                variant="tertiary"
                className="rounded-full"
                aria-label="Cart"
                onPress={onCartPress}

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
                        aria-label="Notifications"

                    >
                        <Badge color="danger" count={notifications.unreadCount}>
                            <BellIcon className="size-5" />
                        </Badge>
                    </HeroButton>
                    <PopoverContent placement="bottom right" className="w-[360px]">
                        {/* inset-exception: vendor popover body padding, wider than tall, not a surface inset */}
                        <StackV gap={2} principles={["control-pad"]} padding={{ x: 3, y: 2 }} items={[() => notificationPanel]} />
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
                    aria-label="Account"

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
                <Dropdown.Popover placement="bottom right" className="w-[300px]">
                    <StackV gap={1} padding={4} principles={["cell-pad"]} body={() => accountMenuHeader} />
                    <Divider />
                    <Dropdown.Menu aria-label="Account">
                        <Dropdown.Section>
                            {account.menuItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Dropdown.Item
                                        key={item.id}
                                        id={item.id}
                                        textValue={item.label}
                                        className={item.isDanger ? "text-danger-soft-foreground" : undefined}
                                        onPress={item.onPress}

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

            {/* mobile: expand icon → the navigation drawer. `@app-md:hidden` moved off the
                atom onto this wrapper (ATOM-5 — breakpoint visibility is the frame's call). */}
            <span className="@app-md:hidden">
                <Button
                    isIconOnly
                    variant="ghost"
                    prefixIcon={SidebarSimpleIcon}
                    ariaLabel="Open mobile menu"
                    onPress={() => onMobileDrawerOpenChange(true)}

                />
            </span>
        </>
    )

    // primary row — fixed 4rem tall, matching the real bar's height contract
    const primaryRow = (
        <>
            <StackH gap={6} items={[() => logoAndNavPills]} />
            <StackH gap={3} items={[() => barActions]} />
        </>
    )

    const mobileNavRows = navItems.map((item) => (
        <Button
            key={item.id}
            variant={item.isActive ? "secondary" : "ghost"}
            align="start"
            classNames={["w-full"]}
            label={item.label}
            onPress={() => {
                item.onPress()
                onMobileDrawerOpenChange(false)
            }}

        />
    ))

    const languageRow = (
        <>
            <Typography size="sm" text="Language" />
            <NavbarLanguageMenu
                languages={languages}
                activeLocale={activeLocale}
                onLocaleChange={onLocaleChange}

            />
        </>
    )

    const themeRow = (
        <>
            <Typography size="sm" text="Theme" />
            <NavbarThemeSwitch isDarkMode={isDarkMode} onThemeToggle={onThemeToggle} />
        </>
    )

    // controls hidden from the mobile bar live here: language + theme
    const drawerControls = (
        <>
            <StackH gap={3} principles={["sibling-stack"]} justify="between" items={[() => languageRow]} />
            <StackH gap={3} principles={["sibling-stack"]} justify="between" items={[() => themeRow]} />
        </>
    )

    const drawerNav = (
        <>
            <StackV gap={2} items={[() => mobileNavRows]} />
            <Divider />
            <StackV gap={4} items={[() => drawerControls]} />
        </>
    )

    return (
        <nav

            className={cn("sticky top-0 z-50 border-b border-default bg-surface", className)}
        >
            {/* primary row — fixed 4rem tall, matching the real bar's height contract */}
            <div className="h-16 min-h-16">
                <StackH
                    gap={6}
                    principles={["block-boundary"]}
                    justify="between"
                    padding={{ x: 4 }}

                    items={[() => primaryRow]}
                />
            </div>

            {/* mobile navigation drawer — the ONE local (non-overlay-store) drawer this run's
                contract calls for; every other overlay in this system opens through the global
                store (see canon Rule 13), this one is controlled straight by the caller. */}
            <DrawerShell
                isOpen={isMobileDrawerOpen}
                onOpenChange={onMobileDrawerOpenChange}
                placement="right"
                title="Mobile menu"

                body={() => <StackV gap={6} items={[() => drawerNav]} />}
            />
        </nav>
    )
}

export { Navbar }

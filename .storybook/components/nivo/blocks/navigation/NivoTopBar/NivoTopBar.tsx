import { MoonIcon, SunIcon, BellIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Badge } from "@sb-components/atoms/display/Badge/Badge"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * `NivoTopBar` — the dashboard shell's top bar. A left breadcrumb (`nivo /
 * <current section>`) plus a right-aligned cluster: theme toggle and the
 * notification bell. `isDark` and `unreadCount` are DATA, so they are STATES
 * of the single shape. The account trigger has moved OUT to `NivoSidebar`'s
 * own pinned account block, so this bar never duplicates an avatar.
 */

/** The left breadcrumb — root label (pressable, routes home) + the current section. */
export interface NivoTopBarBreadcrumb {
    /** Root label, e.g. `"nivo"`. */
    rootLabel: string
    /** Fired when the root segment is pressed — routes to the dashboard overview. */
    onRootPress: () => void
    /** The current section's label, e.g. `"Wallet"` — already localized by the caller. */
    currentLabel: string
}

/** Theme toggle data. */
export interface NivoTopBarTheme {
    /** `true` → dark mode is active (the toggle offers "switch to light"). */
    isDark: boolean
    /** Fired when the toggle is pressed. */
    onThemeToggle: () => void
}

/** Notification bell data. */
export interface NivoTopBarNotifications {
    /** Drives the bell's count badge; `0` hides it. */
    unreadCount: number
    /** Fired when the bell is pressed (open the notifications surface). */
    onOpen: () => void
}

/** Props for {@link NivoTopBar}. */
export interface NivoTopBarProps {
    /** Left breadcrumb data + callback. */
    breadcrumb: NivoTopBarBreadcrumb
    /** Theme toggle data + callback. */
    theme: NivoTopBarTheme
    /** Notification bell data + callback. */
    notifications: NivoTopBarNotifications
    /** Accessible label for the theme toggle — already localized. */
    themeToggleLabel: string
    /** Accessible label for the notification bell — already localized. */
    notificationsLabel: string
    /** Render the breadcrumb in its skeleton (loading) state — the theme toggle and bell stay live. */
    isSkeleton?: boolean
}

/** Bell trigger chrome — a plain button because the Badge must wrap the glyph (no atom hosts that). */
const BELL_TRIGGER = "inline-flex items-center justify-center rounded-full p-2 text-foreground transition-colors hover:bg-default/40"

/**
 * The dashboard top bar. See the file header for why the account trigger moved
 * out to `NivoSidebar` and why the breadcrumb is the bar's only data-owning part.
 *
 * @param props - {@link NivoTopBarProps}
 */
const NivoTopBar = ({
    breadcrumb,
    theme,
    notifications,
    themeToggleLabel,
    notificationsLabel,
    isSkeleton = false,
}: NivoTopBarProps) => (
    <header
        data-tier="block"
        data-component="NivoTopBar"
        className="flex h-16 items-center gap-3 border-b border-default bg-surface px-6"
    >
        {/* left breadcrumb — "nivo / <current section>"; the only data-owning part of the bar */}
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2">
            {isSkeleton ? (
                <Typography size="sm" isSkeleton />
            ) : (
                <>
                    <Typography
                        size="sm"
                        weight="semibold"
                        color="muted"
                        hoverColor="default"
                        isButton
                        text={breadcrumb.rootLabel}
                        onPress={breadcrumb.onRootPress}
                    />
                    <Typography size="sm" color="muted" text="/" />
                    <Typography size="sm" weight="bold" truncate text={breadcrumb.currentLabel} />
                </>
            )}
        </nav>

        <div className="flex-1" />

        <Button
            isIconOnly
            variant="ghost"
            size="sm"
            prefixIcon={theme.isDark ? SunIcon : MoonIcon}
            ariaLabel={themeToggleLabel}
            onPress={theme.onThemeToggle}
        />

        {/* Bell — plain button so `Badge` can anchor its count around the glyph, the same
            badge-around-glyph shape the real bar has and no icon-only atom can host. */}
        <button
            type="button"
            aria-label={notificationsLabel}
            onClick={notifications.onOpen}
            className={BELL_TRIGGER}
        >
            <Badge color="danger" count={notifications.unreadCount}>
                <BellIcon aria-hidden focusable="false" className="size-5" />
            </Badge>
        </button>
    </header>
)

export { NivoTopBar }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "NivoTopBar" } as const

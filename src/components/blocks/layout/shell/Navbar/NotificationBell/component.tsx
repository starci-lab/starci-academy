import {
    BellIcon,
    ChecksIcon as CheckDoubleIcon,
} from "@phosphor-icons/react"
import React, { useState } from "react"
import {
    Badge,
    Button,
    Popover,
    PopoverContent,
    Separator,
    Spinner,
    cn,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Largest unread count rendered verbatim on the badge before showing "9+". */
const MAX_BADGE = 9

/** One notification row, already resolved for display. */
export interface NotificationBellItem {
    /** Stable id — the row's React key. */
    id: string
    /** `false` → the row shows the unread dot + tint. */
    isRead: boolean
    /** Already-localized title line. */
    titleText: string
    /** Already-localized body line; `null` hides it. */
    bodyText: string | null
    /** Already-localized relative time ("3h ago"). */
    relativeLabel: string
    /** Fired when the row is pressed. */
    onPress: () => void
}

/** Props for {@link _NotificationBell} — presentational; all data + labels already resolved. */
export interface NotificationBellProps extends WithClassNames<undefined> {
    /** `false` → renders nothing (the bell is only meaningful for a signed-in viewer). */
    isAuthenticated: boolean
    /** The recent notification rows, already resolved. */
    items: Array<NotificationBellItem>
    /** Unread count driving the badge (capped display at {@link MAX_BADGE}+). */
    unreadCount: number
    /** `true` while the FIRST load is in flight (no items yet). */
    isLoading: boolean
    /** Already-localized bell trigger aria-label ("Notifications"). */
    bellAriaLabel: string
    /** Already-localized popover header title. */
    titleLabel: string
    /** Already-localized "Mark all read" action label. */
    markAllReadLabel: string
    /** Already-localized empty-state message. */
    emptyLabel: string
    /** Fired when "Mark all read" is pressed. */
    onMarkAllRead: () => void
}

/**
 * NotificationBell — navbar bell with an unread-count badge and a popover list.
 *
 * @param props - {@link NotificationBellProps}
 */
export const _NotificationBell = ({
    isAuthenticated,
    items,
    unreadCount,
    isLoading,
    bellAriaLabel,
    titleLabel,
    markAllReadLabel,
    emptyLabel,
    onMarkAllRead,
    className,
}: NotificationBellProps) => {
    const [isOpen, setOpen] = useState(false)

    // the bell is only meaningful for an authenticated viewer
    if (!isAuthenticated) {
        return null
    }

    /** Badge label, capped at {@link MAX_BADGE} (e.g. "9+"). */
    const badgeLabel = unreadCount > MAX_BADGE ? `${MAX_BADGE}+` : `${unreadCount}`

    return (
        <Popover isOpen={isOpen} onOpenChange={setOpen}>
            <Button
                isIconOnly
                variant="tertiary"
                className={cn("rounded-full", className)}
                aria-label={bellAriaLabel}
            >
                {unreadCount > 0 ? (
                    <Badge.Anchor>
                        <BellIcon className="size-5" />
                        <Badge size="sm" color="danger">{badgeLabel}</Badge>
                    </Badge.Anchor>
                ) : (
                    <BellIcon className="size-5" />
                )}
            </Button>
            <PopoverContent placement="bottom right" className="w-[360px] overflow-hidden p-0">
                {/* header: title + mark-all-read action */}
                <div className="flex items-center justify-between gap-3 p-3">
                    <span className="text-sm font-semibold text-foreground">
                        {titleLabel}
                    </span>
                    {unreadCount > 0 ? (
                        <Button
                            size="sm"
                            variant="tertiary"
                            onPress={onMarkAllRead}
                            className="gap-2"
                        >
                            <CheckDoubleIcon className="size-5" />
                            <span className="text-xs">{markAllReadLabel}</span>
                        </Button>
                    ) : null}
                </div>
                <Separator />

                {/* body: loading / empty / list */}
                {isLoading && items.length === 0 ? (
                    <div className="flex items-center justify-center p-6">
                        <Spinner size="sm" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted">
                        {emptyLabel}
                    </div>
                ) : (
                    <div className="flex max-h-[420px] flex-col overflow-y-auto">
                        {items.map((notification) => (
                            <button
                                key={notification.id}
                                type="button"
                                onClick={() => {
                                    setOpen(false)
                                    notification.onPress()
                                }}
                                className={cn(
                                    "flex flex-col gap-2 px-3 py-3 text-left hover:bg-default/40",
                                    !notification.isRead && "bg-primary/5",
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    {!notification.isRead ? (
                                        <span className="size-2 shrink-0 rounded-full bg-primary" />
                                    ) : null}
                                    <span className="flex-1 text-sm font-medium text-foreground">
                                        {notification.titleText}
                                    </span>
                                </div>
                                {notification.bodyText ? (
                                    <span className="text-xs text-muted">
                                        {notification.bodyText}
                                    </span>
                                ) : null}
                                <span className="text-[11px] text-muted">
                                    {notification.relativeLabel}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}

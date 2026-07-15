import React from "react"
import { Badge, Button, cn, Popover, PopoverContent } from "@heroui/react"
import { BellIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { NotificationList } from "@/components/blocks/notifications/NotificationList"
import type { NotificationGroup } from "@/components/blocks/notifications/NotificationList"

/** Largest unread count rendered verbatim on the badge before showing "9+". */
const MAX_BADGE = 9

/** Props for {@link NotificationBell}. */
export interface NotificationBellProps extends WithClassNames<undefined> {
    /**
     * Number of unread notifications. Drives the count badge: hidden entirely at
     * zero, capped at {@link MAX_BADGE} ("9+") above the threshold.
     */
    unreadCount: number
    /**
     * The day-grouped sections rendered inside the popover's
     * {@link NotificationList}. Empty groups fall back to the list's empty state.
     */
    groups: NotificationGroup[]
    /**
     * Optional handler for the list header's mark-all-read text button. When
     * omitted the button is not shown. No-op-able.
     */
    onMarkAllRead?: () => void
    /**
     * Optional popover header title. Defaults to "Thông báo".
     */
    title?: React.ReactNode
    /**
     * Optional custom empty state forwarded to the inner {@link NotificationList}
     * when there are no items.
     */
    emptyState?: React.ReactNode
    /**
     * Accessible label for the icon button (screen-reader name). Defaults to
     * "Thông báo".
     */
    ariaLabel?: string
    /**
     * Optional controlled open state of the popover. Pair with
     * {@link NotificationBellProps.onOpenChange}. Omit for uncontrolled behavior.
     */
    isOpen?: boolean
    /**
     * Optional open-state change handler. Fires with the next open value when the
     * trigger or an outside interaction toggles the popover.
     */
    onOpenChange?: (isOpen: boolean) => void
}

/**
 * NotificationBell — a bell icon button carrying an unread-count
 * {@link Badge} that opens a {@link Popover} of recent notifications
 * ({@link NotificationList}). The badge is hidden at zero and capped at "9+".
 * Supports both controlled ({@link NotificationBellProps.isOpen} +
 * {@link NotificationBellProps.onOpenChange}) and uncontrolled open state.
 *
 * Tier-3 presentational block: props-only, no store, no SWR, no side-effects.
 * The owning feature supplies the unread count and the grouped, pre-formatted
 * notification rows.
 *
 * @param props - {@link NotificationBellProps}
 *
 * @example
 * <NotificationBell
 *   unreadCount={3}
 *   groups={[{ label: "Hôm nay", items: [...] }]}
 *   onMarkAllRead={() => {}}
 * />
 */
export const NotificationBell = ({
    unreadCount,
    groups,
    onMarkAllRead,
    title = "Thông báo",
    emptyState,
    ariaLabel = "Thông báo",
    isOpen,
    onOpenChange,
    className,
}: NotificationBellProps) => {
    /** Badge label, capped at {@link MAX_BADGE} (e.g. "9+"). */
    const badgeLabel = unreadCount > MAX_BADGE ? `${MAX_BADGE}+` : `${unreadCount}`

    return (
        <Popover isOpen={isOpen} onOpenChange={onOpenChange}>
            <Button
                isIconOnly
                variant="tertiary"
                className={cn("rounded-full", className)}
                aria-label={ariaLabel}
            >
                {unreadCount > 0 ? (
                    <Badge.Anchor>
                        <BellIcon className="size-5" />
                        <Badge size="sm" color="danger">
                            {badgeLabel}
                        </Badge>
                    </Badge.Anchor>
                ) : (
                    <BellIcon className="size-5" />
                )}
            </Button>
            <PopoverContent
                placement="bottom right"
                className="w-[360px] overflow-hidden p-1"
            >
                <NotificationList
                    title={title}
                    groups={groups}
                    onMarkAllRead={onMarkAllRead}
                    emptyState={emptyState}
                />
            </PopoverContent>
        </Popover>
    )
}

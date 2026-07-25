import React from "react"
import { Badge, cn, Popover, PopoverContent } from "@heroui/react"
import { BellIcon } from "@phosphor-icons/react"
import { NotificationList } from "../NotificationList/NotificationList"
import type { NotificationGroup } from "../NotificationList/NotificationList"
import { Button } from "../../buttons/Button/Button"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported faithfully from
 * `@/components/blocks/notifications/NotificationBell`. Authored in Storybook
 * (not `src`); synced to `src` later. Composes the local primitive
 * `NotificationList` inside a HeroUI Popover. The shared `WithClassNames` base is
 * inlined locally to keep the port free of `@/` imports.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

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
    /**
     * Dev-only: when set, each part this block owns emits a `data-anat-part`
     * attribute so the Storybook anatomy overlay can anchor a numbered badge to
     * it. Off in production. Forwarded to the `Button` trigger (`anatPart`) and
     * cascaded into `NotificationList` (`showAnatomy` + `anatPart`), which in
     * turn cascades into its own children. The `Popover` root is a context
     * provider (react-aria `DialogTrigger`) that renders no DOM node, so it
     * cannot carry the attribute — it is not represented as a node in this
     * leaf's anatomy tree either.
     */
    showAnatomy?: boolean
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
    showAnatomy,
}: NotificationBellProps) => {
    /** Badge label, capped at {@link MAX_BADGE} (e.g. "9+"). */
    const badgeLabel = unreadCount > MAX_BADGE ? `${MAX_BADGE}+` : `${unreadCount}`

    return (
        <Popover isOpen={isOpen} onOpenChange={onOpenChange}>
            <Button
                iconOnly
                variant="tertiary"
                className={cn("rounded-full", className)}
                ariaLabel={ariaLabel}
                anatPart={showAnatomy ? "Button.IconOnly" : undefined}
                icon={
                    unreadCount > 0 ? (
                        <Badge.Anchor data-anat-part={showAnatomy ? "Badge.Anchor" : undefined}>
                            <BellIcon
                                className="size-5"
                                data-anat-part={showAnatomy ? "BellIcon" : undefined}
                            />
                            <Badge
                                size="sm"
                                color="danger"
                                data-anat-part={showAnatomy ? "Badge" : undefined}
                            >
                                {badgeLabel}
                            </Badge>
                        </Badge.Anchor>
                    ) : (
                        <BellIcon
                            className="size-5"
                            data-anat-part={showAnatomy ? "BellIcon" : undefined}
                        />
                    )
                }
            />
            <PopoverContent
                placement="bottom right"
                className="w-[360px] overflow-hidden p-1"
                data-anat-part={showAnatomy ? "PopoverContent" : undefined}
            >
                <NotificationList
                    title={title}
                    groups={groups}
                    onMarkAllRead={onMarkAllRead}
                    emptyState={emptyState}
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "NotificationList" : undefined}
                />
            </PopoverContent>
        </Popover>
    )
}

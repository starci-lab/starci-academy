import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ChecksIcon } from "@phosphor-icons/react"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { NotificationItem } from "@sb-components/_legacy/designs/notifications/NotificationItem/NotificationItem"
import type { NotificationItemProps } from "@sb-components/_legacy/designs/notifications/NotificationItem/NotificationItem"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported faithfully from
 * `@/components/blocks/notifications/NotificationList`. Authored in Storybook
 * (not `src`); synced to `src` later. Composes the local primitives
 * `NotificationItem` (rows) + `Feedback.Empty` (empty fallback). The shared
 * `WithClassNames` base is inlined locally to keep the port free of `@/` imports.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/**
 * One day-group section of a {@link NotificationList}: an optional label (e.g.
 * "Hôm nay" / "Trước đó") followed by its notification rows. Omit `label` for an
 * ungrouped run of items.
 */
export interface NotificationGroup {
    /**
     * Optional section heading rendered small + muted above the group (e.g.
     * "Hôm nay", "Trước đó"). Omit for an unlabeled group.
     */
    label?: ReactNode
    /** The notification rows belonging to this section, in display order. */
    items: NotificationItemProps[]
}

/** Props for {@link NotificationList}. */
export interface NotificationListProps extends WithClassNames<undefined> {
    /**
     * The day-grouped sections to render, top to bottom. Each group carries an
     * optional label and its rows. When every group is empty (or the array is
     * empty) the {@link NotificationListProps.emptyState} is shown instead.
     */
    groups: NotificationGroup[]
    /**
     * Optional header title. When provided a header row renders with this title
     * and — when {@link NotificationListProps.onMarkAllRead} is set — a
     * "Đánh dấu tất cả đã đọc" text button. Omit for a bare list.
     */
    title?: ReactNode
    /**
     * Optional handler for the header's mark-all-read text button. When omitted
     * the button is not shown. No-op-able.
     */
    onMarkAllRead?: () => void
    /**
     * Optional label for the mark-all-read button. Defaults to
     * "Đánh dấu tất cả đã đọc". Only rendered when
     * {@link NotificationListProps.onMarkAllRead} is set.
     */
    markAllReadLabel?: ReactNode
    /**
     * Optional custom empty state shown when there are no items. Falls back to a
     * built-in {@link Feedback.Empty} ("Chưa có thông báo nào") when omitted.
     */
    emptyState?: ReactNode
    /**
     * Storybook-only: when true, each composed part emits a `data-anat-part`
     * attribute so the anatomy overlay can anchor badges. No visual effect.
     */
    showAnatomy?: boolean
    /**
     * Anatomy tag for this list's own root (set by a parent block composing it
     * as a sub-node, e.g. `NotificationBell` passing `"NotificationList"`).
     */
    anatPart?: string
}

/** Built-in fallback empty state shown when no groups carry any items. */
const DefaultEmptyState = (anatPart?: string) => (
    <Feedback.Empty
        title="Chưa có thông báo nào"
        description="Khi có hoạt động mới trên khoá học của bạn, thông báo sẽ xuất hiện ở đây."
        anatPart={anatPart}
    />
)

/**
 * NotificationList — a scrollable, optionally day-grouped list of
 * {@link NotificationItem} rows. Renders an optional header ("Thông báo" + a
 * mark-all-read text button), section labels per group ("Hôm nay" / "Trước
 * đó"), and a {@link Feedback.Empty} when no items are present. The body scrolls
 * inside a capped max height so a long history never grows the container.
 *
 * Tier-3 presentational block: props-only, no store, no SWR, no side-effects.
 * The owning feature groups notifications by day and passes pre-formatted rows.
 *
 * @param props - {@link NotificationListProps}
 */
export const NotificationList = ({
    groups,
    title,
    onMarkAllRead,
    markAllReadLabel = "Đánh dấu tất cả đã đọc",
    emptyState,
    showAnatomy = false,
    anatPart,
    className,
}: NotificationListProps) => {
    const isEmpty = groups.every((group) => group.items.length === 0)

    return (
        <div className={cn("flex flex-col", className)} data-anat-part={anatPart}>
            {title ? (
                <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <span data-anat-part={showAnatomy ? "Typography.Header" : undefined}>
                        <Typography.Base size="sm" text={title} weight="medium" />
                    </span>
                    {onMarkAllRead ? (
                        // NOTE: port Button's `icon` prop is TRAILING-only (§5b) — this row needs a
                        // LEADING check icon before the label, so it's composed via `children`
                        // (not `icon`) to keep the exact leading order/visual.
                        <Button
                            size="sm"
                            variant="tertiary"
                            onPress={onMarkAllRead}
                            className="gap-2"
                            anatPart={showAnatomy ? "Button" : undefined}
                        >
                            <ChecksIcon
                                className="size-4"
                                data-anat-part={showAnatomy ? "ChecksIcon" : undefined}
                            />
                            <Typography.Base size="xs" text={markAllReadLabel} />
                        </Button>
                    ) : null}
                </div>
            ) : null}

            {isEmpty ? (
                emptyState ?? DefaultEmptyState(showAnatomy ? "Feedback.Empty" : undefined)
            ) : (
                <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto p-1">
                    {groups.map((group, groupIndex) =>
                        group.items.length > 0 ? (
                            <div key={groupIndex} className="flex flex-col gap-1">
                                {group.label ? (
                                    <span data-anat-part={showAnatomy ? "Typography.GroupLabel" : undefined}>
                                        <Typography.Base size="xs" text={group.label} color="muted" weight="medium" className="px-3 pt-1" />
                                    </span>
                                ) : null}
                                {group.items.map((item, itemIndex) => (
                                    <NotificationItem
                                        key={itemIndex}
                                        {...item}
                                        showAnatomy={showAnatomy}
                                        anatPart={showAnatomy ? "NotificationItem" : undefined}
                                    />
                                ))}
                            </div>
                        ) : null,
                    )}
                </div>
            )}
        </div>
    )
}

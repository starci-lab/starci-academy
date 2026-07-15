import React from "react"
import type { ReactNode } from "react"
import { Button, cn, Typography } from "@heroui/react"
import { ChecksIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { NotificationItem } from "@/components/blocks/notifications/NotificationItem"
import type { NotificationItemProps } from "@/components/blocks/notifications/NotificationItem"

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
     * built-in {@link EmptyState} ("Chưa có thông báo nào") when omitted.
     */
    emptyState?: ReactNode
}

/** Built-in fallback empty state shown when no groups carry any items. */
const DefaultEmptyState = (
    <EmptyState
        title="Chưa có thông báo nào"
        description="Khi có hoạt động mới trên khoá học của bạn, thông báo sẽ xuất hiện ở đây."
    />
)

/**
 * NotificationList — a scrollable, optionally day-grouped list of
 * {@link NotificationItem} rows. Renders an optional header ("Thông báo" + a
 * mark-all-read text button), section labels per group ("Hôm nay" / "Trước
 * đó"), and an {@link EmptyState} when no items are present. The body scrolls
 * inside a capped max height so a long history never grows the container.
 *
 * Tier-3 presentational block: props-only, no store, no SWR, no side-effects.
 * The owning feature groups notifications by day and passes pre-formatted rows.
 *
 * @param props - {@link NotificationListProps}
 *
 * @example
 * <NotificationList
 *   title="Thông báo"
 *   onMarkAllRead={() => {}}
 *   groups={[{ label: "Hôm nay", items: [...] }]}
 * />
 */
export const NotificationList = ({
    groups,
    title,
    onMarkAllRead,
    markAllReadLabel = "Đánh dấu tất cả đã đọc",
    emptyState,
    className,
}: NotificationListProps) => {
    const isEmpty = groups.every((group) => group.items.length === 0)

    return (
        <div className={cn("flex flex-col", className)}>
            {title ? (
                <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <Typography type="body-sm" weight="semibold">
                        {title}
                    </Typography>
                    {onMarkAllRead ? (
                        <Button
                            size="sm"
                            variant="tertiary"
                            onPress={onMarkAllRead}
                            className="gap-2"
                        >
                            <ChecksIcon className="size-4" />
                            <Typography type="body-xs">{markAllReadLabel}</Typography>
                        </Button>
                    ) : null}
                </div>
            ) : null}

            {isEmpty ? (
                emptyState ?? DefaultEmptyState
            ) : (
                <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto p-1">
                    {groups.map((group, groupIndex) =>
                        group.items.length > 0 ? (
                            <div key={groupIndex} className="flex flex-col gap-1">
                                {group.label ? (
                                    <Typography
                                        type="body-xs"
                                        color="muted"
                                        weight="medium"
                                        className="px-3 pt-1"
                                    >
                                        {group.label}
                                    </Typography>
                                ) : null}
                                {group.items.map((item, itemIndex) => (
                                    <NotificationItem key={itemIndex} {...item} />
                                ))}
                            </div>
                        ) : null,
                    )}
                </div>
            )}
        </div>
    )
}

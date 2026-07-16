import React from "react"
import type { ReactNode } from "react"
import { cn, Typography } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Visual tone of a {@link NotificationItem}. Drives ONLY the color of the
 * leading icon tile (never a `bg-<status>/10` overlay — soft tokens only), so a
 * notification kind can read at a glance:
 * - `default` — neutral system / informational message
 * - `success` — a positive outcome (bài nộp đã chấm đạt, chứng chỉ đã cấp)
 * - `warning` — an at-risk nudge (nhắc duy trì streak, sắp trễ hạn)
 * - `accent` — a brand / opportunity event (khoá học mới mở, có người trả lời)
 */
export type NotificationTone = "default" | "success" | "warning" | "accent"

/** Props for {@link NotificationItem}. */
export interface NotificationItemProps extends WithClassNames<undefined> {
    /**
     * Primary line describing what happened. Rendered medium-weight foreground
     * and clamped to two lines. The caller localizes it (pass a `t()` result).
     */
    title: ReactNode
    /**
     * Optional secondary detail line beneath the title, rendered smaller and
     * muted (e.g. the graded score, the replier's excerpt). Omit for a
     * title-only row.
     */
    body?: ReactNode
    /**
     * PREFORMATTED relative time string shown muted at the row's foot (e.g.
     * "2 giờ trước"). The block never calls `new Date()` — the caller supplies
     * an already-formatted, localized label.
     */
    timeLabel: ReactNode
    /**
     * Optional leading visual, typically a Phosphor icon (or a small avatar).
     * When provided it is wrapped in a rounded tile whose color derives from
     * {@link NotificationItemProps.tone}. Omit for a text-only row.
     */
    icon?: ReactNode
    /**
     * Color tone of the leading icon tile. Defaults to `"default"`. Has no
     * effect when {@link NotificationItemProps.icon} is omitted.
     */
    tone?: NotificationTone
    /**
     * When true the row reads as unread: a subtle `bg-accent-soft` tint plus an
     * accent dot beside the title. Omit / false for an already-read row.
     */
    isUnread?: boolean
    /**
     * Optional press handler. When provided the whole row becomes interactive
     * (hover surface, keyboard + screen-reader accessible). No-op-able.
     */
    onPress?: () => void
    /**
     * Optional trailing node aligned to the row's end — typically a compact
     * action (Button / icon button) or a status chip. Kept at its intrinsic
     * size and never compresses the text column.
     */
    actionSlot?: ReactNode
}

/**
 * Maps a {@link NotificationTone} to the leading tile's background + foreground
 * token pair. Soft surface tokens only — never a `bg-<status>/10` overlay.
 */
const TONE_TILE: Record<NotificationTone, string> = {
    default: "bg-default text-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
    accent: "bg-accent-soft text-accent-soft-foreground",
}

/**
 * NotificationItem — one notification row on a learning platform. Lays out an
 * optional tone-colored leading icon tile, a title + optional body text column,
 * a preformatted relative-time label, an unread indicator (accent dot + subtle
 * row tint), and an optional trailing action slot. The whole row is pressable
 * when {@link NotificationItemProps.onPress} is supplied.
 *
 * Tier-3 presentational block: props-only, no store, no SWR, no side-effects.
 * The owning feature maps a notification kind to the `icon`/`tone` and passes
 * pre-formatted, localized copy and time.
 *
 * @param props - {@link NotificationItemProps}
 *
 * @example
 * <NotificationItem
 *   icon={<CheckCircleIcon />}
 *   tone="success"
 *   title="Bài nộp của bạn đã được chấm điểm"
 *   body="Thử thách API Gateway — đạt 92/100"
 *   timeLabel="2 giờ trước"
 *   isUnread
 *   onPress={() => {}}
 * />
 * @see Story: .storybook/stories/blocks/notifications/NotificationItem/NotificationItem.stories
 */
export const NotificationItem = ({
    title,
    body,
    timeLabel,
    icon,
    tone = "default",
    isUnread = false,
    onPress,
    actionSlot,
    className,
}: NotificationItemProps) => {
    const isPressable = Boolean(onPress)

    const content = (
        <>
            {icon ? (
                <span
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-2xl [&>svg]:size-5",
                        TONE_TILE[tone],
                    )}
                >
                    {icon}
                </span>
            ) : null}

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex min-w-0 items-start gap-2">
                    {isUnread ? (
                        // accent dot — the primary unread signal beside the title
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-accent" />
                    ) : null}
                    <Typography type="body-sm" weight="medium" className="line-clamp-2">
                        {title}
                    </Typography>
                </div>
                {body ? (
                    <Typography type="body-xs" color="muted" className="line-clamp-2">
                        {body}
                    </Typography>
                ) : null}
                <Typography type="body-xs" color="muted">
                    {timeLabel}
                </Typography>
            </div>

            {actionSlot ? <div className="shrink-0">{actionSlot}</div> : null}
        </>
    )

    const baseClassName = cn(
        "flex w-full items-start gap-3 rounded-2xl p-3 text-left",
        // subtle row tint when unread — soft token, never a status overlay
        isUnread && "bg-accent-soft",
        isPressable &&
            "transition-colors hover:bg-surface-secondary focus-visible:bg-surface-secondary focus-visible:outline-none",
        className,
    )

    if (isPressable) {
        return (
            <div
                role="button"
                tabIndex={0}
                onClick={onPress}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onPress?.()
                    }
                }}
                className={cn(baseClassName, "cursor-pointer")}
            >
                {content}
            </div>
        )
    }

    return <div className={baseClassName}>{content}</div>
}

import React from "react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"

/** Props for {@link _GradeCreditCaption} — presentational; the caption text already resolved. */
export interface GradeCreditCaptionProps {
    /**
     * `null`/`undefined` while `creditUsage` hasn't landed yet → the caption
     * renders NOTHING (mirrors the connected half's own "no snapshot" branch).
     */
    text: string | null | undefined
    /** `true` → render the danger/warning styling (quota reached). */
    blocked: boolean
    /** Optional press → open the AI-quota details modal (makes the caption interactive). */
    onOpenDetails?: () => void
}

/**
 * The ONE shared "N/M credits left this week" caption for every AI surface, sitting
 * directly under (or beside) the model picker. Shows a muted line normally, or a
 * `text-danger-soft-foreground` warning line (with icon) when the pool can't afford
 * the next AUTO run. The connected half decides `text`/`blocked` from `myAiQuota`.
 *
 * @param props - {@link GradeCreditCaptionProps}
 */
export const _GradeCreditCaption = ({
    text,
    blocked,
    onOpenDetails,
}: GradeCreditCaptionProps) => {
    if (text == null) {
        return null
    }

    const content = (
        <span className={cn(
            "inline-flex items-center gap-1 text-sm",
            blocked ? "font-medium text-danger-soft-foreground" : "text-muted",
        )}
        >
            {blocked ? <WarningCircleIcon aria-hidden className="size-4 shrink-0" /> : null}
            {text}
        </span>
    )

    if (onOpenDetails) {
        return (
            <button
                type="button"
                onClick={onOpenDetails}
                className="w-fit cursor-pointer outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-accent"
            >
                {content}
            </button>
        )
    }

    return <span>{content}</span>
}

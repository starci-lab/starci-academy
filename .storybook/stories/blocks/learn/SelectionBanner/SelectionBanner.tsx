import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import { QuotesIcon, XIcon } from "@phosphor-icons/react"
import { InlineIconLabel } from "../../text/InlineIconLabel/InlineIconLabel"
import { Button } from "../../buttons/Button/Button"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/features/learn/ContentAiChat/index.tsx:1296-1313`. Authored in
 * Storybook (not `src`); synced later.
 *
 * SHAPE — the "you're asking about this passage" banner pinned at the top of the
 * side-thread selection view: a warning-toned bordered card holding a quoted
 * excerpt (leading quote icon + clamped text, {@link InlineIconLabel} tone="warning")
 * plus a dismiss action to clear the selection, and an optional muted note below
 * explaining the side-thread is born-archived (kept, but off the main list).
 *
 * PORT NOTE — the source Typography for the passage is `weight="medium"`;
 * {@link InlineIconLabel} doesn't expose a `weight` prop (its Typography call is
 * fixed), so that emphasis is not reproduced here — reusing the shared tone+icon
 * primitive (per instruction) over hand-rolling wins over that one detail. The
 * source's `items-start` (icon pinned top over 2-line text) also isn't
 * reproducible through `InlineIconLabel`'s fixed `items-center` root; the OUTER
 * row (icon+text block vs the dismiss button) still aligns `items-start`, so the
 * dismiss button correctly sits at the top regardless.
 */

/** Props for the {@link SelectionBanner} block. */
export interface SelectionBannerProps {
    /** The selected passage this side-thread is about (clamped to 2 lines). */
    passage: ReactNode
    /** Optional note below the passage (e.g. the born-archived explainer). Omit → no note row. */
    note?: ReactNode
    /** Fired when the dismiss (X) button is pressed — the caller clears the selection. */
    onDismiss?: () => void
    /**
     * Anatomy tag for the ROOT — lets a PARENT block badge this whole SelectionBanner as
     * ONE opaque node. Overrides the self-anatomy root tag.
     */
    anatPart?: string
    /** When on, emit `data-anat-part` on each part so a {@link BlockAnatomy} panel can badge them on-render. */
    showAnatomy?: boolean
    /** Extra classes on the root. */
    className?: string
}

/**
 * SelectionBanner — the warning-toned "asking about this passage" banner pinned
 * at the top of a content-AI side-thread: quoted excerpt + dismiss, plus an
 * optional born-archived note.
 *
 * @param props - {@link SelectionBannerProps}
 */
export const SelectionBanner = ({
    passage,
    note,
    onDismiss,
    anatPart,
    showAnatomy = false,
    className,
}: SelectionBannerProps) => (
    <div
        className={cn("flex flex-col gap-2 rounded-xl border border-warning bg-warning-soft px-3 py-2", className)}
        data-anat-part={anatPart ?? (showAnatomy ? "SelectionBanner" : undefined)}
    >
        <div className="flex items-start gap-2">
            <InlineIconLabel
                icon={<QuotesIcon aria-hidden focusable="false" />}
                tone="warning"
                size="sm"
                className="min-w-0 flex-1"
                anatPart={showAnatomy ? "InlineIconLabel" : undefined}
            >
                <span className="line-clamp-2">{passage}</span>
            </InlineIconLabel>
            <Button
                iconOnly
                variant="ghost"
                size="sm"
                icon={<XIcon aria-hidden focusable="false" />}
                ariaLabel="Bỏ chọn đoạn"
                onPress={onDismiss}
                className="shrink-0"
                anatPart={showAnatomy ? "Button" : undefined}
            />
        </div>
        {note ? (
            <Typography type="body-xs" color="muted" data-anat-part={showAnatomy ? "Typography" : undefined}>
                {note}
            </Typography>
        ) : null}
    </div>
)

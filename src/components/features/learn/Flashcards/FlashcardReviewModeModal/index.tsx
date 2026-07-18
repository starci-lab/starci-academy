"use client"

import React, { useEffect, useState } from "react"
import { Button, Spinner, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, CardsIcon, ClockCountdownIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { ModalShell } from "@/components/blocks/layout/ModalShell"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import type { FlashcardReviewMode } from "@/modules/api/graphql/mutations/types/start-flashcard-review-session"

/** Props for {@link FlashcardReviewModeModal}. */
export interface FlashcardReviewModeModalProps extends WithClassNames<undefined> {
    /** Open when true. */
    isOpen: boolean
    /** Close handler (backdrop / Escape / Huỷ). */
    onClose: () => void
    /** Deck title shown in the header (which bộ thẻ is being started). */
    deckTitle: string
    /** Total cards in the deck — the "Ôn tất cả" badge count. */
    totalCount: number
    /** Cards currently due in the deck — the "Chỉ thẻ cần ôn" badge count. */
    dueCount: number
    /** Fires with the chosen mode when "Bắt đầu" is pressed. */
    onStart: (mode: FlashcardReviewMode) => void
    /** True while the session persists (drives the "Bắt đầu" spinner). */
    isPending: boolean
}

/**
 * The deck-review MODE picker (thầy 2026-07-13 "modal chọn mode, full hoặc
 * quên"). Opened by `FlashcardDeckList`'s "Học" CTA before a session starts.
 * SELECT-then-CONFIRM (thầy 2026-07-13 lượt 3 — reverted the direct-press
 * lượt 2): rows only mark a choice; a separate "Bắt đầu" button below confirms
 * and actually starts (spinner there until the session persists). "Ôn tất cả"
 * runs the whole deck; "Chỉ thẻ cần ôn" runs only the cards past due / never
 * learned (the deck's `dueCount`), and dims + auto-resets the picker back to
 * "full" when nothing is due. These are SELECT rows (they pick a mode, they do
 * not navigate) → an UNSELECTED row hovers to the block's NATIVE `bg-default`
 * fill (mode 3, `principles/hover-style-matches-clickable-nature`); a hovered
 * row must NOT reuse the selected row's `bg-accent-soft` (thầy 2026-07-18: an
 * accent-soft hover reads identical to the picked row above — the clash makes a
 * hovered row look selected; reverts the 2026-07-17 accent-soft "preview"). The
 * SELECTED row keeps `hover:bg-accent-soft` so it does not flicker to bg-default
 * on hover (same idiom as `SubmissionResultHistoryDrawer`). Selection signal is
 * the accent icon+title text. `SurfaceListCard bordered` — this list is NESTED
 * inside the modal surface, so it needs a real border rather than the
 * (invisible-in-dark) `shadow-surface` top-level default (`components/card.md`
 * §"surface-in-surface / nested").
 * Selected-row signal (thầy 2026-07-13 lượt 4, dropped the `CheckCircleIcon`
 * tried in lượt 3): the row itself tints `bg-accent-soft` via `SurfaceListCardRow`'s
 * `selected` prop, and — thầy 2026-07-17 — BOTH the leading icon and the title
 * turn `text-accent-soft-foreground` when selected (they stay the SAME colour,
 * `components/icon.md` §6 "icon cùng màu chữ cạnh nó"). The title colour rides a
 * `<span>` node rather than `titleClassName` (that escape hatch is lint-forbidden,
 * `no-modal-title-classname`); un-selected rows keep `text-foreground`.
 * @param props - {@link FlashcardReviewModeModalProps}
 */
export const FlashcardReviewModeModal = ({
    isOpen,
    onClose,
    deckTitle,
    totalCount,
    dueCount,
    onStart,
    isPending,
    className,
}: FlashcardReviewModeModalProps) => {
    const t = useTranslations()
    const [mode, setMode] = useState<FlashcardReviewMode>("full")
    // nothing due → "due" is not a real choice; force the picker back to "full"
    // whenever the modal (re)opens for a caught-up deck.
    const dueDisabled = dueCount <= 0
    useEffect(() => {
        if (isOpen && dueDisabled) {
            setMode("full")
        }
    }, [isOpen, dueDisabled])

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={(open) => { if (!open && !isPending) onClose() }}
            title={t("flashcard.mode.title")}
            size="sm"
            className={className}
        >
            <div className="flex flex-col gap-4">
                <Typography type="body-sm" color="muted">
                    {t("flashcard.mode.subtitle", { deck: deckTitle })}
                </Typography>

                <SurfaceListCard bordered>
                    <SurfaceListCardRow
                        // UNSELECTED → block-native bg-default hover (distinct from the accent-soft
                        // selected tint, no clash). SELECTED → keep hover:bg-accent-soft so the picked
                        // row does NOT flicker to bg-default on hover (same idiom as
                        // SubmissionResultHistoryDrawer). Selection signal = accent icon+title
                        // (icon.md §6); title via span-node (`titleClassName` is lint-forbidden).
                        className={mode === "full" ? "hover:bg-accent-soft" : undefined}
                        leading={<CardsIcon className={cn("size-6", mode === "full" ? "text-accent-soft-foreground" : "text-foreground")} aria-hidden focusable="false" />}
                        title={<span className={mode === "full" ? "text-accent-soft-foreground" : undefined}>{t("flashcard.mode.fullLabel")}</span>}
                        subtitle={t("flashcard.mode.fullDescription")}
                        selected={mode === "full"}
                        isDisabled={isPending}
                        onPress={() => setMode("full")}
                        meta={(
                            <span className="whitespace-nowrap text-xs font-medium text-muted">
                                {t("flashcard.mode.fullBadge", { count: totalCount })}
                            </span>
                        )}
                    />
                    <SurfaceListCardRow
                        className={mode === "due" ? "hover:bg-accent-soft" : undefined}
                        leading={<ClockCountdownIcon className={cn("size-6", mode === "due" ? "text-accent-soft-foreground" : "text-foreground")} aria-hidden focusable="false" />}
                        title={<span className={mode === "due" ? "text-accent-soft-foreground" : undefined}>{t("flashcard.mode.dueLabel")}</span>}
                        subtitle={t("flashcard.mode.dueDescription")}
                        selected={mode === "due"}
                        isDisabled={isPending || dueDisabled}
                        onPress={() => setMode("due")}
                        meta={(
                            <span className={`whitespace-nowrap text-xs font-medium ${dueDisabled ? "text-muted" : "text-warning-soft-foreground"}`}>
                                {dueDisabled
                                    ? t("flashcard.mode.dueBadgeEmpty")
                                    : t("flashcard.mode.dueBadge", { count: dueCount })}
                            </span>
                        )}
                    />
                </SurfaceListCard>

                <div className="flex justify-end gap-2">
                    <Button variant="tertiary" isDisabled={isPending} onPress={onClose}>
                        {t("common.cancel")}
                    </Button>
                    <Button variant="primary" isPending={isPending} onPress={() => onStart(mode)}>
                        {/* HeroUI Button ships no spinner for `isPending` — render one, same
                            idiom as every other pending CTA (see `button.md` §6c). */}
                        {isPending ? <Spinner color="current" size="sm" /> : null}
                        {t("flashcard.mode.start")}
                        {!isPending ? <ArrowRightIcon className="size-5" aria-hidden focusable="false" /> : null}
                    </Button>
                </div>
            </div>
        </ModalShell>
    )
}

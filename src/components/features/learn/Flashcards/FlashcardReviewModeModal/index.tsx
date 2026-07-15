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
 * "full" when nothing is due. Row hover still underlines the title
 * ([[hover-style-matches-clickable-nature]]) even though rows no longer
 * navigate on press — thầy's explicit call for this list. `SurfaceListCard
 * bordered` — this list is NESTED inside the modal surface, so it needs a real
 * border rather than the (invisible-in-dark) `shadow-surface` top-level default
 * (`components/card.md` §"surface-in-surface / nested").
 * Selected-row signal (thầy 2026-07-13 lượt 4, dropped the `CheckCircleIcon`
 * tried in lượt 3): the row itself tints `bg-accent-soft` via `SurfaceListCardRow`'s
 * `selected` prop (no `titleClassName` escape hatch — header/title styling stays
 * on the block's own default, per `no-modal-title-classname`), and the leading
 * icon turns `text-accent-soft-foreground`, no trailing checkmark. Leading icon otherwise
 * matches the title's own colour (`text-foreground`, not the previous
 * `text-muted`) — `components/icon.md` "icon cùng màu chữ cạnh nó".
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
                        hover="underline"
                        leading={<CardsIcon className={cn("size-6", mode === "full" ? "text-accent-soft-foreground" : "text-foreground")} aria-hidden focusable="false" />}
                        title={t("flashcard.mode.fullLabel")}
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
                        hover="underline"
                        leading={<ClockCountdownIcon className={cn("size-6", mode === "due" ? "text-accent-soft-foreground" : "text-foreground")} aria-hidden focusable="false" />}
                        title={t("flashcard.mode.dueLabel")}
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

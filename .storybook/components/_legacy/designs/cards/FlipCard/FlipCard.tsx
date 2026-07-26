import React, { useState } from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { ScrollShadow, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { AnimatePresence, motion } from "framer-motion"
import { LockIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"
// LabeledCard is superseded by SurfaceCard (label OUTSIDE the card + bordered +
// contentClassName) — the local SurfaceCard port stands in for the question /
// answer frames faithfully.
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/FlipCard`. Authored in Storybook (not `src`);
 * synced back to `src` later.
 */

// C-props: "locked" owns its own icon size/color (§4) — caller never hand-sets
// `className` on the lock icon.
const LOCK_ICON_CLS = "size-8 text-muted"

/** Base props shared by both the unlocked and locked shapes of {@link FlipCard}. */
interface FlipCardBaseProps {
    /** Whether the answer card is currently revealed below the question. */
    revealed: boolean
    /** Label shown OUTSIDE (above) the question card — e.g. "Câu hỏi". */
    questionLabel: ReactNode
    /** Label shown OUTSIDE (above) the answer card — e.g. "Đáp án". */
    answerLabel: ReactNode
    /** Front (prompt) content — composed by the caller; sits in the question card. */
    front: ReactNode
    /**
     * Optional content rendered DIRECTLY under the question card (grouped with it,
     * `gap-3`) — ABOVE the answer, so it stays anchored to the question when the
     * answer reveals below. Used for the card's level/tag chips.
     */
    belowFront?: ReactNode
    /** `true` → render skeleton mirror of both cards (question + answer). Consumer only flips the flag. */
    isSkeleton?: boolean
    /** Extra classes on the wrapper. */
    className?: string
    /**
     * When `true`, each composed part (question card / below-front cluster /
     * answer card) emits `data-anat-part="<name>"` so a BlockAnatomy panel can
     * badge it on-render. Off by default (production).
     */
    showAnatomy?: boolean
}

/**
 * Props for the {@link FlipCard} block — a DISCRIMINATED union so the "locked"
 * shape (premium unlock prompt) is an explicit, type-checked variant instead of a
 * free-form shape smuggled through `back` (was previously hand-rolled at every
 * call-site — see the former `Locked` story). `locked: true` makes `back` optional
 * since the primitive renders its own unlock-prompt shape in that case.
 */
export type FlipCardProps = FlipCardBaseProps &
    (
        | {
              /** `true` → replace the answer with the built-in "unlock this card" prompt (icon+title+subtitle), not the real answer. */
              locked: true
              back?: ReactNode
              /** Override the default locked-state title. */
              lockedTitle?: ReactNode
              /** Override the default locked-state subtitle. */
              lockedSubtitle?: ReactNode
          }
        | {
              locked?: false
              /** Back (answer) content — composed by the caller; shown once {@link FlipCardBaseProps.revealed}. */
              back: ReactNode
              lockedTitle?: never
              lockedSubtitle?: never
          }
    )

/**
 * Gạch prose N dòng — dòng cuối ngắn lại cho giống đoạn văn thật. Vẽ TẠI CHỖ vì
 * đây là NỘI DUNG của thẻ này, không phải component dùng chung (compound
 * `Skeleton.*` đã khai tử — mỗi chủ tự vẽ skeleton của mình, §12c).
 */
const ProseSkeleton = ({ lines }: { lines: number }) => (
    <div className="flex flex-col">
        {Array.from({ length: lines }).map((_, index) => (
            <HeroSkeleton
                key={index}
                className={cn("my-[6px] h-4 rounded", index === lines - 1 ? "w-2/3" : "w-full")}
            />
        ))}
    </div>
)

/**
 * Anki-style "no-flip" prompt/answer pair: the question and the answer are TWO
 * SEPARATE labeled cards — each label ("Câu hỏi" / "Đáp án") sits OUTSIDE, above
 * its card, not an eyebrow inside the card. The answer card reveals below the
 * question one (height-animate) once {@link revealed}. Purely presentational —
 * the caller owns the "Xem đáp án" reveal control.
 *
 * @param props - {@link FlipCardProps}
 */
export const FlipCard = ({
    revealed,
    questionLabel,
    answerLabel,
    front,
    belowFront,
    locked = false,
    back,
    lockedTitle,
    lockedSubtitle,
    isSkeleton = false,
    className,
    showAnatomy = false,
}: FlipCardProps) => {
    // `overflow-hidden` is only needed WHILE the height animates — left on at rest
    // it permanently clips the answer card's own box-shadow. Drop it once the
    // reveal settles so the shadow shows in full, same as the question card.
    const [animating, setAnimating] = useState(false)

    // M1 isSkeleton: self-render a skeleton MIRROR of both cards (real SurfaceCard
    // frame + Skeleton.* bars as content) instead of the consumer hand-stuffing
    // `<Skeleton>` into `front`/`back`/`belowFront`.
    if (isSkeleton) {
        return (
            <div className={cn("flex flex-col gap-6", className)}>
                <div className="flex flex-col gap-3">
                    {/* Codemod 2026-07-26: `bordered` → `variant="nested"` (API 3-trục SurfaceCard.Base). */}
                    <div data-anat-part={showAnatomy ? "SurfaceCard.Question" : undefined}>
                        <SurfaceCard.Base label={questionLabel} variant="nested" contentClassName="flex flex-col gap-3">
                            <ProseSkeleton lines={2} />
                        </SurfaceCard.Base>
                    </div>
                    <div data-anat-part={showAnatomy ? "BelowFront" : undefined} className="flex flex-wrap items-center gap-2">
                        <Chip.Base isSkeleton />
                        <Typography size="xs" isSkeleton className="w-1/3" />
                    </div>
                </div>
                <div data-anat-part={showAnatomy ? "SurfaceCard.Answer" : undefined}>
                    <SurfaceCard.Base label={answerLabel} variant="nested">
                        <ProseSkeleton lines={3} />
                    </SurfaceCard.Base>
                </div>
            </div>
        )
    }

    // C-props: "locked" is a distinct shape (centered unlock prompt), owned by the
    // primitive — icon size/color (LOCK_ICON_CLS) is never set at the call-site.
    const answerContent = locked ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <LockIcon aria-hidden focusable="false" className={LOCK_ICON_CLS} />
            <Typography.Base size="sm" weight="medium" text={lockedTitle ?? "Thẻ này thuộc gói Premium"} />
            <Typography.Base size="xs" color="muted" text={lockedSubtitle ?? "Mở khoá khoá học để xem đáp án đầy đủ."} />
        </div>
    ) : (
        back
    )

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* question card + its `belowFront` chips grouped `gap-3` — the chips
                stay under the QUESTION when the answer reveals below. */}
            <div className="flex flex-col gap-3">
                {/* Codemod 2026-07-26: `bordered` → `variant="nested"` (API 3-trục SurfaceCard.Base). */}
                <div data-anat-part={showAnatomy ? "SurfaceCard.Question" : undefined}>
                    <SurfaceCard.Base label={questionLabel} variant="nested" contentClassName="flex flex-col gap-3">
                        {front}
                    </SurfaceCard.Base>
                </div>
                {belowFront ? (
                    <div data-anat-part={showAnatomy ? "BelowFront" : undefined}>{belowFront}</div>
                ) : null}
            </div>
            {/* answer = its OWN labeled card, revealed below (height-animate). */}
            <AnimatePresence initial={false}>
                {revealed ? (
                    <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        onAnimationStart={() => setAnimating(true)}
                        onAnimationComplete={() => setAnimating(false)}
                        className={cn(animating && "overflow-hidden")}
                    >
                        {/* Codemod 2026-07-26: `bordered` → `variant="nested"` (API 3-trục SurfaceCard.Base). */}
                        <div data-anat-part={showAnatomy ? "SurfaceCard.Answer" : undefined}>
                            <SurfaceCard.Base label={answerLabel} variant="nested">
                                <ScrollShadow hideScrollBar className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto text-left">
                                    {answerContent}
                                </ScrollShadow>
                            </SurfaceCard.Base>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}

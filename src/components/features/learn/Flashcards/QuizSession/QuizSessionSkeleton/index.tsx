import React from "react"
import { cn } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** How many word-bank chip tiles the skeleton draws below the question card. */
const WORD_BANK_TILES = 6
/** How many cloze-blank chips are woven into the mock question paragraph. */
const CLOZE_BLANKS = 3

/**
 * Loading placeholder for the "Hỏi nhanh" active run. Mirrors the real shape
 * top-to-bottom: the edge-to-edge {@link import("@/components/blocks/navigation/WorkSessionHeader").WorkSessionHeader}
 * band (back-link · identity · counter · progress-segment bar), then a
 * `max-w-3xl` centered body — level/tag chips, the cloze question card (label +
 * two lines of question text + an instruction line + a mock paragraph with
 * rounded-lg blank tiles woven between text bars — same shape as the real
 * fill-in-the-blank chips), the "Ngân hàng từ" word-bank chip row, and the
 * "Kiểm tra" CTA — so the run resolves in place without a layout jump.
 */
export const QuizSessionSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* header band — mirrors WorkSessionHeader's own edge-to-edge shell */}
            <div className="border-b border-default bg-surface">
                <div className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
                    <Skeleton className="h-4 w-16 rounded" />
                    <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                    <Skeleton className="hidden h-4 w-24 rounded sm:block" />
                    <span className="hidden h-5 w-px shrink-0 bg-default sm:block" aria-hidden />
                    <Skeleton className="h-4 w-20 rounded" />
                </div>
                <div className="flex gap-1 px-4 pb-2 sm:px-6">
                    {Array.from({ length: 6 }, (_, index) => (
                        <Skeleton key={index} className="h-1 flex-1 rounded-full" />
                    ))}
                </div>
            </div>

            {/* body — centered column under the header, same as the real run */}
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                <div className="flex flex-wrap items-center gap-2">
                    <Skeleton.Chip />
                    <Skeleton.Chip />
                </div>

                {/* question card — mirrors the real cloze card's LabeledCard (Card = shadow-surface, no border) */}
                <div className="flex flex-col gap-3 rounded-2xl bg-surface p-6 shadow-surface">
                    <Skeleton.Typography type="body-xs" width="1/4" />
                    <Skeleton.Typography type="body" width="3/4" />
                    <Skeleton.Typography type="body" width="2/3" />
                    <div className="border-t border-divider pt-3">
                        <Skeleton.Typography type="body-xs" width="1/2" />
                    </div>
                    {/* cloze paragraph — text bars with the real blanks' rounded-lg tile shape woven in */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
                        <Skeleton className="h-4 w-20 rounded" />
                        {Array.from({ length: CLOZE_BLANKS }, (_, index) => (
                            <React.Fragment key={index}>
                                <Skeleton className="h-6 min-w-16 rounded-lg" />
                                <Skeleton className="h-4 w-24 rounded" />
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* word bank — label + wrapped chip tiles, then the "Kiểm tra" CTA */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <Skeleton.Typography type="body-xs" width="1/4" />
                        <div className="flex flex-wrap items-center gap-2">
                            {Array.from({ length: WORD_BANK_TILES }, (_, index) => (
                                <Skeleton.Button key={index} width="w-20" />
                            ))}
                        </div>
                    </div>
                    <Skeleton.Button width="w-24" className="self-start" />
                </div>
            </div>
        </div>
    )
}

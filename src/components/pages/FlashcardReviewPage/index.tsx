"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    StackIcon,
    CheckCircleIcon,
} from "@phosphor-icons/react"
import {
    pathConfig,
} from "@/resources/path"
import { useMutateReviewFlashcardSwr } from "@/hooks/swr/api/graphql/mutations/useMutateReviewFlashcardSwr"
import { useQueryMyDueFlashcardsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyDueFlashcardsSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import type { GraphQLResponse } from "@/modules/api/graphql/types"
import type { ReviewFlashcardData } from "@/modules/api/graphql/mutations/types/review-flashcard"
import type { QueryFlashcardNextIntervals } from "@/modules/api/graphql/queries/types/my-due-flashcards"
import { Button } from "@/components/atoms/buttons/Button"
import { Card, CardContent } from "@/components/atoms/display/Card"
import { Divider } from "@/components/atoms/display/Divider"
import { Spinner } from "@/components/atoms/display/Spinner"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** SM-2 grade buttons (value + i18n key + tone), ordered worst → best. */
const GRADES: Array<{
    grade: number
    /** i18n key AND the `nextIntervals` field this grade previews. */
    key: keyof QueryFlashcardNextIntervals
    variant: "danger" | "danger-soft" | "secondary" | "primary"
}> = [
    { grade: 0, key: "again", variant: "danger" },
    { grade: 1, key: "hard", variant: "danger-soft" },
    { grade: 2, key: "good", variant: "secondary" },
    { grade: 3, key: "easy", variant: "primary" },
]

/**
 * The `/review` flashcard-review session (SM-2). Fetches the viewer's due cards,
 * then walks them one at a time: shows the front, a "flip" button reveals the
 * back, and four grade buttons record the recall quality (`reviewFlashcard`) and
 * advance. When the queue is exhausted it shows a "done" state with a link back
 * to the dashboard. Current index + flipped state are local (presentational); the
 * grade mutation is owned here.
 */
export const FlashcardReviewPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, isLoading, error, mutate } = useQueryMyDueFlashcardsSwr()
    const { trigger: triggerReview } = useMutateReviewFlashcardSwr()
    const runGraphQL = useGraphQLWithToast()

    // index of the card currently shown
    const [index, setIndex] = useState(0)
    // whether the back of the current card is revealed
    const [flipped, setFlipped] = useState(false)
    // the grade being saved, or null when idle
    const [savingGrade, setSavingGrade] = useState<number | null>(null)

    const cards = data?.cards ?? []
    const current = cards[index]

    /** Grade the current card, then advance to the next one. */
    const onGrade = useCallback(
        async (grade: number) => {
            if (!current) {
                return
            }
            setSavingGrade(grade)
            try {
                const ok = await runGraphQL(
                    async (): Promise<GraphQLResponse<ReviewFlashcardData>> => {
                        const result = await triggerReview({
                            cardId: current.cardId,
                            grade,
                        })
                        const env = result?.data?.reviewFlashcard
                        // surface a non-success envelope as an error so the toast
                        // hook reports failure and we don't advance the queue
                        if (!env?.success) {
                            throw new Error(env?.message)
                        }
                        return env
                    },
                )
                // advance only when the grade was recorded
                if (ok) {
                    setIndex((value) => value + 1)
                    setFlipped(false)
                }
            } finally {
                setSavingGrade(null)
            }
        },
        [
            current,
            triggerReview,
            runGraphQL,
        ],
    )

    // query failed with no cached data → error state with retry (never spin
    // forever: `isLoading` is already false and `data` is undefined here)
    if (error && !data) {
        return (
            <Box identity={{ tier: "page", component: "FlashcardReviewPage" }} principle="center-measure" className="flex min-h-[60vh] items-center justify-center"
                explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
            >
                <AsyncContentError
                    title={t("flashcardReview.loadError")}
                    onRetry={() => { void mutate() }}
                    retryLabel={t("common.retry")}
                />
            </Box>
        )
    }

    // still loading the queue → centred spinner
    if (isLoading || !data) {
        return (
            <Box identity={{ tier: "page", component: "FlashcardReviewPage" }} principle="center-measure" className="flex min-h-[60vh] items-center justify-center"
                explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
            >
                <Spinner size="lg" />
            </Box>
        )
    }

    // queue exhausted (or empty from the start) → done / empty state
    if (!current) {
        const empty = cards.length === 0
        return (
            <Box identity={{ tier: "page", component: "FlashcardReviewPage" }} principle="center-measure" className="mx-auto min-h-[60vh] w-full max-w-xl p-3"
                explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
            >
                <StackV gap={6} principle="block-boundary" align="center" justify="center"
                    explain="Block-to-block spacing — not group-boundary, because these blocks are distinct groups rather than same-kind peers."
                    items={[
                        () => <CheckCircleIcon className="size-12 text-success-soft-foreground" />,
                        () => (
                            <Typography
                                size="lg"
                                weight="semibold"
                                align="center"
                                text={empty
                                    ? t("flashcardReview.empty")
                                    : t("flashcardReview.done")}
                            />
                        ),
                        () => (
                            <Button
                                variant="primary"
                                label={t("flashcardReview.backToDashboard")}
                                onPress={() => router.push(
                                    pathConfig().locale(locale).dashboard().build(),
                                )}
                            />
                        ),
                    ]} />
            </Box>
        )
    }

    return (
        <Box identity={{ tier: "page", component: "FlashcardReviewPage" }} principle="center-measure" className="mx-auto w-full max-w-xl p-3"
            explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
        >
            <StackV gap={6} principle="block-boundary"
                explain="Block-to-block spacing — not group-boundary, because these blocks are distinct groups rather than same-kind peers."
                items={[
                // progress header: deck context + position in the queue
                    () => (
                        <StackH gap={4} principle="content-row" justify="between" align="center"
                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                            items={[
                                () => (
                                    <StackH gap={3} principle="identity" classNames={["min-w-0"]} align="center"
                                        explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                                        items={[
                                            () => <StackIcon className="size-5 shrink-0 text-foreground" />,
                                            () => (
                                                <Typography
                                                    size="sm"
                                                    weight="medium"
                                                    truncate
                                                    text={current.deckTitle}
                                                />
                                            ),
                                        ]} />
                                ),
                                () => (
                                    <Typography
                                        size="sm"
                                        color="muted"
                                        classNames={["shrink-0"]}
                                        text={t("flashcardReview.progress", {
                                            current: index + 1,
                                            total: cards.length,
                                        })}
                                    />
                                ),
                            ]} />
                    ),

                    // the card: front always, back after flip
                    () => (
                        <Card>
                            <Box principle="card-padding" className="p-6 @app-sm:p-7"
                                explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
                                <CardContent>
                                    <StackV gap={4} principle="content-row"
                                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                        items={[
                                            () => (
                                                <Typography
                                                    size="lg"
                                                    weight="semibold"
                                                    text={current.front}
                                                />
                                            ),
                                            () => (flipped ? (
                                                <StackV gap={4} principle="sibling-stack"
                                                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                    items={[
                                                        () => <Divider />,
                                                        () => (
                                                            <Typography size="lg" text={current.back} />
                                                        ),
                                                    ]} />
                                            ) : null),
                                        ]} />
                                </CardContent>
                            </Box>
                        </Card>
                    ),

                    // flip → reveal; revealed → grade buttons
                    () => (flipped ? (
                        <Box principle="sibling-stack" className="grid grid-cols-2 gap-2 @app-sm:grid-cols-4"
                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups.">
                            {GRADES.map((item) => (
                                <Button
                                    key={item.grade}
                                    variant={item.variant}
                                    isDisabled={savingGrade !== null}
                                    isPending={savingGrade === item.grade}
                                    onPress={() => void onGrade(item.grade)}
                                    label={(
                                        <StackV gap={1} principle="title-subtitle" align="center"
                                            explain="Title over supporting line — not label-field, because neither line is a form control label."
                                            items={[
                                                () => <Typography size="sm" text={t(`flashcardReview.${item.key}`)} />,
                                                () => (
                                                    <Typography
                                                        size="xs"
                                                        color="muted"
                                                        text={t("flashcardReview.intervalDays", {
                                                            days: current.nextIntervals[item.key],
                                                        })}
                                                    />
                                                ),
                                            ]} />
                                    )}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Button
                            variant="primary"
                            label={t("flashcardReview.flip")}
                            onPress={() => setFlipped(true)}
                        />
                    )),
                ]} />
        </Box>
    )
}

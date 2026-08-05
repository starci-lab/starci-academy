import React from "react"
import { QuestionIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { LabeledAccordionCard } from "@/components/blocks/cards/LabeledAccordionCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import type { QnaEntity } from "@/modules/types/entities/qna"
import type { CallerIdentity } from "@/components/frames/_identity"

/** This block's own identity, handed down to whichever card is standing in as its root (BLOCK-2). */
const IDENTITY: CallerIdentity = { tier: "block", component: "CourseFaq" }

/** All display text, already localized by the connected `CourseFaq`; a story passes i18n keys. */
export interface CourseFaqLabels {
    /** Section label — rendered by `LabeledCard` on every branch and by `LabeledAccordionCard` once content is showing. */
    label: string
    errorTitle: string
    retry: string
    emptyTitle: string
    emptyDescription: string
}

/** Props for {@link _CourseFaq} — presentational; all data resolved, no fetch/store/i18n. */
export interface CourseFaqProps {
    /**
     * First load, nothing in hand → the loading branch shimmers in place. Owned by the connected
     * file (loading-and-skeleton.md's first-load formula). `LabeledCard`/`LabeledAccordionCard`
     * carry no `isSkeleton` of their own — see `missingSkeletonSupport` — so this swaps in
     * `Skeleton.Accordion` right where the accordion would sit, still co-located (not a parallel
     * skeleton tree/file).
     */
    isSkeleton?: boolean
    /** Settled with zero Q&A entries → the empty message (beats content, loses to loading). */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its fetch error. */
    error?: unknown
    /** Retry handler, paired with `labels.retry` on the error branch. */
    onRetry?: () => void
    /** Q&A entries, already sorted by `sortIndex`; ignored while `isSkeleton`. */
    qnas?: Array<QnaEntity>
    labels: CourseFaqLabels
}

/**
 * FAQ section: the course Q&A pairs as an accordion (markdown answers) — removes a common
 * objection before the buy decision. Presentational half of {@link import("./index").CourseFaq}:
 * error beats a stale loading flag, empty only once settled. `LabeledAccordionCard` (the content
 * branch) owns its accordion frame + label itself, so unlike most blocks this does not thread a
 * single tree with `isSkeleton` — `LabeledCard`/`LabeledAccordionCard` take no `isSkeleton` prop
 * (`missingSkeletonSupport`), so the loading branch mirrors the shape with `Skeleton.Accordion`
 * inline instead, framed the same way the error/empty branches are. See `tiers/split.md` — the
 * connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link CourseFaqProps}
 */
const _CourseFaq = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    qnas = [],
    labels,
}: CourseFaqProps) => {
    // error beats a stale loading flag; empty only once settled (BLOCK-8 order: error → loading → empty → content).
    const body = (() => {
        if (error) {
            return (
                <LabeledCard label={labels.label} identity={IDENTITY}>
                    <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
                </LabeledCard>
            )
        }
        if (isSkeleton) {
            return (
                <LabeledCard label={labels.label} identity={IDENTITY}>
                    <Skeleton.Accordion items={3} />
                </LabeledCard>
            )
        }
        if (isEmpty) {
            return (
                <LabeledCard label={labels.label} identity={IDENTITY}>
                    <AsyncContentEmpty
                        icon={QuestionIcon}
                        title={labels.emptyTitle}
                        description={labels.emptyDescription}
                    />
                </LabeledCard>
            )
        }

        // content — the accordion card IS the frame + owns its own label (LabeledAccordionCard).
        // ⚠️ LabeledAccordionCard takes no `identity` prop (unlike LabeledCard) and there is no
        // sibling frame here to carry it instead — this branch's root stays unowned (unownedRoot).
        return (
            <LabeledAccordionCard
                label={labels.label}
                items={qnas.map((qna) => ({
                    id: qna.id,
                    title: qna.question,
                    body: <MarkdownContent markdown={qna.answer} />,
                }))}
            />
        )
    })()

    return body
}

export { _CourseFaq }

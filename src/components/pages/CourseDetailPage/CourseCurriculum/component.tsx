import React from "react"
import type { ReactNode } from "react"
import {
    Accordion,
} from "@heroui/react"
import {
    ListChecksIcon,
} from "@phosphor-icons/react"
import {
    ModuleAccordionItem,
} from "./ModuleAccordionItem"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { type ModuleEntity } from "@/modules/types/entities/module"

/** Number of placeholder rows the co-located skeleton shows (mirrors the old `Skeleton.Accordion items={3}`). */
const SKELETON_ITEM_COUNT = 3

/** All display text, already localized by the connected {@link import("./index").CourseCurriculum}; a story passes i18n keys. */
export interface CourseCurriculumLabels {
    /** Section label shown OUTSIDE the card (`LabeledCard.label`). */
    curriculum: string
    /** Settled with a fetch error — the error state's title. */
    errorTitle: string
    /** Retry-button label on the error state. */
    retry: string
    /** Settled with zero modules — the empty state's title. */
    emptyTitle: string
    /** Settled with zero modules — the empty state's description. */
    emptyDescription: string
}

/** Props for {@link _CourseCurriculum} — presentational; all data resolved, no fetch/store/i18n. */
export interface CourseCurriculumProps {
    /** First load, nothing in hand → the co-located skeleton shimmers in place. Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero modules → the empty state. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retries the failed course query. */
    onRetry?: () => void
    /** Every module, already sorted by `sortIndex`. */
    modules: Array<ModuleEntity>
    labels: CourseCurriculumLabels
}

/**
 * `_CourseCurriculum` — the presentational half of {@link import("./index").CourseCurriculum}
 * (`tiers/split.md`): every module as an accordion row (tier badge, premium lock, lesson/minute
 * meta, free preview bullets) so a prospect can scan exactly what's inside. `ModuleAccordionItem`
 * takes no `isSkeleton` prop of its own — it is not a leaf built to mirror itself
 * (`loading-and-skeleton.md` §1's stated exception) — so the loading accordion swaps in the
 * co-located `Skeleton.Accordion` at the same tree position instead of threading a flag through it.
 *
 * @param props - {@link CourseCurriculumProps}
 */
export const _CourseCurriculum = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    modules,
    labels,
}: CourseCurriculumProps) => {
    // frameless ONLY once the accordion itself self-frames (surface variant, real modules in hand);
    // every other branch (error / empty / loading) has no bounded surface of its own, so LabeledCard's
    // own Card must frame it — otherwise the message/skeleton renders bare on the page background.
    const frameless = !isSkeleton && !error && modules.length > 0

    // error beats a stale loading flag; empty only once settled (BLOCK-8). Both message branches come
    // from the shared `AsyncContent*` frames, not hand-written JSX (loading-and-skeleton.md §6).
    let body: ReactNode
    if (error) {
        body = <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    } else if (!isSkeleton && isEmpty) {
        body = (
            <AsyncContentEmpty
                icon={ListChecksIcon}
                title={labels.emptyTitle}
                description={labels.emptyDescription}
            />
        )
    } else if (isSkeleton) {
        body = <Skeleton.Accordion items={SKELETON_ITEM_COUNT} />
    } else {
        // Accordion Card: the surface accordion sits directly on the page background
        // (frameless, NOT nested inside a Card → avoids a flat surface-in-surface) + a card border.
        // Ref elements/card.md §3 + draft accordion-card-surface-on-standalone-pages.
        body = (
            <Accordion variant="surface" className="overflow-hidden shadow-surface">
                {modules.map((module) => (
                    <ModuleAccordionItem key={module.id} module={module} />
                ))}
            </Accordion>
        )
    }

    return (
        <LabeledCard
            identity={{ tier: "block", component: "CourseCurriculum" }}
            label={labels.curriculum}
            frameless={frameless}
        >
            {body}
        </LabeledCard>
    )
}

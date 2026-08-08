import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StackV } from "@/components/frames/Stack"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { ResumeCard } from "./ResumeCard"
import { RESUME_LIMIT, type ResumeItem } from "@/hooks/useResumeItems"

/** All display text, already localized by the connected `ContinueLearning`; a story passes i18n keys. */
export interface ContinueLearningLabels {
    /** Shown when the viewer has joined a course but has nothing to resume yet. */
    resumeEmpty: string
    /** Shown when the viewer has joined no course at all. */
    coursesEmpty: string
    /** Onboarding CTA label ("Browse courses"). */
    browseCourses: string
}

/** Props for {@link _ContinueLearning} — presentational; all data resolved, no fetch/store/i18n. */
export interface ContinueLearningProps {
    /** First load, nothing in hand → the resume grid shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Resume targets, in-progress challenges first, capped + de-duplicated. */
    resumeItems?: Array<ResumeItem>
    /** Whether the viewer has joined at least one course — picks which onboarding copy shows. */
    hasCourses?: boolean
    /** Fires when the onboarding CTA is pressed — the connected file resolves the route. */
    onBrowseCourses: () => void
    labels: ContinueLearningLabels
}

/**
 * "Continue learning" content — the single most important next-action slot: a capped
 * set of resume cards, CONTENT-FIRST (recently-read lessons lead, mixed with at
 * most one in-progress challenge as a nudge). When the viewer has nothing to resume
 * it shows an onboarding CTA instead of an empty void — a DESIGNED case, not
 * `AsyncContent`'s generic empty branch, so it stays in the content tree. `isSkeleton`
 * threads to the grid; while shimmering it shows {@link RESUME_LIMIT} placeholder
 * cards in the SAME grid shape as the loaded state. `ResumeCard` (its own connected
 * component under `./ResumeCard`, split.md) forwards no `isSkeleton` of its own — it
 * has none yet — so the loading cards are mirrored inline with `Skeleton.*` right
 * where it sits instead (loading-and-skeleton.md).
 * @param props - {@link ContinueLearningProps}
 */
export const _ContinueLearning = ({
    isSkeleton = false,
    resumeItems = [],
    hasCourses = false,
    onBrowseCourses,
    labels,
}: ContinueLearningProps) => {
    // missingSkeletonSupport: ResumeCard/ContinueCard take no `isSkeleton` prop, so the
    // loading cards are a hand-mirrored `SectionCard` shell echoing ContinueCard's `item`
    // anatomy (title + subtitle column, then the CTA on its own row, no progress meter).
    const gridItems: ReadonlyArray<GridItem> = isSkeleton
        ? Array.from({ length: RESUME_LIMIT }, (_unused, index) => ({
            key: `pending-${index}`,
            content: () => (
                <SectionCard fillHeight>
                    <StackV gap={3} items={[
                        () => (
                            <StackV gap={1} items={[
                                () => <Skeleton.Typography type="body-sm" width="3/4" />,
                                () => <Skeleton.Typography type="body-xs" width="1/2" />,
                            ]} />
                        ),
                        () => <Skeleton.Typography type="body-sm" width="1/3" />,
                    ]} />
                </SectionCard>
            ),
        }))
        : resumeItems.map((item) => ({
            key: item.globalId,
            content: () => <ResumeCard item={item} />,
        }))

    return isSkeleton || resumeItems.length > 0 ? (
        <Grid
            items={gridItems}
            columns={{ sm: 2, lg: 3 }}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            isSkeleton={isSkeleton}
            identity={{ tier: "block", component: "ContinueLearning" }}
        />
    ) : (
        // empty / onboarding: a real card so it matches the framed sibling sections
        // (the parent LabeledCard is `frameless` for the self-framed resume cards).
        // unownedRoot: SectionCard (composite tier) always names itself and takes no
        // `identity` prop — no sibling frame wraps it here, so this branch keeps no
        // `data-tier`/`data-component` for ContinueLearning itself (see _identity.ts).
        <SectionCard contentAlign="start">
            <Typography
                size="sm"
                color="muted"
                text={hasCourses ? labels.resumeEmpty : labels.coursesEmpty}
            />
            <Button variant="primary" label={labels.browseCourses} onPress={onBrowseCourses} />
        </SectionCard>
    )
}

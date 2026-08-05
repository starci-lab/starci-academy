import React from "react"
import { type SkeletonProps } from "@/components/composites/_slot"
import {
    FoundationHeader,
    FoundationKind,
    type FoundationHeaderCrumb,
    type FoundationHeaderTag,
} from "@/components/blocks/learn/FoundationHeader"
import {
    FoundationResourceBody,
    type FoundationKind as FoundationResourceKind,
} from "@/components/blocks/learn/FoundationResourceBody"
import { TrialEnrollBanner } from "@/components/blocks/learn/TrialEnrollBanner"
import { FoundationResourceEmpty } from "@/components/blocks/learn/FoundationResourceEmpty"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/**
 * `_FoundationResourcePage` — the SRC TWIN of `.storybook/components/starci/pages/
 * FoundationResourcePage/FoundationResourcePage.tsx`. Presentational: typed props,
 * already resolved; no fetch/store/i18n (that's the connected half, `./index.tsx`).
 *
 * Same three functions, same reading order as the blueprint: say if this trial
 * learner should upgrade · what the resource is · the resource itself. The trial
 * banner sits outside the `isEmpty` switch — it answers whether the learner is on
 * a trial, unrelated to whether the resource id resolved, and self-hides on its
 * own grounds. Three leaves: `Resource` (identity + body, kind switched as data
 * inside `FoundationResourceBody`) · `Empty` (the id resolved to nothing) ·
 * `Skeleton`.
 */

/**
 * `FoundationHeader`'s enum kind → `FoundationResourceBody`'s string-union
 * kind. EXHAUSTIVE `Record`, not a cast (see file header) — the compiler must
 * refuse a build that adds a 4th `FoundationKind` value and forgets it here.
 */
const KIND_TO_RESOURCE_KIND: Record<FoundationKind, FoundationResourceKind> = {
    [FoundationKind.Document]: "document",
    [FoundationKind.Video]: "video",
    [FoundationKind.ExternalLink]: "external_link",
}

// re-exported so the connected file (and anything downstream) can build data
// against the SAME types the blueprint's blocks define, rather than
// redeclaring shape that already exists.
export {
    FoundationKind,
}
export type {
    FoundationHeaderCrumb,
    FoundationHeaderTag,
}

/** Props for {@link _FoundationResourcePage}. */
export interface FoundationResourcePageProps {
    /** Breadcrumb trail as data — category, then this resource. */
    breadcrumbItems: Array<FoundationHeaderCrumb>
    /** Resource title. */
    title: string
    /** One-sentence summary of the resource. */
    description?: string
    /** Resource kind — drives both the header's chip and which body shape renders. */
    kind: FoundationKind
    /** `true` → the header shows the editorial "Recommended" pill. */
    isRecommended?: boolean
    /** Topic tags on the resource. */
    tags?: Array<FoundationHeaderTag>
    /** Author or source attribution. */
    author?: string

    /** The resource body, as authored markdown. Read when `kind` is `Document`. */
    markdownBody?: string
    /** CTA label for the link button. Read when `kind` is `ExternalLink`. */
    linkTitle?: string
    /** Destination URL for the link button. Read when `kind` is `ExternalLink`. */
    linkUrl?: string
    /** Fired with the resolved URL when the reader presses the link button. */
    onOpenLink?: (url: string) => void

    /**
     * `true` once enrollment status has actually resolved. `false` while
     * still unknown → `TrialEnrollBanner` stays hidden rather than risk
     * nudging a learner who is, in fact, already enrolled.
     */
    isEnrollmentKnown: boolean
    /** Whether the viewer is enrolled in the course this resource belongs to. */
    isEnrolled: boolean
    /** Fired when the learner takes the trial→enroll nudge. */
    onEnroll: () => void

    /** `true` → the resource id resolved to nothing; `FoundationResourceEmpty` replaces the identity + body pair. */
    isEmpty?: boolean
    /**
     * `true` → every block that can mirror itself does. The flag flows
     * straight down to `FoundationHeader`/`FoundationResourceBody`, and each
     * block draws its OWN resting shape — the screen builds no shimmer tree
     * of its own.
     */
    isSkeleton?: boolean
}

/**
 * One foundation resource's own page. See the file header for the function
 * list and why the trial banner sits outside the empty switch.
 *
 * @param props - {@link FoundationResourcePageProps}
 */
const _FoundationResourcePage = ({
    breadcrumbItems,
    title,
    description,
    kind,
    isRecommended,
    tags,
    author,
    markdownBody,
    linkTitle,
    linkUrl,
    onOpenLink,
    isEnrollmentKnown,
    isEnrolled,
    onEnroll,
    isEmpty = false,
    isSkeleton = false,
}: FoundationResourcePageProps) => {
    const resourceSection = (
        <>
            <FoundationHeader

                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                kind={kind}
                isRecommended={isRecommended}
                tags={tags}
                author={author}
                isSkeleton={isSkeleton}

            />
            <FoundationResourceBody

                kind={KIND_TO_RESOURCE_KIND[kind]}
                markdownBody={markdownBody}
                linkTitle={linkTitle}
                linkUrl={linkUrl}
                onOpenLink={onOpenLink}
                isSkeleton={isSkeleton}

            />
        </>
    )

    const resourceSections = (
        <>
            <TrialEnrollBanner

                isVisible={isEnrollmentKnown && !isEnrolled}
                onEnroll={onEnroll}
                isSkeleton={isSkeleton}

            />
            {isEmpty ? (
                <FoundationResourceEmpty />
            ) : (
                <StackV gap={6} isSkeleton={isSkeleton} items={[() => resourceSection]} />
            )}
        </>
    )

    const resourceBody = ({ isSkeleton }: SkeletonProps) => (
        <StackV gap={6} isSkeleton={isSkeleton} items={[() => resourceSections]} />
    )

    return (
        <Container

            identity={{ tier: "page", component: "FoundationResourcePage" }}
            size="md"
            padding={6}
            isSkeleton={isSkeleton}
            body={resourceBody}

        />
    )
}

export { _FoundationResourcePage }

import React from "react"
import {
    FoundationHeader,
    FoundationKind,
    type FoundationHeaderCrumb,
    type FoundationHeaderTag,
} from "@sb-components/starci/blocks/learn/FoundationHeader/FoundationHeader"
import {
    FoundationResourceBody,
    type FoundationKind as FoundationResourceKind,
} from "@sb-components/starci/blocks/learn/FoundationResourceBody/FoundationResourceBody"
import { TrialEnrollBanner } from "@sb-components/starci/blocks/learn/TrialEnrollBanner/TrialEnrollBanner"
import { FoundationResourceEmpty } from "@sb-components/starci/blocks/learn/FoundationResourceEmpty/FoundationResourceEmpty"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `FoundationResourcePage` — one foundation resource's own page (external link,
 * video, or document), reached from a category list. It composes blocks in frames and
 * hands each typed data.
 *
 * Three functions: a trial-upgrade banner (`TrialEnrollBanner`, orthogonal to whether
 * the resource was found — visibility derived from `isEnrollmentKnown && !isEnrolled`),
 * what this resource is, and the resource itself. `isEmpty` replaces only the
 * identity + body pair. `KIND_TO_RESOURCE_KIND` is the exhaustive typed bridge between
 * `FoundationHeader`'s kind enum and `FoundationResourceBody`'s kind union.
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

/** Props for {@link FoundationResourcePage}. */
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
const FoundationResourcePage = ({
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

    const resourceBody = <StackV gap={6} isSkeleton={isSkeleton} items={[() => resourceSections]} />

    return <Container size="md" padding={6} body={resourceBody} />
}

export { FoundationResourcePage }

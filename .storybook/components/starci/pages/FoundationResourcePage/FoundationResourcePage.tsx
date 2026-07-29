import React from "react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
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
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `FoundationResourcePage`: one foundation resource's own page
 * (external link / video / document), reached from a category list.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. THREE FUNCTIONS, in the order
 * the reader meets them: say if the learner is on a trial and should upgrade ·
 * what this resource is · the resource itself.
 *
 * ⭐ THE TRIAL BANNER IS ORTHOGONAL TO WHETHER THE RESOURCE WAS FOUND. It sits
 * OUTSIDE the `isEmpty` switch, not inside it — a trial learner who followed a
 * stale link still deserves the "upgrade" nudge, and `TrialEnrollBanner`
 * already self-hides on its own two grounds (`!isKnown`, `isEnrolled`), so the
 * screen does not need a third condition to gate it.
 *
 * `isEmpty` REPLACES ONLY THE IDENTITY + BODY PAIR — same idiom `CourseContents`
 * uses for its own `AsyncContentEmpty` swap, scoped to the part that actually
 * has nothing to show once a resource id resolves to nothing.
 *
 * ⭐ TWO DIFFERENT `FoundationKind` TYPES COLLIDE ON PURPOSE. `FoundationHeader`
 * exports a closed 3-value ENUM (nominal, used for the kind chip's color/label
 * lookup); `FoundationResourceBody` exports a plain 3-value STRING UNION (used
 * to switch which shape the body draws). Same 3 underlying strings, same name,
 * but TypeScript keeps a string enum nominally distinct from a plain string
 * union — a bare cast would silently paper over a future 4th kind landing in
 * one file and not the other. `KIND_TO_RESOURCE_KIND` is the one, EXHAUSTIVE,
 * typed bridge between them: the compiler refuses a build that adds a kind to
 * the enum and forgets its entry here.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** `true` → the header shows the editorial "Nên xem" pill. */
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

    /** `true` → the resource id resolved to nothing; `AsyncContentEmpty` replaces the identity + body pair. */
    isEmpty?: boolean
    /**
     * `true` → every block that can mirror itself does. The flag flows
     * straight down to `FoundationHeader`/`FoundationResourceBody`, and each
     * block draws its OWN resting shape — the screen builds no shimmer tree
     * of its own.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/** Props for the internal {@link FoundationResourceEmpty} helper. */
interface FoundationResourceEmptyProps {
    /** When on, the empty-message frame emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy: boolean
}

/**
 * Empty state — the resource id resolved to nothing.
 *
 * Scoped to the identity + body pair only, per the file header: the trial
 * banner keeps its own place above this in the caller.
 */
const FoundationResourceEmpty = ({ showAnatomy }: FoundationResourceEmptyProps) => (
    <AsyncContentEmpty
        anatPart={showAnatomy ? "AsyncContentEmpty" : undefined}
        icon={MagnifyingGlassIcon}
        title="Không tìm thấy tài nguyên này"
        description="Tài nguyên có thể đã bị gỡ hoặc đường dẫn không còn đúng — quay lại danh mục để tìm tài nguyên khác."
    />
)

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
    showAnatomy = false,
}: FoundationResourcePageProps) => (
    <Container size="md" padding="roomy" anatPart={showAnatomy ? "Container" : undefined}>
        <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
            <TrialEnrollBanner
                anatPart="TrialEnrollBanner"
                isKnown={isEnrollmentKnown}
                isEnrolled={isEnrolled}
                onEnroll={onEnroll}
                showAnatomy={showAnatomy}
            />
            {isEmpty ? (
                <FoundationResourceEmpty showAnatomy={showAnatomy} />
            ) : (
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                    <FoundationHeader
                        anatPart="FoundationHeader"
                        breadcrumbItems={breadcrumbItems}
                        title={title}
                        description={description}
                        kind={kind}
                        isRecommended={isRecommended}
                        tags={tags}
                        author={author}
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                    />
                    <FoundationResourceBody
                        anatPart="FoundationResourceBody"
                        kind={KIND_TO_RESOURCE_KIND[kind]}
                        markdownBody={markdownBody}
                        linkTitle={linkTitle}
                        linkUrl={linkUrl}
                        onOpenLink={onOpenLink}
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                    />
                </StackV>
            )}
        </StackV>
    </Container>
)

export { FoundationResourcePage }

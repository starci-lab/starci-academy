import React from "react"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * `SubmissionResultHeader` — the identity of a graded-result page: a `LinkBack`
 * to the challenge plus the requirement's title/description, placed in the same
 * `PageHeader` frame `ContentHeader` uses. Sibling of `ContentHeader`, not a
 * copy — a result page has left the material, so no read-state chip, minutes, or
 * outcomes. The breadcrumb slot holds a single back-link (`backLabel` + `onBack`
 * -> `LinkBack`), not a trail. `title`/`description` are the requirement's own
 * strings, unreshaped. Skeleton mirrors each part with a `Typography` bar at the
 * matching scale (`LinkBack`/`PageHeader` have no `isSkeleton`).
 */

/** Props for {@link SubmissionResultHeader}. */
export interface SubmissionResultHeaderProps {
    /** Back-link label, localized by the caller, e.g. "Back to the solution". */
    backLabel: string
    /** Fired when the learner leaves the result page for the challenge solve page. */
    onBack: () => void
    /** The graded requirement's title. */
    title: string
    /** The requirement's own description/prompt. Omitted → the header ends at the title. */
    description?: string
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms (or their skeleton mirror when the atom has none
     * of its own) rather than building a parallel skeleton tree (§12c).
     */
    isSkeleton?: boolean
}

/**
 * Identity band of a graded-result page. See the file header for the full
 * contract and why the breadcrumb slot holds a back-link instead of a trail.
 *
 * @param props - {@link SubmissionResultHeaderProps}
 */
const SubmissionResultHeader = ({
    backLabel,
    onBack,
    title,
    description,
    isSkeleton = false,
}: SubmissionResultHeaderProps) => {
    return (
        <div>
            <PageHeader

                isSkeleton={isSkeleton}
                breadcrumb={() =>
                    isSkeleton ? (
                        <Typography size="sm" isSkeleton classNames={["w-1/3"]} />
                    ) : (
                        <LinkBack label={backLabel} onPress={onBack} />
                    )
                }
                title={title}
                description={description}
            />
        </div>
    )
}

export { SubmissionResultHeader }

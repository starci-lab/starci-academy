import React from "react"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `SubmissionResultHeader`: the IDENTITY of a graded-result page — a way
 * back to the challenge, plus the requirement's title/description.
 *
 * SIBLING OF `ContentHeader`, NOT A COPY. Both place identity into the same
 * `PageHeader` frame, but they answer different questions and carry different
 * data. `ContentHeader` is a lesson's read-state + minutes + outcomes cluster —
 * a reader is still INSIDE the material. A result page has already left it: the
 * learner submitted, is looking at a verdict, and the only questions left are
 * "where am I" and "how do I leave". So this block carries no read-state chip,
 * no minutes, no outcomes card — just the trail-and-title shape, reused from the
 * SAME frame `ContentHeader` uses, for a DIFFERENT domain.
 *
 * ⭐ THE BREADCRUMB SLOT HOLDS A BACK-LINK, NOT A TRAIL. `ContentHeader` builds a
 * full `Breadcrumbs` because a lesson sits several levels deep in a course. A
 * result page has exactly one place to go back to — the challenge solve page —
 * so it composes `backLabel` + `onBack` into a single `LinkBack` and drops it
 * into `PageHeader`'s `breadcrumb` slot. This is the SAME judgement call
 * `WorkSessionHeader` makes for its own back-link: the caller hands over a label
 * and a handler, never a pre-built node, and the block owns which atom that
 * becomes. Reusing the `breadcrumb` slot (rather than inventing a new one) keeps
 * this block on the one frame `ContentHeader` already established for page
 * identity — a fresh "back row" slot would have been a second, parallel way to
 * say the same thing `PageHeader.breadcrumb` already says.
 *
 * ⛔ NO OWN WORDING beyond the back-link's default. `title`/`description` are the
 * requirement's own text, handed down as plain strings — the block does not
 * reshape them (unlike `ContentHeader`, which composes a meta line out of
 * numbers). There is nothing here to compose because a result page's identity
 * IS the requirement it graded.
 *
 * SKELETON, MIRRORED PART BY PART (§12c). `LinkBack` has no `isSkeleton` of its
 * own (it is a pressable text-link, not a data-bearing atom), so in the loading
 * state the block stands a `Typography` bar in its place at the SAME text scale
 * (`size="sm"`) the real link renders at — the same trick `ContentHeader` uses
 * for `PageHeader`'s title/description when the wrapping frame has no skeleton
 * mode of its own. Title and description swap to their own `Typography`
 * skeleton bars the same way.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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

import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ProofStrip` — the tenant landing's outcomes-at-a-glance strip: real course
 * count, real lesson count, and the community's honest open/coming-soon
 * status, in one full-width row. Fills the researched "Outcomes / benefits"
 * section the current block set does not cover on its own — every number is
 * derived from the real course list this strip is handed, never a separate,
 * inventable prop. Built on the shared HeroUI atom system
 * (`SurfaceCard`/`Grid`/`Typography`/`Stack`), re-themed per tenant through
 * `apps/expert/app/globals.css`'s `--nivo-*` -> HeroUI CSS-var bridge — see
 * the component's own file header for the full contract, and the sibling
 * `nivo` namespace's own `ProofStrip` for the shared shape this mirrors.
 */

/** One real course, reduced to what this strip counts. */
export interface ProofStripCourse {
    /** Catalog course id (`Course.slug`). */
    id: string
    /** `Course.lessons.length`. */
    lessonCount: number
}

/** The already-resolved copy this strip renders. */
export interface ProofStripLabels {
    /** Label under the course count (e.g. "Courses live"). */
    courseLabel: string
    /** Label under the lesson count (e.g. "Lessons ready"). */
    lessonLabel: string
    /** Label under the community cell (e.g. "Community"). */
    communityLabel: string
    /** Community value when at least one real post exists (e.g. "Open"). */
    communityOpenValue: string
    /** Community value when the community is on but genuinely has zero posts yet (e.g. "Opening soon"). */
    communityComingSoonValue: string
}

/** Props for {@link ProofStrip}. */
export interface ProofStripProps {
    /** The real, unpaginated course list — `courseCount` and `lessonCount` are both derived from this, never passed as separate numbers. */
    courses: Array<ProofStripCourse>
    /** Real `Brand.communityEnabled` — a disabled feature never gets a cell of its own. */
    isCommunityEnabled: boolean
    /** Real `posts().length > 0` — decides which of the two honest community values shows. */
    hasCommunityPost: boolean
    /** Already-localized copy. */
    labels: ProofStripLabels
    /** `true` → every cell's value and label shimmer, mirroring the loaded shape (same page-level first-load region `HeroIdentity`'s stat line belongs to). */
    isSkeleton?: boolean
}

/** One stat cell: a bold value over a muted label, both threaded with `isSkeleton`. */
const Stat = ({ value, label, isSkeleton }: { value: string; label: string; isSkeleton?: boolean }) => (
    <StackV
        gap={1}
        align="center"
        isSkeleton={isSkeleton}
        items={[
            () => (
                <Typography
                    size="h3"
                    weight="bold"
                    align="center"
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-1/2"] : undefined}
                    text={value}
                />
            ),
            () => (
                <Typography
                    size="sm"
                    color="muted"
                    align="center"
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-2/3"] : undefined}
                    text={label}
                />
            ),
        ]}
    />
)

/**
 * The outcomes-at-a-glance strip. See the file header for why every number is
 * derived and why the community cell is qualitative, not a fabricated count.
 *
 * @param props - {@link ProofStripProps}
 */
const ProofStrip = ({ courses, isCommunityEnabled, hasCommunityPost, labels, isSkeleton = false }: ProofStripProps) => {
    const courseCount = courses.length
    const lessonCount = courses.reduce((total, course) => total + course.lessonCount, 0)
    const communityValue = hasCommunityPost ? labels.communityOpenValue : labels.communityComingSoonValue

    return (
        <div data-tier="block" data-component="ProofStrip">
            <SurfaceCard
                padding={4}
                isSkeleton={isSkeleton}
                body={() => (
                    <Grid
                        columns={isCommunityEnabled ? { base: 1, sm: 3 } : { base: 1, sm: 2 }}
                        gap={6}
                        isSkeleton={isSkeleton}
                        items={[
                            { key: "courses", content: () => <Stat value={String(courseCount)} label={labels.courseLabel} isSkeleton={isSkeleton} /> },
                            { key: "lessons", content: () => <Stat value={String(lessonCount)} label={labels.lessonLabel} isSkeleton={isSkeleton} /> },
                            ...(isCommunityEnabled
                                ? [{ key: "community", content: () => <Stat value={communityValue} label={labels.communityLabel} isSkeleton={isSkeleton} /> }]
                                : []),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { ProofStrip }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ProofStrip" } as const

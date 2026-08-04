import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProofStrip, type ProofStripCourse, type ProofStripLabels } from "@sb-components/nivoexpert/blocks/landing/ProofStrip/ProofStrip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
const meta: Meta<typeof ProofStrip> = {
    title: "NivoExpert/Blocks/Landing/ProofStrip/ProofStrip",
    component: ProofStrip,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProofStrip>

const LABELS: ProofStripLabels = {
    courseLabel: "Courses live",
    lessonLabel: "Lessons ready",
    communityLabel: "Community",
    communityOpenValue: "Open",
    communityComingSoonValue: "Opening soon",
}

const POPULATED_COURSES: Array<ProofStripCourse> = [
    { id: "eight-session-launch", lessonCount: 8 },
    { id: "seed-round-pitch", lessonCount: 6 },
    { id: "no-code-first-mvp", lessonCount: 5 },
    { id: "first-three-hires", lessonCount: 7 },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the full-width strip face" },
    Grid: { tier: "frame", role: "lays the 2 or 3 stat cells side by side, reflowing to one column narrow" },
    Typography: { tier: "atom", role: "each cell's bold value over its muted label" },
}

/** LEAF — one shape; `courses`, `isCommunityEnabled`, `hasCommunityPost`, and `isSkeleton` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProofStrip"
                tier="block"
                leaf="Outcome cells"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="`courseCount` and `lessonCount` are DERIVED from `courses` (`courses.length` and the sum of each course's `lessonCount`), never passed as separate numbers — the same `CoursesResolver.execute()` shape `CourseOfferCard`/`HeroIdentity` already read, counted once here so the three can never drift. `0` is an honest, real value shown as-is, the same way the sibling `nivo` namespace's own `ProofStrip` shows a literal `0` rather than dramatizing an empty catalog. The community cell is qualitative (`Open` / `Opening soon`), never a fabricated member or post count — and it does not render at all when `isCommunityEnabled` is false, the same 'disabled ≠ empty' rule `CommunityPreviewCard` applies."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The page's courses/community data is still in flight: every cell's value and label shimmer at the same geometry as the loaded shape, so nothing jumps once the numbers land.",
                        code: "<ProofStrip courses={[]} isCommunityEnabled hasCommunityPost={false} labels={labels} isSkeleton />",
                        render: <ProofStrip courses={[]} isCommunityEnabled hasCommunityPost={false} labels={LABELS} isSkeleton />,
                    },
                    {
                        name: "populated, community open",
                        why: "The typical tenant: four real courses (course/lesson counts summed from them) and a community with at least one real post, so the third cell reads 'Open'.",
                        code: "<ProofStrip courses={courses} isCommunityEnabled hasCommunityPost labels={labels} />",
                        render: <ProofStrip courses={POPULATED_COURSES} isCommunityEnabled hasCommunityPost labels={LABELS} />,
                    },
                    {
                        name: "community enabled, zero posts yet",
                        why: "`communityEnabled` is true but `posts()` is genuinely empty — the honest 'Opening soon' value, the same 'be the first' framing `CommunityPreviewCard` gives the same real state.",
                        code: "<ProofStrip courses={courses} isCommunityEnabled hasCommunityPost={false} labels={labels} />",
                        render: <ProofStrip courses={POPULATED_COURSES} isCommunityEnabled hasCommunityPost={false} labels={LABELS} />,
                    },
                    {
                        name: "community disabled",
                        why: "`Brand.communityEnabled` is false — the third cell is omitted entirely rather than shown as 'closed', so the strip reflows to two cells instead of padding out a disabled feature.",
                        code: "<ProofStrip courses={courses} isCommunityEnabled={false} hasCommunityPost={false} labels={labels} />",
                        render: <ProofStrip courses={POPULATED_COURSES} isCommunityEnabled={false} hasCommunityPost={false} labels={LABELS} />,
                    },
                    {
                        name: "zero-course tenant (new tenant, critical case)",
                        why: "Every tenant starts here. `courseCount` and `lessonCount` both read a real, honest `0` — no invented placeholder number, matching the sibling `nivo` `ProofStrip`'s own zero-is-honest convention.",
                        code: "<ProofStrip courses={[]} isCommunityEnabled hasCommunityPost={false} labels={labels} />",
                        render: <ProofStrip courses={[]} isCommunityEnabled hasCommunityPost={false} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContentTier, ModuleHeader } from "@sb-components/starci/blocks/learn/ModuleHeader/ModuleHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ModuleHeader`: the MODULE-IDENTITY cluster at the top of a module's
 * own page. It answers "what is this module, and how big is it".
 *
 * THIRD SIBLING of `ContentHeader` (lesson identity) and `CourseBrief` (course
 * identity), NOT a copy of either. All three place identity into the same
 * `PageHeader` frame, but this one carries a module's tier plus three counts
 * of its own (lessons, minutes, challenges) rather than read-state/outcomes or
 * modules/hours/learners.
 *
 * ⚠️ THREE REAL `HighlightChip`s, not muted text — a deliberate departure from
 * `ContentHeader`'s "one chip, rest as quiet text". Here the counts ARE the
 * module's headline figures (mirrors the real `ModulePage`'s own meta row), so
 * they keep their chip shape; `tier` stays the one fact that CLASSIFIES the
 * module, same split `ChallengeHeader` draws between `difficulty` and `status`.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Which chips are drawn inside the meta row —
 * tier present/absent, each count above/at zero — never changes the row's own
 * shape, so all of that stays STATES of one leaf (same reasoning
 * `ChallengeHeader` uses for its status chip). Only losing the WHOLE meta row
 * — description gone too — drops an entire `PageHeader` region, which is why
 * that gets its own leaf, the way `CourseBrief`'s `TitleOnly` does.
 */
const meta: Meta<typeof ModuleHeader> = {
    title: "StarCi/Blocks/Learn/ModuleHeader/ModuleHeader",
    component: ModuleHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ModuleHeader>

const CRUMBS = [
    { key: "courses", label: "Courses", onPress: () => {} },
    { key: "course", label: "DevOps Mastery", onPress: () => {} },
    { key: "module", label: "Containerization" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the trail, title, description and meta row, owning the type scale for all four", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the block builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the module title or its description — real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "StackH": { tier: "frame", role: "the horizontal frame holding the meta row, so the tier chip and the three counts sit on one baseline with one seam", storyId: "frames-stack-stackh--default" },
    "EnumChip": { tier: "composite", role: "the tier badge — the module's one classifying fact, drawn only once a tier is known", storyId: "composites-chips-enumchip--overview" },
    "HighlightChip": { tier: "composite", role: "one of the module's headline counts (lessons, minutes, or challenges), or its skeleton mirror — drawn only once its count is above zero", storyId: "composites-chips-highlightchip--with-icon" },
}

/** LEAF — full set: trail → title → description → meta row (tier chip + up to three counts). */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModuleHeader"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "tier = advanced, all three counts",
                        why: "An advanced module carrying its full figures draws the tier chip first, then all three counts in order — lessons, minutes, challenges. This is the shape a learner sees once a module's outline and estimates have fully resolved.",
                        code: `<ModuleHeader
    breadcrumbItems={crumbs}
    title="Containerizing applications"
    description="Packaging, optimizing images, and running containers in production."
    tier={CourseContentTier.Advanced}
    lessonCount={12}
    minutesTotal={145}
    challengeCount={6}
/>`,
                        render: (
                            <ModuleHeader

                               
                                breadcrumbItems={CRUMBS}
                                title="Containerizing applications"
                                description="Packaging, optimizing images, and running containers in production."
                                tier={CourseContentTier.Advanced}
                                lessonCount={12}
                                minutesTotal={145}
                                challengeCount={6}
                            />
                        ),
                    },
                    {
                        name: "tier = undefined, challengeCount = 0",
                        why: "A legacy module with no stored tier drops the classifying chip entirely, and a module with no challenges yet drops that one count — a zero is not news, so it does not get a pill claiming something is there. Lessons and minutes still carry the row.",
                        code: `<ModuleHeader
    breadcrumbItems={crumbs}
    title="Containerizing applications"
    description="Packaging, optimizing images, and running containers in production."
    lessonCount={8}
    minutesTotal={64}
    challengeCount={0}
/>`,
                        render: (
                            <ModuleHeader
                                breadcrumbItems={CRUMBS}
                                title="Containerizing applications"
                                description="Packaging, optimizing images, and running containers in production."
                                lessonCount={8}
                                minutesTotal={64}
                                challengeCount={0}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a brand-new module ⇒ **loses** the whole meta row and the description together. */
export const NoMeta: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModuleHeader"
                tier="block"
                leaf="No meta"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "description, tier, lessonCount, minutesTotal, challengeCount = undefined",
                        why: "Both the meta row and the description drop out, shrinking the cluster down to just the trail and the module name. A module whose outline has not been authored yet has no tier, no counts, and no summary to report, so the block shows only what it actually knows rather than an empty row.",
                        code: "<ModuleHeader breadcrumbItems={crumbs} title=\"Containerizing applications\" />",
                        render: (
                            <ModuleHeader

                               
                                breadcrumbItems={CRUMBS}
                                title="Containerizing applications"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF prop `isSkeleton` — the tree is IDENTICAL to the `Full` leaf (§12g.0a):
 * `isSkeleton` only changes STATE, no node lost/added (§11f), so it reuses the
 * `ANNOTATE` above, no separate parts array for this state.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModuleHeader"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every part the block composes swaps to its own shimmer while the module is still loading — the trail, the title, the description, the tier chip, and all three counts render at once so the row reserves its full shape and does not resize when the data lands (§8).",
                        code: "<ModuleHeader breadcrumbItems={[]} title=\"\" isSkeleton />",
                        render: (
                            <ModuleHeader

                               
                                isSkeleton
                                breadcrumbItems={[]}
                                title=""
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

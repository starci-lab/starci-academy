import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseQaInvite } from "@sb-components/starci/blocks/learn/CourseQaInvite/CourseQaInvite"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `CourseQaInvite`: the whole-page "nobody has asked anything yet"
 * invitation for a course's Q&A tab. Icon, a headline saying the tab is
 * genuinely empty, a hint, one way forward.
 *
 * ⭐ GENUINELY DIFFERENT FROM A SEARCH-EMPTY BRANCH inside the Q&A list — same
 * gotcha this codebase already documents for `ContentDiscussion` vs
 * `ContentRelatedList`. TRUE zero (never had a single question) reads as an
 * INVITATION with a "go read the content" remedy; "no results for this
 * filter/search" is a narrower miss with a "try something else" remedy. Same
 * word, opposite scope — not one component with a prop switch.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). The block always renders the same
 * icon/title/hint/action shape — `isSkeleton` only swaps the CTA's own render
 * (real ⇄ shimmer), it never changes what is composed, so it stays a STATE
 * inside the one `Default` leaf rather than spawning its own.
 */
const meta: Meta<typeof CourseQaInvite> = {
    title: "StarCi/Blocks/Learn/CourseQaInvite/CourseQaInvite",
    component: CourseQaInvite,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseQaInvite>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the face the invitation sits on, consistent with the other Q&A/course surfaces around it", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "EmptyState": { tier: "composite", role: "the centered icon/title/description/action stack — the same shape every other empty spot in this codebase uses", storyId: "composites-feedback-emptystate-emptystate--action" },
    "Button": { tier: "atom", role: "the single call to action, owning its own accent skin, the arrow that slides on hover, and its own shimmer while its destination is still resolving", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the Q&A tab has never had a single question. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaInvite"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = false",
                        why: "The tab is confirmed truly empty — no filter, no search, nobody has ever asked — so the invitation says so plainly and offers the one sensible next step: go back into the content the questions would be about. There is exactly one button, because a reader who just learned nobody has asked yet does not also need a choice.",
                        code: `<CourseQaInvite
    title="No questions yet"
    hint="Review the lesson content, then ask the first question — you'll be the one to break the ice."
    ctaLabel="View course content"
    onGoToContent={goToContent}
/>`,
                        render: (
                            <CourseQaInvite

                               
                                title="No questions yet"
                                hint="Review the lesson content, then ask the first question — you'll be the one to break the ice."
                                ctaLabel="View course content"
                                onGoToContent={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The headline and hint stay fully real — they are caller-supplied copy known before any request, same reasoning as `ContentPaywall`'s headline. Only the button mirrors itself, because its destination (which course/content id to route into) is the one thing here that can still be mid-flight.",
                        code: `<CourseQaInvite
    title="No questions yet"
    hint="Review the lesson content, then ask the first question — you'll be the one to break the ice."
    ctaLabel="View course content"
    onGoToContent={goToContent}
    isSkeleton
/>`,
                        render: (
                            <CourseQaInvite
                                title="No questions yet"
                                hint="Review the lesson content, then ask the first question — you'll be the one to break the ice."
                                ctaLabel="View course content"
                                onGoToContent={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    InstructorAuthorityCard,
    type InstructorAuthorityCardBrand,
    type InstructorAuthorityCardLabels,
} from "@sb-components/nivoexpert/blocks/landing/InstructorAuthorityCard/InstructorAuthorityCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `InstructorAuthorityCard` — the landing's trust signal about the person, one
 * of the two peer cards in the trust row (beside `CommunityPreviewCard`).
 * Deliberately THIN: `Brand` (`lib/api.ts`) has no `bio`, no `credentials`,
 * no testimonial, no student-count field anywhere in the schema, so this
 * card shows only what really exists — identity plus the real stat row
 * derived from `courses()` and `Brand.communityEnabled`. At zero courses the
 * three-chip stat row collapses to one honest combined line instead of
 * padding an empty stat with a zero lesson count and a community chip.
 *
 * HeroUI rebuild (P1 foundation): `Card`/`CardContent` + the shared
 * `Avatar`/`Chip`/`Typography`/`Stack` atoms, re-themed per tenant through
 * `apps/expert/app/globals.css`'s `--nivo-*` -> HeroUI CSS-var bridge — see
 * the component's own file header for the full contract.
 */
const meta: Meta<typeof InstructorAuthorityCard> = {
    title: "NivoExpert/Blocks/Landing/InstructorAuthorityCard/InstructorAuthorityCard",
    component: InstructorAuthorityCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof InstructorAuthorityCard>

const LABELS: InstructorAuthorityCardLabels = {
    courseSuffix: "courses",
    lessonSuffix: "lessons",
    comingSoonQualifier: "coming soon",
    communityOpenLabel: "Community open",
}

const BRAND: InstructorAuthorityCardBrand = {
    displayName: "Alex Rivera",
    tagline: "Startup advisor for early-stage founders",
    avatarUrl: null,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Avatar: { tier: "atom", role: "identity image, DiceBear/generated skipped via `fallback=\"initials\"`", storyId: "atoms-display-avatar-avatar--default" },
    Typography: { tier: "atom", role: "name, tagline, and the zero-course combined stat line", storyId: "atoms-text-typography-typography--default" },
    Chip: { tier: "atom", role: "course-count / lesson-count / community-open stat pills", storyId: "atoms-chips-chip-chip--default" },
}

/** LEAF — one shape; `courseCount`/`communityEnabled`/`avatarUrl`/`isSkeleton` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-sm">
            <BlockAnatomy
                name="InstructorAuthorityCard"
                tier="block"
                leaf="Trust card"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Blocks take no `className`: the card owns the instructor's real identity + stats, so a route places the WHOLE card rather than restyling it. No bio paragraph exists because `Brand` carries none — inventing one would be exactly the fabricated trust copy `business-parity` forbids. The community chip appears only when the tenant actually has a course AND `communityEnabled` is true — a disabled feature is never advertised as a stat, the same rule `CommunityPreviewCard` applies by omitting itself entirely. Built on the shared HeroUI atom system (`Card`/`Avatar`/`Chip`/`Typography`/`Stack`), re-themed per tenant through the `--nivo-*` -> HeroUI CSS-var bridge (`apps/expert/app/globals.css`) — the same accent/surface/foreground tokens the plain-CSS version read directly, now resolved one layer earlier."
                states={[
                    {
                        name: "courseCount > 0, community enabled",
                        why: "The typical populated case: course + lesson counts from `courses()`, and the community chip because `communityEnabled` is true. No avatar image set, so the initial glyph renders.",
                        code: `<InstructorAuthorityCard
    brand={brand}
    courseCount={4}
    lessonCount={26}
    communityEnabled
    labels={labels}
/>`,
                        render: (
                            <InstructorAuthorityCard
                                brand={BRAND}
                                courseCount={4}
                                lessonCount={26}
                                communityEnabled
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "courseCount > 0, community disabled, avatarUrl set",
                        why: "The tenant opted out of the community feature, so the third chip is omitted rather than shown as 'closed' — a disabled feature is not the same design problem as an empty one. `avatarUrl` is set here, covering the real-image branch.",
                        code: `<InstructorAuthorityCard
    brand={{ ...brand, avatarUrl: "https://cdn.nivo.app/alex-rivera/logo.png" }}
    courseCount={2}
    lessonCount={11}
    communityEnabled={false}
    labels={labels}
/>`,
                        render: (
                            <InstructorAuthorityCard
                                brand={{ ...BRAND, avatarUrl: "https://cdn.nivo.app/alex-rivera/logo.png" }}
                                courseCount={2}
                                lessonCount={11}
                                communityEnabled={false}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "courseCount = 0 (new tenant, critical case)",
                        why: "Every tenant starts here. The stat row collapses to one combined, honest line — no lesson count of zero, no community chip padding it out — real, not hidden.",
                        code: `<InstructorAuthorityCard
    brand={brand}
    courseCount={0}
    lessonCount={0}
    communityEnabled
    labels={labels}
/>`,
                        render: (
                            <InstructorAuthorityCard
                                brand={BRAND}
                                courseCount={0}
                                lessonCount={0}
                                communityEnabled
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The courses fetch is still in flight: the whole card — avatar, name, tagline, stat row — shimmers as one unit, so the trust row resolves together rather than the identity appearing to 'finish' before the stats do.",
                        code: "<InstructorAuthorityCard {...props} isSkeleton />",
                        render: (
                            <InstructorAuthorityCard
                                brand={BRAND}
                                courseCount={4}
                                lessonCount={26}
                                communityEnabled
                                isSkeleton
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

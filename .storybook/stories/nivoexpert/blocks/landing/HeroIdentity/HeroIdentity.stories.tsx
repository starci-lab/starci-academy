import type { Meta, StoryObj } from "@storybook/nextjs"
import { HeroIdentity, type HeroIdentityBrand, type HeroIdentityLabels } from "@sb-components/nivoexpert/blocks/landing/HeroIdentity/HeroIdentity"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `HeroIdentity` — the full-fold hero of a tenant's public landing
 * (`apps/expert` `/`): the expert's identity (avatar, name, tagline), one
 * real stat line, an optional promo-video trigger, and the page's single
 * primary action + one onward action. Grounded in the real `Brand` shape
 * (`lib/api.ts`) — no bio, no credentials, nothing beyond
 * `displayName`/`tagline`/`avatarUrl` exists to show. `courseCount === 0`
 * (every new tenant's starting state) flips the stat line to an honest
 * "not yet" and the primary action to a lead-capture ask, never both offered
 * at once.
 *
 * HeroUI: composes the house `Avatar`/`Button`/`Typography` atoms and
 * `Container`/`Cluster`/`StackV` frames — the same vocabulary
 * `nivo/blocks/landing/HeroBanner` builds its own hero from. Every colour
 * resolves through `apps/expert`'s `--nivo-*` → HeroUI bridge, so this
 * fixture renders correctly with no host `:root` override present.
 */
const meta: Meta<typeof HeroIdentity> = {
    title: "NivoExpert/Blocks/Landing/HeroIdentity/HeroIdentity",
    component: HeroIdentity,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof HeroIdentity>

const LABELS: HeroIdentityLabels = {
    courseSuffix: "courses open",
    lessonSuffix: "lessons",
    comingSoonStat: "Preparing the first course",
    primaryPopulatedLabel: "Start learning",
    primaryEmptyLabel: "Notify me at launch",
    secondaryPopulatedLabel: "See the community",
    secondaryEmptyLabel: "Talk to us",
}

const BRAND: HeroIdentityBrand = {
    displayName: "Alex Rivera",
    tagline: "Startup advisor for early-stage founders",
    avatarUrl: null,
}

/** LEAF — one shape; `courseCount`/`lessonCount`/`promoVideo`/`isSkeleton` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture">
            <BlockAnatomy
                name="HeroIdentity"
                tier="block"
                leaf="Landing hero"
                reason="Blocks take no `className`: the hero owns the tenant's identity, so a route places the WHOLE hero rather than restyling it. `courseCount` decides which primary action is honest — a tenant with zero courses cannot offer 'start learning', so the action flips to a lead-capture ask instead of showing a dead link. The avatar/name/tagline never shimmer (see the component's own file header) — `page.tsx` resolves `brand` server-side before this block ever mounts, so those fields are never actually in flight. `promoVideo` is optional — present here only in the populated state to show the trigger's shape; a tenant with no clip simply omits the prop."
                states={[
                    {
                        name: "courseCount > 0 (populated, with promo video)",
                        why: "The typical volume once the tenant has published: the stat line reads the real course/lesson counts, the primary action routes into the catalog, the onward action opens the community, and — since this tenant recorded one — a ghost 'watch intro' trigger sits below the actions.",
                        code: `<HeroIdentity
    brand={brand}
    courseCount={4}
    lessonCount={26}
    onPrimary={goToCourses}
    onSecondary={goToCommunity}
    promoVideo={{ label: "Watch the 90s intro", onPress: openPlayer }}
    labels={labels}
/>`,
                        render: (
                            <HeroIdentity
                                brand={BRAND}
                                courseCount={4}
                                lessonCount={26}
                                onPrimary={() => {}}
                                onSecondary={() => {}}
                                promoVideo={{ label: "Watch the 90s intro", onPress: () => {} }}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "courseCount = 0 (new tenant, critical case)",
                        why: "Every tenant starts here. The stat line names the honest state instead of a fabricated date; the primary action becomes the lead-capture ask so the empty catalog is never a dead end. No promo video recorded yet either, so the trigger is simply absent — never a placeholder.",
                        code: `<HeroIdentity
    brand={brand}
    courseCount={0}
    lessonCount={0}
    onPrimary={scrollToLead}
    onSecondary={scrollToLead}
    labels={labels}
/>`,
                        render: (
                            <HeroIdentity
                                brand={BRAND}
                                courseCount={0}
                                lessonCount={0}
                                onPrimary={() => {}}
                                onSecondary={() => {}}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The courses fetch is still in flight: the stat line shimmers and no primary action (nor the promo-video trigger) renders, because the block cannot yet say whether 'start learning' or 'notify me' is the honest one. The identity above stays put — it is resolved before this block ever mounts.",
                        code: "<HeroIdentity {...props} isSkeleton />",
                        render: (
                            <HeroIdentity
                                brand={BRAND}
                                courseCount={0}
                                lessonCount={0}
                                onPrimary={() => {}}
                                onSecondary={() => {}}
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

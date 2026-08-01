import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Card, CardContent } from "@heroui/react"
import { HighlightCard } from "@sb-components/composites/cards/HighlightCard/HighlightCard"
import { Avatar as AtomAvatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `HighlightCard`: wraps a card with a single accent-colored arc
 * SWEEPING around it, sitting as its own layer BEHIND it (peeking out past
 * the edges by 2px) — a pure "standout" decoration, NOT a data signal
 * (contrast with `SectionCard`'s `withVerdict`). Use for the ONE card that
 * genuinely needs to stand out on a surface — multiple highlighted cards on
 * the same screen cancel each other's emphasis out.
 *
 * 📐 **1 PROP = 1 LEAF.** `HighlightCard` only has ONE prop that changes its
 * own visual: `isSkeleton`. `children` has no leaf of its own — it is the
 * wrapped card, arbitrary content this wrapper never inspects. `classNames`
 * has no leaf either: appearance is not passable, it is already a prop.
 * `anatPart` is anatomy wiring, not a design prop — it is set on every
 * render below so the wrapper can badge its own root, never leafed itself.
 *
 * ⚠️ The wrapped `children` is arbitrary caller content (§11a.1 CASE 3 — no
 * ONE fixed component to point to), so it is NOT declared in `annotate`.
 * Only the wrapper's own root gets a self-entry, the same convention
 * `MetricCard`/`ProgressRing` use for a composite that badges only itself.
 */
const meta: Meta<typeof HighlightCard> = {
    title: "Composites/Cards/HighlightCard",
    component: HighlightCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof HighlightCard>

/** Standard mock content (C-fixture) = ProfileCard: Card + avatar + title + description. */
const ProfileCard = () => (
    <Card data-tier="fixture">
        <CardContent className="flex-row items-center gap-3">
            <Avatar className="size-10 shrink-0">
                <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">StarCi Academy</span>
                <span className="truncate text-xs text-muted">
                    Learn fullstack, system design, and DevOps on an interview-prep roadmap.
                </span>
            </div>
        </CardContent>
    </Card>
)

/** Skeleton mirror of ProfileCard — same frame, each node swapped for Skeleton.*. */
const ProfileCardSkeleton = () => (
    <Card data-tier="fixture">
        <CardContent className="flex-row items-center gap-3">
            <AtomAvatar isSkeleton size="md" classNames={["shrink-0"]} />
            <div className="flex min-w-0 grow flex-col">
                <Typography size="sm" isSkeleton classNames={["w-1/3"]} />
                <Typography size="xs" isSkeleton classNames={["w-2/3"]} />
            </div>
        </CardContent>
    </Card>
)

/**
 * Self-entry annotate table: the wrapper badges only its own root (the sweep
 * layer + the card it wraps have no anatomy wiring of their own), `storyId`
 * pointing back at this leaf so the entry is clickable like any other node.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "HighlightCard": {
        tier: "composite",
        role: "the sweeping-light layer sitting behind the wrapped card — adds no card chrome of its own",
        storyId: "composites-cards-highlightcard--default",
    },
}

/** Bare leaf — no prop turned on, the sweep at full emphasis around the standard ProfileCard fixture. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="HighlightCard"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="No prop turned on"
                    reason="The one standout wrapper in the system: an accent arc sweeping behind whatever card it wraps. This leaf is the baseline — the leaf below differs from it by exactly one prop, isSkeleton."
                    states={[
                        {
                            name: "isSkeleton = false (default)",
                            why: "The sweep renders at full emphasis behind the wrapped ProfileCard, drawing the reader's eye to this one card on the surface. Reach for this on the single card that genuinely needs to stand out — a second highlighted card on the same screen cancels this one's emphasis out.",
                            code: "<HighlightCard><ProfileCard /></HighlightCard>",
                            render: (
                                <HighlightCard anatPart="HighlightCard">
                                    <ProfileCard />
                                </HighlightCard>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Leaf for prop `isSkeleton` — the sweep MUTES while the wrapped content is still loading. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="HighlightCard"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="Prop `isSkeleton`"
                    reason="A skeleton has no 'verdict' yet, so it should not read as emphasized — isSkeleton mutes the sweep layer entirely while `children` still renders its own correct loading state, the wrapper never touches what's inside it."
                    states={[
                        {
                            name: "isSkeleton = false",
                            why: "The sweep renders behind the real ProfileCard, the shape isSkeleton mutes below.",
                            code: "<HighlightCard><ProfileCard /></HighlightCard>",
                            render: (
                                <HighlightCard anatPart="HighlightCard">
                                    <ProfileCard />
                                </HighlightCard>
                            ),
                        },
                        {
                            name: "isSkeleton = true",
                            why: "No sweep layer mounts at all — only the wrapped ProfileCardSkeleton's own shimmer shows, sitting in the frame the sweep would otherwise wrap. False emphasis on a loading card would tell the reader something is ready to look at when nothing is.",
                            code: "<HighlightCard isSkeleton><ProfileCardSkeleton /></HighlightCard>",
                            render: (
                                <HighlightCard isSkeleton anatPart="HighlightCard">
                                    <ProfileCardSkeleton />
                                </HighlightCard>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}

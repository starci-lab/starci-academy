import { Skeleton as HeroSkeleton } from "@heroui/react"
import { FlameIcon, GithubLogoIcon, GlobeIcon, LinkedinLogoIcon, MapPinIcon } from "@phosphor-icons/react"
import { Tabs, type TabItem } from "@/components/atoms/navigation/Tabs"
import { Typography, type TypographyIcon } from "@/components/atoms/text/Typography"
import { Chip } from "@/components/atoms/chips/Chip"
import { Button } from "@/components/atoms/buttons/Button"
import { IconTile } from "@/components/atoms/display/IconTile"
import { AvatarGroup, type AvatarGroupItem } from "@/components/composites/lists/AvatarGroup"
import { InlineIconLabel } from "@/components/composites/text/InlineIconLabel"
import { ProgressBar } from "@/components/atoms/display/Progress"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { Container } from "@/components/frames/Container"
import { StackV, StackH } from "@/components/frames/Stack"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { RailShell } from "@/components/frames/RailShell"
import type { CallerIdentity } from "@/components/frames/_identity"

/**
 * BLOCK — `ProfileLoadingState`: the public-profile first-load skeleton. It
 * takes no data props (see the component's own file header) so it has exactly
 * ONE leaf and ONE state — there is no prop to vary it by.
 *
 * `annotate` (flat map, not a nested `parts` tree) is the right shape here for
 * the same reason `ContinueCard`'s own `Skeleton` leaf uses it: every text/pill/
 * progress/tile spot renders through an atom's OWN `isSkeleton` branch, so the
 * DOM this leaf produces really is flat repeats of a handful of part names
 * (`Typography`, `Chip`, `Button`, `IconTile`, `Avatar`, `Skeleton`…), not a
 * meaningfully nested composition tree.
 *
 * The outer split (identity rail beside the overview column) is `RailShell` —
 * the same leading-rail-beside-a-growing-body khung `SettingsLayout` composes
 * through, column-first on narrow screens and a row from `@app-md`.
 */

/** Props for {@link ProfileLoadingState}. Pure skeleton — no data props (see file header). */
export interface ProfileLoadingStateProps {
    /**
     * Caller identity to wear on this block's root instead of its own — pass this
     * when a `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape
     * of its own) is using this block AS its root element, instead of wrapping it in a
     * raw `<div data-tier=… data-component=…>`. See `_identity.ts`. Omitted → this root
     * (a `StackV` track) keeps emitting its own underlying `data-tier="frame"
     * data-component="Flex"`, same as any other unbadged `StackV` instance.
     */
    identity?: CallerIdentity
}

/** Placeholder tab-strip items — 5 tabs (overview/projects/challenges/skills/activity), never read: `Tabs isSkeleton` never renders a label. */
const TAB_ITEMS: Array<TabItem> = [0, 1, 2, 3, 4].map((i) => ({ key: `tab-${i}`, label: "" }))

/** Placeholder medal-strip members — `AvatarGroup` needs `items` even while skeleton (its shimmer mirrors `items.length` slots). */
const MEDAL_ITEMS: Array<AvatarGroupItem> = [0, 1, 2, 3, 4].map((i) => ({ key: `medal-${i}` }))

/** One meta row's stable key + the icon its loaded counterpart would show — github / linkedin / website, mirrors `ProfileHero`'s own `SOCIAL_META`. */
const META_ROWS: ReadonlyArray<{ key: string; icon: TypographyIcon }> = [
    { key: "meta-github", icon: GithubLogoIcon },
    { key: "meta-linkedin", icon: LinkedinLogoIcon },
    { key: "meta-website", icon: GlobeIcon },
]

/**
 * The public-profile first-load skeleton. See the file header for why the
 * section order is hard-coded and why two spots fall back to a raw HeroUI
 * `Skeleton` (documented `couldNotFix` gaps — see the PR notes: a 128px avatar
 * and a heatmap-shaped rectangle have no matching atom to stand in for them).
 *
 * @param props - {@link ProfileLoadingStateProps}
 */
export const ProfileLoadingState = ({ identity }: ProfileLoadingStateProps) => {
    // Free-form rows built here (not by `SurfaceCardList`'s own `isSkeleton`, §12c):
    // the courses/readiness rows carry BESPOKE content (an IconTile, a progress
    // bar), not the composite's fixed leading/title/subtitle slots, so each row
    // passes `content` and stays untouched by the list's own shimmer branch.
    const readinessTrack = (
        <>
            <Typography size="sm" isSkeleton classNames={["w-1/2"]} />
            <ProgressBar isSkeleton />
            <ProgressBar isSkeleton />
        </>
    )

    const readinessItems: Array<SurfaceCardListItem> = [
        {
            key: "readiness-track",
            content: () => <StackV gap={4} items={[() => readinessTrack]} />,
        },
    ]

    const courseItems: Array<SurfaceCardListItem> = [0, 1].map((i) => {
        const progressHeader = (
            <>
                <Typography size="sm" isSkeleton classNames={["w-1/2"]} />
                <Typography size="xs" isSkeleton classNames={["w-1/4", "shrink-0"]} />
            </>
        )
        const courseDetails = (
            <>
                <StackH gap={3} principle="value-row" justify="between" items={[() => progressHeader]} />
                <ProgressBar isSkeleton />
            </>
        )
        const courseRow = (
            <>
                <IconTile isSkeleton size="sm" />
                <StackV gap={3} classNames={["min-w-0", "flex-1"]} items={[() => courseDetails]} />
            </>
        )
        return {
            key: `course-${i}`,
            content: () => <StackH gap={4} items={[() => courseRow]} />,
        }
    })

    const skillItems: Array<GridItem> = [0, 1].map((i) => {
        const statCardBody = (
            <>
                <Typography size="h3" isSkeleton classNames={["w-1/4"]} />
                <Typography size="sm" isSkeleton classNames={["w-2/3"]} />
                <Typography size="xs" isSkeleton classNames={["w-1/3"]} />
            </>
        )
        const skillCard = (
            <>
                <Typography size="h4" isSkeleton classNames={["w-1/2"]} />
                <SurfaceCard
                    padding={4}
                    body={() => <StackV gap={3} items={[() => statCardBody]} />}
                />
            </>
        )
        return {
            key: `skill-${i}`,
            content: () => <StackV gap={4} items={[() => skillCard]} />,
        }
    })

    // ── identity column — bare, no card face (matches `ProfileHeroSkeleton`) ──

    // rank-framed avatar + rank pill — 128px avatar has no matching `Avatar`
    // preset (sm/md/lg cap at 48px), so this spot builds its own shimmer.
    // ⚠️ couldNotFix (no-heroui-outside-vocabulary): no atom offers a 128px
    // circular shimmer, so this stays a raw HeroUI `Skeleton`.
    const rankAvatarRow = (
        <>
            <HeroSkeleton className="size-32 rounded-full" />
            <Chip isSkeleton />
        </>
    )

    // name (h3) + role title + @handle — one unit of meaning, flush
    const nameBlock = (
        <>
            <Typography size="h3" isSkeleton classNames={["w-3/4"]} />
            <Typography size="sm" isSkeleton classNames={["w-1/2"]} />
            <Typography size="sm" isSkeleton classNames={["w-1/3"]} />
        </>
    )

    // location · preferred work mode — `InlineIconLabel` is the sanctioned
    // "leading icon + inline text" composite (mirrors `ProfileHero`'s own use
    // of it for this exact row).
    const locationRow = (
        <>
            <InlineIconLabel icon={MapPinIcon} isSkeleton size="sm" skeletonWidth="w-1/3" />
            <Chip isSkeleton />
        </>
    )

    // follower / following line
    const followRow = (
        <>
            <Typography size="sm" isSkeleton classNames={["w-1/3"]} />
            <Typography size="sm" isSkeleton classNames={["w-1/3"]} />
        </>
    )

    // action cluster — two full-width buttons
    const actionButtons = (
        <>
            <Button isSkeleton classNames={["w-full"]} />
            <Button isSkeleton classNames={["w-full"]} />
        </>
    )

    // meta: github · linkedin · website — leading icon + text rows, each one `InlineIconLabel`.
    const metaRows = META_ROWS.map((row) => (
        <InlineIconLabel key={row.key} icon={row.icon} isSkeleton size="sm" skeletonWidth="w-1/2" />
    ))

    const identityColumnBody = (
        <>
            <StackV gap={2} principle="title-subtitle" align="start" items={[() => rankAvatarRow]} />
            <StackV gap={1} items={[() => nameBlock]} />

            {/* short bio */}
            <Typography size="sm" isSkeleton classNames={["w-2/3"]} />

            <StackH gap={3} principle="chip-row" at="sm" items={[() => locationRow]} />
            <StackH gap={4} items={[() => followRow]} />

            {/* earned-badge medal strip — `AvatarGroup` already owns the overlap look */}
            <AvatarGroup items={MEDAL_ITEMS} size="sm" isSkeleton />

            <StackV gap={3} items={[() => actionButtons]} />
            <StackV gap={4} items={[() => metaRows]} />
        </>
    )

    // ── overview body — the four sections, in the real screen's own order ──

    const readinessCard = (
        <>
            <Typography size="h3" isSkeleton classNames={["w-1/4"]} />
            <Typography size="sm" isSkeleton classNames={["w-2/3"]} />
            <Typography size="xs" isSkeleton classNames={["w-1/3"]} />
        </>
    )
    const readinessGroup = (
        <>
            <SurfaceCard
                padding={4}
                body={() => <StackV gap={3} items={[() => readinessCard]} />}
            />
            <SurfaceCardList
                items={readinessItems}
            />
        </>
    )
    // job readiness — headline metric card + a tracked-goal row
    const readinessSection = (
        <>
            <Typography size="h4" isSkeleton classNames={["w-1/2"]} />
            <StackV gap={4} items={[() => readinessGroup]} />
        </>
    )

    // courses — icon tile + title/percent + progress rows
    const coursesSection = (
        <>
            <Typography size="h4" isSkeleton classNames={["w-1/2"]} />
            <SurfaceCardList
                items={courseItems}
            />
        </>
    )

    // contributions — heatmap grid + streak line
    // ⚠️ couldNotFix (no-heroui-outside-vocabulary): no atom offers an
    // arbitrary-sized rounded rectangle shimmer, so the heatmap placeholder
    // stays a raw HeroUI `Skeleton`.
    const contributionGroup = (
        <>
            <HeroSkeleton className="h-40 w-full rounded-xl" />
            <InlineIconLabel icon={FlameIcon} isSkeleton size="sm" skeletonWidth="w-1/2" />
        </>
    )
    const contributionsSection = (
        <>
            <Typography size="h4" isSkeleton classNames={["w-1/2"]} />
            <StackV gap={4} items={[() => contributionGroup]} />
        </>
    )

    const overviewSections = (
        <>
            <StackV gap={4} items={[() => readinessSection]} />
            <StackV gap={4} items={[() => coursesSection]} />
            <StackV gap={4} items={[() => contributionsSection]} />
            {/* skills — 2-col grid of stat cards */}
            <Grid columns={{ base: 1, md: 2 }} gap={6} principle="block-boundary" items={skillItems} />
        </>
    )

    // outer split: identity rail first (mobile), row from `@app-md` — `RailShell`,
    // the same leading-rail-beside-a-growing-body khung `SettingsLayout` composes
    // through instead of a hand-rolled `StackV` + breakpoint className (that raw
    // shape is exactly what `no-raw-shape-at-sentence-tier` forbids here).
    const identityRail: ComponentTypeWithSkeleton = () => (
        <StackV gap={4} items={[() => identityColumnBody]} />
    )

    const overviewContent: ComponentTypeWithSkeleton = () => (
        <StackV gap={6} items={[() => overviewSections]} />
    )

    const overviewBody = <RailShell rail={identityRail} body={overviewContent} at="md" />

    return (
        // ⚠️ couldNotFix (require-identity-root / no-raw-shape-at-sentence-tier):
        // the previous root also carried `aria-busy="true"` and
        // `aria-label="Loading profile"` on a raw `<div>`. No frame in
        // `components/frames/` forwards arbitrary ARIA attributes (`Flex`/`Stack`/
        // `Box` all destructure a closed prop list with no `...rest` passthrough),
        // so moving the root onto `StackV` drops those two attributes — flagged
        // rather than silently lost; adding `aria-*` passthrough to `Flex` is out
        // of this file's scope.
        <StackV
            gap={1}
            classNames={["w-full"]}
            identity={identity}
            items={[
                () => (
                    // tab strip — full-bleed row under the navbar, same footprint as `ProfileTabsBar`.
                    // `px-6 py-3` is a one-off placement wrapper (a full-width strip flush under a sticky
                    // navbar, not a repeating list nor a generic card seam), same allowance `ContinueCard`
                    // uses for its own content wrapper — both padding digits (6, 3) are on the §10c scale.
                    // Carried via `Container`'s own `padding` prop (house-scale {{ x: 6, y: 4 }} = `px-6 py-3`)
                    // instead of a raw div — no `patterns.mjs` token names this asymmetric shape yet.
                    <Container
                        size="full"
                        padding={{ x: 6, y: 4 }}
                        body={() => (
                            <Tabs
                                items={TAB_ITEMS}
                                selectedKey={TAB_ITEMS[0].key}
                                onSelectionChange={() => {}}
                                ariaLabel="Profile sections loading"
                                variant="secondary"
                                isSkeleton
                            />
                        )}
                    />
                ),
                () => <Container size="lg" padding={6} body={() => overviewBody} />,
            ]}
        />
    )
}

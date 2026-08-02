import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { AvatarGroup, type AvatarGroupItem } from "@sb-components/composites/lists/AvatarGroup/AvatarGroup"
import { ProgressBar } from "@sb-components/atoms/display/Progress/Progress"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"
import { Grid, type GridItem } from "@sb-components/frames/Grid/Grid"

/**
 * `ProfileLoadingState` — the first-load skeleton for the public profile screen,
 * so nothing jumps once real data resolves: the tab strip, identity column, and
 * every overview section already sit in their final box. A block (not a
 * design/composite) because it hard-codes the screen's section order
 * (job-readiness -> courses -> contributions -> skills). No props beyond
 * `className`; one leaf. Each spot uses its atom's own `isSkeleton` (`Tabs`,
 * `Avatar`, `AvatarGroup`, `Grid`...) so footprints match; five spots with no
 * matching atom (a 128px hero avatar, three 20px leading-icon boxes, a 160px
 * heatmap) build a raw HeroUI `Skeleton` directly.
 */

/** Props for {@link ProfileLoadingState}. Pure skeleton — no data props (see file header). */
export interface ProfileLoadingStateProps {
    className?: string
    /** Anatomy tag for this block's own root. */
}

/** Placeholder tab-strip items — 5 tabs (overview/projects/challenges/skills/activity), never read: `Tabs isSkeleton` never renders a label. */
const TAB_ITEMS: Array<TabItem> = [0, 1, 2, 3, 4].map((i) => ({ key: `tab-${i}`, label: "" }))

/** Placeholder medal-strip members — `AvatarGroup` needs `items` even while skeleton (its shimmer mirrors `items.length` slots). */
const MEDAL_ITEMS: Array<AvatarGroupItem> = [0, 1, 2, 3, 4].map((i) => ({ key: `medal-${i}` }))

/** Meta rows under the hero action buttons — github / linkedin / website, three icon+text rows. */
const META_ROWS: Array<string> = ["meta-0", "meta-1", "meta-2"]

/**
 * The public-profile first-load skeleton. See the file header for why the
 * section order is hard-coded and why five spots fall back to a raw HeroUI
 * `Skeleton`.
 *
 * @param props - {@link ProfileLoadingStateProps}
 */
export const ProfileLoadingState = ({ className }: ProfileLoadingStateProps) => {
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
            content: () => <StackV gap={4} body={readinessTrack} />,
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
                <StackH gap={3} justify="between" body={progressHeader} />
                <ProgressBar isSkeleton />
            </>
        )
        const courseRow = (
            <>
                <IconTile isSkeleton size="sm" />
                <StackV gap={3} classNames={["min-w-0", "flex-1"]} body={courseDetails} />
            </>
        )
        return {
            key: `course-${i}`,
            content: () => <StackH gap={4} body={courseRow} />,
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

                    body={() => <StackV gap={3} body={statCardBody} />}
                />
            </>
        )
        return {
            key: `skill-${i}`,
            content: <StackV gap={4} body={skillCard} />,
        }
    })

    // ── identity column — bare, no card face (matches `ProfileHeroSkeleton`) ──

    // rank-framed avatar + rank pill — 128px avatar has no matching `Avatar`
    // preset (sm/md/lg cap at 48px), so this spot builds its own shimmer.
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

    // location · preferred work mode
    const locationLabel = (
        <>
            <HeroSkeleton className="size-5 rounded" />
            <Typography size="sm" isSkeleton classNames={["w-1/3"]} />
        </>
    )
    const locationRow = (
        <>
            <StackH gap={2} body={locationLabel} />
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

    // meta: github · linkedin · website — leading icon + text rows
    const metaRows = META_ROWS.map((key) => {
        const metaRow = (
            <>
                <HeroSkeleton className="size-5 rounded" />
                <Typography size="sm" isSkeleton classNames={["w-1/2"]} />
            </>
        )
        return <StackH key={key} gap={2} body={metaRow} />
    })

    const identityColumnBody = (
        <>
            <StackV gap={2} align="start" body={rankAvatarRow} />
            <StackV gap={1} body={nameBlock} />

            {/* short bio */}
            <Typography size="sm" isSkeleton classNames={["w-2/3"]} />

            <StackH gap={3} wrap body={locationRow} />
            <StackH gap={4} body={followRow} />

            {/* earned-badge medal strip — `AvatarGroup` already owns the overlap look */}
            <AvatarGroup items={MEDAL_ITEMS} size="sm" isSkeleton />

            <StackV gap={3} body={actionButtons} />
            <StackV gap={4} body={metaRows} />
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

                body={() => <StackV gap={3} body={readinessCard} />}
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
            <StackV gap={4} body={readinessGroup} />
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

    const contributionStreak = (
        <>
            <HeroSkeleton className="size-4 rounded-full" />
            <Typography size="sm" isSkeleton classNames={["w-1/2"]} />
        </>
    )
    const contributionGroup = (
        <>
            <HeroSkeleton className="h-40 w-full rounded-xl" />
            <StackH gap={3} body={contributionStreak} />
        </>
    )
    // contributions — heatmap grid + streak line
    const contributionsSection = (
        <>
            <Typography size="h4" isSkeleton classNames={["w-1/2"]} />
            <StackV gap={4} body={contributionGroup} />
        </>
    )

    const overviewSections = (
        <>
            <StackV gap={4} body={readinessSection} />
            <StackV gap={4} body={coursesSection} />
            <StackV gap={4} body={contributionsSection} />
            {/* skills — 2-col grid of stat cards */}
            <Grid columns={{ base: 1, md: 2 }} gap={6} items={skillItems} />
        </>
    )

    // outer split: identity column first (mobile), row from `@app-md` — same
    // `StackV` + breakpoint-override road `SettingsLayout` already uses instead of
    // `Split` (its two sides bake in the OPPOSITE width strategy from what a fixed
    // identity column + a flexing content column need).
    const outerRow = (
        <>
            <StackV
                gap={4}
                classNames={["w-full"]}
                className="@app-md:w-72 @app-md:shrink-0"

                body={identityColumnBody}
            />
            <StackV gap={6} classNames={["min-w-0", "flex-1"]} body={overviewSections} />
        </>
    )

    const overviewBody = (
        <StackV
            gap={6}
            className="@app-md:flex-row @app-md:items-start"

            body={outerRow}
        />
    )

    return (
        <div
            aria-busy="true"
            aria-label="Loading profile"

            className={cn("flex w-full flex-col", className)}
        >
            {/* tab strip — full-bleed row under the navbar, same footprint as `ProfileTabsBar`.
                `px-6 py-3` is a one-off placement wrapper (a full-width strip flush under a sticky
                navbar, not a repeating list nor a generic card seam), same allowance `ContinueCard`
                uses for its own content wrapper — both padding digits (6, 3) are on the §10c scale. */}
            <div className="w-full px-6 py-3">
                <Tabs
                    items={TAB_ITEMS}
                    selectedKey={TAB_ITEMS[0].key}
                    onSelectionChange={() => {}}
                    ariaLabel="Profile sections loading"
                    variant="secondary"
                    isSkeleton
                />
            </div>

            <Container size="lg" padding={6} body={overviewBody} />
        </div>
    )
}

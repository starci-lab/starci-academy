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
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ProfileLoadingState`: the FIRST-LOAD skeleton for the public profile
 * screen. It exists so nothing on that screen jumps once the real data resolves —
 * the tab strip, the identity column and every overview section already sit in
 * their FINAL box before a single byte of profile data has arrived.
 *
 * NEW block (no `src` port to diff against — `src/components/features/profile`
 * was read read-only as reference for WHICH sections exist and in what order,
 * not copied verbatim: this file rebuilds the same shell out of THIS system's own
 * atoms/frames/composites rather than mirroring `src`'s `Skeleton.*` namespace,
 * which does not exist here — see `[[storybook-no-namespace]]`).
 *
 * WHY THIS IS A BLOCK, NOT A DESIGN/COMPOSITE: it hard-codes the real profile
 * screen's specific section order (job-readiness → courses → contributions →
 * skills) — that ordering is DOMAIN knowledge about one specific screen, which is
 * exactly what makes something a block instead of a feature-less design piece
 * (`[[fe-primitive-definition]]`).
 *
 * PROPS: none beyond `className`/`showAnatomy`/`anatPart` (rule 9) — this is a
 * PURE skeleton, it never receives or displays data, so there is nothing else to
 * parameterize and therefore only one leaf/one story state.
 *
 * COMPOSITION, per real section (`ProfileHeroSkeleton` / `ProfileTabsBar` /
 * `ProfileOverviewTab`'s four sections read as reference):
 *   • tab strip      → `Tabs` (`isSkeleton variant="secondary"`) — the atom OWNS
 *     this exact shimmer shape already, so the strip is not hand-rolled.
 *   • hero column    → avatar+rank / name+role+handle / bio / location+work-mode /
 *     follower line / earned-badge medal strip (`AvatarGroup isSkeleton`, its
 *     native overlap job) / action buttons / meta rows.
 *   • overview body  → job-readiness (metric card + a tracked-goal row) /
 *     courses (icon-tile + title/percent + progress) / contributions
 *     (heatmap + streak line) / skills (2-col `Grid` of stat cards).
 *
 * Every text/pill/progress/tile spot with a matching atom uses that atom's own
 * `isSkeleton` (rule 6, §12c) instead of a hand-rolled bar, so the footprint is
 * guaranteed to match the atom's real box. FIVE spots genuinely have no atom to
 * carry the flag (a 128px hero avatar circle — bigger than `Avatar`'s three
 * presets; three decorative 20px leading-icon boxes; a 160px contribution
 * heatmap) — those build a raw HeroUI `Skeleton` directly, the same escape valve
 * `ContinueCard` documents in its own header for the same reason.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ProfileLoadingState}. Pure skeleton — no data props (see file header). */
export interface ProfileLoadingStateProps {
    className?: string
    /** `true` → tag each composed part with `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag for this block's own root. */
    anatPart?: string
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
export const ProfileLoadingState = ({ className, showAnatomy = false, anatPart }: ProfileLoadingStateProps) => {
    // Free-form rows built here (not by `SurfaceCardList`'s own `isSkeleton`, §12c):
    // the courses/readiness rows carry BESPOKE content (an IconTile, a progress
    // bar), not the composite's fixed leading/title/subtitle slots, so each row
    // passes `content` and stays untouched by the list's own shimmer branch.
    const readinessTrack = (
        <>
            <Typography size="sm" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
            <ProgressBar isSkeleton showAnatomy={showAnatomy} />
            <ProgressBar isSkeleton showAnatomy={showAnatomy} />
        </>
    )

    const readinessItems: Array<SurfaceCardListItem> = [
        {
            key: "readiness-track",
            content: () => <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={readinessTrack} />,
        },
    ]

    const courseItems: Array<SurfaceCardListItem> = [0, 1].map((i) => {
        const progressHeader = (
            <>
                <Typography size="sm" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
                <Typography size="xs" isSkeleton classNames={["w-1/4", "shrink-0"]} showAnatomy={showAnatomy} />
            </>
        )
        const courseDetails = (
            <>
                <StackH gap={3} justify="between" anatPart={showAnatomy ? "StackH" : undefined} body={progressHeader} />
                <ProgressBar isSkeleton showAnatomy={showAnatomy} />
            </>
        )
        const courseRow = (
            <>
                <IconTile isSkeleton size="sm" showAnatomy={showAnatomy} />
                <StackV gap={3} classNames={["min-w-0", "flex-1"]} anatPart={showAnatomy ? "StackV" : undefined} body={courseDetails} />
            </>
        )
        return {
            key: `course-${i}`,
            content: () => <StackH gap={4} anatPart={showAnatomy ? "StackH" : undefined} body={courseRow} />,
        }
    })

    const skillItems: Array<GridItem> = [0, 1].map((i) => {
        const statCardBody = (
            <>
                <Typography size="h3" isSkeleton classNames={["w-1/4"]} showAnatomy={showAnatomy} />
                <Typography size="sm" isSkeleton classNames={["w-2/3"]} showAnatomy={showAnatomy} />
                <Typography size="xs" isSkeleton classNames={["w-1/3"]} showAnatomy={showAnatomy} />
            </>
        )
        const skillCard = (
            <>
                <Typography size="h4" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
                <SurfaceCard
                    padding={4}
                    anatPart={showAnatomy ? "SurfaceCard" : undefined}
                    body={() => <StackV gap={3} anatPart={showAnatomy ? "StackV" : undefined} body={statCardBody} />}
                />
            </>
        )
        return {
            key: `skill-${i}`,
            content: <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={skillCard} />,
        }
    })

    // ── identity column — bare, no card face (matches `ProfileHeroSkeleton`) ──

    // rank-framed avatar + rank pill — 128px avatar has no matching `Avatar`
    // preset (sm/md/lg cap at 48px), so this spot builds its own shimmer.
    const rankAvatarRow = (
        <>
            <HeroSkeleton className="size-32 rounded-full" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
            <Chip isSkeleton showAnatomy={showAnatomy} />
        </>
    )

    // name (h3) + role title + @handle — one unit of meaning, flush
    const nameBlock = (
        <>
            <Typography size="h3" isSkeleton classNames={["w-3/4"]} showAnatomy={showAnatomy} />
            <Typography size="sm" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
            <Typography size="sm" isSkeleton classNames={["w-1/3"]} showAnatomy={showAnatomy} />
        </>
    )

    // location · preferred work mode
    const locationLabel = (
        <>
            <HeroSkeleton className="size-5 rounded" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
            <Typography size="sm" isSkeleton classNames={["w-1/3"]} showAnatomy={showAnatomy} />
        </>
    )
    const locationRow = (
        <>
            <StackH gap={2} anatPart={showAnatomy ? "StackH" : undefined} body={locationLabel} />
            <Chip isSkeleton showAnatomy={showAnatomy} />
        </>
    )

    // follower / following line
    const followRow = (
        <>
            <Typography size="sm" isSkeleton classNames={["w-1/3"]} showAnatomy={showAnatomy} />
            <Typography size="sm" isSkeleton classNames={["w-1/3"]} showAnatomy={showAnatomy} />
        </>
    )

    // action cluster — two full-width buttons
    const actionButtons = (
        <>
            <Button isSkeleton classNames={["w-full"]} showAnatomy={showAnatomy} />
            <Button isSkeleton classNames={["w-full"]} showAnatomy={showAnatomy} />
        </>
    )

    // meta: github · linkedin · website — leading icon + text rows
    const metaRows = META_ROWS.map((key) => {
        const metaRow = (
            <>
                <HeroSkeleton className="size-5 rounded" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                <Typography size="sm" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
            </>
        )
        return <StackH key={key} gap={2} anatPart={showAnatomy ? "StackH" : undefined} body={metaRow} />
    })

    const identityColumnBody = (
        <>
            <StackV gap={2} align="start" anatPart={showAnatomy ? "StackV" : undefined} body={rankAvatarRow} />
            <StackV gap={1} anatPart={showAnatomy ? "StackV" : undefined} body={nameBlock} />

            {/* short bio */}
            <Typography size="sm" isSkeleton classNames={["w-2/3"]} showAnatomy={showAnatomy} />

            <StackH gap={3} wrap anatPart={showAnatomy ? "StackH" : undefined} body={locationRow} />
            <StackH gap={4} anatPart={showAnatomy ? "StackH" : undefined} body={followRow} />

            {/* earned-badge medal strip — `AvatarGroup` already owns the overlap look */}
            <AvatarGroup items={MEDAL_ITEMS} size="sm" isSkeleton showAnatomy={showAnatomy} />

            <StackV gap={3} anatPart={showAnatomy ? "StackV" : undefined} body={actionButtons} />
            <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={metaRows} />
        </>
    )

    // ── overview body — the four sections, in the real screen's own order ──

    const readinessCard = (
        <>
            <Typography size="h3" isSkeleton classNames={["w-1/4"]} showAnatomy={showAnatomy} />
            <Typography size="sm" isSkeleton classNames={["w-2/3"]} showAnatomy={showAnatomy} />
            <Typography size="xs" isSkeleton classNames={["w-1/3"]} showAnatomy={showAnatomy} />
        </>
    )
    const readinessGroup = (
        <>
            <SurfaceCard
                padding={4}
                anatPart={showAnatomy ? "SurfaceCard" : undefined}
                body={() => <StackV gap={3} anatPart={showAnatomy ? "StackV" : undefined} body={readinessCard} />}
            />
            <SurfaceCardList
                items={readinessItems}
                anatPart={showAnatomy ? "SurfaceCardList" : undefined}
            />
        </>
    )
    // job readiness — headline metric card + a tracked-goal row
    const readinessSection = (
        <>
            <Typography size="h4" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
            <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={readinessGroup} />
        </>
    )

    // courses — icon tile + title/percent + progress rows
    const coursesSection = (
        <>
            <Typography size="h4" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
            <SurfaceCardList
                items={courseItems}
                anatPart={showAnatomy ? "SurfaceCardList" : undefined}
            />
        </>
    )

    const contributionStreak = (
        <>
            <HeroSkeleton className="size-4 rounded-full" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
            <Typography size="sm" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
        </>
    )
    const contributionGroup = (
        <>
            <HeroSkeleton className="h-40 w-full rounded-xl" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
            <StackH gap={3} anatPart={showAnatomy ? "StackH" : undefined} body={contributionStreak} />
        </>
    )
    // contributions — heatmap grid + streak line
    const contributionsSection = (
        <>
            <Typography size="h4" isSkeleton classNames={["w-1/2"]} showAnatomy={showAnatomy} />
            <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={contributionGroup} />
        </>
    )

    const overviewSections = (
        <>
            <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={readinessSection} />
            <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={coursesSection} />
            <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={contributionsSection} />
            {/* skills — 2-col grid of stat cards */}
            <Grid columns={{ base: 1, md: 2 }} gap={6} items={skillItems} showAnatomy={showAnatomy} />
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
                anatPart={showAnatomy ? "StackV" : undefined}
                body={identityColumnBody}
            />
            <StackV gap={6} classNames={["min-w-0", "flex-1"]} anatPart={showAnatomy ? "StackV" : undefined} body={overviewSections} />
        </>
    )

    const overviewBody = (
        <StackV
            gap={6}
            className="@app-md:flex-row @app-md:items-start"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={outerRow}
        />
    )

    return (
        <div
            aria-busy="true"
            aria-label="Loading profile"
            data-anat-part={anatPart}
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

            <Container size="lg" padding={6} anatPart={showAnatomy ? "Container" : undefined} body={overviewBody} />
        </div>
    )
}

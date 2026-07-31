import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { AvatarGroup, type AvatarGroupItem } from "@sb-components/atoms/display/Avatar/Avatar"
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
    const readinessItems: Array<SurfaceCardListItem> = [
        {
            key: "readiness-track",
            content: (
                <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                    <Typography size="sm" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                    <ProgressBar isSkeleton showAnatomy={showAnatomy} />
                    <ProgressBar isSkeleton showAnatomy={showAnatomy} />
                </StackV>
            ),
        },
    ]

    const courseItems: Array<SurfaceCardListItem> = [0, 1].map((i) => ({
        key: `course-${i}`,
        content: (
            <StackH gap="grouped" anatPart={showAnatomy ? "StackH" : undefined} showAnatomy={showAnatomy}>
                <IconTile isSkeleton size="sm" anatPart={showAnatomy ? "IconTile" : undefined} />
                <StackV gap="related" className="min-w-0 flex-1" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                    <StackH gap="related" justify="between" anatPart={showAnatomy ? "StackH" : undefined} showAnatomy={showAnatomy}>
                        <Typography size="sm" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                        <Typography size="xs" isSkeleton classNames={["w-1/4", "shrink-0"]} anatPart={showAnatomy ? "Typography" : undefined} />
                    </StackH>
                    <ProgressBar isSkeleton showAnatomy={showAnatomy} />
                </StackV>
            </StackH>
        ),
    }))

    const skillItems: Array<GridItem> = [0, 1].map((i) => ({
        key: `skill-${i}`,
        content: (
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                <Typography size="h4" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                <SurfaceCard padding="cozy" anatPart={showAnatomy ? "SurfaceCard" : undefined} showAnatomy={showAnatomy}>
                    <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                        <Typography size="h3" isSkeleton classNames={["w-1/4"]} anatPart={showAnatomy ? "Typography" : undefined} />
                        <Typography size="sm" isSkeleton classNames={["w-2/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                        <Typography size="xs" isSkeleton classNames={["w-1/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                    </StackV>
                </SurfaceCard>
            </StackV>
        ),
    }))

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
                    showAnatomy={showAnatomy}
                />
            </div>

            <Container size="lg" padding="roomy" anatPart={showAnatomy ? "Container" : undefined} showAnatomy={showAnatomy}>
                {/* outer split: identity column first (mobile), row from `@app-md` — same
                    `StackV` + breakpoint-override road `SettingsLayout` already uses instead of
                    `Split` (its two sides bake in the OPPOSITE width strategy from what a fixed
                    identity column + a flexing content column need). */}
                <StackV
                    gap="section"
                    className="@app-md:flex-row @app-md:items-start"
                    anatPart={showAnatomy ? "StackV" : undefined}
                    showAnatomy={showAnatomy}
                >
                    {/* identity column — bare, no card face (matches `ProfileHeroSkeleton`) */}
                    <StackV
                        gap="grouped"
                        className="w-full @app-md:w-72 @app-md:shrink-0"
                        anatPart={showAnatomy ? "StackV" : undefined}
                        showAnatomy={showAnatomy}
                    >
                        {/* rank-framed avatar + rank pill — 128px avatar has no matching `Avatar`
                            preset (sm/md/lg cap at 48px), so this spot builds its own shimmer. */}
                        <StackV gap="tight" align="start" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                            <HeroSkeleton className="size-32 rounded-full" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                            <Chip isSkeleton anatPart={showAnatomy ? "Chip" : undefined} />
                        </StackV>

                        {/* name (h3) + role title + @handle — one unit of meaning, flush */}
                        <StackV gap="flush" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                            <Typography size="h3" isSkeleton classNames={["w-3/4"]} anatPart={showAnatomy ? "Typography" : undefined} />
                            <Typography size="sm" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                            <Typography size="sm" isSkeleton classNames={["w-1/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                        </StackV>

                        {/* short bio */}
                        <Typography size="sm" isSkeleton classNames={["w-2/3"]} anatPart={showAnatomy ? "Typography" : undefined} />

                        {/* location · preferred work mode */}
                        <StackH gap="related" wrap anatPart={showAnatomy ? "StackH" : undefined} showAnatomy={showAnatomy}>
                            <StackH gap="tight" anatPart={showAnatomy ? "StackH" : undefined} showAnatomy={showAnatomy}>
                                <HeroSkeleton className="size-5 rounded" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                                <Typography size="sm" isSkeleton classNames={["w-1/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                            </StackH>
                            <Chip isSkeleton anatPart={showAnatomy ? "Chip" : undefined} />
                        </StackH>

                        {/* follower / following line */}
                        <StackH gap="grouped" anatPart={showAnatomy ? "StackH" : undefined} showAnatomy={showAnatomy}>
                            <Typography size="sm" isSkeleton classNames={["w-1/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                            <Typography size="sm" isSkeleton classNames={["w-1/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                        </StackH>

                        {/* earned-badge medal strip — `AvatarGroup` already owns the overlap look */}
                        <AvatarGroup items={MEDAL_ITEMS} size="sm" isSkeleton showAnatomy={showAnatomy} />

                        {/* action cluster — two full-width buttons */}
                        <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                            <Button isSkeleton classNames={["w-full"]} anatPart={showAnatomy ? "Button" : undefined} />
                            <Button isSkeleton classNames={["w-full"]} anatPart={showAnatomy ? "Button" : undefined} />
                        </StackV>

                        {/* meta: github · linkedin · website — leading icon + text rows */}
                        <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                            {META_ROWS.map((key) => (
                                <StackH key={key} gap="tight" anatPart={showAnatomy ? "StackH" : undefined} showAnatomy={showAnatomy}>
                                    <HeroSkeleton className="size-5 rounded" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                                    <Typography size="sm" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                                </StackH>
                            ))}
                        </StackV>
                    </StackV>

                    {/* overview body — the four sections, in the real screen's own order */}
                    <StackV gap="section" className="min-w-0 flex-1" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                        {/* job readiness — headline metric card + a tracked-goal row */}
                        <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                            <Typography size="h4" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                                <SurfaceCard padding="cozy" anatPart={showAnatomy ? "SurfaceCard" : undefined} showAnatomy={showAnatomy}>
                                    <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                                        <Typography size="h3" isSkeleton classNames={["w-1/4"]} anatPart={showAnatomy ? "Typography" : undefined} />
                                        <Typography size="sm" isSkeleton classNames={["w-2/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                                        <Typography size="xs" isSkeleton classNames={["w-1/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                                    </StackV>
                                </SurfaceCard>
                                <SurfaceCardList
                                    items={readinessItems}
                                    anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                                    showAnatomy={showAnatomy}
                                />
                            </StackV>
                        </StackV>

                        {/* courses — icon tile + title/percent + progress rows */}
                        <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                            <Typography size="h4" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                            <SurfaceCardList
                                items={courseItems}
                                anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                                showAnatomy={showAnatomy}
                            />
                        </StackV>

                        {/* contributions — heatmap grid + streak line */}
                        <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                            <Typography size="h4" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} showAnatomy={showAnatomy}>
                                <HeroSkeleton className="h-40 w-full rounded-xl" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                                <StackH gap="related" anatPart={showAnatomy ? "StackH" : undefined} showAnatomy={showAnatomy}>
                                    <HeroSkeleton className="size-4 rounded-full" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                                    <Typography size="sm" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                                </StackH>
                            </StackV>
                        </StackV>

                        {/* skills — 2-col grid of stat cards */}
                        <Grid columns={{ base: 1, md: 2 }} gap="section" items={skillItems} showAnatomy={showAnatomy} />
                    </StackV>
                </StackV>
            </Container>
        </div>
    )
}

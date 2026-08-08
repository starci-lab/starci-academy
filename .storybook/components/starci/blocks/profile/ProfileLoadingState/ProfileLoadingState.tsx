import { Skeleton as HeroSkeleton } from "@heroui/react"
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
 */

/** Props for {@link ProfileLoadingState}. Pure skeleton — no data props (see file header). */
export type ProfileLoadingStateProps = Record<string, never>

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
 */
export const ProfileLoadingState = () => {
    // Free-form rows built here (not by `SurfaceCardList`'s own `isSkeleton`, §12c):
    // the courses/readiness rows carry BESPOKE content (an IconTile, a progress
    // bar), not the composite's fixed leading/title/subtitle slots, so each row
    // passes `content` and stays untouched by the list's own shimmer branch.
    const readinessItems: Array<SurfaceCardListItem> = [
        {
            key: "readiness-track",
            content: () => (
                <StackV
                    gap={4}
                    items={[
                        () => <Typography size="sm" isSkeleton />,
                        () => <ProgressBar isSkeleton />,
                        () => <ProgressBar isSkeleton />,
                    ]}
                />
            ),
        },
    ]

    const courseItems: Array<SurfaceCardListItem> = [0, 1].map((i) => ({
        key: `course-${i}`,
        content: () => (
            <StackH
                gap={4}
                items={[
                    () => <IconTile isSkeleton size="sm" />,
                    () => (
                        <StackV
                            gap={3}
                            classNames={["min-w-0", "flex-1"]}
                            items={[
                                () => (
                                    <StackH
                                        gap={3}
                                        principle="value-row"
                                        explain="Holds a label and its numeric value on one baseline so the count stays readable against the label."
                                        justify="between"
                                        items={[
                                            () => <Typography size="sm" isSkeleton />,
                                            () => <Typography size="xs" isSkeleton />,
                                        ]}
                                    />
                                ),
                                () => <ProgressBar isSkeleton />,
                            ]}
                        />
                    ),
                ]}
            />
        ),
    }))

    const skillItems: Array<GridItem> = [0, 1].map((i) => ({
        key: `skill-${i}`,
        content: () => (
            <StackV
                gap={4}
                principle="card-caption"
                explain="Section title over its card — not title-subtitle, because the card is a separate surface rather than a continuing subtitle line."
                items={[
                    () => <Typography size="h4" isSkeleton />,
                    () => (
                        <SurfaceCard
                            padding={4}
                            body={() => (
                                <StackV
                                    gap={3}
                                    items={[
                                        () => <Typography size="h3" isSkeleton />,
                                        () => <Typography size="sm" isSkeleton />,
                                        () => <Typography size="xs" isSkeleton />,
                                    ]}
                                />
                            )}
                        />
                    ),
                ]}
            />
        ),
    }))

    const metaRows = META_ROWS.map((key) => (
        <StackH
            key={key}
            gap={2}
            items={[
                () => <HeroSkeleton className="size-5 rounded" />,
                () => <Typography size="sm" isSkeleton />,
            ]}
        />
    ))

    const overviewBody = (
        <div className="@app-md:flex-row @app-md:items-start">
            <StackV
                gap={6}
                items={[
                    () => (
                        <div className="@app-md:w-72 @app-md:shrink-0">
                            <StackV
                                gap={4}
                                classNames={["w-full"]}
                                items={[
                                    () => (
                                        <StackV
                                            gap={2}
                                            principle="title-subtitle"
                                            explain="Title over supporting line — not label-field, because neither line is a form control label."
                                            align="start"
                                            items={[
                                                () => <HeroSkeleton className="size-32 rounded-full" />,
                                                () => <Chip isSkeleton />,
                                            ]}
                                        />
                                    ),
                                    () => (
                                        <StackV
                                            gap={1}
                                            items={[
                                                () => <Typography size="h3" isSkeleton />,
                                                () => <Typography size="sm" isSkeleton />,
                                                () => <Typography size="sm" isSkeleton />,
                                            ]}
                                        />
                                    ),
                                    () => <Typography size="sm" isSkeleton />,
                                    () => (
                                        <StackH
                                            gap={3}
                                            principle="chip-row"
                                            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                            at="sm"
                                            items={[
                                                () => (
                                                    <StackH
                                                        gap={2}
                                                        items={[
                                                            () => <HeroSkeleton className="size-5 rounded" />,
                                                            () => <Typography size="sm" isSkeleton />,
                                                        ]}
                                                    />
                                                ),
                                                () => <Chip isSkeleton />,
                                            ]}
                                        />
                                    ),
                                    () => (
                                        <StackH
                                            gap={4}
                                            items={[
                                                () => <Typography size="sm" isSkeleton />,
                                                () => <Typography size="sm" isSkeleton />,
                                            ]}
                                        />
                                    ),
                                    () => <AvatarGroup items={MEDAL_ITEMS} size="sm" isSkeleton />,
                                    () => (
                                        <StackV
                                            gap={3}
                                            items={[
                                                () => <Button isSkeleton />,
                                                () => <Button isSkeleton />,
                                            ]}
                                        />
                                    ),
                                    () => <StackV gap={4} items={[() => metaRows]} />,
                                ]}
                            />
                        </div>
                    ),
                    () => (
                        <StackV
                            gap={6}
                            classNames={["min-w-0", "flex-1"]}
                            items={[
                                () => (
                                    <StackV
                                        gap={4}
                                        principle="card-caption"
                                        explain="Section title over its readiness cluster — not title-subtitle, because the cluster is a separate surface stack rather than a continuing subtitle line."
                                        items={[
                                            () => <Typography size="h4" isSkeleton />,
                                            () => (
                                                <StackV
                                                    gap={4}
                                                    principle="card-caption"
                                                    explain="Readiness summary card stacked above its track list — not sibling-stack, because the list captions the summary rather than repeating the same kind of peer."
                                                    items={[
                                                        () => (
                                                            <SurfaceCard
                                                                padding={4}
                                                                body={() => (
                                                                    <StackV
                                                                        gap={3}
                                                                        items={[
                                                                            () => <Typography size="h3" isSkeleton />,
                                                                            () => <Typography size="sm" isSkeleton />,
                                                                            () => <Typography size="xs" isSkeleton />,
                                                                        ]}
                                                                    />
                                                                )}
                                                            />
                                                        ),
                                                        () => <SurfaceCardList items={readinessItems} />,
                                                    ]}
                                                />
                                            ),
                                        ]}
                                    />
                                ),
                                () => (
                                    <StackV
                                        gap={4}
                                        items={[
                                            () => <Typography size="h4" isSkeleton />,
                                            () => <SurfaceCardList items={courseItems} />,
                                        ]}
                                    />
                                ),
                                () => (
                                    <StackV
                                        gap={4}
                                        items={[
                                            () => <Typography size="h4" isSkeleton />,
                                            () => (
                                                <StackV
                                                    gap={4}
                                                    items={[
                                                        () => <HeroSkeleton className="h-40 w-full rounded-xl" />,
                                                        () => (
                                                            <StackH
                                                                gap={3}
                                                                items={[
                                                                    () => <HeroSkeleton className="size-4 rounded-full" />,
                                                                    () => <Typography size="sm" isSkeleton />,
                                                                ]}
                                                            />
                                                        ),
                                                    ]}
                                                />
                                            ),
                                        ]}
                                    />
                                ),
                                () => (
                                    <Grid
                                        columns={{ base: 1, md: 2 }}
                                        principle="block-boundary"
                                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                        items={skillItems}
                                    />
                                ),
                            ]}
                        />
                    ),
                ]}
            />
        </div>
    )

    return (
        <div
            aria-busy="true"
            aria-label="Loading profile"
            className="flex w-full flex-col"
        >
            {/* tab strip — full-bleed row under the navbar, same footprint as `ProfileTabsBar`.
                `px-6 py-3` is a one-off placement wrapper (a full-width strip flush under a sticky
                navbar, not a repeating list nor a generic card seam), same allowance `ContinueCard`
                uses for its own content wrapper — both padding digits (6, 3) are on the §10c scale.
                Carried via `Container`'s own `padding` prop (house-scale {{ x: 6, y: 4 }} = `px-6 py-3`)
                instead of a raw div — no `patterns.mjs` token names this asymmetric shape yet. */}
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

            <Container size="lg" padding={6} body={() => overviewBody} />
        </div>
    )
}

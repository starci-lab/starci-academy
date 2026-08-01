import React from "react"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PlaygroundSetupHeader`: the IDENTITY cluster at the top of the
 * playground Setup screen. Answers "what exercise is this and how do I leave
 * it" — a way back to the playground hub, the exercise title, and its
 * one-line intro copy.
 *
 * SIBLING OF `ContentHeader` / `CourseBrief`, NOT A COPY. All three place
 * identity into the same `PageHeader` frame, but each carries a different
 * domain's facts. A playground exercise has neither a read state nor
 * outcomes nor a module/hour/learner count, so this block carries NO meta
 * cluster at all — `PageHeader`'s `meta` slot is simply never filled. A block
 * that invented chips or stats here would be inventing data the domain does
 * not have (§14d.3).
 *
 * ⭐ REUSE, NOT A NEW BACK ROW. `PageHeader.breadcrumb` already accepts "any
 * node — typically a `<Breadcrumbs>` component or a plain anchor chain" (see
 * `Page.tsx`'s own JSDoc). A Setup screen has no trail to show — only ONE hop
 * back to the hub — so the atom that belongs there is `LinkBack`, not a
 * one-crumb `Breadcrumbs` array pretending to be a trail. This is why the
 * block does NOT reach for an outer `StackV`: `PageHeader` already owns the
 * vertical seam between its breadcrumb row and its title row, and wrapping a
 * single `PageHeader` in another single-purpose frame would earn nothing
 * (`check-passthrough-block` §10) — the exact mistake this task's own file
 * header (`ContentModeNav`) was written to stop repeating.
 *
 * SKELETON: `LinkBack` has no `isSkeleton` of its own and does not need one —
 * `breadcrumbLabel`/`onBack` are supplied synchronously by the caller (the
 * hub name and the router handler never wait on the exercise fetch), so the
 * back link stays live through loading, exactly like `ContentModeNav` stays
 * live because its own data does not depend on the thing loading. Only
 * `title`/`description` — the two facts that DO come from the exercise fetch
 * — switch to their `Typography isSkeleton` mirror, matching the exact
 * size/weight `PageHeader` itself uses for those two slots (the same
 * workaround `ContentHeader`/`CourseBrief` use, since `PageHeader` has no
 * `isSkeleton` of its own to forward through).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link PlaygroundSetupHeader}. */
export interface PlaygroundSetupHeaderProps {
    /** Label on the back link, e.g. "Playground" — the hub this exercise was opened from. */
    breadcrumbLabel: string
    /** Fired when the back link is pressed — the caller owns the routing. */
    onBack: () => void
    /** Exercise title. */
    title: string
    /** One-line intro to the exercise. */
    description?: string
    /**
     * `true` → title/description switch to their shimmer mirror while the
     * exercise is loading. The flag flows down into the real text atoms
     * rather than a parallel skeleton tree (§12c); the back link stays live
     * (see file header).
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Identity cluster at the top of the playground Setup screen. See the file
 * header for the full contract.
 *
 * @param props - {@link PlaygroundSetupHeaderProps}
 */
const PlaygroundSetupHeader = ({
    breadcrumbLabel,
    onBack,
    title,
    description,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: PlaygroundSetupHeaderProps) => {
    return (
        <div data-anat-part={anatPart}>
            <PageHeader
                anatPart={showAnatomy ? "PageHeader" : undefined}
                isSkeleton={isSkeleton}
                breadcrumb={() => (
                    <div className="w-fit" data-anat-part={showAnatomy ? "LinkBack" : undefined}>
                        <LinkBack label={breadcrumbLabel} onPress={onBack} />
                    </div>
                )}
                title={title}
                description={description}
            />
        </div>
    )
}

export { PlaygroundSetupHeader }

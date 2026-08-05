import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import { Divider } from "@/components/atoms/display/Divider"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — MetaDotRow: a row of small text fragments
 * separated by a `·` mark ("12 lessons · 3 hours · Free", "12 minutes ago ·
 * Edited"). The fragments are one recurring meta-line SHAPE — the same info
 * seen today as a hand-rolled `flex flex-wrap items-center gap-2 text-xs
 * text-muted` with a bare `<span aria-hidden>·</span>` between children
 * (`PostRow`, `ProfileHero`'s sidebar meta) — so it becomes ONE composite
 * that owns the separator, the gap, and the tone, instead of every call site
 * re-typing the same three things.
 *
 * `items` is a plain `string[]`, not `ClusterItem[]`/`ReactNode[]` (COMPOSITE-8):
 * each fragment is TEXT the composite renders through `Typography` itself, so
 * it can shimmer the fragment — a pre-built node could not be told it is loading.
 *
 * GAP — the registry's own `separator-dot` token (`patterns.mjs`): "a · separating
 * meta fragments", step 2, 4px (`gap-1`). The real call sites above sit at `gap-2`
 * (8px) today; that is the debt this composite corrects, not a convention to copy.
 *
 * TONE — every fragment is `muted` (§law-2, explicit on the atom). The `·` mark
 * itself is `Divider`'s `shape="inline"` glyph, which paints `text-current` (no
 * colour prop of its own — ATOM-shape, not a status) — so the row's ROOT carries
 * a fixed `text-muted` class the mark inherits, keeping fragment and mark on the
 * same tone without a second colour decision.
 */

/** Props {@link MetaDotRow} carries regardless of loading state. */
interface MetaDotRowOwnProps {
    /** Fragment count to shimmer while `isSkeleton`. Defaults to `3`. */
    skeletonCount?: number
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Props for the {@link MetaDotRow} composite. `items` is REQUIRED unless
 * `isSkeleton` (§12b) — a shimmer row has no real fragments to show yet.
 */
export type MetaDotRowProps = MetaDotRowOwnProps &
    (
        | { isSkeleton: true; items?: Array<string> }
        | { isSkeleton?: false; items: Array<string> }
    )

/**
 * A `flex-wrap` row of muted text fragments with a `·` mark between every pair —
 * the composite owns the mark (`Divider` atom, `shape="inline"`), the seam
 * (`separator-dot`, 4px) and the tone (`muted`, on every fragment AND the root,
 * so the marks inherit it). Each fragment renders through `Typography` so it can
 * shimmer on its own; the row decides only HOW MANY shimmer while loading.
 *
 * @param props - {@link MetaDotRowProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "MetaDotRow" } as const

/** A wrapping row of muted text fragments joined by a `·` divider mark. */
export const MetaDotRow = ({
    items,
    isSkeleton = false,
    skeletonCount = 3,
    classNames,
}: MetaDotRowProps) => {
    const fragments = isSkeleton
        ? Array.from({ length: skeletonCount }, (_unused, index) => ({ key: String(index), text: undefined }))
        : (items ?? []).map((text, index) => ({ key: String(index), text }))

    // COMPOSITE-10: ONE render path — same wrapper, same gap, in both states. Every
    // fragment goes through `Typography`'s own `isSkeleton` (§12c: the atom draws
    // its own bar, sized to its own value) — there is no second, hand-built
    // skeleton row to keep in sync with this one. The `·` mark needs no skeleton
    // of its own (a static glyph, nothing to load — see `Divider`'s own header).
    return (
        <div
            className={cn("flex flex-wrap items-center gap-1 text-muted", classNames)}
            data-tier="composite"
            data-component="MetaDotRow"
            data-principle="separator-dot"
        >
            {fragments.map((fragment, index) => (
                <React.Fragment key={fragment.key}>
                    {index > 0 ? <Divider shape="inline" /> : null}
                    <Typography
                        size="xs"
                        color={isSkeleton ? undefined : "muted"}
                        classNames={isSkeleton ? ["w-1/4"] : undefined}
                        isSkeleton={isSkeleton}
                        text={fragment.text}
                    />
                </React.Fragment>
            ))}
        </div>
    )
}

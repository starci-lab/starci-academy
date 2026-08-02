import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * COMPOSITE — `MetaDotRow`: a row of muted text fragments separated by a `·`
 * mark ("12 lessons · 3 hours · Free"). Replaces the hand-rolled `flex
 * flex-wrap items-center gap-* text-muted` + a bare `<span aria-hidden>·</span>`
 * seen at `PostRow` and `ProfileHero`'s sidebar meta — the composite owns the
 * mark (`Divider` atom, `shape="inline"`), the seam (`separator-dot`, 4px),
 * and the tone (`muted`, on every fragment AND the root, so the marks inherit
 * it).
 *
 * 📐 **1 PROP = 1 LEAF.** `items`, `isSkeleton`, `skeletonCount` each get their
 * own leaf. `classNames` gets none — a pure placement prop with no visible
 * shape of its own to demonstrate.
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
            data-principles="separator-dot"
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

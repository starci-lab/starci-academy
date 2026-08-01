import { SealCheckIcon, PushPinIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE — `AuthorByline`: name + optional verified/pinned glyphs + a
 * relative timestamp, as ONE inline row — the "status+text" line that sits
 * under an avatar (see `IdentityContentRow`'s own `byline` slot, which this is
 * a real implementation of).
 *
 * Scanned from `blocks/feed/CommunityPostCard`, which hand-rolled this exact
 * shape twice (name+`SealCheckIcon` on one line, `@handle · timeAgo · channel`
 * on the next) at `gap-1`/`gap-2` with a raw `text-accent-soft-foreground`
 * class on each glyph. Flattened here into the ONE row the spec calls for —
 * `verified`/`pinned` are generic booleans (COMPOSITE-2: no domain entity),
 * so the composite owns which fixed glyph each maps to, the same shape
 * `VerdictIcon` already uses for pass/fail in `GradingByline`.
 *
 * TONE — name is `default` (the primary label); the verified/pinned glyphs
 * are `accent` (`text-accent`, the same value `Typography`'s own
 * `color="accent"` resolves to, not the block's non-canon `-soft` variant);
 * the separator dot + timestamp are `muted`.
 *
 * ATOM GAP — no icon-shaped shimmer atom exists yet (the same gap
 * `InlineIconLabel` documents), so the glyphs render only when NOT skeleton.
 * The `·` separator is fixed chrome, not a value being loaded, so — per
 * COMPOSITE-10's "the frame stays real throughout: … separators, gaps" — it
 * renders in BOTH states unconditionally; only `name` and `timestamp` shimmer,
 * each via `Typography isSkeleton`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link AuthorByline}. */
export interface AuthorBylineProps {
    /** Author display name — the row's primary label. */
    name: string
    /** `true` → a filled seal-check glyph renders right after the name. */
    verified?: boolean
    /** `true` → a filled push-pin glyph renders right after the name (and after `verified`, if both are set). */
    pinned?: boolean
    /** Relative time text (e.g. "3 hours ago") — the caller resolves the string; this row only renders it. */
    timestamp: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /** When on, each composed part emits `data-anat-part` for a `BlockAnatomy` panel. */
    /** Anatomy tag: names this composite so a `BlockAnatomy` panel can badge it on-render. */
    /**
     * Render the leaf skeleton (shimmer) instead of the row. `name`/`timestamp`
     * delegate to `Typography isSkeleton`; the verified/pinned glyphs and the
     * `·` separator are NOT part of the shimmer — see the file header's ATOM
     * GAP note (COMPOSITE-10: this composite decides WHICH parts shimmer and
     * HOW MANY, never draws one itself).
     */
    isSkeleton?: boolean
}

/**
 * Name + optional verified/pinned glyphs + relative timestamp, as one inline
 * row. See the file header for the full contract.
 *
 * @param props - {@link AuthorBylineProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "AuthorByline" } as const

const AuthorByline = ({
    name,
    verified = false,
    pinned = false,
    timestamp,
    classNames,
    isSkeleton = false,
}: AuthorBylineProps) => (
    <StackH
        gap={2}
        pattern="icon-text separator-dot"
        classNames={["min-w-0", ...(classNames ?? [])]}

        body={
            <>
                <Typography
                    size="sm"
                    weight="medium"
                    color="default"
                    truncate
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-1/3"] : undefined}

                    text={name}
                />
                {!isSkeleton && verified ? (
                    <SealCheckIcon aria-hidden focusable="false" weight="fill" className="size-4 shrink-0 text-accent" />
                ) : null}
                {!isSkeleton && pinned ? (
                    <PushPinIcon aria-hidden focusable="false" weight="fill" className="size-4 shrink-0 text-accent" />
                ) : null}
                <Typography size="xs" color="muted" text="·" />
                <Typography
                    size="xs"
                    color="muted"
                    truncate
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-1/4"] : undefined}

                    text={timestamp}
                />
            </>
        }
    />
)

export { AuthorByline }

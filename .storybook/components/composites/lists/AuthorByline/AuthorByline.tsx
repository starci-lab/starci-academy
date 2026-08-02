import { SealCheckIcon, PushPinIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `AuthorByline` — name + optional verified/pinned glyphs + a relative timestamp,
 * as ONE inline row: the "status+text" line that sits under an avatar (a real
 * implementation of `IdentityContentRow`'s `byline` slot).
 *
 * `verified`/`pinned` are generic booleans (no domain entity), so the composite
 * owns which fixed glyph each maps to. Tone: name is `default`, the
 * verified/pinned glyphs are `accent`, the separator dot + timestamp are `muted`.
 *
 * No icon-shaped shimmer atom exists yet, so the glyphs render only when not
 * skeleton; the `·` separator is fixed chrome and renders in both states. Only
 * `name` and `timestamp` shimmer, each via `Typography isSkeleton`.
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

        items={[
            () => (
                <Typography
                    size="sm"
                    weight="medium"
                    color="default"
                    truncate
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-1/3"] : undefined}

                    text={name}
                />
            ),
            ...(!isSkeleton && verified ? [() => (
                <SealCheckIcon aria-hidden focusable="false" weight="fill" className="size-4 shrink-0 text-accent" />
            )] : []),
            ...(!isSkeleton && pinned ? [() => (
                <PushPinIcon aria-hidden focusable="false" weight="fill" className="size-4 shrink-0 text-accent" />
            )] : []),
            () => <Typography size="xs" color="muted" text="·" />,
            () => (
                <Typography
                    size="xs"
                    color="muted"
                    truncate
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-1/4"] : undefined}

                    text={timestamp}
                />
            ),
        ]}
    />
)

export { AuthorByline }

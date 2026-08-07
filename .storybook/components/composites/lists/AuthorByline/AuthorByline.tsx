import { SealCheckIcon, PushPinIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `AuthorByline` — name + optional verified/pinned glyphs + a relative timestamp, as one
 * inline row; a concrete implementation of `IdentityContentRow`'s `byline` slot. Leaves:
 * `verified`, `pinned` (each its own on/off shape). The verified/pinned glyphs render only
 * outside `isSkeleton` (no icon-shaped shimmer atom yet); the `·` separator is fixed chrome.
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
    
    isSkeleton = false,
}: AuthorBylineProps) => (
    <StackH
        gap={2}
        principle="separator-dot"
        explain="Places a middle-dot separator between short meta peers so the items read as one inline list."
        classNames={["min-w-0"]}
        isSkeleton={isSkeleton}
        items={[
            () => (
                <StackH
                    gap={2}
                    principle="icon-text"
                    explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                    isSkeleton={isSkeleton}
                    items={[
                        () => (
                            <Typography
                                size="sm"
                                weight="medium"
                                color="default"
                                truncate
                                isSkeleton={isSkeleton}
                                text={name}
                            />
                        ),
                        ...(!isSkeleton && verified ? [() => (
                            <SealCheckIcon aria-hidden focusable="false" weight="fill" className="size-4 shrink-0 text-accent" />
                        )] : []),
                        ...(!isSkeleton && pinned ? [() => (
                            <PushPinIcon aria-hidden focusable="false" weight="fill" className="size-4 shrink-0 text-accent" />
                        )] : []),
                    ]}
                />
            ),
            () => <Typography size="xs" color="muted" text="·" />,
            () => (
                <Typography
                    size="xs"
                    color="muted"
                    truncate
                    isSkeleton={isSkeleton}
                    text={timestamp}
                />
            ),
        ]}
    />
)

export { AuthorByline }

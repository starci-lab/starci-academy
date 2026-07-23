import React from "react"
import { cn, Typography } from "@heroui/react"
import { StatusChip } from "../../chips/StatusChip/StatusChip"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/marketing/SectionHeading`. Authored in Storybook (not
 * `src`); synced to `src` later. A marketing section heading — accent eyebrow
 * chip, bold title (+ optional "#" deep-link), muted intro.
 */

/** Local mirror of `@/modules/types/base/class-name` (storybook-local, no `@/` imports). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/** Props for the {@link SectionHeading} block. */
export interface SectionHeadingProps extends WithClassNames<undefined> {
    /** Small accent chip above the title (e.g. "Học thật"); omit to hide. */
    eyebrow?: React.ReactNode
    /** Section title. */
    title: React.ReactNode
    /** Optional supporting line under the title. */
    intro?: React.ReactNode
    /** Heading level — defaults to 3 (matches the app's PageHeader); pass 2 for a hero-scale moment. */
    level?: 2 | 3
    /** Text alignment; defaults to centered (marketing sections). */
    align?: "start" | "center"
    /** When set, renders a "#" deep-link next to the title (→ `#${anchorId}`) so each
     * section is referenceable. The section wrapper must carry that `id` + a `scroll-mt-*`. */
    anchorId?: string
    /** Storybook anatomy: when on, each part emits `data-anat-part` for the badge panel. */
    showAnatomy?: boolean
}

/**
 * Marketing section heading: an optional accent eyebrow chip, a bold title, and
 * an optional muted intro line. Tier-3 presentational block — owns its own type
 * scale and spacing so feature code stays style-free. Text arrives via props
 * (no i18n inside the block).
 *
 * @param props - {@link SectionHeadingProps}
 */
export const SectionHeading = ({
    eyebrow,
    title,
    intro,
    level = 3,
    align = "center",
    anchorId,
    showAnatomy,
    className,
}: SectionHeadingProps) => {
    const centered = align === "center"
    return (
        <div
            className={cn(
                "flex flex-col gap-3",
                centered ? "items-center" : "items-start",
                className,
            )}
        >
            {eyebrow ? (
                <StatusChip tone="accent" anatPart={showAnatomy ? "StatusChip" : undefined}>{eyebrow}</StatusChip>
            ) : null}
            <div
                className={cn("flex items-center gap-2", centered && "justify-center")}
                data-anat-part={showAnatomy ? "div · title row" : undefined}
            >
                <Typography.Heading
                    level={level}
                    weight="bold"
                    align={centered ? "center" : "start"}
                    data-anat-part={showAnatomy ? "Typography.Heading" : undefined}
                >
                    {title}
                </Typography.Heading>
                {anchorId ? (
                    // "#" deep-link to this section (ref-able). Quiet by default, accent on hover.
                    <a
                        href={`#${anchorId}`}
                        aria-label={`#${anchorId}`}
                        className="text-xl leading-none text-muted opacity-50 transition hover:text-accent-soft-foreground hover:opacity-100"
                        data-anat-part={showAnatomy ? "Anchor '#'" : undefined}
                    >
                        #
                    </a>
                ) : null}
            </div>
            {intro ? (
                <Typography
                    type="body-sm"
                    color="muted"
                    align={centered ? "center" : "start"}
                    className="max-w-2xl"
                    data-anat-part={showAnatomy ? "Typography" : undefined}
                >
                    {intro}
                </Typography>
            ) : null}
        </div>
    )
}

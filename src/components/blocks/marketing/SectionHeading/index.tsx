import React from "react"
import { Chip, cn, Typography } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link SectionHeading} block. */
export interface SectionHeadingProps extends WithClassNames<undefined> {
    /** Small accent chip above the title (e.g. "Học thật"); omit to hide. */
    eyebrow?: React.ReactNode
    /** Section title. */
    title: React.ReactNode
    /** Optional supporting line under the title. */
    intro?: React.ReactNode
    /** Text alignment; defaults to centered (marketing sections). */
    align?: "start" | "center"
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
    align = "center",
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
                <Chip variant="soft" color="accent" size="sm">
                    <Chip.Label>{eyebrow}</Chip.Label>
                </Chip>
            ) : null}
            <Typography.Heading
                level={2}
                weight="bold"
                align={centered ? "center" : "start"}
            >
                {title}
            </Typography.Heading>
            {intro ? (
                <Typography
                    type="body"
                    color="muted"
                    align={centered ? "center" : "start"}
                    className="max-w-2xl"
                >
                    {intro}
                </Typography>
            ) : null}
        </div>
    )
}

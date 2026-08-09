import React from "react"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for the {@link SectionHeading} block. */
export interface SectionHeadingProps {
    /** Small accent chip above the title (e.g. "Real learning"); omit to hide. */
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
}

/**
 * Marketing section heading: an optional accent eyebrow chip, a bold title, and
 * an optional muted intro line. Tier-3 presentational block — owns its own type
 * scale and spacing so feature code stays style-free. Text arrives via props
 * (no i18n inside the block).
 *
 * @param props - {@link SectionHeadingProps}
 * @see Story: .storybook/stories/blocks/marketing/SectionHeading/SectionHeading.stories
 */
export const SectionHeading = ({
    eyebrow,
    title,
    intro,
    level = 3,
    align = "center",
    anchorId}: SectionHeadingProps) => {
    const centered = align === "center"
    const headingSize = level === 2 ? "h2" : "h3"

    return (
        <StackV
            identity={{ tier: "block", component: "SectionHeading" }}
            align={centered ? "center" : "start"}
            principle="label-field"
            explain="Eyebrow-to-title-to-intro is a label-to-field stack — not title-subtitle, because three layers exceed a two-line title pair."
            items={[
                ...(eyebrow
                    ? [() => (
                        <Chip tone="accent" text={eyebrow} />
                    )]
                    : []),
                () => (
                    <StackH
                        align="center"
                        justify={centered ? "center" : "start"}
                        principle="icon-text"
                        explain="Title hugs its optional deep-link hash — not name-handle, because the hash is a glyph adjunct rather than a secondary identity line."
                        items={[
                            () => (
                                <Typography
                                    size={headingSize}
                                    weight="bold"
                                    align={centered ? "center" : "start"}
                                    text={title}
                                />
                            ),
                            ...(anchorId
                                ? [() => (
                                    <Typography
                                        size="lg"
                                        color="muted"
                                        isLink
                                        href={`#${anchorId}`}
                                        text="#"
                                    />
                                )]
                                : []),
                        ]}
                    />
                ),
                ...(intro
                    ? [() => (
                        <Typography
                            size="sm"
                            color="muted"
                            align={centered ? "center" : "start"}
                            text={intro}
                        />
                    )]
                    : []),
            ]}
        />
    )
}

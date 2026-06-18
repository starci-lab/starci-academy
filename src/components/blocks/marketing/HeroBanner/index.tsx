import React from "react"
import { Chip, cn, Typography } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link HeroBanner} block. */
export interface HeroBannerProps extends WithClassNames<undefined> {
    /** Eyebrow label (the audience/subject gate). */
    eyebrow: React.ReactNode
    /** Optional leading icon for the eyebrow chip. */
    eyebrowIcon?: React.ReactNode
    /** Headline — pass a rich node so the caller controls emphasis/strikethrough. */
    headline: React.ReactNode
    /** Supporting positioning line. */
    subline: React.ReactNode
    /** Primary CTA (a configured Button). */
    primary: React.ReactNode
    /** Optional secondary CTA. */
    secondary?: React.ReactNode
    /** Optional technical keyword strip rendered under the CTAs. */
    keywords?: ReadonlyArray<string>
}

/**
 * Opening hero for the public landing page: a centered, single-column positioning
 * statement with one primary + one secondary CTA and an optional keyword strip.
 * Honest by design — no fabricated metrics or fake diagram. Tier-3 block: owns
 * all styling, content via props (no i18n, no data).
 *
 * @param props - {@link HeroBannerProps}
 */
export const HeroBanner = ({
    eyebrow,
    eyebrowIcon,
    headline,
    subline,
    primary,
    secondary,
    keywords,
    className,
}: HeroBannerProps) => {
    return (
        <section className={cn("flex flex-col items-center gap-6 text-center", className)}>
            <Chip variant="soft" color="accent" size="sm">
                {eyebrowIcon}
                <Chip.Label>{eyebrow}</Chip.Label>
            </Chip>

            <Typography.Heading level={1} weight="bold" align="center" className="max-w-4xl">
                {headline}
            </Typography.Heading>

            <Typography type="body" color="muted" align="center" className="max-w-2xl">
                {subline}
            </Typography>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
                {primary}
                {secondary}
            </div>

            {keywords && keywords.length > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {keywords.map((keyword, index) => (
                        <React.Fragment key={keyword}>
                            {index > 0 ? (
                                <span aria-hidden className="select-none text-separator">·</span>
                            ) : null}
                            <Typography type="code" color="muted">
                                {keyword}
                            </Typography>
                        </React.Fragment>
                    ))}
                </div>
            ) : null}
        </section>
    )
}

import React from "react"
import { Chip as HeroChip, cn } from "@heroui/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import type { IconComponent } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/marketing/HeroBanner`. Authored in Storybook (not `src`);
 * synced to `src` later. The opening hero for the public landing page —
 * eyebrow chip, headline, subline, CTA slots, optional brand keyword strip,
 * optional split visual.
 */

/** Local mirror of `@/modules/types/base/class-name` (storybook-local, no `@/` imports). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/** Props for the {@link HeroBanner} block. */
export interface HeroBannerProps extends WithClassNames<undefined> {
    /** Eyebrow label (the audience/subject gate). */
    eyebrow: React.ReactNode
    /**
     * Optional leading icon for the eyebrow chip — COMPONENT, not element: the atom
     * `Chip` owns the glyph scale/weight (§4/§5.0a), so the caller only picks the shape.
     */
    eyebrowIcon?: IconComponent
    /** Headline — pass a rich node so the caller controls emphasis/strikethrough. */
    headline: React.ReactNode
    /** Supporting positioning line. */
    subline: React.ReactNode
    /** Primary CTA (a configured Button). */
    primary: React.ReactNode
    /** Optional secondary CTA. */
    secondary?: React.ReactNode
    /**
     * Optional brand-coloured keyword strip under the CTAs (e.g. supported languages),
     * rendered as `Chip`s. Each item carries a `className` (e.g. `bg-[hex]/10 text-[hex]`)
     * for its brand tint so the chip reads alive, not muted.
     */
    keywords?: ReadonlyArray<{ label: string; className: string }>
    /** Optional muted label before the keyword strip (e.g. "Solve in"). */
    keywordsLabel?: React.ReactNode
    /**
     * Optional visual anchor (e.g. a transparent hero image). When present the hero
     * switches to a SPLIT layout — text left, visual right (stacks on mobile: text
     * then visual). When absent the hero stays centered single-column (honest — no
     * fabricated visual).
     */
    visual?: React.ReactNode
    /** Dev/spec: tag each rendered part with `data-anat-part` so a BlockAnatomy panel can badge it on-render. */
    showAnatomy?: boolean
}

/**
 * Opening hero for the public landing page. Two layouts driven by `visual`:
 * - **split** (visual present): text column (left-aligned) + visual column — the
 *   visual anchors the positioning. Stacks on mobile.
 * - **centered** (no visual): the original single-column statement.
 * One primary + one secondary CTA + optional keyword strip. Tier-3 block: owns all
 * styling, content via props (no i18n, no data).
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
    keywordsLabel,
    visual,
    className,
    showAnatomy,
}: HeroBannerProps) => {
    const hasVisual = Boolean(visual)
    const align = hasVisual ? "start" : "center"

    const textColumn = (
        <div
            className={cn(
                "flex flex-col gap-6",
                hasVisual ? "flex-1 items-start text-left" : "items-center text-center",
            )}
        >
            <Chip tone="accent" icon={eyebrowIcon} anatPart={showAnatomy ? "StatusChip" : undefined} text={eyebrow} />

            <Typography
                size="h1"
                weight="bold"
                align={align}
                className="max-w-4xl"
                anatPart={showAnatomy ? "Typography.Heading" : undefined}
                text={headline}
            />

            <Typography
                color="muted"
                align={align}
                className="max-w-2xl whitespace-pre-line"
                anatPart={showAnatomy ? "Typography" : undefined}
                text={subline}
            />

            <div
                className={cn(
                    "flex flex-col items-stretch gap-3 @app-sm:flex-row @app-sm:items-center",
                    hasVisual ? "@app-sm:justify-start" : "@app-sm:justify-center",
                )}
            >
                {primary}
                {secondary}
            </div>

            {keywords && keywords.length > 0 ? (
                <div
                    className={cn(
                        "flex flex-wrap items-center gap-2",
                        hasVisual ? "justify-start" : "justify-center",
                    )}
                >
                    {keywordsLabel ? (
                        <Typography size="xs" text={keywordsLabel} color="muted" showAnatomy={showAnatomy} />
                    ) : null}
                    {keywords.map((lang) => (
                        // brand-coloured chip — the language's official colour as a bg/10 + text tint
                        <HeroChip
                            key={lang.label}
                            size="sm"
                            className={lang.className}
                            data-anat-part={showAnatomy ? "Chip" : undefined}
                        >
                            <HeroChip.Label>{lang.label}</HeroChip.Label>
                        </HeroChip>
                    ))}
                </div>
            ) : null}
        </div>
    )

    if (!hasVisual) {
        return (
            <section className={cn("flex flex-col items-center gap-6 text-center", className)}>
                {textColumn}
            </section>
        )
    }

    return (
        <section className={cn("flex flex-col items-center gap-8 @app-lg:flex-row @app-lg:gap-8", className)}>
            {textColumn}
            <div className="flex w-full max-w-md shrink-0 items-center justify-center @app-lg:max-w-none @app-lg:flex-1">
                {visual}
            </div>
        </section>
    )
}

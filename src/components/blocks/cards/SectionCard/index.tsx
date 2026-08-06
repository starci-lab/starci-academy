"use client"

import React, { type ComponentType } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import { type AllowedGap, type LayoutAlign } from "@/components/frames/_spacing"
import { type CallerIdentity } from "@/components/frames/_identity"
import { type VerdictBand, verdictBandClassName } from "../verdict-band"

/** Props for {@link SectionCard}. */
export interface SectionCardProps {
    /** Card body. */
    children: React.ReactNode
    /** Optional section title rendered in the header row. The atom wraps it in `Typography` itself. */
    title?: string
    /** Optional leading icon shown before the title — a buildable slot, not a built element. */
    icon?: ComponentType
    /** Optional action slot pinned to the right of the header (button/link) — a buildable slot. */
    action?: ComponentType
    /** Accent variant: tinted border + background (highlight / "yours"). */
    accent?: boolean
    /**
     * Verdict variant: a thick LEFT band (`border-l-4`) on top of the card's own
     * border — the asymmetric-border shape for "a card carrying a signal FROM DATA"
     * (`card.md` §3i). See {@link VerdictBand}. Left band ONLY reads as a DATA
     * signal — never ad-hoc "active region" decoration (`card.md` §3g).
     */
    withVerdict?: VerdictBand
    /**
     * Where the card sits inside its parent. Appearance is not passable — it is
     * already a prop.
     *
     * missingVocabulary (no-classname-at-sentence-tier, BLOCK-4): `QuizCard`, `MetricCard`, and
     * `PitchCard` all genuinely forward a value through here today. Dropping this prop would
     * require editing those call sites too, and they sit outside this folder — left in place and
     * flagged as known debt rather than silently removed.
     */
    classNames?: Array<AllowedClassName>
    /**
     * Seam between the header row (when present) and `children`, and between items inside
     * `children` that opt into the same track — the content wrapper's own gap step on the
     * house scale (`AllowedGap`, `_spacing.ts`). Defaults to `4` (`gap-3`), the shape every
     * caller got before this prop existed. `PricingCard` needs a roomier `6` (`gap-6`) between
     * its name/price/features/cta rows.
     */
    contentGap?: AllowedGap
    /**
     * `true` → the content wrapper stretches to fill the card's height (`h-full`) instead of
     * hugging its own content. For cards placed side-by-side in a grid (`PricingCard`,
     * `PitchCard`, the `ContinueLearning` skeleton shell) so the CTA/footer row still pins to
     * the bottom even when a sibling card's copy runs longer. Defaults to `false`.
     */
    fillHeight?: boolean
    /**
     * Cross-axis alignment of the content wrapper's track. Defaults to `"stretch"` (every child
     * takes the full width), matching the shape every caller got before this prop existed. The
     * `ContinueLearning` empty state needs `"start"` so its CTA button hugs its own width
     * instead of stretching full-bleed.
     */
    contentAlign?: LayoutAlign
    /**
     * Caller identity to wear on this card's root element instead of its own — pass this when a
     * `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape of its own) is
     * using this card AS its root element, instead of wrapping it in a raw `<div data-tier=…
     * data-component=…>`. See `_identity.ts`. Omitted → this card keeps emitting its own
     * `data-tier="block" data-component="SectionCard"`, unchanged.
     */
    identity?: CallerIdentity
}

/**
 * The canonical bordered "framed" card used across profile + dashboard. A thin
 * skin (`rounded-3xl bg-surface shadow-surface`, the same face `.card` in
 * `globals.css` gives HeroUI's own `Card`) that adds an optional header row
 * (icon + title on the left, action on the right) so every titled section looks
 * identical. Use `accent` for the viewer's own / highlighted cards. The header
 * row and content wrapper compose the frame tier's `StackH`/`StackV`/`Box`.
 *
 * @param props - {@link SectionCardProps}
 * @see Story: .storybook/stories/blocks/cards/SectionCard/SectionCard.stories
 */
export const SectionCard = ({
    children,
    title,
    icon: Icon,
    action: Action,
    accent = false,
    withVerdict,
    classNames,
    contentGap = 4,
    fillHeight = false,
    contentAlign = "stretch",
    identity,
}: SectionCardProps) => {
    const hasHeader = Boolean(title || Action || Icon)
    // BLOCK-5 DEBT, left VISIBLE on purpose: this block decides its own card face —
    // radius · surface · shadow · padding · accent border · verdict band — which is a
    // lower tier's job; read it as "a composite is missing". An earlier pass hid this by
    // hand-joining the array so the `cn` rule would not fire, which changed nothing about
    // the design. The real fix is to compose `composites/cards/SurfaceCard`'s face, a
    // migration of its own.
    const rootClassName = cn(
        "rounded-3xl bg-surface shadow-surface p-4",
        accent ? "border-accent" : null,
        verdictBandClassName(withVerdict),
        ...(classNames ?? []),
    )
    return (
        <Box
            identity={identity ?? { tier: "block", component: "SectionCard" }}
            className={rootClassName}
        >
            <StackV
                gap={contentGap}
                principle={contentGap === 6 ? "block-boundary" : contentGap === 5 ? "group-boundary" : "card-caption"}
                explain={
                    contentGap === 6
                        ? "Separates the section header from the card body as major regions so a roomier PricingCard rhythm does not collapse into one band."
                        : contentGap === 5
                            ? "Spaces the header band and body as distinct section groups so they stay as separate bands rather than a flat peer list."
                            : "Stacks the optional header above the body so the title row stays on its own track above the card content."
                }
                align={contentAlign}
                classNames={fillHeight ? ["h-full"] : undefined}
                body={() => (
                    <>
                        {hasHeader ? (
                            <Box className="border-b border-separator pb-3">
                                <StackH
                                    gap={3}
                                    principle="flex-action"
                                    explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                    justify="between"
                                    items={[
                                        () => (
                                            <StackH
                                                gap={2}
                                                principle="icon-text"
                                                explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                                classNames={["min-w-0"]}
                                                items={[
                                                    ...(Icon ? [() => <Icon />] : []),
                                                    ...(title ? [() => (
                                                        <Typography size="base" weight="semibold" truncate text={title} />
                                                    )] : []),
                                                ]}
                                            />
                                        ),
                                        ...(Action ? [() => <span className="shrink-0"><Action /></span>] : []),
                                    ]}
                                />
                            </Box>
                        ) : null}
                        {children}
                    </>
                )}
            />
        </Box>
    )
}

import React from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Link as AtomLink } from "@sb-components/atoms/navigation/Link/Link"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { List } from "@sb-components/composites/lists/List/List"
import { Stack } from "@sb-components/frames/Stack/Stack"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Button as AtomButton } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DESIGN — `ContinueCard.*`: "come back to where you left off".
 *
 * ⭐ MEMBER SPLIT 2026-07-26 (teacher finalized) — before this it was ONE component
 * with `variant: "item" | "hero" | "plain"`, i.e. a SHAPE AXIS for the caller to
 * pick. §14d.1 forbids that at the design tier: design OWNS both shape and text,
 * the caller only supplies DATA.
 *
 * But merging into one shape was also wrong: checking `src`, `hero` (2 spots) and
 * `item` (4 spots) are both running for real, and they **differ in WHY**, not in
 * appearance — §14d says *different WHY means SPLIT*:
 *
 * | Member | WHY | Shape (component decides itself, no open prop) |
 * |---|---|---|
 * | `.Hero` | ONE single highlight on a surface | card face + light streak + CTA is a BUTTON |
 * | `.Item` | ONE of N cards in a list | flat card face + CTA is a LINK |
 *
 * Two heroes side by side cancel each other's emphasis — that's why `.Item` has
 * no light streak, not because it's a "stripped-down version".
 *
 * ⚠️ REMOVED: `variant="plain"` (frameless). The §14d.3 test — *which screen in
 * the app needs it?* — `src` uses it in **0 places**, it only lives in its own story.
 *
 * ⚠️ REMOVED per §14d.1: `ctaLabel`/`eyebrow` (caller-set labels — the same anchor
 * as `CourseTeamGate.actionLabel`) · `icon` (swapping icons + injecting JSX). The
 * CTA label and watermark glyph now belong to the component itself.
 *
 * ⚠️ Content props TIGHTEN THEIR TYPE (§14d.1 consequence 2): `title`/`subtitle`/`meta`/`timeLeft`
 * go from `ReactNode` → `string`. `ReactNode` was a door for the caller to slip a shape in.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** CTA label — a design CONSTANT, not opened to the caller (§14d.1). */
const CTA_LABEL = "Tiếp tục"

/** Data shared by both members — ALL DATA props, no presentation props. */
interface ContinueCardDataProps {
    /** Name of the thing in progress (course / chapter / lesson / interview session). */
    title: string
    /** Secondary line under the title — shows when there is NO `meta`/`timeLeft`. */
    subtitle?: string
    /** Current progress. `ProgressMeter` only appears when this prop is present. */
    value?: number
    /** The 100% mark. Default `100`. */
    max?: number
    /** Neutral meta fragments, joined by a dot (e.g. `["Question 7 / 8", "Middle"]`). */
    meta?: Array<string>
    /** Time left — ALWAYS renders as a chip, so the same kind of information always takes the same shape. */
    timeLeft?: string
    /** `true` → the `timeLeft` chip switches to `warning` tone. Only the TONE changes, not the element type. */
    urgent?: boolean
    /** Press handler. */
    onPress?: () => void
    /**
     * Navigation target — ONLY `.Item` can use it (its CTA is `Link.SeeMore`, a real link).
     *
     * ⚠️ `.Hero` does NOT accept it: its CTA is `Button.Base`, and the Button atom
     * **has no `href`** (it's a button, not a link). The old version dodged this by
     * hand-rolling a `<Link>` styled to look like a button — exactly the drift being
     * cleaned up here, so it's dropped. `.Hero` navigates via `onPress` (the caller
     * does its own router-push); opening `href` for the button is work for the ATOM
     * tier, not a patch here.
     */
    href?: string
    /**
     * PLACEMENT class (`mb-4`, `flex-1`) — NOT for restyling (§14d.1).
     */
    className?: string
    /**
     * `true` → mirror shimmer INSTEAD of waiting for data. Applies to BOTH members
     * (`.Hero`/`.Item`) since both share `ContinueCardDataProps`.
     *
     * The flag FLOWS DOWN to the atom wherever an atom already has `isSkeleton`
     * (`Typography.Base` for the title, `Button.Base` for `.Hero`'s CTA, `SurfaceCard.Base` for the card face).
     *
     * ⚠️ THREE spots in this tree have NO atom to take the flag, and the
     * scaffold/atom holding them sit OUTSIDE the 4 files touched this round (do not touch):
     *   • the meta/subtitle row goes through scaffold `List.Meta` — no `isSkeleton` yet;
     *   • `ProgressMeter` (scaffold) — no `isSkeleton` yet;
     *   • `.Item`'s CTA goes through atom `Link.SeeMore` — no `isSkeleton` yet.
     * Those three spots are TEXT/SHAPE rendered directly by CardBody/`.Item` (calling
     * the scaffold/atom straight, no layer in between), so they build their own
     * shimmer bar RIGHT HERE per the §12c rule, instead of branching off to build a
     * parallel skeleton tree for the whole `ContinueCard`.
     */
    isSkeleton?: boolean
    /** `true` → every part emits `data-anat-part` for the BlockAnatomy panel. */
    showAnatomy?: boolean
    /** The part name of THIS card itself (§11a). */
    anatPart?: string
}

/** Props for {@link ContinueCardHero}. */
export type ContinueCardHeroProps = ContinueCardDataProps

/** Props for {@link ContinueCardItem}. */
export type ContinueCardItemProps = ContinueCardDataProps

/** Shared internals: eyebrow-less, title → meta/subtitle → progress → CTA. */
const CardBody = ({
    title,
    subtitle,
    value,
    max = 100,
    meta,
    timeLeft,
    urgent = false,
    isSkeleton = false,
    showAnatomy,
    cta,
}: ContinueCardDataProps & { cta: React.ReactNode }) => (
    <>
        {/* ⭐ 2026-07-27 (teacher: "layout is built from layouts components"): this used to
            be `<div className="relative flex items-center gap-3">` ⊃ `<div className="flex
            min-w-0 flex-1 flex-col gap-2">` hand-rolled.
            The outer row = ONE horizontal track ⇒ `Stack.H` (children are ARBITRARY, not a
            repeating list so NOT `Cluster` — §13b). The inner column = a vertical track ⇒ `Stack.V`.
            `min-w-0 flex-1` stays in `className`: that's its PLACEMENT within the parent row
            (§14d.1 allows `className` for placement), not the scaffold's own shape. */}
        <Stack.H gap={3} align="center" className="relative" anatPart={showAnatomy ? "Stack.H" : undefined}>
            <Stack.V gap={2} className="min-w-0 flex-1" anatPart={showAnatomy ? "Stack.V" : undefined}>
                <Typography.Base weight="medium" truncate anatPart={showAnatomy ? "Title" : undefined} isSkeleton={isSkeleton} text={title} />
                {isSkeleton ? (
                    // `List.Meta` (the scaffold the live branch uses here) has no `isSkeleton`
                    // yet and sits outside this round's boundary — CardBody calls that scaffold
                    // DIRECTLY so it builds ONE shimmer bar in place of the meta/subtitle row
                    // (the real shape always has EXACTLY ONE of the two) using atom `Typography.Base`.
                    <Typography.Base size="xs" color="muted" isSkeleton className="w-1/2" anatPart={showAnatomy ? "Skeleton.Meta" : undefined} />
                ) : meta?.length || timeLeft ? (
                    <List.Meta
                        items={meta ?? []}
                        anatPart={showAnatomy ? "List.Meta" : undefined}
                        chip={
                            timeLeft ? (
                                // Same kind of information (time left) ⇒ the same element in
                                // EVERY case; only the TONE escalates: `neutral` while time
                                // remains, `warning` when it's about to run out.
                                <Chip.Base
                                    tone={urgent ? "warning" : "neutral"}
                                    anatPart={showAnatomy ? "Chip.Base" : undefined}
                                    text={timeLeft}
                                />
                            ) : undefined
                        }
                    />
                ) : subtitle ? (
                    <Typography.Base size="xs" color="muted" truncate anatPart={showAnatomy ? "Subtitle" : undefined} text={subtitle} />
                ) : null}
            </Stack.V>
        </Stack.H>

        {/* Progress SITS right under the text cluster, BEFORE the button (teacher
        eyeballed 2026-07-25): where am I → how much progress → what's next. Put it
        after the CTA and it reads as detached from the card, misread as belonging to the block below. */}
        {value === undefined ? null : isSkeleton ? (
            // `ProgressMeter` (scaffold) has no `isSkeleton` yet and sits outside this
            // round's boundary — CardBody calls that scaffold directly so it builds a
            // track shimmer bar matching the real track height (`h-1`, see `ProgressMeter.tsx`).
            <HeroSkeleton className="h-1 w-full rounded-full" data-anat-part={showAnatomy ? "ProgressMeter" : undefined} />
        ) : (
            <ProgressMeter value={value} max={max} anatPart={showAnatomy ? "ProgressMeter" : undefined} />
        )}

        <div className="relative">{cta}</div>
    </>
)

/**
 * `.Hero` — ONE "continue the session in progress" highlight on a surface.
 *
 * Light streak + watermark glyph + CTA as a BUTTON. Use for exactly one card on
 * a surface; two side by side and both lose their emphasis.
 */
const ContinueCardHero = (props: ContinueCardHeroProps) => {
    const { onPress, className, isSkeleton = false, showAnatomy = false, anatPart } = props
    return (
        <SurfaceCard.Base
            isHighlight
            isSkeleton={isSkeleton}
            anatPart={anatPart ?? (showAnatomy ? "SurfaceCard" : undefined)}
            contentClassName={cn("relative flex flex-col gap-3 overflow-hidden", className)}
        >
            <CardBody
                {...props}
                cta={
                    // Atom `Button.Base` already has `isSkeleton` (§12c) — the flag flows
                    // straight down, no need to build a separate bar here. The label is a
                    // design CONSTANT (§14d.1). The atom accepts `label` + `suffixIcon` as a
                    // COMPONENT REF (§12b) and forces its own glyph scale + weight (§4/§5.0a).
                    <AtomButton.Base
                        isSkeleton={isSkeleton}
                        variant="primary"
                        size="sm"
                        label={CTA_LABEL}
                        suffixIcon={ArrowRightIcon}
                        iconSlide
                        onPress={onPress}
                        anatPart={showAnatomy ? "Button" : undefined}
                        className="w-fit shrink-0"
                    />
                }
            />
        </SurfaceCard.Base>
    )
}

/**
 * `.Item` — ONE of N "continue" cards in a list/grid.
 *
 * Flat face, no light streak, no watermark; CTA is `Link.SeeMore` (hover + click
 * live on the link itself, not wrapping the whole card — wrapping would nest a
 * control and hijack hover).
 */
const ContinueCardItem = (props: ContinueCardItemProps) => {
    const { href, onPress, className, isSkeleton = false, showAnatomy = false, anatPart } = props
    return (
        <SurfaceCard.Base
            isSkeleton={isSkeleton}
            anatPart={anatPart ?? (showAnatomy ? "SurfaceCard" : undefined)}
            contentClassName={cn("relative flex flex-col gap-3 overflow-hidden", className)}
        >
            <CardBody
                {...props}
                cta={
                    isSkeleton ? (
                        // Atom `Link.SeeMore` has no `isSkeleton` yet and sits outside this
                        // round's boundary — `.Item` calls that atom DIRECTLY so it builds a
                        // text shimmer bar matching the "Tiếp tục" label's size (`text-sm`, see
                        // `LinkSeeMore.tsx`) instead of branching off to build a whole fake link.
                        <span data-anat-part={showAnatomy ? "SeeMoreLink" : undefined}>
                            <HeroSkeleton className="h-[14px] w-20 rounded" />
                        </span>
                    ) : (
                        <AtomLink.SeeMore
                            href={href}
                            onPress={onPress}
                            anatPart={showAnatomy ? "SeeMoreLink" : undefined}
                            label={CTA_LABEL}
                        />
                    )
                }
            />
        </SurfaceCard.Base>
    )
}

/**
 * `ContinueCard.*` — namespace (§12a). Root callable = `.Hero` (the one-highlight
 * case, also the most-used case in the blueprint).
 */
export const ContinueCard = Object.assign(ContinueCardHero, {
    Hero: ContinueCardHero,
    Item: ContinueCardItem,
})

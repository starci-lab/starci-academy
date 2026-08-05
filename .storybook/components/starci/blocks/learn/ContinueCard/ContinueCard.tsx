import React from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { LinkSeeMore } from "@sb-components/atoms/navigation/Link/Link"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { ListMeta } from "@sb-components/composites/lists/List/List"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
/**
 * `ContinueCard.*` — a "come back to where you left off" card, in two members that
 * differ in role: `.Hero` is a single highlighted card face with a light streak and
 * a CTA button; `.Item` is one flat card among many in a list with a CTA link.
 * The component owns its own CTA label and watermark glyph; callers supply only data
 * (`title`/`subtitle`/`meta`/`timeLeft` as strings).
 */
/** CTA label — a design CONSTANT, not opened to the caller (§14d.1). */
const CTA_LABEL = "Continue"
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
     * Navigation target — ONLY `.Item` can use it (its CTA is `LinkSeeMore`, a real link).
     *
     * ⚠️ `.Hero` does NOT accept it: its CTA is `Button`, and the Button atom
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
     * (`Typography` for the title, `Button` for `.Hero`'s CTA, `SurfaceCard` for the card face).
     *
     * ⚠️ THREE spots in this tree have NO atom to take the flag, and the
     * scaffold/atom holding them sit OUTSIDE the 4 files touched this round (do not touch):
     *   • the meta/subtitle row goes through scaffold `ListMeta` — no `isSkeleton` yet;
     *   • `ProgressMeter` (scaffold) — no `isSkeleton` yet;
     *   • `.Item`'s CTA goes through atom `LinkSeeMore` — no `isSkeleton` yet.
     * Those three spots are TEXT/SHAPE rendered directly by CardBody/`.Item` (calling
     * the scaffold/atom straight, no layer in between), so they build their own
     * shimmer bar RIGHT HERE per the §12c rule, instead of branching off to build a
     * parallel skeleton tree for the whole `ContinueCard`.
     */
    isSkeleton?: boolean
    /** The part name of THIS card itself (§11a). */
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
    cta,
}: ContinueCardDataProps & { cta: React.ReactNode }) => {
    const titleAndMeta = (
        <>
            <Typography weight="medium" truncate isSkeleton={isSkeleton} text={title} />
            {isSkeleton ? (
                // `ListMeta` (the scaffold the live branch uses here) has no `isSkeleton`
                // yet and sits outside this round's boundary — CardBody calls that scaffold
                // DIRECTLY so it builds ONE shimmer bar in place of the meta/subtitle row
                // (the real shape always has EXACTLY ONE of the two) using atom `Typography`.
                <Typography size="xs" color="muted" isSkeleton classNames={["w-1/2"]} />
            ) : meta?.length || timeLeft ? (
                <ListMeta
                    items={meta ?? []}

                    chip={
                        timeLeft ? (
                            // Same kind of information (time left) ⇒ the same element in
                            // EVERY case; only the TONE escalates: `default` while time
                            // remains, `warning` when it's about to run out.
                            () => (
                                <Chip
                                    tone={urgent ? "warning" : "default"}

                                    text={timeLeft}
                                />
                            )
                        ) : undefined
                    }
                />
            ) : subtitle ? (
                <Typography size="xs" color="muted" truncate text={subtitle} />
            ) : null}
        </>
    )

    return (
        <>
            {/* The outer row = ONE horizontal track ⇒ `StackH` (children are ARBITRARY, not a
                repeating list so NOT `Cluster`). The inner column = a vertical track ⇒ `StackV`.
                `min-w-0 flex-1` stays in `className`: that's its PLACEMENT within the parent row
                (`className` is allowed for placement), not the scaffold's own shape. */}
            <div className="relative">
                <StackH
                    gap={4}
                    principles={["content-row"]}
                    align="center"
                    isSkeleton={isSkeleton}
                    items={[
                        ({ isSkeleton }: SkeletonProps) => <StackV gap={3} classNames={["min-w-0", "flex-1"]} isSkeleton={isSkeleton} items={[() => titleAndMeta]} />,
                    ]}
                />
            </div>
            {/* Progress SITS right under the text cluster, BEFORE the button:
            where am I → how much progress → what's next. Put it
            after the CTA and it reads as detached from the card, misread as belonging to the block below. */}
            {value === undefined ? null : isSkeleton ? (
                // `ProgressMeter` (scaffold) has no `isSkeleton` yet and sits outside this
                // round's boundary — CardBody calls that scaffold directly so it builds a
                // track shimmer bar matching the real track height (`h-1`, see `ProgressMeter.tsx`).
                <HeroSkeleton className="h-1 w-full rounded-full" />
            ) : (
                <ProgressMeter value={value} max={max} />
            )}
            <div className="relative">{cta}</div>
        </>
    )
}
/**
 * `.Hero` — ONE "continue the session in progress" highlight on a surface.
 *
 * Light streak + watermark glyph + CTA as a BUTTON. Use for exactly one card on
 * a surface; two side by side and both lose their emphasis.
 */
const ContinueCardHero = (props: ContinueCardHeroProps) => {
    const { onPress, className, isSkeleton = false } = props
    return (
        <SurfaceCard
            isHighlight
            isSkeleton={isSkeleton}

            contentClassName={cn("relative flex flex-col gap-3 overflow-hidden", className)}
            body={() => (
                <CardBody
                    {...props}
                    cta={
                        // Atom `Button` already has `isSkeleton` (§12c) — the flag flows
                        // straight down, no need to build a separate bar here. The label is a
                        // design CONSTANT (§14d.1). The atom accepts `label` + `suffixIcon` as a
                        // COMPONENT REF (§12b) and forces its own glyph scale + weight (§4/§5.0a).
                        <Button
                            isSkeleton={isSkeleton}
                            variant="primary"
                            size="sm"
                            label={CTA_LABEL}
                            suffixIcon={ArrowRightIcon}
                            iconSlide
                            onPress={onPress}

                            classNames={["w-fit", "shrink-0"]}
                        />
                    }
                />
            )}
        />
    )
}
/**
 * `.Item` — ONE of N "continue" cards in a list/grid.
 *
 * Flat face, no light streak, no watermark; CTA is `LinkSeeMore` (hover + click
 * live on the link itself, not wrapping the whole card — wrapping would nest a
 * control and hijack hover).
 */
const ContinueCardItem = (props: ContinueCardItemProps) => {
    const { href, onPress, className, isSkeleton = false } = props
    return (
        <SurfaceCard
            isSkeleton={isSkeleton}

            contentClassName={cn("relative flex flex-col gap-3 overflow-hidden", className)}
            body={() => (
                <CardBody
                    {...props}
                    cta={
                        isSkeleton ? (
                            // Atom `LinkSeeMore` has no `isSkeleton` yet and sits outside this
                            // round's boundary — `.Item` calls that atom DIRECTLY so it builds a
                            // text shimmer bar matching the "Continue" label's size (`text-sm`, see
                            // `LinkSeeMore.tsx`) instead of branching off to build a whole fake link.
                            // The tag sits on the REAL heroui `Skeleton` element itself (not the
                            // wrapping span) — same convention as the progress-bar mirror above.
                            <span>
                                <HeroSkeleton className="h-[14px] w-20 rounded" />
                            </span>
                        ) : (
                            <LinkSeeMore
                                href={href}
                                onPress={onPress}

                                label={CTA_LABEL}
                            />
                        )
                    }
                />
            )}
        />
    )
}
/**
 * `ContinueCard.*` — namespace (§12a). Root callable = `.Hero` (the one-highlight
 * case, also the most-used case in the blueprint).
 */
export { ContinueCardHero, ContinueCardItem }
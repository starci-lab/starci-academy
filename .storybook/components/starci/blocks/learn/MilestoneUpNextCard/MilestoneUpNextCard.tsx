import React from "react"
import { CheckCircleIcon, ArrowRightIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `MilestoneUpNextCard`: the passed-attempt handoff to the NEXT
 * unlocked milestone task, on a capstone track.
 *
 * WHY THIS EXISTS, DISTINCT FROM THE CHALLENGE FLOW: a challenge attempt ends
 * on its own `SubmissionScoreCard`/`SubmissionResultHeader` pair with no fixed
 * successor — the learner picks their own next move. A MILESTONE sits on a
 * linear capstone track (task 1 → 2 → 3 → …), so a passed attempt has exactly
 * ONE real "what's next", and this card IS that handoff — the single focal
 * action on the milestone result screen, `isHighlight` on. `ContinueCardHero`
 * documents the same reasoning for why two highlighted cards would cancel
 * each other's emphasis.
 *
 * ⭐ `isHighlight` IS NOW CALLER-CONTROLLED (thầy 2026-07-28, default `true` —
 * every existing call site is unchanged). Reused a second time for
 * `ContentPage`'s mobile/tablet practice nudge, which is an inline aside in a
 * scrolling reading page, not the one focal moment of its own screen — `src`'s
 * real `UpNextCard` there is a plain, unaccented card. Hardcoding the
 * highlight would have painted every future reuse with milestone's own
 * one-focal-action semantics; this is domain-generic shape, not a milestone
 * fact, so the caller decides.
 *
 * `showCheck` marks that the attempt just handed off FROM was a PASS: a small
 * `CheckCircleIcon` sits beside the eyebrow through `Typography`'s own
 * `prefixIcon` slot. This is a STATE of the one leaf, not a second leaf
 * (§14d.2) — the shape (eyebrow → title → description → CTA) never changes,
 * only whether that one glyph is present.
 *
 * `eyebrow`/`title`/`description`/`ctaLabel` all come in as plain strings
 * (§14d.1): the CALLER supplies the milestone's own wording (which task, what
 * it asks for, what the button says). This block owns only the layout, the
 * check-glyph placement, the highlight treatment, and the CTA's arrow
 * affordance — never the domain text itself.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link MilestoneUpNextCard}. */
export interface MilestoneUpNextCardProps {
    /** Small label above the title, e.g. "Nhiệm vụ tiếp theo". */
    eyebrow: string
    /** `true` → a check glyph sits beside the eyebrow, marking the attempt just passed. */
    showCheck?: boolean
    /** Name of the next unlocked milestone task. */
    title: string
    /** One line describing what the next task asks for. */
    description: string
    /** CTA label, e.g. "Bắt đầu nhiệm vụ 3". */
    ctaLabel: string
    /** Press the CTA. */
    onPress?: () => void
    /** `true` → the card face carries the highlight streak (the ONE focal action on its screen). @default true */
    isHighlight?: boolean
    /** `true` → every composed atom mirrors as shimmer. */
    isSkeleton?: boolean
    /** `true` → tag each composed part with `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag for THIS block itself (§11a.1) — lets the caller badge it as ONE node. */
    anatPart?: string
    /** Placement class only (§14d.1), forwarded to the card face. */
    className?: string
}

/**
 * The single "what's next" highlight card shown right after a passed
 * milestone attempt, handing off to the next unlocked task on the track.
 *
 * @param props - {@link MilestoneUpNextCardProps}
 */
const MilestoneUpNextCard = ({
    eyebrow,
    showCheck = false,
    title,
    description,
    ctaLabel,
    onPress,
    isHighlight = true,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
    className,
}: MilestoneUpNextCardProps) => (
    <SurfaceCard
        isHighlight={isHighlight}
        isSkeleton={isSkeleton}
        anatPart={anatPart ?? (showAnatomy ? "SurfaceCard" : undefined)}
        contentClassName={className}
    >
        <StackV
            gap="grouped"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    {/* thầy 2026-07-29: back INSIDE the card face (not `SurfaceCard.label`,
                        which sits OUTSIDE/above it) — a plain atom call, not raw CSS, so no
                        shape-tier violation either way; this is a visual placement call. */}
                    <Typography
                        size="xs"
                        color="muted"
                        prefixIcon={showCheck ? CheckCircleIcon : undefined}
                        isSkeleton={isSkeleton}
                        text={eyebrow}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    {/* thầy 2026-07-29: real `UpNextCard` leaves `type` unset on its title
                        Typography, which defaults to HeroUI's `type="body"` = `text-base`
                        (verify `typography.css` `.typography--body`) — `size="lg"` here was
                        oversized. `weight="semibold"` (src) folds to `"medium"` at body
                        scale per §9b, not `"bold"`. */}
                    <Typography
                        size="base"
                        weight="medium"
                        isSkeleton={isSkeleton}
                        text={title}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={description}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    <Button
                        isSkeleton={isSkeleton}
                        variant="primary"
                        size="sm"
                        label={ctaLabel}
                        suffixIcon={ArrowRightIcon}
                        iconSlide
                        onPress={onPress}
                        classNames={["w-fit", "shrink-0"]}
                        anatPart={showAnatomy ? "Button" : undefined}
                    />
                </>
            }
        />
    </SurfaceCard>
)

export { MilestoneUpNextCard }

import { HouseIcon, UserCircleMinusIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ProfileNotFoundState`: the 404-style whole-route message shown when a
 * requested public profile cannot be read (not found, soft-deleted, or a failed
 * fetch) — the profile-domain sibling of `src`'s `PublicProfile/ProfileNotFoundState`.
 *
 * ⚠️ JUDGEMENT CALL — DELIBERATELY DOES NOT MATCH `src` PIXEL-FOR-PIXEL. The real
 * app builds this from a bespoke `ErrorPageState` (a big "404" numeral above the
 * title) that has no equivalent anywhere in this design system, and this run is
 * the ONLY consumer that would want one. Inventing a numeral-hero shape for a
 * single caller is the opposite of what a composite tier is for — so this block
 * composes `EmptyState` (composites/feedback/Feedback) in its plain
 * icon+title+description+action shape instead of adding a `code` slot. If a
 * second numeral-style 404/500 consumer shows up later, THAT is the trigger to
 * revisit `EmptyState size="page"` + `code` (already supported, see its
 * stories' `FullPage` leaf) — not to build a parallel shell now for one caller.
 *
 * WHY A BLOCK: picking "this is a not-found kind of empty, not a broken-fetch
 * kind" (tone stays neutral, not danger) and which icon reads as "no such
 * profile" is a domain call about the profile feature — `EmptyState` itself
 * has no opinion on either.
 *
 * COMPOSE: `EmptyState` for the centered icon/title/description/action stack
 * (reused as-is, not rebuilt); `Button` for the single way out, built by this
 * block so the caller never has to hold the atom.
 *
 * PROPS — `title`/`description` are TYPED, pre-translated strings (§14d.1): the
 * block owns the WORDING SLOT, but the exact copy is still resolved by the
 * caller/i18n at the screen layer, same split as `CourseQaInvite`. The one
 * piece of copy this block DOES own outright is the CTA label ("Back to home")
 * — unlike `CourseQaInvite`, the caller here only supplies a callback
 * (`onGoHome`), never a label, because "go back to the home route" is the one
 * and only exit a 404 state ever offers, not a per-caller decision.
 *
 * ⚠️ NO `isSkeleton`. This state is the TERMINAL result of a resolved lookup —
 * by the time a caller can even pass `title`/`description`/`onGoHome`, the
 * profile fetch has already finished (and failed). There is no "still loading"
 * variant of "this profile does not exist" for a shimmer to represent, so this
 * block deliberately has no skeleton prop rather than one that would sit
 * unused (unlike `CourseQaInvite`, whose CTA destination can still resolve
 * async while its copy is already known).
 *
 * ⚠️ NO `SurfaceCard` wrapper. Unlike `CourseQaInvite` (a state living inside a
 * course's Q&A tab, sitting on a card among other tab content), this block
 * fills the WHOLE route — same footing as `EmptyState`'s own `FullPage`
 * story, which also renders card-free.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ProfileNotFoundState}. */
export interface ProfileNotFoundStateProps {
    /** Headline saying the profile could not be found, localized by the caller — e.g. "Profile not found". */
    title: string
    /** Supporting sentence explaining why (removed, private, or never existed), localized by the caller. */
    description: string
    /** Fired when the reader takes the one way out: back to the home route. */
    onGoHome: () => void
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Whole-route 404-style message for an unresolvable public profile. See the
 * file header for the full contract and the numeral-shell judgement call.
 *
 * @param props - {@link ProfileNotFoundStateProps}
 */
const ProfileNotFoundState = ({
    title,
    description,
    onGoHome,
    showAnatomy = false,
    anatPart,
}: ProfileNotFoundStateProps) => (
    <div data-anat-part={anatPart}>
        <EmptyState
            icon={UserCircleMinusIcon}
            title={title}
            description={description}
            action={(
                <Button
                    label="Back to home"
                    variant="primary"
                    prefixIcon={HouseIcon}
                    onPress={onGoHome}
                />
            )}
            anatPart={showAnatomy ? "EmptyState" : undefined}
        />
    </div>
)

export { ProfileNotFoundState }

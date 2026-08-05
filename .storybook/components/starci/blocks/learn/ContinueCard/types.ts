/** CTA label — a design CONSTANT, not opened to the caller (§14d.1). */
export const CTA_LABEL = "Continue"

/** Data shared by both members — ALL DATA props, no presentation props. */
export interface ContinueCardDataProps {
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
     * NOTE: `.Hero` does NOT accept it: its CTA is `Button`, and the Button atom
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
     * NOTE: THREE spots in this tree have NO atom to take the flag, and the
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

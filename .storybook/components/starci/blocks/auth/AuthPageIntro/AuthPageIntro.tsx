import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `AuthPageIntro`: the page chrome standing above the login card. It
 * carries the brand line back to the marketing home, and the one sentence that
 * only exists when the edge guard bounced the visitor here.
 *
 * WHY IT EXISTS AT ALL. A screen may compose blocks and frames, never an atom
 * (rules/1 §2), so `LoginPage` cannot draw a `Typography` wordmark by itself.
 * Someone has to own that wordmark and both versions of the reason line, and
 * "someone" at this altitude is a block.
 *
 * WHY IT EARNS THE LAYER rather than being a passthrough. Two things live here
 * that no frame and no atom can hold: the branch (`isResumingProtectedRoute`
 * decides whether a second line exists at all), and the WORDING itself. The
 * caller hands over a typed fact and the block turns it into the sentence the
 * visitor reads, which is exactly the translation §14d.1 puts at this tier.
 *
 * WHY A BOOLEAN AND NOT THE REDIRECT PATH. `LoginPage` knows `redirectTarget`,
 * a URL. Passing it down would put a raw path into product copy and hand the
 * caller a say in how the sentence reads. The block only needs to know THAT the
 * visitor was bounced, so the prop is the fact, not the payload.
 *
 * SEAM `grouped`. Read the six seam questions from the top: the two lines are
 * not one continuous thing, the sentence is not a mark attached to the brand,
 * and they are not peers in a set. They are two rows inside one region, which
 * is `grouped`. `flush` was the tempting answer, since a wordmark plus tagline
 * is one semantic unit — but this second line is conditional and talks about
 * the visitor's navigation rather than about the brand, so fusing them would
 * read as a tagline the product does not have.
 *
 * NO PADDING HERE. The distance down to the login card belongs to the screen
 * that places both, and a seam has exactly one owner (§10a).
 *
 * CENTRED ON PURPOSE. Auth chrome sits over a centred card, and a block owns
 * its own shape — there is deliberately no `align` prop for the caller to pick
 * a different one (rules/3 §5).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * The wordmark this block owns. It is a constant rather than a prop because a
 * caller able to pass `brand="…"` would own the brand line, and the block would
 * stop owning the one thing it exists for.
 */
const BRAND_WORD = "StarCi Academy"

/**
 * The bounced-visitor sentence, likewise owned here. It explains the arrival
 * without naming the page they were reaching for: the visitor already knows
 * where they were going, and a printed path reads as an error message.
 */
const RESUME_LINE = "Bạn cần đăng nhập để tiếp tục tới trang vừa mở."

/** Props for {@link AuthPageIntro}. */
export interface AuthPageIntroProps {
    /** Press on the brand line — returns the visitor to the marketing home. */
    onBrandPress: () => void
    /**
     * `true` → the edge guard sent this visitor here from a protected route, so
     * the block draws the reason line under the brand. A visitor who typed
     * `/login` themselves gets the brand alone; they need no explaining.
     */
    isResumingProtectedRoute?: boolean
    /**
     * `true` → the brand line becomes a wordmark-width bar while the session
     * check is still in flight. The flag reaches the real atom rather than a
     * parallel skeleton tree (§12c).
     *
     * The reason line does NOT shimmer with it: it is derived from the URL the
     * visitor arrived on, which is known before any request goes out, so a bar
     * there would fake a wait that is not happening.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Brand line plus the guard's reason line, above the login card. See the file
 * header for the full contract.
 *
 * @param props - {@link AuthPageIntroProps}
 */
const AuthPageIntro = ({
    onBrandPress,
    isResumingProtectedRoute = false,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: AuthPageIntroProps) => (
    // The block names ITSELF on a wrapper, and the frame keeps its own name: a
    // frame wearing the name of the thing inside it removes the frame from the
    // tree and mislabels what is left (rules/1 §4).
    <div data-anat-part={anatPart}>
        <StackV gap="grouped" align="center" anatPart={showAnatomy ? "StackV" : undefined}>
            {isSkeleton ? (
                // Width is set here because the atom's default bar is narrower than the
                // wordmark it stands in for, and a shimmer that changes width on landing
                // is the jump skeletons exist to prevent.
                <Typography
                    size="lg"
                    isSkeleton
                    className="w-44"
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            ) : (
                <Typography
                    size="lg"
                    isLink
                    onPress={onBrandPress}
                    text={BRAND_WORD}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            )}
            {isResumingProtectedRoute ? (
                <Typography
                    size="xs"
                    color="muted"
                    align="center"
                    text={RESUME_LINE}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            ) : null}
        </StackV>
    </div>
)

export { AuthPageIntro }

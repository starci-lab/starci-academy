import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react"
import { Button, type IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `SocialSignInOptions`: the column of identity-provider shortcuts on
 * the sign-in screen. Function 2 of that screen: "get in without typing a
 * password".
 *
 * WHY IT EXISTS AT ALL, given that it composes one frame and N buttons. It owns
 * the whole translation from a typed domain value to the sentence on the button:
 * an identity provider (mirroring `KeycloakIdentityProvider` on the server) maps
 * here to a glyph, a Vietnamese label, and a position in the column. That
 * mapping is the block's entire reason to exist, and §14d.1 says it may not live
 * anywhere else — a caller that could pass `label="Đăng nhập với Google"` would
 * own the wording, and the day the copy changes it changes in as many places as
 * there are screens. `check-passthrough-block` asks exactly this question, and
 * the answer here is "it turns typed domain values into words", not "it renames
 * props on the way through".
 *
 * ⭐ THE CALLER HANDS OVER AN ENUM ARRAY AND NOTHING ELSE. No labels, no icons,
 * no order. `providers` is a SET, not a sequence: the block walks its own
 * {@link PROVIDER_ORDER} and keeps whichever members the caller asked for, so
 * `["github", "google"]` and `["google", "github"]` render identically. Reading
 * order on a sign-in column is a product decision (Google first because it is
 * the account most learners already have), and a decision that a caller can
 * reorder is not a decision.
 *
 * WEIGHT — `secondary`, deliberately, and this is the one judgement call worth
 * arguing about. These buttons are ALTERNATIVE ROUTES past the credential form
 * standing beside them, not the screen's commitment. The primary weight belongs
 * to the form's submit button; spending it a second time here would give the
 * screen two things shouting at equal volume and the learner no default. Size is
 * left at the atom's `md` for the matching reason: same height as the submit
 * button, so the column reads as an equal-status alternative even while carrying
 * a quieter fill.
 *
 * FULL WIDTH IS PLACEMENT, NOT RESTYLE. `w-full` is the only `className` here
 * and §14d.1 allows exactly that use. It also has to be passed in the skeleton
 * state: the atom's resting mirror is a `w-24` pill (its own default footprint,
 * §13z), so without it the shimmer is a quarter of the width of the button it
 * stands in for and the column jumps when the provider list lands.
 *
 * SEAM — `related`. The buttons are PEERS in one set, each whole on its own,
 * with none owning the other. `grouped` would claim they are rows inside one
 * surface, which is what a list of settings is, not what two doors into the same
 * app are.
 *
 * ⛔ NO EMPTY LEAF. `providers = []` is not a state this block draws, because a
 * screen with no configured provider does not render the column at all — it
 * renders the credential form alone. Building an empty state here would be
 * inventing a case no screen asks for.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * An identity provider the app can hand a sign-in off to. Mirrors the server's
 * `KeycloakIdentityProvider` alias by value, so the two stay comparable without
 * this file importing anything from the backend.
 */
export type SignInProvider = "google" | "github"

/**
 * DISPLAY ORDER, owned here. The caller's array is read as a SET; this list
 * decides what comes first. Google leads because it is the account most learners
 * already hold, so it is the shortest path for the largest group.
 */
const PROVIDER_ORDER: Array<SignInProvider> = ["google", "github"]

/**
 * The sentence on each button. The block owns it (§14d.1) — this table is the
 * single place the wording exists, so a copy change is one edit.
 */
const PROVIDER_LABEL: Record<SignInProvider, string> = {
    google: "Đăng nhập với Google",
    github: "Đăng nhập với GitHub",
}

/**
 * The glyph per provider. Mapping a domain value onto a picture is the block's
 * job, never the caller's, which is why there is no `icon` prop to pass.
 */
const PROVIDER_ICON: Record<SignInProvider, IconComponent> = {
    google: GoogleLogoIcon,
    github: GithubLogoIcon,
}

/** Props for {@link SocialSignInOptions}. */
export interface SocialSignInOptionsProps {
    /**
     * Which providers this deployment has configured, as a SET of typed domain
     * values. Required, and it is what generates the structure, so it needs no
     * leaf of its own — every entry becomes one button, and the block supplies
     * that button's glyph, its wording and its place in the column.
     */
    providers: Array<SignInProvider>
    /**
     * Fired with the provider the visitor picked. The block hands back the enum
     * it was given rather than an index, so the call site never has to know the
     * order this block chose.
     */
    onProviderPress: (provider: SignInProvider) => void
    /**
     * `true` → every button switches to its own shimmer. The flag FLOWS DOWN
     * into the real `Button` atoms rather than building a parallel skeleton tree
     * (§12c), so the resting shape keeps the box it will hand back.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The identity-provider column of the sign-in screen. See the file header for
 * the full contract.
 *
 * @param props - {@link SocialSignInOptionsProps}
 */
const SocialSignInOptions = ({
    providers,
    onProviderPress,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: SocialSignInOptionsProps) => {
    // Walk the BLOCK's order and keep what the caller asked for, rather than
    // walking the caller's array. This is what makes `providers` a set: it also
    // drops a duplicate entry instead of drawing the same button twice.
    const shown = PROVIDER_ORDER.filter((provider) => providers.includes(provider))

    return (
        <div data-anat-part={anatPart}>
            <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                {shown.map((provider) => (
                    <Button
                        key={provider}
                        variant="secondary"
                        label={PROVIDER_LABEL[provider]}
                        prefixIcon={PROVIDER_ICON[provider]}
                        isSkeleton={isSkeleton}
                        onPress={() => onProviderPress(provider)}
                        className="w-full"
                        anatPart={showAnatomy ? "Button" : undefined}
                    />
                ))}
            </StackV>
        </div>
    )
}

export { SocialSignInOptions }

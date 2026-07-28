import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react"
import { Button, type IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `SignInProviders`: the ordered column of identity-provider buttons,
 * the "sign in without a password" half of the login card (F2).
 *
 * WHAT IT OWNS: THE CATALOG. One table maps a provider key to its glyph and to
 * the Vietnamese sentence on the button. The caller hands over keys and nothing
 * else, so no screen can ship `Đăng nhập với Google` next to another screen's
 * `Tiếp tục với Google`, and no screen can pair the GitHub label with the
 * Google mark. Turning typed domain values into the words a visitor reads is
 * exactly the translation §14d.1 puts at this tier, and it is the whole reason
 * this layer is earned rather than a passthrough over a stack of buttons.
 *
 * WHY KEYS AND NOT ROWS. A prop shaped `Array<{ label, icon }>` would read as
 * more flexible and would in fact move ownership of both the wording and the
 * mark back out to the caller (rules/3 §5 forbids `label?` and `icon?` at this
 * tier for that reason). The union is the narrower prop, and narrower is the
 * point: it is the only shape where a bad pairing cannot be expressed.
 *
 * WHY AN ORDERED ARRAY AND NOT A SET OF BOOLEANS. Which providers a
 * deployment offers, and in which order, is a product decision that belongs
 * above this block. The array carries both facts in one prop, and the block
 * walks it as given rather than imposing a house order on top.
 *
 * NO SURFACE OF ITS OWN. The block draws no card, no border, no padding. It
 * renders inside the credentials panel's card, and a second surface there would
 * be surface-in-surface. The distance down to the divider and the email field
 * belongs to whoever places both, because a seam has exactly one owner (§10a).
 *
 * SEAM `related`. Read the six seam questions from the top: the buttons are not
 * one continuous thing, neither is a mark attached to the other, and they are
 * not rows inside a surface this block owns. They are peers in one set, each
 * whole on its own, which is `related`. Swapping Google and GitHub leaves the
 * column just as readable, and that swap test is what separates `related` from
 * `grouped`.
 *
 * JUDGEMENT — WHY `secondary` AND NOT `primary`. Every button here is the same
 * weight, and that weight is the quiet one. The credentials panel below already
 * holds the one primary action, so a primary provider button would compete with
 * it, and two primaries side by side tell the visitor nothing about which road
 * the product expects. Making one provider primary and the other secondary
 * would be worse still: it would rank identity providers, which the product has
 * no basis to do.
 *
 * JUDGEMENT — NO `isSkeleton`. Every other block in this folder takes the flag,
 * and this one deliberately does not. A skeleton mirrors a wait; the provider
 * catalog is a constant compiled into the bundle, so there is no request whose
 * arrival the shimmer would be standing in for. A bar here would fake a wait
 * that never happens.
 *
 * FULL-WIDTH BUTTONS. `w-full` is placement, not restyling, which is the one
 * use of `className` this tier allows (rules/3 §5). The buttons are the only
 * targets in a narrow column, so a row of shrink-to-fit pills would leave a
 * ragged right edge against the full-width email field underneath.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * The identity providers this product supports. It is a union rather than a
 * `string` so that a typo is a compile error at the call site, and so that
 * adding a provider forces the catalog below to be completed in the same edit
 * (`Record` over the union will not type-check while a key is missing).
 */
export type SignInProviderKey = "google" | "github"

/** One row of the provider catalog: the mark to draw and the sentence to print. */
export interface SignInProviderEntry {
    /** The provider's mark, passed as a COMPONENT so the atom fixes its scale and weight. */
    icon: IconComponent
    /**
     * The full sentence on the button. It names the action and the provider
     * together, because a bare `Google` reads as a link to Google rather than as
     * a way into this product.
     */
    label: string
}

/**
 * The catalog this block exists to own. It is a module constant rather than a
 * prop for the same reason the brand word is one in `AuthPageIntro`: a caller
 * able to pass it in would own the wording, and the block would stop owning the
 * one thing it is for.
 */
const PROVIDER_CATALOG: Record<SignInProviderKey, SignInProviderEntry> = {
    google: { icon: GoogleLogoIcon, label: "Đăng nhập với Google" },
    github: { icon: GithubLogoIcon, label: "Đăng nhập với GitHub" },
}

/** Props for {@link SignInProviders}. */
export interface SignInProvidersProps {
    /**
     * The providers to offer, in the order they should appear. Required, and it
     * generates the whole shape of the block: without it there is nothing to
     * draw, which is why it IS the default rather than a leaf of its own
     * (rules/2 §2 ①).
     */
    providers: Array<SignInProviderKey>
    /**
     * Press on one provider. The block reports WHICH provider was pressed rather
     * than exposing a handler per key, so a caller adding a provider to
     * `providers` does not also have to remember to wire a new callback.
     */
    onPressProvider: (provider: SignInProviderKey) => void
    /**
     * The provider whose redirect is already in flight. Its button swaps the mark
     * for a spinner and stops accepting presses, so a second press cannot start a
     * second hop.
     *
     * The OTHER buttons stay pressable on purpose. A redirect can still fail, or
     * the visitor can change their mind before the hop completes, and locking the
     * whole column would strand them on a page with nothing to press.
     */
    pendingProvider?: SignInProviderKey
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The provider column of the login card. See the file header for the full
 * contract, in particular why the wording lives here and not at the call site.
 *
 * @param props - {@link SignInProvidersProps}
 */
const SignInProviders = ({
    providers,
    onPressProvider,
    pendingProvider,
    showAnatomy = false,
    anatPart,
}: SignInProvidersProps) => (
    // The block names ITSELF on a wrapper and lets the frame keep its own name: a
    // frame wearing the name of the thing inside it drops the frame out of the
    // tree and mislabels what is left (rules/1 §4).
    <div data-anat-part={anatPart}>
        <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
            {providers.map((provider) => {
                const entry = PROVIDER_CATALOG[provider]
                return (
                    <Button
                        key={provider}
                        variant="secondary"
                        prefixIcon={entry.icon}
                        label={entry.label}
                        isPending={pendingProvider === provider}
                        onPress={() => onPressProvider(provider)}
                        className="w-full"
                        anatPart={showAnatomy ? "Button" : undefined}
                    />
                )
            })}
        </StackV>
    </div>
)

export { SignInProviders }

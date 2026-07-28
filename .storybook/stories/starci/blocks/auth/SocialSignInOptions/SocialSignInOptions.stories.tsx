import type { Meta, StoryObj } from "@storybook/nextjs"
import { SocialSignInOptions, type SignInProvider } from "@sb-components/starci/blocks/auth/SocialSignInOptions/SocialSignInOptions"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SocialSignInOptions`: the column of identity-provider shortcuts on
 * the sign-in screen. It answers one question, "can I get in without typing a
 * password", so the screen calls this one block instead of holding a stack frame
 * plus two loose buttons.
 *
 * ⭐ THE CALLER PASSES AN ENUM ARRAY AND NOTHING ELSE. The glyph, the Vietnamese
 * label and the reading order all live inside the block (§14d.1). There is no
 * `label` prop to hand it, which is the point: wording that a call site can
 * override is wording that drifts screen by screen.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Dropping GitHub from `providers` removes a
 * button but changes nothing the block itself draws, so one provider and two
 * providers are two STATES of one leaf. The caller flipping `isSkeleton` swaps
 * every button for its mirror, which is a shape the block owns ⇒ its own leaf.
 *
 * ⛔ There is deliberately NO `providers = []` leaf. A deployment with no
 * configured provider does not draw an empty column, it draws the credential
 * form alone, so the screen stops rendering this block entirely (§14d.3).
 */
const meta: Meta<typeof SocialSignInOptions> = {
    title: "StarCi/Blocks/Auth/SocialSignInOptions/SocialSignInOptions",
    component: SocialSignInOptions,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SocialSignInOptions>

const BOTH: Array<SignInProvider> = ["google", "github"]
const GOOGLE_ONLY: Array<SignInProvider> = ["google"]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track holding the provider buttons, owning the one seam between them so that no button carries a margin of its own", storyId: "frames-stack-stackv--default" },
    "Button": { tier: "atom", role: "one provider shortcut, drawn from the glyph and the sentence the block looked up for that provider, or its own resting mirror when the block is skeletonised", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the plain call: a set of providers in, one button per provider out. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SocialSignInOptions"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="The caller hands over typed providers only. Every glyph, every word and the reading order are looked up inside the block, so no state here can be produced by a call site passing different copy."
                states={[
                    {
                        name: "providers = [\"google\", \"github\"]",
                        why: "Both configured providers become a button, Google above GitHub because the block walks its own order rather than the caller's array. This is the shape the live app ships, and putting Google first puts the account most learners already hold at the top of the column.",
                        code: `<SocialSignInOptions
    providers={["google", "github"]}
    onProviderPress={(provider) => signInWith(provider)}
/>`,
                        render: (
                            <SocialSignInOptions
                                anatPart="SocialSignInOptions"
                                showAnatomy
                                providers={BOTH}
                                onProviderPress={() => {}}
                            />
                        ),
                    },
                    {
                        name: "providers = [\"google\"]",
                        why: "The GitHub button is simply absent and the surviving button keeps its full width and its place at the top of the column. A deployment that configured one provider should read as a complete offer rather than as a two-button row with a hole in it, which is why nothing stretches, shrinks or re-centres.",
                        code: `<SocialSignInOptions
    providers={["google"]}
    onProviderPress={(provider) => signInWith(provider)}
/>`,
                        render: (
                            <SocialSignInOptions
                                providers={GOOGLE_ONLY}
                                onProviderPress={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so every button swaps to its own mirror. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SocialSignInOptions"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="The flag reaches the real `Button` atoms rather than a second component tree (§12c), so the resting column is the live column with its atoms at rest."
                states={[
                    {
                        name: "isSkeleton, providers = [\"google\", \"github\"]",
                        why: "Each button becomes a full-width pill at the height it will hand back, and the seam between them is unchanged. The provider list is known before the sign-in screen has finished asking the server which providers are enabled, so this state exists to hold the column's exact footprint and stop it jumping when the answer lands.",
                        code: `<SocialSignInOptions
    providers={["google", "github"]}
    onProviderPress={(provider) => signInWith(provider)}
    isSkeleton
/>`,
                        render: (
                            <SocialSignInOptions
                                anatPart="SocialSignInOptions"
                                showAnatomy
                                providers={BOTH}
                                onProviderPress={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

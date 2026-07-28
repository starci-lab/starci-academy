import type { Meta, StoryObj } from "@storybook/nextjs"
import { SignInProviders } from "@sb-components/starci/blocks/auth/SignInProviders/SignInProviders"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SignInProviders`: the "sign in without a password" column of the
 * login card (F2). The caller names providers by key; this block turns each key
 * into a mark and into the Vietnamese sentence the visitor reads.
 *
 * IT OWNS THE CATALOG, WHICH IS WHY IT IS A BLOCK. A stack of buttons is a
 * frame's job. The reason this layer is earned is the table mapping
 * `"google"` to the Google mark and to `Đăng nhập với Google` — typed domain
 * data becoming words, which §14d.1 places at exactly this tier.
 *
 * NO SURFACE. The block draws no card and no padding. It renders inside the
 * credentials panel's card, and the seam down to the divider below belongs to
 * whoever places both (§10a).
 *
 * TWO LEAVES, AND THAT IS THE WHOLE SET. `providers` is required and generates
 * the entire shape, so it is the default rather than a leaf of its own
 * (rules/2 §2 ①). `pendingProvider` is optional and its presence swaps one
 * button's glyph for a spinner, so it takes the one other leaf (rules/2 §2 ②).
 * There is deliberately no "single provider" leaf: one key instead of two is a
 * DATA difference inside the same shape, and no deployment of this product
 * ships a single-provider login anyway.
 */
const meta: Meta<typeof SignInProviders> = {
    title: "StarCi/Blocks/Auth/SignInProviders/SignInProviders",
    component: SignInProviders,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SignInProviders>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track holding the provider buttons, owning the one seam between them so no button carries a margin of its own", storyId: "frames-stack-stackv--default" },
    "Button": { tier: "atom", role: "one provider button, drawn from the block's catalog so the mark and the sentence always arrive as a pair, and carrying the spinner when that provider's redirect is in flight", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the bare call: the required `providers` array and nothing optional. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInProviders"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Every button in this column carries the same quiet weight. The one primary action of the login card is the password submit below, so a primary here would compete with it, and ranking one identity provider above the other is a claim the product has no basis to make."
                states={[
                    {
                        name: "providers = [\"google\", \"github\"]",
                        why: "Two buttons appear in the order the array gives them, each pairing a provider mark with the sentence the block wrote for it. This is the only ordering the app ships, and the array carries both which providers are offered and where each one sits, so the block never imposes an order of its own.",
                        code: `<SignInProviders
    providers={["google", "github"]}
    onPressProvider={(provider) => startKeycloakHop(provider)}
/>`,
                        render: (
                            <SignInProviders
                                anatPart="SignInProviders"
                                showAnatomy
                                providers={["google", "github"]}
                                onPressProvider={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller passes `pendingProvider`, so one button locks and spins. */
export const Redirecting: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInProviders"
                tier="block"
                leaf="Prop `pendingProvider`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Only the named provider locks. A redirect can still fail and a visitor can still change their mind mid-hop, so freezing the whole column would strand them on a page with nothing left to press."
                states={[
                    {
                        name: "pendingProvider = \"google\"",
                        why: "The Google button swaps its mark for a spinner and stops taking presses, while the GitHub button keeps its mark and stays pressable. The hop out to Keycloak has started and a second press would open a second one, so the button that owns the journey is the only one that closes.",
                        code: `<SignInProviders
    providers={["google", "github"]}
    pendingProvider="google"
    onPressProvider={(provider) => startKeycloakHop(provider)}
/>`,
                        render: (
                            <SignInProviders
                                anatPart="SignInProviders"
                                showAnatomy
                                providers={["google", "github"]}
                                pendingProvider="google"
                                onPressProvider={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

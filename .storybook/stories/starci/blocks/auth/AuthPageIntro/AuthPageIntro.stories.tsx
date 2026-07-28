import type { Meta, StoryObj } from "@storybook/nextjs"
import { AuthPageIntro } from "@sb-components/starci/blocks/auth/AuthPageIntro/AuthPageIntro"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `AuthPageIntro`: the page chrome above the login card. It owns the
 * brand line and, when the edge guard bounced the visitor here, the sentence
 * explaining why they are looking at a login form.
 *
 * WHY A BLOCK AND NOT LOOSE ATOMS IN THE SCREEN. A screen composes blocks and
 * frames only, so it cannot draw a wordmark itself. This block also branches on
 * a typed fact and words the result, which is the work §14d.1 places at this
 * tier rather than at the caller.
 *
 * LEAVES BY STRUCTURE. `isResumingProtectedRoute` makes a whole node appear, and
 * the caller is the one flipping it, so it is a LEAF (rules/2 §0) — while
 * `Default` already shows the off side of that same switch, which is why there
 * is no separate "not resumed" leaf. `isSkeleton` is a leaf at every tier
 * (§12c), and it renders BOTH sides of the branch because a skeleton leaf has to
 * follow the component's own shape axis (rules/2 §L3).
 *
 * NO "brand only, no press handler" LEAF. The brand is always a way home, so a
 * version without the handler is a case no screen asks for (§14d.3).
 */
const meta: Meta<typeof AuthPageIntro> = {
    title: "StarCi/Blocks/Auth/AuthPageIntro/AuthPageIntro",
    component: AuthPageIntro,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AuthPageIntro>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track holding the brand line above the reason line, owning the one seam between them so neither text node carries a margin of its own", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines, either the brand rendered as a link back to the marketing home, the muted sentence explaining the bounce, or the shimmer bar standing in for the brand", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the minimal valid call: the brand line and nothing else. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="AuthPageIntro"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="The block never draws padding of its own, because the distance down to the login card belongs to the screen that places both."
                states={[
                    {
                        name: "isResumingProtectedRoute = false",
                        why: "Only the brand line is drawn, so the intro is a single row and the login card follows straight under it. A visitor who typed the login address themselves came here on purpose, and a sentence explaining their arrival would be answering a question they never asked.",
                        code: "<AuthPageIntro onBrandPress={goHome} />",
                        render: (
                            <AuthPageIntro
                                anatPart="AuthPageIntro"
                                showAnatomy
                                onBrandPress={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the guard bounced the visitor, so a second line grows under the brand. */
export const ResumedFromGuard: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="AuthPageIntro"
                tier="block"
                leaf="Resumed from guard"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="The sentence never names the page the visitor was reaching for. They already know where they were going, and a printed path reads as an error message rather than an explanation."
                states={[
                    {
                        name: "isResumingProtectedRoute = true",
                        why: "A muted line appears under the brand and the block becomes two rows, with the seam between them owned by the stack. The visitor did not choose to be here, so the page says why before asking them for anything.",
                        code: "<AuthPageIntro onBrandPress={goHome} isResumingProtectedRoute />",
                        render: (
                            <AuthPageIntro
                                anatPart="AuthPageIntro"
                                showAnatomy
                                onBrandPress={() => {}}
                                isResumingProtectedRoute
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so the brand swaps to a wordmark-width bar. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="AuthPageIntro"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="The bar is set to the width of the wordmark it stands in for, so nothing shifts sideways when the session check returns."
                states={[
                    {
                        name: "isSkeleton = true, isResumingProtectedRoute = false",
                        why: "The brand line becomes a shimmer bar and the block stays one row tall. The flag reaches the real text atom instead of a second skeleton component, which is why the block hands back the same box it was holding.",
                        code: "<AuthPageIntro onBrandPress={goHome} isSkeleton />",
                        render: (
                            <AuthPageIntro
                                anatPart="AuthPageIntro"
                                showAnatomy
                                onBrandPress={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true, isResumingProtectedRoute = true",
                        why: "The brand is a bar while the reason line below it is drawn as real text. That line is read off the address the visitor arrived on rather than fetched, so shimmering it would fake a wait that is not happening.",
                        code: "<AuthPageIntro onBrandPress={goHome} isResumingProtectedRoute isSkeleton />",
                        render: (
                            <AuthPageIntro
                                onBrandPress={() => {}}
                                isResumingProtectedRoute
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

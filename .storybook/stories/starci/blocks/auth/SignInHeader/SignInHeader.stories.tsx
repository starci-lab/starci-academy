import type { Meta, StoryObj } from "@storybook/nextjs"
import { SignInHeader } from "@sb-components/starci/blocks/auth/SignInHeader/SignInHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `SignInHeader`: the identity region above the sign-in panel. It carries
 * the brand word that takes the visitor back to the public site, and the one line
 * that explains a forced sign-in when the edge guard put them here.
 *
 * SIBLING OF `ContentHeader` and `CourseBrief`, not a copy. Same job, identity at
 * the top of a route, different domain: no read state, no module count, just a way
 * home and a reason.
 *
 * WORDING BELONGS TO THE BLOCK (§14d.1). The caller passes `hasProtectedTarget`,
 * a boolean fact about how the visitor arrived, and the block decides the sentence.
 * There is deliberately no `heading` prop and no redirect path prop: the sentence
 * reads the same whichever guarded route was blocked, so the path would be data
 * the block accepts and discards.
 *
 * LEAF BY STRUCTURE. `hasProtectedTarget` is a prop the CALLER flips, and flipping
 * it grows a second `Typography` node, so it earns its own leaf rather than being a
 * second state inside `Default`.
 *
 * There is deliberately NO skeleton leaf. Neither row waits on a request, so a
 * resting shape here would be a case no screen ever reaches.
 */
const meta: Meta<typeof SignInHeader> = {
    title: "StarCi/Blocks/Auth/SignInHeader/SignInHeader",
    component: SignInHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SignInHeader>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track holding the two rows, owning the seam between the brand word and the guard sentence, and kept start-aligned so the link's hit area stops at the word", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "one of the block's own text rows, either the brand word rendered as a link back to the public site or the muted sentence explaining the forced sign-in", storyId: "atoms-text-typography-typography--link" },
}

/** LEAF — brand row alone: the minimal valid call, with no optional prop turned on. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInHeader"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="The brand word is the only row that is always present, because it is the only way out of a sign-in page. Everything else in this block has to be earned by a fact about the visitor's arrival."
                states={[
                    {
                        name: "redirectTarget = null",
                        why: "Only the brand row is drawn, so the header is one pressable word and the panel starts directly under it. A visitor who typed the sign-in address themselves already knows why they are here, and a block that explained it anyway would be answering a question nobody asked.",
                        code: "<SignInHeader onPressHome={goHome} />",
                        render: (
                            <SignInHeader
                                anatPart="SignInHeader"
                                showAnatomy
                                onPressHome={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `hasProtectedTarget`, so a second `Typography` grows under the brand. */
export const Gated: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SignInHeader"
                tier="block"
                leaf="Prop `hasProtectedTarget`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="The second row exists to answer a question the visitor did not choose to ask, so it stays muted and stays one sentence long. The block owns that sentence and never accepts it, nor the blocked route, from the caller."
                states={[
                    {
                        name: "redirectTarget = \"/khoa-hoc/devops-mastery/bai-3\"",
                        why: "A muted line grows under the brand word, one row down, and says why the sign-in screen appeared. The visitor was reading a lesson and got bounced by the edge guard, so the screen owes them a reason before it asks for credentials.",
                        code: "<SignInHeader onPressHome={goHome} hasProtectedTarget />",
                        render: (
                            <SignInHeader
                                anatPart="SignInHeader"
                                showAnatomy
                                onPressHome={() => {}}
                                hasProtectedTarget
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

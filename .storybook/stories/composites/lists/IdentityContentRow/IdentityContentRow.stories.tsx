import type { Meta, StoryObj } from "@storybook/nextjs"
import { SealCheckIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { IdentityContentRow } from "@sb-components/composites/lists/IdentityContentRow/IdentityContentRow"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `IdentityContentRow`: avatar + byline + whatever content sits
 * under it. Extracted from `ContentCommentThread` (thầy 2026-07-29: "gom màu
 * đen thành block riêng") — a second real occurrence (`QaQuestionThread`'s own
 * avatar+byline+body row) made it a genuine repeat, not a premature abstraction.
 *
 * ⭐⭐ BOTH SEAMS `tight` ON PURPOSE — a deliberate denser standalone treatment,
 * not a `src`-fidelity port. See the component's own file header.
 */
const meta: Meta<typeof IdentityContentRow> = {
    title: "Composites/Lists/IdentityContentRow/IdentityContentRow",
    component: IdentityContentRow,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof IdentityContentRow>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Avatar": { tier: "atom", role: "leading avatar, fallback chain owned by the atom", storyId: "atoms-display-avatar-avatar--default" },
    "StackH": { tier: "frame", role: "root row (tight) and the caller-supplied byline row", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the column: byline stacked over whatever content the caller passed as children (tight)", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "byline text / body text", storyId: "atoms-text-typography-typography--plain" },
}

const Byline = (
    <StackH gap="tight" wrap align="center">
        <Typography size="sm" weight="medium" text="Minh Anh" />
        <SealCheckIcon weight="fill" aria-label="Founder" className="size-3.5 shrink-0 text-accent-soft-foreground" />
        <Typography size="xs" color="muted" text="2 giờ trước" />
    </StackH>
)

/** LEAF — avatar + byline + free-form content (here, a comment body). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="IdentityContentRow"
                tier="composite"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "byline + content children",
                        why: "Both seams (avatar↔column, byline↔children) are `tight` — a deliberate denser standalone treatment (thầy 2026-07-29), not a `src`-fidelity port.",
                        code: `<IdentityContentRow avatarName="Minh Anh" avatarSeed="u1" byline={<StackH gap="tight">...</StackH>}>
    <Typography size="sm" text="Chỗ multi-stage em làm theo mà image vẫn 800MB, hoá ra quên COPY --from." />
</IdentityContentRow>`,
                        render: (
                            <IdentityContentRow
                                anatPart="IdentityContentRow"
                                showAnatomy
                                avatarName="Minh Anh"
                                avatarSeed="u1"
                                byline={Byline}
                            >
                                <Typography size="sm" text="Chỗ multi-stage em làm theo mà image vẫn 800MB, hoá ra quên COPY --from." />
                            </IdentityContentRow>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the avatar mirrors, byline/content stay whatever the caller passed (skeleton shape is the caller's own responsibility for those slots). */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="IdentityContentRow"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Only the avatar is owned by this composite, so only it mirrors here — the caller's own byline/content slots draw their own skeleton shape when they need to.",
                        code: "<IdentityContentRow isSkeleton avatarName=\"Minh Anh\" avatarSeed=\"u1\" byline={...}>...</IdentityContentRow>",
                        render: (
                            <IdentityContentRow
                                anatPart="IdentityContentRow"
                                showAnatomy
                                isSkeleton
                                avatarName="Minh Anh"
                                avatarSeed="u1"
                                byline={Byline}
                            >
                                <Typography size="sm" text="Chỗ multi-stage em làm theo mà image vẫn 800MB, hoá ra quên COPY --from." />
                            </IdentityContentRow>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

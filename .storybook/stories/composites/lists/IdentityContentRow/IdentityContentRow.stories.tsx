import type { Meta, StoryObj } from "@storybook/nextjs"
import { SealCheckIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { IdentityContentRow } from "@sb-components/composites/lists/IdentityContentRow/IdentityContentRow"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `IdentityContentRow`: avatar + byline + whatever content sits
 * under it. Extracted from `ContentCommentThread` (teacher, 2026-07-29: "group
 * the recurring shape into its own block") — a second real occurrence
 * (`QaQuestionThread`'s own avatar+byline+body row) made it a genuine repeat,
 * not a premature abstraction.
 *
 * ⭐⭐ BOTH SEAMS `gap={2}` ON PURPOSE — a deliberate denser standalone treatment,
 * not a `src`-fidelity port. See the component's own file header.
 *
 * 2026-07-31 (COMPOSITE-8 fix): `byline` and `body` take a COMPONENT reference
 * each, not a built node — the row calls them itself and forwards `isSkeleton`,
 * so `Byline`/`CommentBody` below can shimmer along with the avatar instead of
 * only the avatar mirroring.
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
    "StackH": { tier: "frame", role: "root row (gap={2}) and the caller-supplied byline row", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the column: byline stacked over whatever content the caller's `body` component renders (gap={2})", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "byline text / body text", storyId: "atoms-text-typography-typography--plain" },
}

/**
 * The byline slot's component. Forwards `isSkeleton` into its own `Typography`
 * atoms so the row's shimmer covers the byline too, not only the avatar.
 *
 * `wrap` dropped 2026-08-01 (wave-3 numeric-scale migration): `StackH`/`Flex`
 * lose the boolean entirely this session (responsive.md's open question
 * resolved against it), and this row never had a "why" of its own for wrapping
 * — no `at` threshold was ever named here, so it matches the "two dead call
 * sites" half of that question, not the "genuinely uneven pair" half. Three
 * short items (a name, a small badge, a timestamp) do not reflow at any
 * container width this composite is actually used at, so the safe fix is to
 * drop the prop rather than invent a threshold nobody chose.
 */
const Byline = ({ isSkeleton }: { isSkeleton?: boolean }) => (
    <StackH
        gap={2}
        align="center"

        body={
            <>
                <Typography
                    size="sm"
                    weight="medium"
                    text="Minh Anh"
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-20"] : undefined}
                />
                {!isSkeleton ? (
                    <SealCheckIcon data-tier="fixture" weight="fill" aria-label="Founder" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                ) : null}
                <Typography
                    size="xs"
                    color="muted"
                    text="2 hours ago"
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-16"] : undefined}
                />
            </>
        }
    />
)

/** The body slot's component — here, a plain comment line. Same `isSkeleton`-forwarding contract as {@link Byline}. */
const CommentBody = ({ isSkeleton }: { isSkeleton?: boolean }) => (
    <Typography
        size="sm"
        isSkeleton={isSkeleton}
        classNames={isSkeleton ? ["w-full"] : undefined}
        text={isSkeleton ? undefined : "I followed the multi-stage guide but the image was still 800MB — turned out I forgot COPY --from."}
    />
)

/** LEAF — avatar + byline + free-form content (here, a comment body). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="IdentityContentRow"
                tier="composite"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "byline + body components",
                        why: "Both seams (avatar↔column, byline↔body) are `gap={2}` — a deliberate denser standalone treatment (teacher, 2026-07-29), not a `src`-fidelity port.",
                        code: `<IdentityContentRow avatarName="Minh Anh" avatarSeed="u1" byline={Byline} body={CommentBody} />`,
                        render: (
                            <IdentityContentRow

                               
                                avatarName="Minh Anh"
                                avatarSeed="u1"
                                byline={Byline}
                                body={CommentBody}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the row forwards it into the avatar AND into the `byline`/`body` components, so all three shimmer together. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
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
                        why: "The row forwards `isSkeleton` into the avatar AND into the `byline`/`body` components it calls, so all three shimmer together instead of only the avatar mirroring.",
                        code: "<IdentityContentRow isSkeleton avatarName=\"Minh Anh\" avatarSeed=\"u1\" byline={Byline} body={CommentBody} />",
                        render: (
                            <IdentityContentRow

                               
                                isSkeleton
                                avatarName="Minh Anh"
                                avatarSeed="u1"
                                byline={Byline}
                                body={CommentBody}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

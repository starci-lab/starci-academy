import type { Meta, StoryObj } from "@storybook/nextjs"
import { type SkeletonProps } from "@sb-components/composites/_slot"
import { SealCheckIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { IdentityContentRow } from "@sb-components/composites/lists/IdentityContentRow/IdentityContentRow"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `IdentityContentRow` — avatar + byline + whatever content sits under it, as one row.
 * `byline` and `body` each take a component reference, not a built node — the row calls them
 * itself and forwards `isSkeleton` so both shimmer along with the avatar. Both seams use
 * `gap={2}` for a denser standalone treatment.
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
 */
const Byline = ({ isSkeleton }: SkeletonProps) => (
    <StackH
        gap={2}
        align="center"

        items={[
            () => (
                <Typography
                    size="sm"
                    weight="medium"
                    text="Minh Anh"
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-1/3"] : undefined}
                />
            ),
            ...(!isSkeleton ? [
                () => <SealCheckIcon data-tier="fixture" weight="fill" aria-label="Founder" className="size-3.5 shrink-0 text-accent-soft-foreground" />,
            ] : []),
            () => (
                <Typography
                    size="xs"
                    color="muted"
                    text="2 hours ago"
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-1/4"] : undefined}
                />
            ),
        ]}
    />
)

/** The body slot's component — here, a plain comment line. Same `isSkeleton`-forwarding contract as {@link Byline}. */
const CommentBody = ({ isSkeleton }: SkeletonProps) => (
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
                        why: "Both seams (avatar↔column, byline↔body) are `gap={2}` — a deliberate denser standalone treatment, not a `src`-fidelity port.",
                        code: "<IdentityContentRow avatarName=\"Minh Anh\" avatarSeed=\"u1\" byline={Byline} body={CommentBody} />",
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

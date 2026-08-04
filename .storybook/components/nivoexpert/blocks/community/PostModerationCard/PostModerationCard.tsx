import { ChatCircleIcon, EyeSlashIcon, HeartIcon, PushPinIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { UserCell } from "@sb-components/composites/lists/UserCell/UserCell"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PostModerationCard` — one community post as the expert's moderation queue
 * shows it: identity, title + body, static like/comment counts, and the
 * pin/hide controls the public `PostCard` has no room for. The three
 * pictures — `published, not pinned`, `published, pinned`, `hidden` — are
 * DATA, so they are STATES of the single shape. Grounded in the real
 * `PostEntity.pinned` and `PostEntity.status` (`"published" | "removed"`) —
 * the FE has no `pinPost`/`hidePost` mutation yet.
 */

/** Moderation status of a post (`PostEntity.status`). */
export type PostModerationStatus = "published" | "removed"

/** One moderated post — a subset of `PostEntity`. */
export interface PostModerationView {
    /** Post id (`PostEntity.id`). */
    id: string
    /** Display name of the author (`PostEntity.authorName`). */
    authorName: string
    /** Post title (`PostEntity.title`). */
    title: string
    /** Post body — markdown source (`PostEntity.body`), rendered plain here. */
    body: string
    /** Whether the post is pinned to the top of the public feed (`PostEntity.pinned`). */
    pinned: boolean
    /** Moderation status — `removed` posts are hidden from the public feed (`PostEntity.status`). */
    status: PostModerationStatus
    /** Denormalised like count (`PostEntity.reactionCount`), shown as a static count — the admin never likes a post. */
    reactionCount: number
    /** Total number of comments. */
    commentCount: number
}

/** Props for {@link PostModerationCard}. */
export interface PostModerationCardProps {
    /** The post. */
    post: PostModerationView
    /** Pin or unpin the post — the connected layer runs the (new) `pinPost`/`unpinPost` mutation. */
    onTogglePin: () => void
    /** Hide the post from the public feed — the connected layer runs the (new) `hidePost` mutation. */
    onHide: () => void
    /** `true` while this row's own pin/hide mutation is in flight — locks both controls. */
    isBusy?: boolean
    /**
     * `true` → the moderation queue's own first fetch is in flight: the same
     * card renders with every content node shimmering (§12b). A list renders a
     * fixed count of these while loading.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: PostModerationCardLabels
}

/** The already-resolved copy the block renders. */
export interface PostModerationCardLabels {
    /** Chip label for a pinned post. */
    pinnedLabel: string
    /** Chip label for a hidden (`status: "removed"`) post. */
    hiddenLabel: string
    /** Pin button label (shown when the post is not pinned). */
    pinLabel: string
    /** Unpin button label (shown when the post is pinned). */
    unpinLabel: string
    /** Hide button label. */
    hideLabel: string
    /** Suffix after the like count (e.g. "likes"). */
    likesSuffix: string
    /** Suffix after the comment count (e.g. "comments"). */
    commentsSuffix: string
}

/**
 * The community moderation row. See the file header for why the three
 * pictures are states of one shape rather than separate leaves.
 *
 * @param props - {@link PostModerationCardProps}
 */
const PostModerationCard = ({ post, onTogglePin, onHide, isBusy = false, isSkeleton = false, labels }: PostModerationCardProps) => {
    const isHidden = post.status === "removed"

    /** The moderation action row — pin/unpin + hide while published; a status chip once hidden (no restore mutation exists yet). */
    const ModerationRow = () =>
        isHidden ? (
            <Chip tone="default" icon={EyeSlashIcon} text={labels.hiddenLabel} />
        ) : (
            <StackH
                gap={2}
                items={[
                    () => (
                        <Button
                            variant="secondary"
                            size="sm"
                            prefixIcon={PushPinIcon}
                            label={post.pinned ? labels.unpinLabel : labels.pinLabel}
                            onPress={onTogglePin}
                            isDisabled={isBusy}
                        />
                    ),
                    () => (
                        <Button
                            variant="danger-soft"
                            size="sm"
                            prefixIcon={EyeSlashIcon}
                            label={labels.hideLabel}
                            onPress={onHide}
                            isDisabled={isBusy}
                        />
                    ),
                ]}
            />
        )

    return (
        <div data-tier="block" data-component="PostModerationCard">
            <SurfaceCard
                padding={3}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        gap={3}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    justify="between"
                                    align="center"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <UserCell username={post.authorName} size="sm" isSkeleton={isSkeleton} />,
                                        ...(!isSkeleton && post.pinned ? [() => <Chip tone="accent" icon={PushPinIcon} text={labels.pinnedLabel} />] : []),
                                    ]}
                                />
                            ),
                            () => <Typography size="base" weight="semibold" isSkeleton={isSkeleton} text={post.title} />,
                            () => <Typography size="sm" color="muted" preserveWhitespace isSkeleton={isSkeleton} text={post.body} />,
                            () => (
                                <StackH
                                    gap={3}
                                    justify="between"
                                    align="center"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => (
                                            <StackH
                                                gap={3}
                                                align="center"
                                                isSkeleton={isSkeleton}
                                                items={[
                                                    () => (
                                                        <Typography
                                                            size="sm"
                                                            color="muted"
                                                            prefixIcon={HeartIcon}
                                                            isSkeleton={isSkeleton}
                                                            text={`${post.reactionCount} ${labels.likesSuffix}`}
                                                        />
                                                    ),
                                                    () => (
                                                        <Typography
                                                            size="sm"
                                                            color="muted"
                                                            prefixIcon={ChatCircleIcon}
                                                            isSkeleton={isSkeleton}
                                                            text={`${post.commentCount} ${labels.commentsSuffix}`}
                                                        />
                                                    ),
                                                ]}
                                            />
                                        ),
                                        ...(!isSkeleton ? [() => <ModerationRow />] : []),
                                    ]}
                                />
                            ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { PostModerationCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "PostModerationCard" } as const

import { EyeSlashIcon, PushPinIcon, TrashIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { UserCell } from "@sb-components/composites/lists/UserCell/UserCell"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PostModerationDrawer` -- the full-detail moderation surface for ONE community
 * post: author, title, body, and status, with the actions the compact
 * `PostModerationCard` row has no room for. `onRemove` names a (new) hard-delete
 * mutation this drawer is BUILT for, distinct from `onHide`'s soft moderation -- the
 * FE has no admin moderation capability wired yet, same disclaimer
 * `PostModerationCard` carries. Once a post is hidden there is no un-hide control,
 * so its action row collapses to the hard-delete action only.
 */

/** Moderation status of a post. */
export type PostModerationDrawerStatus = "published" | "removed"

/** The post this drawer shows in full. */
export interface ModeratedPostDetail {
    /** Post id. */
    id: string
    /** Display name of the author. */
    authorName: string
    /** Post title. */
    title: string
    /** Post body -- markdown source, rendered plain here. */
    body: string
    /** Whether the post is pinned to the top of the public feed. */
    pinned: boolean
    /** Moderation status -- `removed` posts are hidden from the public feed. */
    status: PostModerationDrawerStatus
}

/** Props for {@link PostModerationDrawer}. */
export interface PostModerationDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** The post being moderated. Unset while `isSkeleton` (nothing to show yet). */
    post?: ModeratedPostDetail
    /** Pin or unpin the post -- the connected layer runs the (new) `pinPost`/`unpinPost` mutation. */
    onTogglePin: () => void
    /** Hide the post from the public feed -- the connected layer runs the (new) `hidePost` mutation. */
    onHide: () => void
    /** Permanently delete the post -- the connected layer runs the (new) `removePost` mutation. */
    onRemove: () => void
    /** `true` while this post's own pin/hide/remove mutation is in flight -- locks every footer action. */
    isBusy?: boolean
    /** `true` -> the drawer's own first fetch is in flight; the title and body shimmer, and the footer is omitted (nothing to act on yet). */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: PostModerationDrawerLabels
}

/** The already-resolved copy the drawer renders. */
export interface PostModerationDrawerLabels {
    /** Drawer title (e.g. "Post"). */
    title: string
    /** Status chip label for a published post. */
    publishedLabel: string
    /** Status chip label for a hidden post. */
    hiddenLabel: string
    /** Chip label for a pinned post. */
    pinnedLabel: string
    /** Pin button label (shown when the post is not pinned). */
    pinLabel: string
    /** Unpin button label (shown when the post is pinned). */
    unpinLabel: string
    /** Hide button label. */
    hideLabel: string
    /** Permanent-delete button label. */
    removeLabel: string
}

/**
 * The post-moderation drawer. See the file header for why hard-delete is a
 * separate action from soft-hide, and why a hidden post's action row collapses.
 *
 * @param props - {@link PostModerationDrawerProps}
 */
const PostModerationDrawer = ({
    isOpen,
    onOpenChange,
    post,
    onTogglePin,
    onHide,
    onRemove,
    isBusy = false,
    isSkeleton = false,
    labels,
}: PostModerationDrawerProps) => {
    const isHidden = post?.status === "removed"

    return (
        <div>
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={labels.title}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        principle="label-field" gap={4}
                        isSkeleton={isSkeleton}
                        items={[
                            () => <UserCell username={post?.authorName ?? ""} size="md" isSkeleton={isSkeleton} />,
                            () => <Typography size="base" weight="semibold" isSkeleton={isSkeleton} text={post?.title} />,
                            () => <Typography size="sm" color="muted" preserveWhitespace isSkeleton={isSkeleton} text={post?.body} />,
                            () => (
                                <StackH
                                    gap={3}
                                    principle="chip-row"
                                    align="center"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => (
                                            <Chip
                                                tone={isHidden ? "default" : "success"}
                                                icon={isHidden ? EyeSlashIcon : undefined}
                                                text={isHidden ? labels.hiddenLabel : labels.publishedLabel}
                                            />
                                        ),
                                        ...(!isSkeleton && post?.pinned ? [() => <Chip tone="accent" icon={PushPinIcon} text={labels.pinnedLabel} />] : []),
                                    ]}
                                />
                            ),
                        ]}
                    />
                )}
                footer={
                    isSkeleton || post == null
                        ? undefined
                        : () => (
                            <>
                                {!isHidden ? (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        prefixIcon={PushPinIcon}
                                        label={post.pinned ? labels.unpinLabel : labels.pinLabel}
                                        onPress={onTogglePin}
                                        isDisabled={isBusy}
                                    />
                                ) : null}
                                {!isHidden ? (
                                    <Button
                                        variant="danger-soft"
                                        size="sm"
                                        prefixIcon={EyeSlashIcon}
                                        label={labels.hideLabel}
                                        onPress={onHide}
                                        isDisabled={isBusy}
                                    />
                                ) : null}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    prefixIcon={TrashIcon}
                                    label={labels.removeLabel}
                                    onPress={onRemove}
                                    isDisabled={isBusy}
                                />
                            </>
                        )
                }
            />
        </div>
    )
}

export { PostModerationDrawer }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "overlay", name: "PostModerationDrawer" } as const

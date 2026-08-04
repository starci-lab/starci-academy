import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CommunityPreviewCard` — the landing's honest community proof: the real
 * latest/pinned post, the "be the first" sub-state when the community is on
 * but genuinely has zero posts, or (per the caller, not this component) not
 * mounted at all when `Brand.communityEnabled` is false. Grounded in the real
 * `Post` shape (`id`/`authorName`/`title`/`body`/`pinned`) — no reaction or
 * student count, since `expert-api` exposes none. Built on the shared HeroUI
 * atom system (`SurfaceCard`/`Avatar`/`Chip`/`Typography`/`Stack`), re-themed
 * per tenant through `apps/expert/app/globals.css`'s `--nivo-*` -> HeroUI
 * CSS-var bridge — see the component's own file header for the full
 * contract.
 */

/** One real community post, reduced to what this preview renders. */
export interface CommunityPreviewPost {
    /** Post id (`Post.id`). */
    id: string
    /** Display name of the author (`Post.authorName`). */
    authorName: string
    /** Post title (`Post.title`). */
    title: string
    /** Post body (`Post.body`), rendered as a short plain-text preview. */
    body: string
    /** Whether this post is pinned (`Post.pinned`) — the seeded welcome post ships pinned. */
    pinned: boolean
}

/** The already-resolved copy this card renders. */
export interface CommunityPreviewCardLabels {
    /** Section label, e.g. "Community". */
    label: string
    /** Sub-caption naming where the post came from, e.g. "Latest pinned post". */
    sourceCaption: string
    /** Chip text on a pinned post. */
    pinnedLabel: string
    /** Heading shown when `post` is `null` (community on, genuinely zero posts yet). */
    emptyTitle: string
    /** Supporting line for the same sub-state. */
    emptyDescription: string
    /** Onward CTA label — opens the community, in every sub-state. */
    onwardLabel: string
}

/** Props for {@link CommunityPreviewCard}. */
export interface CommunityPreviewCardProps {
    /** The real latest/pinned post (`posts()[0]`), or `null` when the community is on but has zero posts. */
    post: CommunityPreviewPost | null
    /** Already-localized copy. */
    labels: CommunityPreviewCardLabels
    /** Fires on press — the connected layer routes into `/community`. */
    onOpenCommunity: () => void
    /**
     * `true` → the feed's own first fetch is in flight: every content node
     * (identity, caption, post title/body) shimmers, threaded down, mirroring
     * the loaded shape so nothing reflows when the post lands.
     */
    isSkeleton?: boolean
}

/**
 * The landing's community trust card. See the file header for why "disabled"
 * and "empty" are two different problems this component does not conflate.
 *
 * @param props - {@link CommunityPreviewCardProps}
 */
const CommunityPreviewCard = ({ post, labels, onOpenCommunity, isSkeleton = false }: CommunityPreviewCardProps) => (
    <div data-tier="block" data-component="CommunityPreviewCard">
        <SurfaceCard
            padding={4}
            isSkeleton={isSkeleton}
            header={() => (
                <StackH
                    gap={3}
                    isSkeleton={isSkeleton}
                    items={[
                        () => <Avatar fallback="initials" name="C" size="md" isSkeleton={isSkeleton} />,
                        () => (
                            <StackV
                                gap={1}
                                classNames={["min-w-0"]}
                                isSkeleton={isSkeleton}
                                items={[
                                    () => <Typography size="sm" weight="medium" truncate isSkeleton={isSkeleton} text={labels.label} />,
                                    () => <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} text={labels.sourceCaption} />,
                                ]}
                            />
                        ),
                    ]}
                />
            )}
            body={() => {
                if (isSkeleton) {
                    return (
                        <StackV
                            gap={2}
                            isSkeleton
                            items={[
                                () => <Typography size="sm" isSkeleton classNames={["w-2/3"]} />,
                                () => <Typography size="sm" isSkeleton classNames={["w-full"]} />,
                                () => <Typography size="sm" isSkeleton classNames={["w-3/4"]} />,
                            ]}
                        />
                    )
                }
                if (post) {
                    return (
                        <SurfaceCard
                            variant="nested"
                            padding={3}
                            header={post.pinned ? () => <Chip tone="accent" text={labels.pinnedLabel} /> : undefined}
                            body={() => (
                                <StackV
                                    gap={1}
                                    items={[
                                        () => <Typography size="sm" weight="medium" text={post.authorName} />,
                                        () => <Typography size="sm" weight="bold" text={post.title} />,
                                        () => <Typography size="sm" color="muted" lineClamp={2} text={post.body} />,
                                    ]}
                                />
                            )}
                        />
                    )
                }
                return (
                    <StackV
                        gap={1}
                        items={[
                            () => <Typography size="sm" weight="bold" text={labels.emptyTitle} />,
                            () => <Typography size="sm" color="muted" text={labels.emptyDescription} />,
                        ]}
                    />
                )
            }}
            footer={() =>
                isSkeleton ? (
                    <Button isSkeleton />
                ) : (
                    <Button variant="secondary" label={labels.onwardLabel} onPress={onOpenCommunity} />
                )
            }
        />
    </div>
)

export { CommunityPreviewCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CommunityPreviewCard" } as const

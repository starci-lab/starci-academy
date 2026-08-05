import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    PostModerationDrawer,
    type ModeratedPostDetail,
    type PostModerationDrawerLabels,
} from "@sb-components/nivoexpert/overlays/drawers/PostModerationDrawer/PostModerationDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PostModerationDrawer` — the full-detail moderation surface for ONE community
 * post: author, title, body, and status, with the actions the compact
 * `PostModerationCard` row has no room for. `onRemove` names a (new) hard-delete
 * mutation this drawer is BUILT for, distinct from `onHide`'s soft moderation — the
 * FE has no admin moderation capability wired yet, same disclaimer
 * `PostModerationCard` carries. Once a post is hidden there is no un-hide control,
 * so its action row collapses to the hard-delete action only.
 */
const meta: Meta<typeof PostModerationDrawer> = {
    title: "NivoExpert/Overlays/Drawers/PostModerationDrawer/PostModerationDrawer",
    component: PostModerationDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PostModerationDrawer>

const LABELS: PostModerationDrawerLabels = {
    title: "Post",
    publishedLabel: "Published",
    hiddenLabel: "Hidden",
    pinnedLabel: "Pinned",
    pinLabel: "Pin",
    unpinLabel: "Unpin",
    hideLabel: "Hide",
    removeLabel: "Delete",
}

const PUBLISHED_POST: ModeratedPostDetail = {
    id: "post-1",
    authorName: "Hoang Nam",
    title: "Has anyone finished the session 3 exercise yet?",
    body: "Stuck on the useReducer refactor — the reducer keeps firing twice on the first dispatch. Anyone hit this?",
    pinned: false,
    status: "published",
}

const HIDDEN_POST: ModeratedPostDetail = {
    id: "post-2",
    authorName: "unknown-user-44",
    title: "Cheap course access, DM me",
    body: "Selling discounted access to every course on this platform, message me on Telegram.",
    pinned: false,
    status: "removed",
}

// Real DOM (content branch): DrawerShell(title="Post") > StackV(UserCell + title +
// body + status row) + Drawer.Footer[Button(pin/unpin)? + Button(hide)? + Button(delete)].
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "UserCell": { tier: "composite", role: "the post author's identity" },
    "Typography (title)": { tier: "atom", role: "the post title" },
    "Typography (body)": { tier: "atom", role: "the post body" },
    "Chip (status)": { tier: "atom", role: "published or hidden" },
    "Chip (pinned)": { tier: "atom", role: "shown only while the post is pinned" },
    "Button (pin)": { tier: "atom", role: "pin or unpin the post — hidden once the post is already hidden" },
    "Button (hide)": { tier: "atom", role: "soft-hide the post from the public feed — hidden once already hidden" },
    "Button (delete)": { tier: "atom", role: "permanently delete the post — always available" },
}

/** Shared controlled wrapper — the trigger reopens the drawer after it closes. */
type ControlledPostModerationDrawerProps = {
    triggerLabel: string
    post?: ModeratedPostDetail
    isBusy?: boolean
}
const ControlledPostModerationDrawer = ({
    triggerLabel,
    post,
    isBusy,
}: ControlledPostModerationDrawerProps) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <div className="self-start">
                <Button label={triggerLabel} variant="secondary" size="sm" onPress={() => setIsOpen(true)} />
            </div>
            <PostModerationDrawer
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                post={post}
                onTogglePin={() => {}}
                onHide={() => {}}
                onRemove={() => {}}
                isBusy={isBusy}
                labels={LABELS}
            />
        </div>
    )
}

/** All states live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="PostModerationDrawer"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="A presentational overlay drawer over one moderated post. `pinned` and `status` are DATA, so the three real pictures — published/not pinned, published/pinned, hidden — are states of the single shape. A hidden post's action row collapses to the hard-delete action only, since no restore mutation is grounded anywhere (same judgement `PostModerationCard` makes)."
            states={[
                {
                    name: "published, not pinned",
                    why: "The resting state: identity, title, body, a published status chip, and the pin/hide/delete actions a moderator can take.",
                    code: "<PostModerationDrawer isOpen={isOpen} onOpenChange={setIsOpen} post={post} onTogglePin={pin} onHide={hide} onRemove={remove} labels={labels} />",
                    render: <ControlledPostModerationDrawer triggerLabel="Open — published" post={PUBLISHED_POST} />,
                },
                {
                    name: "published, pinned",
                    why: "The post is pinned to the top of the public feed: a pinned chip rides beside the status chip, and the pin button reads \"Unpin\".",
                    code: "<PostModerationDrawer post={{ ...post, pinned: true }} … />",
                    render: <ControlledPostModerationDrawer triggerLabel="Open — pinned" post={{ ...PUBLISHED_POST, pinned: true }} />,
                },
                {
                    name: "hidden (status = removed)",
                    why: "A moderator already hid this post: the status chip switches to \"Hidden\" and the action row collapses to Delete only — there is no un-hide mutation to offer.",
                    code: "<PostModerationDrawer post={{ ...post, status: \"removed\" }} … />",
                    render: <ControlledPostModerationDrawer triggerLabel="Open — hidden" post={HIDDEN_POST} />,
                },
                {
                    name: "isBusy = true",
                    why: "This post's own pin/hide/delete mutation is in flight: every footer action locks so a double-click cannot fire it twice.",
                    code: "<PostModerationDrawer post={post} isBusy … />",
                    render: <ControlledPostModerationDrawer triggerLabel="Open — busy" post={PUBLISHED_POST} isBusy />,
                },
                {
                    name: "isSkeleton = true",
                    why: "The drawer's own first fetch is in flight: identity, title, and body shimmer, and the footer is omitted — there is nothing to act on yet.",
                    code: "<PostModerationDrawer isSkeleton … />",
                    render: (
                        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
                            <PostModerationDrawer
                                isOpen
                                onOpenChange={() => {}}
                                onTogglePin={() => {}}
                                onHide={() => {}}
                                onRemove={() => {}}
                                isSkeleton
                                labels={LABELS}
                            />
                        </div>
                    ),
                },
            ]}
        />
    ),
}

import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Card, CardContent } from "@heroui/react"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Avatar as AvatarAtom } from "@sb-components/atoms/display/Avatar/Avatar"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ⚠️ STATE SCOPE (teacher finalized 2026-07-25): `AsyncContent` is a STATE-
 * TRANSITION SCAFFOLD — its own asset is BRANCH SELECTION (error → loading → empty →
 * content), not the shape of each message. So here every story is ONE branch, and
 * the empty/error branches only take the MINIMAL shape to prove the switch runs
 * correctly; the full set of message variants lives in story `AsyncContentEmpty` /
 * `AsyncContentError`, NOT repeated here.
 *
 * 2026-07-27: di trú toàn bộ leaf sang API `states[]` (§8/§4a).
 */
const meta: Meta<typeof AsyncContent> = {
    title: "Composites/Async/AsyncContent/AsyncContent",
    component: AsyncContent,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AsyncContent>

/**
 * The standard fixture (C-fixture) for EVERY content example: a real Card made of
 * avatar + title + description.
 */
const ProfileCard = () => (
    <Card>
        <CardContent className="flex-row items-center gap-3">
            <Avatar className="size-10 shrink-0">
                <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">StarCi Academy</span>
                <span className="truncate text-xs text-muted">
                    Learn fullstack, system design, and DevOps on an interview-prep roadmap.
                </span>
            </div>
        </CardContent>
    </Card>
)

/**
 * Skeleton MIRROR of ProfileCard — keeps the exact layout tree (Card + CardContent,
 * gap, text column), just swaps each content node for a same-sized
 * `Skeleton.<Piece>`, so the card doesn't jump height when it resolves.
 */
const ProfileCardSkeleton = () => (
    <Card>
        <CardContent className="flex-row items-center gap-3">
            <AvatarAtom isSkeleton size="md" className="shrink-0" />
            <div className="flex min-w-0 grow flex-col">
                <Typography size="sm" isSkeleton className="w-1/3" />
                <Typography size="xs" isSkeleton className="w-2/3" />
            </div>
        </CardContent>
    </Card>
)

const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/**
 * ANATOMY IS PER-LEAF: each branch renders a COMPLETELY DIFFERENT tree, so every
 * story carries its own set of parts. The scaffold draws nothing itself — it only
 * CHOOSES one of the four nodes.
 */
const CONTENT_PARTS: Array<AnatomyNode> = [
    { name: "Content", tier: "composite", role: "The content branch, the node the caller passed in through slot content or children." },
]
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "composite", role: "The loading branch, the skeleton mirror tree the caller passed through slot skeleton." },
]
const EMPTY_PARTS: Array<AnatomyNode> = [
    {
        name: "AsyncContentEmpty",
        tier: "composite",
        role: "The empty branch, built by the scaffold from props emptyContent rather than a node.",
        storyId: "composites-async-asynccontent-asynccontentempty--basic",
    },
]
const ERROR_PARTS: Array<AnatomyNode> = [
    {
        name: "AsyncContentError",
        tier: "composite",
        role: "The error branch, built by the scaffold from props errorContent; it has the highest priority of the four.",
        storyId: "composites-async-asynccontent-asynccontenterror--basic",
    },
]
const SILENT_PARTS: Array<AnatomyNode> = []

/** CONTENT — resolved, has data: `children` is a shortcut for slot `content`. */
export const Content: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent"
                tier="composite"
                leaf="Content"
                parts={CONTENT_PARTS}
                reason="Every async data region needs exactly one place holding SWR's render contract, error, then loading, then empty, then content. Bundling the four branches into one scaffold means no surface rewrites its own if/else chain, and the skeleton always mirrors the real layout instead of a generic spinner."
                states={[
                    {
                        name: "isLoading = false, children set",
                        why: "The resolved ProfileCard renders through children, which is a shortcut for the content branch. The scaffold has already picked the content branch over loading, empty, or error because none of their conditions are true.",
                        code: `<AsyncContent isLoading={false} skeleton={<ProfileCardSkeleton />}>
    <ProfileCard />
</AsyncContent>`,
                        render: (
                            <AsyncContent isLoading={false} skeleton={<ProfileCardSkeleton />} showAnatomy>
                                <ProfileCard />
                            </AsyncContent>
                        ),
                    },
                ]}
            />,
        ),
}

/** CONTENT (named slot) — `content` is the MAIN path of the scaffold tier; wins over `children`. */
export const ContentSlot: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent"
                tier="composite"
                leaf="ContentSlot"
                parts={CONTENT_PARTS}
                states={[
                    {
                        name: "isLoading = false, content set (named slot, not children)",
                        why: "The same ProfileCard renders, but this time through the named slot content instead of the children shortcut. §13b treats a wrapping scaffold's named slot as the main path, so content wins whenever both content and children are present.",
                        code: `<AsyncContent
    isLoading={false}
    skeleton={<ProfileCardSkeleton />}
    content={<ProfileCard />}
/>`,
                        render: (
                            <AsyncContent
                                isLoading={false}
                                skeleton={<ProfileCardSkeleton />}
                                content={<ProfileCard />}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/** LOADING — first load: the scaffold switches to the skeleton mirror tree, no height collapse. */
export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent"
                tier="composite"
                leaf="Loading"
                parts={LOADING_PARTS}
                states={[
                    {
                        name: "isLoading = true",
                        why: "The scaffold renders exactly the skeleton node instead of children, swapping every content piece for a same-sized shimmer. The composition differs from the content leaf on purpose, a mirror tree rather than the real card, so the layout never collapses while data is still in flight.",
                        code: `<AsyncContent isLoading skeleton={<ProfileCardSkeleton />}>
    <ProfileCard />
</AsyncContent>`,
                        render: (
                            <AsyncContent isLoading skeleton={<ProfileCardSkeleton />} showAnatomy>
                                <ProfileCard />
                            </AsyncContent>
                        ),
                    },
                ]}
            />,
        ),
}

/** EMPTY — load finished but empty: `emptyContent` takes PROPS (not a node). */
export const Empty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent"
                tier="composite"
                leaf="Empty"
                parts={EMPTY_PARTS}
                states={[
                    {
                        name: "isEmpty = true, emptyContent = { title, description }",
                        why: "The scaffold builds an AsyncContentEmpty node from the emptyContent props rather than rendering a node the caller passed in. This minimal title-plus-description shape is only enough to prove the switch lands on the empty branch, the full set of empty message variants lives in the AsyncContentEmpty story instead of here.",
                        code: `<AsyncContent
    isLoading={false}
    isEmpty
    emptyContent={{ title: "Chưa có nội dung", description: "Khi có bài học liên quan, chúng sẽ hiện ở đây." }}
    skeleton={<ProfileCardSkeleton />}
>
    <ProfileCard />
</AsyncContent>`,
                        render: (
                            <AsyncContent
                                isLoading={false}
                                isEmpty
                                emptyContent={{
                                    title: "Chưa có nội dung",
                                    description: "Khi có bài học liên quan, chúng sẽ hiện ở đây.",
                                }}
                                skeleton={<ProfileCardSkeleton />}
                                showAnatomy
                            >
                                <ProfileCard />
                            </AsyncContent>
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * SILENT EMPTY — `isEmpty` but `emptyContent` is NOT passed: the scaffold renders
 * null, the section hides itself. This is a SEPARATE branch of the switch, not a message variant.
 */
export const EmptySilent: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent"
                tier="composite"
                leaf="EmptySilent"
                parts={SILENT_PARTS}
                states={[
                    {
                        name: "isEmpty = true, emptyContent not passed",
                        why: "No node renders at all, the parts tree is empty because the scaffold has nothing to build an AsyncContentEmpty from. Use this branch when a section must vanish entirely rather than show any message, this is a separate branch of the switch, not a smaller variant of the message leaf above.",
                        code: `<AsyncContent isLoading={false} isEmpty skeleton={<ProfileCardSkeleton />}>
    <ProfileCard />
</AsyncContent>`,
                        render: (
                            <AsyncContent isLoading={false} isEmpty skeleton={<ProfileCardSkeleton />} showAnatomy>
                                <ProfileCard />
                            </AsyncContent>
                        ),
                    },
                ]}
            />,
        ),
}

/** ERROR — HIGHEST priority, beats even loading; `errorContent` also takes PROPS. */
export const Error: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent"
                tier="composite"
                leaf="Error"
                parts={ERROR_PARTS}
                states={[
                    {
                        name: "error set, errorContent = { title, onRetry, retryLabel }, isLoading = true",
                        why: "The error branch renders even though isLoading is still true, because a real error and a real errorContent together outrank every other branch, including loading. Without errorContent the error branch would not activate at all and the scaffold would fall through to loading instead, so both error and errorContent must be present together.",
                        code: `<AsyncContent
    isLoading
    error={new Error("network")}
    errorContent={{ title: "Không tải được nội dung", onRetry: () => {}, retryLabel: "Thử lại" }}
    skeleton={<ProfileCardSkeleton />}
>
    <ProfileCard />
</AsyncContent>`,
                        render: (
                            <AsyncContent
                                isLoading
                                error={new globalThis.Error("network")}
                                errorContent={{
                                    title: "Không tải được nội dung",
                                    description: "Kiểm tra kết nối rồi thử lại.",
                                    onRetry: () => {},
                                    retryLabel: "Thử lại",
                                }}
                                skeleton={<ProfileCardSkeleton />}
                                showAnatomy
                            >
                                <ProfileCard />
                            </AsyncContent>
                        ),
                    },
                ]}
            />,
        ),
}

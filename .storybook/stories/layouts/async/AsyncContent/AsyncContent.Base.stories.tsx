import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Card, CardContent } from "@heroui/react"
import { AsyncContent } from "@sb-components/layouts/async/AsyncContent/AsyncContent"
import { Avatar as AvatarAtom } from "@sb-components/atoms/display/Avatar/Avatar"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ⚠️ STATE SCOPE (teacher finalized 2026-07-25): `AsyncContent.Base` is a STATE-
 * TRANSITION SCAFFOLD — its own asset is BRANCH SELECTION (error → loading → empty →
 * content), not the shape of each message. So here every story is ONE branch, and
 * the empty/error branches only take the MINIMAL shape to prove the switch runs
 * correctly; the full set of message variants lives in story `AsyncContent.Empty` /
 * `AsyncContent.Error`, NOT repeated here.
 */
const meta: Meta<typeof AsyncContent.Base> = {
    title: "Layouts/Async/AsyncContent/AsyncContent.Base",
    component: AsyncContent.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AsyncContent.Base>

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
            <AvatarAtom.Base isSkeleton size="md" className="shrink-0" />
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
    { name: "Content", tier: "primitive", role: "content branch — the node the caller passes in (slot `content` / `children`)" },
]
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "primitive", role: "loading branch — the skeleton mirror tree the caller passes via slot `skeleton`" },
]
const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "AsyncContent.Empty", tier: "primitive", role: "empty branch — the scaffold builds it from PROPS `emptyContent`, not a node" },
]
const ERROR_PARTS: Array<AnatomyNode> = [
    { name: "AsyncContent.Error", tier: "primitive", role: "error branch — the scaffold builds it from PROPS `errorContent`; highest priority" },
]
const SILENT_PARTS: Array<AnatomyNode> = []

/** CONTENT — resolved, has data: `children` is a shortcut for slot `content`. */
export const Content: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="Content"
                parts={CONTENT_PARTS}
                reason="Every async data region needs EXACTLY ONE place holding SWR's render contract: error → loading → empty → content. Bundling the four branches into one scaffold means no surface rewrites its own if/else chain, and the skeleton always mirrors the real layout instead of a generic spinner."
                code={`<AsyncContent.Base isLoading={false} skeleton={<ProfileCardSkeleton />}>
  <ProfileCard />
</AsyncContent.Base>`}
            >
                <AsyncContent.Base isLoading={false} skeleton={<ProfileCardSkeleton />} showAnatomy>
                    <ProfileCard />
                </AsyncContent.Base>
            </BlockAnatomy>,
        ),
}

/** CONTENT (named slot) — `content` is the MAIN path of the scaffold tier; wins over `children`. */
export const ContentSlot: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="ContentSlot"
                parts={CONTENT_PARTS}
                note="Same content branch but goes through the NAMED slot `content` instead of `children` — §13b: the wrapping scaffold treats the named slot as the main path, `children` is just a shortcut."
                code={`<AsyncContent.Base
  isLoading={false}
  skeleton={<ProfileCardSkeleton />}
  content={<ProfileCard />}
/>`}
            >
                <AsyncContent.Base
                    isLoading={false}
                    skeleton={<ProfileCardSkeleton />}
                    content={<ProfileCard />}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** LOADING — first load: the scaffold switches to the skeleton mirror tree, no height collapse. */
export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="Loading"
                parts={LOADING_PARTS}
                note="`isLoading` → the scaffold renders exactly the `skeleton` node; composition differs from the content leaf (mirror instead of the real card)."
                code={`<AsyncContent.Base isLoading skeleton={<ProfileCardSkeleton />}>
  <ProfileCard />
</AsyncContent.Base>`}
            >
                <AsyncContent.Base isLoading skeleton={<ProfileCardSkeleton />} showAnatomy>
                    <ProfileCard />
                </AsyncContent.Base>
            </BlockAnatomy>,
        ),
}

/** EMPTY — load finished but empty: `emptyContent` takes PROPS (not a node). */
export const Empty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="`isEmpty` → the scaffold builds `AsyncContent.Empty` FROM PROPS. The minimal shape (title + description) is enough to see the switch run — button/icon variants live in story AsyncContent.Empty."
                code={`<AsyncContent.Base
  isLoading={false}
  isEmpty
  emptyContent={{ title: "Chưa có nội dung", description: "Khi có bài học liên quan, chúng sẽ hiện ở đây." }}
  skeleton={<ProfileCardSkeleton />}
>
  <ProfileCard />
</AsyncContent.Base>`}
            >
                <AsyncContent.Base
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
                </AsyncContent.Base>
            </BlockAnatomy>,
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
                name="AsyncContent.Base"
                tier="primitive"
                leaf="EmptySilent"
                parts={SILENT_PARTS}
                note="Empty but `emptyContent` left blank → NO node renders (empty parts tree). Use when a section must vanish entirely instead of showing a message."
                code={`<AsyncContent.Base isLoading={false} isEmpty skeleton={<ProfileCardSkeleton />}>
  <ProfileCard />
</AsyncContent.Base>`}
            >
                <AsyncContent.Base isLoading={false} isEmpty skeleton={<ProfileCardSkeleton />} showAnatomy>
                    <ProfileCard />
                </AsyncContent.Base>
            </BlockAnatomy>,
        ),
}

/** ERROR — HIGHEST priority, beats even loading; `errorContent` also takes PROPS. */
export const Error: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Base"
                tier="primitive"
                leaf="Error"
                parts={ERROR_PARTS}
                note="`error` truthy + `errorContent` present → the scaffold skips even `isLoading` (still on here) to render the error branch. ⚠️ Without `errorContent` the error branch does NOT activate — the scaffold falls through to loading."
                code={`<AsyncContent.Base
  isLoading
  error={new Error("network")}
  errorContent={{ title: "Không tải được nội dung", onRetry: () => {}, retryLabel: "Thử lại" }}
  skeleton={<ProfileCardSkeleton />}
>
  <ProfileCard />
</AsyncContent.Base>`}
            >
                <AsyncContent.Base
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
                </AsyncContent.Base>
            </BlockAnatomy>,
        ),
}

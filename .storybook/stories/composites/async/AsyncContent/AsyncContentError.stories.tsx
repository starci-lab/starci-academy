import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { ArrowClockwiseIcon, WifiSlashIcon } from "@phosphor-icons/react"
import { AsyncContentError } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * ⚠️ STATE SCOPE (decided 2026-07-25): `AsyncContentError` is the ERROR MESSAGE
 * FRAME — the same slot set as `.Empty` but with `tone="danger"`. State here comes
 * from TOGGLING its own slots (description · action · icon). Branch priority
 * (error wins over loading) is a state of `AsyncContent`, NOT repeated here.
 *
 * ANATOMY IS PER-LEAF: each story is its own leaf, carrying its own parts tree.
 */
const meta: Meta<typeof AsyncContentError> = {
    title: "Composites/Async/AsyncContent/AsyncContentError",
    component: AsyncContentError,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof AsyncContentError>
/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>
// A THIN layer over the `FeedbackEmpty` composite (tone danger). The warning
// icon/title/description are VALUES passed into props so they're NOT split into
// nodes; only `action` is a node that gets composed in.
const MESSAGE_PARTS: Array<AnatomyNode> = [
    {
        name: "FeedbackEmpty",
        tier: "composite",
        role: "centered frame for the error state",
        state: "danger",
        storyId: "composites-feedback-feedback-feedbackempty--title-only",
    },
]
const RETRY_PARTS: Array<AnatomyNode> = [
    {
        name: "FeedbackEmpty",
        tier: "composite",
        role: "centered frame for the error state",
        state: "danger",
        storyId: "composites-feedback-feedback-feedbackempty--title-only",
        children: [
            { name: "Button", tier: "atom", role: "shorthand onRetry + retryLabel → retry button in the action slot", state: "secondary", storyId: "atoms-buttons-button-button--default" },
        ],
    },
]
const ACTION_PARTS: Array<AnatomyNode> = [
    {
        name: "FeedbackEmpty",
        tier: "composite",
        role: "centered frame for the error state",
        state: "danger",
        storyId: "composites-feedback-feedback-feedbackempty--title-only",
        children: [
            { name: "Action", tier: "composite", role: "the general-purpose action slot, holding whatever node the caller passes" },
        ],
    },
]
/** BASIC — title only: default warning icon + title, no description, no button. */
export const Basic: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContentError"
                tier="composite"
                leaf="Basic"
                parts={MESSAGE_PARTS}
                reason={"The error state of an async data region needs exactly the anatomy of `FeedbackEmpty tone=\"danger\"` (warning icon, title, description, centered action). AsyncContentError only adds a default WarningIcon and wraps onRetry/retryLabel into the action slot, staying a thin layer over FeedbackEmpty rather than redrawing anything."}
                states={[
                    {
                        name: "description unset, onRetry unset, action unset",
                        why: "Only the default warning icon and the title render, since neither the description slot nor the action slot has anything to show. This is the leanest error message, used when the title alone already says what went wrong.",
                        code: `<AsyncContentError
  title="Đã có lỗi xảy ra"
/>`,
                        render: <AsyncContentError title="Đã có lỗi xảy ra" showAnatomy />,
                    },
                ]}
            />,
        ),
}
/** WITH DESCRIPTION — turns on the `description` slot: adds a muted line stating the cause/what to do. */
export const WithDescription: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContentError"
                tier="composite"
                leaf="WithDescription"
                parts={MESSAGE_PARTS}
                states={[
                    {
                        name: "description set, onRetry unset, action unset",
                        why: "A muted description line appears under the title while the action slot stays empty, so there is still no button to press. This is the shape a caller reaches for when the title alone doesn't say enough about the cause or what to do next.",
                        code: `<AsyncContentError
  title="Không tải được dữ liệu"
  description="Máy chủ tạm thời không phản hồi. Vui lòng thử lại sau."
/>`,
                        render: (
                            <AsyncContentError
                                title="Không tải được dữ liệu"
                                description="Máy chủ tạm thời không phản hồi. Vui lòng thử lại sau."
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}
/** WITH RETRY — the `onRetry` + `retryLabel` shorthand wraps itself into a Button in the action slot. */
export const WithRetry: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContentError"
                tier="composite"
                leaf="WithRetry"
                parts={RETRY_PARTS}
                states={[
                    {
                        name: "onRetry set, retryLabel set",
                        why: "The frame itself builds a secondary, size-sm Button for the action slot from the onRetry and retryLabel pair, so the caller never constructs the button by hand. Missing either prop leaves the action slot empty instead, which is the shape several real sources currently fall into.",
                        code: `<AsyncContentError
  title="Không tải được dữ liệu"
  description="Đã có lỗi xảy ra khi tải nội dung."
  onRetry={() => {}}
  retryLabel="Thử lại"
/>`,
                        render: (
                            <AsyncContentError
                                title="Không tải được dữ liệu"
                                description="Đã có lỗi xảy ra khi tải nội dung."
                                onRetry={() => {}}
                                retryLabel="Thử lại"
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}
/** WITH ACTION — the general-purpose `action` slot: any node, WINS over the retry shorthand. */
export const WithAction: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContentError"
                tier="composite"
                leaf="WithAction"
                parts={ACTION_PARTS}
                states={[
                    {
                        name: "action set to a custom node",
                        why: "The caller's node fills the action slot directly and wins over the onRetry/retryLabel shorthand, so a bespoke button (reload the page, contact support) can stand where a plain retry button would otherwise go. Reach for this whenever the way out of the error isn't a plain retry.",
                        code: `<AsyncContentError
  title="Phiên làm việc đã hết hạn"
  description="Đăng nhập lại để tiếp tục."
  action={<Button size="sm" variant="secondary" icon={<ArrowClockwiseIcon />}>Tải lại trang</Button>}
/>`,
                        render: (
                            <AsyncContentError
                                title="Phiên làm việc đã hết hạn"
                                description="Đăng nhập lại để tiếp tục."
                                action={<Button size="sm" variant="secondary" icon={<ArrowClockwiseIcon />}>Tải lại trang</Button>}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}
/** CUSTOM ICON — overrides the `icon` slot; the remaining slots keep their full shape. */
export const CustomIcon: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContentError"
                tier="composite"
                leaf="CustomIcon"
                parts={RETRY_PARTS}
                states={[
                    {
                        name: "icon set to WifiSlashIcon",
                        why: "The caller's icon replaces the default warning glyph while the description and retry button keep their full shape from WithRetry, since icon is a prop value rather than a node the parts tree needs to account for. Swap in a more specific glyph like this when the cause of the error is known, a dropped network connection here rather than a generic failure.",
                        code: `<AsyncContentError
  icon={<WifiSlashIcon weight="duotone" />}
  title="Mất kết nối mạng"
  description="Kiểm tra kết nối rồi thử lại."
  onRetry={() => {}}
  retryLabel="Thử lại"
/>`,
                        render: (
                            <AsyncContentError
                                icon={WifiSlashIcon}
                                title="Mất kết nối mạng"
                                description="Kiểm tra kết nối rồi thử lại."
                                onRetry={() => {}}
                                retryLabel="Thử lại"
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}
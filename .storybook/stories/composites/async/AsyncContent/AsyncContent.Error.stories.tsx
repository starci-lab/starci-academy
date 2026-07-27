import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { ArrowClockwiseIcon, WifiSlashIcon } from "@phosphor-icons/react"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (decided 2026-07-25): `AsyncContent.Error` is the ERROR MESSAGE
 * FRAME — the same slot set as `.Empty` but with `tone="danger"`. State here comes
 * from TOGGLING its own slots (description · action · icon). Branch priority
 * (error wins over loading) is a state of `AsyncContent.Base`, NOT repeated here.
 *
 * ANATOMY IS PER-LEAF: each story is its own leaf, carrying its own parts tree.
 */
const meta: Meta<typeof AsyncContent.Error> = {
    title: "Composites/Async/AsyncContent/AsyncContent.Error",
    component: AsyncContent.Error,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AsyncContent.Error>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// A THIN layer over the `Feedback.Empty` primitive (tone danger). The warning
// icon/title/description are VALUES passed into props so they're NOT split into
// nodes; only `action` is a node that gets composed in.
const MESSAGE_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "composite",
        role: "centered frame for the error state",
        state: "danger",
    },
]
const RETRY_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "composite",
        role: "centered frame for the error state",
        state: "danger",
        children: [
            { name: "Button", tier: "composite", role: "shorthand onRetry + retryLabel → retry button in the action slot", state: "secondary" },
        ],
    },
]
const ACTION_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "composite",
        role: "centered frame for the error state",
        state: "danger",
        children: [
            { name: "Action", tier: "composite", role: "general-purpose action slot — any node the caller passes" },
        ],
    },
]

/** BASIC — title only: default warning icon + title, no description, no button. */
export const Basic: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContent.Error"
                tier="composite"
                leaf="Basic"
                parts={MESSAGE_PARTS}
                reason={"The error state of an async data region needs exactly the anatomy of Feedback.Empty tone=\"danger\" (warning icon + title + description + centered action). AsyncContent.Error only adds a default WarningIcon and wraps onRetry/retryLabel into the action slot — a thin layer over Feedback.Empty, it doesn't redraw anything."}
                code={`<AsyncContent.Error
  title="Đã có lỗi xảy ra"
/>`}
            >
                <AsyncContent.Error title="Đã có lỗi xảy ra" showAnatomy />
            </BlockAnatomy>,
        ),
}

/** WITH DESCRIPTION — turns on the `description` slot: adds a muted line stating the cause/what to do. */
export const WithDescription: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContent.Error"
                tier="composite"
                leaf="WithDescription"
                parts={MESSAGE_PARTS}
                note="Adds a muted description line under the title — still no action button."
                code={`<AsyncContent.Error
  title="Không tải được dữ liệu"
  description="Máy chủ tạm thời không phản hồi. Vui lòng thử lại sau."
/>`}
            >
                <AsyncContent.Error
                    title="Không tải được dữ liệu"
                    description="Máy chủ tạm thời không phản hồi. Vui lòng thử lại sau."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** WITH RETRY — the `onRetry` + `retryLabel` shorthand wraps itself into a Button in the action slot. */
export const WithRetry: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContent.Error"
                tier="composite"
                leaf="WithRetry"
                parts={RETRY_PARTS}
                note="onRetry + retryLabel → the frame builds a Button secondary size sm for the action slot ITSELF. Missing either one → no button (several real sources currently fall into this case)."
                code={`<AsyncContent.Error
  title="Không tải được dữ liệu"
  description="Đã có lỗi xảy ra khi tải nội dung."
  onRetry={() => {}}
  retryLabel="Thử lại"
/>`}
            >
                <AsyncContent.Error
                    title="Không tải được dữ liệu"
                    description="Đã có lỗi xảy ra khi tải nội dung."
                    onRetry={() => {}}
                    retryLabel="Thử lại"
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** WITH ACTION — the general-purpose `action` slot: any node, WINS over the retry shorthand. */
export const WithAction: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContent.Error"
                tier="composite"
                leaf="WithAction"
                parts={ACTION_PARTS}
                note="When an error needs an action that isn't just a plain 'retry' (reload the page, contact support…), pass a node straight through `action` — it wins over the onRetry/retryLabel pair."
                code={`<AsyncContent.Error
  title="Phiên làm việc đã hết hạn"
  description="Đăng nhập lại để tiếp tục."
  action={<Button size="sm" variant="secondary" icon={<ArrowClockwiseIcon />}>Tải lại trang</Button>}
/>`}
            >
                <AsyncContent.Error
                    title="Phiên làm việc đã hết hạn"
                    description="Đăng nhập lại để tiếp tục."
                    action={<Button size="sm" variant="secondary" icon={<ArrowClockwiseIcon />}>Tải lại trang</Button>}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** CUSTOM ICON — overrides the `icon` slot; the remaining slots keep their full shape. */
export const CustomIcon: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="AsyncContent.Error"
                tier="composite"
                leaf="CustomIcon"
                parts={RETRY_PARTS}
                note="Same full shape (description + retry button), only swaps the default icon for the one the caller passes in — the icon is a prop value so the parts tree doesn't change."
                code={`<AsyncContent.Error
  icon={<WifiSlashIcon weight="duotone" />}
  title="Mất kết nối mạng"
  description="Kiểm tra kết nối rồi thử lại."
  onRetry={() => {}}
  retryLabel="Thử lại"
/>`}
            >
                <AsyncContent.Error
                    icon={WifiSlashIcon}
                    title="Mất kết nối mạng"
                    description="Kiểm tra kết nối rồi thử lại."
                    onRetry={() => {}}
                    retryLabel="Thử lại"
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

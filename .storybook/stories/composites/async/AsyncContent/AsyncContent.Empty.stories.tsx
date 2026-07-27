import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher's call 2026-07-25): `AsyncContent.Empty` is the EMPTY
 * MESSAGE FRAME — its own asset is the message SLOTS (icon · title · description ·
 * action). So every state here originates from TOGGLING its own slots. The
 * question of "when does the empty branch get picked" is a state of
 * `AsyncContent.Base`, and is NOT repeated here.
 *
 * ANATOMY IS PER-LEAF: each story is its own leaf, carrying its own parts tree.
 */
const meta: Meta<typeof AsyncContent.Empty> = {
    title: "Composites/Async/AsyncContent/AsyncContent.Empty",
    component: AsyncContent.Empty,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AsyncContent.Empty>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// This frame is a THIN layer over the `Feedback.Empty` primitive. Icon/title/description
// are VALUES passed into Feedback.Empty's props, so they don't split into separate
// nodes — only `action` is a node that gets COMPOSED in, so it only shows up in the
// tree of the leaf that has a button.
const MESSAGE_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "composite",
        role: "icon + title + description + action frame, centered",
    },
]
const RETRY_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "composite",
        role: "icon + title + description + action frame, centered",
        children: [
            { name: "Button", tier: "composite", role: "shorthand onRetry + retryLabel → button placed in the action slot", state: "secondary" },
        ],
    },
]
const ACTION_PARTS: Array<AnatomyNode> = [
    {
        name: "Feedback.Empty",
        tier: "composite",
        role: "icon + title + description + action frame, centered",
        children: [
            { name: "Action", tier: "composite", role: "general-purpose action slot — any node the caller passes in" },
        ],
    },
]

/** BASIC — title only: the most compact shape (default icon + title). */
export const Basic: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Empty"
                tier="composite"
                leaf="Basic"
                parts={MESSAGE_PARTS}
                reason="The empty state of an async data area needs the exact anatomy of Feedback.Empty (icon + title + description + centered action). AsyncContent.Empty only adds a default TrayIcon and wraps onRetry/retryLabel into a button for the action slot — a thin layer over Feedback.Empty, it doesn't redraw anything."
                code={`<AsyncContent.Empty
  title="Chưa có dữ liệu"
/>`}
            >
                <AsyncContent.Empty title="Chưa có dữ liệu" showAnatomy />
            </BlockAnatomy>,
        ),
}

/** WITH DESCRIPTION — turns on the `description` slot: adds a muted line under the title. */
export const WithDescription: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Empty"
                tier="composite"
                leaf="WithDescription"
                parts={MESSAGE_PARTS}
                note="Adds a description line under the title — unlike leaf 'Basic' (that leaf has no description line)."
                code={`<AsyncContent.Empty
  title="Danh sách trống"
  description="Bạn chưa lưu mục nào vào danh sách này."
/>`}
            >
                <AsyncContent.Empty
                    title="Danh sách trống"
                    description="Bạn chưa lưu mục nào vào danh sách này."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** WITH RETRY — shorthand `onRetry` + `retryLabel` auto-wraps into a Button in the action slot. */
export const WithRetry: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Empty"
                tier="composite"
                leaf="WithRetry"
                parts={RETRY_PARTS}
                note="onRetry + retryLabel → the frame builds a secondary size-sm Button ITSELF for the action slot (a different composition from the button-less leaves). Missing either one → no button."
                code={`<AsyncContent.Empty
  title="Không tìm thấy kết quả"
  description="Thử đổi bộ lọc hoặc tải lại để xem thêm."
  onRetry={() => {}}
  retryLabel="Tải lại"
/>`}
            >
                <AsyncContent.Empty
                    title="Không tìm thấy kết quả"
                    description="Thử đổi bộ lọc hoặc tải lại để xem thêm."
                    onRetry={() => {}}
                    retryLabel="Tải lại"
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** WITH ACTION — the general-purpose `action` slot: any node, WINS over the retry shorthand. */
export const WithAction: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Empty"
                tier="composite"
                leaf="WithAction"
                parts={ACTION_PARTS}
                note="When the thing to do isn't 'retry' (create new, open a guide…), pass the node straight through `action` — it wins over the onRetry/retryLabel pair."
                code={`<AsyncContent.Empty
  title="Chưa có bộ thẻ nào"
  description="Tạo bộ thẻ đầu tiên để bắt đầu ôn tập."
  action={<Button size="sm" icon={<PlusIcon />}>Tạo bộ thẻ</Button>}
/>`}
            >
                <AsyncContent.Empty
                    title="Chưa có bộ thẻ nào"
                    description="Tạo bộ thẻ đầu tiên để bắt đầu ôn tập."
                    action={<Button size="sm" icon={<PlusIcon />}>Tạo bộ thẻ</Button>}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** CUSTOM ICON — overrides the `icon` slot; the rest of the shape matches leaf WithDescription. */
export const CustomIcon: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="AsyncContent.Empty"
                tier="composite"
                leaf="CustomIcon"
                parts={MESSAGE_PARTS}
                note="Overrides the default icon (TrayIcon → MagnifyingGlassIcon). Icon is a VALUE passed into Feedback.Empty so the parts tree doesn't change."
                code={`<AsyncContent.Empty
  icon={<MagnifyingGlassIcon weight="duotone" />}
  title="Không có kết quả khớp"
  description="Không có mục nào khớp với từ khoá bạn nhập."
/>`}
            >
                <AsyncContent.Empty
                    icon={MagnifyingGlassIcon}
                    title="Không có kết quả khớp"
                    description="Không có mục nào khớp với từ khoá bạn nhập."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

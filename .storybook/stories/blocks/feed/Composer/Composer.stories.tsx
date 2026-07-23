import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import type { ReactNode } from "react"
import { Button } from "@heroui/react"
import { PaperclipIcon } from "@phosphor-icons/react"
import { Composer } from "./Composer"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — a controlled message-input ROW (avatar + auto-growing field + Send),
 * shared by every surface that takes a draft (chat, comment, reply). The block
 * owns the can-submit + auto-grow + Ctrl/Cmd+Enter logic; the feature only holds
 * the draft string.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof Composer> = {
    title: "Block/Feed/Composer",
    component: Composer,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Composer>

/** Frame each leaf's anatomy panel with breathing room. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

const avatarSrc = "https://i.pravatar.cc/80?img=12"

/** Wrapper owning the draft's local state — the controlled flow. */
const Controlled = ({
    initialValue,
    isSubmitting,
    attachSlot,
}: {
    initialValue: string
    isSubmitting?: boolean
    attachSlot?: ReactNode
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <div className="w-[32rem]">
            <Composer
                value={value}
                onChange={setValue}
                onSubmit={() => setValue("")}
                placeholder="Send the teaching assistant a message..."
                avatarSrc={avatarSrc}
                isSubmitting={isSubmitting}
                attachSlot={attachSlot}
            />
        </div>
    )
}

// Base row (no attach slot): avatar + auto-grow field + a trailing actions
// cluster (`div.flex.shrink-0`) that wraps only the Send button. Shared by the
// empty draft and the in-flight submit — same parts, only the Send inner state
// (icon → Spinner) differs, which stays folded into the Send button's role.
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar người soạn ở đầu hàng (tuỳ chọn)" },
    { name: "TextField · TextArea", tier: "primitive", role: "ô nhập tự giãn cao (HeroUI field)" },
    {
        name: "div · actions",
        tier: "primitive",
        role: "cụm hành động cuối hàng (attach tuỳ chọn + Send)",
        children: [
            { name: "Button", tier: "primitive", role: "nút Send + spinner khi đang gửi" },
        ],
    },
]

// Typing row: the feature drops an attach slot INTO the actions cluster, BEFORE
// Send → the cluster now nests two buttons (attach, then Send).
const TYPING_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar người soạn ở đầu hàng (tuỳ chọn)" },
    { name: "TextField · TextArea", tier: "primitive", role: "ô nhập tự giãn cao (HeroUI field)" },
    {
        name: "div · actions",
        tier: "primitive",
        role: "cụm hành động cuối hàng (attach tuỳ chọn + Send)",
        children: [
            { name: "Button · Attach", tier: "primitive", role: "nút đính kèm feature cấp (attach slot)" },
            { name: "Button", tier: "primitive", role: "nút Send + spinner khi đang gửi" },
        ],
    },
]

export const Empty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Composer"
                tier="block"
                leaf="Rỗng"
                parts={BASE_PARTS}
                reason="Một hàng nhập tin nhắn dùng chung cho mọi surface (chat, bình luận, trả lời): avatar + ô tự giãn + Send. Gói logic can-submit + auto-grow + phím tắt Ctrl/Cmd+Enter vào một block controlled, feature chỉ giữ draft."
            >
                <Controlled initialValue="" />
            </BlockAnatomy>,
        ),
}

export const Typing: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Composer"
                tier="block"
                leaf="Đang soạn"
                parts={TYPING_PARTS}
                note="Feature cấp attach slot → thêm một Button trước Send; draft có chữ nên Send bật."
            >
                <Controlled
                    initialValue={"I have a question about the data denormalization part of this week's lesson.\nI'm not sure when I should split the table out."}
                    attachSlot={(
                        <Button size="sm" variant="tertiary" isIconOnly aria-label="Attach">
                            <PaperclipIcon aria-hidden focusable="false" className="size-4" />
                        </Button>
                    )}
                />
            </BlockAnatomy>,
        ),
}

export const Submitting: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="Composer"
                tier="block"
                leaf="Đang gửi"
                parts={BASE_PARTS}
                note="Submit đang bay → Send đổi icon sang Spinner và khoá; CÙNG composition với leaf 'Rỗng' (không attach)."
            >
                <Controlled initialValue="I'll send this question, thank you." isSubmitting />
            </BlockAnatomy>,
        ),
}

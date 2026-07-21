import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import type { ReactNode } from "react"
import { Button } from "@heroui/react"
import { PaperclipIcon } from "@phosphor-icons/react"
import { Composer } from "./Composer"
import { blockShell } from "../../../block-anatomy"

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

const ANATOMY = {
    primitives: [
        { name: "UserAvatar", role: "avatar người soạn ở đầu hàng (tuỳ chọn)" },
        { name: "TextArea", role: "ô nhập tự giãn cao (HeroUI field)" },
        { name: "Button", role: "nút Send + spinner khi đang gửi" },
    ],
    reason:
        "Một hàng nhập tin nhắn dùng chung cho mọi surface (chat, bình luận, trả lời): avatar + ô tự giãn + Send. Gói logic can-submit + auto-grow + phím tắt Ctrl/Cmd+Enter vào một block controlled, feature chỉ giữ draft.",
}

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

export const Empty: Story = {
    render: () => blockShell(<Controlled initialValue="" />, ANATOMY),
}

export const Typing: Story = {
    render: () =>
        blockShell(
            <Controlled
                initialValue={"I have a question about the data denormalization part of this week's lesson.\nI'm not sure when I should split the table out."}
                attachSlot={(
                    <Button size="sm" variant="tertiary" isIconOnly aria-label="Attach">
                        <PaperclipIcon aria-hidden focusable="false" className="size-4" />
                    </Button>
                )}
            />,
            ANATOMY,
        ),
}

export const Submitting: Story = {
    render: () => blockShell(<Controlled initialValue="I'll send this question, thank you." isSubmitting />, ANATOMY),
}

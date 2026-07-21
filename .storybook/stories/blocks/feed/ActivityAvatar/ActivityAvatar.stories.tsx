import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import {
    BookOpenIcon,
    ChatCircleIcon,
    FlagIcon,
    GraduationCapIcon,
    SparkleIcon,
    UserPlusIcon,
} from "@phosphor-icons/react"
import { ActivityAvatar } from "./ActivityAvatar"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ActivityAvatar> = {
    title: "Block/Feed/ActivityAvatar",
    component: ActivityAvatar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ActivityAvatar>

const ANATOMY = {
    primitives: [
        { name: "UserAvatar", role: "avatar nền (ảnh thật / sinh sẵn theo username)" },
    ],
    reason:
        "Một hàng feed cần avatar CÓ dấu hiệu loại hoạt động ngay trên avatar. Gói UserAvatar + badge icon vào một block để mọi loại event (follow, milestone, comment) dùng chung một khung avatar-kèm-badge, feature chỉ đổi icon.",
}

export const WithPhoto: Story = {
    render: () =>
        blockShell(
            <ActivityAvatar
                username="minhanh_dev"
                avatar="https://i.pravatar.cc/150?img=12"
                icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
            />,
            ANATOMY,
        ),
}

export const GeneratedFallback: Story = {
    render: () =>
        blockShell(
            <ActivityAvatar
                username="quochuy_backend"
                avatar={null}
                icon={<GraduationCapIcon aria-hidden focusable="false" weight="bold" />}
            />,
            ANATOMY,
        ),
}

export const ActivityIconTypes: Story = {
    render: () =>
        blockShell(
            <div className="flex items-center gap-6">
                <ActivityAvatar
                    username="thuha_ux"
                    avatar="https://i.pravatar.cc/150?img=45"
                    icon={<BookOpenIcon aria-hidden focusable="false" weight="bold" />}
                />
                <ActivityAvatar
                    username="quochuy_backend"
                    avatar="https://i.pravatar.cc/150?img=33"
                    icon={<FlagIcon aria-hidden focusable="false" weight="bold" />}
                />
                <ActivityAvatar
                    username="lananh_pham"
                    avatar={null}
                    icon={<SparkleIcon aria-hidden focusable="false" weight="bold" />}
                />
                <ActivityAvatar
                    username="minhanh_dev"
                    avatar="https://i.pravatar.cc/150?img=12"
                    icon={<ChatCircleIcon aria-hidden focusable="false" weight="bold" />}
                />
            </div>,
            ANATOMY,
        ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { EntityLink } from "./EntityLink"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof EntityLink> = {
    title: "Block/Feed/EntityLink",
    component: EntityLink,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof EntityLink>

const ANATOMY = {
    primitives: [
        { name: "Link", role: "phần chữ đậm bấm được (HeroUI Link)" },
    ],
    reason:
        "Mỗi mốc thực thể (người, bài học, thử thách, khóa học) trong câu activity của feed cần một cách hiển thị nhất quán: chữ đậm + gạch chân khi hover nếu resolve được route, chữ đậm thường nếu không — không bao giờ là link chết. Đây gần như một PRIMITIVE một-phần-tử (xem FLAGS).",
}

export const Clickable: Story = {
    render: () =>
        blockShell(
            <span>
                <EntityLink label="quochuy_backend" onPress={() => {}} />
                {" "}đã hoàn thành thử thách{" "}
                <EntityLink label="Xử lý luồng bất đồng bộ" onPress={() => {}} />
            </span>,
            ANATOMY,
        ),
}

export const NotClickable: Story = {
    render: () =>
        blockShell(
            <span>
                <EntityLink label="minhanh_dev" onPress={() => {}} />
                {" "}đã theo dõi{" "}
                <EntityLink label="học viên đã xoá tài khoản" />
            </span>,
            ANATOMY,
        ),
}

export const Pending: Story = {
    render: () =>
        blockShell(
            <span>
                <EntityLink label="thuha_ux" onPress={() => {}} isPending />
                {" "}đã đạt mốc{" "}
                <EntityLink label="Thiết kế hệ thống cho ứng dụng doanh nghiệp" onPress={() => {}} isPending />
            </span>,
            ANATOMY,
        ),
}

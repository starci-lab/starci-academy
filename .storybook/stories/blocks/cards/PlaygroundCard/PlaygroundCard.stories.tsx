import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundCard } from "./PlaygroundCard"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof PlaygroundCard> = {
    title: "Block/Cards/PlaygroundCard",
    component: PlaygroundCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PlaygroundCard>

const ANATOMY = {
    primitives: [
        { name: "IconTile", role: "avatar terminal tô nền accent (size lg)" },
    ],
    reason:
        "Một ô bài thực hành trong lưới hub Playground cần MỘT nhận diện hình ảnh nhất quán (IconTile terminal) + tiêu đề + chip số bước + một CTA vào phòng lab. Gói vào một block để mọi ô trong lưới (Docker/Kubernetes) cùng một khuôn — feature chỉ truyền title/stepCount/onOpen, không dựng lại icon-tile và CTA ở mỗi ô.",
}

export const Default: Story = {
    render: () =>
        blockShell(
            <div className="w-64">
                <PlaygroundCard
                    title="Triển khai container Nginx đầu tiên"
                    stepCount={5}
                    onOpen={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

export const SingleStep: Story = {
    render: () =>
        blockShell(
            <div className="w-64">
                <PlaygroundCard
                    title="Kiểm tra phiên bản Docker"
                    stepCount={1}
                    onOpen={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

export const ManySteps: Story = {
    render: () =>
        blockShell(
            <div className="w-64">
                <PlaygroundCard
                    title="Dựng cluster Kubernetes nhiều node"
                    stepCount={12}
                    onOpen={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

export const LongTitleTruncate: Story = {
    render: () =>
        blockShell(
            <div className="w-64">
                <PlaygroundCard
                    title="Triển khai hệ thống microservices với Docker Compose và Kubernetes trên nhiều môi trường"
                    stepCount={8}
                    onOpen={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { MicroservicesScene } from "./MicroservicesScene"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof MicroservicesScene> = {
    title: "Block/Marketing/MicroservicesScene",
    component: MicroservicesScene,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MicroservicesScene>

const ANATOMY = {
    primitives: [
        { name: "Typography", role: "caption bài học dưới minh hoạ" },
    ],
    reason:
        "Value-prop System Design/DevOps thành hình: một 'mini infra' isometric (pod cubes sau một service, một datastore single-node là điểm nghẽn) vẽ thuần SVG. Topology cố định trong block, chỉ `caption` là prop.",
}

export const NoCaption: Story = {
    render: () =>
        blockShell(
            <div className="max-w-xl">
                <MicroservicesScene />
            </div>,
            ANATOMY,
        ),
}

export const ShortCaption: Story = {
    render: () =>
        blockShell(
            <div className="max-w-xl">
                <MicroservicesScene caption="Một node database duy nhất là điểm nghẽn của toàn hệ thống." />
            </div>,
            ANATOMY,
        ),
}

export const LongCaptionWrap: Story = {
    render: () =>
        blockShell(
            <div className="max-w-[420px]">
                <MicroservicesScene caption="Ba pod chạy song song phía sau service, nhưng cả ba đều ghi vào cùng một Postgres một node — khi lưu lượng tăng, node này nghẽn trước, kéo sập cả cụm dù các pod vẫn khoẻ." />
            </div>,
            ANATOMY,
        ),
}

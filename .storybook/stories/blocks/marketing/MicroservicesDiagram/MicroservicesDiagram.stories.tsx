import type { Meta, StoryObj } from "@storybook/nextjs"
import { MicroservicesDiagram } from "./MicroservicesDiagram"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof MicroservicesDiagram> = {
    title: "Block/Marketing/MicroservicesDiagram",
    component: MicroservicesDiagram,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MicroservicesDiagram>

const ANATOMY = {
    primitives: [
        { name: "Chip", role: "nhãn điểm hỏng (overload/cascade/bottleneck) trôi cạnh tier" },
        { name: "Typography", role: "caption bài học dưới sơ đồ" },
    ],
    reason:
        "Minh hoạ hero bằng code: topology microservices trên nền dot-grid blueprint, node focal accent + các điểm hỏng trôi cạnh vùng chúng đe doạ. Topology + failures là dữ liệu cố định trong block (chỉ `caption` là prop) — kể một câu chuyện 'v2 ngây thơ này sập ở đâu'.",
}

export const WithCaption: Story = {
    render: () =>
        blockShell(
            <div className="max-w-xl">
                <MicroservicesDiagram caption="Một node Postgres, một luồng đồng bộ tới Payment — đây là công thức cho một sự cố dây chuyền." />
            </div>,
            ANATOMY,
        ),
}

export const NoCaption: Story = {
    render: () =>
        blockShell(
            <div className="max-w-xl">
                <MicroservicesDiagram />
            </div>,
            ANATOMY,
        ),
}

export const NarrowWrap: Story = {
    render: () =>
        blockShell(
            <div className="max-w-[320px]">
                <MicroservicesDiagram caption="Trên màn hẹp, các node vẫn giữ đúng thứ tự tier dù phải xuống dòng." />
            </div>,
            ANATOMY,
        ),
}

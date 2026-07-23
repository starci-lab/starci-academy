import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArchitectureFlow } from "./ArchitectureFlow"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ArchitectureFlow> = {
    title: "Design/Marketing/ArchitectureFlow",
    component: ArchitectureFlow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ArchitectureFlow>

const ANATOMY = {
    primitives: [
        { name: "Typography", role: "nhãn node kiểu code (type=code)" },
        { name: "CaretRightIcon", role: "connector nối các node theo hướng luồng" },
    ],
    reason:
        "Minh hoạ một luồng kiến trúc thật (Client → Gateway → Cache → DB) chỉ bằng CSS, không cần ảnh chụp. Gói các hộp node + caret vào một block để feature chỉ truyền mảng tên node — tự wrap khi khung hẹp, dùng lại ở mọi section 'hệ thống bạn xây'.",
}

export const SingleNode: Story = {
    render: () =>
        blockShell(<ArchitectureFlow nodes={["Client"]} />, ANATOMY),
}

export const TypicalFlow: Story = {
    render: () =>
        blockShell(
            <ArchitectureFlow nodes={["Client", "API Gateway", "Cache", "PostgreSQL"]} />,
            ANATOMY,
        ),
}

export const LongLabelsWrap: Story = {
    render: () =>
        blockShell(
            <div className="max-w-[360px]">
                <ArchitectureFlow
                    nodes={[
                        "Client Mobile App",
                        "API Gateway (Kong)",
                        "Redis Cache Cluster",
                        "Kafka Event Bus",
                        "PostgreSQL Primary + Replica",
                    ]}
                />
            </div>,
            ANATOMY,
        ),
}

export const Empty: Story = {
    render: () =>
        blockShell(
            <div className="rounded-md border border-dashed border-default px-4 py-3">
                <ArchitectureFlow nodes={[]} />
            </div>,
            ANATOMY,
        ),
}

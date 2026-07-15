import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArchitectureFlow } from "./index"

const meta: Meta<typeof ArchitectureFlow> = {
    title: "Blocks/Marketing/ArchitectureFlow",
    component: ArchitectureFlow,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ArchitectureFlow>

/** Dùng để minh hoạ luồng hệ thống tiêu biểu mà học viên sẽ tự tay xây dựng trong khóa học. */
export const Default: Story = {
    parameters: { usage: "Dùng để minh hoạ luồng hệ thống tiêu biểu mà học viên sẽ tự tay xây dựng trong khóa học." },
    render: () => <ArchitectureFlow nodes={["Client", "Fanout", "Cache", "DB"]} />,
}

/** Dùng khi cần soi cùng lúc ba tình huống dễ tràn — chuỗi dài, nhãn dài, container hẹp — để đối chiếu hành vi tự xuống dòng. */
export const Overflow: Story = {
    parameters: {
        usage: "Dùng khi cần soi cùng lúc ba tình huống dễ tràn — chuỗi dài, nhãn dài, container hẹp — để đối chiếu hành vi tự xuống dòng.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <span className="text-xs text-muted">Chuỗi dài nhiều tầng</span>
                <ArchitectureFlow
                    nodes={["Client", "Load Balancer", "Gateway", "Fanout Service", "Cache", "Message Queue", "Database", "Object Storage"]}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-xs text-muted">Nhãn node dài</span>
                <ArchitectureFlow
                    nodes={["Authentication Service", "Rate Limiter Middleware", "Notification Dispatcher", "PostgreSQL Primary"]}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-xs text-muted">Container hẹp</span>
                <div className="w-64">
                    <ArchitectureFlow nodes={["Client", "Fanout", "Cache", "DB", "Queue"]} />
                </div>
            </div>
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"

import { ArchitectureScene } from "@/components/blocks/marketing/ArchitectureScene"
import { Gallery, Variant } from "../../../../story-kit"
import { SMALL_DATA } from "./components"

const meta: Meta<typeof ArchitectureScene> = {
    title: "Features/Marketing/ArchitectureScene",
    component: ArchitectureScene,
}

export default meta

type Story = StoryObj<typeof ArchitectureScene>

/**
 * Toàn bộ biến thể dữ liệu của ArchitectureScene: sơ đồ mặc định (JSON đóng gói
 * sẵn trong component) và sơ đồ tuỳ chỉnh qua prop `data`. Dùng để tra khi nào
 * dùng sơ đồ có sẵn và khi nào cần minh hoạ một kiến trúc/sự cố khác.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Sơ đồ mặc định"
                hint="Sơ đồ kiến trúc 3D mặc định của backend StarCi (CQRS/CDC), dùng cho hero của landing page, với dữ liệu JSON đóng gói sẵn trong component."
            >
                <ArchitectureScene caption="Write and read paths decoupled through CDC — the failure it teaches: CDC lag → reading stale data." />
            </Variant>
            <Variant
                label="Sơ đồ tuỳ chỉnh"
                hint="Truyền prop `data` để minh hoạ một kiến trúc/sự cố khác ngoài sơ đồ mặc định — ví dụ một node tone `danger` kèm status báo lỗi."
            >
                <ArchitectureScene data={SMALL_DATA} caption="The load balancer is funneling traffic and overloading the API service." />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ biến thể dữ liệu của ArchitectureScene: sơ đồ mặc định (JSON đóng gói sẵn trong component) " +
            "dùng cho hero landing page, và sơ đồ tuỳ chỉnh qua prop `data` khi cần minh hoạ một kiến trúc/sự cố khác.",
    },
}

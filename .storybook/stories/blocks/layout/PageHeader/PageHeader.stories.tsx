import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Typography } from "@heroui/react"

import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof PageHeader> = {
    title: "Layout/PageHeader",
    component: PageHeader,
}

export default meta

type Story = StoryObj<typeof PageHeader>

/**
 * Toàn bộ ma trận trạng thái của PageHeader: bộ tối thiểu (title + description),
 * bộ đầy đủ (breadcrumb + meta strip), nhánh clamp mô tả dài, và hai scale
 * `size="page"`/`size="compact"`. Dùng để tra khi nào cần breadcrumb/meta, khi
 * nào mô tả bị clamp, và khi nào đổi sang compact.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Tối giản"
                hint="Bộ tối thiểu còn dùng được: một tiêu đề và một dòng mô tả. Dùng cho trang admin học viên vào thẳng từ menu, không có breadcrumb để thể hiện vị trí trong hierarchy."
            >
                <div className="max-w-3xl">
                    <PageHeader
                        title="Manage students"
                        description="View and edit every enrolled student."
                    />
                </div>
            </Variant>
            <Variant
                label="Đầy đủ"
                hint="Dùng khi trang nằm SÂU trong hierarchy và học viên cần biết mình đang ở đâu — hiện đủ mọi tầng: breadcrumb, title, meta. Slot breadcrumb dùng ResponsiveBreadcrumb (desktop hiện trail ngắn; mobile hoặc trail >=4 thu về nút Back). Status chip đặt bên trái xa nhất, phần còn lại của dải meta là text nối dấu chấm, không xếp nhiều chip cạnh nhau."
            >
                <div className="max-w-3xl">
                    <PageHeader
                        breadcrumb={
                            <ResponsiveBreadcrumb
                                items={[
                                    { key: "courses", label: "Courses", onPress: () => {} },
                                    { key: "current", label: "Fullstack Mastery" },
                                ]}
                            />
                        }
                        title="Fullstack Mastery"
                        description="A path from the fundamentals to shipping a real product, graded by AI."
                        meta={
                            <div className="flex flex-wrap items-center gap-2">
                                {/* status chip leading (far left); stat strip = dot-separated TEXT */}
                                <Chip size="sm" variant="soft" color="success"><Chip.Label>Open</Chip.Label></Chip>
                                <Typography type="body-xs" color="muted">24 Modules · 87 Lessons · 32 hours</Typography>
                            </div>
                        }
                    />
                </div>
            </Variant>
            <Variant
                label="Mô tả dài bị clamp"
                hint="Kiểm tra nhánh tràn chữ: mô tả dài hơn không gian đang có sẽ dừng ở 2 dòng, không hơn, để header không chiếm hết màn hình đầu trang. Khung hẹp bên dưới là cố ý, để lộ đúng điểm clamp — cùng đoạn text trên trang rộng sẽ hiện đủ."
            >
                <div className="max-w-sm">
                    <PageHeader
                        title="Configure payment gateways"
                        description="Set up SePay and PayOS, choose the default gateway for new students, configure installment plans applied per course, and track transaction status in real time."
                    />
                </div>
            </Variant>
            <Variant
                label='size="page" (mặc định)'
                hint="Scale mặc định — tiêu đề render ở cấp H3. Dùng khi PageHeader là tiêu đề của CẢ TRANG."
            >
                <PageHeader
                    title="Chuẩn bị máy"
                    description="Trước khi vào playground, cài công cụ dòng lệnh rồi nối StarCi Agent."
                />
            </Variant>
            <Variant
                label='size="compact"'
                hint='Tiêu đề render ở scale body (font-base bold) thay vì H3. Dùng khi header đặt tên cho một PANE hoặc PHASE nằm trong page shell đã có header + nav riêng — một H3 ở đó đọc như tiêu đề trang thứ hai. Ví dụ thật: pane Setup của playground (PlaygroundPrepare), nằm dưới link back của session + tab strip Chuẩn bị/Lab.'
            >
                <PageHeader
                    size="compact"
                    title="Chuẩn bị máy"
                    description="Trước khi vào playground, cài công cụ dòng lệnh rồi nối StarCi Agent."
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của PageHeader: bộ tối thiểu (title + description) cho trang vào thẳng " +
            "từ menu, bộ đầy đủ (breadcrumb + title + description + meta strip) cho trang nằm sâu trong hierarchy, " +
            "nhánh clamp mô tả dài (2 dòng), và hai scale `size=\"page\"` (mặc định, H3 — tiêu đề CẢ TRANG) / " +
            "`size=\"compact\"` (body scale — tiêu đề một PANE/PHASE trong page shell đã có header riêng, ví dụ " +
            "`PlaygroundPrepare`). Không dùng PageHeader cho tiêu đề của một BLOCK trong trang — hai PageHeader " +
            "chồng nhau trên một trang là dấu hiệu một trong hai thực ra là block, dùng `LabeledCard` cho case đó.",
    },
}

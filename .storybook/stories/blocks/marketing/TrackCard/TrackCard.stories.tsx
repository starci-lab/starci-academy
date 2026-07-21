import type { Meta, StoryObj } from "@storybook/nextjs"
import { CloudIcon, CodeIcon, TreeStructureIcon } from "@phosphor-icons/react"

import { TrackCard } from "@/components/blocks/marketing/TrackCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof TrackCard> = {
    title: "Blocks/Marketing/TrackCard",
    component: TrackCard,
}

export default meta

type Story = StoryObj<typeof TrackCard>

/**
 * Toàn bộ biến thể của TrackCard trong một gallery: 3 màu accent (accent/
 * success/warning), số tier ít/nhiều, tiêu đề dài phải truncate, và layout
 * 3 track cạnh nhau như trên trang landing thật.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng gallery này để so 3 track màu khác nhau và cách TrackCard xử lý số tier ít/nhiều cũng như tiêu đề dài, trước khi ghép 3 card cạnh nhau ở section Lộ trình trên landing.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Accent — 4 tier điển hình"
                hint="Track Fullstack với đủ 4 rung foundation → application — trường hợp phổ biến nhất, màu accent."
            >
                <div className="max-w-sm">
                    <TrackCard
                        icon={<CodeIcon />}
                        title="Fullstack thực chiến"
                        meta="23 module · 20 hệ thống"
                        color="accent"
                        tiers={[
                            { label: "Nền tảng", topic: "HTML, CSS, JavaScript cơ bản" },
                            { label: "Cốt lõi", topic: "React, Node.js, REST API" },
                            { label: "Nâng cao", topic: "Kiến trúc hệ thống, tối ưu hiệu năng" },
                            { label: "Ứng dụng", topic: "Dự án thực chiến, triển khai production" },
                        ]}
                        viewLabel="Vào khóa"
                        onView={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Success — 4 tier"
                hint="Track System Design, cùng cấu trúc 4 tier nhưng đổi sang màu success (dot/line/tile/CTA đều đổi theo)."
            >
                <div className="max-w-sm">
                    <TrackCard
                        icon={<TreeStructureIcon />}
                        title="System Design Mastery"
                        meta="18 module · 12 case study"
                        color="success"
                        tiers={[
                            { label: "Nền tảng", topic: "Scalability, load balancing" },
                            { label: "Cốt lõi", topic: "Caching, sharding, message queue" },
                            { label: "Nâng cao", topic: "Consistency, consensus, CAP" },
                            { label: "Ứng dụng", topic: "Thiết kế hệ thống quy mô lớn" },
                        ]}
                        viewLabel="Vào khóa"
                        onView={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Warning — chỉ 1 tier"
                hint="Track DevOps chỉ có 1 tier — không có đường nối (line) phía dưới dot vì index cuối cùng không render line."
            >
                <div className="max-w-sm">
                    <TrackCard
                        icon={<CloudIcon />}
                        title="DevOps Mastery"
                        meta="9 module · 6 hệ thống"
                        color="warning"
                        tiers={[
                            { label: "Nhập môn", topic: "Docker, CI/CD, giám sát hệ thống" },
                        ]}
                        viewLabel="Vào khóa"
                        onView={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Tiêu đề và meta dài (truncate)"
                hint="Tiêu đề dài hơn bề rộng card bị cắt bằng truncate (không wrap 2 dòng); meta không truncate nên vẫn có thể xuống dòng nếu quá dài."
            >
                <div className="max-w-[220px]">
                    <TrackCard
                        icon={<CodeIcon />}
                        title="Kỹ thuật phần mềm nâng cao cho hệ thống phân tán quy mô lớn"
                        meta="35 module · 28 hệ thống thực chiến từ cơ bản đến production"
                        color="accent"
                        tiers={[
                            { label: "Nền tảng", topic: "Kiến thức lập trình cơ bản" },
                            { label: "Ứng dụng", topic: "Dự án thực chiến" },
                        ]}
                        viewLabel="Vào khóa"
                        onView={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="3 track cạnh nhau — layout thật"
                hint="Đúng cách dùng trên landing: 3 TrackCard bọc trong grid 3 cột (@app-md:grid-cols-3 gap-6), mỗi card là một khối tự chứa, so sánh được ngay không cần trục chung."
            >
                <div className="grid gap-6 @container @app-md:grid-cols-3">
                    <TrackCard
                        icon={<CodeIcon />}
                        title="Fullstack thực chiến"
                        meta="23 module · 20 hệ thống"
                        color="accent"
                        tiers={[
                            { label: "Nền tảng", topic: "HTML, CSS, JavaScript cơ bản" },
                            { label: "Cốt lõi", topic: "React, Node.js, REST API" },
                            { label: "Nâng cao", topic: "Kiến trúc hệ thống, tối ưu hiệu năng" },
                            { label: "Ứng dụng", topic: "Dự án thực chiến, triển khai production" },
                        ]}
                        viewLabel="Vào khóa"
                        onView={() => {}}
                    />
                    <TrackCard
                        icon={<TreeStructureIcon />}
                        title="System Design Mastery"
                        meta="18 module · 12 case study"
                        color="success"
                        tiers={[
                            { label: "Nền tảng", topic: "Scalability, load balancing" },
                            { label: "Cốt lõi", topic: "Caching, sharding, message queue" },
                            { label: "Nâng cao", topic: "Consistency, consensus, CAP" },
                            { label: "Ứng dụng", topic: "Thiết kế hệ thống quy mô lớn" },
                        ]}
                        viewLabel="Vào khóa"
                        onView={() => {}}
                    />
                    <TrackCard
                        icon={<CloudIcon />}
                        title="DevOps Mastery"
                        meta="9 module · 6 hệ thống"
                        color="warning"
                        tiers={[
                            { label: "Nền tảng", topic: "Linux, mạng, container cơ bản" },
                            { label: "Cốt lõi", topic: "Docker, Kubernetes, CI/CD" },
                            { label: "Nâng cao", topic: "Giám sát, bảo mật hạ tầng" },
                            { label: "Ứng dụng", topic: "Vận hành hệ thống production" },
                        ]}
                        viewLabel="Vào khóa"
                        onView={() => {}}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { CloudIcon, CodeIcon, StackIcon } from "@phosphor-icons/react"
import { TrackCard } from "./index"

const meta: Meta<typeof TrackCard> = {
    title: "Blocks/Marketing/TrackCard",
    component: TrackCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof TrackCard>

const fullstackTiers = [
    { label: "Foundation", topic: "HTTP, REST, data modeling" },
    { label: "Backend", topic: "NestJS, PostgreSQL, GraphQL" },
    { label: "Frontend", topic: "Next.js, React, HeroUI" },
    { label: "Application", topic: "Triển khai dự án thực chiến" },
] as const

/** Dùng làm thẻ mặc định cho lộ trình Fullstack với tông accent trong lưới 3 cột trên landing. */
export const Default: Story = {
    parameters: { usage: "Dùng làm thẻ mặc định cho lộ trình Fullstack với tông accent trong lưới 3 cột trên landing." },
    render: () => (
        <TrackCard
            icon={<CodeIcon />}
            title="Fullstack thực chiến"
            meta="23 module · 20 hệ thống"
            color="accent"
            tiers={fullstackTiers}
            viewLabel="Vào khóa"
            onView={() => {}}
            className="w-80"
        />
    ),
}

/** So sánh cả ba tông accent · success · warning cạnh nhau để chọn màu phân biệt các track trên cùng một hàng landing. */
export const AllColors: Story = {
    parameters: { usage: "So sánh cả ba tông accent · success · warning cạnh nhau để chọn màu phân biệt các track trên cùng một hàng landing." },
    render: () => (
        <div className="flex flex-wrap items-start gap-6">
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">accent</Typography>
                <TrackCard
                    icon={<CodeIcon />}
                    title="Fullstack thực chiến"
                    meta="23 module · 20 hệ thống"
                    color="accent"
                    tiers={fullstackTiers}
                    viewLabel="Vào khóa"
                    onView={() => {}}
                    className="w-80"
                />
            </div>
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">success</Typography>
                <TrackCard
                    icon={<StackIcon />}
                    title="System Design Mastery"
                    meta="15 module · 12 case study"
                    color="success"
                    tiers={[
                        { label: "Foundation", topic: "Scalability, CAP theorem" },
                        { label: "Core", topic: "Load balancing, caching, sharding" },
                        { label: "Advanced", topic: "Message queue, event-driven" },
                        { label: "Application", topic: "Thiết kế hệ thống end-to-end" },
                    ]}
                    viewLabel="Vào khóa"
                    onView={() => {}}
                    className="w-80"
                />
            </div>
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">warning</Typography>
                <TrackCard
                    icon={<CloudIcon />}
                    title="DevOps Mastery"
                    meta="18 module · 10 lab thực hành"
                    color="warning"
                    tiers={[
                        { label: "Foundation", topic: "Linux, networking, Git" },
                        { label: "Core", topic: "Docker, CI/CD, Kubernetes" },
                        { label: "Cloud", topic: "AWS, GCP, Terraform" },
                        { label: "Application", topic: "Vận hành hệ thống production" },
                    ]}
                    viewLabel="Vào khóa"
                    onView={() => {}}
                    className="w-80"
                />
            </div>
        </div>
    ),
}

/** Rút gọn còn 2 rung khi lộ trình chỉ có ít giai đoạn, tránh bịa thêm tier không tồn tại. */
export const FewTiers: Story = {
    parameters: { usage: "Rút gọn còn 2 rung khi lộ trình chỉ có ít giai đoạn, tránh bịa thêm tier không tồn tại." },
    render: () => (
        <TrackCard
            icon={<CodeIcon />}
            title="AI cho lập trình viên"
            meta="8 module · 5 dự án"
            color="accent"
            tiers={[
                { label: "Foundation", topic: "LLM cơ bản, prompt engineering" },
                { label: "Application", topic: "Xây dựng ứng dụng AI thực tế" },
            ]}
            viewLabel="Vào khóa"
            onView={() => {}}
            className="w-80"
        />
    ),
}

/** Kiểm tra tiêu đề và meta dài không phá vỡ bố cục — title truncate một dòng còn meta xuống dòng tự nhiên. */
export const LongTitle: Story = {
    parameters: { usage: "Kiểm tra tiêu đề và meta dài không phá vỡ bố cục — title truncate một dòng còn meta xuống dòng tự nhiên." },
    render: () => (
        <TrackCard
            icon={<StackIcon />}
            title="Lộ trình Fullstack thực chiến dành cho người mới bắt đầu từ con số không"
            meta="23 module · 20 hệ thống thực tế · 40 giờ video · cấp chứng chỉ hoàn thành"
            color="success"
            tiers={fullstackTiers}
            viewLabel="Vào khóa"
            onView={() => {}}
            className="w-80"
        />
    ),
}

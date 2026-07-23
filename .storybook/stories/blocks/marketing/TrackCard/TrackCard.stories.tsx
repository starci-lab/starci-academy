import type { Meta, StoryObj } from "@storybook/nextjs"
import { CloudIcon, CodeIcon, TreeStructureIcon } from "@phosphor-icons/react"
import { TrackCard } from "./TrackCard"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof TrackCard> = {
    title: "Design/Marketing/TrackCard",
    component: TrackCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TrackCard>

const ANATOMY = {
    primitives: [
        { name: "Card", role: "khung surface bounded (h-full để đều hàng)" },
        { name: "IconTile", role: "ô icon tô nền theo màu track (đang hand-roll)" },
        { name: "Typography", role: "title / meta / tier label + topic" },
    ],
    reason:
        "Một 'lộ trình' cần một khối tự chứa: header định danh (icon + tên + meta) trên một đường 4 rung foundation → application, chốt bằng CTA vào khóa. Gói vào một block để xếp 3 track cạnh nhau so sánh ngay, màu chỉ đổi qua một token TrackColor.",
}

export const AccentFourTiers: Story = {
    render: () =>
        blockShell(
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
            </div>,
            ANATOMY,
        ),
}

export const SuccessFourTiers: Story = {
    render: () =>
        blockShell(
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
            </div>,
            ANATOMY,
        ),
}

export const WarningSingleTier: Story = {
    render: () =>
        blockShell(
            <div className="max-w-sm">
                <TrackCard
                    icon={<CloudIcon />}
                    title="DevOps Mastery"
                    meta="9 module · 6 hệ thống"
                    color="warning"
                    tiers={[{ label: "Nhập môn", topic: "Docker, CI/CD, giám sát hệ thống" }]}
                    viewLabel="Vào khóa"
                    onView={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

export const LongTitleTruncate: Story = {
    render: () =>
        blockShell(
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
            </div>,
            ANATOMY,
        ),
}

export const ThreeTracksLayout: Story = {
    render: () =>
        blockShell(
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
            </div>,
            ANATOMY,
        ),
}

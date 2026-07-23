import type { Meta, StoryObj } from "@storybook/nextjs"
import { CloudIcon, CodeIcon, TreeStructureIcon } from "@phosphor-icons/react"
import { TrackCard } from "./TrackCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — one learning-track card: identity header (icon tile + title + meta)
 * over a vertical 4-rung foundation → application path, chốt bằng CTA vào khóa.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts it composes. TrackCard has
 * ONE composition, so every leaf reuses the same `TRACK_PARTS` — the leaves differ
 * only by color / rung count / layout, not by shape.
 */
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

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="p-8">{node}</div>

// The card's real composition — shared by every leaf (color / rung count / layout
// differ, but the composed parts stay the same).
const TRACK_PARTS: Array<AnatomyNode> = [
    { name: "Card", tier: "primitive", role: "khung surface bounded (h-full để đều hàng)" },
    { name: "IconTile", tier: "primitive", role: "ô icon tô nền theo màu track (đang hand-roll)" },
    { name: "Typography", tier: "primitive", role: "title / meta / tier label + topic" },
]

export const AccentFourTiers: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrackCard"
                tier="design"
                leaf="Accent · 4 tầng"
                parts={TRACK_PARTS}
                reason="Một 'lộ trình' cần một khối tự chứa: header định danh (icon + tên + meta) trên một đường 4 rung foundation → application, chốt bằng CTA vào khóa. Gói vào một block để xếp 3 track cạnh nhau so sánh ngay, màu chỉ đổi qua một token TrackColor."
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
            </BlockAnatomy>,
        ),
}

export const SuccessFourTiers: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrackCard"
                tier="design"
                leaf="Success · 4 tầng"
                parts={TRACK_PARTS}
                note="Đổi màu track qua token TrackColor 'success' — CÙNG composition với leaf accent."
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
            </BlockAnatomy>,
        ),
}

export const WarningSingleTier: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrackCard"
                tier="design"
                leaf="Warning · 1 tầng"
                parts={TRACK_PARTS}
                note="Chỉ một rung → đường path co lại nhưng CÙNG composition (không có node đường nối giữa các rung)."
            >
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
                </div>
            </BlockAnatomy>,
        ),
}

export const LongTitleTruncate: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrackCard"
                tier="design"
                leaf="Tiêu đề dài (cắt)"
                parts={TRACK_PARTS}
                note="Khung hẹp + tiêu đề/meta dài → Typography truncate, composition không đổi."
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
            </BlockAnatomy>,
        ),
}

export const ThreeTracksLayout: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrackCard"
                tier="design"
                leaf="Ba track cạnh nhau"
                parts={TRACK_PARTS}
                note="Xếp 3 TrackCard trong lưới @app-md:grid-cols-3 để so sánh — mỗi ô vẫn là CÙNG composition."
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
            </BlockAnatomy>,
        ),
}

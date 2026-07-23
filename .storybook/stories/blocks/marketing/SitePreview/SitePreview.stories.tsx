import type { Meta, StoryObj } from "@storybook/nextjs"
import { SitePreview } from "./SitePreview"
import { ShowcaseMockup } from "../ShowcaseMockup/ShowcaseMockup"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a fixed marketing preview of a course-catalog page (nav + filter
 * sidebar + course list). It fills its parent's height, so it lives inside a
 * frame with a definite height (a bordered box, or `ShowcaseMockup aspect="video"`).
 *
 * ANATOMY IS PER-LEAF: each scenario below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof SitePreview> = {
    title: "Design/Marketing/SitePreview",
    component: SitePreview,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SitePreview>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// SitePreview's own composition — nav + filter sidebar + course list.
const SITE_PREVIEW_PARTS: Array<AnatomyNode> = [
    { name: "Thanh nav", tier: "design", role: "logo StarCi + menu (Khóa học · Lộ trình · Bảng giá) + nút Đăng ký" },
    {
        name: "Sidebar bộ lọc",
        tier: "design",
        role: "nhóm lọc Chủ đề / Hình thức (ẩn dưới @app-sm)",
        children: [
            { name: "FilterRow", tier: "primitive", role: "1 dòng lọc có ô tick (checked = accent)" },
        ],
    },
    {
        name: "List khoá",
        tier: "design",
        role: "list khoá học minh hoạ",
        children: [
            { name: "Dòng khoá học", tier: "design", role: "tile initial + tên + StarIcon rating · level + giá / khóa" },
        ],
    },
]

// In-mockup leaf: same SitePreview, now wrapped by the ShowcaseMockup browser frame.
const MOCKUP_PARTS: Array<AnatomyNode> = [
    {
        name: "ShowcaseMockup",
        tier: "design",
        role: "khung cửa sổ trình duyệt (3 chấm + address bar, tilt + glow) bọc preview",
        children: SITE_PREVIEW_PARTS,
    },
]

export const Standalone: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SitePreview"
                tier="design"
                leaf="Đứng riêng"
                parts={SITE_PREVIEW_PARTS}
                reason="Nội dung minh hoạ cố định (nav + sidebar lọc + list khoá) để nhét vào ShowcaseMockup — cho thấy sản phẩm trông thế nào mà không cần ảnh chụp thật. Tự lấp đầy chiều cao cha nên phải bọc trong khung có chiều cao xác định."
            >
                <div className="h-[360px] w-full max-w-3xl overflow-hidden rounded-3xl border border-default">
                    <SitePreview />
                </div>
            </BlockAnatomy>,
        ),
}

export const InShowcaseMockup: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SitePreview"
                tier="design"
                leaf="Trong ShowcaseMockup"
                parts={MOCKUP_PARTS}
                note="Bối cảnh thật: cùng SitePreview nhưng bọc trong khung cửa sổ trình duyệt ShowcaseMockup (thêm 1 lớp frame ngoài)."
            >
                <ShowcaseMockup url="starci.vn/khoa-hoc" aspect="video" className="max-w-3xl">
                    <SitePreview />
                </ShowcaseMockup>
            </BlockAnatomy>,
        ),
}

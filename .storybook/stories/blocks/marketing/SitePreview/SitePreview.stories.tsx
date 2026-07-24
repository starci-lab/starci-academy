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

// SitePreview's own composition — mirrors the real DOM: a nav bar and a body
// (sidebar filter + course list). Every node is hand-rolled markup (raw div/span);
// only `FilterRow` is a named local sub-component.
const SITE_PREVIEW_PARTS: Array<AnatomyNode> = [
    {
        name: "Navbar",
        tier: "design",
        role: "header trên cùng (border dưới): cụm brand+menu bên trái + nút Đăng ký bên phải",
        children: [
            { name: "Brand", tier: "primitive", role: "chấm accent + chữ StarCi" },
            { name: "Menu", tier: "primitive", role: "Khóa học · Lộ trình · Bảng giá (ẩn dưới @app-sm)" },
            { name: "SignUpButton", tier: "primitive", role: "pill accent (span rounded-full, không phải Button thật)" },
        ],
    },
    {
        name: "Body",
        tier: "design",
        role: "vùng thân (flex-1): bọc chung sidebar lọc + list khoá",
        children: [
            {
                name: "FilterSidebar",
                tier: "design",
                role: "cột lọc bên trái (ẩn dưới @app-sm)",
                children: [
                    {
                        name: "TopicGroup",
                        tier: "primitive",
                        role: "label Chủ đề + 3 FilterRow (Fullstack on)",
                        children: [
                            { name: "FilterRow", tier: "primitive", role: "1 dòng lọc: ô tick + nhãn (checked = viền/nền accent + CheckCircleIcon)" },
                        ],
                    },
                    {
                        name: "FormatGroup",
                        tier: "primitive",
                        role: "label Hình thức + 2 FilterRow (Tự học on)",
                        children: [
                            { name: "FilterRow", tier: "primitive", role: "1 dòng lọc: ô tick + nhãn (checked = viền/nền accent + CheckCircleIcon)" },
                        ],
                    },
                ],
            },
            {
                name: "CourseList",
                tier: "design",
                role: "list khoá học minh hoạ (3 dòng)",
                children: [
                    {
                        name: "CourseRow",
                        tier: "design",
                        role: "1 tile khoá (border rounded): tile initial + cụm thông tin + giá",
                        children: [
                            { name: "InitialTile", tier: "primitive", role: "ô vuông chữ viết tắt (tone accent/success/warning)" },
                            {
                                name: "InfoCluster",
                                tier: "primitive",
                                role: "cột giữa: tên khoá + dòng rating/level",
                                children: [
                                    { name: "CourseName", tier: "primitive", role: "tên + CheckCircleIcon (verified, success)" },
                                    { name: "RatingMeta", tier: "primitive", role: "StarIcon (fill, warning) + rating · level" },
                                ],
                            },
                            { name: "Price", tier: "primitive", role: "giá + dòng phụ / khóa" },
                        ],
                    },
                ],
            },
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
                leaf="Standalone"
                parts={SITE_PREVIEW_PARTS}
                reason="Nội dung minh hoạ cố định (nav + sidebar lọc + list khoá) để nhét vào ShowcaseMockup — cho thấy sản phẩm trông thế nào mà không cần ảnh chụp thật. Tự lấp đầy chiều cao cha nên phải bọc trong khung có chiều cao xác định."
            >
                <div className="h-[360px] w-full max-w-3xl overflow-hidden rounded-3xl border border-default">
                    <SitePreview showAnatomy />
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
                leaf="InShowcaseMockup"
                parts={MOCKUP_PARTS}
                note="Bối cảnh thật: cùng SitePreview nhưng bọc trong khung cửa sổ trình duyệt ShowcaseMockup (thêm 1 lớp frame ngoài)."
            >
                <ShowcaseMockup
                    url="starci.vn/khoa-hoc"
                    aspect="video"
                    className="max-w-3xl"
                    anatPart="ShowcaseMockup"
                >
                    <SitePreview showAnatomy />
                </ShowcaseMockup>
            </BlockAnatomy>,
        ),
}

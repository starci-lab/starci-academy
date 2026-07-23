import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CourseCard } from "./CourseCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"
import { discountedCourse, enrolledCourse, freeCourse, noCoverCourse } from "./CourseCard.mocks"

/**
 * DESIGN — CourseCard in the compact `line` layout (catalog list view): thumbnail ·
 * title + one-line description + learner meta · price + CTA column.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof CourseCard> = {
    title: "Design/Cards/CourseCard/Line",
    component: CourseCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CourseCard>

/** Plain canvas for each leaf's anatomy panel — the demo row keeps its own max-w-2xl wrapper. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// content leaf (Default · Enrolled) — the full line row: cover + title/meta + price + a
// two-button action column. Enrolled reuses this (only the button LABELS differ).
const CONTENT_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "thumbnail 16:9 rounded-2xl (ẩn dưới @app-sm); thiếu → gradient + BookOpenIcon" },
    { name: "Typography", tier: "primitive", role: "tiêu đề (body bold) + mô tả (muted line-clamp-1)" },
    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên — meta-count muted (KHÔNG bọc Chip)" },
    { name: "PriceTag", tier: "block", role: "giá: số giảm + gốc gạch ngang + chip −% (popover breakdown) + dòng tiết kiệm. ⚠ đang inline" },
    { name: "Button ×2", tier: "primitive", role: "CTA: primary (Xem khóa học / Tiếp tục học) + secondary action (Thêm vào giỏ / Xem khóa học)" },
]

// no-cover leaf: cover part rơi về fallback gradient; no `action` prop + chưa đăng ký →
// CHỈ 1 nút primary (secondary action vắng mặt).
const NO_COVER_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "thiếu ảnh → gradient + BookOpenIcon (fallback)", state: "fallback" },
    { name: "Typography", tier: "primitive", role: "tiêu đề (body bold) + mô tả (muted line-clamp-1)" },
    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên — meta-count muted" },
    { name: "PriceTag", tier: "block", role: "giá phase hiện tại + gốc gạch ngang + chip −%. ⚠ đang inline" },
    { name: "Button", tier: "primitive", role: "CHỈ CTA primary (Xem khóa học) — không có action → không nút secondary" },
]

// loading leaf: dòng giá riêng lẻ là Skeleton khi loyalty preview đang resolve; các part
// khác vẫn hiện thật (KHÔNG mirror cả hàng).
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "thumbnail 16:9 (vẫn hiện thật)" },
    { name: "Typography", tier: "primitive", role: "tiêu đề + mô tả (vẫn hiện thật)" },
    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên (vẫn hiện thật)" },
    { name: "Skeleton", tier: "primitive", role: "CHỈ dòng giá là skeleton khi loyaltyPending — không thay PriceTag bằng số rồi nhảy", state: "loading" },
    { name: "Button", tier: "primitive", role: "CTA primary (không có action → 1 nút)" },
]

// free leaf: không giá (displayPrice null → PriceTag vắng) và enrollmentCount=0 → meta số
// học viên cũng vắng; chỉ còn cover + title + 1 nút.
const FREE_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "thumbnail 16:9" },
    { name: "Typography", tier: "primitive", role: "tiêu đề (body bold) + mô tả (muted line-clamp-1)" },
    { name: "Button", tier: "primitive", role: "CHỈ CTA primary — miễn phí nên không có khối giá" },
]

// skeleton leaf: isSkeleton tự dựng MIRROR của hàng ngang — mọi part là skeleton, giữ
// nguyên box/radius/padding để lưới không nhảy khi data về.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Cover (skeleton)", tier: "primitive", role: "thumbnail 16:9 skeleton (giữ đúng footprint)", state: "skeleton" },
    { name: "Typography (skeleton)", tier: "primitive", role: "tiêu đề + mô tả mirror", state: "skeleton" },
    { name: "Typography muted + UsersIcon (skeleton)", tier: "primitive", role: "số học viên mirror", state: "skeleton" },
    { name: "Skeleton price", tier: "primitive", role: "dòng giá mirror", state: "skeleton" },
    { name: "Button ×2 (skeleton)", tier: "primitive", role: "2 nút mirror", state: "skeleton" },
]

/** Default (discounted) — horizontal row layout: cover · title+meta · price+CTA. */
export const Default: Story = {
    name: "Default",
    render: () =>
        shell(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Có dữ liệu"
                parts={CONTENT_PARTS}
                reason="Một ô khóa học trong catalog gom BLOCK con (CrossListCard value-props · PriceTag giá) + PRIMITIVE (cover · 2 Button CTA · Typography tiêu đề/mô tả · Typography+UsersIcon số học viên; Skeleton chỉ khi đang tải giá). Đóng gói 2 layout grid/line, 2 nút khi đã đăng ký, để feature chỉ truyền `course`."
            >
                <div className="w-full max-w-2xl">
                    <CourseCard
                        course={discountedCourse}
                        layout="line"
                        loyaltyPriceVnd={1341000}
                        loyaltyOriginalVnd={2990000}
                        action={<Button variant="secondary" className="flex-1">Thêm vào giỏ</Button>}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Enrolled — line layout, no cart action. */
export const Enrolled: Story = {
    name: "Enrolled",
    render: () =>
        shell(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Đã đăng ký"
                parts={CONTENT_PARTS}
                note="CÙNG composition với leaf 'Có dữ liệu' — chỉ đổi nhãn: primary 'Tiếp tục học' + secondary 'Xem khóa học' thay cho action."
            >
                <div className="w-full max-w-2xl">
                    <CourseCard course={enrolledCourse} layout="line" />
                </div>
            </BlockAnatomy>,
        ),
}

/** No cover — hàng ngang, thumbnail rơi về fallback gradient + BookOpenIcon (ẩn dưới @app-sm). */
export const NoCover: Story = {
    name: "No Cover",
    render: () =>
        shell(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Không ảnh bìa"
                parts={NO_COVER_PARTS}
                note="Thiếu coverImageUrl → phần cover đổi sang gradient + BookOpenIcon; không action → chỉ 1 nút primary."
            >
                <div className="w-full max-w-2xl">
                    <CourseCard course={noCoverCourse} layout="line" />
                </div>
            </BlockAnatomy>,
        ),
}

/** Loading — loyalty price đang resolve → dòng giá là Skeleton (chỉ dòng giá, không mirror cả hàng). */
export const Loading: Story = {
    name: "Đang tải",
    render: () =>
        shell(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="loyaltyPending → CHỈ dòng giá là Skeleton, phần còn lại render thật (khác leaf 'Khung chờ' mirror cả hàng)."
            >
                <div className="w-full max-w-2xl">
                    <CourseCard course={discountedCourse} layout="line" loyaltyPending />
                </div>
            </BlockAnatomy>,
        ),
}

/** Free — hàng ngang không giá / không số học viên (enrollmentCount=0 ẩn meta). */
export const Free: Story = {
    name: "Free",
    render: () =>
        shell(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Miễn phí"
                parts={FREE_PARTS}
                note="Không giá (PriceTag vắng) và enrollmentCount=0 (meta số học viên vắng) → composition gọn còn cover + title + 1 nút."
            >
                <div className="w-full max-w-2xl">
                    <CourseCard course={freeCourse} layout="line" />
                </div>
            </BlockAnatomy>,
        ),
}

/** Khung chờ — mirror hàng ngang khi card thật đang tải (isSkeleton), `course` bị bỏ qua. */
export const Skeleton: Story = {
    name: "Khung chờ",
    render: () =>
        shell(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Khung chờ"
                parts={SKELETON_PARTS}
                note="isSkeleton → tự dựng mirror cả hàng (mọi part skeleton), giữ nguyên box/radius/padding để lưới không nhảy."
            >
                <div className="w-full max-w-2xl">
                    <CourseCard course={discountedCourse} layout="line" isSkeleton />
                </div>
            </BlockAnatomy>,
        ),
}

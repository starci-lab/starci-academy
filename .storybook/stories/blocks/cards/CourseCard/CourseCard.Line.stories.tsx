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

// The PriceTag block's OWN part-tree (mirrors commerce/PriceTag anatomy): the paid
// amount, the struck list price, the −X% chip that opens the breakdown popover, and
// the "save N₫" line. Nested under the PriceTag node so the tree shows containment.
const PRICE_TAG_CHILDREN: Array<AnatomyNode> = [
    { name: "Typography · giá phải trả", tier: "primitive", role: "số tiền phải trả (đậm)" },
    { name: "Typography · giá gốc", tier: "primitive", role: "giá gốc gạch ngang (khi có giảm)" },
    { name: "StatusChip", tier: "primitive", role: "nhãn −X% (soft-success), kiêm nút mở popover chi tiết", state: "success" },
    { name: "Popover", tier: "primitive", role: "phân rã giá khi bấm chip: gốc → bạn trả" },
    { name: "Typography · tiết kiệm", tier: "primitive", role: "dòng Tiết kiệm N₫" },
]

// content leaf (Default · Enrolled) — the full line row: cover + title/meta/description
// + a price column (PriceTag + a two-button action row). Enrolled reuses this: same
// composition, only the button LABELS differ (both keep 2 buttons + a discounted PriceTag).
const CONTENT_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "thumbnail 16:9 rounded-2xl (ẩn dưới @app-sm); có ảnh → <img>, thiếu → gradient + BookOpenIcon" },
    { name: "Typography · tiêu đề", tier: "primitive", role: "tiêu đề khóa học (body bold, truncate)" },
    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên — meta-count muted (icon cùng màu label, KHÔNG bọc Chip)" },
    { name: "Typography · mô tả", tier: "primitive", role: "mô tả một dòng (body-sm muted line-clamp-1)" },
    { name: "PriceTag", tier: "design", role: "giá VND (size sm): số phải trả + gốc gạch ngang + chip −% (popover) + dòng tiết kiệm", children: PRICE_TAG_CHILDREN },
    { name: "Button · primary", tier: "primitive", role: "CTA chính (mũi tên): Xem khóa học / Tiếp tục học (đã đăng ký)" },
    { name: "Button · secondary", tier: "primitive", role: "nút phụ (flex-1, cùng hàng): Thêm vào giỏ (action) / Xem khóa học (đã đăng ký)" },
]

// no-cover leaf: cover rơi về fallback gradient; no `action` prop + chưa đăng ký →
// CHỈ 1 nút primary (nút phụ vắng mặt). Giá phase hiện tại vẫn có giảm → PriceTag đầy đủ.
const NO_COVER_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "thiếu ảnh → gradient + BookOpenIcon (fallback)", state: "fallback" },
    { name: "Typography · tiêu đề", tier: "primitive", role: "tiêu đề khóa học (body bold, truncate)" },
    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên — meta-count muted" },
    { name: "Typography · mô tả", tier: "primitive", role: "mô tả một dòng (body-sm muted line-clamp-1)" },
    { name: "PriceTag", tier: "design", role: "giá phase hiện tại (size sm): số phải trả + gốc gạch ngang + chip −% (popover) + dòng tiết kiệm", children: PRICE_TAG_CHILDREN },
    { name: "Button · primary", tier: "primitive", role: "CHỈ CTA chính (Xem khóa học) — không action → không nút phụ" },
]

// loading leaf: dòng giá riêng lẻ là Skeleton.Typography khi loyalty preview đang resolve;
// các part khác vẫn hiện thật (KHÔNG mirror cả hàng). PriceTag vắng mặt ở leaf này.
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "thumbnail 16:9 (vẫn hiện thật)" },
    { name: "Typography · tiêu đề", tier: "primitive", role: "tiêu đề (vẫn hiện thật)" },
    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên (vẫn hiện thật)" },
    { name: "Typography · mô tả", tier: "primitive", role: "mô tả một dòng (vẫn hiện thật)" },
    { name: "Skeleton.Typography", tier: "primitive", role: "CHỈ dòng giá là skeleton khi loyaltyPending — thay chỗ PriceTag, không nhảy số", state: "loading" },
    { name: "Button · primary", tier: "primitive", role: "CTA chính (không action → 1 nút)" },
]

// free leaf: không giá (displayPrice null → PriceTag vắng) và enrollmentCount=0 → meta số
// học viên cũng vắng; chỉ còn cover + title + mô tả + 1 nút.
const FREE_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "thumbnail 16:9 (có ảnh bìa)" },
    { name: "Typography · tiêu đề", tier: "primitive", role: "tiêu đề khóa học (body bold, truncate)" },
    { name: "Typography · mô tả", tier: "primitive", role: "mô tả một dòng (body-sm muted line-clamp-1)" },
    { name: "Button · primary", tier: "primitive", role: "CHỈ CTA chính — miễn phí nên không khối giá; count 0 nên không meta số học viên" },
]

// skeleton leaf: isSkeleton tự dựng MIRROR của hàng ngang bằng các primitive Skeleton —
// mọi part là skeleton (KHÔNG có PriceTag/Button thật), giữ nguyên box/radius/padding.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton · cover", tier: "primitive", role: "thumbnail 16:9 skeleton (giữ đúng footprint)", state: "skeleton" },
    { name: "Skeleton.Typography · tiêu đề", tier: "primitive", role: "tiêu đề mirror", state: "skeleton" },
    { name: "Skeleton · số học viên", tier: "primitive", role: "cụm icon tròn + đếm số học viên mirror", state: "skeleton" },
    { name: "Skeleton.Typography · mô tả", tier: "primitive", role: "mô tả một dòng mirror", state: "skeleton" },
    { name: "Skeleton.Typography · giá", tier: "primitive", role: "dòng giá mirror", state: "skeleton" },
    { name: "Skeleton.Button", tier: "primitive", role: "hàng 2 nút mirror (primary + phụ, mỗi nút flex-1)", state: "skeleton" },
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

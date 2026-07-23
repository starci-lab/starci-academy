import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CourseCard } from "./CourseCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"
import { discountedCourse, enrolledCourse, noCoverCourse, freeCourse } from "./CourseCard.mocks"

/**
 * DESIGN — a single course cell in the catalog grid. It owns its whole look
 * (cover · title/desc · social proof · value-props · price · CTA) so features
 * just feed the `course`.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof CourseCard> = {
    title: "Design/Cards/CourseCard/Grid",
    component: CourseCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CourseCard>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// DATA — the full composed card: cover + title/desc + social proof + value-props
// (block) + price (block) + a two-button CTA row. Discounted & Enrolled share it.
const DATA_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "ảnh bìa 16:9 rounded-2xl; thiếu → gradient + BookOpenIcon" },
    { name: "Typography", tier: "primitive", role: "tiêu đề (bold) + mô tả (muted line-clamp)" },
    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên — meta-count text muted (KHÔNG bọc Chip)" },
    { name: "CrossListCard", tier: "block", role: "value-props (bordered, mark=check, tone=muted) — tick CHÌM để chữ dẫn (§2)" },
    { name: "PriceTag", tier: "block", role: "giá: số giảm + gốc gạch ngang + chip −% (popover breakdown) + dòng tiết kiệm. ⚠ đang inline" },
    { name: "Button ×2", tier: "primitive", role: "CTA: nút chính primary (mũi tên) + nút phụ secondary (action / xem chi tiết)" },
]

// NO-COVER — same body, but the cover is the branded gradient fallback and, with
// no `action` passed to a not-enrolled card, only the single primary CTA renders.
const NO_COVER_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "thiếu ảnh → gradient + BookOpenIcon + tiêu đề", state: "fallback" },
    { name: "Typography", tier: "primitive", role: "tiêu đề (bold) + mô tả (muted line-clamp)" },
    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên — meta-count text muted" },
    { name: "CrossListCard", tier: "block", role: "value-props (bordered, mark=check, tone=muted)" },
    { name: "PriceTag", tier: "block", role: "giá phase hiện tại + gốc gạch ngang + chip −%" },
    { name: "Button", tier: "primitive", role: "CTA chính primary (chưa đăng ký, không truyền action → 1 nút)" },
]

// LOADING — loyalty price still resolving → the price line becomes a Skeleton in
// place of PriceTag (composition differs from data).
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "ảnh bìa 16:9 rounded-2xl" },
    { name: "Typography", tier: "primitive", role: "tiêu đề (bold) + mô tả (muted line-clamp)" },
    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên — meta-count text muted" },
    { name: "CrossListCard", tier: "block", role: "value-props (bordered, mark=check, tone=muted)" },
    { name: "Skeleton", tier: "primitive", role: "dòng giá khi loyalty preview đang tải (loyaltyPending) — thay chỗ PriceTag", state: "loading" },
    { name: "Button", tier: "primitive", role: "CTA chính primary" },
]

// FREE — no price / value-props / enrollment count → the body collapses to just
// cover + title/desc + the single primary CTA.
const FREE_PARTS: Array<AnatomyNode> = [
    { name: "Cover (img / gradient)", tier: "primitive", role: "ảnh bìa 16:9 rounded-2xl" },
    { name: "Typography", tier: "primitive", role: "tiêu đề (bold) + mô tả (muted line-clamp)" },
    { name: "Button", tier: "primitive", role: "CTA chính primary (không giá, không value-props, không số học viên)" },
]

// SKELETON — the grid mirror (isSkeleton): keeps the exact box/radius/padding so
// the grid never jumps. Every leaf-part is a Skeleton stand-in.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton (cover)", tier: "primitive", role: "khối ảnh bìa 16:9", state: "skeleton" },
    { name: "Skeleton.Typography", tier: "primitive", role: "tiêu đề + số học viên + 2 dòng mô tả", state: "skeleton" },
    { name: "CrossListCard", tier: "block", role: "value-props tự skeleton (bordered isSkeleton)", state: "skeleton" },
    { name: "Skeleton.Typography (giá)", tier: "primitive", role: "dòng giá", state: "skeleton" },
    { name: "Skeleton.Button ×2", tier: "primitive", role: "hàng 2 nút", state: "skeleton" },
]

/** Discounted (loyalty price) — primary "Xem khóa học" + secondary "Thêm vào giỏ". */
export const Discounted: Story = {
    name: "Discounted",
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Có giảm giá"
                parts={DATA_PARTS}
                reason="Một ô khóa học trong catalog gom BLOCK con (CrossListCard value-props · PriceTag giá) + PRIMITIVE (cover · 2 Button CTA · Typography tiêu đề/mô tả · Typography+UsersIcon số học viên; Skeleton chỉ khi đang tải giá). Đóng gói 2 layout grid/line, 2 nút khi đã đăng ký, để feature chỉ truyền `course`."
            >
                <div className="w-80">
                    <CourseCard
                        course={discountedCourse}
                        loyaltyPriceVnd={1341000}
                        loyaltyOriginalVnd={2990000}
                        action={<Button variant="secondary" className="flex-1">Thêm vào giỏ</Button>}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Enrolled — no cart action, viewer already owns the course. */
export const Enrolled: Story = {
    name: "Enrolled",
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Đã đăng ký"
                parts={DATA_PARTS}
                note="Đã đăng ký → CÙNG composition data, chỉ đổi nhãn: primary 'Tiếp tục học' + phụ 'Xem khóa học' (không nhận cart action)."
            >
                <div className="w-80">
                    <CourseCard course={enrolledCourse} loyaltyPriceVnd={1341000} loyaltyOriginalVnd={2990000} />
                </div>
            </BlockAnatomy>,
        ),
}

/** No cover image → branded gradient fallback. */
export const NoCover: Story = {
    name: "No Cover",
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Không ảnh bìa"
                parts={NO_COVER_PARTS}
                note="Thiếu ảnh → cover đổi sang gradient + BookOpenIcon; không truyền action nên chỉ còn 1 nút CTA chính."
            >
                <div className="w-80">
                    <CourseCard course={noCoverCourse} />
                </div>
            </BlockAnatomy>,
        ),
}

/** Loading — loyalty price still resolving → the price line is a Skeleton. */
export const Loading: Story = {
    name: "Đang tải",
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="loyaltyPending → dòng giá là Skeleton thay cho PriceTag; phần còn lại giữ nguyên footprint data."
            >
                <div className="w-80">
                    <CourseCard course={discountedCourse} loyaltyPending />
                </div>
            </BlockAnatomy>,
        ),
}

/** Free — no price / value-props / enrollment count. */
export const Free: Story = {
    name: "Free",
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Miễn phí"
                parts={FREE_PARTS}
                note="Không giá / không value-props / không số học viên → thân card thu về cover + tiêu đề/mô tả + 1 nút."
            >
                <div className="w-80">
                    <CourseCard course={freeCourse} />
                </div>
            </BlockAnatomy>,
        ),
}

/** Khung chờ — mirror khung lưới khi card thật đang tải (isSkeleton), `course` bị bỏ qua. */
export const Skeleton: Story = {
    name: "Khung chờ",
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Khung chờ"
                parts={SKELETON_PARTS}
                note="isSkeleton → tự dựng skeleton MIRROR đúng box/radius/padding data; `course` bị bỏ qua."
            >
                <div className="w-80">
                    <CourseCard course={discountedCourse} isSkeleton />
                </div>
            </BlockAnatomy>,
        ),
}

/** Khung chờ · lưới — cả lưới catalog đang tải (tái hiện story skeleton cũ bằng isSkeleton). */
export const SkeletonGrid: Story = {
    name: "Khung chờ · lưới",
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseCard"
                tier="design"
                leaf="Khung chờ · lưới"
                parts={SKELETON_PARTS}
                note="Cả lưới catalog đang tải → lặp skeleton mirror ×3, CÙNG composition với leaf 'Khung chờ'."
            >
                <div className="grid w-full gap-3 @app-sm:grid-cols-2 @app-lg:grid-cols-3">
                    <CourseCard course={discountedCourse} isSkeleton />
                    <CourseCard course={discountedCourse} isSkeleton />
                    <CourseCard course={discountedCourse} isSkeleton />
                </div>
            </BlockAnatomy>,
        ),
}

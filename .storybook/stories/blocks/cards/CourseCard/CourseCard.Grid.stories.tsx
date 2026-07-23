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

// DATA — the full composed card. The real DOM is a HeroUI `Card` frame that splits
// into `Card.Content` (cover · title/desc · learners meta · value-props) and
// `Card.Footer` (price · USD hint · CTA row). The `−%` StatusChip mounts INSIDE
// PriceTag; the value-prop rows mount INSIDE CrossListCard. Discounted & Enrolled
// share this composition (Enrolled only relabels: primary "Tiếp tục học" + a
// secondary "Xem khóa học" in the same secondary-Button slot).
const DATA_PARTS: Array<AnatomyNode> = [
    {
        name: "Card", tier: "primitive", role: "khung thẻ rounded-3xl, flex-col overflow-hidden",
        children: [
            {
                name: "Card.Content", tier: "primitive", role: "vùng trên: cover + tiêu đề/mô tả + value-props (gap-3)",
                children: [
                    { name: "Cover (img / gradient)", tier: "primitive", role: "ảnh bìa 16:9 rounded-2xl; thiếu → gradient + BookOpenIcon" },
                    { name: "Typography", tier: "primitive", role: "tiêu đề (h6 bold) + mô tả (muted line-clamp-2)" },
                    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên — meta-count text muted (KHÔNG bọc Chip)" },
                    {
                        name: "CrossListCard", tier: "block", role: "value-props (bordered) — tick CHÌM để chữ dẫn (§2)",
                        children: [
                            {
                                name: "CrossListItem", tier: "design", role: "hàng value-prop (mark=check, tone=muted) ×3",
                                children: [
                                    { name: "Typography", tier: "primitive", role: "nội dung value-prop (body-sm)" },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: "Card.Footer", tier: "primitive", role: "vùng dưới: giá + USD hint + hàng CTA (items-start)",
                children: [
                    {
                        name: "PriceTag", tier: "block", role: "giá: số giảm bold + gốc gạch ngang + dòng tiết kiệm",
                        children: [
                            { name: "StatusChip", tier: "design", role: "chip −% — Popover.Trigger mở breakdown giá" },
                        ],
                    },
                    { name: "Typography muted (USD hint)", tier: "primitive", role: "dòng ≈ giá USD khi thanh toán quốc tế" },
                    { name: "Button (primary)", tier: "primitive", role: "CTA chính primary + mũi tên (Xem khóa học / Tiếp tục học)" },
                    { name: "Button (secondary)", tier: "primitive", role: "CTA phụ secondary (Thêm vào giỏ / Xem khóa học) — KHÔNG mũi tên" },
                ],
            },
        ],
    },
]

// NO-COVER — same tree as DATA, but the cover is the branded gradient fallback and,
// with no `action` on a not-enrolled card, only the single primary CTA renders (no
// secondary Button). Value-props · learners · USD hint · discounted PriceTag all stay.
const NO_COVER_PARTS: Array<AnatomyNode> = [
    {
        name: "Card", tier: "primitive", role: "khung thẻ rounded-3xl, flex-col",
        children: [
            {
                name: "Card.Content", tier: "primitive", role: "vùng trên: cover + tiêu đề/mô tả + value-props",
                children: [
                    { name: "Cover (img / gradient)", tier: "primitive", role: "thiếu ảnh → gradient + BookOpenIcon + tiêu đề", state: "fallback" },
                    { name: "Typography", tier: "primitive", role: "tiêu đề (h6 bold) + mô tả (muted line-clamp-2)" },
                    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên — meta-count text muted" },
                    {
                        name: "CrossListCard", tier: "block", role: "value-props (bordered, tick chìm §2)",
                        children: [
                            {
                                name: "CrossListItem", tier: "design", role: "hàng value-prop (mark=check, tone=muted) ×3",
                                children: [
                                    { name: "Typography", tier: "primitive", role: "nội dung value-prop (body-sm)" },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: "Card.Footer", tier: "primitive", role: "vùng dưới: giá + USD hint + CTA",
                children: [
                    {
                        name: "PriceTag", tier: "block", role: "giá phase hiện tại + gốc gạch ngang",
                        children: [
                            { name: "StatusChip", tier: "design", role: "chip −% — Popover.Trigger mở breakdown giá" },
                        ],
                    },
                    { name: "Typography muted (USD hint)", tier: "primitive", role: "dòng ≈ giá USD khi thanh toán quốc tế" },
                    { name: "Button (primary)", tier: "primitive", role: "CTA chính primary (chưa đăng ký, không action → 1 nút)" },
                ],
            },
        ],
    },
]

// LOADING — loyalty price still resolving → the price line becomes a
// `Skeleton.Typography` in place of PriceTag (the rest of the footprint is
// unchanged; the USD hint does NOT depend on loyalty so it still renders). Not
// enrolled + no action → single primary CTA.
const LOADING_PARTS: Array<AnatomyNode> = [
    {
        name: "Card", tier: "primitive", role: "khung thẻ rounded-3xl, flex-col",
        children: [
            {
                name: "Card.Content", tier: "primitive", role: "vùng trên: cover + tiêu đề/mô tả + value-props",
                children: [
                    { name: "Cover (img / gradient)", tier: "primitive", role: "ảnh bìa 16:9 rounded-2xl" },
                    { name: "Typography", tier: "primitive", role: "tiêu đề (h6 bold) + mô tả (muted line-clamp-2)" },
                    { name: "Typography muted + UsersIcon", tier: "primitive", role: "số học viên — meta-count text muted" },
                    {
                        name: "CrossListCard", tier: "block", role: "value-props (bordered, tick chìm §2)",
                        children: [
                            {
                                name: "CrossListItem", tier: "design", role: "hàng value-prop (mark=check, tone=muted) ×3",
                                children: [
                                    { name: "Typography", tier: "primitive", role: "nội dung value-prop (body-sm)" },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: "Card.Footer", tier: "primitive", role: "vùng dưới: giá(skeleton) + USD hint + CTA",
                children: [
                    { name: "Skeleton.Typography (giá)", tier: "primitive", role: "dòng giá khi loyalty preview đang tải (loyaltyPending) — thay chỗ PriceTag", state: "loading" },
                    { name: "Typography muted (USD hint)", tier: "primitive", role: "dòng ≈ giá USD (không phụ thuộc loyalty)" },
                    { name: "Button (primary)", tier: "primitive", role: "CTA chính primary (không action → 1 nút)" },
                ],
            },
        ],
    },
]

// FREE — no price / value-props / learners count / USD hint → the body collapses to
// Card.Content(cover + title/desc) + Card.Footer(single primary CTA). The price row
// resolves to an empty `<span/>` (no PriceTag) so it carries no part.
const FREE_PARTS: Array<AnatomyNode> = [
    {
        name: "Card", tier: "primitive", role: "khung thẻ rounded-3xl, flex-col",
        children: [
            {
                name: "Card.Content", tier: "primitive", role: "vùng trên (thu gọn: chỉ cover + tiêu đề/mô tả)",
                children: [
                    { name: "Cover (img / gradient)", tier: "primitive", role: "ảnh bìa 16:9 rounded-2xl" },
                    { name: "Typography", tier: "primitive", role: "tiêu đề (h6 bold) + mô tả (muted line-clamp-2)" },
                ],
            },
            {
                name: "Card.Footer", tier: "primitive", role: "vùng dưới: chỉ CTA (giá rỗng — displayPrice null → <span/>)",
                children: [
                    { name: "Button (primary)", tier: "primitive", role: "CTA chính primary (không giá / value-props / số học viên → 1 nút)" },
                ],
            },
        ],
    },
]

// SKELETON — the grid mirror (isSkeleton): the SAME Card / Card.Content / Card.Footer
// frame with every leaf swapped for a Skeleton stand-in, keeping the exact
// box/radius/padding so the grid never jumps. CrossListCard self-skeletons its rows.
const SKELETON_PARTS: Array<AnatomyNode> = [
    {
        name: "Card", tier: "primitive", role: "khung mirror rounded-3xl, flex-col (giữ đúng box/radius/padding data)", state: "skeleton",
        children: [
            {
                name: "Card.Content", tier: "primitive", role: "vùng trên mirror (gap-3)",
                children: [
                    { name: "Skeleton (cover)", tier: "primitive", role: "khối ảnh bìa 16:9 rounded-2xl", state: "skeleton" },
                    { name: "Skeleton.Typography (tiêu đề)", tier: "primitive", role: "tiêu đề h6", state: "skeleton" },
                    { name: "Skeleton + Skeleton.Typography (học viên)", tier: "primitive", role: "chấm icon tròn + số học viên", state: "skeleton" },
                    { name: "Skeleton.Typography (mô tả)", tier: "primitive", role: "2 dòng mô tả body-sm", state: "skeleton" },
                    { name: "CrossListCard", tier: "block", role: "value-props tự skeleton (bordered isSkeleton)", state: "skeleton" },
                ],
            },
            {
                name: "Card.Footer", tier: "primitive", role: "vùng dưới mirror",
                children: [
                    { name: "Skeleton.Typography (giá)", tier: "primitive", role: "dòng giá", state: "skeleton" },
                    { name: "Skeleton.Button", tier: "primitive", role: "hàng 2 nút (×2, div flex — không phải ButtonGroup)", state: "skeleton" },
                ],
            },
        ],
    },
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

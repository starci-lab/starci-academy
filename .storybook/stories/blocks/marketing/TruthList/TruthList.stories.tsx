import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { TrayIcon } from "@phosphor-icons/react"
import { TruthList } from "./TruthList"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * BLOCK — the "raw truth" manifesto: uncomfortable industry truths (accordion
 * triggers) each opening to a concrete "→ here's our answer" line, closed by an
 * optional founder byline.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof TruthList> = {
    title: "Block/Marketing/TruthList",
    component: TruthList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TruthList>

/** Plain canvas — every leaf wraps its render in its OWN BlockAnatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

const typicalTruths = [
    {
        truth: "Học xong khoá online là làm được việc ngay.",
        fix: "→ Mỗi module đóng bằng một sản phẩm chạy thật, review bởi mentor — không chỉ video xem xong là qua.",
    },
    {
        truth: "Chứng chỉ đẹp là đủ để nhà tuyển dụng gật đầu.",
        fix: "→ Portfolio là repo Git thật kèm log commit, không phải PDF in ra treo tường.",
    },
    {
        truth: "AI sẽ thay hết lập trình viên trong vài năm tới.",
        fix: "→ AI thay người không biết đọc lỗi. Chương trình dạy debug và đọc log trước khi dạy prompt.",
    },
    {
        truth: "Càng nhiều ngôn ngữ biết, càng dễ có việc.",
        fix: "→ Tuyển dụng chấm chiều sâu một stack, không chấm số lượng logo trên CV.",
    },
]

// The Accordion subtree, mirrored to the REAL compound nesting the component renders:
// Accordion → Item (per truth) → Heading → Trigger; Panel → Body. The truth/fix strings
// are rendered by a Typography INSIDE Trigger/Body purely to display the item's own
// `truth`/`fix` text (a prop value, not a composed sub-component) — folded into
// Trigger/Body rather than kept as separate nodes (§ granularity: cut element-render-prop).
// Reused by every content leaf (single/multi/wrap share this composition).
const ACCORDION_NODE: AnatomyNode = {
    name: "Accordion",
    tier: "primitive",
    role: "variant surface, flush (!rounded-none) — KHÔNG Accordion.Indicator (không caret, thầy chốt)",
    children: [
        {
            name: "Accordion.Item",
            tier: "primitive",
            role: "một sự thật = một item bấm mở (lặp theo số truths)",
            children: [
                {
                    name: "Accordion.Heading",
                    tier: "primitive",
                    role: "hàng tiêu đề bọc trigger",
                    children: [
                        {
                            name: "Accordion.Trigger",
                            tier: "primitive",
                            role: "bấm mở/đóng — hiện câu sự thật (item.truth, type body, weight medium) — hover là affordance (không có mũi tên)",
                        },
                    ],
                },
                {
                    name: "Accordion.Panel",
                    tier: "primitive",
                    role: "vùng mở ra khi item active",
                    children: [
                        {
                            name: "Accordion.Body",
                            tier: "primitive",
                            role: "thân câu trả lời — hiện câu trả lời (item.fix, '→ ...', type body-sm, color muted)",
                        },
                    ],
                },
            ],
        },
    ],
}

// content leaf WITHOUT byline (single or multi truths share this composition): the surface
// frame div CONTAINS the accordion — everything nests under the frame, nothing floats at root.
const TRUTHLIST_PARTS: Array<AnatomyNode> = [
    {
        name: "Surface frame",
        tier: "primitive",
        role: "div khung ngoài (overflow-hidden rounded-3xl bg-surface shadow-surface) — nền + bo góc + đổ bóng cho cả block",
        children: [ACCORDION_NODE],
    },
]

// content leaf WITH byline — the SAME frame + accordion, plus a signature row that is a SIBLING
// of the accordion INSIDE the frame (border-t div wrapping the caller-supplied byline node).
const TRUTHLIST_BYLINE_PARTS: Array<AnatomyNode> = [
    {
        name: "Surface frame",
        tier: "primitive",
        role: "div khung ngoài (overflow-hidden rounded-3xl bg-surface shadow-surface) — nền + bo góc + đổ bóng cho cả block",
        children: [
            ACCORDION_NODE,
            {
                name: "Byline row",
                tier: "primitive",
                role: "div chữ ký cuối surface (border-t border-default, px-5 py-4) — hiện chữ ký tác giả do caller truyền qua prop byline (body-sm, color muted) — chỉ render khi có prop byline",
                state: "byline",
            },
        ],
    },
]

// empty leaf: the story hand-rolls the surface frame, then EmptyState fills it instead of an
// accordion. EmptyState (design) renders its own icon/title/description via props — those are
// cut from the tree (§ granularity), so EmptyState is a leaf node with no children here.
const EMPTY_PARTS: Array<AnatomyNode> = [
    {
        name: "Surface frame",
        tier: "primitive",
        role: "div khung ngoài (overflow-hidden rounded-3xl bg-surface shadow-surface) — lấp bằng EmptyState thay accordion",
        children: [
            {
                name: "EmptyState",
                tier: "design",
                role: "\"Chưa có sự thật nào\" — stack canh giữa lấp surface (size default, không action) — tự hiện icon khay + tiêu đề + mô tả phụ qua prop icon/title/description",
            },
        ],
    },
]

// loading leaf: Skeleton.Accordion OWNS its own surface frame (rounded-3xl bg-surface
// shadow-surface) + N trigger rows; per row a title bar + an indicator bar + a separator.
const LOADING_PARTS: Array<AnatomyNode> = [
    {
        name: "Skeleton.Accordion",
        tier: "primitive",
        role: "mirror khung surface + 4 hàng trigger h-14, tách nhau bằng separator (hàng cuối không có)",
        state: "skeleton",
        children: [
            { name: "Skeleton.TitleBar", tier: "primitive", role: "thanh chữ statement giả (glyph body-sm, w-2/5) mỗi hàng", state: "skeleton" },
            { name: "Skeleton.Indicator", tier: "primitive", role: "ô size-4 giả caret — DRIFT: TruthList thật bỏ Indicator, showIndicator mặc định true nên skeleton vẽ dư", state: "skeleton" },
            { name: "Skeleton.Separator", tier: "primitive", role: "vạch h-px giữa các hàng", state: "skeleton" },
        ],
    },
]

export const SingleTruth: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TruthList"
                tier="block"
                leaf="SingleTruth"
                parts={TRUTHLIST_PARTS}
                note="Một item duy nhất, không byline — CÙNG composition với leaf nhiều sự thật, chỉ khác số lượng trigger."
            >
                <TruthList
                    showAnatomy
                    items={[
                        {
                            truth: "Bootcamp 3 tháng biến người mới thành senior.",
                            fix: "→ Senior cần va vấp thật qua nhiều dự án, khoá học chỉ rút ngắn đường đi chứ không rút ngắn số năm.",
                        },
                    ]}
                />
            </BlockAnatomy>,
        ),
}

export const TypicalWithByline: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TruthList"
                tier="block"
                leaf="WithByline"
                parts={TRUTHLIST_BYLINE_PARTS}
                reason="Định vị đối đầu, có căn cứ: mỗi sự thật khó chịu của ngành mở ra một câu 'đây là cách tụi mình xử'. Gói accordion + byline vào một surface flush để sự thật là nhân vật chính, tác giả lùi về chữ ký cuối."
            >
                <TruthList
                    showAnatomy
                    items={typicalTruths}
                    byline={
                        <Typography type="body-sm" color="muted">
                            Thầy Long — Founder, StarCi Academy
                        </Typography>
                    }
                />
            </BlockAnatomy>,
        ),
}

export const NoByline: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TruthList"
                tier="block"
                leaf="NoByline"
                parts={TRUTHLIST_PARTS}
                note="Bỏ byline → accordion flush đứng một mình, không có hàng chữ ký cuối surface."
            >
                <TruthList showAnatomy items={typicalTruths} />
            </BlockAnatomy>,
        ),
}

export const LongContentWrap: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TruthList"
                tier="block"
                leaf="LongContentWrap"
                parts={TRUTHLIST_PARTS}
                note="Khung hẹp (max-w-[360px]) → statement + fix xuống nhiều dòng, CÙNG composition không byline."
            >
                <div className="max-w-[360px]">
                    <TruthList
                        showAnatomy
                        items={[
                            {
                                truth: "Chỉ cần giỏi thuật toán là qua được mọi vòng phỏng vấn hệ thống lớn ở công ty product.",
                                fix: "→ Vòng system design chấm khả năng đánh đổi giữa chi phí, độ trễ và độ tin cậy — không có sẵn trong leetcode, phải luyện riêng qua case thật.",
                            },
                        ]}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Empty: no truths → the {@link EmptyState} primitive fills the surface instead of a blank accordion. */
export const Empty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TruthList"
                tier="block"
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="Không có sự thật nào → EmptyState lấp surface, composition khác leaf data (không Accordion)."
            >
                <div
                    className="overflow-hidden rounded-3xl bg-surface shadow-surface"
                    data-anat-part="Surface frame"
                >
                    <EmptyState
                        anatPart="EmptyState"
                        icon={<TrayIcon weight="duotone" />}
                        title="Chưa có sự thật nào"
                        description="Các tuyên bố định vị sẽ hiện ở đây."
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/**
 * Loading: MIRROR the surface frame — keep the `rounded-3xl bg-surface shadow-surface`
 * shell + per-item trigger rows/separators, swap only the statement text for `Skeleton`
 * bars (reuses `Skeleton.Accordion`, sized to the accordion trigger box).
 */
export const SkeletonLoading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TruthList"
                tier="block"
                leaf="Loading"
                parts={LOADING_PARTS}
                note="Skeleton.Accordion mirror khung surface + 4 trigger rows, composition khác leaf data (chưa có chữ thật)."
            >
                <Skeleton.Accordion
                    items={4}
                    anatPart="Skeleton.Accordion"
                    titleAnatPart="Skeleton.TitleBar"
                    indicatorAnatPart="Skeleton.Indicator"
                    separatorAnatPart="Skeleton.Separator"
                />
            </BlockAnatomy>,
        ),
}

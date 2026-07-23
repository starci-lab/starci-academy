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

// content leaf WITHOUT byline (single or multi truths share this composition).
const TRUTHLIST_PARTS: Array<AnatomyNode> = [
    {
        name: "Accordion",
        tier: "primitive",
        role: "mỗi sự thật = một trigger bấm mở ra câu trả lời (variant surface, flush)",
        children: [
            { name: "Typography", tier: "primitive", role: "statement (body medium) trong trigger + fix (body-sm muted) trong body" },
        ],
    },
]

// content leaf WITH byline — same accordion + a signature row closing the surface.
const TRUTHLIST_BYLINE_PARTS: Array<AnatomyNode> = [
    {
        name: "Accordion",
        tier: "primitive",
        role: "mỗi sự thật = một trigger bấm mở ra câu trả lời (variant surface, flush)",
        children: [
            { name: "Typography", tier: "primitive", role: "statement (body medium) trong trigger + fix (body-sm muted) trong body" },
        ],
    },
    { name: "Typography · byline", tier: "primitive", role: "chữ ký tác giả cuối surface (border-t, body-sm muted)", state: "byline" },
]

// empty leaf: no truths → EmptyState fills the surface instead of a blank accordion.
const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "EmptyState", tier: "design", role: '"Chưa có sự thật nào" — icon khay + tiêu đề + mô tả, lấp surface thay accordion trống' },
]

// loading leaf: mirror the surface frame + trigger rows/separators as skeleton bars.
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton · Accordion", tier: "primitive", role: "mirror surface frame + 4 trigger rows/separators, chữ statement → thanh skeleton", state: "skeleton" },
]

export const SingleTruth: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TruthList"
                tier="block"
                leaf="Một sự thật"
                parts={TRUTHLIST_PARTS}
                note="Một item duy nhất, không byline — CÙNG composition với leaf nhiều sự thật, chỉ khác số lượng trigger."
            >
                <TruthList
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
                leaf="Có byline"
                parts={TRUTHLIST_BYLINE_PARTS}
                reason="Định vị đối đầu, có căn cứ: mỗi sự thật khó chịu của ngành mở ra một câu 'đây là cách tụi mình xử'. Gói accordion + byline vào một surface flush để sự thật là nhân vật chính, tác giả lùi về chữ ký cuối."
            >
                <TruthList
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
                leaf="Không byline"
                parts={TRUTHLIST_PARTS}
                note="Bỏ byline → accordion flush đứng một mình, không có hàng chữ ký cuối surface."
            >
                <TruthList items={typicalTruths} />
            </BlockAnatomy>,
        ),
}

export const LongContentWrap: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TruthList"
                tier="block"
                leaf="Nội dung dài xuống dòng"
                parts={TRUTHLIST_PARTS}
                note="Khung hẹp (max-w-[360px]) → statement + fix xuống nhiều dòng, CÙNG composition không byline."
            >
                <div className="max-w-[360px]">
                    <TruthList
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
                leaf="Rỗng"
                parts={EMPTY_PARTS}
                note="Không có sự thật nào → EmptyState lấp surface, composition khác leaf data (không Accordion)."
            >
                <div className="overflow-hidden rounded-3xl bg-surface shadow-surface">
                    <EmptyState
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
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="Skeleton.Accordion mirror khung surface + 4 trigger rows, composition khác leaf data (chưa có chữ thật)."
            >
                <Skeleton.Accordion items={4} />
            </BlockAnatomy>,
        ),
}

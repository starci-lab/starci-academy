import type { Meta, StoryObj } from "@storybook/nextjs"
import { SectionHeading } from "./SectionHeading"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a marketing section heading: accent eyebrow chip → bold title (+ optional
 * "#" deep-link) → muted intro line.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story. Parts appear/disappear per scenario
 * (eyebrow · "#" anchor · intro), so leaves with the same shape share one PARTS set.
 */
const meta: Meta<typeof SectionHeading> = {
    title: "Design/Marketing/SectionHeading",
    component: SectionHeading,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SectionHeading>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// The title + optional "#" anchor NEVER sit at the root: the component always
// wraps them in a flex row `<div>` (the title always mounts inside this row, the
// anchor mounts beside it as a SIBLING within the same row). So every leaf nests
// them under this title-row node, mirroring the real DOM containment.
//
// GRANULARITY (2026-07-23, revised): SectionHeading DIRECTLY renders `Typography.Heading`
// (its `title` prop) and `Typography` (its `intro` prop) — both are direct-composed
// elements of THIS block (not content sitting inside another primitive's slot), so each
// gets its own node + `data-anat-part` emitter. `Anchor '#'` stays for the same reason:
// a distinct element the block renders directly.
const titleRow = (withAnchor: boolean): AnatomyNode => ({
    name: "div · title row",
    tier: "primitive",
    role: "hàng flex (items-center gap-2) bọc tiêu đề" + (withAnchor ? " + anchor \"#\"" : ""),
    children: withAnchor
        ? [
            { name: "Typography.Heading", tier: "primitive", role: "tiêu đề section (bold)" },
            { name: "Anchor '#'", tier: "primitive", role: "deep-link \"#\" cạnh tiêu đề (→ #anchorId)" },
        ]
        : [{ name: "Typography.Heading", tier: "primitive", role: "tiêu đề section (bold)" }],
})

// FULL — eyebrow + [title row] + intro (the default marketing rhythm). Shared by
// the centered default leaf and the level-2 hero leaf (same shape, bigger scale).
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "StatusChip", tier: "primitive", role: "eyebrow soft accent phía trên tiêu đề", state: "accent" },
    titleRow(false),
    { name: "Typography", tier: "primitive", role: "dòng dẫn mờ dưới tiêu đề (body-sm, muted)" },
]

// HEADING + INTRO — no eyebrow: [title row] + dòng dẫn (căn trái).
const HEADING_INTRO_PARTS: Array<AnatomyNode> = [
    titleRow(false),
    { name: "Typography", tier: "primitive", role: "dòng dẫn mờ (body-sm, muted)" },
]

// ANCHORED — title row kèm deep-link "#", cộng dòng dẫn (không eyebrow).
const ANCHORED_PARTS: Array<AnatomyNode> = [
    titleRow(true),
    { name: "Typography", tier: "primitive", role: "dòng dẫn mờ (body-sm, muted)" },
]

// TITLE ONLY — chỉ còn [title row] bọc tiêu đề, không eyebrow / anchor / intro.
const TITLE_ONLY_PARTS: Array<AnatomyNode> = [titleRow(false)]

/** DEFAULT — full rhythm: eyebrow → title → intro, căn giữa (nhịp marketing mặc định). */
export const CenteredDefault: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SectionHeading"
                tier="design"
                leaf="Đầy đủ, căn giữa"
                parts={FULL_PARTS}
                reason="Mọi section marketing lặp lại đúng nhịp: eyebrow màu → tiêu đề đậm → một dòng dẫn mờ. Gói vào một block để mọi section dùng cùng type-scale + spacing, feature chỉ truyền chữ; anchorId thêm '#' deep-link để mục lục/menu tham chiếu trực tiếp."
            >
                <SectionHeading
                    eyebrow="Real learning"
                    title="A learning path designed for working professionals"
                    intro="From fundamentals to hands-on projects, every course is tied to a tangible product you can hold."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

export const AlignStart: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SectionHeading"
                tier="design"
                leaf="Căn trái, không eyebrow"
                parts={HEADING_INTRO_PARTS}
                note="Bỏ eyebrow, căn trái (FAQ) → chỉ còn tiêu đề + dòng dẫn, không StatusChip."
            >
                <SectionHeading
                    align="start"
                    title="Frequently asked questions"
                    intro="The most common questions before you enroll in a course."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

export const WithAnchor: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SectionHeading"
                tier="design"
                leaf='Có anchor "#"'
                parts={ANCHORED_PARTS}
                note='anchorId → thêm link "#" cạnh tiêu đề để deep-link section (composition khác leaf mặc định).'
            >
                <SectionHeading
                    title="Tuition and offers"
                    intro="See the full details of tuition plans, installment options, and current offers."
                    anchorId="hoc-phi"
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

export const TitleOnly: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SectionHeading"
                tier="design"
                leaf="Chỉ tiêu đề"
                parts={TITLE_ONLY_PARTS}
                note="Không eyebrow / anchor / intro → chỉ còn title row (tiêu đề)."
            >
                <SectionHeading title="Training partners" showAnatomy />
            </BlockAnatomy>,
        ),
}

/** `level={2}` — moment quy mô hero, dùng khi section cần nổi bật hơn nhịp mặc định (level 3). */
export const Level2Hero: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="SectionHeading"
                tier="design"
                leaf="Hero level 2"
                parts={FULL_PARTS}
                note="CÙNG composition với leaf mặc định (eyebrow + tiêu đề + dẫn), chỉ nâng level 3 → 2 cho hero-scale."
            >
                <SectionHeading
                    level={2}
                    eyebrow="Học thật"
                    title="Một lộ trình được thiết kế cho người đi làm"
                    intro="Từ nền tảng đến dự án thực tế, mỗi khóa học gắn với một sản phẩm bạn cầm được trên tay."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

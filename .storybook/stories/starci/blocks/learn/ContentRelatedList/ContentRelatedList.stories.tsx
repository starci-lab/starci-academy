import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentRelatedList } from "@sb-components/starci/blocks/learn/ContentRelatedList/ContentRelatedList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentRelatedList`: what else in this course is worth reading after
 * this lesson. A quiet list, never a call to action.
 *
 * ⚠️ SELF-HIDES, AND THAT IS THE WHOLE POINT. With nothing related it draws
 * NOTHING — no card, no label, no empty state. This is the exact opposite of
 * `ContentDiscussion`, whose empty state MUST be drawn because silence there is
 * an invitation to write. Here silence only means the course has nothing else on
 * the subject, and announcing that absence is noise.
 *
 * Same state NAME, opposite behaviour: worth reading both blocks together before
 * touching either.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Row count is data ⇒ a state. Rendering nothing,
 * and the caller flipping `isSkeleton`, each change the shape ⇒ their own leaf.
 */
const meta: Meta<typeof ContentRelatedList> = {
    title: "StarCi/Blocks/Learn/ContentRelatedList/ContentRelatedList",
    component: ContentRelatedList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentRelatedList>

const ITEMS = [
    { key: "cache", title: "Image layer và cache hoạt động ra sao", snippet: "Mỗi lệnh trong Dockerfile đẻ một layer, và thứ tự lệnh quyết định cache còn dùng được không.", href: "#cache" },
    { key: "multistage", title: "Multi-stage build: bỏ toolchain khỏi image chạy thật", snippet: "Stage build giữ compiler, stage cuối chỉ chép ra binary — image rơi từ 1.2GB xuống 40MB.", href: "#multistage" },
    { key: "registry", title: "Đẩy image lên registry và ghim tag cho production", href: "#registry" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardList": { tier: "composite", role: "the nested list surface, owning the label, the row box, the dividers and the row mirror while loading; the block only hands it lesson rows as data", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
}

/** LEAF — the course has related reading. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentRelatedList"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "items.length = 3",
                        why: "Three lessons on the same subject are offered under a quiet label, each row carrying the passage the match came from. The rows sit on a nested surface with no accent, because the reader already has one forward step in the pager and a second loud one would split their attention.",
                        code: `<ContentRelatedList
    label="Có thể bạn muốn đọc"
    items={related}
/>`,
                        render: (
                            <ContentRelatedList
                                anatPart="ContentRelatedList"
                                showAnatomy
                                label="Có thể bạn muốn đọc"
                                items={ITEMS}
                            />
                        ),
                    },
                    {
                        name: "items.length = 1, no snippet",
                        why: "One match, and it arrived without a passage to quote, so the row is a single title line. The list keeps its label and its surface, which is what tells the reader this is a short answer rather than a broken one.",
                        code: `<ContentRelatedList
    label="Có thể bạn muốn đọc"
    items={[{ key: "registry", title: "Đẩy image lên registry và ghim tag cho production", href }]}
/>`,
                        render: (
                            <ContentRelatedList
                                label="Có thể bạn muốn đọc"
                                items={[ITEMS[2]]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — nothing related ⇒ the block renders **nothing at all**. */
export const Hidden: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentRelatedList"
                tier="block"
                leaf="Hidden"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "items = []",
                        why: "The course has nothing else on this subject, so the block draws no card, no label and no empty state — the frame below is deliberately blank. Announcing an absence nobody asked about would add a section that says only that it has nothing to say.",
                        code: "<ContentRelatedList label=\"Có thể bạn muốn đọc\" items={[]} />",
                        render: (
                            <ContentRelatedList
                                anatPart="ContentRelatedList"
                                showAnatomy
                                label="Có thể bạn muốn đọc"
                                items={[]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the mirror shows even though empty would hide. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentRelatedList"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The list draws its own row mirror while the course search is still running. The self-hide deliberately does not apply here: during the fetch we do not yet know the answer is empty, and hiding first then appearing would push the page down under a reader who had already started scrolling.",
                        code: "<ContentRelatedList label=\"Có thể bạn muốn đọc\" items={[]} isSkeleton />",
                        render: (
                            <ContentRelatedList
                                anatPart="ContentRelatedList"
                                showAnatomy
                                label="Có thể bạn muốn đọc"
                                items={[]}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

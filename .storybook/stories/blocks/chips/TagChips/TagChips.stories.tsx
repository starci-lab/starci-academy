import type { Meta, StoryObj } from "@storybook/nextjs"
import { TagChips } from "@sb-components/atoms/chips/TagChips/TagChips"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * PRIMITIVE — a row of `Chip`s (tags), collapsing overflow into a "+N" chip that
 * opens a `Tooltip` listing every tag.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis reflecting the parts THAT leaf composes.
 */
const meta: Meta<typeof TagChips.Base> = {
    title: "Atoms/Chips/TagChips",
    component: TagChips.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TagChips.Base>

const CHIP: AnatomyNode = { name: "Chip", tier: "primitive", role: "chip tag hiển thị (lặp ×N theo tags, cắt tại maxVisible)" }
const OVERFLOW: AnatomyNode = { name: "Tooltip", tier: "primitive", role: "chip \"+N\" mở tooltip liệt kê toàn bộ tag khi tràn maxVisible" }

/**
 * Empty: no tags → renders NOTHING (not even the +N counter, which only appears
 * when the overflow count > 0). This is the component's real empty behaviour — a
 * tag row simply collapses, so no EmptyState primitive is used.
 */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="TagChips" tier="primitive" leaf="Empty" parts={[]} note="`tags=[]` → không Chip nào, không +N — row collapses về rỗng, không EmptyState.">
                <TagChips.Base showAnatomy tags={[]} />
            </BlockAnatomy>
        </div>
    ),
}

/** Single tag: e.g. a post that just got its first topic label. */
export const SingleTag: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="TagChips" tier="primitive" leaf="SingleTag" parts={[CHIP]} note="1 tag, dưới maxVisible → chỉ 1 Chip, không +N.">
                <TagChips.Base showAnatomy tags={["nestjs"]} />
            </BlockAnatomy>
        </div>
    ),
}

/** At maxVisible (no overflow): exactly the default 3 — every tag shows, no +N chip. */
export const AtMaxVisible: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="TagChips" tier="primitive" leaf="AtMaxVisible" parts={[CHIP]} note="Đúng maxVisible (3) → mọi tag hiện Chip, chưa tràn nên không +N.">
                <TagChips.Base showAnatomy tags={["typescript", "nodejs", "postgresql"]} />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Overflow: a long tag list — only the first 3 show, the rest collapse into a +N chip;
 * hover the +N chip to open a tooltip listing every tag.
 */
export const Overflow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="TagChips" tier="primitive" leaf="Overflow" parts={[CHIP, OVERFLOW]} note="Tràn maxVisible → 3 Chip đầu + 1 chip +N mở Tooltip liệt kê hết.">
                <TagChips.Base
                    showAnatomy
                    tags={[
                        "system-design",
                        "microservices",
                        "docker",
                        "kubernetes",
                        "graphql",
                        "keycloak",
                        "rag",
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading: skeleton mirror — `maxVisible` pill placeholders, same row/gap as the resolved chips. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="TagChips"
                tier="primitive"
                leaf="Loading"
                parts={[{ name: "Skeleton.Chip", tier: "design", role: "mirror hàng Chip (maxVisible pill), không +N/Tooltip" }]}
                note="`isSkeleton` thay TOÀN BỘ hàng bằng skeleton pill (1 node), không Chip/+N thật."
            >
                <TagChips.Base showAnatomy tags={[]} isSkeleton={true} />
            </BlockAnatomy>
        </div>
    ),
}

/** Custom maxVisible: a roomier area (a big card) → raise maxVisible to 5 before collapsing. */
export const CustomMaxVisible: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="TagChips" tier="primitive" leaf="CustomMaxVisible" parts={[CHIP, OVERFLOW]} note="`maxVisible={5}` dời ngưỡng tràn — vẫn cùng composition Chip+Tooltip.">
                <TagChips.Base
                    showAnatomy
                    tags={[
                        "javascript",
                        "react",
                        "nextjs",
                        "tailwindcss",
                        "heroui",
                        "vitest",
                        "playwright",
                        "ci-cd",
                    ]}
                    maxVisible={5}
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Base-chip variants: `variant` is passed straight down to each `Chip`. `soft`
 * (default) for tags over a surface; `tertiary`/`primary` when the cluster should
 * blend in more softly or stand out more, per surrounding context.
 */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-col gap-3 p-8">
            <BlockAnatomy name="TagChips" tier="primitive" leaf="Variants" parts={[CHIP]} note="`variant` chỉ đổi màu/tông Chip — vẫn 1 Chip node lặp ×N, không +N (dưới maxVisible).">
                <TagChips.Base showAnatomy tags={["frontend", "backend", "ai", "vector-db"]} variant="soft" />
            </BlockAnatomy>
            <TagChips.Base tags={["frontend", "backend", "ai", "vector-db"]} variant="tertiary" />
            <TagChips.Base tags={["frontend", "backend", "ai", "vector-db"]} variant="primary" />
        </div>
    ),
}

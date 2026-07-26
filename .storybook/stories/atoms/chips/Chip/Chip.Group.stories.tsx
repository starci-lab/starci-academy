import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, type ChipGroupItem, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Chip.Group`: HÀNG chip dựng từ `items` dữ liệu, cắt tại `maxVisible`, phần
 * dư gom vào một chip `+N` mở Tooltip.
 *
 * ⚠️ PHẠM VI STATE (§12f): cụm KHÔNG đẻ nghĩa mới — nó `import { ChipBase }` rồi dựng
 * lại. Nên story ở đây CHỈ render state THUỘC VỀ CỤM: `items` · `maxVisible` · `tone`
 * cấp cụm · `isSkeleton` cả hàng. State của TỪNG chip (glyph, chấm màu, nút ×) sống ở
 * story `Chip.Base` — KHÔNG lặp lại.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Bộ prop của cụm ít hơn `Chip.Base` đúng vì §12f.
 *
 * ⚠️ Đây là `TagChips` cũ (đổi nhà 2026-07-26). Bản cũ gọi thẳng HeroUI Chip nên trôi
 * khỏi atom: chip trong hàng không theo tone, skeleton tự vẽ một cỡ khác. Giờ mọi viên
 * trong hàng là `Chip.Base` thật — xem tab Deps.
 */
const meta: Meta<typeof Chip.Group> = {
    title: "Atoms/Chips/Chip/Chip.Group",
    component: Chip.Group,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Chip.Group>

/**
 * DEPS = story KHÁC mà cụm này dựng lại. Chỉ MỘT node: `Chip.Base`.
 *
 * Tooltip của chip `+N` CÓ story riêng nhưng chưa vào được cây: `Tooltip.Base` mới chỉ
 * phát `data-anat-part="Trigger"`/`"Content"` (tên KHE, không phải tên namespace) và
 * không nhận `anatPart` để cụm gọi tên nó. Khai `Trigger` vào đây sẽ ra một node mang
 * tên sai, nên tạm để ngoài — cần thêm `anatPart` cho `Tooltip.Base` rồi mới khai.
 */
const GROUP_DEPS: Record<string, AnatomyAnnotation> = {
    "Chip.Base": {
        tier: "atom",
        role: "every pill in the row, including the +N one",
        storyId: "atoms-chips-chip-chip-base--default",
    },
}

/** Hàng tag mẫu — đủ dài để thấy chỗ cắt. */
const ITEMS: Array<ChipGroupItem> = [
    { key: "ts", text: "TypeScript" },
    { key: "react", text: "React" },
    { key: "node", text: "Node.js" },
    { key: "postgres", text: "PostgreSQL" },
    { key: "docker", text: "Docker" },
    { key: "k8s", text: "Kubernetes" },
]

/** Hàng ngắn — nằm gọn dưới `maxVisible` nên không có chip `+N`. */
const SHORT_ITEMS: Array<ChipGroupItem> = ITEMS.slice(0, 3)

const TONES: Array<{ tone: ChipTone; hint: string }> = [
    { tone: "neutral", hint: "plain tags" },
    { tone: "success", hint: "everything checked out" },
    { tone: "warning", hint: "needs a look" },
    { tone: "danger", hint: "blocking" },
    { tone: "accent", hint: "highlighted set" },
]

/** Leaf prop `items` — cụm dựng hàng từ DỮ LIỆU; hàng dài thì phần dư gom vào `+N`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Group"
                tier="atom"
                leaf="Prop `items`"
                annotate={GROUP_DEPS}
                reason="The row is described as data, never as JSX children — so a caller cannot slip a different pill, a different tone, or a stray wrapper into the middle of it."
                note="Short rows render every item. Once the list runs past the cut, the tail collapses into a +N chip; hover it and the tooltip lists the whole set, not just the hidden part — people open it to ask 'what are all of these', not 'what is missing'."
                code={`<Chip.Group
  items={[
    { key: "ts", text: "TypeScript" },
    { key: "react", text: "React" },
    { key: "node", text: "Node.js" },
  ]}
/>`}
            >
                <div className="flex flex-col items-start gap-4">
                    <Chip.Group items={SHORT_ITEMS} showAnatomy />
                    <Chip.Group items={ITEMS} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `maxVisible` — chỗ CẮT của hàng. */
export const MaxVisible: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Group"
                tier="atom"
                leaf="Prop `maxVisible`"
                annotate={GROUP_DEPS}
                reason="The cut belongs to the row, not to the page: a tag row in a dense card can only afford two chips, the same row on a detail page can show five. Same data, one number to move."
                note="All four rows below hold the same six items. Raise the number past the list and the +N chip disappears on its own — the count never goes negative."
                code={`<Chip.Group maxVisible={2} items={[…6 items…]} />
<Chip.Group items={[…6 items…]} />          // 3 = default
<Chip.Group maxVisible={5} items={[…6 items…]} />
<Chip.Group maxVisible={8} items={[…6 items…]} />`}
            >
                <div className="flex flex-col items-start gap-4">
                    <Chip.Group maxVisible={2} items={ITEMS} showAnatomy />
                    <Chip.Group items={ITEMS} />
                    <Chip.Group maxVisible={5} items={ITEMS} />
                    <Chip.Group maxVisible={8} items={ITEMS} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `tone` — đặt ở CẤP CỤM: hàng token phải đồng màu (§12d). */
export const Tones: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Group"
                tier="atom"
                leaf="Prop `tone`"
                annotate={GROUP_DEPS}
                reason="Tone sits on the row, not on the item. A row is read as one set, so one colour; letting each item pick its own turns a tag list into a rainbow and nobody can tell which chip is trying to say something."
                note="The +N chip takes the row tone too, so the overflow does not read as a different kind of thing."
                code={`<Chip.Group tone="neutral" items={[…]} />
<Chip.Group tone="success" items={[…]} />
<Chip.Group tone="warning" items={[…]} />
<Chip.Group tone="danger" items={[…]} />
<Chip.Group tone="accent" items={[…]} />`}
            >
                <div className="flex flex-col items-start gap-4">
                    {TONES.map(({ tone }, index) => (
                        <Chip.Group key={tone} tone={tone} items={ITEMS} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — cụm chỉ CHUYỂN cờ xuống, mỗi viên tự vẽ shimmer của mình (§12c).
 *
 * Bật `showAnatomy` cả ở nhánh skeleton, nếu không cây báo "0 part" và trông như cụm tự
 * vẽ shimmer — sai hẳn nguồn (bẫy đã dính ở `Button.Group`).
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Group"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={GROUP_DEPS}
                reason="The row does not draw the resting state itself — it still builds Chip.Base, one per slot, and each pill draws its own shimmer. Two components drawing the same pill would drift apart the first time one of them changes."
                note="It holds maxVisible pills, so the row keeps the width it will have when the data lands. The pills are the bare, narrowest form because a row of tags has no leading mark and no × on it."
                code={`<Chip.Group isSkeleton items={tags} />
<Chip.Group isSkeleton maxVisible={5} items={tags} />`}
            >
                <div className="flex flex-col items-start gap-4">
                    <Chip.Group isSkeleton items={ITEMS} showAnatomy />
                    <Chip.Group isSkeleton maxVisible={5} items={ITEMS} showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

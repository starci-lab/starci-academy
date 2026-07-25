import type { Meta, StoryObj } from "@storybook/nextjs"
import { CircleCheck } from "@gravity-ui/icons"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// README (rules xài icon) hiện ngay đầu trang Overview — nguồn đầy đủ ở
// `components/atoms/chips/Chip/README.md`.
const ICON_RULES = `
## Khi nào dùng ICON trong chip

Icon trong chip = **tín hiệu THÊM**, không trang trí. Chỉ thêm khi icon tải nghĩa mà label chưa nói hết.

**✅ Dùng khi:**
- **success ↔ failure** (valence rõ): \`Verified\` ✓ · \`Failed\` ✕ — liếc-là-thấy.
- **Nhấn mạnh** một trạng thái quan trọng giữa danh sách dày.
- **Brand/entity** mà logo là danh tính: \`GitHub\` · \`YouTube\`.

**❌ Không dùng khi:**
- Label đã đủ nghĩa (\`Beginner\`/\`Advanced\` — chữ đủ, đừng thêm icon).
- Icon trang trí không map tới nghĩa nào.
- Hàng token đồng cấp (tags/filter) → text-only cho cả hàng.
- Scalar/đếm (số, giờ, học viên) → muted text, KHÔNG icon.

**Chọn icon nào:** chỉ dùng icon **PHỔ QUÁT** — \`CircleCheck\` ✓ · \`CircleXmark\` ✕ · \`Clock\` · \`Lock\`… (ai cũng đọc ra ngay). Icon **specific theo domain** quá (chỉ người trong domain hiểu) → KHÔNG dùng, để CHỮ tải nghĩa.

**Kỹ thuật:** chip 1 size (**medium \`md\`**, font theo HeroUI — đã bỏ override text-xs ở globals.css) · ưu tiên **outline** (\`CircleCheck\`, không \`CircleCheckFill\`) · icon size \`size-3.5\` (khớp text-sm, atom tự ép) · tone theo chip · gravity **KHÔNG** có \`weight\`.

**API strict:** \`icon\` nhận **COMPONENT** (\`icon={CircleCheck}\`), không JSX \`<CircleCheck/>\`.
`

const meta: Meta<typeof Chip.Base> = {
    title: "Atoms/Chips/Chip/Chip.Base",
    component: Chip.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: ICON_RULES,
            },
        },
    },
}

export default meta

type Story = StoryObj<typeof Chip.Base>

// LEAF = composition (theo prop). Mỗi leaf render 1 chip + anatomy đúng parts của nó.
const LABEL_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "nhãn chip (HeroChip.Label) — prop `text`" },
]
const ICON_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "atom", role: "leading glyph — `icon` truyền COMPONENT, atom ép size-3.5 (chip md)" },
    { name: "Label", tier: "atom", role: "nhãn chip (HeroChip.Label)" },
]
const REMOVE_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "nhãn chip (HeroChip.Label)" },
    { name: "Remove", tier: "atom", role: "nút × (onRemove) — scale chip, tone theo chip" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (pill shimmer)" },
]

/** Base — text trơn (không icon/×). */
export const Base: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Base"
                tier="atom"
                leaf="Base"
                parts={LABEL_PARTS}
                reason="Atom chip DUY NHẤT bọc HeroUI Chip; biến thể phân bằng prop (icon/onRemove) → leaf = composition."
                code={"<Chip.Base tone=\"neutral\" text=\"Draft\" />"}
            >
                <Chip.Base tone="neutral" text="Draft" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** WithIcon — `icon={CircleCheck}` truyền COMPONENT (không JSX); atom render size-3. */
export const WithIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Base"
                tier="atom"
                leaf="WithIcon"
                parts={ICON_PARTS}
                note="icon = component reference (`CircleCheck`, outline — KHÔNG fill). Xem README: chỉ xài icon cho success/failure · nhấn mạnh · brand."
                code={"<Chip.Base tone=\"success\" icon={CircleCheck} text=\"Verified\" />"}
            >
                <Chip.Base tone="success" icon={CircleCheck} text="Verified" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Removable — `onRemove` bật trailing ×. */
export const Removable: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Base"
                tier="atom"
                leaf="Removable"
                parts={REMOVE_PARTS}
                note="onRemove bật × (filter token). Không icon leading."
                code={"<Chip.Base tone=\"accent\" text=\"React\" onRemove={fn} removeLabel=\"Remove React filter\" />"}
            >
                <Chip.Base tone="accent" onRemove={() => {}} removeLabel="Remove React filter" text="React" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton; không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Base"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → pill shimmer OWNED bởi atom (hybrid C)."
                code={"<Chip.Base isSkeleton text=\"Verified\" />"}
            >
                <Chip.Base isSkeleton text="Verified" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

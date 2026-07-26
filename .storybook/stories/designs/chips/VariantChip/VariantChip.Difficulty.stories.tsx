import type { Meta, StoryObj } from "@storybook/nextjs"
import { VariantChip, type Difficulty } from "@sb-components/designs/chips/VariantChip/VariantChip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — `VariantChip.Difficulty`: áp vai nghĩa **ĐỘ KHÓ** lên atom `Chip.Base`.
 *
 * ⚠️ 2026-07-26: atom bỏ member `Chip.Dot` — chấm là PROP của viên chip duy nhất
 * (`dotClassName`). Design này không đổi hình, chỉ đổi cái nó gọi xuống.
 *
 * Member của họ `VariantChip.*` chia theo **VAI** (§14d), không theo hình — đó là
 * chỗ tầng design khác tầng atom.
 *
 * ⛔ **KHÔNG `custom`, KHÔNG `bare`** (thầy chốt 2026-07-26): từ tầng design trở lên
 * không mở lối tự đặt nhãn hay đổi hình. Hở một lối là caller lách được, bản chuẩn
 * hết còn chuẩn. Muốn chip tự do → gọi thẳng atom `Chip.*`.
 *
 * 📐 **MỘT LEAF DUY NHẤT** (§11f): leaf chia theo CẤU TRÚC. Bốn bậc độ khó cùng một
 * cây DOM, chỉ khác nội dung ⇒ chúng là STATE, không phải bốn leaf. Nên một leaf,
 * render ĐỦ bốn bậc trong đó.
 *
 * Skeleton cũng KHÔNG phải leaf riêng — cùng cấu trúc, chỉ thay chữ bằng gạch.
 * (Prop `isSkeleton` thì vẫn có, §12c — hai chuyện khác nhau.)
 */
const meta: Meta<typeof VariantChip.Difficulty> = {
    title: "Designs/Chips/VariantChip.Difficulty",
    component: VariantChip.Difficulty,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof VariantChip.Difficulty>

/** Trục DUY NHẤT của design này — `difficulty` quyết cả nhãn lẫn màu. */
const LEVELS: Array<Difficulty> = ["beginner", "intermediate", "advanced", "insane"]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Chip.Base": {
        storyId: "atoms-chips-chip-chip-base--default",
        tier: "atom",
        role: "The whole shape comes from here. Design only adds meaning and the dot colour.",
    },
}

/**
 * Leaf duy nhất — đủ 4 bậc + hàng skeleton (state, không phải leaf).
 *
 * Ramp dùng palette CHỨ KHÔNG dùng 5 token ngữ nghĩa: độ khó là **BẬC**, không phải
 * **TRẠNG THÁI** — ép 4 bậc vào token sẽ đụng `danger` hai lần.
 */
export const Levels: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="VariantChip.Difficulty"
                tier="design"
                leaf="Chip độ khó"
                parts={[]}
                annotate={ANNOTATE}
                note="The pill shape is the atom's own default — design never opens a shape axis."
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {LEVELS.map((level, index) => (
                            <VariantChip.Difficulty
                                key={level}
                                difficulty={level}
                                showAnatomy={index === 0}
                            />
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {LEVELS.map((level) => (
                            <VariantChip.Difficulty key={level} difficulty={level} isSkeleton />
                        ))}
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

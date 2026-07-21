import type { Meta, StoryObj } from "@storybook/nextjs"
import { DotsThreeVerticalIcon, TrashIcon } from "@phosphor-icons/react"
import { Button } from "@heroui/react"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { Gallery, Variant } from "../../../../story-kit"
import { ATTEMPT_ITEMS, Controlled, ControlledMulti, DIFFICULTY_ITEMS, LANGUAGE_ITEMS, TIER_ITEMS } from "./components"

const meta: Meta<typeof FlexWrapButtonRadio> = {
    title: "Blocks/Navigation/FlexWrapButtonRadio",
    component: FlexWrapButtonRadio,
    parameters: {
        docs: {
            description: {
                component:
                    "Single-select toggle-button group laid out as a flex-wrap row of independent HeroUI Buttons. Standalone: selected = filled `tertiary` (neutral, not accent — a facet/config toggle isn't a CTA), unselected = hollow `ghost`. With `itemAction`, each item becomes one connected ButtonGroup (`[select | 🗑 | ⋮]`) with full-height dividers.",
            },
        },
    },
}

export default meta
type Story = StoryObj<typeof FlexWrapButtonRadio>

/**
 * Toàn bộ trạng thái của FlexWrapButtonRadio: chọn 1-trong-N mặc định, multi-select,
 * có mục bị khoá, có nút trailing phụ, và mỗi mục kèm action riêng. Dùng để tra khi
 * nào chọn biến thể nào so với `SelectableCardGroup`/`TabsCard`.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Chọn 1-trong-N (mặc định)"
                hint="Dùng khi các lựa chọn ngắn, gọn và cần xuống dòng khi tràn — mỗi lựa chọn là một Button thật (cao đều nhau, có thể kèm action phụ qua itemAction). Vì lồng Button vào label của Radio phá nested-interactive, biến thể này bỏ RadioGroup và dùng role='group' + aria-pressed trên từng nút (đánh đổi mất roving mũi tên của radio thật). Card LỚN có icon + mô tả + badge và cần lưới cột cố định → dùng SelectableCardGroup; vài lựa chọn luôn nằm một hàng, không bao giờ tràn → dùng TabsCard (variant='primary'). Mặc định đây là cụm NẰM NGOÀI card (thanh filter/toolbar rời): mục chưa chọn là ghost rỗng, lấy nền trang/card cha làm mặt nền — không có viền/nền riêng cho mỗi lựa chọn."
            >
                <Controlled items={DIFFICULTY_ITEMS} initialValue="medium" ariaLabel="Select difficulty" />
            </Variant>
            <Variant
                label="Multi-select"
                hint="Dùng multiple + values + onToggle khi mỗi nút là một toggle độc lập và một TẬP HỢP luôn được giữ chọn, thay vì chỉ 1-trong-N. Nơi gọi tự quản tập giá trị và quy tắc 'giữ tối thiểu 1 lựa chọn' (bỏ chọn mục cuối cùng sẽ bị bỏ qua). Dựng cho bộ chọn ngôn ngữ ở màn thiết lập Mock Interview: thí sinh tick một hoặc nhiều ngôn ngữ, mỗi câu hỏi code rút ra sẽ dùng ngẫu nhiên một trong số đó. Cùng hình dạng pill như single-select."
            >
                <ControlledMulti items={LANGUAGE_ITEMS} initialValues={["typescript"]} ariaLabel="Select languages" />
            </Variant>
            <Variant
                label="Có mục bị khoá (disabled)"
                hint="Dùng khi một nhóm có lựa chọn CHƯA MỞ KHOÁ (một gói/tier bị khoá) — mục đó vẫn hiện ra nhưng không bấm được, và không bị ẩn khỏi danh sách."
            >
                <Controlled items={TIER_ITEMS} initialValue="economy" ariaLabel="Select plan" />
            </Variant>
            <Variant
                label="Có nút trailing phụ"
                hint="Dùng trailing khi cần gắn thêm một nút phụ TRÊN CÙNG HÀNG với các lựa chọn (ví dụ nút '+N' để mở rộng phần bị tràn), nút này không phải là một lựa chọn thật."
            >
                <Controlled
                    items={DIFFICULTY_ITEMS.slice(0, 3)}
                    initialValue="easy"
                    ariaLabel="Select difficulty"
                    trailing={
                        <Button size="sm" variant="ghost">
                            +2
                        </Button>
                    }
                />
            </Variant>
            <Variant
                label="Mỗi mục có action riêng (itemAction)"
                hint="Dùng itemAction khi mỗi lựa chọn cần một action đi kèm RIÊNG (nút xoá, menu '⋮') — cả cụm nối lại thành một button group, và các action này không làm đổi lựa chọn hiện tại."
            >
                <Controlled
                    items={ATTEMPT_ITEMS}
                    initialValue="attempt-1"
                    ariaLabel="Select attempt"
                    itemAction={(item) => [
                        <Button key="delete" size="sm" variant="tertiary" isIconOnly aria-label={`Delete ${item.value}`}>
                            <TrashIcon className="size-4" />
                        </Button>,
                        <Button key="more" size="sm" variant="tertiary" isIconOnly aria-label={`More options for ${item.value}`}>
                            <DotsThreeVerticalIcon className="size-4" />
                        </Button>,
                    ]}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của FlexWrapButtonRadio: chọn 1-trong-N mặc định, multi-select, có mục bị khoá, "
            + "có nút trailing phụ, và mỗi mục kèm action riêng. Dùng để tra khi nào chọn biến thể nào so với "
            + "`SelectableCardGroup`/`TabsCard`.",
    },
}

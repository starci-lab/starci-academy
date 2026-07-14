import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { PressableCard } from "./index"

const meta: Meta<typeof PressableCard> = {
    title: "Blocks/PressableCard",
    component: PressableCard,
    parameters: {
        layout: "centered",
    },
}

export default meta

type Story = StoryObj<typeof PressableCard>

/** Generic navigation-tile content — icon + title + subtitle. */
const NavTileContent = () => (
    <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-surface-secondary text-lg">
            🚀
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
                Lộ trình Fullstack Mastery
            </span>
            <span className="text-xs text-muted">
                12 module · 48 bài học
            </span>
        </div>
    </div>
)

/** Generic option-card content — used for "pick a card" (lift) demos. */
const OptionCardContent = ({ label, price }: { label: string; price: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted">{price}</span>
    </div>
)

/** Dùng cho ô điều hướng bấm được (vào lộ trình, mở khóa học) — bấm là chuyển màn ngay, không phải chọn lựa. */
export const Default: Story = {
    parameters: {
        usage: "Dùng cho ô điều hướng bấm được (vào lộ trình, mở khóa học) — bấm là chuyển màn ngay, không phải chọn lựa.",
    },
    args: {
        hoverVariant: "fill",
        onPress: () => {},
        children: <NavTileContent />,
    },
}

/** So sánh 2 kiểu hover: `fill` cho tile điều hướng (đi đâu đó), `lift` cho card lựa chọn (chọn 1 trong nhiều gói) — chọn theo Ý ĐỊNH của cú bấm, không theo gu thẩm mỹ. */
export const HoverVariants: Story = {
    name: "Hover variants — fill vs lift",
    parameters: {
        usage: "So sánh 2 kiểu hover: `fill` cho tile điều hướng (đi đâu đó), `lift` cho card lựa chọn (chọn 1 trong nhiều gói) — chọn theo Ý ĐỊNH của cú bấm, không theo gu thẩm mỹ.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <PressableCard hoverVariant="fill" onPress={() => {}}>
                <NavTileContent />
            </PressableCard>
            <PressableCard hoverVariant="lift" onPress={() => {}}>
                <OptionCardContent label="Gói 6 tháng" price="1.990.000đ" />
            </PressableCard>
        </div>
    ),
}

/** Dùng khi đích đến là 1 URL thật (route sang trang khóa học) — render ra `<a>` để hỗ trợ mở tab mới/copy link, không chỉ gọi handler JS. */
export const AsLink: Story = {
    name: "As link (href navigation)",
    parameters: {
        usage: "Dùng khi đích đến là 1 URL thật (route sang trang khóa học) — render ra `<a>` để hỗ trợ mở tab mới/copy link, không chỉ gọi handler JS.",
    },
    args: {
        href: "/courses/0-fullstack-mastery",
        hoverVariant: "fill",
        children: <NavTileContent />,
    },
}

/**
 * Card điều hướng NHƯNG có nút riêng bên trong (vd card tiến độ khóa học: bấm card = mở
 * khóa, nút "Tiếp tục" = vào đúng bài đang dở, nút "…" = menu). Truyền qua `actions` +
 * `label` → card chuyển sang pattern **stretched-link**: cả card là 1 overlay trong suốt
 * phủ lên (bấm-cả-card), 2 nút nằm ĐÈ LÊN overlay (source-order + z-10) nên bấm độc lập.
 * KHÔNG lồng `<button>` trong `<button>`/`<a>` (HTML sai + hỏng focus order + là nguyên
 * nhân card bị CAO khi nhét 2 nút vào children như cách cũ). Ref Inclusive Components /
 * Adrian Roselli.
 */
export const WithActions: Story = {
    name: "With actions (2 buttons inside)",
    parameters: {
        usage: "Card bấm-được có nút riêng bên trong (card tiến độ: bấm card mở khóa, nút Tiếp tục vào bài dở). Dùng `actions` + `label` → stretched-link: overlay phủ cả card + nút đè lên (z-10), bấm độc lập, KHÔNG lồng interactive, không bị cao.",
    },
    render: () => (
        <div className="w-[380px]">
            <PressableCard
                onPress={() => {}}
                label="Mở lộ trình Fullstack Mastery"
                actions={(
                    <>
                        <Button size="sm" variant="secondary" onPress={() => {}}>
                            Tiếp tục
                        </Button>
                        <Button size="sm" variant="tertiary" isIconOnly aria-label="Thêm tùy chọn" onPress={() => {}}>
                            ⋯
                        </Button>
                    </>
                )}
            >
                <NavTileContent />
            </PressableCard>
        </div>
    ),
}

/** Dùng khi lựa chọn đó tạm thời không khả dụng (gói hết slot) — vẫn hiện để user biết nó tồn tại, nhưng chặn bấm + tắt hover. */
export const Disabled: Story = {
    parameters: {
        usage: "Dùng khi lựa chọn đó tạm thời không khả dụng (gói hết slot) — vẫn hiện để user biết nó tồn tại, nhưng chặn bấm + tắt hover.",
    },
    args: {
        hoverVariant: "lift",
        isDisabled: true,
        onPress: () => {},
        children: <OptionCardContent label="Gói 12 tháng (đã hết slot)" price="3.490.000đ" />,
    },
}

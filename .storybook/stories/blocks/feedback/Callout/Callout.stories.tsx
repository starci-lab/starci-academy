import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { Callout, STATUS_ACTION_CLASS } from "@/components/blocks/feedback/Callout"
import { Gallery, Variant } from "../../../../story-kit"
import { TONE_CONTENT, ACTION_EXAMPLES } from "./components"

/**
 * A tinted, flat note for use **inside a card / surface** — wraps HeroUI `Alert` +
 * `CloseButton` with a status-driven soft tint so it doesn't read as a card-in-card.
 */
const meta: Meta<typeof Callout> = {
    title: "Primitives/Feedback/Callout",
    component: Callout,
    args: {
        title: "Lesson saved",
        description: "Your progress syncs automatically after each completion.",
    },
}

export default meta
type Story = StoryObj<typeof Callout>

/**
 * Toàn bộ ma trận trạng thái của Callout: 5 tone (default/accent/success/warning/danger),
 * biến thể kèm action button cho 3 tone thường dùng để mời hành động, biến thể có thể đóng
 * (closable), và biến thể chỉ có title không có description. Dùng để tra chọn tone nào cho
 * ngữ cảnh nào, và khi nào nên thêm action/close/description.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Default"
                hint="Dùng cho thông báo trung tính trong card (nội dung nháp đã lưu, ghi chú hệ thống) — không mang sắc thái cảnh báo hay thành công."
            >
                <Callout
                    status="default"
                    title={TONE_CONTENT.default.title}
                    description={TONE_CONTENT.default.description}
                />
            </Variant>
            <Variant
                label="Accent"
                hint="Dùng cho thông tin đáng chú ý nhưng không phải cảnh báo — một bản cập nhật hoặc tính năng mới người dùng nên biết."
            >
                <Callout
                    status="accent"
                    title={TONE_CONTENT.accent.title}
                    description={TONE_CONTENT.accent.description}
                />
            </Variant>
            <Variant
                label="Success"
                hint="Dùng để xác nhận một hành động vừa hoàn tất thành công — một bài nộp đã ghi nhận, một thao tác thành công."
            >
                <Callout
                    status="success"
                    title={TONE_CONTENT.success.title}
                    description={TONE_CONTENT.success.description}
                />
            </Variant>
            <Variant
                label="Warning"
                hint="Dùng để nhắc người dùng xử lý điều gì đó trước khi quá muộn — hạn nộp gần tới, việc chưa hoàn thành; không dùng cho lỗi đã xảy ra rồi."
            >
                <Callout
                    status="warning"
                    title={TONE_CONTENT.warning.title}
                    description={TONE_CONTENT.warning.description}
                />
            </Variant>
            <Variant
                label="Danger"
                hint="Dùng để báo một thao tác vừa thất bại và người dùng cần xử lý hoặc thử lại — lỗi kết nối, bài nộp thất bại."
            >
                <Callout
                    status="danger"
                    title={TONE_CONTENT.danger.title}
                    description={TONE_CONTENT.danger.description}
                />
            </Variant>
            {ACTION_EXAMPLES.map((example) => (
                <Variant
                    key={example.status}
                    label={`Có action — ${example.label}`}
                    hint={`${example.when} Nút hành động luôn dùng variant="secondary" + STATUS_ACTION_CLASS (không dùng "secondary" mặc định của HeroUI vì nền gần-trắng của nó lẫn vào màu tint của callout) — nền đặc bg-<status> + text-<status>-foreground, tách rõ khỏi nền nhạt của callout mà vẫn cùng nhóm màu với tone, không ép accent đặc lên mọi tone.`}
                >
                    <Callout
                        status={example.status}
                        title={example.title}
                        description={example.description}
                        icon={example.icon}
                        action={(
                            <Button size="sm" variant="secondary" className={STATUS_ACTION_CLASS[example.status]}>
                                {example.actionLabel}
                            </Button>
                        )}
                    />
                </Variant>
            ))}
            <Variant
                label="Có thể đóng (Closable)"
                hint="Dùng cho cảnh báo người dùng có thể đóng sau khi đọc (kết nối chập chờn) — không dùng cho lỗi buộc phải xử lý."
            >
                <Callout
                    status="warning"
                    title="Unstable connection"
                    description="Some features may run slower than usual."
                    onClose={() => {}}
                    closeAriaLabel="Dismiss notice"
                />
            </Variant>
            <Variant
                label="Chỉ có title (Title only)"
                hint="Dùng khi nội dung đã rõ trong một dòng ngắn (đã lưu bản nháp) — tránh thêm description gây rối."
            >
                <Callout status="default" title="Draft saved" description={undefined} />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của Callout: 5 tone (default/accent/success/warning/danger), " +
            "biến thể kèm action button cho 3 tone thường dùng để mời hành động, biến thể có thể đóng " +
            "(closable), và biến thể chỉ có title không có description. Dùng để tra chọn tone nào cho " +
            "ngữ cảnh nào, và khi nào nên thêm action/close/description.",
    },
}

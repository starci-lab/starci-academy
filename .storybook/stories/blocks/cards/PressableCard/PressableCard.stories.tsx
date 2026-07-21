import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { PressableCard } from "@/components/blocks/cards/PressableCard"
import { NavTileContent, OptionCardContent, LinkCardPrototype } from "./components"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof PressableCard> = {
    title: "Blocks/Cards/PressableCard",
    component: PressableCard,
}

export default meta

type Story = StoryObj<typeof PressableCard>

/**
 * Toàn bộ ma trận trạng thái của PressableCard: thẻ điều hướng cơ bản, prototype
 * link-card gạch chân khi hover, thẻ có nút bấm riêng bên trong (stretched-link),
 * và trạng thái tạm khoá. Dùng để tra khi nào chọn state nào cho một khu vực cụ thể.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Dùng cho thẻ điều hướng bấm-là-chuyển-màn (vào một path, mở một khoá học) — cả thẻ là MỘT vùng bấm duy nhất, không có nút con bên trong. Chữ trong children đã là tên đọc được của thẻ nên không cần label — chỉ truyền label khi thẻ không có chữ nào cả (thẻ chỉ có icon)."
            >
                <PressableCard onPress={() => {}}>
                    <NavTileContent />
                </PressableCard>
            </Variant>
            <Variant
                label="Link-card (gạch chân khi hover)"
                hint="PROTOTYPE (chưa bake vào PressableCard) — dùng khi cả thẻ chỉ để điều hướng sang trang khác (một bài viết, một path); bấm chạy router.push, rê chuột gạch chân tiêu đề để rõ đây là link, KHÔNG có nền phủ, KHÔNG có CTA Đọc/Xem riêng. Khi hình dạng chốt xong, các prop title/subtitle/hover=&quot;underline&quot; sẽ được thêm vào PressableCard."
            >
                <div className="flex max-w-md flex-col gap-3">
                    <LinkCardPrototype title="Why do learners drop out of courses?" subtitle="12.4k reads" />
                    <LinkCardPrototype title="The path to becoming a Senior Backend engineer" subtitle="9.1k reads" />
                </div>
            </Variant>
            <Variant
                label="Có nút bấm riêng bên trong (2 nút)"
                hint="Dùng khi thẻ cần thêm một vùng bấm THỨ HAI hoạt động độc lập với việc bấm cả thẻ — ví dụ thẻ tiến độ khoá học: bấm cả thẻ mở khoá học, nút Continue nhảy thẳng vào bài học đang học. Truyền qua actions + label → thẻ chuyển sang pattern stretched-link: một lớp phủ trong suốt che cả thẻ (bấm-cả-thẻ), 2 nút nằm TRÊN lớp phủ (source-order + z-10) nên bấm độc lập được. KHÔNG lồng button trong button/a (HTML sai + hỏng focus order + lý do thẻ bị cao ra khi nhồi 2 nút vào children kiểu cũ). Nếu nút chỉ lặp lại đúng đích của thẻ, bỏ nút và để thẻ tự làm."
            >
                <PressableCard
                    onPress={() => {}}
                    label="Open the Fullstack Mastery path"
                    actions={(
                        <>
                            <Button size="sm" variant="secondary" onPress={() => {}}>
                                Continue
                            </Button>
                            <Button size="sm" variant="tertiary" isIconOnly aria-label="More options" onPress={() => {}}>
                                ⋯
                            </Button>
                        </>
                    )}
                >
                    <NavTileContent />
                </PressableCard>
            </Variant>
            <Variant
                label="Tạm khoá (Disabled)"
                hint="Dùng khi lựa chọn tạm thời không khả dụng (gói đã hết slot) — vẫn hiện ra để người dùng biết nó tồn tại, nhưng bấm bị chặn + tắt hover. Trạng thái này chỉ dùng cho thẻ hành động có onPress; thẻ điều hướng qua href không tắt được bằng isDisabled — phải bỏ href. Thẻ vẫn đọc được đầy đủ, chỉ mờ đi, nên lý do không bấm được phải nằm trong chữ của children (ở đây là &quot;out of slots&quot;) — đừng để mắt phải đoán từ độ mờ."
            >
                <PressableCard isDisabled onPress={() => {}}>
                    <OptionCardContent label="12-month plan (out of slots)" price="3,490,000đ" />
                </PressableCard>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của PressableCard: thẻ điều hướng cơ bản, prototype link-card " +
            "gạch chân khi hover, thẻ có nút bấm riêng bên trong (stretched-link), và trạng thái tạm khoá. " +
            "Dùng khi cần tra chọn state nào cho một khu vực cụ thể, và xác nhận đúng lúc nào dùng actions " +
            "thay vì để thẻ tự bấm.",
    },
}

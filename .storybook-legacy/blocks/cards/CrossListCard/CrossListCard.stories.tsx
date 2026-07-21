import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { CrossListCard, CrossListItem } from "@/components/blocks/cards/CrossListCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof CrossListCard> = {
    title: "Legacy/Blocks/Cards/CrossListCard",
    component: CrossListCard,
}
export default meta
type Story = StoryObj<typeof CrossListCard>

/**
 * Toàn bộ trạng thái của CrossListCard: mặc định (đứng riêng, có shadow) và khi
 * nằm trong một surface khác (bordered, không shadow). CrossListCard là mirror
 * ÂM của CheckListCard — mỗi dòng là một điều KHÔNG có/không đáp ứng.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Đối lập với CheckListCard: danh sách các điều KHÔNG bao gồm/không đáp ứng — tính năng không có trong plan, giới hạn, điều kiện chưa đạt. Icon `XCircleIcon` MỜ (text-muted, không phải danger/error), chỉ đọc. Cần dòng bấm được → SurfaceListCard; cần điều ĐÃ đạt (✓) → CheckListCard."
            >
                <div className="w-80">
                    <CrossListCard>
                        <CrossListItem><Typography type="body-sm">Grading with a premium model</Typography></CrossListItem>
                        <CrossListItem><Typography type="body-sm">Unlimited mock interviews</Typography></CrossListItem>
                        <CrossListItem><Typography type="body-sm">Priority support over email</Typography></CrossListItem>
                    </CrossListCard>
                </div>
            </Variant>
            <Variant
                label="Trong surface khác (bordered)"
                hint="Khi nằm trong modal/drawer/panel: dùng `bordered` → viền thay cho bóng đổ (bóng đổ vô hình trên nền surface). Giống rule của `CheckListCard bordered` / `SurfaceListCard bordered`."
            >
                <div className="w-80 rounded-3xl bg-surface p-3 shadow-surface">
                    <CrossListCard bordered>
                        <CrossListItem><Typography type="body-sm">Export a PDF certificate</Typography></CrossListItem>
                        <CrossListItem><Typography type="body-sm">Weekly 1-on-1 mentoring</Typography></CrossListItem>
                    </CrossListCard>
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của CrossListCard: mặc định (đứng riêng, shadow) và khi nằm trong " +
            "surface khác (bordered, không shadow). CrossListCard là mirror ÂM của CheckListCard — mỗi " +
            "dòng là một điều KHÔNG bao gồm/không đáp ứng, icon XCircleIcon mờ chứ không phải trạng thái lỗi.",
    },
}

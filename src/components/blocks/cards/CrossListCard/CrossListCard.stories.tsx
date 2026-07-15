import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { CrossListCard, CrossListItem } from "./index"

const meta: Meta<typeof CrossListCard> = {
    title: "Core/Card/CrossListCard",
    component: CrossListCard,
}
export default meta
type Story = StoryObj<typeof CrossListCard>

/** Mirror ÂM của CheckListCard: mỗi dòng có dấu ✗ mờ — thứ KHÔNG có/không đạt (gói không kèm, giới hạn). */
export const Default: Story = {
    parameters: { usage: "Ngược lại CheckListCard: danh sách 'KHÔNG có / không đạt' — tính năng gói không kèm, giới hạn, điều kiện chưa đủ. Icon `XCircleIcon` MỜ (text-muted, không phải danger/lỗi), read-only. Cần dòng bấm được → SurfaceListCard; cần thứ ĐẠT được (✓) → CheckListCard." },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Không kèm trong gói</Label>
                <Typography type="body-sm" color="muted">
                    Mỗi dòng là thứ gói này KHÔNG có — dấu ✗ mờ, sắc thái trung tính (không phải lỗi).
                </Typography>
            </div>
            <CrossListCard>
                <CrossListItem><Typography type="body-sm">Chấm bài bằng mô hình cao cấp</Typography></CrossListItem>
                <CrossListItem><Typography type="body-sm">Phỏng vấn thử không giới hạn</Typography></CrossListItem>
                <CrossListItem><Typography type="body-sm">Hỗ trợ ưu tiên qua email</Typography></CrossListItem>
            </CrossListCard>
        </div>
    ),
}

/** Nằm trong surface khác (modal/drawer/panel): `bordered` → viền thay shadow (surface-in-surface). */
export const SurfaceInSurface: Story = {
    parameters: { usage: "Trong modal/drawer/panel: truyền `bordered` — dùng viền thay shadow (shadow vô hình trên nền surface). Giống rule `CheckListCard bordered` / `SurfaceListCard bordered`." },
    render: () => (
        <div className="w-80 rounded-3xl bg-surface p-4 shadow-surface">
            <CrossListCard bordered>
                <CrossListItem><Typography type="body-sm">Xuất chứng chỉ PDF</Typography></CrossListItem>
                <CrossListItem><Typography type="body-sm">Cố vấn 1-1 hằng tuần</Typography></CrossListItem>
            </CrossListCard>
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ResponsiveBreadcrumb } from "./index"

const meta: Meta<typeof ResponsiveBreadcrumb> = {
    title: "Block/Navigation/ResponsiveBreadcrumb",
    component: ResponsiveBreadcrumb,
}
export default meta
type Story = StoryObj<typeof ResponsiveBreadcrumb>

/**
 * Bản ĐẦY ĐỦ `Home › … › Current` trên desktop — đây chính là thứ làm ResponsiveBreadcrumb KHÁC BackLink
 * (BackLink chỉ có một mũi "Trở lại"). Chỉ hiện khi trail ngắn (<4 crumb) VÀ bề rộng >= sm; hẹp hơn thì tự
 * thu gọn thành BackLink. Drop vào slot `breadcrumb` của `PageHeader`.
 */
export const Default: Story = {
    parameters: {
        usage: "Bản ĐẦY ĐỦ `Home › … › Current` trên desktop — đây là thứ làm ResponsiveBreadcrumb khác `BackLink` (chỉ có một mũi \"Trở lại\"). Chỉ hiện khi trail ngắn (<4 crumb) VÀ màn >= sm; hẹp hơn tự thu gọn thành `BackLink`. Drop vào slot `breadcrumb` của `PageHeader`.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Trail đầy đủ</Label>
                <Typography type="body-sm" color="muted">
                    Bản đầy đủ Home › … › Current trên desktop — đây là điểm khác BackLink. Trail ngắn (dưới 4 crumb) và màn từ sm trở lên mới hiện; hẹp hơn thì tự thu gọn.
                </Typography>
            </div>
            <ResponsiveBreadcrumb
                items={[
                    { key: "home", label: "Trang chủ", onPress: () => { } },
                    { key: "courses", label: "Khoá học", onPress: () => { } },
                    { key: "current", label: "Fullstack Mastery" },
                ]}
            />
        </div>
    ),
}

/**
 * Từ 4 crumb trở lên (hoặc trên mobile) → TÁI DÙNG chính `BackLink` "Trở lại". Đây là reuse CÓ CHỦ ĐÍCH,
 * không phải trùng: trail dài wrap + nuốt chiều cao, mà tổ tiên sâu đã tới được từ top nav nên chỉ cần một
 * lối lùi. Đích lùi = tổ tiên gần nhất còn bấm được.
 */
export const ThuGon: Story = {
    parameters: {
        usage: "Từ 4 crumb trở lên (hoặc trên mobile) → TÁI DÙNG chính `BackLink` \"Trở lại\" (reuse có chủ đích, không phải trùng): trail dài wrap + nuốt chiều cao, tổ tiên sâu đã tới được từ top nav. Đích lùi = tổ tiên gần nhất còn bấm được.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Thu gọn (≥4 crumb → BackLink)</Label>
                <Typography type="body-sm" color="muted">
                    Từ 4 crumb trở lên (hoặc trên mobile) tự tái dùng chính BackLink — reuse có chủ đích, không phải trùng. Trail dài wrap và nuốt chiều cao, tổ tiên sâu đã tới được từ top nav.
                </Typography>
            </div>
            <ResponsiveBreadcrumb
                items={[
                    { key: "home", label: "Trang chủ", onPress: () => { } },
                    { key: "courses", label: "Khoá học", onPress: () => { } },
                    { key: "fullstack", label: "Fullstack Mastery", onPress: () => { } },
                    { key: "current", label: "Bài 4: Thiết kế API" },
                ]}
            />
        </div>
    ),
}

/** Dùng khi trang hiện tại chính là gốc điều hướng, không có tổ tiên nào để quay về nên không render nút quay lại. */
export const RootOnly: Story = {
    parameters: {
        usage: "Dùng khi trang hiện tại chính là gốc điều hướng, không có tổ tiên nào để quay về nên không render nút quay lại.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Trang gốc</Label>
                <Typography type="body-sm" color="muted">
                    Khi trang hiện tại chính là gốc điều hướng — không có tổ tiên để quay về nên không render nút quay lại.
                </Typography>
            </div>
            <ResponsiveBreadcrumb
                items={[
                    { key: "current", label: "Trang chủ" },
                ]}
            />
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ResponsiveBreadcrumb> = {
    title: "Legacy/Blocks/Navigation/ResponsiveBreadcrumb",
    component: ResponsiveBreadcrumb,
}
export default meta
type Story = StoryObj<typeof ResponsiveBreadcrumb>

/**
 * Toàn bộ ma trận trạng thái của ResponsiveBreadcrumb: trail đầy đủ, trail dài
 * tự collapse thành BackLink, và trang gốc không có back button. Dùng để tra
 * khi nào breadcrumb hiện đủ `Home › … › Current` và khi nào nó tự thu lại.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Full trail"
                hint="Trail đầy đủ Home › … › Current trên desktop — đây là điểm khác biệt so với BackLink (chỉ có một mũi tên Back). Chỉ hiện khi trail ngắn (dưới 4 crumb) và màn hình từ sm trở lên; hẹp hơn thì tự thu lại thành BackLink."
            >
                <ResponsiveBreadcrumb
                    items={[
                        { key: "home", label: "Home", onPress: () => { } },
                        { key: "courses", label: "Courses", onPress: () => { } },
                        { key: "current", label: "Fullstack Mastery" },
                    ]}
                />
            </Variant>
            <Variant
                label="Collapsed (≥4 crumb → BackLink)"
                hint="Từ 4 crumb trở lên (hoặc trên mobile) breadcrumb tái dùng chính BackLink 'Back' — tái dùng có chủ đích, không phải trùng lặp: trail dài sẽ xuống dòng và ăn chiều cao, mà một trang con sâu vốn được vào từ top nav nên chỉ cần một đường lùi lại. Đích lùi = tổ tiên gần nhất còn bấm được."
            >
                <ResponsiveBreadcrumb
                    items={[
                        { key: "home", label: "Home", onPress: () => { } },
                        { key: "courses", label: "Courses", onPress: () => { } },
                        { key: "fullstack", label: "Fullstack Mastery", onPress: () => { } },
                        { key: "current", label: "Lesson 4: API design" },
                    ]}
                />
            </Variant>
            <Variant
                label="Root page"
                hint="Khi trang hiện tại chính là gốc điều hướng — không có tổ tiên nào để lùi về, nên không render nút back."
            >
                <ResponsiveBreadcrumb
                    items={[
                        { key: "current", label: "Home" },
                    ]}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của ResponsiveBreadcrumb: trail đầy đủ (dưới 4 crumb, từ sm trở lên), " +
            "trail dài tự collapse thành BackLink (từ 4 crumb hoặc trên mobile, tái dùng BackLink có chủ đích), " +
            "và trang gốc không có back button. Drop vào slot `breadcrumb` của `PageHeader`.",
    },
}

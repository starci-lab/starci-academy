import type { Meta, StoryObj } from "@storybook/nextjs"
import { EntityLink } from "@/components/blocks/feed/EntityLink"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof EntityLink> = {
    title: "Legacy/Blocks/Feed/EntityLink",
    component: EntityLink,
}
export default meta
type Story = StoryObj<typeof EntityLink>

/**
 * Every state an inline entity reference can be in inside a feed sentence:
 * resolvable (bold + clickable), unresolvable (bold plain text, never a dead
 * link), and resolving (clickable but disabled while the feature navigates).
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng EntityLink cho mỗi mốc thực thể (người, bài học, thử thách, khóa học) trong câu activity của feed — feature truyền onPress đã resolve route sẵn, block chỉ lo phần chữ đậm + gạch chân khi hover.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Có thể bấm"
                hint="Có onPress — feature đã resolve được route đích, ví dụ mở trang cá nhân hoặc trang bài học."
            >
                <span>
                    <EntityLink label="quochuy_backend" onPress={() => {}} />
                    {" "}đã hoàn thành thử thách{" "}
                    <EntityLink label="Xử lý luồng bất đồng bộ" onPress={() => {}} />
                </span>
            </Variant>
            <Variant
                label="Không thể bấm"
                hint="Bỏ onPress khi feature không resolve được route (thực thể đã bị xoá) — render chữ đậm bình thường, không phải link chết."
            >
                <span>
                    <EntityLink label="minhanh_dev" onPress={() => {}} />
                    {" "}đã theo dõi{" "}
                    <EntityLink label="học viên đã xoá tài khoản" />
                </span>
            </Variant>
            <Variant
                label="Đang resolve/điều hướng"
                hint="isPending=true trong lúc feature đang resolve route hoặc đang điều hướng — vẫn là link nhưng disable, tránh bấm lại chồng lệnh."
            >
                <span>
                    <EntityLink label="thuha_ux" onPress={() => {}} isPending />
                    {" "}đã đạt mốc{" "}
                    <EntityLink label="Thiết kế hệ thống cho ứng dụng doanh nghiệp" onPress={() => {}} isPending />
                </span>
            </Variant>
        </Gallery>
    ),
}

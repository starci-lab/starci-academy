import type { Meta, StoryObj } from "@storybook/nextjs"
import { GearIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@heroui/react"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { Gallery, Variant } from "../../../../story-kit"
import { CONTENT_TABS, Controlled, LANGUAGE_TABS } from "./components"

const meta: Meta<typeof TabsCard> = {
    title: "Legacy/Blocks/Navigation/TabsCard",
    component: TabsCard,
}
export default meta
type Story = StoryObj<typeof TabsCard>

/**
 * Toàn bộ ma trận trạng thái của TabsCard: một nhóm tab (chuyển cả panel), hai
 * nhóm tab kèm bản mobile (`rightTabsNeutral` + `collapseRightOnMobile`), kèm
 * action bên cạnh tab trái, và biến thể `primary` full-width có tab bị khoá.
 * Dùng để tra khi nào chọn 1 vs 2 nhóm tab, khi nào `primary` vs `secondary`,
 * và cách nhóm phải gập lại thành dropdown trên mobile.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Một nhóm tab (chuyển cả panel)"
                hint="Bấm một tab SWITCH TOÀN BỘ panel bên dưới, hoặc chuyển sang route khác (navigation, gạch chân). Số lượng tab không quyết định — 2 tab vẫn là TabsCard nếu nó chuyển cả panel; CÁI GÌ nó điều khiển mới là điều quyết định."
            >
                <Controlled
                    leftItems={CONTENT_TABS}
                    defaultLeftKey="overview"
                />
            </Variant>
            <Variant
                label="Hai nhóm tab + bản mobile"
                hint="`leftTabs` (trục nội dung chính, accent) ghim trái + `rightTabs` (bộ chuyển phụ, ví dụ ngôn ngữ) ghim phải. `rightTabsNeutral` giữ nhóm phải trung tính để cả dòng chỉ có một tín hiệu accent. `collapseRightOnMobile` = nhóm phải gập thành dropdown dưới mốc `sm` rồi giãn lại thành tab từ `sm` lên — resize màn hình để thấy. Dùng khi nhóm phải là một tuỳ chọn set-once (ngôn ngữ) dễ chiếm chỗ cột đọc hẹp."
            >
                <Controlled
                    leftItems={CONTENT_TABS}
                    defaultLeftKey="overview"
                    rightItems={LANGUAGE_TABS}
                    rightAriaLabel="Language"
                    defaultRightKey="vi"
                    rightTabsNeutral
                    collapseRightOnMobile
                />
            </Variant>
            <Variant
                label="Kèm action bên cạnh tab trái"
                hint="Dùng khi cần gắn một hành động liên quan (thêm, quản lý) ngay cạnh nhóm tab trái mà không nhúng nó vào trong một tab (`leftEnd` là sibling của tab list, không phải một `Tabs.Tab`)."
            >
                <Controlled
                    leftItems={CONTENT_TABS}
                    defaultLeftKey="overview"
                    leftEnd={(
                        <Button isIconOnly variant="ghost" size="sm" aria-label="Add new section">
                            <PlusIcon size={16} />
                        </Button>
                    )}
                />
            </Variant>
            <Variant
                label="Biến thể primary — có tab bị khoá"
                hint="Dùng cho tab chuyển một khu vực cấp trang (`variant=&quot;primary&quot;`, không phải bộ lọc nội dung) — dải segmented full-width, có thể chứa một tab bị khoá/disabled."
            >
                <Controlled
                    leftItems={[
                        { key: "start", label: "Start", icon: <GearIcon size={16} /> },
                        { key: "history", label: "History" },
                        { key: "stats", label: "Stats", isDisabled: true },
                    ]}
                    leftAriaLabel="Area"
                    defaultLeftKey="start"
                    variant="primary"
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của TabsCard: một nhóm tab (chuyển cả panel), hai nhóm tab kèm " +
            "bản mobile (`rightTabsNeutral` + `collapseRightOnMobile`), kèm action bên cạnh tab trái, và " +
            "biến thể `primary` full-width có tab bị khoá. Số lượng tab không quyết định loại — CÁI GÌ nó " +
            "điều khiển mới quyết định đây có phải TabsCard hay không.",
    },
}

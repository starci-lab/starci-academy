import type { Meta, StoryObj } from "@storybook/nextjs"
import { LanguageChip } from "@/components/blocks/chips/LanguageChip"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof LanguageChip> = {
    title: "Features/Chips/LanguageChip",
    component: LanguageChip,
}
export default meta
type Story = StoryObj<typeof LanguageChip>

/**
 * Toàn bộ 14 màu brand GitHub-linguist đặt cạnh nhau, cộng trường hợp ngôn ngữ
 * không xác định — đây là chip DUY NHẤT thoát khỏi 5 màu semantic, nên tra ở đây
 * trước khi tự tô màu ngôn ngữ ở nơi khác. Cùng nguồn màu với `LanguageDonut` nên
 * hai chỗ luôn khớp nhau.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Ngôn ngữ có màu brand"
                hint="Khi language key có trong bảng linguist. Dot dùng đúng hex của ngôn ngữ đó nên màu ở đây KHÔNG đi qua semantic token: Go ra cyan, Javascript ra vàng, Rust ra cam cháy. Key có tên hiển thị riêng (csharp, cpp, php) tự đổi thành C#, C++, PHP."
            >
                <div className="flex flex-col gap-2">
                    <LanguageChip language="typescript" />
                    <LanguageChip language="javascript" />
                    <LanguageChip language="python" />
                    <LanguageChip language="java" />
                    <LanguageChip language="go" />
                    <LanguageChip language="csharp" />
                    <LanguageChip language="cpp" />
                    <LanguageChip language="c" />
                    <LanguageChip language="rust" />
                    <LanguageChip language="kotlin" />
                    <LanguageChip language="php" />
                    <LanguageChip language="ruby" />
                    <LanguageChip language="swift" />
                    <LanguageChip language="dart" />
                </div>
            </Variant>
            <Variant
                label="Ngôn ngữ không xác định"
                hint="Khi key không có trong bảng linguist. Chip vẫn render với dot xám trung tính thay vì vỡ hoặc bỏ dot, nên cứ truyền thẳng giá trị từ server, không cần lọc trước."
            >
                <LanguageChip language="cobol" />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Bảng tra 14 màu brand GitHub-linguist (nguồn: `getLanguageColor`) + trường hợp ngôn ngữ " +
            "không xác định. Dùng để chỉ ngôn ngữ của một submission/repo: dot mang màu, chữ giữ " +
            "`body-xs` muted — KHÔNG phải pill. Đây là ngoại lệ CHỦ Ý của luật \"chỉ token, không hex\": " +
            "màu brand từ bên ngoài app (như logo GitHub), không thuộc semantic palette. Cùng nguồn màu " +
            "với `LanguageDonut` nên hai nơi luôn khớp.",
    },
}

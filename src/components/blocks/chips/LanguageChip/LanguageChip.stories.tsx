import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { LanguageChip } from "./index"

const meta: Meta<typeof LanguageChip> = {
    title: "Core/Chip/LanguageChip",
    component: LanguageChip,
}
export default meta
type Story = StoryObj<typeof LanguageChip>

/** Cả 14 màu thương hiệu GitHub-linguist cạnh nhau, cộng ca ngôn ngữ lạ — đây là chip DUY NHẤT thoát khỏi 5 màu semantic, nên tra ở đây trước khi định tự tô màu ngôn ngữ chỗ khác. */
export const AllLanguages: Story = {
    parameters: { usage: "Bảng tra 14 màu thương hiệu GitHub-linguist (nguồn: `getLanguageColor`) + ca ngôn ngữ lạ. Dùng khi cần chỉ ngôn ngữ của một bài nộp/repo: chấm mang màu, chữ để `body-xs` muted — KHÔNG phải pill. Đây là ngoại lệ CÓ CHỦ Ý của luật \"chỉ dùng token, không hex\": màu thương hiệu ngoài app (như logo GitHub), không thuộc bảng màu semantic. Cùng nguồn màu với `LanguageDonut` nên hai chỗ luôn khớp." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Ngôn ngữ có màu thương hiệu</Label>
                    <Typography type="body-sm" color="muted">
                        Khi key ngôn ngữ nằm trong bảng linguist. Chấm lấy đúng hex của ngôn ngữ đó nên thang màu ở đây KHÔNG đi qua token semantic: Go ra cyan, Javascript ra amber, Rust ra nâu cam. Các key có tên hiển thị riêng (csharp, cpp, php) tự đổi thành C#, C++, PHP.
                    </Typography>
                </div>
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
            </div>
            <div className="flex flex-col items-start gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Ngôn ngữ lạ</Label>
                    <Typography type="body-sm" color="muted">
                        Khi key không có trong bảng linguist. Chip vẫn render với chấm xám trung tính thay vì vỡ hoặc mất chấm, nên cứ truyền thẳng giá trị từ server, không cần lọc trước.
                    </Typography>
                </div>
                <LanguageChip language="cobol" />
            </div>
        </div>
    ),
}

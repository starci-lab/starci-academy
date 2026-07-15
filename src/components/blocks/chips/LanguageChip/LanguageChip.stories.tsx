import type { Meta, StoryObj } from "@storybook/nextjs"
import { LanguageChip } from "./index"

const meta: Meta<typeof LanguageChip> = {
    title: "Blocks/Chip/LanguageChip",
    component: LanguageChip,
}
export default meta
type Story = StoryObj<typeof LanguageChip>

/** Dùng khi hiển thị ngôn ngữ chính của một repo/bài nộp, kiểu tag ngôn ngữ trên GitHub. */
export const Default: Story = {
    parameters: { usage: "Dùng khi hiển thị ngôn ngữ chính của một repo/bài nộp, kiểu tag ngôn ngữ trên GitHub." },
    render: () => <LanguageChip language="typescript" />,
}

/** Dùng khi cần phân biệt các ngôn ngữ có tên hiển thị đặc biệt như C# hoặc C++ thay vì viết hoa đơn giản. */
export const SpecialCasedName: Story = {
    parameters: { usage: "Dùng khi cần phân biệt các ngôn ngữ có tên hiển thị đặc biệt như C# hoặc C++ thay vì viết hoa đơn giản." },
    render: () => (
        <div className="flex flex-col gap-2">
            <LanguageChip language="csharp" />
            <LanguageChip language="cpp" />
            <LanguageChip language="php" />
        </div>
    ),
}

/** Dùng khi ngôn ngữ không nằm trong danh sách màu thương hiệu đã biết, chip vẫn hiển thị được với màu trung tính. */
export const UnknownLanguage: Story = {
    parameters: { usage: "Dùng khi ngôn ngữ không nằm trong danh sách màu thương hiệu đã biết, chip vẫn hiển thị được với màu trung tính." },
    render: () => <LanguageChip language="cobol" />,
}

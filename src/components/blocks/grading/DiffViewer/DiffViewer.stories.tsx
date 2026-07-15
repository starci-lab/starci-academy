import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { DiffViewer } from "./index"
import type { DiffHunk } from "./index"

const meta: Meta<typeof DiffViewer> = {
    title: "Core/Rendering/CodeDiff",
    component: DiffViewer,
}
export default meta
type Story = StoryObj<typeof DiffViewer>

/** Một hunk nhỏ đã được phân tích sẵn: vài dòng ngữ cảnh, một dòng xoá và một dòng thêm. */
const sampleHunks: DiffHunk[] = [
    {
        header: "@@ -1,5 +1,6 @@ function login(token) {",
        lines: [
            { type: "ctx", content: "function login(token) {", oldNumber: 1, newNumber: 1 },
            { type: "ctx", content: "  const user = findUser()", oldNumber: 2, newNumber: 2 },
            { type: "del", content: "  return true", oldNumber: 3 },
            { type: "add", content: "  if (!verify(token)) return false", newNumber: 3 },
            { type: "add", content: "  return Boolean(user)", newNumber: 4 },
            { type: "ctx", content: "}", oldNumber: 4, newNumber: 5 },
        ],
    },
]

/** Dùng khi cần hiển thị khác biệt code cho phản hồi chấm bài — so bài của học viên với bản sửa gợi ý, dạng hợp nhất một cột với dấu +/- và nền màu theo token. */
export const Unified: Story = {
    parameters: {
        usage: "Dùng cho phản hồi chấm bài — so bài học viên với bản sửa gợi ý ở dạng hợp nhất một cột. Block nhận hunk đã phân tích sẵn (không tự chạy thuật toán diff); dòng thêm nền success, dòng xoá nền danger, dòng ngữ cảnh trung tính. Dòng dài cuộn ngang trong khung riêng.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Diff hợp nhất</Label>
                <Typography type="body-sm" color="muted">
                    Một khác biệt nhỏ có dòng thêm, dòng xoá và dòng ngữ cảnh, kèm thanh tiêu đề tên tệp và cột số dòng.
                </Typography>
            </div>
            <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} />
        </div>
    ),
}

/** Dùng khi muốn đặt tệp cũ bên trái và tệp mới bên phải — dòng xoá chỉ hiện bên trái, dòng thêm chỉ hiện bên phải, dòng ngữ cảnh hiện cả hai bên. */
export const Split: Story = {
    parameters: {
        usage: "Dùng biến thể split khi muốn đối chiếu tệp cũ bên trái với tệp mới bên phải. Dòng xoá chỉ hiện bên trái, dòng thêm chỉ hiện bên phải, dòng ngữ cảnh hiện ở cả hai bên với số dòng riêng từng phía.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Diff dạng chia đôi</Label>
                <Typography type="body-sm" color="muted">
                    Cùng dữ liệu hunk nhưng bố trí hai cột: tệp cũ bên trái, tệp mới bên phải.
                </Typography>
            </div>
            <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} variant="split" />
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { DiffViewer } from "./DiffViewer"
import type { DiffHunk } from "./DiffViewer"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof DiffViewer> = {
    title: "Block/Grading/DiffViewer",
    component: DiffViewer,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DiffViewer>

const ANATOMY = {
    primitives: [
        { name: "Typography", role: "tên file trên header bar (HeroUI base)" },
    ],
    reason:
        "Leaf renderer cho diff chấm bài: nhận hunks đã parse sẵn (không tự chạy thuật toán diff) rồi vẽ header tên file + gutter số dòng + nền màu theo token (thêm=success, xoá=danger, context=neutral). Không cấu thành từ Primitives/* — tự vẽ mọi hàng, nên đúng ra là một Primitive hơn là Block (xem FLAGS).",
}

/** A small pre-parsed hunk: a few context lines, one removed line and two added lines. */
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

export const Unified: Story = {
    render: () =>
        blockShell(
            <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} />,
            ANATOMY,
        ),
}

export const Split: Story = {
    render: () =>
        blockShell(
            <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} variant="split" />,
            ANATOMY,
        ),
}

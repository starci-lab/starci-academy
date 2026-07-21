import type { Meta, StoryObj } from "@storybook/nextjs"
import { DiffViewer } from "@/components/blocks/grading/DiffViewer"
import { Gallery, Variant } from "../../../../story-kit"
import { sampleHunks } from "./components"

const meta: Meta<typeof DiffViewer> = {
    title: "Features/Grading/DiffViewer",
    component: DiffViewer,
}
export default meta
type Story = StoryObj<typeof DiffViewer>

/**
 * Toàn bộ ma trận trạng thái của DiffViewer: layout unified (một cột, +/-
 * kèm màu nền theo token) và layout split (hai cột, file cũ bên trái/file
 * mới bên phải). Dùng để tra khi nào chọn variant nào cho màn chấm bài.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Unified"
                hint="Dùng cho phản hồi chấm bài — so sánh bài nộp của học viên với bản sửa gợi ý trong một cột duy nhất. Block nhận hunks đã parse sẵn (không tự chạy thuật toán diff); dòng thêm nền success, dòng xoá nền danger, dòng context giữ neutral. Dòng dài tự cuộn ngang trong container riêng."
            >
                <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} />
            </Variant>
            <Variant
                label="Split"
                hint="Dùng khi cần so sánh file cũ (bên trái) với file mới (bên phải) — dòng xoá chỉ hiện bên trái, dòng thêm chỉ hiện bên phải, dòng context hiện cả hai bên với số dòng riêng từng bên."
            >
                <DiffViewer filename="src/auth/login.ts" hunks={sampleHunks} variant="split" />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của DiffViewer: unified (một cột, +/- kèm màu nền theo " +
            "token) và split (hai cột, file cũ bên trái/file mới bên phải, số dòng riêng từng bên). " +
            "Dùng khi cần tra layout nào phù hợp cho phản hồi chấm bài.",
    },
}

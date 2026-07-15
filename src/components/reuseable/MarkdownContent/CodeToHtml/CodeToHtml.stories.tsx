import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { CodeToHtml } from "./index"

const meta: Meta<typeof CodeToHtml> = {
    title: "Core/Rendering/Code",
    component: CodeToHtml,
}

export default meta

type Story = StoryObj<typeof CodeToHtml>

const TS_SAMPLE = `interface HocVien {
    id: string
    hoTen: string
    diemTrungBinh: number
}

const xepLoai = (hocVien: HocVien): string => {
    if (hocVien.diemTrungBinh >= 8) return "Giỏi"
    return "Khá"
}`

const JS_SAMPLE = `function tinhTongDon(gioHang) {
    return gioHang.reduce((tong, sanPham) => tong + sanPham.gia * sanPham.soLuong, 0)
}`

const BASH_SAMPLE = `npm install
npm run build
npm run start:prod`

/** Khối code TypeScript được Shiki tô màu cú pháp, theme sáng — dùng cho snippet trong bài học/flashcard. */
export const TypeScript: Story = {
    parameters: { usage: "Hiển thị một khối code TypeScript có tô màu cú pháp — dùng trong nội dung bài học/flashcard." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>TypeScript (theme sáng)</Label>
                <Typography type="body-sm" color="muted">
                    Khối code TS tô màu cú pháp bằng Shiki, theme sáng — cho snippet trong bài học/flashcard.
                </Typography>
            </div>
            <div className="max-w-xl">
                <CodeToHtml code={TS_SAMPLE} language="ts" theme="material-theme-lighter" />
            </div>
        </div>
    ),
}

/** Khối code JavaScript, theme tối — soi nhánh dark-mode của Shiki. */
export const JavaScriptDark: Story = {
    parameters: { usage: "Hiển thị khối code JavaScript ở theme tối — dùng khi trang đang ở dark mode." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>JavaScript (theme tối)</Label>
                <Typography type="body-sm" color="muted">
                    Khối code JS ở theme tối — soi nhánh dark-mode của Shiki, dùng khi trang đang ở dark mode.
                </Typography>
            </div>
            <div className="max-w-xl">
                <CodeToHtml code={JS_SAMPLE} language="js" theme="material-theme-darker" />
            </div>
        </div>
    ),
}

/** Khối lệnh shell/bash — cho hướng dẫn cài đặt/chạy dự án. */
export const Bash: Story = {
    parameters: { usage: "Hiển thị khối lệnh shell/bash — dùng cho hướng dẫn cài đặt hoặc câu lệnh chạy dự án." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Shell / Bash</Label>
                <Typography type="body-sm" color="muted">
                    Khối lệnh shell/bash — cho hướng dẫn cài đặt hoặc câu lệnh chạy dự án.
                </Typography>
            </div>
            <div className="max-w-xl">
                <CodeToHtml code={BASH_SAMPLE} language="bash" theme="material-theme-lighter" />
            </div>
        </div>
    ),
}

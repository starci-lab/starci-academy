import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ResizableRail } from "./index"

const meta: Meta<typeof ResizableRail> = {
    title: "Blocks/Layout/ResizableRail",
    component: ResizableRail,
}
export default meta
type Story = StoryObj<typeof ResizableRail>

/** Rail body — mock outline standing in for a real course outline. */
const RailBody = ({ count }: { count: number }) => (
    <nav className="flex h-full flex-col gap-3 overflow-y-auto p-4">
        <Typography type="body-sm" weight="semibold">Mục lục khoá học</Typography>
        <ul className="flex flex-col gap-2">
            {Array.from({ length: count }, (_, index) => (
                <li key={index}>
                    <Typography type="body-sm" color="muted">
                        {`${index + 1}. Chương học số ${index + 1}`}
                    </Typography>
                </li>
            ))}
        </ul>
    </nav>
)

/** Dùng khi bề rộng rail là thứ NGƯỜI ĐỌC nên tự quyết chứ không phải mình chọn hộ — mục lục có bài tên dài ngắn khác nhau, ai muốn rộng để đọc đủ, ai muốn hẹp để lấy chỗ cho nội dung chính. Rail cố định bề rộng thì đừng dùng block này, chỉ cần một div thường. Chiều rộng người đọc kéo được nhớ lại theo storageKey, nên hai rail khác nhau phải có key khác nhau. */
export const Default: Story = {
    parameters: { usage: "Dùng khi bề rộng rail là thứ NGƯỜI ĐỌC nên tự quyết chứ không phải mình chọn hộ — mục lục có bài tên dài ngắn khác nhau, ai muốn rộng để đọc đủ, ai muốn hẹp để lấy chỗ cho nội dung chính. Rail cố định bề rộng thì đừng dùng block này, chỉ cần một div thường. Chiều rộng người đọc kéo được nhớ lại theo `storageKey`, nên hai rail khác nhau phải có key khác nhau." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Rail kéo được</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái thường: nội dung ngắn hơn chiều cao shell nên chưa có gì cuộn. Kéo tay nắm ở mép phải để đổi bề rộng, tải lại story thì bề rộng vừa kéo vẫn còn.
                </Typography>
            </div>
            <div className="relative h-96 border border-separator">
                <ResizableRail storageKey="storybook-rail-default" ariaLabel="Kéo để đổi chiều rộng mục lục">
                    <RailBody count={5} />
                </ResizableRail>
            </div>
        </div>
    ),
}

/** Dùng để soi nhánh tràn: mục lục dài hơn shell thì phải cuộn BÊN TRONG rail, không được đẩy cao shell hay lòi ra ngoài. */
export const ScrollableContent: Story = {
    parameters: { usage: "Dùng để soi nhánh tràn: mục lục dài hơn shell thì phải cuộn BÊN TRONG rail, không được đẩy cao shell hay lòi ra ngoài." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nội dung tràn, cuộn trong rail</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái khi mục lục dài hơn chiều cao shell: khác nhánh trên ở chỗ rail tự sinh thanh cuộn riêng, còn shell giữ nguyên chiều cao. Kéo rộng hẹp lúc đang cuộn vẫn phải mượt.
                </Typography>
            </div>
            <div className="relative h-64 border border-separator">
                <ResizableRail storageKey="storybook-rail-scroll" ariaLabel="Kéo để đổi chiều rộng mục lục">
                    <RailBody count={20} />
                </ResizableRail>
            </div>
        </div>
    ),
}

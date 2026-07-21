import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, userEvent, waitFor } from "storybook/test"
import { Typography } from "@heroui/react"
import { SnippetIcon } from "@/components/blocks/identity/SnippetIcon"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SnippetIcon> = {
    title: "Blocks/Identity/SnippetIcon",
    component: SnippetIcon,
}
export default meta
type Story = StoryObj<typeof SnippetIcon>

/**
 * Nút sao chép 1 dòng lệnh/API key/đoạn text ngắn — đặt cạnh nội dung cần copy,
 * không phải trong khối code nhiều dòng (khi đó cần Toast xác nhận riêng vì icon
 * có thể nằm ngoài tầm mắt sau khi cuộn).
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Đặt SnippetIcon cạnh 1 dòng lệnh cài đặt, API key hay URL ngắn cần sao chép nhanh; dùng classNames.copyIcon/checkIcon khi nền xung quanh cần icon tương phản hơn mức mặc định.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định — chưa bấm"
                hint="Icon copy màu chữ thường, con trỏ pointer; đặt cạnh dòng lệnh hoặc API key cần sao chép."
            >
                <div className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                    <Typography type="body-sm" className="font-mono">
                        npm install @starciacademy/playground-agent
                    </Typography>
                    <SnippetIcon copyString="npm install @starciacademy/playground-agent" />
                </div>
            </Variant>

            <Variant
                label="Tuỳ biến màu icon qua classNames"
                hint="Ghi đè màu icon copy/check khi cần nhấn mạnh hơn nền xung quanh — vẫn cùng 1 block, chỉ đổi classNames.copyIcon/checkIcon."
            >
                <div className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                    <Typography type="body-sm" className="font-mono">
                        sk-live-51H8x2KJ9mQwErTyUiOp
                    </Typography>
                    <SnippetIcon
                        copyString="sk-live-51H8x2KJ9mQwErTyUiOp"
                        classNames={{ copyIcon: "text-accent", checkIcon: "text-success" }}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}

/**
 * Sau khi bấm: icon đổi sang check trong 350ms để xác nhận đã sao chép vào
 * clipboard, rồi tự quay lại icon copy — không cần chờ hay đóng gì thêm.
 */
export const Copied: Story = {
    parameters: {
        usage: "Trạng thái ngay sau khi bấm — icon check xác nhận đã sao chép vào clipboard, tự quay lại icon copy sau 350ms mà không cần Toast riêng.",
    },
    render: () => (
        <div className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
            <Typography type="body-sm" className="font-mono">
                git clone https://github.com/StarCi-Academy/rag-from-scratch
            </Typography>
            <SnippetIcon
                copyString="git clone https://github.com/StarCi-Academy/rag-from-scratch"
                className="copy-trigger"
                classNames={{ checkIcon: "check-icon" }}
            />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const trigger = canvasElement.querySelector(".copy-trigger") as HTMLElement
        await userEvent.click(trigger)
        await waitFor(() => expect(canvasElement.querySelector(".check-icon")).toBeInTheDocument())
    },
}

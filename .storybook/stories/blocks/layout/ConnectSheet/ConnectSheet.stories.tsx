import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { ConnectSheet } from "@/components/blocks/layout/ConnectSheet"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ConnectSheet> = {
    title: "Blocks/Layout/ConnectSheet",
    component: ConnectSheet,
}
export default meta
type Story = StoryObj<typeof ConnectSheet>

/**
 * The panel behind the sheet in every demo — stands in for the playground
 * canvas the sheet docks over. Fixed height + `overflow-hidden` so the sheet's
 * `absolute inset-x-0 bottom-0` has a `relative` ancestor to dock against,
 * same trick as the real `PlaygroundPrepare` screen.
 */
const Backdrop = ({ children }: { children: ReactNode }) => (
    <div className="relative h-[30rem] w-full max-w-sm overflow-hidden rounded-3xl border border-default bg-background p-4">
        <Typography type="body-sm" weight="semibold">Docker Playground</Typography>
        <Typography type="body-sm" color="muted">
            Máy chủ lab đã sẵn sàng. Nối StarCi Agent để bắt đầu gõ lệnh.
        </Typography>
        {children}
    </div>
)

/** Peek row for the "waiting for agent" phase — status dot + one-time code. */
const WaitingPeek = () => (
    <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-warning" />
            <Typography type="body-sm" weight="semibold">Đang chờ agent kết nối…</Typography>
        </div>
        <Typography type="body-xs" color="muted">Mã: 482-931</Typography>
    </div>
)

/** Peek row for the "connected" phase. */
const ConnectedPeek = () => (
    <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-success" />
        <Typography type="body-sm" weight="semibold">Agent đã kết nối — sẵn sàng chạy lệnh</Typography>
    </div>
)

/** Body content: the 3 steps to paste the one-time code into the local agent. */
const SetupSteps = () => (
    <div className="flex flex-col gap-2 pt-2">
        <Typography type="body-sm">1. Mở terminal trên máy của bạn</Typography>
        <Typography type="body-sm">
            2. Chạy <code>npx @starciacademy/playground-docker-agent</code>
        </Typography>
        <Typography type="body-sm">3. Dán mã 482-931 khi agent hỏi</Typography>
    </div>
)

/** Body content long enough to force the internal `overflow-auto` region to scroll. */
const LongLog = () => (
    <div className="flex flex-col gap-2 pt-2">
        {Array.from({ length: 14 }, (_, index) => (
            <Typography key={index} type="body-xs" color="muted">
                {`[19:0${index % 10}:12] Đang chờ phản hồi từ agent cục bộ…`}
            </Typography>
        ))}
    </div>
)

/** Local controlled wrapper — each gallery specimen owns its own open/close state. */
const ConnectSheetDemo = ({
    defaultOpen,
    peek,
    toggleLabel,
    children,
}: {
    defaultOpen: boolean
    peek: ReactNode
    toggleLabel: string
    children: ReactNode
}) => {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <ConnectSheet open={open} onOpenChange={setOpen} peek={peek} toggleLabel={toggleLabel}>
            {children}
        </ConnectSheet>
    )
}

/**
 * Every real state the shell renders: COLLAPSED (peek only, body dimmed and
 * inert underneath), EXPANDED (peek + body both live), and an EXPANDED body
 * long enough to overflow — it must scroll INSIDE the sheet, never grow past
 * the viewport cap. `open` is controlled, so each specimen below owns its own
 * `useState` — dragging or tapping one does not affect its neighbours.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Xem tất cả trạng thái thật của khay: thu gọn (chỉ còn dòng peek, phần thân bị làm mờ và vô hiệu bên dưới), mở rộng (thân hiện đầy đủ), và thân dài phải tự cuộn bên trong khay. Kéo tay cầm hoặc bấm vào dòng peek ở từng ô để tự kiểm — mỗi ô có state riêng.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Thu gọn"
                hint="Trạng thái mặc định khi đang chờ — chỉ dòng trạng thái + mã hiển thị, phần hướng dẫn bên dưới bị làm mờ và không bấm được cho tới khi mở rộng."
            >
                <Backdrop>
                    <ConnectSheetDemo
                        defaultOpen={false}
                        peek={<WaitingPeek />}
                        toggleLabel="Kéo lên để xem hướng dẫn kết nối"
                    >
                        <SetupSteps />
                    </ConnectSheetDemo>
                </Backdrop>
            </Variant>
            <Variant
                label="Mở rộng"
                hint="Sau khi kéo lên (hoặc tap dòng peek) — phần hướng dẫn hiện đầy đủ và bấm được, khay cao tối đa 60% viewport."
            >
                <Backdrop>
                    <ConnectSheetDemo
                        defaultOpen
                        peek={<WaitingPeek />}
                        toggleLabel="Kéo xuống để thu gọn"
                    >
                        <SetupSteps />
                    </ConnectSheetDemo>
                </Backdrop>
            </Variant>
            <Variant
                label="Thân dài — tự cuộn trong khay"
                hint="Log agent dài hơn khay: phần thân phải cuộn bên trong (overflow-auto), khay không được cao vượt quá giới hạn viewport."
            >
                <Backdrop>
                    <ConnectSheetDemo
                        defaultOpen
                        peek={<ConnectedPeek />}
                        toggleLabel="Kéo xuống để thu gọn"
                    >
                        <LongLog />
                    </ConnectSheetDemo>
                </Backdrop>
            </Variant>
        </Gallery>
    ),
}

/**
 * The interactive specimen: drag the grabber up/down or tap the peek row —
 * `onOpenChange` is wired to real `useState`, so the sheet snaps exactly like
 * it does inside the playground feature. A button beside it also flips
 * `open` programmatically, the same way a feature auto-expands the sheet
 * while waiting and auto-collapses it once connected.
 */
export const Controlled: Story = {
    parameters: {
        usage: "Dùng để thử tương tác thật: kéo tay cầm lên/xuống, tap vào dòng peek, hoặc bấm nút bên dưới để mô phỏng feature tự đổi snap theo pha (mở rộng khi đang chờ, thu gọn khi đã kết nối) — không phải người dùng tự kéo.",
    },
    render: () => {
        const [open, setOpen] = useState(false)
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Kéo, tap, hoặc điều khiển từ ngoài</Label>
                    <Typography type="body-sm" color="muted">
                        Trạng thái hiện tại: {open ? "mở rộng" : "thu gọn"}. Nút bên dưới mô phỏng feature tự chuyển snap (ví dụ auto-expand khi vào pha chờ agent).
                    </Typography>
                    <div>
                        <Button size="sm" variant="secondary" onPress={() => setOpen((current) => !current)}>
                            {open ? "Thu gọn từ ngoài" : "Mở rộng từ ngoài"}
                        </Button>
                    </div>
                </div>
                <Backdrop>
                    <ConnectSheet
                        open={open}
                        onOpenChange={setOpen}
                        peek={open ? <ConnectedPeek /> : <WaitingPeek />}
                        toggleLabel="Kéo lên để xem hướng dẫn kết nối"
                    >
                        <SetupSteps />
                    </ConnectSheet>
                </Backdrop>
            </div>
        )
    },
}

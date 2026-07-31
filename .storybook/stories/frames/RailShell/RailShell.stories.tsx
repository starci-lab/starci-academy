import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { RailShell } from "@sb-components/frames/RailShell/RailShell"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE: `RailShell` là KHUNG rail-DẪN-ĐẦU + thân co. State nó sinh ra =
 * quan hệ giữa HAI PHÍA CÓ TÊN qua mốc `@app-md`: xếp chồng khi hẹp, hai cột khi rộng,
 * và rail có ghim hay không. Bề rộng rail (288px) và mốc (`@app-md`) là khung TỰ SỞ HỮU,
 * không phải prop — hai nguồn `src` thật đồng ý ở cả hai số, chỉ bất đồng ở sticky.
 */
const meta: Meta<typeof RailShell> = {
    title: "Frames/RailShell/RailShell",
    component: RailShell,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RailShell>

/**
 * `@app-md` đo CONTAINER gần nhất, không đo cửa sổ — muốn demo mốc thì phải tự mở một
 * `@container` đúng bề ngang, đúng như app shell làm.
 */
interface FrameProps {
    /** width of the simulated `@container`, e.g. `"48rem"` */
    width: string
    /** label rendered above the frame to name the width being demoed */
    label: string
    /** content rendered inside the simulated container */
    children: ReactNode
}

const Frame = ({ width, label, children }: FrameProps) => (
    <div className="flex flex-col gap-2">
        <Typography size="xs" text={label} color="muted" />
        <div className="@container rounded-3xl border border-dashed border-default p-3" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)

/** A stand-in for whatever the caller puts in a slot — never real content. */
const Box = ({ label, lines }: { label: string; lines: number }) => (
    <StackV gap="grouped" body={<>
        <Typography size="sm" text={label} weight="medium" />
        {Array.from({ length: lines }, (_, index) => (
            <div key={index} className="h-10 rounded-2xl bg-surface-secondary" />
        ))}
    </>} />
)

/**
 * Default — rail dẫn đầu, thân theo sau. Hình đi đúng 2 chỗ trong `src`:
 * dashboard (identity + tab đang mở) và settings (nav + panel).
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="RailShell"
                tier="frame"
                leaf="Default"
                reason="Not a `SplitWorkspace` reversed: there the reading column leads and the aside is a 360px action rail. Here the rail LEADS — it is who you are or where you are — and the body is what you came to read. Opposite reading order, opposite shrink strategy. Naming the two sides puts `shrink-0` on the rail and `min-w-0` on the body in ONE file instead of at every call site."
                states={[
                    {
                        name: "rail leads, body follows",
                        why: "The rail holds identity or navigation at a fixed 288px and never shrinks; the body takes every remaining pixel and shrinks without limit, so long content truncates inside it instead of pushing the rail off screen. This is the shape both `features/dashboard/index.tsx` and `Settings/SettingsLayout/index.tsx` wrote by hand before this khung existed.",
                        code: `<RailShell
  rail={<DashboardIdentity />}
  body={<OverviewTab />}
/>`,
                        render: (
                            <Frame width="60rem" label="container 960px, at or above @app-md, two columns">
                                <RailShell
                                    anatPart="RailShell"
                                    rail={<Box label="rail — identity, 288px, never shrinks" lines={2} />}
                                    body={<Box label="body — the open tab, absorbs the rest" lines={4} />}
                                />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Breakpoint — dưới `@app-md` hai phía thành CỘT, rail lên trên. Mốc đo bề ngang
 * CONTAINER chứ không đo viewport, và nó được KHAI BÁO — không phải `wrap` rồi hy vọng.
 */
export const Breakpoint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="RailShell"
                tier="frame"
                leaf="Breakpoint"
                reason="The threshold is declared, not hoped for. `wrap` carries no threshold at all: the body shrinks without limit so a wrapped row almost never actually wraps, which is how two screens shipped with their columns glued together at every width including mobile."
                states={[
                    {
                        name: "container 640px, below @app-md",
                        why: "The two sides stack into a column with the rail on top, each full width. This is what a phone gets, and what any container narrower than the breakpoint gets — the AI rail can squeeze the app column at any window size.",
                        code: `<RailShell rail={…} body={…} />`,
                        render: (
                            <Frame width="40rem" label="container 640px, below @app-md, stacks">
                                <RailShell
                                    anatPart="RailShell"
                                    rail={<Box label="rail on top, full width" lines={1} />}
                                    body={<Box label="body below" lines={3} />}
                                />
                            </Frame>
                        ),
                    },
                    {
                        name: "container 960px, at or above @app-md",
                        why: "Same component, same props — only the container crossed the breakpoint. The rail becomes a fixed 288px column and the body takes the remainder.",
                        code: `<RailShell rail={…} body={…} />`,
                        render: (
                            <Frame width="60rem" label="container 960px, at or above @app-md, two columns">
                                <RailShell
                                    anatPart="RailShell"
                                    rail={<Box label="rail — 288px" lines={1} />}
                                    body={<Box label="body — the rest" lines={3} />}
                                />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * IsRailSticky — prop DUY NHẤT của khung này, và nó tồn tại vì hai nguồn `src` thật
 * bất đồng đúng ở đây: dashboard cuộn rail theo trang, settings ghim rail vào viewport.
 */
export const IsRailSticky: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="RailShell"
                tier="frame"
                leaf="IsRailSticky"
                reason="A number becomes a prop when a real consumer disagrees, not before. Both real sources agree on the 288px rail and the `@app-md` threshold, so those stay hard-owned. They disagree on sticky — dashboard scrolls its rail with the page, settings pins its nav — so that one, and only that one, is a prop."
                states={[
                    {
                        name: "isRailSticky = false (default)",
                        why: "The rail scrolls away with the page. This is right when the rail is a snapshot the reader glances at once — an identity card, a standing — rather than something they keep returning to.",
                        code: `<RailShell
  rail={<DashboardIdentity />}
  body={<OverviewTab />}
/>`,
                        render: (
                            <Frame width="60rem" label="rail scrolls with the page">
                                <RailShell
                                    anatPart="RailShell"
                                    rail={<Box label="rail — scrolls away" lines={1} />}
                                    body={<Box label="body" lines={3} />}
                                />
                            </Frame>
                        ),
                    },
                    {
                        name: "isRailSticky",
                        why: "The rail pins to the viewport once the two sit side by side, and scrolls internally when it outgrows the screen. This is right when the rail is navigation the reader returns to while the body scrolls past it.",
                        code: `<RailShell
  isRailSticky
  rail={<SettingsNav />}
  body={<SettingsPanel />}
/>`,
                        render: (
                            <Frame width="60rem" label="rail pinned to the viewport">
                                <RailShell
                                    anatPart="RailShell"
                                    isRailSticky
                                    rail={<Box label="rail — pinned" lines={1} />}
                                    body={<Box label="body" lines={3} />}
                                />
                            </Frame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

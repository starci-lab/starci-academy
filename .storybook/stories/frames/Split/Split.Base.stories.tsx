import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Split } from "@sb-components/frames/Split/Split"
import { Stack } from "@sb-components/frames/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE: `Split.Base` là KHUNG hàng TRÁI ↔ PHẢI. State nó sinh ra = quan hệ
 * giữa HAI PHÍA CÓ TÊN: seam `gap`, canh lề `align`, và `stackOnMobile` (xuống dòng khi
 * container hẹp). Không có `wrap`/`justify` — `justify-between` là ĐỊNH NGHĨA của khung
 * này, không phải tuỳ chọn; hàng nhiều-phần-tử thì dùng `Stack.H`/`Cluster`.
 */
const meta: Meta<typeof Split.Base> = {
    title: "Frames/Split/Split.Base",
    component: Split.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Split.Base>

// No `Start`/`End` anatomy nodes (2026-07-28): the two sides are CALLER slots — whatever they
// wrap belongs to whoever passed it in (`Typography.Base`, `Button.Base`, a `Stack.V`…), not to
// this khung's own anatomy, and no component sits behind either name for a reader to click
// through to. The `reason` prose below already explains the min-w-0/shrink-0 split in words.

/**
 * `@app-sm` đo CONTAINER gần nhất, không đo cửa sổ — nên muốn demo mốc thì phải tự mở
 * một `@container` đúng bề ngang (đúng như app shell làm). `--container-app-sm = 40rem`.
 */
/**
 * Props for the `Frame` demo helper.
 */
interface FrameProps {
    /** width of the simulated `@container`, e.g. `"40rem"` */
    width: string
    /** label rendered above the frame to name the breakpoint being demoed */
    label: string
    /** content rendered inside the simulated container */
    children: ReactNode
}

const Frame = ({ width, label, children }: FrameProps) => (
    <div className="flex flex-col gap-2">
        <Typography.Base size="xs" text={label} color="muted" />
        <div className="@container rounded-3xl border border-dashed border-default p-3" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)

/** Default — nhãn bên trái, hành động bên phải: hàng đi 43 chỗ trong app. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Split.Base"
                tier="frame"
                leaf="Default"
                reason="Not a `Stack.H justify=between`: this is TWO NAMED sides with different width strategies, `start` can shrink and truncate, `end` cannot. Naming both sides enforces that rule in ONE place instead of at 43 call sites, and because the two slots already have names, the frame takes no `children` (§13b)."
                states={[
                    {
                        name: "a name and the action on it",
                        why: "Start carries a truncating label on the left and End carries a button pinned to the right, with a grouped seam between them because the two are separate things a reader treats separately. This is the shape used at roughly 43 call sites in the app for a row that pairs a name with its action.",
                        code: `<Split.Base
  gap="grouped"
  start={<Typography.Base size="sm" text="Khoá System Design" weight="medium" />}
  end={<Button.Base label="Tiếp tục" size="sm" />}
/>`,
                        render: (
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split.Base
                                    showAnatomy
                                    gap="grouped"
                                    start={<Typography.Base size="sm" text="Khoá System Design" weight="medium" truncate />}
                                    end={<Button.Base label="Tiếp tục" size="sm" />}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * StackOnMobile — dưới mốc `@app-sm` hàng thành CỘT (hai phía full-width), từ `@app-sm`
 * trở lên quay lại hàng chia hai đầu. Mốc đo bề ngang CONTAINER (rail AI có thể bóp cột
 * app bất cứ lúc nào), không đo viewport.
 */
export const StackOnMobile: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Split.Base"
                tier="frame"
                leaf="StackOnMobile"
                reason="`@app-sm` measures the NEAREST container, not the viewport — the AI rail can squeeze the app column at any width, so the row must react to its own box rather than to the window."
                states={[
                    {
                        name: "container width = 384px, below @app-sm",
                        why: "Start and End stack into a column, each full-width, and the row loses its left/right split. This is the shape when the row's own container has been squeezed narrower than the `@app-sm` breakpoint, whatever the window size actually is.",
                        code: `<Split.Base
  stackOnMobile
  gap="grouped"
  start={…}
  end={…}
/>`,
                        render: (
                            <Frame width="24rem" label="container 384px, below @app-sm, stacks into a column">
                                <Split.Base
                                    showAnatomy
                                    stackOnMobile
                                    gap="grouped"
                                    start={<Typography.Base size="sm" text="Gói Pro — thanh toán theo năm" weight="medium" />}
                                    end={<Button.Base label="Nâng cấp" size="sm" />}
                                />
                            </Frame>
                        ),
                    },
                    {
                        name: "container width = 768px, at or above @app-sm",
                        why: "Start and End return to a single row split to the two ends. This is the same component and the same props as the stacked state above, only the container's own width crossed back over the `@app-sm` breakpoint.",
                        code: `<Split.Base
  stackOnMobile
  gap="grouped"
  start={…}
  end={…}
/>`,
                        render: (
                            <Frame width="48rem" label="container 768px, at or above @app-sm, stays a row">
                                <Split.Base
                                    showAnatomy
                                    stackOnMobile
                                    gap="grouped"
                                    start={<Typography.Base size="sm" text="Gói Pro — thanh toán theo năm" weight="medium" />}
                                    end={<Button.Base label="Nâng cấp" size="sm" />}
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
 * Align — canh theo trục NGANG-vuông-góc (chiều dọc của hàng), đọc được khi hai phía
 * KHÁC chiều cao. `stretch` kéo cả hai cao bằng hàng.
 */
export const Align: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Split.Base"
                tier="frame"
                leaf="Align"
                reason="The fixture deliberately mismatches height, the left side carries two lines while the right side is one button, so the cross-axis alignment actually reads on screen."
                states={[
                    {
                        name: "align = \"center\" (default)",
                        why: "Start and End sit centred on the row's cross axis, the button lining up with the middle of the two-line text block beside it. This is the standard alignment for a split row, used whenever the two sides don't need special vertical treatment.",
                        code: `<Split.Base
  gap="grouped"
  align="center"
  start={…}
  end={…}
/>`,
                        render: (
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split.Base
                                    showAnatomy
                                    gap="grouped"
                                    align="center"
                                    start={(
                                        <Stack.V gap="flush">
                                            <Typography.Base size="sm" text="Bài 4 — Consistent Hashing" weight="medium" />
                                            <Typography.Base size="xs" text="Còn 18 phút · 3 thử thách" color="muted" />
                                        </Stack.V>
                                    )}
                                    end={<Button.Base label="Học" size="sm" />}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "align = \"start\"",
                        why: "Start and End both pin to the top of the row instead of centring. This is for a left side carrying a long block of text, where centring the button against a growing block would keep moving it around.",
                        code: `<Split.Base
  gap="grouped"
  align="start"
  start={…}
  end={…}
/>`,
                        render: (
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split.Base
                                    gap="grouped"
                                    align="start"
                                    start={(
                                        <Stack.V gap="flush">
                                            <Typography.Base size="sm" text="Bài 4 — Consistent Hashing" weight="medium" />
                                            <Typography.Base size="xs" text="Còn 18 phút · 3 thử thách" color="muted" />
                                        </Stack.V>
                                    )}
                                    end={<Button.Base label="Học" size="sm" />}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "align = \"end\"",
                        why: "Start and End both pin to the bottom of the row instead of centring. This is for a case where the trailing side should line up with the last line of a taller leading block, such as a footnote sitting under a paragraph.",
                        code: `<Split.Base
  gap="grouped"
  align="end"
  start={…}
  end={…}
/>`,
                        render: (
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split.Base
                                    gap="grouped"
                                    align="end"
                                    start={(
                                        <Stack.V gap="flush">
                                            <Typography.Base size="sm" text="Bài 4 — Consistent Hashing" weight="medium" />
                                            <Typography.Base size="xs" text="Còn 18 phút · 3 thử thách" color="muted" />
                                        </Stack.V>
                                    )}
                                    end={<Button.Base label="Học" size="sm" />}
                                />
                            </div>
                        ),
                    },
                    {
                        name: "align = \"stretch\"",
                        why: "Both Start and End are pulled to the full height of the row instead of sizing to their own content. This is for when the End side is something like a full-height divider or button that should always match the tallest side.",
                        code: `<Split.Base
  gap="grouped"
  align="stretch"
  start={…}
  end={…}
/>`,
                        render: (
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split.Base
                                    gap="grouped"
                                    align="stretch"
                                    start={(
                                        <Stack.V gap="flush">
                                            <Typography.Base size="sm" text="Bài 4 — Consistent Hashing" weight="medium" />
                                            <Typography.Base size="xs" text="Còn 18 phút · 3 thử thách" color="muted" />
                                        </Stack.V>
                                    )}
                                    end={<Button.Base label="Học" size="sm" />}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

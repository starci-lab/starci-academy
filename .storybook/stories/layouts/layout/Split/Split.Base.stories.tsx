import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Split } from "@sb-components/layouts/layout/Split/Split"
import { Stack } from "@sb-components/layouts/layout/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE: `Split.Base` là KHUNG hàng TRÁI ↔ PHẢI. State nó sinh ra = quan hệ
 * giữa HAI PHÍA CÓ TÊN: seam `gap`, canh lề `align`, và `stackOnMobile` (xuống dòng khi
 * container hẹp). Không có `wrap`/`justify` — `justify-between` là ĐỊNH NGHĨA của khung
 * này, không phải tuỳ chọn; hàng nhiều-phần-tử thì dùng `Stack.H`/`Cluster`.
 */
const meta: Meta<typeof Split.Base> = {
    title: "Layouts/Layout/Split/Split.Base",
    component: Split.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Split.Base>

const SIDE_PARTS: Array<AnatomyNode> = [
    { name: "Start", tier: "primitive", role: "phía dẫn đầu — `min-w-0` nên chữ dài TRUNCATE bên trong, không đẩy End" },
    { name: "End", tier: "primitive", role: "phía đuôi — `shrink-0` nên nút/giá trị không bao giờ bị bóp" },
]

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
                tier="primitive"
                leaf="Default"
                parts={SIDE_PARTS}
                reason="Không phải `Stack.H justify=between`: đây là HAI PHÍA CÓ TÊN với chiến lược bề ngang KHÁC nhau (`start` co được, `end` không). Đặt tên hai phía là cách ép luật đó ở MỘT chỗ thay vì ở 43 call-site. Vì hai slot có tên đã đủ nên khung KHÔNG nhận `children` (§13b)."
                code={`<Split.Base
  gap={3}
  start={<Typography.Base size="sm" text="Khoá System Design" weight="medium" />}
  end={<Button.Base label="Tiếp tục" size="sm" />}
/>`}
            >
                <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                    <Split.Base
                        showAnatomy
                        gap={3}
                        start={<Typography.Base size="sm" text="Khoá System Design" weight="medium" truncate />}
                        end={<Button.Base label="Tiếp tục" size="sm" />}
                    />
                </div>
            </BlockAnatomy>
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
                tier="primitive"
                leaf="StackOnMobile"
                parts={SIDE_PARTS}
                note="Hai khung `@container` cùng một component, chỉ khác bề ngang: 384px (dưới mốc 40rem) → cột; 768px → hàng."
                code={`<Split.Base
  stackOnMobile
  gap={3}
  start={…}
  end={…}
/>`}
            >
                <div className="flex flex-col gap-6">
                    <Frame width="24rem" label="container 384px — dưới @app-sm → cột">
                        <Split.Base
                            showAnatomy
                            stackOnMobile
                            gap={3}
                            start={<Typography.Base size="sm" text="Gói Pro — thanh toán theo năm" weight="medium" />}
                            end={<Button.Base label="Nâng cấp" size="sm" />}
                        />
                    </Frame>
                    <Frame width="48rem" label="container 768px — từ @app-sm → hàng">
                        <Split.Base
                            stackOnMobile
                            gap={3}
                            start={<Typography.Base size="sm" text="Gói Pro — thanh toán theo năm" weight="medium" />}
                            end={<Button.Base label="Nâng cấp" size="sm" />}
                        />
                    </Frame>
                </div>
            </BlockAnatomy>
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
                tier="primitive"
                leaf="Align"
                parts={SIDE_PARTS}
                note="Fixture cố ý lệch chiều cao: phía trái hai dòng, phía phải một nút. `center` (mặc định) là chuẩn của hàng split; `start` dùng khi phía trái là khối chữ dài."
                code={`<Split.Base
  gap={3}
  align="start"
  start={…}
  end={…}
/>`}
            >
                <div className="flex flex-col gap-6">
                    {(["center", "start", "end", "stretch"] as const).map((align, index) => (
                        <div key={align} className="flex flex-col gap-2">
                            <Typography.Base size="xs" text={align} color="muted" />
                            <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                                <Split.Base
                                    showAnatomy={index === 0}
                                    gap={3}
                                    align={align}
                                    start={(
                                        <Stack.V gap={0}>
                                            <Typography.Base size="sm" text="Bài 4 — Consistent Hashing" weight="medium" />
                                            <Typography.Base size="xs" text="Còn 18 phút · 3 thử thách" color="muted" />
                                        </Stack.V>
                                    )}
                                    end={<Button.Base label="Học" size="sm" />}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

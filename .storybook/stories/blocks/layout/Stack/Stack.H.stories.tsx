import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stack } from "@sb-components/blocks/layout/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE: `Stack.H` là KHUNG một-trục NGANG. State riêng của nó = `wrap`
 * (chỉ hàng ngang mới tràn dòng) và `justify` (đọc được vì hàng luôn có bề ngang dư),
 * cộng kẻ DỌC của `divider`. `gap` (thang §10) và `align` đã demo ở `Stack.V` —
 * cùng một prop, không lặp lại ở đây.
 */
const meta: Meta<typeof Stack.H> = {
    title: "Layouts/Layout/Stack/Stack.H",
    component: Stack.H,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Stack.H>

const TRACK_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "primitive", role: "trục flex ngang — sở hữu gap (§10), align, justify, wrap" },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "primitive", role: "trục flex ngang — sở hữu gap (§10)" },
    { name: "Line", tier: "atom", role: "Divider.Base dọc (`self-stretch`) chèn GIỮA hai con" },
]

/** Default — hàng ngang, seam `related(2)`: các phần tử CÙNG một cụm. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.H"
                tier="primitive"
                leaf="Default"
                parts={TRACK_PARTS}
                reason="Cùng khung một-trục với `Stack.V`, đổi hướng thành hàng — và CHỈ hàng mới có `wrap`. Nhận `children` bất kỳ; nếu nội dung là N phần tử CÙNG KIỂU lặp lại thì đó là `Cluster`/`Grid` (§13b), không phải khung này."
                code={`<Stack.H gap={2}>
  <Button.Base label="Bắt đầu" />
  <Button.Base label="Xem đề cương" variant="secondary" />
</Stack.H>`}
            >
                <Stack.H gap={2} showAnatomy>
                    <Button.Base label="Bắt đầu" />
                    <Button.Base label="Xem đề cương" variant="secondary" />
                </Stack.H>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Wrap — state CHỈ `Stack.H` có: khi hàng hết bề ngang, con xuống dòng mới thay vì
 * co lại. `gap` áp cho CẢ hai trục nên khoảng giữa các dòng bằng khoảng giữa các con.
 */
export const Wrap: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.H"
                tier="primitive"
                leaf="Wrap"
                parts={TRACK_PARTS}
                note="Khung hẹp cố ý (`w-80`) để hàng phải tràn dòng. Không `wrap` → các nút co/tràn khỏi khung; có `wrap` → xuống dòng, giữ nguyên bề ngang tự thân."
                code={`<Stack.H gap={2} wrap>
  …
</Stack.H>`}
            >
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Typography.Xs text="wrap" color="muted" />
                        <div className="w-80 rounded-3xl border border-dashed border-default p-3">
                            <Stack.H gap={2} wrap showAnatomy>
                                <Button.Base label="Tất cả" variant="secondary" size="sm" />
                                <Button.Base label="Đang học" variant="secondary" size="sm" />
                                <Button.Base label="Đã hoàn thành" variant="secondary" size="sm" />
                                <Button.Base label="Đã lưu" variant="secondary" size="sm" />
                            </Stack.H>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Typography.Xs text="không wrap (mặc định)" color="muted" />
                        <div className="w-80 rounded-3xl border border-dashed border-default p-3">
                            <Stack.H gap={2}>
                                <Button.Base label="Tất cả" variant="secondary" size="sm" />
                                <Button.Base label="Đang học" variant="secondary" size="sm" />
                                <Button.Base label="Đã hoàn thành" variant="secondary" size="sm" />
                                <Button.Base label="Đã lưu" variant="secondary" size="sm" />
                            </Stack.H>
                        </div>
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Justify — phân bố theo trục CHÍNH (ngang). `between` đẩy hai đầu ra mép; khi hàng
 * chỉ có ĐÚNG HAI phía có tên thì dùng `Split.Base` (khung riêng), không phải cái này.
 */
export const Justify: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.H"
                tier="primitive"
                leaf="Justify"
                parts={TRACK_PARTS}
                note="`justify` chỉ đọc được khi trục chính còn dư chỗ — nên nó là state của hàng, không phải của cột."
                code={`<Stack.H gap={2} justify="between">
  …
</Stack.H>`}
            >
                <div className="flex flex-col gap-6">
                    {(["start", "center", "end", "between"] as const).map((justify, index) => (
                        <div key={justify} className="flex flex-col gap-2">
                            <Typography.Xs text={justify} color="muted" />
                            <div className="w-96 max-w-full rounded-3xl border border-dashed border-default p-3">
                                <Stack.H gap={2} justify={justify} showAnatomy={index === 0}>
                                    <Button.Base label="Huỷ" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" size="sm" />
                                </Stack.H>
                            </div>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * WithDivider — trên hàng ngang, kẻ là DỌC và `self-stretch` (cao bằng hàng) dù hàng
 * đang `items-center`. Cùng một prop `divider`, nhưng hình dạng kẻ do TRỤC quyết định.
 */
export const WithDivider: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.H"
                tier="primitive"
                leaf="WithDivider"
                parts={DIVIDER_PARTS}
                note="`align-self: stretch` thắng `items-center` của hàng, nên đường kẻ luôn cao trọn hàng — không cần caller đặt chiều cao."
                code={`<Stack.H gap={3} divider>
  <Typography.Sm text="12 bài" />
  <Typography.Sm text="4 giờ" />
  <Typography.Sm text="Trung cấp" />
</Stack.H>`}
            >
                <div className="w-fit rounded-3xl bg-surface p-3 shadow-surface">
                    <Stack.H gap={3} divider showAnatomy>
                        <Typography.Sm text="12 bài" color="muted" />
                        <Typography.Sm text="4 giờ" color="muted" />
                        <Typography.Sm text="Trung cấp" color="muted" />
                    </Stack.H>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

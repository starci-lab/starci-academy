import type { Meta, StoryObj } from "@storybook/nextjs"
import { Stack } from "@sb-components/layouts/layout/Stack/Stack"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE: `Stack.V` là KHUNG một-trục DỌC. State nó SINH RA = những gì
 * chính nó quyết định: `gap` (thang §10 — lý do khung này tồn tại), `align` (trục
 * ngang), `divider` (kẻ giữa các con). `wrap` KHÔNG có ở đây (cột không tràn dòng —
 * đó là state của `Stack.H`), và `justify` chỉ đọc được khi cột có chiều cao dư nên
 * để `Stack.H` demo — không lặp state của member khác.
 */
const meta: Meta<typeof Stack.V> = {
    title: "Layouts/Layout/Stack/Stack.V",
    component: Stack.V,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Stack.V>

/** Khung không mang nội dung — fixture là card thật để thấy seam giữa hai con. */
const Panel = ({ text }: { text: string }) => (
    <SurfaceCard.Base>
        <Typography.Base size="sm" text={text} />
    </SurfaceCard.Base>
)

const TRACK_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "primitive", role: "trục flex dọc — sở hữu gap (§10), align, justify" },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    { name: "Track", tier: "primitive", role: "trục flex dọc — sở hữu gap (§10)" },
    { name: "Line", tier: "atom", role: "Divider.Base chèn GIỮA hai con (N con → N−1 kẻ)" },
]

/** Sáu nấc HỢP LỆ của §10 — `gap` là union literal nên không có nấc thứ bảy. */
const SCALE = [
    { gap: 0, name: "flush (0)" },
    { gap: 1, name: "tight (1)" },
    { gap: 2, name: "related (2)" },
    { gap: 3, name: "grouped (3)" },
    { gap: 6, name: "section (6)" },
    { gap: 8, name: "page (8)" },
] as const

/** Default — cột với seam `grouped(3)`: nhịp mặc định của các khối trong một card. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="primitive"
                leaf="Default"
                parts={TRACK_PARTS}
                reason="Khung một-trục DỌC: chỉ quyết định hướng, seam và canh lề — không mang nội dung hay chức năng (§13). Là khung BỌC nên nhận `children` (một trục chỉ có ĐÚNG MỘT slot, nên không có bộ header/body/footer để đặt tên)."
                code={`<Stack.V gap={3}>
  <Panel text="Tổng quan" />
  <Panel text="Lộ trình" />
  <Panel text="Bài tập" />
</Stack.V>`}
            >
                <div className="w-96 max-w-full">
                    <Stack.V gap={3} showAnatomy>
                        <Panel text="Tổng quan" />
                        <Panel text="Lộ trình" />
                        <Panel text="Bài tập" />
                    </Stack.V>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Gaps — LÝ DO khung này tồn tại: `gap` nhận ĐÚNG sáu nấc `0·1·2·3·6·8` (§10c).
 * `gap={4}` hay `gap={5}` là LỖI BIÊN DỊCH, không phải góp ý review.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="primitive"
                leaf="Gaps"
                parts={TRACK_PARTS}
                note="`gap` là union literal `0|1|2|3|6|8` và BẮT BUỘC — không có default để lỡ tay chọn nhầm seam (§10a: mỗi seam đúng một chủ, có chủ đích)."
                code={`<Stack.V gap={0}>…</Stack.V>   // flush
<Stack.V gap={2}>…</Stack.V>   // related
<Stack.V gap={6}>…</Stack.V>   // section`}
            >
                <div className="flex flex-wrap gap-6">
                    {SCALE.map((step, index) => (
                        <div key={step.gap} className="flex w-40 flex-col gap-2">
                            <Typography.Base size="xs" text={step.name} color="muted" />
                            <Stack.V gap={step.gap} showAnatomy={index === 0}>
                                <Panel text="Một" />
                                <Panel text="Hai" />
                            </Stack.V>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * WithDivider — `divider` chèn `Divider.Base` (ATOM) vào GIỮA các con: N con → N−1
 * kẻ, không có kẻ ở đầu/cuối. Khung KHÔNG tự vẽ đường kẻ (§13c: trùng atom ⇒ dùng atom).
 */
export const WithDivider: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="primitive"
                leaf="WithDivider"
                parts={DIVIDER_PARTS}
                note="Kẻ NGANG (cắt ngang trục dọc) do `Divider.Base` vẽ — khung chỉ xen vào giữa. `gap` vẫn áp cho cả con lẫn kẻ nên hai bên đường kẻ luôn cân."
                code={`<Stack.V gap={3} divider>
  <Typography.Base size="sm" text="Đã hoàn thành 12 bài" />
  <Typography.Base size="sm" text="Chuỗi 5 ngày" />
  <Typography.Base size="sm" text="Xếp hạng 34/120" />
</Stack.V>`}
            >
                <div className="w-96 max-w-full rounded-3xl bg-surface p-3 shadow-surface">
                    <Stack.V gap={3} divider showAnatomy>
                        <Typography.Base size="sm" text="Đã hoàn thành 12 bài" />
                        <Typography.Base size="sm" text="Chuỗi 5 ngày" />
                        <Typography.Base size="sm" text="Xếp hạng 34/120" />
                    </Stack.V>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Align — trên trục DỌC, `align` canh theo chiều NGANG. `stretch` (mặc định) kéo con
 * đầy bề ngang; `start`/`center`/`end` để con giữ bề ngang tự nhiên của nó.
 */
export const Align: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Stack.V"
                tier="primitive"
                leaf="Align"
                parts={TRACK_PARTS}
                note="Fixture là nút (có bề ngang tự thân) nên khác biệt đọc được: `stretch` phá bề ngang tự thân, ba giá trị còn lại giữ nguyên."
                code={`<Stack.V gap={2} align="center">
  …
</Stack.V>`}
            >
                <div className="flex flex-wrap gap-6">
                    {(["stretch", "start", "center", "end"] as const).map((align, index) => (
                        <div key={align} className="flex w-56 flex-col gap-2">
                            <Typography.Base size="xs" text={align} color="muted" />
                            <div className="rounded-3xl border border-dashed border-default p-3">
                                <Stack.V gap={2} align={align} showAnatomy={index === 0}>
                                    <Button.Base label="Tiếp tục học" variant="secondary" size="sm" />
                                    <Button.Base label="Lưu" variant="secondary" size="sm" />
                                </Stack.V>
                            </div>
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

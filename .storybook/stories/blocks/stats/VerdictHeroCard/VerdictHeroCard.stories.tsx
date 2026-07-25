import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { VerdictHeroCard, type VerdictHeroSplit } from "@sb-components/_designs/stats/VerdictHeroCard/VerdictHeroCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof VerdictHeroCard> = {
    title: "Design/Stats/VerdictHeroCard",
    component: VerdictHeroCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof VerdictHeroCard>

/** The mature/young retention split reused by the Full story. */
const REVIEW_HEALTH_SPLITS: VerdictHeroSplit[] = [
    { label: "Thẻ đã học kỹ (chín)", value: "72%", band: "success" },
    { label: "Thẻ mới (non)", value: "31%", band: "danger" },
]

/** A split whose `band` is omitted stays neutral foreground — not every split is itself good/bad. */
const NEUTRAL_SPLITS: VerdictHeroSplit[] = [
    { label: "Câu đã trả lời", value: "18/20" },
    { label: "Thời gian dùng", value: "42 phút" },
]

/** The block only renders the slot; the caller owns the click. */
const PrimaryAction = ({ children }: { children: string }) => (
    <Button variant="primary" size="sm" onPress={() => {}}>{children}</Button>
)

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: ReactNode) => <div className="p-8"><div className="max-w-md">{node}</div></div>

const DEFAULT_PARTS: Array<AnatomyNode> = [
    { name: "Value", tier: "primitive", role: "số headline tô màu theo band + unit mờ" },
    { name: "Verdict", tier: "primitive", role: "câu phán xử một dòng" },
]

const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Value", tier: "primitive", role: "số headline tô màu theo band + unit mờ" },
    { name: "Verdict", tier: "primitive", role: "câu phán xử một dòng" },
    { name: "Sub", tier: "primitive", role: "dòng bằng chứng mờ dưới verdict" },
    { name: "ProgressMeter", tier: "design", role: "thanh tiến độ có mốc target" },
    { name: "Splits", tier: "design", role: "2-up mini-stat bổ dọc con số headline" },
    { name: "Action", tier: "primitive", role: "slot hành động chính — caller cung cấp Button" },
]

const METER_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Value", tier: "primitive", role: "số headline tô màu theo band + unit mờ" },
    { name: "Verdict", tier: "primitive", role: "câu phán xử một dòng" },
    { name: "Sub", tier: "primitive", role: "dòng bằng chứng mờ dưới verdict" },
    { name: "ProgressMeter", tier: "design", role: "thanh tiến độ có mốc target" },
    { name: "Action", tier: "primitive", role: "slot hành động chính — caller cung cấp Button" },
]

const SPLITS_NEUTRAL_PARTS: Array<AnatomyNode> = [
    { name: "Value", tier: "primitive", role: "số headline tô màu theo band + unit mờ" },
    { name: "Verdict", tier: "primitive", role: "câu phán xử một dòng" },
    { name: "Splits", tier: "design", role: "2-up mini-stat, band bỏ trống → giữ neutral foreground" },
]

const BAND_PARTS: Array<AnatomyNode> = [
    { name: "Value", tier: "primitive", role: "số headline tô màu theo band + unit mờ" },
    { name: "Verdict", tier: "primitive", role: "câu phán xử một dòng" },
    { name: "ProgressMeter", tier: "design", role: "thanh tiến độ có mốc target, fill theo band" },
]

/** Only the required props (`value` + `band` + `verdict`) — no `unit`, `sub`, `meter`, `splits`, or `action`. The doc comment calls this out explicitly: omit `meter` "when there is no meaningful bar to show (e.g. a pure count)". */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="VerdictHeroCard"
                tier="design"
                leaf="Default"
                parts={DEFAULT_PARTS}
                reason="Hero 'phán xử' chia sẻ giữa các surface Thống kê: số headline tô band + câu phán xử LUÔN đi cùng nhau; mọi zone khác (sub/meter/splits/action) là tuỳ chọn, bỏ khi không có bằng chứng/hành động phù hợp."
            >
                <VerdictHeroCard
                    value={12}
                    band="success"
                    verdict="Đã hoàn thành 12 bài tập tuần này."
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Full shape: value + verdict + sub + meter with target + 2-up split + action. */
export const Full: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="VerdictHeroCard"
                tier="design"
                leaf="Full"
                parts={FULL_PARTS}
                note="Đủ 6 part: Value, Verdict, Sub (bằng chứng), ProgressMeter (mốc target), Splits (2-up), Action (CTA)."
            >
                <VerdictHeroCard
                    value={39}
                    unit="%"
                    band="danger"
                    verdict="Bạn đang quá tải — nạp thẻ mới nhanh hơn tốc độ ghi nhớ."
                    sub="Tỷ lệ nhớ 39% (mốc lành mạnh ~85%). Vấn đề KHÔNG phải quên cái đã học — mà là nạp quá nhanh."
                    meter={{ value: 39, max: 100, target: 85 }}
                    splits={REVIEW_HEALTH_SPLITS}
                    action={<PrimaryAction>Giảm thẻ mới · ôn kỹ thẻ cũ trước →</PrimaryAction>}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Meter only — no natural 2-up breakdown, so `splits` is omitted; the meter + target stay as the evidence. */
export const MeterOnly: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="VerdictHeroCard"
                tier="design"
                leaf="MeterOnly"
                parts={METER_ONLY_PARTS}
                note="Bỏ `splits` (không có breakdown 2-up tự nhiên) — Sub + ProgressMeter + Action vẫn đủ làm bằng chứng + hành động."
            >
                <VerdictHeroCard
                    value={64}
                    unit="/100"
                    band="warning"
                    verdict={"Gần chạm mốc \"đạt\" — còn ~1 phiên mạnh nữa."}
                    sub="Pass-bar 70. 3 phiên gần nhất: 58 → 61 → 64 (đang tăng đều)."
                    meter={{ value: 64, max: 100, target: 70 }}
                    action={<PrimaryAction>Luyện 1 phiên nữa →</PrimaryAction>}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Splits with `band` omitted stay neutral foreground — not every split is itself good/bad. */
export const SplitsNeutral: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="VerdictHeroCard"
                tier="design"
                leaf="SplitsNeutral"
                parts={SPLITS_NEUTRAL_PARTS}
                note="Chỉ Value + Verdict + Splits — không sub/meter/action; mỗi split không truyền `band` nên giữ neutral foreground."
            >
                <VerdictHeroCard
                    value={90}
                    unit="%"
                    band="success"
                    verdict="Đã làm gần hết đề — thời gian dùng vẫn trong định mức."
                    splits={NEUTRAL_SPLITS}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Band: danger — the number signals a real problem needing action now. */
export const BandDanger: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="VerdictHeroCard"
                tier="design"
                leaf="BandDanger"
                parts={BAND_PARTS}
                note="Value + Verdict + ProgressMeter — band=danger tô đỏ cả số lẫn fill thanh tiến độ."
            >
                <VerdictHeroCard
                    value={39}
                    unit="%"
                    band="danger"
                    verdict="Bạn đang quá tải — nạp thẻ mới nhanh hơn tốc độ ghi nhớ."
                    meter={{ value: 39, max: 100, target: 85 }}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Band: warning — real progress, but the target isn't reached yet. */
export const BandWarning: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="VerdictHeroCard"
                tier="design"
                leaf="BandWarning"
                parts={BAND_PARTS}
                note="Cùng composition với leaf BandDanger — chỉ đổi tone sang warning (đang tiến bộ, chưa chạm mốc)."
            >
                <VerdictHeroCard
                    value={61}
                    unit="%"
                    band="warning"
                    verdict="Phủ được 61% khái niệm — còn 6/17 chủ đề chưa đụng tới."
                    meter={{ value: 61, max: 100, target: 80 }}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Band: success — the target is met; the verdict says so outright. */
export const BandSuccess: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="VerdictHeroCard"
                tier="design"
                leaf="BandSuccess"
                parts={BAND_PARTS}
                note="Cùng composition với leaf BandDanger/BandWarning — tone success khi đã vượt mốc target."
            >
                <VerdictHeroCard
                    value={88}
                    unit="%"
                    band="success"
                    verdict="Đã vượt mốc 85% — trí nhớ của bạn đang khoẻ."
                    meter={{ value: 88, max: 100, target: 85 }}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

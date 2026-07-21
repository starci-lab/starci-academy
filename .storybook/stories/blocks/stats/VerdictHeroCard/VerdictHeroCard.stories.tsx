import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { VerdictHeroCard, type VerdictHeroSplit } from "./VerdictHeroCard"

const meta: Meta<typeof VerdictHeroCard> = {
    title: "Primitives/Stats/VerdictHeroCard",
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

/** The block only renders the slot; the caller owns the click. */
const PrimaryAction = ({ children }: { children: string }) => (
    <Button variant="primary" size="sm" onPress={() => {}}>{children}</Button>
)

/** Full shape: value + verdict + sub + meter with target + 2-up split + action. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <VerdictHeroCard
                    value={39}
                    unit="%"
                    band="danger"
                    verdict="Bạn đang quá tải — nạp thẻ mới nhanh hơn tốc độ ghi nhớ."
                    sub="Tỷ lệ nhớ 39% (mốc lành mạnh ~85%). Vấn đề KHÔNG phải quên cái đã học — mà là nạp quá nhanh."
                    meter={{ value: 39, max: 100, target: 85 }}
                    splits={REVIEW_HEALTH_SPLITS}
                    action={<PrimaryAction>Giảm thẻ mới · ôn kỹ thẻ cũ trước →</PrimaryAction>}
                />
            </div>
        </div>
    ),
}

/** Meter only — no natural 2-up breakdown, so `splits` is omitted; the meter + target stay as the evidence. */
export const MeterOnly: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <VerdictHeroCard
                    value={64}
                    unit="/100"
                    band="warning"
                    verdict={"Gần chạm mốc \"đạt\" — còn ~1 phiên mạnh nữa."}
                    sub="Pass-bar 70. 3 phiên gần nhất: 58 → 61 → 64 (đang tăng đều)."
                    meter={{ value: 64, max: 100, target: 70 }}
                    action={<PrimaryAction>Luyện 1 phiên nữa →</PrimaryAction>}
                />
            </div>
        </div>
    ),
}

/** Band: danger — the number signals a real problem needing action now. */
export const BandDanger: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <VerdictHeroCard
                    value={39}
                    unit="%"
                    band="danger"
                    verdict="Bạn đang quá tải — nạp thẻ mới nhanh hơn tốc độ ghi nhớ."
                    meter={{ value: 39, max: 100, target: 85 }}
                />
            </div>
        </div>
    ),
}

/** Band: warning — real progress, but the target isn't reached yet. */
export const BandWarning: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <VerdictHeroCard
                    value={61}
                    unit="%"
                    band="warning"
                    verdict="Phủ được 61% khái niệm — còn 6/17 chủ đề chưa đụng tới."
                    meter={{ value: 61, max: 100, target: 80 }}
                />
            </div>
        </div>
    ),
}

/** Band: success — the target is met; the verdict says so outright. */
export const BandSuccess: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <VerdictHeroCard
                    value={88}
                    unit="%"
                    band="success"
                    verdict="Đã vượt mốc 85% — trí nhớ của bạn đang khoẻ."
                    meter={{ value: 88, max: 100, target: 85 }}
                />
            </div>
        </div>
    ),
}

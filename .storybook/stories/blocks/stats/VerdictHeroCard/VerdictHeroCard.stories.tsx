import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { VerdictHeroCard } from "@/components/blocks/stats/VerdictHeroCard"
import { PrimaryAction, REVIEW_HEALTH_SPLITS } from "./components"

const meta: Meta<typeof VerdictHeroCard> = {
    title: "Blocks/Stats/VerdictHeroCard",
    component: VerdictHeroCard,
    // NEW — pending review ("Chờ duyệt")
    tags: ["news"],
}
export default meta
type Story = StoryObj<typeof VerdictHeroCard>

/** Use for the "phán xử" hero at the top of any Thống kê surface: a band-colored headline, a verdict sentence, a target-marked meter, a 2-up split breakdown, and a primary action — the full shape from flashcard review's "Sức khoẻ trí nhớ" zone. */
export const Default: Story = {
    parameters: {
        usage: "The full shape: value + verdict + sub + meter with a target mark + a 2-up split + a primary action. Use when the number has both a meaningful target AND a natural breakdown (e.g. flashcard review's memory-health hero, mature vs young retention).",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Full — meter + splits + action</Label>
                <Typography type="body-sm" color="muted">
                    Danger band: the value, the left border and the meter fill all read as one bad-news signal, and the split shows the number is really two different stories (mature retention is fine, new cards are not).
                </Typography>
            </div>
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

/** Use when the number has a target worth marking but no natural 2-up breakdown — drop `splits` rather than inventing a fake one. */
export const WithoutSplits: Story = {
    parameters: {
        usage: "Drop `splits` when the number has no natural 2-up breakdown — e.g. an interview readiness score (a single trend, not two sub-populations). Keep the meter + target, since the pass-bar is still the main evidence.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Meter only — no split row</Label>
                <Typography type="body-sm" color="muted">
                    Warning band: close to the target but not there yet. The sub-line carries the trend evidence instead of a split, since a readiness score has no 2-up breakdown to show.
                </Typography>
            </div>
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

/** Use to pick `band` by the MEANING of the verdict (success/warning/danger), never by decoration — the value color, left border and meter fill are always driven by this one prop. */
export const Bands: Story = {
    parameters: {
        usage: "Pick `band` by the MEANING of the verdict, not by decoration: danger = the number signals a real problem · warning = close but not there · success = the target is met. All three drive the same 3 things (value color, left border, meter fill) together.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">The number signals a real problem the learner needs to act on now.</Typography>
                </div>
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
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">Progress is real but hasn't crossed the target yet.</Typography>
                </div>
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
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">The target is met — the verdict should say so plainly, not just show a number.</Typography>
                </div>
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
        </div>
    ),
}

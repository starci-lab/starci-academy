import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "./ContinueCard"
import { SectionCard } from "../SectionCard/SectionCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { ErrorState } from "../../feedback/ErrorState/ErrorState"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ContinueCard> = {
    title: "Block/Cards/ContinueCard/Hero",
    component: ContinueCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCard>

const HERO_ANATOMY = {
    primitives: [
        { name: "SectionCard", role: "khung surface (frame chung mọi trạng thái)" },
        { name: "HighlightCard", role: "vành arc accent quét quanh hero" },
        { name: "ProgressMeter", role: "thanh tiến độ khi có value" },
        { name: "Skeleton", role: "state đang tải — mirror LAYOUT hero (KHÔNG kèm vành sweep)" },
        { name: "ErrorState", role: "state mạng rớt — lỗi + Thử lại, trong khung card" },
    ],
    reason:
        "Biến thể \"hero\" (thứ DUY NHẤT chưa xong). Mỗi state là 1 leaf trong folder: không tiến độ / còn nhiều / gần hết (content — derive từ heroBase) · đang tải (1 Skeleton mirror LAYOUT hero, KHÔNG author per-variant, KHÔNG vành sweep) · lỗi mạng rớt (ErrorState trong SectionCard). \"Trống\" KHÔNG có ở card này — đối chiếu ContinueLearning: rỗng là card onboarding ở content branch, không phải state của card.",
}

// ONE base scenario — the 3 content variants derive by toggling the progress/urgency detail
// ("nội suy từ gốc"): dùng chung 1 kịch bản để cô lập ĐÚNG cái đổi giữa các variant.
const heroBase = {
    variant: "hero" as const,
    title: "Mock interview: Design a rate limiter",
    subtitle: "Question 2 / 8 · Middle · 40 minutes left",
    ctaLabel: "Continue",
    onPress: () => {},
}

/** heroBase BỎ `value` → ProgressMeter không render (delta = không truyền progress). */
export const NoProgress: Story = {
    name: "Không có tiến độ",
    render: () =>
        blockShell(
            <div className="w-96">
                <ContinueCard {...heroBase} />
            </div>,
            HERO_ANATOMY,
        ),
}

/** heroBase + `value/max` → progress bar sớm (delta = thêm tiến độ). */
export const PlentyOfTime: Story = {
    name: "Còn nhiều thời gian",
    render: () =>
        blockShell(
            <div className="w-96">
                <ContinueCard {...heroBase} value={2} max={8} />
            </div>,
            HERO_ANATOMY,
        ),
}

/** heroBase + `value/max` + `urgent` → bar gần đầy, giọng gấp (delta = urgent). */
export const AlmostOut: Story = {
    name: "Gần hết thời gian",
    render: () =>
        blockShell(
            <div className="w-96">
                <ContinueCard {...heroBase} subtitle="Question 7 / 8 · Middle · 2 minutes left" value={7} max={8} urgent />
            </div>,
            HERO_ANATOMY,
        ),
}

/**
 * Loading — MỘT skeleton cho cả kind (mirror layout, no sweep). KHÔNG author skeleton
 * riêng cho từng content-variant (no-progress / urgent) — skeleton gen theo NGUYÊN TẮC
 * mirror sẵn, tách per-variant = duplicate vô ích.
 */
export const Loading: Story = {
    name: "Đang tải",
    render: () => (
        <div className="w-96 p-8">
            <SectionCard contentClassName="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Skeleton.Typography type="body" width="2/3" />
                    <Skeleton.Typography type="body-xs" width="1/2" />
                </div>
                <Skeleton.Button width="w-28" />
                <Skeleton.ProgressBar />
            </SectionCard>
        </div>
    ),
}

/** Network drop — error rendered INSIDE the same card frame. */
export const LoadError: Story = {
    name: "Lỗi tải (mạng rớt)",
    render: () => (
        <div className="w-96 p-8">
            <SectionCard>
                <ErrorState
                    title="Mất kết nối"
                    description="Mạng có vẻ bị rớt. Kiểm tra kết nối rồi thử lại."
                    retryLabel="Thử lại"
                    onRetry={() => {}}
                />
            </SectionCard>
        </div>
    ),
}

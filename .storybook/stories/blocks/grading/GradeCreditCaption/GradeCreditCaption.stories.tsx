import type { Meta, StoryObj } from "@storybook/nextjs"
import { GradeCreditCaption } from "./GradeCreditCaption"
import type { GradeCreditUsage } from "./GradeCreditCaption"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof GradeCreditCaption> = {
    title: "Design/Grading/GradeCreditCaption",
    component: GradeCreditCaption,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof GradeCreditCaption>

const ANATOMY = {
    primitives: [
        { name: "WarningCircleIcon", role: "icon cảnh báo khi pool không đủ chi trả lượt Auto (HeroUI/phosphor)" },
    ],
    reason:
        "Dòng caption leaf dùng chung dưới mọi model picker: hiện pool credit tuần cho cả lane Auto lẫn model pin (đều trừ chung một pool), đổi sang dòng cảnh báo đỏ khi lane Auto không còn đủ — và nói ĐÚNG lý do (hết tuần vs dồn hết khung 5h). Không cấu thành từ Primitives/* (chỉ text + icon), nên đúng ra là Primitive hơn Block (xem FLAGS).",
}

/** Còn nhiều credit trong cả hai khung giờ. */
const plentyUsage: GradeCreditUsage = {
    credit: { remaining5h: 10, remainingWeek: 42, limitWeek: 60 },
}

/** Sắp cạn credit tuần (dưới mức một lượt Auto) nhưng khung 5h vẫn còn dư. */
const lowWeekUsage: GradeCreditUsage = {
    credit: { remaining5h: 2, remainingWeek: 2, limitWeek: 60 },
}

/** Vừa dồn hết khung 5h nhưng credit tuần vẫn còn dư dả. */
const burstOnlyUsage: GradeCreditUsage = {
    credit: { remaining5h: 2, remainingWeek: 40, limitWeek: 150 },
}

/** Credit tuần đã về 0 — dùng cho case model pin và case chưa biết chi phí Auto. */
const emptyUsage: GradeCreditUsage = {
    credit: { remaining5h: 0, remainingWeek: 0, limitWeek: 20 },
}

export const Loading: Story = {
    render: () =>
        blockShell(
            <div className="flex flex-col gap-2">
                <div className="flex h-6 items-center rounded border border-dashed border-default px-2 text-xs text-muted">
                    (không render gì — creditUsage null)
                </div>
                <GradeCreditCaption
                    creditUsage={null}
                    hasPinnedModel={false}
                    autoCreditCost={10}
                    onOpenDetails={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

export const PlentyCredit: Story = {
    render: () =>
        blockShell(
            <GradeCreditCaption
                creditUsage={plentyUsage}
                hasPinnedModel={false}
                autoCreditCost={5}
                onOpenDetails={() => {}}
            />,
            ANATOMY,
        ),
}

export const BlockedByWeek: Story = {
    render: () =>
        blockShell(
            <GradeCreditCaption
                creditUsage={lowWeekUsage}
                hasPinnedModel={false}
                autoCreditCost={5}
                onOpenDetails={() => {}}
            />,
            ANATOMY,
        ),
}

export const BlockedByBurst: Story = {
    render: () =>
        blockShell(
            <GradeCreditCaption
                creditUsage={burstOnlyUsage}
                hasPinnedModel={false}
                autoCreditCost={5}
                onOpenDetails={() => {}}
            />,
            ANATOMY,
        ),
}

export const PinnedModelNoWarning: Story = {
    render: () =>
        blockShell(
            <GradeCreditCaption
                creditUsage={emptyUsage}
                hasPinnedModel
                autoCreditCost={5}
                onOpenDetails={() => {}}
            />,
            ANATOMY,
        ),
}

export const UnknownAutoCost: Story = {
    render: () =>
        blockShell(
            <GradeCreditCaption
                creditUsage={emptyUsage}
                hasPinnedModel={false}
                autoCreditCost={undefined}
                onOpenDetails={() => {}}
            />,
            ANATOMY,
        ),
}

export const Interactive: Story = {
    render: () =>
        blockShell(
            <GradeCreditCaption
                creditUsage={plentyUsage}
                hasPinnedModel={false}
                autoCreditCost={5}
                onOpenDetails={() => {}}
            />,
            ANATOMY,
        ),
}

export const StaticNoDetails: Story = {
    render: () =>
        blockShell(
            <GradeCreditCaption
                creditUsage={plentyUsage}
                hasPinnedModel={false}
                autoCreditCost={5}
            />,
            ANATOMY,
        ),
}

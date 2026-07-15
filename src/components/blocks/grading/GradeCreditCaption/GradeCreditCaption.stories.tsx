import type { Meta, StoryObj } from "@storybook/nextjs"
import { GradeCreditCaption } from "./index"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { AiSubTier } from "@/modules/api/graphql/queries/query-my-ai-settings"
import type { QueryMyAiQuotaResponseData } from "@/modules/api/graphql/queries/types/my-ai-quota"

const baseCreditUsage: QueryMyAiQuotaResponseData = {
    tier: null,
    credit: {
        limit5h: 20,
        used5h: 6,
        remaining5h: 14,
        limitWeek: 100,
        usedWeek: 38,
        remainingWeek: 62,
    },
    window5hResetAt: "2026-07-15T14:00:00.000Z",
    windowWeekResetAt: "2026-07-20T00:00:00.000Z",
    allowedCategories: [AiModelCategory.Free, AiModelCategory.Economy],
    ceil: {
        default: null,
        chatbot: null,
        grading: null,
        interview: null,
    },
}

const meta: Meta<typeof GradeCreditCaption> = {
    title: "Blocks/Grading/GradeCreditCaption",
    component: GradeCreditCaption,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof GradeCreditCaption>

/** Hiển thị dòng chú thích "còn N/M credit tuần này" bên dưới bộ chọn model khi vẫn còn đủ hạn mức. */
export const Default: Story = {
    parameters: { usage: "Hiển thị dòng chú thích \"còn N/M credit tuần này\" bên dưới bộ chọn model khi vẫn còn đủ hạn mức." },
    render: () => (
        <GradeCreditCaption
            creditUsage={baseCreditUsage}
            hasPinnedModel={false}
            autoCreditCost={5}
            onOpenDetails={() => {}}
        />
    ),
}

/** So sánh cạnh nhau hai lý do chặn lane Auto — hết credit tuần và chạm trần cửa sổ 5 giờ — để thấy dòng cảnh báo đổi thông điệp theo đúng cửa sổ đang chặn. */
export const QuotaReached: Story = {
    parameters: { usage: "Dùng khi cần đối chiếu hai lý do chặn lane Auto (hết credit tuần vs chạm trần burst 5 giờ) cạnh nhau để kiểm dòng cảnh báo báo đúng lý do." },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted">Hết credit tuần</span>
                <GradeCreditCaption
                    creditUsage={{
                        ...baseCreditUsage,
                        credit: {
                            ...baseCreditUsage.credit,
                            remainingWeek: 2,
                        },
                    }}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted">Chạm trần burst 5 giờ</span>
                <GradeCreditCaption
                    creditUsage={{
                        ...baseCreditUsage,
                        credit: {
                            ...baseCreditUsage.credit,
                            remaining5h: 1,
                        },
                    }}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </div>
        </div>
    ),
}

/** Khi người dùng đã ghim sẵn một model cụ thể, dòng credit chỉ hiển thị số dư, không bật cảnh báo vì chi phí thực của model ghim chưa biết ở đây. */
export const PinnedModelNoWarning: Story = {
    parameters: { usage: "Khi người dùng đã ghim sẵn một model cụ thể, dòng credit chỉ hiển thị số dư, không bật cảnh báo vì chi phí thực của model ghim chưa biết ở đây." },
    render: () => (
        <GradeCreditCaption
            creditUsage={{
                ...baseCreditUsage,
                tier: AiSubTier.Plus,
                credit: {
                    ...baseCreditUsage.credit,
                    remainingWeek: 1,
                },
            }}
            hasPinnedModel
            autoCreditCost={5}
            onOpenDetails={() => {}}
        />
    ),
}

/** Chưa có snapshot hạn mức (đang tải) thì component không render gì cả — vùng canvas để trống có chủ đích. */
export const LoadingRendersNothing: Story = {
    parameters: { usage: "Chưa có snapshot hạn mức (đang tải) thì component không render gì cả — vùng canvas để trống có chủ đích." },
    render: () => (
        <GradeCreditCaption
            creditUsage={undefined}
            hasPinnedModel={false}
            autoCreditCost={undefined}
            onOpenDetails={() => {}}
        />
    ),
}

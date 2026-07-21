import type { Meta, StoryObj } from "@storybook/nextjs"
import { GradeCreditCaption } from "@/components/blocks/grading/GradeCreditCaption"
import { AiSubTier } from "@/modules/api/graphql/queries/query-my-ai-settings"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import type { QueryMyAiQuotaResponseData } from "@/modules/api/graphql/queries/types/my-ai-quota"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof GradeCreditCaption> = {
    title: "Legacy/Blocks/Grading/GradeCreditCaption",
    component: GradeCreditCaption,
}
export default meta
type Story = StoryObj<typeof GradeCreditCaption>

/** Snapshot của học viên Plus, còn nhiều credit trong cả hai khung giờ. */
const plentyUsage: QueryMyAiQuotaResponseData = {
    tier: AiSubTier.Plus,
    credit: {
        limit5h: 20,
        used5h: 10,
        remaining5h: 10,
        limitWeek: 60,
        usedWeek: 18,
        remainingWeek: 42,
    },
    window5hResetAt: "2026-07-21T15:00:00.000Z",
    windowWeekResetAt: "2026-07-27T00:00:00.000Z",
    allowedCategories: [AiModelCategory.Free, AiModelCategory.Economy, AiModelCategory.Balanced],
    ceil: { default: null, chatbot: null, grading: null, interview: null },
}

/** Sắp cạn credit tuần (dưới mức một lượt Auto tốn) nhưng khung 5h vẫn còn dư. */
const lowWeekUsage: QueryMyAiQuotaResponseData = {
    tier: AiSubTier.Plus,
    credit: {
        limit5h: 20,
        used5h: 4,
        remaining5h: 2,
        limitWeek: 60,
        usedWeek: 58,
        remainingWeek: 2,
    },
    window5hResetAt: "2026-07-21T15:00:00.000Z",
    windowWeekResetAt: "2026-07-27T00:00:00.000Z",
    allowedCategories: [AiModelCategory.Free, AiModelCategory.Economy, AiModelCategory.Balanced],
    ceil: { default: null, chatbot: null, grading: null, interview: null },
}

/** Vừa dùng dồn hết khung 5h nhưng credit tuần vẫn còn dư dả. */
const burstOnlyUsage: QueryMyAiQuotaResponseData = {
    tier: AiSubTier.Pro,
    credit: {
        limit5h: 20,
        used5h: 18,
        remaining5h: 2,
        limitWeek: 150,
        usedWeek: 110,
        remainingWeek: 40,
    },
    window5hResetAt: "2026-07-21T15:00:00.000Z",
    windowWeekResetAt: "2026-07-27T00:00:00.000Z",
    allowedCategories: [AiModelCategory.Free, AiModelCategory.Economy, AiModelCategory.Balanced, AiModelCategory.Premium],
    ceil: { default: null, chatbot: null, grading: null, interview: null },
}

/** Credit tuần đã về 0 — dùng cho case model pin và case chưa biết chi phí Auto. */
const emptyUsage: QueryMyAiQuotaResponseData = {
    tier: null,
    credit: {
        limit5h: 6,
        used5h: 6,
        remaining5h: 0,
        limitWeek: 20,
        usedWeek: 20,
        remainingWeek: 0,
    },
    window5hResetAt: "2026-07-21T15:00:00.000Z",
    windowWeekResetAt: "2026-07-27T00:00:00.000Z",
    allowedCategories: [AiModelCategory.Free],
    ceil: { default: null, chatbot: null, grading: null, interview: null },
}

/**
 * Toàn bộ state của GradeCreditCaption trong một gallery: chưa có snapshot
 * (render null), còn nhiều credit, hai lý do bị chặn Auto khác nhau (tuần vs
 * cụm 5h), model pin không bị áp cảnh báo, chưa biết chi phí Auto nên không
 * chặn, và hai chế độ tương tác (button mở modal chi tiết vs span tĩnh).
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Đặt ngay dưới hoặc cạnh model picker của mọi màn AI để hiện dòng \"còn N/M credit tuần này\". Xem gallery này trước khi ghép vào một surface mới — đặc biệt để chọn đúng lúc nào cảnh báo chặn Auto được phép hiện, vì cảnh báo chỉ áp cho lane Auto (biết trước chi phí), không áp cho model đã pin cố định.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Chưa có snapshot — đang tải quota"
                hint="creditUsage null/undefined trong lúc myAiQuota chưa trả kết quả — component render null hoàn toàn, không chiếm chỗ để khung model picker không bị giật layout khi quota tới sau."
            >
                <div className="flex h-6 items-center rounded border border-dashed border-default px-2 text-xs text-muted">
                    (không render gì)
                </div>
                <GradeCreditCaption
                    creditUsage={null}
                    hasPinnedModel={false}
                    autoCreditCost={10}
                    onOpenDetails={() => {}}
                />
            </Variant>
            <Variant
                label="Còn nhiều credit — lane Auto"
                hint="remainingWeek đủ chi trả lượt Auto kế tiếp nên chỉ hiện dòng muted bình thường, không cảnh báo."
            >
                <GradeCreditCaption
                    creditUsage={plentyUsage}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </Variant>
            <Variant
                label="Hết credit trong tuần (blockedByWeek)"
                hint="remainingWeek nhỏ hơn autoCreditCost và đang ở lane Auto — hiện dòng cảnh báo đỏ kèm icon, đúng lý do là hết credit TUẦN."
            >
                <GradeCreditCaption
                    creditUsage={lowWeekUsage}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </Variant>
            <Variant
                label="Vừa dồn hết khung 5h (blockedByBurst)"
                hint="remaining5h không đủ nhưng remainingWeek vẫn còn dư — phải nói đúng là vừa dùng dồn trong ít phút, không được nói sai là hết credit tuần."
            >
                <GradeCreditCaption
                    creditUsage={burstOnlyUsage}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </Variant>
            <Variant
                label="Model đã pin cố định — không áp cảnh báo"
                hint="Dù credit tuần đã về 0, hasPinnedModel true khiến cảnh báo chặn Auto không hiện — chi phí của model pin không được biết ở block này nên chỉ hiện dòng usage thường."
            >
                <GradeCreditCaption
                    creditUsage={emptyUsage}
                    hasPinnedModel
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </Variant>
            <Variant
                label="Chưa biết chi phí Auto (autoCreditCost undefined)"
                hint="Khi systemConfig chưa tải xong autoCreditCost, block không thể tính có đủ trả nổi hay không nên bỏ qua cảnh báo dù credit tuần đã về 0."
            >
                <GradeCreditCaption
                    creditUsage={emptyUsage}
                    hasPinnedModel={false}
                    autoCreditCost={undefined}
                    onOpenDetails={() => {}}
                />
            </Variant>
            <Variant
                label="Có onOpenDetails — bấm được để mở modal chi tiết"
                hint="Khi surface có modal chi tiết AI quota, truyền onOpenDetails để dòng caption trở thành button, có hover/focus ring."
            >
                <GradeCreditCaption
                    creditUsage={plentyUsage}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                    onOpenDetails={() => {}}
                />
            </Variant>
            <Variant
                label="Không có onOpenDetails — chỉ là dòng tĩnh"
                hint="Ở surface không có modal chi tiết, bỏ onOpenDetails để caption chỉ là span, không mời bấm."
            >
                <GradeCreditCaption
                    creditUsage={plentyUsage}
                    hasPinnedModel={false}
                    autoCreditCost={5}
                />
            </Variant>
        </Gallery>
    ),
}

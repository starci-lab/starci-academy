import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { AiCategoryChip } from "@/components/blocks/chips/AiCategoryChip"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"

const meta: Meta<typeof AiCategoryChip> = {
    title: "Features/Chips/AiCategoryChip",
    component: AiCategoryChip,
}
export default meta
type Story = StoryObj<typeof AiCategoryChip>

/** Reference table mapping model tier → dot color, ordered along the exact CATEGORY_ORDER scale from cheapest to strongest, with each tier's unlock condition. */
export const AllCategories: Story = {
    parameters: { usage: "Reference table mapping model tier → dot color, ordered along the exact `CATEGORY_ORDER` scale (cheapest → strongest) that `GradeModelDropdown` uses to compare \"below the floor\". Consult it when designing the model picker: which tier needs unlocking, which anyone can pick. A tier is a RANK, not a status — colors come from the Tailwind palette (`AI_CATEGORY_COLOR`), not borrowed accent/success/warning/danger: 5 tiers need 5 distinct colors, whereas 4 semantic tokens would force 2 tiers to share a color." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Free</Label>
                    <Typography type="body-sm" color="muted">
                        The cheapest tier. Anyone can pick it, no unlock required.
                    </Typography>
                </div>
                <AiCategoryChip category={AiModelCategory.Free} />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Economy</Label>
                    <Typography type="body-sm" color="muted">
                        Still selectable without unlocking — only Balanced and above fall within PLAN_CATEGORIES.
                    </Typography>
                </div>
                <AiCategoryChip category={AiModelCategory.Economy} />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Balanced</Label>
                    <Typography type="body-sm" color="muted">
                        The FIRST tier that requires unlocking: you must pay or be enrolled in a course to pick it.
                    </Typography>
                </div>
                <AiCategoryChip category={AiModelCategory.Balanced} />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Premium</Label>
                    <Typography type="body-sm" color="muted">
                        Requires unlocking. Tier 4 of 5 on the CATEGORY_ORDER scale.
                    </Typography>
                </div>
                <AiCategoryChip category={AiModelCategory.Premium} />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Frontier</Label>
                    <Typography type="body-sm" color="muted">
                        The strongest model, requires unlocking. The top tier — now has its own color, no longer matching Premium.
                    </Typography>
                </div>
                <AiCategoryChip category={AiModelCategory.Frontier} />
            </div>
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { AiCategoryChip } from "@/components/blocks/chips/AiCategoryChip"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof AiCategoryChip> = {
    title: "Features/Chips/AiCategoryChip",
    component: AiCategoryChip,
}
export default meta
type Story = StoryObj<typeof AiCategoryChip>

/**
 * Reference table mapping model tier → dot color, ordered along the exact
 * CATEGORY_ORDER scale from cheapest to strongest, with each tier's unlock
 * condition.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Free"
                hint="The cheapest tier. Anyone can pick it, no unlock required."
            >
                <AiCategoryChip category={AiModelCategory.Free} />
            </Variant>
            <Variant
                label="Economy"
                hint="Still selectable without unlocking — only Balanced and above fall within PLAN_CATEGORIES."
            >
                <AiCategoryChip category={AiModelCategory.Economy} />
            </Variant>
            <Variant
                label="Balanced"
                hint="The FIRST tier that requires unlocking: you must pay or be enrolled in a course to pick it."
            >
                <AiCategoryChip category={AiModelCategory.Balanced} />
            </Variant>
            <Variant
                label="Premium"
                hint="Requires unlocking. Tier 4 of 5 on the CATEGORY_ORDER scale."
            >
                <AiCategoryChip category={AiModelCategory.Premium} />
            </Variant>
            <Variant
                label="Frontier"
                hint="The strongest model, requires unlocking. The top tier — now has its own color, no longer matching Premium."
            >
                <AiCategoryChip category={AiModelCategory.Frontier} />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Reference table mapping model tier → dot color, ordered along the exact `CATEGORY_ORDER` scale " +
            "(cheapest → strongest) that `GradeModelDropdown` uses to compare \"below the floor\". Consult it " +
            "when designing the model picker: which tier needs unlocking, which anyone can pick. A tier is a " +
            "RANK, not a status — colors come from the Tailwind palette (`AI_CATEGORY_COLOR`), not borrowed " +
            "accent/success/warning/danger: 5 tiers need 5 distinct colors, whereas 4 semantic tokens would " +
            "force 2 tiers to share a color.",
    },
}

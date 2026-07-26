import type { Meta, StoryObj } from "@storybook/nextjs"
import { Divider, type DividerVariant } from "@sb-components/atoms/display/Divider/Divider"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Divider.Base`: bọc thẳng HeroUI `Separator` (HeroUI không có "Divider",
 * đổi tên cho ngữ vựng app). Atom lá — không dựng lại atom nào khác nên KHÔNG có
 * deps: bỏ hẳn prop `annotate` (§12g, thầy chốt 2026-07-26 lần 2). `Line`/`Label`
 * là span NỘI BỘ của chính atom này (khe, không có nhà để nhảy tới), không phải deps.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g): `orientation` · `variant` · `label`, mỗi prop một
 * leaf, leaf render ĐỦ mọi giá trị. Bản trước tách `Horizontal`/`Vertical` thành hai
 * leaf riêng — đó là tách theo GIÁ TRỊ của CÙNG một prop `orientation`, đúng cái
 * §12g cấm (nêu thẳng ví dụ `Small`/`Medium`/`OnDark` là sai) — gộp lại thành một
 * leaf `Orientation` render đủ cả hai giá trị. `variant` trước đây chưa có leaf nào
 * cả, dù nó cũng là prop có hình — thêm `Variants` cho đủ bộ.
 */
const meta: Meta<typeof Divider.Base> = {
    title: "Atoms/Display/Divider/Divider.Base",
    component: Divider.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Divider.Base>

/** ĐỦ union `DividerVariant` — thiếu một giá trị là giá trị đó sẽ mọc leaf lạc chỗ. */
const VARIANTS: Array<DividerVariant> = ["default", "secondary", "tertiary"]

/** Leaf TRẦN — orientation mặc định (horizontal), variant mặc định, không nhãn. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="Bare divider"
                reason="The one rule in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                note="Defaults to a horizontal line, default weight, no label."
                code={"<Divider.Base />"}
            >
                <div className="w-72">
                    <Divider.Base showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `orientation` — ĐỦ 2 giá trị: ngang (mặc định) và dọc. */
export const Orientation: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="Prop `orientation`"
                note="Vertical needs a parent with a height to show against — use it between items sitting on one row."
                code={`<Divider.Base />
<Divider.Base orientation="vertical" />`}
            >
                <div className="flex flex-col gap-6">
                    <div className="w-72">
                        <Divider.Base showAnatomy />
                    </div>
                    <div className="flex h-16 items-center gap-4">
                        <span className="text-muted text-sm">Lesson</span>
                        <Divider.Base orientation="vertical" />
                        <span className="text-muted text-sm">Exercise</span>
                        <Divider.Base orientation="vertical" />
                        <span className="text-muted text-sm">Discussion</span>
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `variant` — ĐỦ union weight/tone của đường kẻ. */
export const Variants: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="Prop `variant`"
                note="Line weight/tone only — orientation and label stay at their defaults."
                code={`<Divider.Base variant="default" />
<Divider.Base variant="secondary" />
<Divider.Base variant="tertiary" />`}
            >
                <div className="flex w-72 flex-col gap-4">
                    {VARIANTS.map((variant, index) => (
                        <Divider.Base key={variant} variant={variant} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `label` — chỉ hợp lệ ngang: rule · nhãn · rule. */
export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="Prop `label`"
                note="Horizontal only — the atom builds two flex-1 rules around the centered text (e.g. 'OR' on a sign-in form)."
                code={"<Divider.Base label=\"OR\" />"}
            >
                <div className="w-72">
                    <Divider.Base label="OR" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

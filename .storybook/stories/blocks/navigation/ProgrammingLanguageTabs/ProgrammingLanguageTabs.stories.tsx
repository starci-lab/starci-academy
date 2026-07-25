import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { ProgrammingLanguageTabs, ProgrammingLanguageTabsVariant } from "@sb-components/blocks/navigation/ProgrammingLanguageTabs/ProgrammingLanguageTabs"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a thin wrapper over `ExtendedTabs`: PLT owns the fixed language set,
 * icon map, availability + active-key resolution logic, and renders
 * `ExtendedTabs` with mapped `Tabs.Tab`s (brand glyph + label).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis. `ExtendedTabs` lives in a sibling folder (not editable
 * here) so it is badged as ONE opaque node via a plain marker wrapper — its own
 * chrome anatomy is that component's own story, not drilled into here.
 */
const meta: Meta<typeof ProgrammingLanguageTabs> = {
    title: "Design/Navigation/ProgrammingLanguageTabs",
    component: ProgrammingLanguageTabs,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ProgrammingLanguageTabs>

const tabsFrame = (children: Array<AnatomyNode>): AnatomyNode => ({
    name: "ExtendedTabs",
    tier: "primitive",
    role: "khung tab (pill hoặc underline chrome, sở hữu bởi ExtendedTabs)",
    children,
})
const TAB: AnatomyNode = { name: "Tabs.Tab", tier: "primitive", role: "mỗi tab ngôn ngữ (icon brand + nhãn), lặp theo 4 ngôn ngữ mặc định; disabled khi không có sample" }
const PARTS: Array<AnatomyNode> = [tabsFrame([TAB])]

/** Owns `selectedLang` so the active tab / indicator updates on press. */
const Controlled = ({
    availableLangs,
    initialLang,
    ariaLabel,
    alwaysShow = false,
    variant = ProgrammingLanguageTabsVariant.Pill,
    surfaceBorder = true,
}: {
    availableLangs: Array<string>
    initialLang: string
    ariaLabel: string
    alwaysShow?: boolean
    variant?: ProgrammingLanguageTabsVariant
    surfaceBorder?: boolean
}) => {
    const [selectedLang, setSelectedLang] = useState(initialLang)
    return (
        <ProgrammingLanguageTabs
            showAnatomy
            availableLangs={availableLangs}
            selectedLang={selectedLang}
            onSelectLang={setSelectedLang}
            ariaLabel={ariaLabel}
            alwaysShow={alwaysShow}
            variant={variant}
            surfaceBorder={surfaceBorder}
        />
    )
}

/** Pill (default): all four languages available. */
export const PillAll: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="ProgrammingLanguageTabs" tier="design" leaf="PillAll" parts={PARTS} reason="PLT là thin wrapper: 1 khung ExtendedTabs (pill chrome) chứa 4 Tabs.Tab lặp theo ngôn ngữ mặc định.">
                <Controlled availableLangs={["typescript", "java", "csharp", "go"]} initialLang="typescript" ariaLabel="Ngôn ngữ lập trình" />
            </BlockAnatomy>
        </div>
    ),
}

/** Pill: only some languages have sample code — the rest render disabled. */
export const PillPartialDisabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="ProgrammingLanguageTabs" tier="design" leaf="PillPartialDisabled" parts={PARTS} note="Ngôn ngữ không có trong `availableLangs` → Tabs.Tab tương ứng `isDisabled` (vẫn cùng 4 Tab, không ẩn).">
                <Controlled availableLangs={["typescript", "go"]} initialLang="typescript" ariaLabel="Ngôn ngữ lập trình" />
            </BlockAnatomy>
        </div>
    ),
}

/** Secondary underline (full-width) with the `border-b` wrapper (`surfaceBorder` default). */
export const SecondaryUnderline: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="ProgrammingLanguageTabs" tier="design" leaf="SecondaryUnderline" parts={PARTS} note="`variant=Secondary` đổi chrome ExtendedTabs sang underline full-width — vẫn cùng ExtendedTabs+Tabs.Tab.">
                <Controlled
                    availableLangs={["typescript", "java", "csharp", "go"]}
                    initialLang="java"
                    ariaLabel="Ngôn ngữ lập trình"
                    variant={ProgrammingLanguageTabsVariant.Secondary}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Secondary with `surfaceBorder={false}` — the parent owns the divider, no double border. */
export const SecondaryNoBorder: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="ProgrammingLanguageTabs" tier="design" leaf="SecondaryNoBorder" parts={PARTS} note="`surfaceBorder=false` bỏ `border-b` wrapper NGOÀI ExtendedTabs — không phải node riêng, chỉ 1 class toggle.">
                <Controlled
                    availableLangs={["typescript", "java", "csharp", "go"]}
                    initialLang="csharp"
                    ariaLabel="Ngôn ngữ lập trình"
                    variant={ProgrammingLanguageTabsVariant.Secondary}
                    surfaceBorder={false}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Empty + no `alwaysShow` → the component returns null (renders nothing). */
export const EmptyHidden: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex flex-col gap-2">
                <BlockAnatomy name="ProgrammingLanguageTabs" tier="design" leaf="EmptyHidden" parts={[]} note="`availableLangs=[]` không `alwaysShow` → component trả `null`, không ExtendedTabs/Tab nào render.">
                    <ProgrammingLanguageTabs
                        showAnatomy
                        availableLangs={[]}
                        selectedLang="typescript"
                        onSelectLang={() => {}}
                        ariaLabel="Ngôn ngữ lập trình"
                    />
                </BlockAnatomy>
                <Typography type="body-sm" color="muted">
                    (Không render gì ở đây — component trả về null)
                </Typography>
            </div>
        </div>
    ),
}

/** Empty but `alwaysShow` → all four tabs render, every one disabled (a new-lesson preview frame). */
export const AlwaysShowAllDisabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="ProgrammingLanguageTabs" tier="design" leaf="AlwaysShowAllDisabled" parts={PARTS} note="`alwaysShow` giữ đủ 4 Tabs.Tab dù `availableLangs` rỗng — mọi Tab `isDisabled`.">
                <Controlled availableLangs={[]} initialLang="typescript" ariaLabel="Ngôn ngữ lập trình" alwaysShow />
            </BlockAnatomy>
        </div>
    ),
}

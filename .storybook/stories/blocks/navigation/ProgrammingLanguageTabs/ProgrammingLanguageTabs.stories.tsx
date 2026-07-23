import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { ProgrammingLanguageTabs, ProgrammingLanguageTabsVariant } from "./ProgrammingLanguageTabs"

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
            <Controlled availableLangs={["typescript", "java", "csharp", "go"]} initialLang="typescript" ariaLabel="Ngôn ngữ lập trình" />
        </div>
    ),
}

/** Pill: only some languages have sample code — the rest render disabled. */
export const PillPartialDisabled: Story = {
    render: () => (
        <div className="p-8">
            <Controlled availableLangs={["typescript", "go"]} initialLang="typescript" ariaLabel="Ngôn ngữ lập trình" />
        </div>
    ),
}

/** Secondary underline (full-width) with the `border-b` wrapper (`surfaceBorder` default). */
export const SecondaryUnderline: Story = {
    render: () => (
        <div className="p-8">
            <Controlled
                availableLangs={["typescript", "java", "csharp", "go"]}
                initialLang="java"
                ariaLabel="Ngôn ngữ lập trình"
                variant={ProgrammingLanguageTabsVariant.Secondary}
            />
        </div>
    ),
}

/** Secondary with `surfaceBorder={false}` — the parent owns the divider, no double border. */
export const SecondaryNoBorder: Story = {
    render: () => (
        <div className="p-8">
            <Controlled
                availableLangs={["typescript", "java", "csharp", "go"]}
                initialLang="csharp"
                ariaLabel="Ngôn ngữ lập trình"
                variant={ProgrammingLanguageTabsVariant.Secondary}
                surfaceBorder={false}
            />
        </div>
    ),
}

/** Empty + no `alwaysShow` → the component returns null (renders nothing). */
export const EmptyHidden: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex flex-col gap-2">
                <ProgrammingLanguageTabs
                    availableLangs={[]}
                    selectedLang="typescript"
                    onSelectLang={() => {}}
                    ariaLabel="Ngôn ngữ lập trình"
                />
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
            <Controlled availableLangs={[]} initialLang="typescript" ariaLabel="Ngôn ngữ lập trình" alwaysShow />
        </div>
    ),
}

import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { MultiSelect } from "./MultiSelect"
import type { MultiSelectOption } from "./MultiSelect"

/**
 * MultiSelect is a searchable multi-select field composing FieldShell (label /
 * hint / error / skeleton) with a HeroUI ComboBox search-and-pick anatomy.
 * Chosen options render as removable chips above the field; picking a row
 * appends its id to the controlled `value` array and clears the search text.
 */
const meta: Meta<typeof MultiSelect> = {
    title: "Primitives/Forms/MultiSelect",
    component: MultiSelect,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MultiSelect>

const SKILL_OPTIONS: Array<MultiSelectOption> = [
    { id: "ts", label: "TypeScript", description: "Ngôn ngữ chính của FE + BE" },
    { id: "react", label: "React", description: "Thư viện UI" },
    { id: "nestjs", label: "NestJS", description: "Framework backend" },
    { id: "postgres", label: "PostgreSQL", description: "Cơ sở dữ liệu quan hệ" },
    { id: "docker", label: "Docker", description: "Đóng gói + triển khai" },
    { id: "graphql", label: "GraphQL", description: "Lớp API" },
]

/** Local controlled wrapper so the field is pickable on the canvas. */
const Controlled = ({
    initialValue = [],
    label,
    description,
    errorMessage,
    isDisabled,
}: {
    initialValue?: Array<string>
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    isDisabled?: boolean
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <MultiSelect
            label={label}
            description={description}
            errorMessage={errorMessage}
            options={SKILL_OPTIONS}
            value={value}
            onValueChange={setValue}
            isDisabled={isDisabled}
        />
    )
}

/** Default: a plain labelled field with a couple of options already picked. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Kỹ năng" initialValue={["ts", "react"]} />
        </div>
    ),
}

/** WithHint: a description under the label, nothing picked yet. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Kỹ năng"
                description="Chọn các công nghệ bạn tự tin sử dụng."
            />
        </div>
    ),
}

/** WithError: an invalid field with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Kỹ năng"
                errorMessage="Chọn ít nhất một kỹ năng."
            />
        </div>
    ),
}

/** Disabled: existing chips can't be removed and no new pick can be made. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Kỹ năng" initialValue={["ts", "nestjs"]} isDisabled />
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over a select-box skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <MultiSelect
                label="Kỹ năng"
                options={SKILL_OPTIONS}
                value={[]}
                onValueChange={() => {}}
                isSkeleton
            />
        </div>
    ),
}

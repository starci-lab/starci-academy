import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SwitchField } from "./SwitchField"

/**
 * SwitchField is the boolean toggle field — a controlled `<Switch>` with its
 * label rendered BESIDE it (row: switch + label), composing FieldShell for the
 * hint / error / skeleton column around that row. Bare `value`/`onValueChange`
 * in, all field scaffolding owned by the component.
 */
const meta: Meta<typeof SwitchField> = {
    title: "Primitives/Forms/SwitchField",
    component: SwitchField,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SwitchField>

/** Local controlled wrapper so the switch actually toggles on the canvas. */
const Controlled = ({
    initialValue = false,
    label,
    description,
    errorMessage,
    isDisabled,
    size,
}: {
    initialValue?: boolean
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    isDisabled?: boolean
    size?: "sm" | "md" | "lg"
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <SwitchField
            label={label}
            description={description}
            errorMessage={errorMessage}
            value={value}
            onValueChange={setValue}
            isDisabled={isDisabled}
            size={size}
        />
    )
}

/** Default: a plain toggle row with a beside label. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Nhận email thông báo" />
        </div>
    ),
}

/** WithHint: a description under the row explaining the toggle. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Khoá hồ sơ"
                description="Ẩn hồ sơ khỏi người lạ; chỉ bạn xem được."
                initialValue
            />
        </div>
    ),
}

/** WithError: an invalid toggle with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled
                label="Đồng ý điều khoản"
                errorMessage="Bạn cần đồng ý điều khoản để tiếp tục."
            />
        </div>
    ),
}

/** Disabled: the toggle is not interactive. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <Controlled label="Xác thực 2 lớp" initialValue isDisabled />
        </div>
    ),
}

/** Skeleton: the loading mirror — a switch-track skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <SwitchField label="Nhận email thông báo" value={false} onValueChange={() => {}} isSkeleton />
        </div>
    ),
}

/** Sizes: HeroUI's Switch meaningfully supports sm/md/lg tracks. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8 max-w-sm flex flex-col gap-6">
            <Controlled label="Nhỏ (sm)" size="sm" initialValue />
            <Controlled label="Vừa (md)" size="md" initialValue />
            <Controlled label="Lớn (lg)" size="lg" initialValue />
        </div>
    ),
}

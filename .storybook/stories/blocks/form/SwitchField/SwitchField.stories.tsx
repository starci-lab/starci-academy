import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SwitchField } from "@sb-components/blocks/form/SwitchField/SwitchField"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

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
    showAnatomy,
}: {
    initialValue?: boolean
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    isDisabled?: boolean
    size?: "sm" | "md" | "lg"
    showAnatomy?: boolean
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
            showAnatomy={showAnatomy}
        />
    )
}

// leaf live (Default/WithHint/WithError/Disabled/Sizes): FieldShell (mô tả·lỗi) bọc
// row switch+label — label BÊN CẠNH (không qua FieldShell.label, canon boolean toggle).
const LIVE_PARTS: Array<AnatomyNode> = [
    { name: "FieldShell", tier: "primitive", role: "khung mô tả · lỗi bao quanh row (không label — beside control)" },
    { name: "Switch", tier: "primitive", role: "track bật/tắt (HeroUI Switch)" },
    { name: "Label", tier: "primitive", role: "nhãn cạnh switch, khi có `label`" },
]

// leaf Skeleton: FieldShell tự vẽ mirror — row switch+label KHÔNG render, chỉ Skeleton.Switch.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "FieldShell", tier: "primitive", role: "khung skeleton (control mirror, không label bar)" },
    { name: "Skeleton.Switch", tier: "primitive", role: "track switch placeholder" },
]

/** Default: a plain toggle row with a beside label. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="SwitchField" tier="primitive" leaf="Default" parts={LIVE_PARTS}>
                <Controlled label="Nhận email thông báo" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** WithHint: a description under the row explaining the toggle. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="SwitchField" tier="primitive" leaf="WithHint" parts={LIVE_PARTS} note="description render bên trong FieldShell, cùng node FieldShell.">
                <Controlled
                    label="Khoá hồ sơ"
                    description="Ẩn hồ sơ khỏi người lạ; chỉ bạn xem được."
                    initialValue
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** WithError: an invalid toggle with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="SwitchField" tier="primitive" leaf="WithError" parts={LIVE_PARTS} note="errorMessage render bên trong FieldShell, cùng node FieldShell.">
                <Controlled
                    label="Đồng ý điều khoản"
                    errorMessage="Bạn cần đồng ý điều khoản để tiếp tục."
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled: the toggle is not interactive. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="SwitchField" tier="primitive" leaf="Disabled" parts={LIVE_PARTS}>
                <Controlled label="Xác thực 2 lớp" initialValue isDisabled showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Skeleton: the loading mirror — a switch-track skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="SwitchField" tier="primitive" leaf="Skeleton" parts={SKELETON_PARTS} note="isSkeleton → FieldShell tự vẽ mirror; row switch+label KHÔNG render.">
                <SwitchField label="Nhận email thông báo" value={false} onValueChange={() => {}} isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Sizes: HeroUI's Switch meaningfully supports sm/md/lg tracks. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8 max-w-sm flex flex-col gap-6">
            <BlockAnatomy name="SwitchField" tier="primitive" leaf="Sizes" parts={LIVE_PARTS} note="3 size (sm/md/lg) cùng composition — chỉ đổi track size.">
                <div className="flex flex-col gap-6">
                    <Controlled label="Nhỏ (sm)" size="sm" initialValue showAnatomy />
                    <Controlled label="Vừa (md)" size="md" initialValue showAnatomy />
                    <Controlled label="Lớn (lg)" size="lg" initialValue showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

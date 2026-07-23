import type { Meta, StoryObj } from "@storybook/nextjs"
import { FieldShell } from "./FieldShell"

/**
 * FieldShell is the shared field wrapper every form input composes. It owns the
 * label / description / control / error column (canon §4) plus the loading mirror
 * (canon §8), so inputs pass a bare control and a control-shaped skeleton instead
 * of re-implementing that scaffolding. These stories demo it standalone around a
 * simple bordered placeholder control.
 */
const meta: Meta<typeof FieldShell> = {
    title: "Primitives/Form/FieldShell",
    component: FieldShell,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof FieldShell>

/** A stand-in control so FieldShell can be demoed without a real input. */
const PlaceholderControl = () => (
    <div className="flex h-9 w-full items-center rounded-xl border border-divider px-3 text-sm text-muted">
        Control slot
    </div>
)

/** Default: label + control, no hint or error. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <FieldShell label="Họ và tên">
                <PlaceholderControl />
            </FieldShell>
        </div>
    ),
}

/** WithHint: a description under the label explaining the field. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <FieldShell label="Tên hiển thị" description="Tên này xuất hiện trên hồ sơ công khai của bạn.">
                <PlaceholderControl />
            </FieldShell>
        </div>
    ),
}

/** WithError: the danger error line below the control. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <FieldShell
                label="Email"
                description="Dùng để đăng nhập và nhận thông báo."
                errorMessage="Email không hợp lệ — kiểm tra lại định dạng."
            >
                <PlaceholderControl />
            </FieldShell>
        </div>
    ),
}

/** Disabled: label dimmed via `isDisabled`. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <FieldShell label="Mã giới thiệu" isDisabled>
                <PlaceholderControl />
            </FieldShell>
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over the default control skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <FieldShell label="Họ và tên" isSkeleton />
        </div>
    ),
}

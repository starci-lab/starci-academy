import type { Meta, StoryObj } from "@storybook/nextjs"
import { FieldShell } from "@sb-components/blocks/form/FieldShell/FieldShell"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * FieldShell is the shared field wrapper every form input composes. It owns the
 * label / description / control / error column (canon §4) plus the loading mirror
 * (canon §8), so inputs pass a bare control and a control-shaped skeleton instead
 * of re-implementing that scaffolding. These stories demo it standalone around a
 * simple bordered placeholder control.
 */
const meta: Meta<typeof FieldShell> = {
    title: "Primitives/Forms/FieldShell",
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

/** Default: label + control, no hint or error — 2 part cố định. */
const DEFAULT_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "primitive", role: "nhãn field (text-sm font-medium)" },
    { name: "Control", tier: "primitive", role: "control thật (children tự do — ở đây PlaceholderControl)" },
]

export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="FieldShell"
                tier="primitive"
                leaf="Default"
                parts={DEFAULT_PARTS}
                reason="FieldShell sở hữu cột nhãn/hint/control/error (canon §4) để mọi input compose thay vì tự dựng lại khung này."
            >
                <FieldShell label="Họ và tên" showAnatomy>
                    <PlaceholderControl />
                </FieldShell>
            </BlockAnatomy>
        </div>
    ),
}

/** WithHint: a description under the label explaining the field. */
const HINT_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "primitive", role: "nhãn field" },
    { name: "Description", tier: "primitive", role: "hint muted dưới nhãn — LUÔN hiện, khác Error (chỉ hiện khi invalid)" },
    { name: "Control", tier: "primitive", role: "control thật" },
]

export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="FieldShell" tier="primitive" leaf="WithHint" parts={HINT_PARTS}>
                <FieldShell label="Tên hiển thị" description="Tên này xuất hiện trên hồ sơ công khai của bạn." showAnatomy>
                    <PlaceholderControl />
                </FieldShell>
            </BlockAnatomy>
        </div>
    ),
}

/** WithError: the danger error line below the control. */
const ERROR_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "primitive", role: "nhãn field" },
    { name: "Description", tier: "primitive", role: "hint muted dưới nhãn" },
    { name: "Control", tier: "primitive", role: "control thật" },
    { name: "Error", tier: "primitive", role: "dòng lỗi danger dưới control — chỉ hiện khi invalid" },
]

export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="FieldShell" tier="primitive" leaf="WithError" parts={ERROR_PARTS} note="Error line render SAU control, tách biệt với Description (luôn hiện) ở TRÊN control.">
                <FieldShell
                    label="Email"
                    description="Dùng để đăng nhập và nhận thông báo."
                    errorMessage="Email không hợp lệ — kiểm tra lại định dạng."
                    showAnatomy
                >
                    <PlaceholderControl />
                </FieldShell>
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled: label dimmed via `isDisabled`. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="FieldShell" tier="primitive" leaf="Disabled" parts={DEFAULT_PARTS} note="`isDisabled` chỉ dimmed style của Label — việc disable control thật là trách nhiệm của caller.">
                <FieldShell label="Mã giới thiệu" isDisabled showAnatomy>
                    <PlaceholderControl />
                </FieldShell>
            </BlockAnatomy>
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over the default control skeleton. */
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "primitive", role: "Skeleton.Typography (body-sm, width 1/3) mirror nhãn" },
    { name: "Control", tier: "primitive", role: "Skeleton.Input mặc định mirror control (hoặc `skeletonControl` do input truyền vào)" },
]

export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="FieldShell"
                tier="primitive"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                note="`isSkeleton` giữ ĐÚNG cột gap-2 (Label→Control) nhưng đổi cả hai sang shimmer — không hiện Description/Error khi loading."
            >
                <FieldShell label="Họ và tên" isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

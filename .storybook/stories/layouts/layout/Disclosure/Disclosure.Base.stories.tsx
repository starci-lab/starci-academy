import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { Disclosure } from "@sb-components/layouts/layout/Disclosure/Disclosure"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Disclosure.Base` is the generic collapsible khung: a trigger row (leading
 * caret + title) toggling ONE content region below it. Ground truth:
 * MockInterviewSession's "Tùy chỉnh phiên" green-room row (leading
 * `CaretDownIcon` rotated 180° on open, `text-muted hover:text-foreground`,
 * `w-fit` trigger). A multi-panel accordion is a different khung
 * (`SurfaceCard.Accordion`, items-driven), not a member of this family.
 */
const meta: Meta<typeof Disclosure.Base> = {
    title: "Layouts/Layout/Disclosure/Disclosure.Base",
    component: Disclosure.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Disclosure.Base>

const SampleContent = () => (
    <Typography type="body-sm" color="muted">
        Chọn số câu, cách trả lời và ngôn ngữ cho phiên phỏng vấn.
    </Typography>
)

/**
 * ANATOMY IS PER-LEAF: every story below wraps its render in its OWN BlockAnatomy
 * axis. `Disclosure.Base` composes a `Trigger` row (caret + title) and a `Content`
 * region — `Content` only MOUNTS while expanded (no exit animation), so closed
 * leaves show just `Trigger`.
 */
const CLOSED_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "primitive", role: "hàng caret + title, bấm để toggle" },
]
const OPEN_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "primitive", role: "hàng caret (xoay 180°) + title" },
    { name: "Content", tier: "primitive", role: "vùng nội dung (slot `body`), chỉ mount khi mở" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "primitive", role: "mirror hàng trigger lúc chưa sẵn sàng", state: "skeleton" },
]

/** Default: uncontrolled, closed on mount — click the trigger to expand it. `children` shorthand for `body`. */
export const Default: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure.Base"
                tier="primitive"
                leaf="Default"
                parts={CLOSED_PARTS}
                reason="Collapsible chung: Trigger toggle một Content mount/unmount, không có animation exit."
                code={"<Disclosure.Base title=\"Customize session\"><SampleContent /></Disclosure.Base>"}
            >
                <Disclosure.Base title="Tùy chỉnh phiên" showAnatomy>
                    <SampleContent />
                </Disclosure.Base>
            </BlockAnatomy>
        </div>
    ),
}

/** Open: `defaultOpen` starts expanded — caret rotated 180°, the `body` slot region visible. */
export const Open: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure.Base"
                tier="primitive"
                leaf="Open"
                parts={OPEN_PARTS}
                note="defaultOpen → Content mount ngay từ đầu, thêm 1 node so với leaf đóng. Ở đây dùng slot `body` thay cho children."
                code={"<Disclosure.Base title=\"Customize session\" defaultOpen body={<SampleContent />} />"}
            >
                <Disclosure.Base
                    title="Tùy chỉnh phiên"
                    defaultOpen
                    showAnatomy
                    body={<SampleContent />}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Local controlled wrapper so the toggle actually flips `isOpen` on the canvas. */
const ControlledExample = () => {
    const [open, setOpen] = useState(false)
    return (
        <Disclosure.Base title="Tùy chỉnh phiên" isOpen={open} onOpenChange={setOpen} showAnatomy>
            <SampleContent />
        </Disclosure.Base>
    )
}

/** Controlled: `isOpen`+`onOpenChange` — the parent owns the expanded state. */
export const Controlled: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure.Base"
                tier="primitive"
                leaf="Controlled"
                parts={CLOSED_PARTS}
                note="isOpen/onOpenChange do cha sở hữu — canvas mount ở trạng thái đóng, cùng composition với Default."
                code={"<Disclosure.Base title=\"Customize session\" isOpen={open} onOpenChange={setOpen}><SampleContent /></Disclosure.Base>"}
            >
                <ControlledExample />
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled: the trigger cannot toggle — dimmed, `cursor-not-allowed`, not focusable. */
export const Disabled: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure.Base"
                tier="primitive"
                leaf="Disabled"
                parts={CLOSED_PARTS}
                note="isDisabled chỉ đổi style/khả năng bấm của Trigger, composition không đổi."
                code={"<Disclosure.Base title=\"Customize session\" isDisabled><SampleContent /></Disclosure.Base>"}
            >
                <Disclosure.Base title="Tùy chỉnh phiên" isDisabled showAnatomy>
                    <SampleContent />
                </Disclosure.Base>
            </BlockAnatomy>
        </div>
    ),
}

/** Skeleton: the loading mirror — a trigger-row placeholder (`Skeleton.Disclosure`). */
export const Skeleton: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure.Base"
                tier="primitive"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                note="isSkeleton → render thẳng Skeleton.Disclosure, Trigger/Content thật chưa tồn tại."
                code={"<Disclosure.Base title=\"Customize session\" isSkeleton />"}
            >
                <Disclosure.Base title="Tùy chỉnh phiên" isSkeleton showAnatomy>
                    <SampleContent />
                </Disclosure.Base>
            </BlockAnatomy>
        </div>
    ),
}

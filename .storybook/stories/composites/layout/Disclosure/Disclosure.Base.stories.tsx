import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { Disclosure } from "@sb-components/composites/layout/Disclosure/Disclosure"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Disclosure.Base` is the generic collapsible khung: a trigger row (leading
 * caret + title) toggling ONE content region below it. Ground truth:
 * MockInterviewSession's "Tùy chỉnh phiên" green-room row (leading
 * `CaretDownIcon` rotated 180° on open, `text-muted hover:text-foreground`,
 * `w-fit` trigger). A multi-panel accordion is a different khung
 * (`SurfaceCard.Accordion`, items-driven), not a member of this family.
 *
 * 2026-07-27: migrated to the `states` API (§8) — each leaf below is a single
 * `states` entry, since none of them stacks more than one rendering.
 */
const meta: Meta<typeof Disclosure.Base> = {
    title: "Composites/Layout/Disclosure/Disclosure.Base",
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
    { name: "Trigger", tier: "composite", role: "the caret-plus-title row the reader presses to toggle the disclosure" },
]
const OPEN_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "composite", role: "the caret-plus-title row, its caret rotated 180° now that the content is showing" },
    { name: "Content", tier: "composite", role: "the content region carried in the `body` slot, mounted only while expanded" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "heroui", role: "a mirror of the trigger row while the section is not ready yet (HeroUI `Skeleton`, aliased `HeroSkeleton` in this file)", state: "skeleton" },
]

/** Default: uncontrolled, closed on mount — click the trigger to expand it. `children` shorthand for `body`. */
export const Default: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure.Base"
                tier="composite"
                leaf="Default"
                parts={CLOSED_PARTS}
                reason="The generic collapsible khung: a `Trigger` toggles ONE `Content` region that mounts and unmounts, with no exit animation. Uncontrolled is the default path — the component holds its own open/closed boolean, so the caller never has to declare `isOpen`/`onOpenChange` just to use it."
                states={[
                    {
                        name: "isOpen unset (uncontrolled, closed on mount)",
                        why: "Only the `Trigger` row mounts — the caret points down and the content below it does not exist in the DOM yet. Clicking the trigger flips the component's own internal open state, since no `isOpen` prop was passed to control it.",
                        code: "<Disclosure.Base title=\"Customize session\"><SampleContent /></Disclosure.Base>",
                        render: (
                            <Disclosure.Base title="Tùy chỉnh phiên" showAnatomy>
                                <SampleContent />
                            </Disclosure.Base>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Open: `defaultOpen` starts expanded — caret rotated 180°, the `body` slot region visible. */
export const Open: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure.Base"
                tier="composite"
                leaf="Open"
                parts={OPEN_PARTS}
                reason="The generic collapsible khung: a `Trigger` toggles ONE `Content` region that mounts and unmounts, with no exit animation. Whatever starts the disclosure open, the composition it lands on is the same two-node tree the trigger toggles into by hand."
                states={[
                    {
                        name: "defaultOpen = true",
                        why: "The `Content` node mounts from the start and the trigger's caret starts rotated 180°, one extra node compared to the closed leaf above. This is for a disclosure the caller wants expanded on first paint, using the slot `body` instead of `children`.",
                        code: "<Disclosure.Base title=\"Customize session\" defaultOpen body={<SampleContent />} />",
                        render: (
                            <Disclosure.Base
                                title="Tùy chỉnh phiên"
                                defaultOpen
                                showAnatomy
                                body={<SampleContent />}
                            />
                        ),
                    },
                ]}
            />
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
                tier="composite"
                leaf="Controlled"
                parts={CLOSED_PARTS}
                reason="The generic collapsible khung: a `Trigger` toggles ONE `Content` region that mounts and unmounts, with no exit animation. Controlled mode changes who owns the boolean, not what the tree looks like at either end."
                states={[
                    {
                        name: "isOpen and onOpenChange set (starts false)",
                        why: "The composition on mount is identical to the uncontrolled `Default` leaf — only `Trigger` exists, closed. The difference is invisible to the eye: the parent, not the component, now owns which boolean flips when the trigger is clicked.",
                        code: "<Disclosure.Base title=\"Customize session\" isOpen={open} onOpenChange={setOpen}><SampleContent /></Disclosure.Base>",
                        render: <ControlledExample />,
                    },
                ]}
            />
        </div>
    ),
}

/** Disabled: the trigger cannot toggle — dimmed, `cursor-not-allowed`, not focusable. */
export const Disabled: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure.Base"
                tier="composite"
                leaf="Disabled"
                parts={CLOSED_PARTS}
                reason="The generic collapsible khung: a `Trigger` toggles ONE `Content` region that mounts and unmounts, with no exit animation. `isDisabled` only touches how the trigger looks and behaves — it never changes the shape either state renders."
                states={[
                    {
                        name: "isDisabled = true",
                        why: "The trigger dims and switches to `cursor-not-allowed`, and it drops out of the tab order, but the composition otherwise matches the closed `Default` leaf. This exists for a disclosure the caller wants visible but temporarily not interactive, rather than hidden entirely.",
                        code: "<Disclosure.Base title=\"Customize session\" isDisabled><SampleContent /></Disclosure.Base>",
                        render: (
                            <Disclosure.Base title="Tùy chỉnh phiên" isDisabled showAnatomy>
                                <SampleContent />
                            </Disclosure.Base>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Skeleton: the loading mirror — a trigger-row placeholder (`Skeleton.Disclosure`). */
export const Skeleton: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure.Base"
                tier="composite"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                reason="The generic collapsible khung: a `Trigger` toggles ONE `Content` region that mounts and unmounts, with no exit animation. Loading is a separate resting shape entirely, owned by this component rather than borrowed from a shared skeleton."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The component renders straight to a `Skeleton.Disclosure` mirror of the trigger row — neither the real `Trigger` nor `Content` node exists yet. This is the resting shape while the caller doesn't yet know whether the section has content worth expanding.",
                        code: "<Disclosure.Base title=\"Customize session\" isSkeleton />",
                        render: (
                            <Disclosure.Base title="Tùy chỉnh phiên" isSkeleton showAnatomy>
                                <SampleContent />
                            </Disclosure.Base>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

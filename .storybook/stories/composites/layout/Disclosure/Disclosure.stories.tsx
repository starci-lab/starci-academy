import { useState } from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Disclosure } from "@sb-components/composites/layout/Disclosure/Disclosure"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Disclosure` — the generic collapsible frame: a trigger row (leading caret + title) toggling
 * one content region below it (caret rotates 180° on open, `w-fit` trigger). A multi-panel
 * accordion is a different frame (`SurfaceCardAccordion`). `body`/`children` take a component
 * reference, not a built node, so the composite can forward `isSkeleton`.
 */
const meta: Meta<typeof Disclosure> = {
    title: "Composites/Layout/Disclosure/Disclosure",
    component: Disclosure,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Disclosure>

const SampleContent = ({ isSkeleton }: SkeletonProps) => (
    <Typography
        size="sm"
        color="muted"
        isSkeleton={isSkeleton}
        text="Choose the question count, answer style, and language for the interview session."
    />
)

/**
 * ANATOMY IS PER-LEAF: every story below wraps its render in its OWN BlockAnatomy
 * axis. `Disclosure` composes a caret-plus-title trigger row (own internal
 * geometry, §13z — no dedicated sub-story to link to, so it stays unbadged rather
 * than dangle a node with nowhere to jump) and a content region carrying whatever
 * the caller passed via `body`/`children` (a caller slot, not this frame's own
 * part). Neither carries a badge, so every leaf below has an empty structure tab
 * — an honest reflection of a frame with no named parts to show, not a bug.
 */
const CLOSED_PARTS: Array<AnatomyNode> = []
const OPEN_PARTS: Array<AnatomyNode> = []
const SKELETON_PARTS: Array<AnatomyNode> = []

/** Default: uncontrolled, closed on mount — click the trigger to expand it. `children` shorthand for `body`. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure"
                tier="composite"
                leaf="Default"
                parts={CLOSED_PARTS}
                reason="The generic collapsible frame: a `Trigger` toggles ONE `Content` region that mounts and unmounts, with no exit animation. Uncontrolled is the default path — the component holds its own open/closed boolean, so the caller never has to declare `isOpen`/`onOpenChange` just to use it."
                states={[
                    {
                        name: "isOpen unset (uncontrolled, closed on mount)",
                        why: "Only the `Trigger` row mounts — the caret points down and the content below it does not exist in the DOM yet. Clicking the trigger flips the component's own internal open state, since no `isOpen` prop was passed to control it.",
                        code: "<Disclosure title=\"Customize session\" body={SampleContent} />",
                        render: (
                            <Disclosure title="Customize session" body={SampleContent} />
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
        <div data-tier="fixture" className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure"
                tier="composite"
                leaf="Open"
                parts={OPEN_PARTS}
                reason="The generic collapsible frame: a `Trigger` toggles ONE `Content` region that mounts and unmounts, with no exit animation. Whatever starts the disclosure open, the composition it lands on is the same two-node tree the trigger toggles into by hand."
                states={[
                    {
                        name: "defaultOpen = true",
                        why: "The `Content` node mounts from the start and the trigger's caret starts rotated 180°, one extra node compared to the closed leaf above. This is for a disclosure the caller wants expanded on first paint, using the slot `body` instead of `children`.",
                        code: "<Disclosure title=\"Customize session\" defaultOpen body={SampleContent} />",
                        render: (
                            <Disclosure
                                title="Customize session"
                                defaultOpen

                                body={SampleContent}
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
        <Disclosure title="Customize session" isOpen={open} onOpenChange={setOpen} body={SampleContent} />
    )
}

/** Controlled: `isOpen`+`onOpenChange` — the parent owns the expanded state. */
export const Controlled: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure"
                tier="composite"
                leaf="Controlled"
                parts={CLOSED_PARTS}
                reason="The generic collapsible frame: a `Trigger` toggles ONE `Content` region that mounts and unmounts, with no exit animation. Controlled mode changes who owns the boolean, not what the tree looks like at either end."
                states={[
                    {
                        name: "isOpen and onOpenChange set (starts false)",
                        why: "The composition on mount is identical to the uncontrolled `Default` leaf — only `Trigger` exists, closed. The difference is invisible to the eye: the parent, not the component, now owns which boolean flips when the trigger is clicked.",
                        code: "<Disclosure title=\"Customize session\" isOpen={open} onOpenChange={setOpen} body={SampleContent} />",
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
        <div data-tier="fixture" className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure"
                tier="composite"
                leaf="Disabled"
                parts={CLOSED_PARTS}
                reason="The generic collapsible frame: a `Trigger` toggles ONE `Content` region that mounts and unmounts, with no exit animation. `isDisabled` only touches how the trigger looks and behaves — it never changes the shape either state renders."
                states={[
                    {
                        name: "isDisabled = true",
                        why: "The trigger dims and switches to `cursor-not-allowed`, and it drops out of the tab order, but the composition otherwise matches the closed `Default` leaf. This exists for a disclosure the caller wants visible but temporarily not interactive, rather than hidden entirely.",
                        code: "<Disclosure title=\"Customize session\" isDisabled body={SampleContent} />",
                        render: (
                            <Disclosure title="Customize session" isDisabled body={SampleContent} />
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
        <div data-tier="fixture" className="max-w-sm p-8">
            <BlockAnatomy
                name="Disclosure"
                tier="composite"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                reason="The generic collapsible frame: a `Trigger` toggles ONE `Content` region that mounts and unmounts, with no exit animation. Loading is a separate resting shape entirely, owned by this component rather than borrowed from a shared skeleton."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The component renders straight to a `Skeleton.Disclosure` mirror of the trigger row — neither the real `Trigger` nor `Content` node exists yet. This is the resting shape while the caller doesn't yet know whether the section has content worth expanding.",
                        code: "<Disclosure title=\"Customize session\" isSkeleton />",
                        render: (
                            <Disclosure title="Customize session" isSkeleton body={SampleContent} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { FloppyDiskIcon, XIcon } from "@phosphor-icons/react"
import { FormActions } from "@sb-components/composites/form/Form/Form"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * COMPOSITE (composite tier §13) — `FormActions`: the form's closing button
 * row. A REPEATED-LIST shell, so it REQUIRES `items` data, children FORBIDDEN
 * (§13b) — and it COMPOSES the atom `ButtonGroup` rather than hand-drawing a
 * button (§13c).
 *
 * WARNING: STATE SCOPE (§12f): the state the shell ITSELF produces is HORIZONTAL
 * ALIGNMENT (`align`) and BOTTOM-STICKING (`sticky`). Each button's own
 * role/behaviour (`variant`/`isDisabled`/`icon`) is `Atoms/Buttons/Button`'s
 * state — the shell only forwards it through `items`.
 */
const meta: Meta<typeof FormActions> = {
    title: "Composites/Form/Form/FormActions",
    component: FormActions,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof FormActions>
/**
 * The one DIRECT child is the atom `ButtonGroup` (the shell only owns
 * horizontal alignment + bottom-sticking chrome). `ButtonGroup` tags EACH of
 * its child buttons as `Button` itself (it does not tag itself — it grows no
 * extra "Group" node in the DOM), so the REAL node showing up here is
 * `Button`, repeated once per item in `items` (§11a.1 — grouped by element,
 * not by name).
 */
const PARTS: Array<AnatomyNode> = [
    {
        name: "Button",
        tier: "atom",
        role: "one button per `items[i]`, built by the atom `ButtonGroup` (gap-2, a related cluster per §10b)",
        storyId: "atoms-buttons-button-button--variants",
    },
]
/** A form's standard button pair: cancel (secondary) + save (primary). */
const SAVE_ITEMS = [
    { key: "cancel", label: "Cancel", variant: "secondary" as const, icon: XIcon },
    { key: "save", label: "Save changes", icon: FloppyDiskIcon },
]
/**
 * Default — `align`: the button row's anchor edge. MERGED INTO ONE LEAF
 * (§14d.2) because all three values produce the EXACT same DOM tree
 * (ButtonGroup + 2 buttons), only the `justify-*` class changes — a class
 * difference is STATE, not a leaf. The three `align` values are now three
 * entries of `states[]` instead of three hand-laid renders via `AlignSample`
 * (removed — it only existed to lay out state by hand).
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FormActions"
                tier="composite"
                leaf="Default"
                parts={PARTS}
                renderClassName="w-96"
                reason="This row never hand-rolls its own buttons: it forwards `items` straight down to the atom `ButtonGroup` and only adds two concepts that belong to the frame itself, horizontal alignment (`align`) and bottom-docking (`sticky`). Because it renders a repeated list of buttons it must take `items` as data, so passing `children` here is forbidden."
                states={[
                    {
                        name: "align = \"end\" (default)",
                        why: "The button cluster sits flush against the row's end edge, with `Cancel` and `Save changes` reading toward that edge. This is the resting alignment most forms want, so a caller who never sets `align` still lands a CTA where the eye expects to find it.",
                        code: `<FormActions
    align="end"
    items={[
        { key: "cancel", label: "Cancel", variant: "secondary", prefixIcon: XIcon },
        { key: "save", label: "Save changes", prefixIcon: FloppyDiskIcon },
    ]}
/>`,
                        render: <FormActions align="end" items={SAVE_ITEMS} />,
                    },
                    {
                        name: "align = \"start\"",
                        why: "The button cluster keeps its natural width and only slides over to the row's start edge instead of its end edge. This fits a form living in a narrow column read from the left (§3), where anchoring at the end edge would leave a visually detached gap.",
                        code: `<FormActions
    align="start"
    items={[
        { key: "cancel", label: "Cancel", variant: "secondary", prefixIcon: XIcon },
        { key: "save", label: "Save changes", prefixIcon: FloppyDiskIcon },
    ]}
/>`,
                        render: <FormActions align="start" items={SAVE_ITEMS} />,
                    },
                    {
                        name: "align = \"between\"",
                        why: "The frame stretches the button row to the full width of its container, pushing `Cancel` to the start edge and `Save changes` to the end edge. Spreading the two mismatched actions across both edges reads as an escape route on one side and the committing action on the other, and only the frame can claim the full width the split needs.",
                        code: `<FormActions
    align="between"
    items={[
        { key: "cancel", label: "Cancel", variant: "secondary", prefixIcon: XIcon },
        { key: "save", label: "Save changes", prefixIcon: FloppyDiskIcon },
    ]}
/>`,
                        render: <FormActions align="between" items={SAVE_ITEMS} />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Pending — the primary button is running.
 *
 * WARNING: NOTE §12f: `isPending` is NOT produced by this shell — it only forwards
 * through `items` down to `Button` (the state already has a "home" at
 * `Atoms/Buttons/Button`). Kept per group-5's spec request, to show the button
 * row at submit time; if §12f is applied strictly (precedent: `ButtonGroup`
 * had its own `Pending` story removed) then DELETE this story and look at the
 * submit state on `Form` → `Submitting` instead.
 */
export const Pending: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FormActions"
                tier="composite"
                leaf="Pending"
                parts={PARTS}
                renderClassName="w-96"
                states={[
                    {
                        name: "save item's isPending = true",
                        why: "The save button swaps its label for a spinner and stops accepting presses, while the cancel button next to it stays exactly as it was. This frame never draws the spinner itself, the flag only flows through `items` into `Button`, which already owns its own pending shape.",
                        code: `<FormActions
    items={[
        { key: "cancel", label: "Cancel", variant: "secondary" },
        { key: "save", label: "Saving", isPending: true },
    ]}
/>`,
                        render: (
                            <FormActions

                                items={[
                                    { key: "cancel", label: "Cancel", variant: "secondary" },
                                    { key: "save", label: "Saving", isPending: true },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Sticky — a long form inside a scrolling shell: the button row STICKS to the
 * bottom with a divider + solid background, so the CTA stays reachable. Only
 * reads correctly placed inside a real scrolling container.
 */
export const Sticky: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FormActions"
                tier="composite"
                leaf="Sticky"
                parts={PARTS}
                states={[
                    {
                        name: "sticky",
                        why: "The button row grows a top border and an opaque background, then pins itself to the bottom edge of the scrolling container instead of scrolling away with the fields above it. A long form loses its call to action once the user scrolls past it, so docking the row keeps `Save changes` reachable at every scroll position.",
                        code: `<div className="h-64 overflow-y-auto">
    <Form actions={<FormActions sticky items={[…]} />}>…</Form>
</div>`,
                        render: (
                            <div data-tier="fixture" className="h-64 w-96 overflow-y-auto rounded-3xl border border-default px-3">
                                <div className="flex flex-col gap-3 py-3">
                                    {["Full name", "Email", "Phone number", "Company", "Job title", "Note"].map((row) => (
                                        <div data-tier="fixture" key={row} className="h-16 rounded-xl bg-default" aria-hidden />
                                    ))}
                                </div>
                                <FormActions sticky items={SAVE_ITEMS} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
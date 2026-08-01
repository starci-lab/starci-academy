import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { TrashIcon, FloppyDiskIcon } from "@phosphor-icons/react"
import type { ButtonSize } from "@sb-components/atoms/buttons/Button/Button"
import { ButtonGroup, type ButtonGroupItem } from "@sb-components/composites/buttons/ButtonGroup/ButtonGroup"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * ⚠️ STATE SCOPE (teacher's call 2026-07-25): `ButtonGroup` does NOT grow new meaning —
 * it only lays out + `import { ButtonBase }` and rebuilds from `items`. So the stories
 * here ONLY render state that BELONGS TO THE CLUSTER: items mapping · cluster-level
 * `size` · skeleton for the whole cluster. Per-BUTTON state (prefixIcon · Pending ·
 * Disabled · variant) lives in the `Button` story — NOT repeated here.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — atom tier): `items` · `size` · `isSkeleton`, each prop
 * one leaf. This is the FULL prop set of the cluster — smaller than `Button`
 * because of §12f: any prop that just forwards down to each button
 * (`variant`/`prefixIcon`/`isPending`/`isDisabled`) belongs to `Button`, the cluster
 * must NOT open a leaf for it.
 *
 * ⚠️ The previous version invoked §14d.2 to merge all three into one leaf — that rule
 * belongs to design/block/screen.
 *
 * ⚠️ Tab States was REMOVED (teacher's call 2026-07-26, second time). §12f still holds —
 * the cluster doesn't re-list `Button`'s state (`variant`/`isPending`…) — there's
 * just no cell reminding you anymore, read carefully when writing a leaf.
 *
 * ✍️ Text shown on the panel (`leaf`/`reason`/`note`/`role`/`hint`/`code`) and demo labels
 * in the render frame, along with all JSDoc/comments, are written in ENGLISH; §
 * anchors live here.
 *
 * 🎨 Icons = Phosphor (§5.0); stroke weight is enforced by the atom per cluster `size` (§5.0a).
 */
const meta: Meta<typeof ButtonGroup> = {
    title: "Composites/Buttons/ButtonGroup",
    component: ButtonGroup,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof ButtonGroup>
/**
 * DEPS = OTHER stories this cluster depends on (teacher's call 2026-07-26). ONLY list
 * components that have their OWN story — `Label`/`Icon`/`Spinner` are spans INSIDE the
 * atom with no story of their own, so they aren't deps. `Button` leaves deps EMPTY
 * (it wraps HeroUI directly); this cluster DOES have deps, and is the only component in
 * the family that does.
 *
 * The key MUST match the `data-anat-part` that shows up on every child button. Since
 * ATOM-10 (2026-07-31), `ButtonGroup` no longer hands a part name down — it only forwards
 * the `showAnatomy` boolean, and each `Button` badges itself as `"Button"`. Only ONE entry:
 * since 2026-07-26 `Button.Icon` was removed, an item with no label is also `ButtonBase`
 * with `isIconOnly`.
 */
const GROUP_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Button": {
        tier: "atom",
        role: "the group imports it and rebuilds one per item, coming out as a normal button when the item carries a label and as an icon-only button when it doesn't",
        storyId: "atoms-buttons-button-button--default",
    },
}
/** Three scale steps — `size` is set at the CLUSTER level, an item only carries role/behavior. */
const SIZES: Array<ButtonSize> = ["sm", "md", "lg"]
/** The same `items` set for every row — the only difference is the CLUSTER's prop. */
const items = (suffix: string): Array<ButtonGroupItem> => [
    { key: "cancel", label: "Cancel", variant: "ghost" },
    { key: "save", label: "Save", prefixIcon: FloppyDiskIcon, variant: "primary" },
    { key: "delete", prefixIcon: TrashIcon, ariaLabel: `Delete ${suffix}`, variant: "danger" },
]
/** Leaf prop `items` — the cluster is built from DATA; an item with no `label` becomes an icon-only button. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ButtonGroup"
                tier="composite"
                leaf="Prop `items`"
                annotate={GROUP_ANNOTATE}
                reason="The group is a cluster: layout and nothing else. `items` is data, not JSX children, so a caller can't wire up the wrong structure or a mismatched size for one entry alone."
                states={[
                    {
                        name: "items = [cancel, save, delete (icon-only)]",
                        why: "Each entry becomes one Button the group rebuilds, and the delete entry carries no `label` so it comes out icon-only with an `ariaLabel` standing in for the missing text. Each item still picks its own variant and icon, but that state belongs to the Button story, not to this cluster.",
                        code: `<ButtonGroup
  items={[
    { key: "cancel", label: "Cancel", variant: "ghost" },
    { key: "save", label: "Save", prefixIcon: FloppyDiskIcon, variant: "primary" },
    { key: "delete", prefixIcon: TrashIcon, ariaLabel: "Delete", variant: "danger" },
  ]}
/>`,
                        render: <ButtonGroup items={items("(default)")} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
/** Leaf prop `size` — set at the CLUSTER level: a row of buttons is always the same size (§12d). */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ButtonGroup"
                tier="composite"
                leaf="Prop `size`"
                annotate={GROUP_ANNOTATE}
                reason="A cluster is always one size, so `size` sits on the group and never on an item. Putting it on items instead would let anyone build a row of buttons at mismatched heights, which reads as broken rather than intentional."
                states={SIZES.map((size, index) => ({
                    name: `size = "${size}"`,
                    why: `The button box and glyph of every entry in the row shrink or grow together at this one scale, while the group's shape (three buttons, one icon-only) and each item's variant stay identical to the other two sizes. The group flows the size down into both the box and the glyph of every item${index === 0 ? ", so a caller never has to size each button separately" : ""}.`,
                    code: size === "md"
                        ? "<ButtonGroup items={[…]} />          // md = default"
                        : `<ButtonGroup size="${size}" items={[…]} />`,
                    render: <ButtonGroup size={size} items={items(`(${size})`)} showAnatomy />,
                }))}
            />
        </div>
    ),
}
/** Leaf prop `isSkeleton` — turned on at the cluster level, each item draws its own shimmer. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ButtonGroup"
                tier="composite"
                leaf="Prop `isSkeleton`"
                annotate={GROUP_ANNOTATE}
                reason="The group only passes the flag down; every item draws its own shimmer, a pill for a labelled button and a square for an icon-only one. The row keeps its footprint at every size, so nothing shifts once the real labels land."
                states={SIZES.map((size) => ({
                    name: `isSkeleton = true, size = "${size}"`,
                    why: "Every item still goes through Button, so the shimmer comes from the atom rather than the cluster drawing it itself. Skeleton still goes through Button at this leaf's own scale, which is why the row holds the exact width and height the real buttons will occupy.",
                    code: `<ButtonGroup isSkeleton size="${size}" items={[…3 items…]} />`,
                    render: <ButtonGroup size={size} isSkeleton items={items(`(${size})`)} showAnatomy />,
                }))}
            />
        </div>
    ),
}
/**
 * `@app-sm` (the default `at`) reads the nearest `@container`, not the viewport — demoing
 * the switch means opening a `@container` at a real width, same as `RailShell`'s story does.
 */
const ResponsiveFrame = ({ width, label, children }: { width: string; label: string; children: ReactNode }) => (
    <div data-tier="fixture" className="flex flex-col gap-2">
        <Typography size="xs" text={label} color="muted" />
        <div className="@container rounded-3xl border border-dashed border-default p-3" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)
/** Leaf prop `at` — the named container step this row leaves a full-width column for a packed row at. */
export const Responsive: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ButtonGroup"
                tier="composite"
                leaf="Prop `at`"
                annotate={GROUP_ANNOTATE}
                reason="A composite does not draw its own flex track (FRAME-1) — the row/column switch and the gap between buttons both belong to the frame underneath (`ResponsiveCluster`), named at a container step rather than wherever the labels happen to overflow (FRAME-10)."
                states={[
                    {
                        name: "narrow container (320px, below @app-sm): full-width column",
                        why: "Each button stretches to the row's full width and stacks, one per line — the shape a drawer or a phone-width modal needs, never triggered by content wrapping.",
                        code: `<ButtonGroup items={[…]} />          // at="sm" = default`,
                        render: (
                            <ResponsiveFrame width="20rem" label="container 320px, below @app-sm, full-width column">
                                <ButtonGroup items={items("(narrow)")} showAnatomy />
                            </ResponsiveFrame>
                        ),
                    },
                    {
                        name: "wide container (720px, at or above @app-sm = 40rem/640px): packed row",
                        why: "The same three buttons pack into one row at the shared gap step (3 → gap-2), with no re-render, no boolean flag — the same container simply crossed the named width.",
                        code: `<ButtonGroup items={[…]} />          // at="sm" = default`,
                        render: (
                            <ResponsiveFrame width="45rem" label="container 720px, at @app-sm, packed row">
                                <ButtonGroup items={items("(wide)")} showAnatomy />
                            </ResponsiveFrame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
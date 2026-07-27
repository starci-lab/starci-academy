import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrashIcon, FloppyDiskIcon } from "@phosphor-icons/react"
import { Button, type ButtonGroupItem, type ButtonSize } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher's call 2026-07-25): `Button.Group` does NOT grow new meaning —
 * it only lays out + `import { ButtonBase }` and rebuilds from `items`. So the stories
 * here ONLY render state that BELONGS TO THE CLUSTER: items mapping · cluster-level
 * `size` · skeleton for the whole cluster. Per-BUTTON state (prefixIcon · Pending ·
 * Disabled · variant) lives in the `Button.Base` story — NOT repeated here.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — atom tier): `items` · `size` · `isSkeleton`, each prop
 * one leaf. This is the FULL prop set of the cluster — smaller than `Button.Base`
 * because of §12f: any prop that just forwards down to each button
 * (`variant`/`prefixIcon`/`isPending`/`isDisabled`) belongs to `Button.Base`, the cluster
 * must NOT open a leaf for it.
 *
 * ⚠️ The previous version invoked §14d.2 to merge all three into one leaf — that rule
 * belongs to design/block/screen.
 *
 * ⚠️ Tab States was REMOVED (teacher's call 2026-07-26, second time). §12f still holds —
 * the cluster doesn't re-list `Button.Base`'s state (`variant`/`isPending`…) — there's
 * just no cell reminding you anymore, read carefully when writing a leaf.
 *
 * ✍️ Text shown on the panel (`leaf`/`reason`/`note`/`role`/`hint`/`code`) and demo labels
 * in the render frame are written in ENGLISH; JSDoc/comments stay in Vietnamese, §
 * anchors live here.
 *
 * 🎨 Icons = Phosphor (§5.0); stroke weight is enforced by the atom per cluster `size` (§5.0a).
 */
const meta: Meta<typeof Button.Group> = {
    title: "Atoms/Buttons/Button/Button.Group",
    component: Button.Group,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Button.Group>

/**
 * DEPS = OTHER stories this cluster depends on (teacher's call 2026-07-26). ONLY list
 * components that have their OWN story — `Label`/`Icon`/`Spinner` are spans INSIDE the
 * atom with no story of their own, so they aren't deps. `Button.Base` leaves deps EMPTY
 * (it wraps HeroUI directly); this cluster DOES have deps, and is the only component in
 * the family that does.
 *
 * The key MUST match the `data-anat-part` that `ButtonGroup` emits — it always attaches
 * the name `"Button.Base"` to the root of every child button (see `ButtonGroup.tsx`),
 * even when `isSkeleton`. Only ONE entry: since 2026-07-26 `Button.Icon` was removed, an
 * item with no label is also `ButtonBase` with `isIconOnly`.
 */
const GROUP_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Button.Base": {
        tier: "atom",
        role: "the group imports it and rebuilds one per item — with a label it's a normal button, without one it's icon-only",
        storyId: "atoms-buttons-button-button-base--default",
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
        <div className="p-8">
            <BlockAnatomy
                name="Button.Group"
                tier="atom"
                leaf="Prop `items`"
                annotate={GROUP_ANNOTATE}
                reason="The group is a cluster — layout and nothing else. `items` is data, not JSX children, so a caller can't wire up the wrong structure or a mismatched size. An item with no `label` comes out as an icon-only button."
                note="Each item picks its own variant and icon, but those belong to Button.Base — read them in that story; the cluster doesn't repeat them."
                code={`<Button.Group
  items={[
    { key: "cancel", label: "Cancel", variant: "ghost" },
    { key: "save", label: "Save", prefixIcon: FloppyDiskIcon, variant: "primary" },
    { key: "delete", prefixIcon: TrashIcon, ariaLabel: "Delete", variant: "danger" },
  ]}
/>`}
            >
                <Button.Group items={items("(default)")} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — set at the CLUSTER level: a row of buttons is always the same size (§12d). */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Group"
                tier="atom"
                leaf="Prop `size`"
                annotate={GROUP_ANNOTATE}
                reason="A cluster is always one size, so `size` sits on the group, never on an item — putting it on items would let anyone build a row of buttons at mismatched heights."
                note="The group size flows down to both the button box and the glyph of every item."
                code={`<Button.Group size="sm" items={[…]} />
<Button.Group items={[…]} />          // md = default
<Button.Group size="lg" items={[…]} />`}
            >
                <div className="flex flex-col items-start gap-4">
                    {SIZES.map((size, index) => (
                        <Button.Group
                            key={size}
                            size={size}
                            items={items(`(${size})`)}
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isSkeleton` — turned on at the cluster level, each item draws its own shimmer. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Group"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={GROUP_ANNOTATE}
                reason="The group only passes the flag down; every item draws its own shimmer — a pill for a labelled button, a square for an icon-only one."
                note="The row keeps its footprint, so nothing shifts when the data lands."
                code={"<Button.Group isSkeleton items={[…3 items…]} />"}
            >
                <div className="flex flex-col items-start gap-4">
                    {SIZES.map((size) => (
                        <Button.Group
                            key={size}
                            size={size}
                            isSkeleton
                            items={items(`(${size})`)}
                            // Skeleton STILL goes through ButtonBase (the cluster only forwards
                            // the flag), so showAnatomy must be turned on here — otherwise the
                            // tree reports "0 part" and looks like the cluster draws the shimmer
                            // itself, which is flat-out wrong about the source.
                            showAnatomy={size === "sm"}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

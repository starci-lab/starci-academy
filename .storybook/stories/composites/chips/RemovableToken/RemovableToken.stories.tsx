import type { Meta, StoryObj } from "@storybook/nextjs"
import { BuildingOfficeIcon } from "@phosphor-icons/react"
import { RemovableToken } from "@sb-components/composites/chips/RemovableToken/RemovableToken"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `RemovableToken`: a bordered, single-line selected-item row — an
 * optional leading icon, a label, and up to two trailing affordances (edit /
 * remove). Ground-truth is the hand-rolled "picked company" row in
 * `CompanySection` (`src/components/features/careers/Jobs/JobPostForm/CompanySection/index.tsx`),
 * generalised into a reusable token: any label/icon in, an optional edit
 * ("Change"-style) and/or remove (×) affordance out.
 *
 * 📐 **1 PROP = 1 LEAF.** Every prop with a visual gets its own leaf, and that
 * leaf renders the FULL set of the prop's values: `icon` · `onEdit`
 * (+ `editLabel`) · `onRemove` (+ `removeLabel`) · `isDisabled` · `isSkeleton`.
 * `label` has no leaf of its own — it is the content every other leaf fills
 * in. `classNames` has no leaf either: appearance is not passable, it is
 * already a prop, so there is no value to enumerate.
 *
 * ⚠️ `icon` takes a COMPONENT REFERENCE (`IconComponent`), never a built JSX
 * element — the row calls it itself at a fixed `size-4` scale so it can also
 * be called during `isSkeleton`. `icon={BuildingOfficeIcon}`, not
 * `icon={<BuildingOfficeIcon />}`.
 *
 * ⚠️ No `annotate` table: `RemovableToken` does not yet accept `anatPart` /
 * `showAnatomy`, so none of its parts (or the `Button`/`Typography` atoms it
 * composes) emit `data-anat-part` — there is nothing for a structure tree to
 * pick up yet. Every leaf below still renders the full `BlockAnatomy` panel
 * for its states/why/code.
 */
const meta: Meta<typeof RemovableToken> = {
    title: "Composites/Chips/RemovableToken",
    component: RemovableToken,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RemovableToken>

/** Bare leaf — no optional prop turned on, showing the plain read-only token. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RemovableToken"
                tier="composite"
                leaf="No prop turned on"
                reason="The one selected-item token in the system: an optional icon, a label, and up to two trailing affordances. This leaf is the baseline — every leaf below differs from it by exactly one prop."
                states={[
                    {
                        name: "icon unset, onEdit unset, onRemove unset, isDisabled = false, isSkeleton = false",
                        why: "Only the label renders inside the bordered row — no leading icon, no trailing affordance. This is a plain read-only token, for showing a selection nobody can edit or clear from this spot.",
                        code: "<RemovableToken label=\"Acme Corp\" />",
                        render: <RemovableToken label="Acme Corp" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `icon` — the LEADING glyph, sitting before the label. */
export const Icon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RemovableToken"
                tier="composite"
                leaf="Prop `icon`"
                reason="A leading glyph gives the token a visual category (a company, a person, a file) before the reader gets to the label text. Passed as a component reference, not JSX, so the row can size it itself and still call it while `isSkeleton` is on."
                states={[
                    {
                        name: "icon unset",
                        why: "The row starts flush with the label, no leading glyph reserved. This is the plainest shape, for a token whose label alone already says what was picked.",
                        code: "<RemovableToken label=\"Acme Corp\" />",
                        render: <RemovableToken label="Acme Corp" />,
                    },
                    {
                        name: "icon = BuildingOfficeIcon",
                        why: "A building glyph grows before the label at the row's own size-4 scale, marking this token as a company pick. Swapping the icon component swaps only that leading glyph, nothing else about the row's shape or spacing.",
                        code: "<RemovableToken label=\"Acme Corp\" icon={BuildingOfficeIcon} />",
                        render: <RemovableToken label="Acme Corp" icon={BuildingOfficeIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `onEdit` (+ `editLabel`) — the "Change" affordance for re-picking, not deleting outright. */
export const EditAffordance: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RemovableToken"
                tier="composite"
                leaf="Prop `onEdit`"
                reason="onEdit renders the ground-truth 'Change' button (× icon + text), ported 1:1 from the picked-company row. Use it when clearing the token means 'go re-pick', not 'delete outright' — that is what `onRemove` is for."
                states={[
                    {
                        name: "onEdit unset",
                        why: "No trailing affordance renders — the token is read-only from this row alone. This is the shape before a caller wires up any way to change the pick.",
                        code: "<RemovableToken label=\"Acme Corp\" icon={BuildingOfficeIcon} />",
                        render: <RemovableToken label="Acme Corp" icon={BuildingOfficeIcon} />,
                    },
                    {
                        name: "onEdit set, editLabel unset (defaults to \"Change\")",
                        why: "A small tertiary button with a × icon and the word 'Change' appears on the trailing edge, matching the ground-truth picked-company row exactly. This is the default wording every caller gets without passing `editLabel`.",
                        code: "<RemovableToken label=\"Acme Corp\" icon={BuildingOfficeIcon} onEdit={() => {}} />",
                        render: <RemovableToken label="Acme Corp" icon={BuildingOfficeIcon} onEdit={() => {}} />,
                    },
                    {
                        name: "onEdit set, editLabel = \"Swap company\"",
                        why: "The same affordance renders with custom wording, for a spot where 'Change' alone would be ambiguous about what gets swapped. Only the button's text differs from the default state.",
                        code: "<RemovableToken label=\"Acme Corp\" icon={BuildingOfficeIcon} onEdit={() => {}} editLabel=\"Swap company\" />",
                        render: <RemovableToken label="Acme Corp" icon={BuildingOfficeIcon} onEdit={() => {}} editLabel="Swap company" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `onRemove` (+ `removeLabel`) — a compact trailing × for deleting the token outright. */
export const Removable: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RemovableToken"
                tier="composite"
                leaf="Prop `onRemove`"
                reason="onRemove renders a compact trailing × at the chip's own scale (size-6 hit target, size-4 glyph) — distinct from the button-scale edit affordance — for outright deleting the token, e.g. a selected filter or tag, not re-picking it."
                states={[
                    {
                        name: "onRemove unset",
                        why: "No × renders on the trailing edge — the token cannot be cleared from this row. This is the shape before a caller wires up a delete handler.",
                        code: "<RemovableToken label=\"Senior React Developer\" />",
                        render: <RemovableToken label="Senior React Developer" />,
                    },
                    {
                        name: "onRemove set, removeLabel unset (defaults to \"Remove\")",
                        why: "A compact × button appears on the trailing edge, its accessible name falling back to the word 'Remove' when no explicit label is passed. This is the shape for a plain selected tag or filter chip.",
                        code: "<RemovableToken label=\"Senior React Developer\" onRemove={() => {}} />",
                        render: <RemovableToken label="Senior React Developer" onRemove={() => {}} />,
                    },
                    {
                        name: "onRemove set, removeLabel = \"Remove tag\"",
                        why: "The same compact × renders, but its accessible name reads 'Remove tag' instead of the generic default, useful when a screen holds more than one kind of removable token and each needs to announce what it removes.",
                        code: "<RemovableToken label=\"Senior React Developer\" onRemove={() => {}} removeLabel=\"Remove tag\" />",
                        render: <RemovableToken label="Senior React Developer" onRemove={() => {}} removeLabel="Remove tag" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isDisabled` — dims the row and inerts both trailing affordances at once. */
export const Disabled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RemovableToken"
                tier="composite"
                leaf="Prop `isDisabled`"
                reason="isDisabled dims the whole row and blocks both affordances in one flag — a caller never has to disable the edit button and the remove button separately, because they always share one enabled/disabled state."
                states={[
                    {
                        name: "isDisabled = false (default)",
                        why: "The row reads at full opacity and both trailing affordances stay pressable. This is the everyday state for a token the reader can still act on.",
                        code: "<RemovableToken label=\"Acme Corp\" icon={BuildingOfficeIcon} onEdit={() => {}} />",
                        render: <RemovableToken label="Acme Corp" icon={BuildingOfficeIcon} onEdit={() => {}} />,
                    },
                    {
                        name: "isDisabled = true",
                        why: "The whole row dims and both the edit button and the underlying click handlers go inert, for a token the reader is not allowed to change right now (e.g. a locked selection). One flag, not two, keeps the row from ever landing in a half-disabled state.",
                        code: "<RemovableToken label=\"Acme Corp\" icon={BuildingOfficeIcon} onEdit={() => {}} isDisabled />",
                        render: <RemovableToken label="Acme Corp" icon={BuildingOfficeIcon} onEdit={() => {}} isDisabled />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isSkeleton` — the row frame stays real, only the trailing affordance's content swaps for a shimmer pill. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="RemovableToken"
                tier="composite"
                leaf="Prop `isSkeleton`"
                reason="One render path: the row's own bordered frame stays identical whether loading or not — only the label and the trailing affordance's content swap for shimmer placeholders, so the token never jumps in size once real data lands."
                states={[
                    {
                        name: "isSkeleton = false (default)",
                        why: "The real label and, when set, the real trailing affordance render inside the same bordered frame the shimmer will occupy. This is the shape `isSkeleton` mirrors.",
                        code: "<RemovableToken label=\"Acme Corp\" />",
                        render: <RemovableToken label="Acme Corp" />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The label becomes a shimmer bar and the trailing slot becomes a small shimmer pill, both inside the exact same bordered row the real token uses. Whoever owns the shape owns its loading state, so there is no separate skeleton component to keep in sync.",
                        code: "<RemovableToken label=\"Acme Corp\" isSkeleton />",
                        render: <RemovableToken label="Acme Corp" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowLeftIcon, ArrowRightIcon, FloppyDiskIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Button.Base`: a button with a LABEL.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — the rule for the ATOM TIER, teacher's call 2026-07-26).
 * Every prop with a visual gets its own leaf, and that leaf renders the FULL set of
 * the prop's values:
 * `variant` · `size` · `prefixIcon` · `suffixIcon` · `iconSlide` · `isIconOnly` ·
 * `isDisabled` · `isPending` · `isSkeleton`.
 *
 * ⚠️ Don't confuse this with §14d.2 (leaf = STRUCTURE) — that rule is for
 * design/block/screen. An earlier version of this file invoked §14d.2 to cram
 * variant + disabled + skeleton into one shared `Default` leaf; at the atom tier
 * that's WRONG: an atom is a lookup table, readers come to see "what does this
 * prop do", so every prop must stand on its own.
 *
 * ⚠️ The **States** tab has been REMOVED (teacher's call 2026-07-26, second time —
 * looking at it honestly it just repeated in words what the render frame above
 * already showed). The panel now has two tabs left: Deps · Code. The lesson about
 * `danger` missing from the `VARIANTS` array (before it grew into a stray `Danger`
 * story) still holds — it's just caught by READING the union array carefully when
 * writing a leaf, no more automatic red box to flag it.
 *
 * ✍️ Text shown on the panel (`leaf`/`reason`/`note`/`hint`/`code`) is written in
 * ENGLISH; demo labels in the render frame are English too, so the Code tab matches
 * the picture word for word. JSDoc/comments stay in Vietnamese, and the § anchors
 * live only here.
 *
 * 🎨 Icons = Phosphor (§5.0). The atom forces both scale and `weight` off `size`
 * (§5.0a) — the story only picks "which glyph", not "what size".
 */
const meta: Meta<typeof Button.Base> = {
    title: "Atoms/Buttons/Button/Button.Base",
    component: Button.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Button.Base>


/** The FULL set of the `ButtonVariant` union — miss one value and it grows into a stray leaf. */
const VARIANTS = [
    { variant: "primary", label: "Save draft" },
    { variant: "secondary", label: "Preview" },
    { variant: "ghost", label: "Cancel" },
    { variant: "danger", label: "Delete" },
    { variant: "danger-soft", label: "Remove from list" },
] as const

const SIZES = ["sm", "md", "lg"] as const

/** Bare leaf — no prop turned on, showing the default look (`variant="primary"`, `size="md"`). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="No prop turned on"
                reason="The one button atom in the system, wrapping HeroUI Button. This leaf is the baseline: every leaf below differs from it by exactly one prop."
                states={[
                    {
                        name: "no prop turned on (variant = primary, size = md)",
                        why: "The DOM stays flat, a button wrapping just its label. Both variant and size fall back to their defaults, so this is the plainest shape the atom can take.",
                        code: "<Button.Base label=\"Save draft\" />",
                        render: <Button.Base label="Save draft" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `variant` — 5 action MEANINGS, rendering the FULL union. */
export const Variants: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `variant`"
                reason="variant is the meaning of the action, not a colour. `danger` maps onto the destructive variant of our HeroUI fork, it is not the `color` prop."
                states={[
                    {
                        name: "variant = primary | secondary | ghost | danger | danger-soft (full union)",
                        why: "Five buttons render side by side, each carrying its own meaning through colour and weight rather than a shared shape. Two levels of danger stand apart on purpose: `danger` is the solid confirm button of a dialog, while `danger-soft` reads calmer for a smaller destructive action, like dropping one row from a list.",
                        code: `<Button.Base variant="primary" label="Save draft" />
<Button.Base variant="secondary" label="Preview" />
<Button.Base variant="ghost" label="Cancel" />
<Button.Base variant="danger" label="Delete" />
<Button.Base variant="danger-soft" label="Remove from list" />`,
                        render: (
                            <div className="flex flex-wrap items-center gap-3">
                                {VARIANTS.map(({ variant, label }, index) => (
                                    <Button.Base key={variant} variant={variant} label={label} showAnatomy={index === 0} />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `size` — 3 SCALE tiers, an axis independent of `variant` (§12d). */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `size`"
                reason="size is scale only, it never changes what the button means. The box also shrinks with the container it sits in (@app-md), not with the viewport."
                states={[
                    {
                        name: "size = sm | md | lg (full union)",
                        why: "Three buttons render side by side at increasing box height, from sm through the default md up to lg. There is no separate icon-size prop, so the glyph a button carries is read off this same `size` rather than set on its own.",
                        code: `<Button.Base size="sm" label="Save draft" />
<Button.Base size="md" label="Save draft" />   // default
<Button.Base size="lg" label="Save draft" />`,
                        render: (
                            <div className="flex items-center gap-3">
                                {SIZES.map((size, index) => (
                                    <Button.Base key={size} size={size} label="Save draft" showAnatomy={index === 0} />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `prefixIcon` — the LEADING glyph, sitting before the label.
 *
 * `prefixIcon` isn't a union, so coverage is declared by CALL SHAPE instead: swap
 * the glyph (the prop takes a COMPONENT, not JSX) and swap `size` to see the atom
 * infer scale/weight on its own (§5.0a).
 */
export const PrefixIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `prefixIcon` (leading)"
                reason="Renamed from `icon`: with a `suffixIcon` on the other end, a bare `icon` no longer read as one half of a pair. Both glyph slots now say the same thing from both sides, matching how Typography names them."
                states={[
                    {
                        name: "prefixIcon set (glyph swapped, size = md default)",
                        why: "A leading glyph grows before the label, and swapping the icon component swaps only that glyph, nothing else about the row. The glyph carries no size of its own, so the atom reads it off `size` and forces bold weight, since every button glyph sits under 20px and a thin stroke reads weak there.",
                        code: `<Button.Base prefixIcon={ArrowLeftIcon} label="Back" />
<Button.Base prefixIcon={FloppyDiskIcon} label="Save" />`,
                        render: (
                            <div className="flex flex-wrap items-center gap-3">
                                <Button.Base prefixIcon={ArrowLeftIcon} label="Back" showAnatomy />
                                <Button.Base prefixIcon={FloppyDiskIcon} label="Save" />
                                <Button.Base variant="danger" prefixIcon={TrashIcon} label="Delete" />
                            </div>
                        ),
                    },
                    {
                        name: "prefixIcon set, size = sm | md | lg",
                        why: "The same glyph scales up together with the label as `size` climbs from sm to lg. This confirms the glyph tracks the button's own size axis instead of carrying a size prop of its own.",
                        code: "<Button.Base size=\"lg\" prefixIcon={FloppyDiskIcon} label=\"Save\" />",
                        render: (
                            <div className="flex items-center gap-3">
                                {SIZES.map((size) => (
                                    <Button.Base key={size} size={size} prefixIcon={FloppyDiskIcon} label="Save" />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `suffixIcon` — the TRAILING glyph. The `SuffixIcon` node sits AFTER `Label`. */
export const SuffixIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `suffixIcon` (trailing)"
                reason="Where the glyph sits carries meaning: leading says what kind of action this is (save, delete), trailing says where it takes you (onward, out to a doc). Without a trailing slot, a “Continue →” button gets hand-assembled at the call site, the thing this atom exists to stop."
                states={[
                    {
                        name: "suffixIcon set, prefixIcon not set",
                        why: "A trailing glyph grows after the label instead of before it. The trailing position reads as \"onward\", so it fits a button that takes the reader further rather than one that saves or deletes something.",
                        code: "<Button.Base label=\"Continue\" suffixIcon={ArrowRightIcon} />",
                        render: (
                            <div className="flex flex-wrap items-center gap-3">
                                <Button.Base label="Continue" suffixIcon={ArrowRightIcon} showAnatomy />
                                <Button.Base variant="secondary" label="Open docs" suffixIcon={ArrowRightIcon} />
                            </div>
                        ),
                    },
                    {
                        name: "prefixIcon and suffixIcon both set",
                        why: "The atom lays out both glyphs at once as icon, label, icon, one leading and one trailing. This is the shape for an action that both DOES something and continues onward in one press, such as saving before moving to the next step.",
                        code: "<Button.Base prefixIcon={FloppyDiskIcon} label=\"Save and continue\" suffixIcon={ArrowRightIcon} />",
                        render: (
                            <div className="flex items-center gap-3">
                                <Button.Base prefixIcon={FloppyDiskIcon} label="Save and continue" suffixIcon={ArrowRightIcon} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `iconSlide` (§5b) — the arrow SLIDES on hover. Hover to see it. */
export const IconSlide: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `iconSlide`"
                reason="The arrow slides the way it points: a leading arrow backs off to the left (go back), a trailing one moves right (keep going). Navigation arrows only; a caret or a static glyph doing this just fidgets."
                states={[
                    {
                        name: "iconSlide = true, on a leading and a trailing arrow",
                        why: "On hover, a trailing arrow slides right and a leading arrow slides left, each moving the direction it already points. Tailwind v4 treats translate as its own property, so the atom transitions `translate` rather than `transform`, which is what keeps the hover motion from stuttering.",
                        code: `<Button.Base label="Continue" suffixIcon={ArrowRightIcon} iconSlide />
<Button.Base prefixIcon={ArrowLeftIcon} label="Back" iconSlide />`,
                        render: (
                            <div className="flex flex-wrap items-center gap-3">
                                <Button.Base label="Continue" suffixIcon={ArrowRightIcon} iconSlide showAnatomy />
                                <Button.Base variant="secondary" prefixIcon={ArrowLeftIcon} label="Back" iconSlide />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `isIconOnly` — a button that drops the label, glyph only.
 *
 * Merged 2026-07-26: this used to be a SEPARATE component, `Button.Icon`. But an
 * icon-only button isn't a different shape — it's the same button with the label
 * dropped. Keeping two parallel components meant every rule (variant · size ·
 * weight · skeleton) had to be fixed in two places.
 */
export const IsIconOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isIconOnly`"
                reason="Turn it on and `prefixIcon` + `ariaLabel` become required, enforced by the types, because a button with no text is silent to a screen reader. `label` and `suffixIcon` stop meaning anything, so the atom drops them."
                states={[
                    {
                        name: "isIconOnly = true, variant sweep, size = md default",
                        why: "The label disappears and the button collapses to a square glyph-only box, across every variant. The box goes square at the size's own dimension while the glyph still follows the font scale, exactly like a labelled button.",
                        code: `<Button.Base isIconOnly prefixIcon={PlusIcon} ariaLabel="Add item" />
<Button.Base isIconOnly variant="danger" prefixIcon={TrashIcon} ariaLabel="Delete" />`,
                        render: (
                            <div className="flex flex-wrap items-center gap-3">
                                <Button.Base isIconOnly prefixIcon={PlusIcon} ariaLabel="Add item" showAnatomy />
                                <Button.Base isIconOnly variant="secondary" prefixIcon={ArrowLeftIcon} ariaLabel="Back" />
                                <Button.Base isIconOnly variant="ghost" prefixIcon={ArrowRightIcon} ariaLabel="Continue" />
                                <Button.Base isIconOnly variant="danger" prefixIcon={TrashIcon} ariaLabel="Delete" />
                            </div>
                        ),
                    },
                    {
                        name: "isIconOnly = true, size = sm | md | lg",
                        why: "The square box grows from 36 to 40 to 44px while the glyph inside scales on the same font-driven rule as a labelled button. sm and md share the same glyph size and differ only in the box, because there is one scale rule, not a second one per box.",
                        code: "<Button.Base isIconOnly size=\"lg\" prefixIcon={PlusIcon} ariaLabel=\"Add item\" />",
                        render: (
                            <div className="flex items-center gap-3">
                                {SIZES.map((size) => (
                                    <Button.Base
                                        key={size}
                                        isIconOnly
                                        size={size}
                                        prefixIcon={PlusIcon}
                                        ariaLabel={`Add item (${size})`}
                                    />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isDisabled` — locks press, NO Spinner attached (unlike `isPending`). */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isDisabled`"
                reason="isDisabled means not allowed yet, an invalid form, a missing permission. `isPending` means waiting on something already running. Two different messages; they don't stand in for each other."
                states={[
                    {
                        name: "isDisabled = true, variant sweep",
                        why: "Every variant dims and press is blocked, with no spinner attached. This is forwarded straight to HeroUI's own disabled handling, distinct from isPending because the two mean different things to a reader.",
                        code: "<Button.Base variant=\"primary\" isDisabled label=\"Save draft\" />",
                        render: (
                            <div className="flex flex-wrap items-center gap-3">
                                {VARIANTS.map(({ variant, label }, index) => (
                                    <Button.Base key={variant} variant={variant} label={label} isDisabled showAnatomy={index === 0} />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isPending` — a Spinner REPLACES the leading glyph (never stack two signals in one spot). */
export const Pending: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isPending`"
                reason="react-aria's `isPending` draws nothing on its own, so the atom renders the spinner itself, or the button goes silent for the whole wait."
                states={[
                    {
                        name: "isPending = true, size = sm | md | lg",
                        why: "A spinner takes the leading slot at each size, replacing whatever glyph would sit there, because two marks in one place would be two signals fighting. A button with an icon and one without look identical while pending for the same reason, so this leaf only varies size rather than rendering both.",
                        code: "<Button.Base variant=\"primary\" isPending label=\"Saving…\" />",
                        render: (
                            <div className="flex items-center gap-3">
                                {SIZES.map((size, index) => (
                                    <Button.Base key={size} size={size} isPending label="Saving…" showAnatomy={index === 0} />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `isSkeleton` — a CO-LOCATED shimmer, matching the button box at
 * each size (§12c).
 *
 * Renders BOTH SHAPES in full: pill (labelled button) and square (`isIconOnly`) —
 * that's the entire state set this prop produces. The square row used to sit,
 * misplaced, inside the `IsIconOnly` leaf; skeleton is its OWN prop so it belongs
 * here, not mixed with another prop in one leaf (§12g).
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Button.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its loading state, so the atom draws its own shimmer at button size. There is no shared skeleton component to keep in sync."
                states={[
                    {
                        name: "isSkeleton = true, labelled pill, size = sm | md | lg",
                        why: "A shimmer pill stands at each size (80 / 96 / 112px), tracking the width the real labelled button will take. This is what stops a row of buttons jumping once the data lands and the real label replaces the shimmer.",
                        code: `<Button.Base isSkeleton />
<Button.Base size="lg" isSkeleton />`,
                        render: (
                            <div className="flex items-center gap-3">
                                {SIZES.map((size) => (
                                    <Button.Base key={size} size={size} isSkeleton />
                                ))}
                            </div>
                        ),
                    },
                    {
                        name: "isSkeleton = true, isIconOnly = true, size = sm | md | lg",
                        why: "A shimmer square stands at each size (36 / 40 / 44px) instead of a pill, matching the icon-only button's own box. The square shimmer exists as its own shape rather than a pill shrunk down, because that is the exact box the real icon-only button will occupy.",
                        code: "<Button.Base isIconOnly isSkeleton />",
                        render: (
                            <div className="flex items-center gap-3">
                                {SIZES.map((size) => (
                                    <Button.Base key={size} isIconOnly size={size} isSkeleton />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

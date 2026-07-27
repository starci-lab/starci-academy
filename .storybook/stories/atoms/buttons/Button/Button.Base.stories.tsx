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
                        name: "variant = \"primary\"",
                        why: "The one action the screen wants most, so it carries the filled brand colour and the heaviest weight in the row. Only one of these belongs in a view, because two primaries means neither is primary.",
                        code: `<Button.Base variant="primary" label="Save draft" />`,
                        render: <Button.Base variant="primary" label="Save draft" showAnatomy />,
                    },
                    {
                        name: "variant = \"secondary\"",
                        why: "A real alternative that is still safe to take, drawn on a tinted surface so it reads as an option rather than the recommendation. It can sit beside primary without competing for the eye.",
                        code: `<Button.Base variant="secondary" label="Preview" />`,
                        render: <Button.Base variant="secondary" label="Preview" showAnatomy />,
                    },
                    {
                        name: "variant = \"ghost\"",
                        why: "No surface at all, only a label, for the way out of a flow such as Cancel or Back. It stays legible while claiming the least attention of any button in the system.",
                        code: `<Button.Base variant="ghost" label="Cancel" />`,
                        render: <Button.Base variant="ghost" label="Cancel" showAnatomy />,
                    },
                    {
                        name: "variant = \"danger\"",
                        why: "The solid destructive confirm, used in the dialog where the user has already made the decision. Its weight is deliberate, because the click that follows cannot be undone.",
                        code: `<Button.Base variant="danger" label="Delete" />`,
                        render: <Button.Base variant="danger" label="Delete" showAnatomy />,
                    },
                    {
                        name: "variant = \"danger-soft\"",
                        why: "The calmer destructive action for a smaller scope, such as dropping one row out of a list. It warns without turning an ordinary row into an alarm.",
                        code: `<Button.Base variant="danger-soft" label="Remove from list" />`,
                        render: <Button.Base variant="danger-soft" label="Remove from list" showAnatomy />,
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
                        name: "size = \"sm\"",
                        why: "The button renders at its smallest box height, sm. This scale suits a tight row of actions such as a table's inline toolbar, where every extra pixel of height crowds the next row.",
                        code: "<Button.Base size=\"sm\" label=\"Save draft\" />",
                        render: <Button.Base size="sm" label="Save draft" showAnatomy />,
                    },
                    {
                        name: "size = \"md\" (default)",
                        why: "The button renders at its default box height, md, the scale every button falls back to when size is left unset. This is the height a plain form or dialog action takes, sized for a reader's thumb or cursor without shrinking or looming.",
                        code: "<Button.Base label=\"Save draft\" />",
                        render: <Button.Base size="md" label="Save draft" />,
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The button renders at its largest box height, lg. This scale fits a hero call-to-action, a single button a page wants the reader's eye to land on first.",
                        code: "<Button.Base size=\"lg\" label=\"Save draft\" />",
                        render: <Button.Base size="lg" label="Save draft" />,
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
                        name: "prefixIcon = ArrowLeftIcon",
                        why: "A leading arrow glyph grows before the label on a plain button headed back a step. The glyph carries no size of its own, so the atom reads it off `size` and forces bold weight, since every button glyph sits under 20px and a thin stroke reads weak there.",
                        code: "<Button.Base prefixIcon={ArrowLeftIcon} label=\"Back\" />",
                        render: <Button.Base prefixIcon={ArrowLeftIcon} label="Back" showAnatomy />,
                    },
                    {
                        name: "prefixIcon = FloppyDiskIcon",
                        why: "Swapping the icon component swaps only that leading glyph, nothing else about the row's shape or spacing. This is how a save action gets its own glyph without a second prop or a second component to keep in sync.",
                        code: "<Button.Base prefixIcon={FloppyDiskIcon} label=\"Save\" />",
                        render: <Button.Base prefixIcon={FloppyDiskIcon} label="Save" />,
                    },
                    {
                        name: "variant = \"danger\", prefixIcon = TrashIcon",
                        why: "The leading glyph slot composes freely with `variant`, so a destructive button carries its own warning icon the same way a plain one carries a save icon. Delete reads as dangerous from the trash glyph and the danger fill together, not from either alone.",
                        code: "<Button.Base variant=\"danger\" prefixIcon={TrashIcon} label=\"Delete\" />",
                        render: <Button.Base variant="danger" prefixIcon={TrashIcon} label="Delete" />,
                    },
                    {
                        name: "prefixIcon set, size = \"sm\"",
                        why: "At the smallest box height, the leading glyph shrinks together with the label rather than staying a fixed pixel size. This confirms the glyph tracks the button's own size axis instead of carrying a size prop of its own.",
                        code: "<Button.Base size=\"sm\" prefixIcon={FloppyDiskIcon} label=\"Save\" />",
                        render: <Button.Base size="sm" prefixIcon={FloppyDiskIcon} label="Save" />,
                    },
                    {
                        name: "prefixIcon set, size = \"md\" (default)",
                        why: "At the default box height, the leading glyph sits at the same scale a labelled button without an icon would use for its text. This is the baseline every other size is measured against.",
                        code: "<Button.Base prefixIcon={FloppyDiskIcon} label=\"Save\" />",
                        render: <Button.Base size="md" prefixIcon={FloppyDiskIcon} label="Save" />,
                    },
                    {
                        name: "prefixIcon set, size = \"lg\"",
                        why: "At the largest box height, the leading glyph grows along with the label instead of looking small and lost inside a big button. One scale rule governs both the box and the glyph, so nobody has to size them separately.",
                        code: "<Button.Base size=\"lg\" prefixIcon={FloppyDiskIcon} label=\"Save\" />",
                        render: <Button.Base size="lg" prefixIcon={FloppyDiskIcon} label="Save" />,
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
                        name: "suffixIcon set, variant = \"primary\"",
                        why: "A trailing arrow grows after the label on the screen's main forward action, Continue. The trailing position reads as onward, so it fits a button that takes the reader further rather than one that saves or deletes something.",
                        code: "<Button.Base label=\"Continue\" suffixIcon={ArrowRightIcon} />",
                        render: <Button.Base label="Continue" suffixIcon={ArrowRightIcon} showAnatomy />,
                    },
                    {
                        name: "suffixIcon set, variant = \"secondary\"",
                        why: "The same trailing arrow composes with `variant=\"secondary\"` for a lower-stakes forward action such as opening documentation. The glyph's meaning stays onward regardless of which variant carries it.",
                        code: "<Button.Base variant=\"secondary\" label=\"Open docs\" suffixIcon={ArrowRightIcon} />",
                        render: <Button.Base variant="secondary" label="Open docs" suffixIcon={ArrowRightIcon} />,
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
                        name: "iconSlide = true, suffixIcon (trailing arrow)",
                        why: "On hover, the trailing arrow slides right, the same direction it already points, nudging the reader onward. Tailwind v4 treats translate as its own property, so the atom transitions `translate` rather than `transform`, which is what keeps the hover motion from stuttering.",
                        code: "<Button.Base label=\"Continue\" suffixIcon={ArrowRightIcon} iconSlide />",
                        render: <Button.Base label="Continue" suffixIcon={ArrowRightIcon} iconSlide showAnatomy />,
                    },
                    {
                        name: "iconSlide = true, prefixIcon (leading arrow)",
                        why: "On hover, the leading arrow slides left, the same direction it already points, signalling a step backward. The same `translate`-based transition drives both directions, so a leading arrow and a trailing one never fight each other's motion rule.",
                        code: "<Button.Base variant=\"secondary\" prefixIcon={ArrowLeftIcon} label=\"Back\" iconSlide />",
                        render: <Button.Base variant="secondary" prefixIcon={ArrowLeftIcon} label="Back" iconSlide />,
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
                        name: "isIconOnly = true, variant = \"primary\"",
                        why: "The label disappears and the button collapses to a square glyph-only box carrying the plus icon. The box goes square at the size's own dimension while the glyph still follows the font scale, exactly like a labelled button.",
                        code: "<Button.Base isIconOnly prefixIcon={PlusIcon} ariaLabel=\"Add item\" />",
                        render: <Button.Base isIconOnly prefixIcon={PlusIcon} ariaLabel="Add item" showAnatomy />,
                    },
                    {
                        name: "isIconOnly = true, variant = \"secondary\"",
                        why: "The same square collapse applies on the secondary variant, so a tinted icon-only button reads as an option rather than a command. Dropping the variant argument here would silently fall back to primary, which is why the story sets it explicitly.",
                        code: "<Button.Base isIconOnly variant=\"secondary\" prefixIcon={ArrowLeftIcon} ariaLabel=\"Back\" />",
                        render: <Button.Base isIconOnly variant="secondary" prefixIcon={ArrowLeftIcon} ariaLabel="Back" />,
                    },
                    {
                        name: "isIconOnly = true, variant = \"ghost\"",
                        why: "On the ghost variant the icon-only button keeps no surface at all, only the glyph, matching how a ghost labelled button keeps no surface either. This is the shape for a low-emphasis icon action sitting beside heavier buttons.",
                        code: "<Button.Base isIconOnly variant=\"ghost\" prefixIcon={ArrowRightIcon} ariaLabel=\"Continue\" />",
                        render: <Button.Base isIconOnly variant="ghost" prefixIcon={ArrowRightIcon} ariaLabel="Continue" />,
                    },
                    {
                        name: "isIconOnly = true, variant = \"danger\"",
                        why: "On the danger variant the icon-only button carries the destructive fill with just a trash glyph and no label. The variant alone still reads as destructive, confirming the danger meaning does not depend on the word Delete being visible.",
                        code: "<Button.Base isIconOnly variant=\"danger\" prefixIcon={TrashIcon} ariaLabel=\"Delete\" />",
                        render: <Button.Base isIconOnly variant="danger" prefixIcon={TrashIcon} ariaLabel="Delete" />,
                    },
                    {
                        name: "isIconOnly = true, size = \"sm\"",
                        why: "The square box sits at its smallest dimension, 36px, while the glyph inside scales on the same font-driven rule as a labelled button. This is the icon-only scale for a dense toolbar where every extra pixel matters.",
                        code: "<Button.Base isIconOnly size=\"sm\" prefixIcon={PlusIcon} ariaLabel=\"Add item (sm)\" />",
                        render: <Button.Base isIconOnly size="sm" prefixIcon={PlusIcon} ariaLabel="Add item (sm)" />,
                    },
                    {
                        name: "isIconOnly = true, size = \"md\" (default)",
                        why: "The square box sits at its default dimension, 40px, the same box a plain form or toolbar icon button falls back to. sm and md share the same glyph size and differ only in the box, because there is one scale rule, not a second one per box.",
                        code: "<Button.Base isIconOnly prefixIcon={PlusIcon} ariaLabel=\"Add item (md)\" />",
                        render: <Button.Base isIconOnly size="md" prefixIcon={PlusIcon} ariaLabel="Add item (md)" />,
                    },
                    {
                        name: "isIconOnly = true, size = \"lg\"",
                        why: "The square box grows to its largest dimension, 44px, while the glyph grows along with it on the same scale rule. This is the icon-only size for a button meant to draw the eye first, the same role `lg` plays on a labelled button.",
                        code: "<Button.Base isIconOnly size=\"lg\" prefixIcon={PlusIcon} ariaLabel=\"Add item (lg)\" />",
                        render: <Button.Base isIconOnly size="lg" prefixIcon={PlusIcon} ariaLabel="Add item (lg)" />,
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
                        name: "isDisabled = true, variant = \"primary\"",
                        why: "The primary button dims and blocks press, with no spinner attached. This is forwarded straight to HeroUI's own disabled handling, distinct from `isPending` because the two mean different things to a reader.",
                        code: "<Button.Base variant=\"primary\" isDisabled label=\"Save draft\" />",
                        render: <Button.Base variant="primary" label="Save draft" isDisabled showAnatomy />,
                    },
                    {
                        name: "isDisabled = true, variant = \"secondary\"",
                        why: "The secondary button dims the same way, its tinted surface fading along with the label. Disabling never changes which variant a button is, only whether pressing it does anything.",
                        code: "<Button.Base variant=\"secondary\" isDisabled label=\"Preview\" />",
                        render: <Button.Base variant="secondary" label="Preview" isDisabled />,
                    },
                    {
                        name: "isDisabled = true, variant = \"ghost\"",
                        why: "The ghost button, already the lowest-emphasis shape, dims further still so a disabled Cancel reads as clearly inert as a disabled Save draft. Even a bare label loses enough contrast to read as blocked.",
                        code: "<Button.Base variant=\"ghost\" isDisabled label=\"Cancel\" />",
                        render: <Button.Base variant="ghost" label="Cancel" isDisabled />,
                    },
                    {
                        name: "isDisabled = true, variant = \"danger\"",
                        why: "The danger button dims its solid destructive fill instead of turning colourless, so a disabled Delete still reads as a delete action, just one the reader cannot press right now. Nothing about the destructive meaning is lost, only the ability to act on it.",
                        code: "<Button.Base variant=\"danger\" isDisabled label=\"Delete\" />",
                        render: <Button.Base variant="danger" label="Delete" isDisabled />,
                    },
                    {
                        name: "isDisabled = true, variant = \"danger-soft\"",
                        why: "The calmer destructive variant dims the same way as its heavier sibling, keeping the warning tone legible while blocking the press. This confirms disabling is one rule shared by every variant, not a special case per colour.",
                        code: "<Button.Base variant=\"danger-soft\" isDisabled label=\"Remove from list\" />",
                        render: <Button.Base variant="danger-soft" label="Remove from list" isDisabled />,
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
                        name: "isPending = true, size = \"sm\"",
                        why: "A spinner takes the leading slot on the smallest button, replacing whatever glyph would otherwise sit there. Two marks in one place would be two signals fighting, so the spinner is the only thing allowed in that slot while the action is busy.",
                        code: "<Button.Base size=\"sm\" isPending label=\"Saving…\" />",
                        render: <Button.Base size="sm" isPending label="Saving…" showAnatomy />,
                    },
                    {
                        name: "isPending = true, size = \"md\" (default)",
                        why: "At the default size, the same leading spinner replaces the glyph while the button is busy. A button that normally carries an icon and one that does not look identical while pending, for the same reason: only one signal is allowed in that slot.",
                        code: "<Button.Base isPending label=\"Saving…\" />",
                        render: <Button.Base size="md" isPending label="Saving…" />,
                    },
                    {
                        name: "isPending = true, size = \"lg\"",
                        why: "At the largest size, the spinner scales up along with the box instead of looking small and stranded inside a big button. The busy state stays legible at every size a button can take.",
                        code: "<Button.Base size=\"lg\" isPending label=\"Saving…\" />",
                        render: <Button.Base size="lg" isPending label="Saving…" />,
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
                        name: "isSkeleton = true, size = \"sm\" (pill)",
                        why: "A shimmer pill stands at 80px, tracking the width the real small labelled button will take. This is what stops a button jumping once the data lands and the real label replaces the shimmer.",
                        code: "<Button.Base size=\"sm\" isSkeleton />",
                        render: <Button.Base size="sm" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, size = \"md\" (pill, default)",
                        why: "A shimmer pill stands at 96px, the default width a labelled button's placeholder takes before its data arrives. This is the shape most loading rows in the app actually show, since md is the button size most screens default to.",
                        code: "<Button.Base isSkeleton />",
                        render: <Button.Base size="md" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, size = \"lg\" (pill)",
                        why: "A shimmer pill stands at 112px, tracking the width the real large labelled button will take. The shimmer's own width rule scales with size instead of staying one fixed pill for every button.",
                        code: "<Button.Base size=\"lg\" isSkeleton />",
                        render: <Button.Base size="lg" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, isIconOnly = true, size = \"sm\" (square)",
                        why: "A shimmer square stands at 36px instead of a pill, matching the small icon-only button's own box. The square shimmer is its own shape rather than a pill shrunk down, because that is the exact box the real icon-only button will occupy.",
                        code: "<Button.Base isIconOnly size=\"sm\" isSkeleton />",
                        render: <Button.Base isIconOnly size="sm" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, isIconOnly = true, size = \"md\" (square, default)",
                        why: "A shimmer square stands at 40px, the default icon-only button's own box. This is the placeholder a loading toolbar icon shows before its glyph and press handler are ready.",
                        code: "<Button.Base isIconOnly isSkeleton />",
                        render: <Button.Base isIconOnly size="md" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, isIconOnly = true, size = \"lg\" (square)",
                        why: "A shimmer square stands at 44px, tracking the largest icon-only button's own box. The square scales with size the same way the pill shimmer does, so neither shape needs a size rule of its own.",
                        code: "<Button.Base isIconOnly size=\"lg\" isSkeleton />",
                        render: <Button.Base isIconOnly size="lg" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

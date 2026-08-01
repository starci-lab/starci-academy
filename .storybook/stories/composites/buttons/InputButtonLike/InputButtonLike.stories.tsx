import type { Meta, StoryObj } from "@storybook/nextjs"
import { Kbd } from "@heroui/react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { InputButtonLike } from "@sb-components/composites/buttons/InputButtonLike/InputButtonLike"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `InputButtonLike`: a button disguised as an input field — it
 * carries the native HeroUI field look (rounded shell, field background +
 * border, muted placeholder text) but behaves as a single press target with
 * no inner dividers, so it can trigger an overlay (a global search dialog, a
 * command palette) instead of accepting typed input.
 *
 * 📐 1 PROP = 1 LEAF: `icon` · `suffix` · `size` · `isSkeleton` ·
 * `placeholder`, each its own leaf, each rendering the FULL set of its
 * values.
 *
 * Props with NO leaf, and why:
 * - `ariaLabel` — an accessible name only; falls back to `placeholder` when
 *   omitted, produces no visible difference to read on screen.
 * - `onPress` — the press handler; wires up behaviour, not appearance.
 * - `classNames` — placement inside a parent, appearance is not passable
 *   through it.
 *
 * ⚠️ STRUCTURE GAP: this composite renders a raw HeroUI `Button` directly
 * (see the component's own file header for the three real API gaps that rule
 * out the house `Button` atom) and does not forward `data-anat-part` on its
 * own root or through its inner `StackH`/`Typography`/icon spans, so
 * `ANNOTATE` below only documents what it wraps — the Structure tab has
 * nothing to derive from the DOM here. A documented gap in the component
 * itself, not fixed by this story (out of scope: story files only).
 */
const meta: Meta<typeof InputButtonLike> = {
    title: "Composites/Buttons/InputButtonLike",
    component: InputButtonLike,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof InputButtonLike>

/** The trailing shortcut hint (⌘K), passed as a component reference — the block calls it itself. */
const ShortcutHint = () => (
    <Kbd data-tier="fixture">
        <Kbd.Content>⌘K</Kbd.Content>
    </Kbd>
)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Button": {
        tier: "heroui",
        role: "the raw HeroUI Button this composite renders directly, not the house Button atom — see the component's own file header for the three API gaps that rule that atom out",
    },
}

/** Baseline leaf — no optional prop turned on: placeholder only, size defaults to md. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="w-80 p-8">
            <BlockAnatomy
                name="InputButtonLike"
                tier="composite"
                annotate={ANNOTATE}
                leaf="No prop turned on"
                reason="Use this when a field needs to LOOK like an input but is actually a button that opens an overlay — you cannot type into it; if real typing is needed, use Input instead. Every leaf below differs from this one by exactly one prop."
                states={[
                    {
                        name: "no prop turned on (size = md)",
                        why: "Just the placeholder text inside the field shell — no leading icon, no trailing suffix, no skeleton. This is the plainest shape the composite can take, with nothing occupying either of its two optional slots.",
                        code: "<InputButtonLike placeholder=\"Search courses...\" onPress={() => {}} />",
                        render: <InputButtonLike placeholder="Search courses..." onPress={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `icon` — the optional LEADING glyph, passed as a component reference (§5a). */
export const Icon: Story = {
    render: () => (
        <div data-tier="fixture" className="w-80 p-8">
            <BlockAnatomy
                name="InputButtonLike"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `icon`"
                reason="An optional leading glyph (e.g. a magnifying glass) for when the field stands in for a search box. Passed as a COMPONENT reference, not built JSX — the composite calls it itself and owns its size (§5a) and muted colour."
                states={[
                    {
                        name: "icon = undefined (default)",
                        why: "No glyph renders before the placeholder text — the field reads as a plain trigger with nothing hinting at what it opens.",
                        code: "<InputButtonLike placeholder=\"Search courses...\" onPress={() => {}} />",
                        render: <InputButtonLike placeholder="Search courses..." onPress={() => {}} />,
                    },
                    {
                        name: "icon = MagnifyingGlassIcon",
                        why: "A muted magnifying-glass glyph grows in the leading slot, sized and coloured entirely by the composite. This is the shape a search trigger takes across the app, since the caller never sizes or tints the icon itself.",
                        code: "<InputButtonLike icon={MagnifyingGlassIcon} placeholder=\"Search courses, lessons...\" onPress={() => {}} />",
                        render: (
                            <InputButtonLike
                                icon={MagnifyingGlassIcon}
                                placeholder="Search courses, lessons..."
                                onPress={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `suffix` — the optional TRAILING region, also a component reference, withheld while `isSkeleton`. */
export const Suffix: Story = {
    render: () => (
        <div data-tier="fixture" className="w-80 p-8">
            <BlockAnatomy
                name="InputButtonLike"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `suffix`"
                reason="An optional trailing region pinned to the right edge, e.g. a Kbd shortcut hint, for when the overlay can also be opened by a keyboard shortcut. Passed as a component reference so the composite can withhold it while loading."
                states={[
                    {
                        name: "suffix = undefined (default)",
                        why: "No trailing region renders — the field ends right after the placeholder text, the shape for a trigger with no keyboard shortcut to advertise.",
                        code: "<InputButtonLike icon={MagnifyingGlassIcon} placeholder=\"Search courses...\" onPress={() => {}} />",
                        render: (
                            <InputButtonLike icon={MagnifyingGlassIcon} placeholder="Search courses..." onPress={() => {}} />
                        ),
                    },
                    {
                        name: "suffix = ShortcutHint (renders a Kbd)",
                        why: "The Kbd hint pins to the field's trailing edge, telling the reader the same overlay opens with ⌘K. The composite renders whatever component the caller passes, so a badge or a second icon could sit there just as easily.",
                        code: "<InputButtonLike icon={MagnifyingGlassIcon} placeholder=\"Quick search...\" suffix={ShortcutHint} onPress={() => {}} />",
                        render: (
                            <InputButtonLike
                                icon={MagnifyingGlassIcon}
                                placeholder="Quick search..."
                                suffix={ShortcutHint}
                                onPress={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `size` — 3 field-height steps; the leading icon's box scales along with it (§5a). */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="w-80 p-8">
            <BlockAnatomy
                name="InputButtonLike"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason="size controls the field's own height/min-height and placeholder text scale, sm/md/lg, and the leading icon's box scales along with it — the composite owns both rules, so a caller never sizes the icon separately from the field."
                states={[
                    {
                        name: "size = \"sm\" (h-8, text-xs, icon size-4)",
                        why: "The field renders at its smallest height, 32px, with the tightest placeholder text size. This scale suits a dense toolbar row where a full md-height trigger would crowd its neighbours.",
                        code: "<InputButtonLike size=\"sm\" icon={MagnifyingGlassIcon} placeholder=\"Small search...\" onPress={() => {}} />",
                        render: (
                            <InputButtonLike size="sm" icon={MagnifyingGlassIcon} placeholder="Small search..." onPress={() => {}} />
                        ),
                    },
                    {
                        name: "size = \"md\" (default; h-9, text-sm, icon size-4)",
                        why: "The field renders at its default height, 36px, the scale every field falls back to when size is left unset. This is the height a plain header search trigger takes.",
                        code: "<InputButtonLike icon={MagnifyingGlassIcon} placeholder=\"Medium search...\" onPress={() => {}} />",
                        render: (
                            <InputButtonLike size="md" icon={MagnifyingGlassIcon} placeholder="Medium search..." onPress={() => {}} />
                        ),
                    },
                    {
                        name: "size = \"lg\" (h-10, text-base, icon size-5)",
                        why: "The field grows to its largest height, 40px, with the icon stepping up to size-5 along with it. This scale fits a page's own hero search trigger, the one control the eye should land on first.",
                        code: "<InputButtonLike size=\"lg\" icon={MagnifyingGlassIcon} placeholder=\"Large search...\" onPress={() => {}} />",
                        render: (
                            <InputButtonLike size="lg" icon={MagnifyingGlassIcon} placeholder="Large search..." onPress={() => {}} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isSkeleton` — a CO-LOCATED shimmer; the field shell stays real, only the placeholder bar shimmers, icon/suffix withheld (§12c). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="w-80 p-8">
            <BlockAnatomy
                name="InputButtonLike"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="The field shell stays real throughout — same height/border/shadow whether loading or not, a field that is loading is still a field (§12c). Only the placeholder label keeps its own shimmer bar; the leading icon and trailing suffix are withheld entirely, since their shape isn't known yet, and the press is locked."
                states={[
                    {
                        name: "isSkeleton = false (default)",
                        why: "The real field renders: icon, placeholder text, and suffix all in place, and the press handler is live. This is the shape every other leaf on this page shows.",
                        code: "<InputButtonLike icon={MagnifyingGlassIcon} placeholder=\"Search courses...\" suffix={ShortcutHint} onPress={() => {}} />",
                        render: (
                            <InputButtonLike
                                icon={MagnifyingGlassIcon}
                                placeholder="Search courses..."
                                suffix={ShortcutHint}
                                onPress={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The field shell keeps its exact height for `size`, but the icon and suffix disappear and the placeholder becomes a shimmer bar through Typography's own isSkeleton. The press handler is also locked (isDisabled), so the field cannot be triggered while its own content is still loading.",
                        code: "<InputButtonLike placeholder=\"Search courses...\" onPress={() => {}} isSkeleton />",
                        render: <InputButtonLike placeholder="Search courses..." onPress={() => {}} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `placeholder` — the field's own text; clips to one line inside a bounded width instead of breaking the layout. */
export const Placeholder: Story = {
    render: () => (
        <div data-tier="fixture" className="w-64 p-8">
            <BlockAnatomy
                name="InputButtonLike"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `placeholder`"
                reason="Placeholder-style label text, rendered muted like an empty input value. Plain text, not JSX — the composite wraps it itself so it can also draw the skeleton bar in its place."
                states={[
                    {
                        name: "placeholder = short text",
                        why: "A short placeholder sits comfortably inside the field with room to spare, the common case for a compact search box.",
                        code: "<InputButtonLike icon={MagnifyingGlassIcon} placeholder=\"Search courses...\" onPress={() => {}} />",
                        render: (
                            <InputButtonLike icon={MagnifyingGlassIcon} placeholder="Search courses..." onPress={() => {}} />
                        ),
                    },
                    {
                        name: "placeholder = long text (clips to one line)",
                        why: "Inside a bounded width, a placeholder longer than the field clips to a single line with an ellipsis instead of wrapping or breaking the field's own height.",
                        code: "<InputButtonLike icon={MagnifyingGlassIcon} placeholder=\"Search Fullstack, System Design, DevOps courses and much more...\" onPress={() => {}} />",
                        render: (
                            <InputButtonLike
                                icon={MagnifyingGlassIcon}
                                placeholder="Search Fullstack, System Design, DevOps courses and much more..."
                                onPress={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

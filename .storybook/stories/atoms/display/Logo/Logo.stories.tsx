import type { Meta, StoryObj } from "@storybook/nextjs"
import { Logo } from "@sb-components/atoms/display/Logo/Logo"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Logo`: the system's one and only brand mark (a "C" glyph in pink stroke
 * plus two dotted corner marks), inline SVG, no background, one fixed colour.
 *
 * Its only prop is `className`, which produces no shape of its own — so the atom has
 * no leaf other than `Default`, no union to enumerate. The side-by-side tiles (three
 * heights + a dark background) are `states[]` entries of that one leaf, not separate
 * leaves.
 */

/** Copy shown at the top of the autodocs page. UI text is written in ENGLISH. */
const LOGO_DOC = `
## One mark, one colour

The mark is a single fixed brand-pink colour on a transparent background — no dark
square, no colour variants. It reads on a light surface and a dark surface without
any change, so it never needs a "light" or "dark" version.

## Sizing is height-driven

The atom has no size prop. Pass a height utility through \`className\` (\`h-9\`,
\`h-10\`, \`h-14\`…) and the width follows on its own — the mark is a fixed square,
so one dimension is always enough.
`

const meta: Meta<typeof Logo> = {
    title: "Atoms/Display/Logo/Logo",
    component: Logo,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: LOGO_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof Logo>

/**
 * BARE leaf — no meaningful prop turned on. Since the component only has
 * `className` (which produces no leaf of its own), this is also the ONLY
 * leaf this atom has. The four states below are all the SAME shape,
 * differing only in height/background — proving the claim in the component
 * JSDoc: one fixed colour reads on both a light and a dark surface, with no
 * variant needed. Migrated to `states` 2026-07-27.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Logo"
                tier="atom"
                leaf="Bare mark"
                reason="The one brand mark in the system, so this single leaf is the whole atom — no tone prop, no size prop, no variant union. It is a fixed-colour, fixed-ratio SVG (1:1); height comes from className while width follows on its own, and the same pink reads on a light card and a dark surface without changing."
                states={[
                    {
                        name: "className = \"h-9\" (compact height)",
                        why: "Only the mark's rendered height changes; the SVG keeps its fixed 1:1 ratio, so the width follows on its own. A compact nav bar needs the smallest of the three common heights so the mark doesn't crowd the row.",
                        code: "<Logo className=\"h-9\" />   // compact — nav bar",
                        render: (
                            <div data-tier="fixture" className="flex items-center gap-2 rounded-lg border border-default bg-surface p-6">
                                <Logo className="h-9" />
                                <span className="text-[11px] text-muted">h-9 · compact</span>
                            </div>
                        ),
                    },
                    {
                        name: "className = \"h-10\" (default height)",
                        why: "The mark renders one notch taller than the compact state, still the same fixed-colour SVG. This is the default lockup height used wherever the mark sits at normal reading size, like a footer or a card header.",
                        code: "<Logo className=\"h-10\" />  // default lockup",
                        render: (
                            <div data-tier="fixture" className="flex items-center gap-2 rounded-lg border border-default bg-surface p-6">
                                <Logo className="h-10" />
                                <span className="text-[11px] text-muted">h-10 · default</span>
                            </div>
                        ),
                    },
                    {
                        name: "className = \"h-14\" (splash height)",
                        why: "The mark renders at the largest of the three common heights, again just scaling the same 1:1 SVG. A splash screen or a hero section needs the mark to read from further away, which is what the taller height buys.",
                        code: "<Logo className=\"h-14\" />  // splash / hero",
                        render: (
                            <div data-tier="fixture" className="flex items-center gap-2 rounded-lg border border-default bg-surface p-6">
                                <Logo className="h-14" />
                                <span className="text-[11px] text-muted">h-14 · splash</span>
                            </div>
                        ),
                    },
                    {
                        name: "className = \"h-10\", on a dark surface",
                        why: "The exact same pink mark renders; only the surrounding background switches to a dark fill. This proves the one fixed colour is legible on both a light card and a dark surface without needing a separate dark-mode variant.",
                        code: `// on a dark surface — same mark, no variant prop
<div className="bg-neutral-950">
  <Logo className="h-10" />
</div>`,
                        render: (
                            <div data-tier="fixture" className="flex items-center gap-2 rounded-lg bg-neutral-950 p-6">
                                <Logo className="h-10" />
                                <span className="text-[11px] text-neutral-400">on dark surface</span>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

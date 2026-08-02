import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlusIcon } from "@phosphor-icons/react"
import { FloatingActionButton } from "@sb-components/composites/buttons/FloatingActionButton/FloatingActionButton"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FloatingActionButton` — a bottom-right floating action button: a round, shadowed accent
 * circle composing the icon-only `Button`, pinned to the corner with `fixed`. Leaves: `icon`,
 * `isSkeleton`. `onPress`/`ariaLabel` carry the press handler and accessible name only.
 */
const meta: Meta<typeof FloatingActionButton> = {
    title: "Composites/Buttons/FloatingActionButton",
    component: FloatingActionButton,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof FloatingActionButton>

/** Bare leaf — no optional prop turned on: the page's primary floating action, glyph set to the default create icon. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FloatingActionButton"
                tier="composite"
                leaf="No prop turned on"
                reason="The one floating action button in the system, pinned to the bottom-right corner for the page's main action (e.g. quick create). This leaf is the baseline — every leaf below differs from it by exactly one prop."
                states={[
                    {
                        name: "icon = PlusIcon, isSkeleton = false",
                        why: "A round, shadowed accent circle pins to the bottom-right corner with a plus glyph centered inside it. This is the everyday shape: one primary action a page wants within reach from anywhere in the scroll.",
                        code: "<FloatingActionButton onPress={() => {}} ariaLabel=\"Create new\" icon={PlusIcon} />",
                        render: <FloatingActionButton onPress={() => {}} ariaLabel="Create new" icon={PlusIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `icon` — the single glyph centered inside the round button, or none at all. */
export const Icon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FloatingActionButton"
                tier="composite"
                leaf="Prop `icon`"
                reason="icon is a named slot (§13b), not children — this block wraps no caller content, it only carries one glyph, passed as a component reference the base Button centers and sizes itself."
                states={[
                    {
                        name: "icon unset",
                        why: "The round accent circle renders with no glyph inside it at all — a bare filled circle. This is the shape before a caller has picked which action the button opens.",
                        code: "<FloatingActionButton onPress={() => {}} ariaLabel=\"Create new\" />",
                        render: <FloatingActionButton onPress={() => {}} ariaLabel="Create new" />,
                    },
                    {
                        name: "icon = PlusIcon",
                        why: "A plus glyph centers inside the circle, marking this FAB as a create action. Swapping the icon component swaps only the glyph, nothing about the circle's size, shadow, or corner placement.",
                        code: "<FloatingActionButton onPress={() => {}} ariaLabel=\"Create new\" icon={PlusIcon} />",
                        render: <FloatingActionButton onPress={() => {}} ariaLabel="Create new" icon={PlusIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isSkeleton` — the round skeleton KEEPS the same bottom-right pin while the page still loads. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FloatingActionButton"
                tier="composite"
                leaf="Prop `isSkeleton`"
                reason="The base Button owns its own shimmer, co-located to the exact box a real icon-only button would occupy — the FAB only decides to flip the flag and keeps its fixed corner placement, so the loading circle never appears in the wrong spot once the real button mounts."
                states={[
                    {
                        name: "isSkeleton = false",
                        why: "The real accent circle with its plus glyph renders pinned to the corner, the shape isSkeleton mirrors while the page is still loading.",
                        code: "<FloatingActionButton onPress={() => {}} ariaLabel=\"Create new\" icon={PlusIcon} />",
                        render: <FloatingActionButton onPress={() => {}} ariaLabel="Create new" icon={PlusIcon} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "A round shimmer circle takes the exact same bottom-right pin, size, and shadow as the real button, so nothing jumps once the page finishes loading and the real FAB mounts in its place.",
                        code: "<FloatingActionButton onPress={() => {}} ariaLabel=\"Create new\" isSkeleton icon={PlusIcon} />",
                        render: <FloatingActionButton onPress={() => {}} ariaLabel="Create new" isSkeleton icon={PlusIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

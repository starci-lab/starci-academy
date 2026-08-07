import type { Meta, StoryObj } from "@storybook/nextjs"
import { DrawerRoot } from "@sb-components/frames/DrawerRoot/DrawerRoot"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * FRAME — `DrawerRoot`: the identity root of a drawer overlay. It draws no shape of its
 * own — one `<div>` carrying `data-tier="drawer"` and the caller's `data-component` —
 * and mounts a single `body` slot inside it, so every drawer shares one identity div
 * instead of hand-writing its own.
 *
 * One prop = one leaf: `data-component` (the identity itself) and `body` (the slot it
 * wraps). `isSkeleton` is a bare pass-through with no leaf of its own — the same
 * restraint every other frame in this folder already takes (`Container`,
 * `SplitWorkspace`, `RailShell`, `Grid`): skeleton is a data-owning tier's concern
 * (`story.md`), and this frame owns no data, it only forwards the flag to whatever
 * `body` is.
 *
 * No `annotate`: the root wears the CALLER's identity, not a fixed "DrawerRoot" name,
 * and `body` is a caller slot with no badge of its own — the same restraint
 * `Container`'s `body` and `SplitWorkspace`'s `main`/`aside` already take. There is no
 * `DrawerRoot`-owned part to declare.
 */
const meta: Meta<typeof DrawerRoot> = {
    title: "Frames/DrawerRoot/DrawerRoot",
    component: DrawerRoot,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DrawerRoot>

/** A stand-in for whatever screen the caller mounts in `body` — never real content. */
const PlaceholderBody = () => (
    <div data-tier="fixture" className="rounded-xl border border-default bg-surface p-3 text-sm text-foreground">
        Drawer content placeholder
    </div>
)

/** A second stand-in, shaped differently, to prove `body` accepts ANY built content. */
const ListBody = () => (
    <div data-tier="fixture" className="flex flex-col gap-2 rounded-xl border border-default bg-surface p-3 text-sm text-foreground">
        <span>Attempt #3 — 84%</span>
        <span>Attempt #2 — 71%</span>
        <span>Attempt #1 — 55%</span>
    </div>
)

/** Bare leaf — the identity root wearing a caller's name, mounting one placeholder body. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DrawerRoot"
                tier="frame"
                leaf="No prop turned on"
                reason={"The identity root every drawer in the app shares instead of hand-writing its own `<div data-tier=\"drawer\" data-component=\"...\">`. It arranges nothing and carries no spacing — pure identity, plus one slot."}
                states={[
                    {
                        name: "data-component = \"SubmissionAttemptsDrawer\", body set",
                        why: "The baseline shape: the root wears the caller's identity and mounts whatever `body` builds. Nothing else is drawn — no padding, no border, no default width — because that chrome belongs to the overlay wrapping this root, not to the identity div itself.",
                        code: "<DrawerRoot data-component=\"SubmissionAttemptsDrawer\" body={PlaceholderBody} />",
                        render: <DrawerRoot data-component="SubmissionAttemptsDrawer" body={PlaceholderBody} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `data-component` — the identity string, REQUIRED, supplied by the caller. */
export const DataComponent: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DrawerRoot"
                tier="frame"
                leaf="Prop `data-component`"
                reason={"This string is the reason the frame exists: it becomes the `data-component` attribute on the identity root, so a rendered-tree test can query `[data-tier=\"drawer\"][data-component=\"...\"]` without every drawer hand-rolling that same div. `body` stays the same placeholder across both states in this leaf, so only the identity string is what's changing."}
                states={[
                    {
                        name: "data-component = \"SubmissionAttemptsDrawer\"",
                        why: "The identity a submission-attempts drawer wears — the shape's own JSDoc example. Any string is legal; nothing about the root's own layout reads it beyond the attribute.",
                        code: "<DrawerRoot data-component=\"SubmissionAttemptsDrawer\" body={PlaceholderBody} />",
                        render: <DrawerRoot data-component="SubmissionAttemptsDrawer" body={PlaceholderBody} />,
                    },
                    {
                        name: "data-component = \"CourseEnrollDrawer\"",
                        why: "A different caller mounting the SAME frame with a different identity. The root's shape never changes — only the name it answers to in a `[data-component=...]` query does, which is exactly what stops every drawer needing its own hand-rolled identity div.",
                        code: "<DrawerRoot data-component=\"CourseEnrollDrawer\" body={PlaceholderBody} />",
                        render: <DrawerRoot data-component="CourseEnrollDrawer" body={PlaceholderBody} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `body` — the ONE region mounted inside the identity root. */
export const Body: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DrawerRoot"
                tier="frame"
                leaf="Prop `body`"
                reason="`body` isn't a union, so coverage is declared by call shape instead — the same way `Button`'s `prefixIcon` is: swap the built component and see the root mount it unchanged. `data-component` stays fixed across both states in this leaf, so only the slot's content is what's changing."
                states={[
                    {
                        name: "body = PlaceholderBody",
                        why: "A single placeholder block — the shape most drawers start from before real content is wired in.",
                        code: "<DrawerRoot data-component=\"SubmissionAttemptsDrawer\" body={PlaceholderBody} />",
                        render: <DrawerRoot data-component="SubmissionAttemptsDrawer" body={PlaceholderBody} />,
                    },
                    {
                        name: "body = ListBody",
                        why: "A completely different shape — a short list instead of a block — mounted through the exact same slot with no change to the root at all. This is what proves the root arranges nothing of its own: whatever `body` builds is what appears, unmodified.",
                        code: "<DrawerRoot data-component=\"SubmissionAttemptsDrawer\" body={ListBody} />",
                        render: <DrawerRoot data-component="SubmissionAttemptsDrawer" body={ListBody} />,
                    },
                ]}
            />
        </div>
    ),
}

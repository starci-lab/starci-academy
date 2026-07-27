import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Avatar, AvatarFallback, Button } from "@heroui/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * FRAME (Layouts) — a PRESSABLE card shell, slot-agnostic: surface frame +
 * press feedback (inert hover, `active:scale-[0.97]` + ripple). Exists because
 * HeroUI v3 `Card` is a non-interactive `<div>` — this frame puts the exact
 * card style set onto a real `<button>`/`<a>`.
 *
 * ⚠️ STATE SCOPE (teacher's call 2026-07-25): stories here ONLY render states
 * that `.Pressable` ITSELF produces — press target (`onPress`/`href`),
 * stretched-link (`actions` + `label`), `isSelected`, `isDisabled`,
 * `isSkeleton`. The `header`/`body`/`footer` slot set is a SHARED mechanism of
 * the wrapping frame, already demonstrated in `SurfaceCard.Base` → not
 * repeated here.
 *
 * `.Pressable` is NOT part of the THREE-AXIS `variant`/`padding`/`radius`
 * (teacher's call 2026-07-26) — only `.Base`/`.Nested`/`.List`/`.Accordion`/
 * `.CrossList` have those three props.
 *
 * ANATOMY: each story is its own leaf with its own BlockAnatomy. 2026-07-26
 * (teacher) — the panel dropped the `parts`/`AnatomyNode` prop (the old way,
 * declaring structure by hand) and the States tab; structure is now inferred
 * from the DOM, annotated via `annotate` ONLY when a part has a REAL
 * `storyId` (clickable jump). `Content`/`Actions`/`Skeleton` here are INTERNAL
 * slots of `.Pressable` itself — none of them has its own story to point to —
 * so the panel-parts prop is dropped entirely, not replaced with an empty
 * `annotate`.
 *
 * MIGRATED TO `states` (2026-07-27): every leaf below is a single-render leaf
 * (one prop condition, one shape), so each carries exactly one `states[]`
 * entry — the render/code pair that used to sit loose on `children`/`code`.
 */
const meta: Meta<typeof SurfaceCard.Pressable> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCard.Pressable",
    component: SurfaceCard.Pressable,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Pressable>

/** Plain canvas for each leaf's anatomy panel — the card's own width goes through `renderClassName`. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/**
 * Standard fixture (C-fixture) = ProfileCard (avatar + title + description).
 * NOTE: `SurfaceCard.Pressable` draws its own card frame
 * (surface/rounded-3xl/p-3/shadow-surface), so no extra outer
 * `Card`/`CardContent` wrapper here — just the inner row, avoiding
 * card-in-card.
 */
const ProfileRow = () => (
    <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">StarCi Academy</span>
            <span className="truncate text-xs text-muted">
                Learn fullstack, system design, and DevOps on an interview-prep roadmap.
            </span>
        </div>
    </div>
)

/** Default — a navigation tile: the whole card is ONE press target, its body doubles as the a11y label. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="composite"
                leaf="Default"
                renderClassName="max-w-md"
                reason="Needs ONE card frame with press feedback (inert hover, a subtle press-in + ripple) shared by every pressable tile — instead of every call site re-writing surface/rounded-3xl/p-3/shadow-surface + ripple by hand. Slot-agnostic (free-form body), so it belongs at the frame tier; a second part (Actions) only appears once the card also needs its own independent buttons (stretched-link)."
                states={[
                    {
                        name: "onPress set, no actions/href",
                        why: "The card mounts as a single `<button>` where the whole tile is the press target, and `ProfileRow`'s own text becomes its accessible label. This is the plain navigation-tile shape used when the entire card leads to one action, so there is nothing else on it that needs its own click target.",
                        code: `<SurfaceCard.Pressable onPress={() => {}}>
  <ProfileRow />
</SurfaceCard.Pressable>`,
                        render: (
                            <SurfaceCard.Pressable onPress={() => {}} showAnatomy>
                                <ProfileRow />
                            </SurfaceCard.Pressable>
                        ),
                    },
                ]}
            />,
        ),
}

/** `href` — the whole card is ONE a11y link (navigates on click). */
export const AsLink: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="composite"
                leaf="AsLink"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "href set instead of onPress",
                        why: "The card mounts an `<a>` in place of the `<button>`, keeping the exact same single `Content` shape as the Default state. A caller that only has a destination URL, not a click handler, needs the card to behave as a real navigation link rather than an action button.",
                        code: `<SurfaceCard.Pressable href="#">
  <ProfileRow />
</SurfaceCard.Pressable>`,
                        render: (
                            <SurfaceCard.Pressable href="#" showAnatomy>
                                <ProfileRow />
                            </SurfaceCard.Pressable>
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * `actions` + `label` — a second, independent press area INSIDE the card
 * (stretched-link): a TRANSPARENT whole-card press overlay sits underneath,
 * the CTA + menu sit above it so they stay separately pressable. TypeScript
 * forces `label` to become REQUIRED as soon as `actions` is present (the
 * overlay carries no text of its own).
 */
export const WithActions: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="composite"
                leaf="WithActions"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "actions + label set",
                        why: "The card gains a transparent whole-card overlay press target underneath the content, plus a separate `Actions` node stacked above it so the CTA and the overflow menu stay independently clickable. This is the stretched-link shape a card needs the moment it must hold its own buttons, since nesting a real `<button>` inside the whole-card `<button>` is not legal HTML.",
                        code: `<SurfaceCard.Pressable
  onPress={() => {}}
  label="Open the StarCi Academy profile"
  actions={
    <>
      <Button size="sm" variant="secondary">Continue</Button>
      <Button size="sm" variant="tertiary" isIconOnly aria-label="More options">⋯</Button>
    </>
  }
>
  <ProfileRow />
</SurfaceCard.Pressable>`,
                        render: (
                            <SurfaceCard.Pressable
                                onPress={() => {}}
                                label="Open the StarCi Academy profile"
                                showAnatomy
                                actions={(
                                    <>
                                        <Button size="sm" variant="secondary" onPress={() => {}}>Continue</Button>
                                        <Button size="sm" variant="tertiary" isIconOnly aria-label="More options" onPress={() => {}}>⋯</Button>
                                    </>
                                )}
                            >
                                <ProfileRow />
                            </SurfaceCard.Pressable>
                        ),
                    },
                ]}
            />,
        ),
}

/** `isSelected` — a SELECTED tile in a selection grid: an accent ring around the card (the row's checkmark equivalent). */
export const Selected: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="composite"
                leaf="Selected"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "isSelected = true",
                        why: "The card keeps the exact same `Content` node as the Default state and only gains a `ring-2 ring-accent` outline plus `aria-pressed`/`aria-current`. A selection grid needs a way to show which tile is currently chosen without changing what the tile actually contains.",
                        code: `<SurfaceCard.Pressable isSelected onPress={() => {}}>
  <ProfileRow />
</SurfaceCard.Pressable>`,
                        render: (
                            <SurfaceCard.Pressable isSelected onPress={() => {}} showAnatomy>
                                <ProfileRow />
                            </SurfaceCard.Pressable>
                        ),
                    },
                ]}
            />,
        ),
}

/** `isDisabled` — an option that's temporarily unavailable: dims + disables interaction, STILL shown so its existence still reads. */
export const Disabled: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="composite"
                leaf="Disabled"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "isDisabled = true",
                        why: "Nothing mounts or unmounts — the same `Content` node renders, just dimmed, and the ripple/press-scale feedback stops firing. The option has to stay visible so the reader still knows it exists, even though it can't be chosen right now.",
                        code: `<SurfaceCard.Pressable isDisabled onPress={() => {}}>
  <ProfileRow />
</SurfaceCard.Pressable>`,
                        render: (
                            <SurfaceCard.Pressable isDisabled onPress={() => {}} showAnatomy>
                                <ProfileRow />
                            </SurfaceCard.Pressable>
                        ),
                    },
                ]}
            />,
        ),
}

/** Loading — `isSkeleton` draws its own mirror (icon block + 2 text lines), no separate Skeleton needed. */
export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="composite"
                leaf="Loading"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The entire `Content` node is replaced by a fixed shimmer mirror — an icon-shaped tile plus two text bars — instead of whatever `children` would eventually hold. The mirror doesn't depend on the real content's shape, so a caller can flip the flag on before it even knows what will load.",
                        code: `<SurfaceCard.Pressable
  isSkeleton
/>`,
                        render: (
                            <SurfaceCard.Pressable isSkeleton showAnatomy>
                                <ProfileRow />
                            </SurfaceCard.Pressable>
                        ),
                    },
                ]}
            />,
        ),
}

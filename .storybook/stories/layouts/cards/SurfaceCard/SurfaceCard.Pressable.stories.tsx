import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Avatar, AvatarFallback, Button } from "@heroui/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
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
 */
const meta: Meta<typeof SurfaceCard.Pressable> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.Pressable",
    component: SurfaceCard.Pressable,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Pressable>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8"><div className="max-w-md">{node}</div></div>

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
                tier="primitive"
                leaf="Default"
                reason="Needs ONE card frame with press feedback (inert hover, a subtle press-in + ripple) shared by every pressable tile — instead of every call site re-writing surface/rounded-3xl/p-3/shadow-surface + ripple by hand. Slot-agnostic (free-form body), so it belongs at the frame tier; a second part (Actions) only appears once the card also needs its own independent buttons (stretched-link)."
                code={`<SurfaceCard.Pressable onPress={() => {}}>
  <ProfileRow />
</SurfaceCard.Pressable>`}
            >
                <SurfaceCard.Pressable onPress={() => {}} showAnatomy>
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
        ),
}

/** `href` — the whole card is ONE a11y link (navigates on click). */
export const AsLink: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="AsLink"
                note="`href` replaces `onPress` → the card renders an `<a>`, same shape (one Content) as leaf Default."
                code={`<SurfaceCard.Pressable href="#">
  <ProfileRow />
</SurfaceCard.Pressable>`}
            >
                <SurfaceCard.Pressable href="#" showAnatomy>
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
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
                tier="primitive"
                leaf="WithActions"
                note="`actions` + `label` → switches to the stretched-link pattern: a transparent whole-card press overlay sits under Content, and Actions sit above the overlay (z-10) so Continue/menu stay separately clickable."
                code={`<SurfaceCard.Pressable
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
</SurfaceCard.Pressable>`}
            >
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
            </BlockAnatomy>,
        ),
}

/** `isSelected` — a SELECTED tile in a selection grid: an accent ring around the card (the row's checkmark equivalent). */
export const Selected: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="Selected"
                note="`isSelected` only adds `ring-2 ring-accent` + `aria-pressed`/`aria-current` — same Content shape as leaf Default."
                code={`<SurfaceCard.Pressable isSelected onPress={() => {}}>
  <ProfileRow />
</SurfaceCard.Pressable>`}
            >
                <SurfaceCard.Pressable isSelected onPress={() => {}} showAnatomy>
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
        ),
}

/** `isDisabled` — an option that's temporarily unavailable: dims + disables interaction, STILL shown so its existence still reads. */
export const Disabled: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="Disabled"
                note="`isDisabled` only dims + disables interaction (no ripple / no press-scale) — same Content shape as leaf Default."
                code={`<SurfaceCard.Pressable isDisabled onPress={() => {}}>
  <ProfileRow />
</SurfaceCard.Pressable>`}
            >
                <SurfaceCard.Pressable isDisabled onPress={() => {}} showAnatomy>
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
        ),
}

/** Loading — `isSkeleton` draws its own mirror (icon block + 2 text lines), no separate Skeleton needed. */
export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="Loading"
                note="`isSkeleton` replaces the ENTIRE content with a shared mirror (icon tile + 2 text bars) — a completely different composition from the Content/Actions leaves above."
                code={`<SurfaceCard.Pressable
  isSkeleton
/>`}
            >
                <SurfaceCard.Pressable isSkeleton showAnatomy>
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
        ),
}

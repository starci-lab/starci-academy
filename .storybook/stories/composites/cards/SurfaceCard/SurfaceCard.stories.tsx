import type { Meta, StoryObj } from "@storybook/nextjs"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SurfaceCard` — the general wrapper frame of the card family. Owns the header section
 * (`SurfaceCardHeader`: label/labelEnd/see-more/action/subtleLabel), the `header`/`body`/`footer`
 * slot set, the `description` outside the card, and two independent frame axes `variant`
 * (`"surface" | "nested"`) and `padding`. Each slot is a component reference the frame calls
 * itself, so `isSkeleton` can reach inside it.
 */
const meta: Meta<typeof SurfaceCard> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCard",
    component: SurfaceCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard>

/**
 * The frame's ONE true DEP: `LinkSeeMore` — the frame builds it ITSELF when
 * `onSeeMore` is passed (the caller only supplies a handler + text), so it's a
 * component the frame rebuilds, and it's clickable through to its story.
 *
 * `action` is a component reference the caller supplies; the frame calls it with
 * `isSkeleton` but doesn't own what's inside it. `body` (`ProfileRow`) is the
 * same — it belongs to the caller, not a frame part.
 *
 * ⚠️ The key must match EXACTLY the `data-anat-part` string that
 * `surface-card-header.tsx` emits — forget this and the Deps link breaks SILENTLY.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "LinkSeeMore": {
        tier: "atom",
        role: "the see-more affordance, which SurfaceCardHeader builds from LinkSeeMore, sized to match the label",
        storyId: "atoms-navigation-link-linkseemore--default",
    },
}

/**
 * `description` renders through `RichText` (the frame owns scale/tone
 * for this caption), so the "Description" node it wraps gets a real
 * `storyId` to jump to.
 */
const DESCRIPTION_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "RichText": {
        tier: "composite",
        role: "the caption below Content, built by the frame from RichText (size body-xs, muted).",
        storyId: "composites-viewers-richtext--plain-text",
    },
}

/**
 * The standard fixture (C-fixture) = ProfileCard — built from THREE real ATOMS
 * (`Avatar` + two `Typography`), NOT raw HeroUI or a class-painted
 * `<span>`. Same mould `Section.stories` already uses.
 *
 * ⭐ Because it goes through atoms, `isSkeleton` just FLOWS ON DOWN into those
 * three atoms — no `ProfileRowSkeleton` copy to keep in sync anymore (§12c).
 * This is exactly why `body` takes a COMPONENT reference (COMPOSITE-8): the frame
 * calls `ProfileRow` itself with `isSkeleton`, and `ProfileRow` passes it on to
 * the atoms it composes.
 *
 * NOTE: `SurfaceCard` draws its own surface frame (`rounded-3xl bg-surface`
 * + shadow/border, §1a), so there's NO extra `Card` wrapper here — avoiding
 * card-in-card.
 */
/** Props for the `ProfileRow` fixture helper. */
interface ProfileRowProps {
    /** whether to render the shimmer state instead of the real content */
    isSkeleton?: boolean
}

const ProfileRow = ({ isSkeleton = false }: ProfileRowProps) => (
    <div data-tier="fixture" className="flex items-center gap-3">
        <Avatar name="StarCi Academy" size="md" isSkeleton={isSkeleton} classNames={["shrink-0"]} />
        <div className="flex min-w-0 grow flex-col">
            <Typography size="sm" weight="medium" truncate isSkeleton={isSkeleton} classNames={isSkeleton ? ["w-1/3"] : undefined} text="StarCi Academy" />
            <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} classNames={isSkeleton ? ["w-2/3"] : undefined} text="Learn fullstack, system design, and DevOps on an interview-prep track." />
        </div>
    </div>
)

/** Default — `body` is a component reference: a WRAPPER frame calls it itself and takes any content. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="Default"
                reason="The general bg-surface frame of the SurfaceCard namespace, with an OPTIONAL header section baked in. `body` is a component reference the frame calls itself; with no `header`/`footer` passed, the DOM is exactly one surface div around the content."
                states={[
                    {
                        name: "no label, header, or footer passed",
                        why: "The header section drops out entirely and the surface div wraps only the content. This is the bare shape a caller reaches for when the surrounding page already carries its own heading.",
                        code: `<SurfaceCard body={ProfileRow} />`,
                        render: <SurfaceCard body={ProfileRow} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Header slot fixture for {@link Slots} — a component reference (COMPOSITE-8), not a built node. */
const ProfileHeader = () => <Typography size="sm" weight="medium" text="Profile" />
/** Footer slot fixture for {@link Slots}. */
const ProfileFooter = () => <Button size="sm" variant="secondary" label="View profile" onPress={() => {}} />

/** NAMED slots — `header`/`body`/`footer` are the main path for the frame tier (Layouts). */
export const Slots: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="Slots"
                states={[
                    {
                        name: "header, body, and footer all passed",
                        why: "The frame builds a `flex flex-col gap-3` column carrying all three named slots, each a component reference the frame calls itself with `isSkeleton` (COMPOSITE-8) — a caller that needs an explicit footer reaches for the named slots.",
                        code: `<SurfaceCard
  header={ProfileHeader}
  body={ProfileRow}
  footer={ProfileFooter}
/>`,
                        render: (
                            <SurfaceCard
                               
                                header={ProfileHeader}
                                body={ProfileRow}
                                footer={ProfileFooter}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

export const WithLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="WithLabel"
                states={[
                    {
                        name: "label passed",
                        why: "`label` turns on SurfaceCardHeader above the surface frame, gap-3 between the two. This is how a card earns its own heading without the caller hand-rolling a title row.",
                        code: `<SurfaceCard label="My courses" body={ProfileRow} />`,
                        render: <SurfaceCard label="My courses" body={ProfileRow} />,
                    },
                ]}
            />
        </div>
    ),
}

export const SeeMore: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="SeeMore"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "onSeeMore passed",
                        why: "SurfaceCardHeader renders a `LinkSeeMore` in place of `labelEnd`, still inside the same single header node. The frame builds that atom itself rather than taking it from the caller, so it shows up under Deps; `action` would not, because that component is supplied by the caller.",
                        code: `<SurfaceCard label="Featured courses" onSeeMore={() => {}} body={ProfileRow} />`,
                        render: <SurfaceCard label="Featured courses" onSeeMore={() => {}} body={ProfileRow} />,
                    },
                ]}
            />
        </div>
    ),
}

export const LabelEnd: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="LabelEnd"
                states={[
                    {
                        name: "labelEnd passed",
                        why: "`labelEnd` renders a muted tag to the right of the label, in the same header node. This is for a unit or a count that belongs next to the label, not an action a viewer could press.",
                        code: `<SurfaceCard label="Remaining tuition" labelEnd="VND" body={ProfileRow} />`,
                        render: <SurfaceCard label="Remaining tuition" labelEnd="VND" body={ProfileRow} />,
                    },
                ]}
            />
        </div>
    ),
}

/** `action` slot fixture for {@link WithAction} — a component reference (COMPOSITE-8), not a built node. */
const ManageAction = () => <Button variant="secondary" size="sm" label="Manage" onPress={() => {}} />

export const WithAction: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="WithAction"
                states={[
                    {
                        name: "action passed",
                        why: "`action` wins over `onSeeMore` and `labelEnd`, filling the same right-hand slot of SurfaceCardHeader. This is for a card that needs a real control next to its label, such as a button that manages a setting shown below.",
                        code: `<SurfaceCard
  label="Payment method"
  action={ManageAction}
  body={ProfileRow}
/>`,
                        render: (
                            <SurfaceCard
                                label="Payment method"
                                action={ManageAction}
                               
                                body={ProfileRow}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

export const SubtleLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            {/* subtleLabel = a MINOR header (eyebrow) over a block, sitting UNDER a
                primary section Label — e.g. time-buckets under "Practice log". */}
            <div className="flex flex-col gap-3">
                <Typography size="sm" weight="medium" text="Practice log" />
                <BlockAnatomy
                    name="SurfaceCard"
                    tier="composite"
                    leaf="SubtleLabel"
                    states={[
                        {
                            name: "subtleLabel = true",
                            why: "The label switches from a bold Label to a muted text-xs eyebrow, with the gap under it tightening from 3 to 2 — still the same single header node. This is for a card sitting under a primary section label, where a second bold heading would compete with it.",
                            code: `<SurfaceCard label="Today" subtleLabel body={ProfileRow} />`,
                            render: <SurfaceCard label="Today" subtleLabel body={ProfileRow} />,
                        },
                    ]}
                />
                <SurfaceCard label="Yesterday" subtleLabel body={ProfileRow} />
                <SurfaceCard label="Last week" subtleLabel body={ProfileRow} />
            </div>
        </div>
    ),
}

export const Description: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="Description"
                annotate={DESCRIPTION_ANNOTATE}
                states={[
                    {
                        name: "description passed",
                        why: "`description` renders below Content, outside the surface frame, gap-2 under it. This is for a caption or a prompt that explains the card, not chrome that belongs inside Content.",
                        code: `<SurfaceCard
  label="Weekly quest"
  description="Complete all three to earn the reward."
  body={ProfileRow}
/>`,
                        render: (
                            <SurfaceCard
                                label="Weekly quest"
                                description="Complete all three to earn the reward."
                               
                                body={ProfileRow}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * `variant` — the first INDEPENDENT axis: `"surface"` (default) carries its
 * own background + shadow when sitting DIRECTLY on `bg-background`; `"nested"`
 * switches to a border when this surface sits INSIDE another parent surface (the
 * shadow becomes nearly invisible stacked on the parent's shadow, especially in
 * dark mode).
 *
 * The `variant="surface"` reference card beside the panel is a plain sibling, not
 * a state of this leaf: only ONE render sits inside `BlockAnatomy` here, so this
 * leaf carries exactly one state.
 */
export const Variant: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-wrap items-start gap-6 p-8">
            <div className="w-72">
                <SurfaceCard label="Questions" variant="surface" body={ProfileRow} />
            </div>
            <div className="w-72 rounded-3xl bg-surface p-3 shadow-surface">
                <BlockAnatomy
                    name="SurfaceCard"
                    tier="composite"
                    leaf="Variant"
                    states={[
                        {
                            name: "variant = \"nested\"",
                            why: "Content switches from a shadow to a border (surface-in-surface, §1a), because a shadow stacked on a parent surface's own shadow is nearly invisible. The card at the left shows the default `variant=\"surface\"` for comparison — same composition, only the edge treatment differs.",
                            code: `<SurfaceCard label="Questions" variant="nested" body={ProfileRow} />`,
                            render: (
                                <SurfaceCard label="Questions" variant="nested" body={ProfileRow} />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}

/**
 * `padding` — the second INDEPENDENT axis, the `AllowedPadding` step scale. Default
 * step `4` is the standard inset around the content; `padding={1}` drops the inset
 * (still keeps `overflow-hidden`) so a child can OWN its own edge (a cover image, a
 * full-bleed table) flush to the border.
 *
 * An axis INDEPENDENT of `variant` — a
 * `nested` card AND `padding={1}` is a real combination (an edge-to-edge image
 * inside a nested card); merging them would kill that combination.
 *
 * Same shape as `Variant`: only `padding={1}` sits inside `BlockAnatomy`, the
 * `padding={4}` card at the left is a plain reference sibling.
 */
/** `body` fixture for {@link Padding} — a bleed-edge cover image above the row, owning its own inset. */
const BleedEdgeBody = () => (
    <>
        <div className="h-28 w-full bg-accent-soft" aria-hidden />
        <div className="p-3"><ProfileRow /></div>
    </>
)

export const Padding: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-wrap items-start gap-6 p-8">
            <div className="w-72">
                <SurfaceCard label="Featured course" padding={4} body={ProfileRow} />
            </div>
            <div className="w-72">
                <BlockAnatomy
                    name="SurfaceCard"
                    tier="composite"
                    leaf="Padding"
                    states={[
                        {
                            name: "padding = 1",
                            why: "The card drops its `p-3` inset and turns on `overflow-hidden`, so a child now owns its own padding and its edges follow the frame's own corners. The card at the left shows the default step `4` inset for comparison, the standard card interior.",
                            code: `<SurfaceCard label="Featured course" padding={1} body={BleedEdgeBody} />`,
                            render: (
                                <SurfaceCard label="Featured course" padding={1} body={BleedEdgeBody} />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — renders the full `false · true` union side by side,
 * following the same mould as `Variant`/`Padding` (a leaf named AFTER THE PROP,
 * not after a scenario).
 *
 * ⭐ The flag reaches what the FRAME OWNS directly (`label` on the header,
 * `description` below the card) AND every slot it renders — `body` is a
 * component reference (COMPOSITE-8), so the frame calls `ProfileRow` itself
 * WITH `isSkeleton`, and `ProfileRow` forwards it straight to `Avatar` + two
 * `Typography`. No second skeleton tree to keep in sync (§12c).
 *
 * Only the skeleton card sits inside `BlockAnatomy`; the plain card at the left
 * is a reference sibling, so this leaf carries exactly one state.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="grid gap-6 p-8 md:grid-cols-2">
            <SurfaceCard label="My courses" description="Three left to finish this month." body={ProfileRow} />
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every line keeps its real box, the label at `sm`, the caption at `xs`, and the row's own two lines, so nothing shifts once the data lands (§8). The frame owns the label and the caption bars, and calls `body` with `isSkeleton` so the row shimmers its own two bars too.",
                        code: `<SurfaceCard isSkeleton label="My courses" description={…} body={ProfileRow} />`,
                        render: (
                            <SurfaceCard
                                isSkeleton
                               
                                label="My courses"
                                description="Three left to finish this month."
                                body={ProfileRow}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * PRESSABLE STATES — `onPress`/`href` fold the WHOLE card into a `<button>`/`<a>`
 * with ripple + `active:scale-[0.97]` feedback, no hover effect at rest.
 * `isSelected`/`isDisabled`/`actions` only mean anything once the card IS
 * pressable, so they live here, not beside `Default`.
 */
export const Pressable: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="Pressable"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "onPress set, no actions/href",
                        why: "The card mounts as a single `<button>` where the whole tile is the press target, and `ProfileRow`'s own text becomes its accessible label — the plain navigation-tile shape for when the entire card leads to one action.",
                        code: `<SurfaceCard onPress={() => {}} body={ProfileRow} />`,
                        render: (
                            <SurfaceCard onPress={() => {}} body={ProfileRow} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `href` — the whole card is ONE a11y link (navigates on click) instead of a button. */
export const PressableAsLink: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="PressableAsLink"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "href set instead of onPress",
                        why: "The card mounts an `<a>` in place of the `<button>`, keeping the exact same single Content shape as `Pressable`. A caller that only has a destination URL, not a click handler, needs the card to behave as a real navigation link.",
                        code: `<SurfaceCard href="#" body={ProfileRow} />`,
                        render: (
                            <SurfaceCard href="#" body={ProfileRow} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * `actions` + `ariaLabel` — a second, independent press area INSIDE the card
 * (stretched-link): a transparent whole-card press overlay sits underneath, the
 * CTA + menu sit above it so they stay separately pressable. TypeScript forces
 * `ariaLabel` to become REQUIRED as soon as `actions` is present.
 */
export const PressableWithActions: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="PressableWithActions"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "actions + ariaLabel set",
                        why: "The card gains a transparent whole-card overlay press target underneath the content, plus a separate Actions node stacked above it so the CTA and the overflow menu stay independently clickable — the stretched-link shape a card needs once it must hold its own buttons.",
                        code: `<SurfaceCard
  onPress={() => {}}
  ariaLabel="Open the StarCi Academy profile"
  actions={
    <>
      <Button size="sm" variant="ghost" label="Continue" onPress={() => {}} />
    </>
  }
  body={ProfileRow}
/>`,
                        render: (
                            <SurfaceCard
                                onPress={() => {}}
                                ariaLabel="Open the StarCi Academy profile"
                               
                                actions={(
                                    <Button size="sm" variant="ghost" label="Continue" onPress={() => {}} />
                                )}
                                body={ProfileRow}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `isSelected` — a SELECTED tile in a selection grid: an accent ring around the card. */
export const PressableSelected: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="PressableSelected"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "isSelected = true",
                        why: "The card keeps the exact same Content node as `Pressable` and only gains a `ring-2 ring-accent` outline plus `aria-pressed`/`aria-current` — a selection grid needs a way to show which tile is chosen without changing what the tile contains.",
                        code: `<SurfaceCard isSelected onPress={() => {}} body={ProfileRow} />`,
                        render: (
                            <SurfaceCard isSelected onPress={() => {}} body={ProfileRow} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `isDisabled` — a pressable option that's temporarily unavailable: dims + disables interaction, STILL shown. */
export const PressableDisabled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="PressableDisabled"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "isDisabled = true (onPress set)",
                        why: "Nothing mounts or unmounts — the same Content node renders, just dimmed, and the ripple/press-scale feedback stops firing. The option has to stay visible so the reader still knows it exists, even though it can't be chosen right now.",
                        code: `<SurfaceCard isDisabled onPress={() => {}} body={ProfileRow} />`,
                        render: (
                            <SurfaceCard isDisabled onPress={() => {}} body={ProfileRow} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Loading, PRESSABLE shape — `isSkeleton` (with `onPress`/`href` also set) NEVER
 * renders pressable while loading: `isPressable` derives to `false`, so the card
 * falls to the plain (non-interactive) branch and calls `body` with `isSkeleton`,
 * same as the plain `Skeleton` leaf above — nothing underneath can be pressed yet.
 */
export const PressableLoading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="PressableLoading"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "isSkeleton = true, onPress set",
                        why: "The card renders as a plain (non-interactive) div — `isPressable` is forced `false` while loading — and calls `body` with `isSkeleton`, so `ProfileRow` shimmers its own two bars. Nothing underneath can be pressed yet, so the ripple/press-scale shell doesn't mount either.",
                        code: "<SurfaceCard isSkeleton onPress={() => {}} body={ProfileRow} />",
                        render: (
                            <SurfaceCard isSkeleton onPress={() => {}} body={ProfileRow} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

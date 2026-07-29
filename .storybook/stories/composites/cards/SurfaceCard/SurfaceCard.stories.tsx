import type { Meta, StoryObj } from "@storybook/nextjs"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher's call, 2026-07-25): `SurfaceCard` is the general
 * WRAPPER FRAME of the card family — it OWNS the header section (`SurfaceCardHeader`:
 * label/labelEnd/see-more/action/subtleLabel), the `header`/`body`/`footer` slot set
 * (+ `children` = body shorthand), the `description` outside the card, and TWO
 * independent frame axes `variant`/`padding`.
 *
 * Because the HEADER and SLOTS are this wrapper frame's own property, ALL their state
 * lives here; `.List`/`.Accordion` (which also take `SurfaceLabelProps`) keep only ONE
 * `WithLabel` leaf to prove the header can turn on, NOT the whole set repeated.
 *
 * 2026-07-26 (teacher, THREE INDEPENDENT AXES): `bordered?: boolean` → `variant?: SurfaceCardVariant`
 * (`"surface" | "nested"`), `flushContent?: boolean` → `padding?: InsetScale`. The two
 * old single-value leaves (`Bordered`, `FlushContent`) merged into two leaves named
 * AFTER THE PROP (`Variant`, `Padding`), each leaf rendering the full union side by
 * side instead of just the value that differs from the default.
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
 * `action` is NOT one: that's a node the caller supplies, the frame doesn't own
 * what's inside it. The content in `children` (ProfileRow) is the same — it
 * belongs to the caller, not a frame part.
 *
 * ⚠️ The key must match EXACTLY the `data-anat-part` string that
 * `surface-card-header.tsx` emits.
 * 2026-07-26: the atom changed from `SeeMoreLink.Base` to the `LinkSeeMore`
 * member (namespaced under the HeroUI `Link` family) ⇒ `storyId` changed with
 * it — forget this and the Deps link breaks SILENTLY.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "LinkSeeMore": {
        tier: "atom",
        role: "the see-more affordance, which SurfaceCardHeader builds from LinkSeeMore, sized to match the label",
        storyId: "atoms-navigation-link-linkseemore--default",
    },
}

/**
 * `description` renders through `Typography` itself (§4 — the frame owns
 * scale/tone for this caption), so the "Description" node it wraps gets a real
 * `storyId` to jump to.
 */
const DESCRIPTION_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": {
        tier: "atom",
        role: "the caption below Content, built by the frame from Typography (size xs, muted).",
        storyId: "atoms-text-typography-typography--plain",
    },
}

/**
 * The standard fixture (C-fixture) = ProfileCard — built from THREE real ATOMS
 * (`Avatar` + two `Typography`), NOT raw HeroUI or a class-painted
 * `<span>`. Same mould `Section.stories` already uses.
 *
 * ⭐ Because it goes through atoms, `isSkeleton` just FLOWS ON DOWN into those
 * three atoms — no `ProfileRowSkeleton` copy to keep in sync anymore (§12c).
 * This is exactly the caller's job when a frame takes `children`: the frame
 * doesn't know the content, so whoever builds the content passes the flag on.
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
    <div className="flex items-center gap-3">
        <Avatar name="StarCi Academy" size="md" isSkeleton={isSkeleton} className="shrink-0" />
        <div className="flex min-w-0 grow flex-col">
            <Typography size="sm" weight="medium" truncate isSkeleton={isSkeleton} className={isSkeleton ? "w-1/3" : undefined} text="StarCi Academy" />
            <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} className={isSkeleton ? "w-2/3" : undefined} text="Learn fullstack, system design, and DevOps on an interview-prep track." />
        </div>
    </div>
)

/** Default — `children` is the shorthand for `body`: a WRAPPER frame takes any content. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="Default"
                reason="The general bg-surface frame of the SurfaceCard namespace, with an OPTIONAL header section baked in. It is a WRAPPER frame, so `children` stays open as the shorthand for `body`; with no `header`/`footer` passed, the DOM is exactly one surface div around the content."
                states={[
                    {
                        name: "no label, header, or footer passed",
                        why: "The header section drops out entirely and the surface div wraps only the content. This is the bare shape a caller reaches for when the surrounding page already carries its own heading.",
                        code: `<SurfaceCard>
  <ProfileRow />
</SurfaceCard>`,
                        render: <SurfaceCard showAnatomy><ProfileRow /></SurfaceCard>,
                    },
                ]}
            />
        </div>
    ),
}

/** NAMED slots — `header`/`body`/`footer` are the main path for the frame tier (Layouts). */
export const Slots: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="Slots"
                states={[
                    {
                        name: "header, body, and footer all passed",
                        why: "The frame builds a `flex flex-col gap-3` column carrying all three named slots instead of the single `children` body. `body` wins over `children` when both are passed, so a caller that needs an explicit footer reaches for the named slots.",
                        code: `<SurfaceCard
  header={<Typography size="sm" weight="medium" text="Profile" />}
  body={<ProfileRow />}
  footer={<Button size="sm" variant="secondary" label="View profile" onPress={() => {}} />}
/>`,
                        render: (
                            <SurfaceCard
                                showAnatomy
                                header={<Typography size="sm" weight="medium" text="Profile" />}
                                body={<ProfileRow />}
                                footer={<Button size="sm" variant="secondary" label="View profile" onPress={() => {}} />}
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
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="WithLabel"
                states={[
                    {
                        name: "label passed",
                        why: "`label` turns on SurfaceCardHeader above the surface frame, gap-3 between the two. This is how a card earns its own heading without the caller hand-rolling a title row.",
                        code: `<SurfaceCard label="My courses">
  <ProfileRow />
</SurfaceCard>`,
                        render: <SurfaceCard label="My courses" showAnatomy><ProfileRow /></SurfaceCard>,
                    },
                ]}
            />
        </div>
    ),
}

export const SeeMore: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="SeeMore"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "onSeeMore passed",
                        why: "SurfaceCardHeader renders a `LinkSeeMore` in place of `labelEnd`, still inside the same single header node. The frame builds that atom itself rather than taking it from the caller, so it shows up under Deps; `action` would not, because that node always comes from the caller.",
                        code: `<SurfaceCard label="Featured courses" onSeeMore={() => {}}>
  <ProfileRow />
</SurfaceCard>`,
                        render: <SurfaceCard label="Featured courses" onSeeMore={() => {}} showAnatomy><ProfileRow /></SurfaceCard>,
                    },
                ]}
            />
        </div>
    ),
}

export const LabelEnd: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="LabelEnd"
                states={[
                    {
                        name: "labelEnd passed",
                        why: "`labelEnd` renders a muted tag to the right of the label, in the same header node. This is for a unit or a count that belongs next to the label, not an action a viewer could press.",
                        code: `<SurfaceCard label="Remaining tuition" labelEnd="VND">
  <ProfileRow />
</SurfaceCard>`,
                        render: <SurfaceCard label="Remaining tuition" labelEnd="VND" showAnatomy><ProfileRow /></SurfaceCard>,
                    },
                ]}
            />
        </div>
    ),
}

export const WithAction: Story = {
    render: () => (
        <div className="p-8">
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
  action={<Button variant="secondary" size="sm" label="Manage" onPress={() => {}} />}
>
  <ProfileRow />
</SurfaceCard>`,
                        render: (
                            <SurfaceCard
                                label="Payment method"
                                action={<Button variant="secondary" size="sm" label="Manage" onPress={() => {}} />}
                                showAnatomy
                            >
                                <ProfileRow />
                            </SurfaceCard>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

export const SubtleLabel: Story = {
    render: () => (
        <div className="p-8">
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
                            code: `<SurfaceCard label="Today" subtleLabel>
  <ProfileRow />
</SurfaceCard>`,
                            render: <SurfaceCard label="Today" subtleLabel showAnatomy><ProfileRow /></SurfaceCard>,
                        },
                    ]}
                />
                <SurfaceCard label="Yesterday" subtleLabel><ProfileRow /></SurfaceCard>
                <SurfaceCard label="Last week" subtleLabel><ProfileRow /></SurfaceCard>
            </div>
        </div>
    ),
}

export const Description: Story = {
    render: () => (
        <div className="p-8">
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
>
  <ProfileRow />
</SurfaceCard>`,
                        render: (
                            <SurfaceCard
                                label="Weekly quest"
                                description="Complete all three to earn the reward."
                                showAnatomy
                            >
                                <ProfileRow />
                            </SurfaceCard>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * `variant` — the first INDEPENDENT axis (§1a): `"surface"` (default) carries its
 * own background + shadow when sitting DIRECTLY on `bg-background`; `"nested"`
 * switches to a border when this surface sits INSIDE another parent surface (the
 * shadow becomes nearly invisible stacked on the parent's shadow, especially in
 * dark mode). Merged from two old single-value leaves (`Default` implying
 * `surface`, `Bordered`) into ONE `Variant` leaf rendering both values side by
 * side.
 *
 * 2026-07-26 (teacher): changed from `bordered?: boolean` (`bordered=true` → `variant="nested"`).
 *
 * The `variant="surface"` reference card beside the panel is a plain sibling, not
 * a state of this leaf: only ONE render sits inside `BlockAnatomy` here, so this
 * leaf carries exactly one state.
 */
export const Variant: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-6 p-8">
            <div className="w-72">
                <SurfaceCard label="Questions" variant="surface">
                    <ProfileRow />
                </SurfaceCard>
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
                            code: `<SurfaceCard label="Questions" variant="nested">
  <ProfileRow />
</SurfaceCard>`,
                            render: (
                                <SurfaceCard label="Questions" variant="nested" showAnatomy>
                                    <ProfileRow />
                                </SurfaceCard>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}

/**
 * `padding` — the second INDEPENDENT axis, the §10c scale. Default `3` is the
 * standard inset around the content; `padding="flush"` drops the inset (still keeps
 * `overflow-hidden`) so a child can OWN its own edge (a cover image, a
 * full-bleed table) flush to the border. Merged from two old single-value
 * leaves (`Default` implying `3`, `FlushContent`) into ONE `Padding` leaf
 * rendering both side by side.
 *
 * 2026-07-26 (teacher): changed from `flushContent?: boolean`
 * (`flushContent=true` → `padding="flush"`). An axis INDEPENDENT of `variant` — a
 * `nested` card AND `padding="flush"` is a real combination (an edge-to-edge image
 * inside a nested card); merging them would kill that combination.
 *
 * Same shape as `Variant`: only `padding="flush"` sits inside `BlockAnatomy`, the
 * `padding="cozy"` card at the left is a plain reference sibling.
 */
export const Padding: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-6 p-8">
            <div className="w-72">
                <SurfaceCard label="Featured course" padding="cozy">
                    <ProfileRow />
                </SurfaceCard>
            </div>
            <div className="w-72">
                <BlockAnatomy
                    name="SurfaceCard"
                    tier="composite"
                    leaf="Padding"
                    states={[
                        {
                            name: "padding = flush",
                            why: "The card drops its `p-3` inset and turns on `overflow-hidden`, so a child now owns its own padding and its edges follow the frame's own corners. The card at the left shows the default cozy inset for comparison, the standard card interior.",
                            code: `<SurfaceCard label="Featured course" padding="flush">
  <div className="h-28 bg-accent-soft" />
  <div className="p-3"><ProfileRow /></div>
</SurfaceCard>`,
                            render: (
                                <SurfaceCard label="Featured course" padding="flush" showAnatomy>
                                    <div className="h-28 w-full bg-accent-soft" aria-hidden />
                                    <div className="p-3"><ProfileRow /></div>
                                </SurfaceCard>
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
 * ⭐ The flag only reaches what the FRAME OWNS: `label` on the header and
 * `description` below the card. `children` belongs to the caller, so the caller
 * forwards the flag down — here that's `ProfileRow`, which is built from three
 * atoms so the flag flows straight to `Avatar` + two `Typography`. No
 * second skeleton tree to keep in sync (§12c).
 *
 * Only the skeleton card sits inside `BlockAnatomy`; the plain card at the left
 * is a reference sibling, so this leaf carries exactly one state.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="grid gap-6 p-8 md:grid-cols-2">
            <SurfaceCard label="My courses" description="Three left to finish this month.">
                <ProfileRow />
            </SurfaceCard>
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every line keeps its real box, the label at `sm`, the caption at `xs`, and the row's own two lines, so nothing shifts once the data lands (§8). The frame owns the label and the caption bars; `ProfileRow` owns its own two bars because the flag is forwarded down as a prop.",
                        code: `<SurfaceCard isSkeleton label="My courses" description={…}>
  <ProfileRow isSkeleton />
</SurfaceCard>`,
                        render: (
                            <SurfaceCard
                                isSkeleton
                                showAnatomy
                                label="My courses"
                                description="Three left to finish this month."
                            >
                                <ProfileRow isSkeleton />
                            </SurfaceCard>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * ⭐ PRESSABLE STATES (thầy 2026-07-29, "sao còn .Pressable, thành isPressable là
 * prop hết rồi mà?") — `onPress`/`href` fold the WHOLE card into a `<button>`/`<a>`
 * with ripple + `active:scale-[0.97]` feedback, no hover effect at rest. Was a
 * separate component/story, `SurfaceCard.Pressable`, before this merge — same
 * card, same fixture, one fewer name to import. `isSelected`/`isDisabled`/
 * `actions` only mean anything once the card IS pressable, so they live here,
 * not beside `Default`.
 */
export const Pressable: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="Pressable"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "onPress set, no actions/href",
                        why: "The card mounts as a single `<button>` where the whole tile is the press target, and `ProfileRow`'s own text becomes its accessible label — the plain navigation-tile shape for when the entire card leads to one action.",
                        code: `<SurfaceCard onPress={() => {}}>
  <ProfileRow />
</SurfaceCard>`,
                        render: (
                            <SurfaceCard onPress={() => {}} showAnatomy>
                                <ProfileRow />
                            </SurfaceCard>
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
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="PressableAsLink"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "href set instead of onPress",
                        why: "The card mounts an `<a>` in place of the `<button>`, keeping the exact same single Content shape as `Pressable`. A caller that only has a destination URL, not a click handler, needs the card to behave as a real navigation link.",
                        code: `<SurfaceCard href="#">
  <ProfileRow />
</SurfaceCard>`,
                        render: (
                            <SurfaceCard href="#" showAnatomy>
                                <ProfileRow />
                            </SurfaceCard>
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
        <div className="p-8">
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
>
  <ProfileRow />
</SurfaceCard>`,
                        render: (
                            <SurfaceCard
                                onPress={() => {}}
                                ariaLabel="Open the StarCi Academy profile"
                                showAnatomy
                                actions={(
                                    <Button size="sm" variant="ghost" label="Continue" onPress={() => {}} />
                                )}
                            >
                                <ProfileRow />
                            </SurfaceCard>
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
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="PressableSelected"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "isSelected = true",
                        why: "The card keeps the exact same Content node as `Pressable` and only gains a `ring-2 ring-accent` outline plus `aria-pressed`/`aria-current` — a selection grid needs a way to show which tile is chosen without changing what the tile contains.",
                        code: `<SurfaceCard isSelected onPress={() => {}}>
  <ProfileRow />
</SurfaceCard>`,
                        render: (
                            <SurfaceCard isSelected onPress={() => {}} showAnatomy>
                                <ProfileRow />
                            </SurfaceCard>
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
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="PressableDisabled"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "isDisabled = true (onPress set)",
                        why: "Nothing mounts or unmounts — the same Content node renders, just dimmed, and the ripple/press-scale feedback stops firing. The option has to stay visible so the reader still knows it exists, even though it can't be chosen right now.",
                        code: `<SurfaceCard isDisabled onPress={() => {}}>
  <ProfileRow />
</SurfaceCard>`,
                        render: (
                            <SurfaceCard isDisabled onPress={() => {}} showAnatomy>
                                <ProfileRow />
                            </SurfaceCard>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Loading, PRESSABLE shape — `isSkeleton` (with `onPress`/`href` also set) draws a
 * FIXED generic mirror (icon block + 2 text lines) INSTEAD of `children`, unlike
 * the plain `Skeleton` leaf above where the frame only shimmers what it owns and
 * `children` flows its own `isSkeleton` through. The two mean different things by
 * design (§ file header note in `SurfaceCard.tsx`) — a pressable tile's shape
 * isn't known yet when loading starts, a plain card's content usually is.
 */
export const PressableLoading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard"
                tier="composite"
                leaf="PressableLoading"
                renderClassName="max-w-md"
                states={[
                    {
                        name: "isSkeleton = true, onPress set",
                        why: "The entire Content node is replaced by a fixed shimmer mirror — an icon-shaped tile plus two text bars — instead of whatever `children` would eventually hold. The mirror doesn't depend on the real content's shape, so a caller can flip the flag on before it even knows what will load.",
                        code: "<SurfaceCard isSkeleton onPress={() => {}} />",
                        render: (
                            <SurfaceCard isSkeleton onPress={() => {}} showAnatomy>
                                <ProfileRow />
                            </SurfaceCard>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

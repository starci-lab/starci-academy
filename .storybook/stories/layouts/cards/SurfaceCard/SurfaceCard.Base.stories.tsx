import type { Meta, StoryObj } from "@storybook/nextjs"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { Avatar as AtomAvatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button as AtomButton } from "@sb-components/atoms/buttons/Button/Button"
import { Typography as AtomTypography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher's call, 2026-07-25): `SurfaceCard.Base` is the general
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
 * (`"surface" | "nested"`), `flushContent?: boolean` → `padding?: SpaceScale`. The two
 * old single-value leaves (`Bordered`, `FlushContent`) merged into two leaves named
 * AFTER THE PROP (`Variant`, `Padding`), each leaf rendering the full union side by
 * side instead of just the value that differs from the default.
 */
const meta: Meta<typeof SurfaceCard.Base> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.Base",
    component: SurfaceCard.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Base>

/**
 * The frame's ONE true DEP: `Link.SeeMore` — the frame builds it ITSELF when
 * `onSeeMore` is passed (the caller only supplies a handler + text), so it's a
 * component the frame rebuilds, and it's clickable through to its story.
 *
 * `action` is NOT one: that's a node the caller supplies, the frame doesn't own
 * what's inside it. The content in `children` (ProfileRow) is the same — it
 * belongs to the caller, not a frame part.
 *
 * ⚠️ The key must match EXACTLY the `data-anat-part` string that
 * `surface-card-header.tsx` emits.
 * 2026-07-26: the atom changed from `SeeMoreLink.Base` to the `Link.SeeMore`
 * member (namespaced under the HeroUI `Link` family) ⇒ `storyId` changed with
 * it — forget this and the Deps link breaks SILENTLY.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Link.SeeMore": {
        tier: "atom",
        role: "the see-more affordance — SurfaceCardHeader builds it from `Link.SeeMore`, sized to match the label",
        storyId: "atoms-navigation-link-link-seemore--default",
    },
}

/**
 * The standard fixture (C-fixture) = ProfileCard — built from THREE real ATOMS
 * (`Avatar.Base` + two `Typography.Base`), NOT raw HeroUI or a class-painted
 * `<span>`. Same mould `Section.Base.stories` already uses.
 *
 * ⭐ Because it goes through atoms, `isSkeleton` just FLOWS ON DOWN into those
 * three atoms — no `ProfileRowSkeleton` copy to keep in sync anymore (§12c).
 * This is exactly the caller's job when a frame takes `children`: the frame
 * doesn't know the content, so whoever builds the content passes the flag on.
 *
 * NOTE: `SurfaceCard.Base` draws its own surface frame (`rounded-3xl bg-surface`
 * + shadow/border, §1a), so there's NO extra `Card` wrapper here — avoiding
 * card-in-card.
 */
const ProfileRow = ({ isSkeleton = false }: { isSkeleton?: boolean }) => (
    <div className="flex items-center gap-3">
        <AtomAvatar.Base name="StarCi Academy" size="md" isSkeleton={isSkeleton} className="shrink-0" />
        <div className="flex min-w-0 grow flex-col">
            <AtomTypography.Base size="sm" weight="medium" truncate isSkeleton={isSkeleton} className={isSkeleton ? "w-1/3" : undefined} text="StarCi Academy" />
            <AtomTypography.Base size="xs" color="muted" truncate isSkeleton={isSkeleton} className={isSkeleton ? "w-2/3" : undefined} text="Learn fullstack, system design, and DevOps on an interview-prep track." />
        </div>
    </div>
)

/** Default — `children` is the shorthand for `body`: a WRAPPER frame takes any content. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="Default"
                reason="The general bg-surface frame of the SurfaceCard namespace, with an OPTIONAL header section baked in — drop `label` and it renders bare. It is a WRAPPER frame, so `children` stays open (the shorthand for `body`); with no `header` or `footer` the DOM is exactly one surface div around the content."
                code={`<SurfaceCard.Base>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base showAnatomy><ProfileRow /></SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

/** NAMED slots — `header`/`body`/`footer` are the main path for the frame tier (Layouts). */
export const Slots: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="Slots"
                note="With `header` or `footer` the frame builds a `flex flex-col gap-3` column carrying all three slots. `body` wins over `children` when both are passed."
                code={`<SurfaceCard.Base
  header={<AtomTypography.Base size="sm" weight="medium" text="Profile" />}
  body={<ProfileRow />}
  footer={<AtomButton.Base size="sm" variant="secondary" label="View profile" onPress={() => {}} />}
/>`}
            >
                <SurfaceCard.Base
                    showAnatomy
                    header={<AtomTypography.Base size="sm" weight="medium" text="Profile" />}
                    body={<ProfileRow />}
                    footer={<AtomButton.Base size="sm" variant="secondary" label="View profile" onPress={() => {}} />}
                />
            </BlockAnatomy>
        </div>
    ),
}

export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="WithLabel"
                note="`label` turns on SurfaceCardHeader OUTSIDE (above) the surface frame, gap-3."
                code={`<SurfaceCard.Base label="My courses">
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="My courses" showAnatomy><ProfileRow /></SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

export const SeeMore: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="SeeMore"
                annotate={ANNOTATE}
                note="`onSeeMore` makes SurfaceCardHeader render a `Link.SeeMore` in place of `labelEnd` — still the same single header node. The frame builds that atom itself, so it shows up under **Deps**; `action` would not, because that node comes from the caller."
                code={`<SurfaceCard.Base label="Featured courses" onSeeMore={() => {}}>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="Featured courses" onSeeMore={() => {}} showAnatomy><ProfileRow /></SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

export const LabelEnd: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="LabelEnd"
                note="`labelEnd` is a muted tag on the right (a unit or a count), not an action."
                code={`<SurfaceCard.Base label="Remaining tuition" labelEnd="VND">
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base label="Remaining tuition" labelEnd="VND" showAnatomy><ProfileRow /></SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="WithAction"
                note="`action` wins over `onSeeMore` and `labelEnd` — still the same right-hand slot of SurfaceCardHeader."
                code={`<SurfaceCard.Base
  label="Payment method"
  action={<AtomButton.Base variant="secondary" size="sm" label="Manage" onPress={() => {}} />}
>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base
                    label="Payment method"
                    action={<AtomButton.Base variant="secondary" size="sm" label="Manage" onPress={() => {}} />}
                    showAnatomy
                >
                    <ProfileRow />
                </SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

export const SubtleLabel: Story = {
    render: () => (
        <div className="p-8">
            {/* subtleLabel = a MINOR header (eyebrow) over a block, sitting UNDER a
                primary section Label — e.g. time-buckets under "Practice log". */}
            <div className="flex flex-col gap-3">
                <AtomTypography.Base size="sm" weight="medium" text="Practice log" />
                <BlockAnatomy
                    name="SurfaceCard.Base"
                    tier="primitive"
                    leaf="SubtleLabel"
                    note="`subtleLabel` makes SurfaceCardHeader render the label as a muted text-xs eyebrow instead of a bold Label, gap-2 instead of gap-3 — same node."
                    code={`<SurfaceCard.Base label="Today" subtleLabel>
  <ProfileRow />
</SurfaceCard.Base>`}
                >
                    <SurfaceCard.Base label="Today" subtleLabel showAnatomy><ProfileRow /></SurfaceCard.Base>
                </BlockAnatomy>
                <SurfaceCard.Base label="Yesterday" subtleLabel><ProfileRow /></SurfaceCard.Base>
                <SurfaceCard.Base label="Last week" subtleLabel><ProfileRow /></SurfaceCard.Base>
            </div>
        </div>
    ),
}

export const Description: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="Description"
                note="`description` renders OUTSIDE (below) Content, gap-2 — a caption or prompt, not chrome that belongs to Content."
                code={`<SurfaceCard.Base
  label="Weekly quest"
  description="Complete all three to earn the reward."
>
  <ProfileRow />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base
                    label="Weekly quest"
                    description="Complete all three to earn the reward."
                    showAnatomy
                >
                    <ProfileRow />
                </SurfaceCard.Base>
            </BlockAnatomy>
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
 */
export const Variant: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-6 p-8">
            <div className="w-72">
                <SurfaceCard.Base label="Questions" variant="surface">
                    <ProfileRow />
                </SurfaceCard.Base>
            </div>
            <div className="w-72 rounded-3xl bg-surface p-3 shadow-surface">
                <BlockAnatomy
                    name="SurfaceCard.Base"
                    tier="primitive"
                    leaf="Variant"
                    note={"`variant=\"nested\"` (right, inside a bg-surface parent) switches Content to a border instead of a shadow (surface-in-surface, §1a); `variant=\"surface\"` (left, the default) keeps its own shadow when it sits directly on the background — the composition is identical."}
                    code={`<SurfaceCard.Base label="Questions" variant="nested">
  <ProfileRow />
</SurfaceCard.Base>`}
                >
                    <SurfaceCard.Base label="Questions" variant="nested" showAnatomy>
                        <ProfileRow />
                    </SurfaceCard.Base>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/**
 * `padding` — the second INDEPENDENT axis, the §10c scale. Default `3` is the
 * standard inset around the content; `padding={0}` drops the inset (still keeps
 * `overflow-hidden`) so a child can OWN its own edge (a cover image, a
 * full-bleed table) flush to the border. Merged from two old single-value
 * leaves (`Default` implying `3`, `FlushContent`) into ONE `Padding` leaf
 * rendering both side by side.
 *
 * 2026-07-26 (teacher): changed from `flushContent?: boolean`
 * (`flushContent=true` → `padding={0}`). An axis INDEPENDENT of `variant` — a
 * `nested` card AND `padding={0}` is a real combination (an edge-to-edge image
 * inside a nested card); merging them would kill that combination.
 */
export const Padding: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-6 p-8">
            <div className="w-72">
                <SurfaceCard.Base label="Featured course" padding={3}>
                    <ProfileRow />
                </SurfaceCard.Base>
            </div>
            <div className="w-72">
                <BlockAnatomy
                    name="SurfaceCard.Base"
                    tier="primitive"
                    leaf="Padding"
                    note="`padding={0}` (right) drops `p-3` and turns on `overflow-hidden`; the child owns its own padding so an image or table edge follows the frame's corners. `padding={3}` (left, the default) is the standard inset — the two most-used values of the §10c scale on this axis."
                    code={`<SurfaceCard.Base label="Featured course" padding={0}>
  <div className="h-28 bg-accent-soft" />
  <div className="p-3"><ProfileRow /></div>
</SurfaceCard.Base>`}
                >
                    <SurfaceCard.Base label="Featured course" padding={0} showAnatomy>
                        <div className="h-28 w-full bg-accent-soft" aria-hidden />
                        <div className="p-3"><ProfileRow /></div>
                    </SurfaceCard.Base>
                </BlockAnatomy>
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
 * atoms so the flag flows straight to `Avatar.Base` + two `Typography.Base`. No
 * second skeleton tree to keep in sync (§12c).
 */
export const Skeleton: Story = {
    render: () => (
        <div className="grid gap-6 p-8 md:grid-cols-2">
            <SurfaceCard.Base label="My courses" description="Three left to finish this month.">
                <ProfileRow />
            </SurfaceCard.Base>
            <BlockAnatomy
                name="SurfaceCard.Base"
                tier="primitive"
                leaf="Prop `isSkeleton`"
                note="Every bar keeps the real line box (label `sm`, caption `xs`, the row's own two lines) so nothing shifts when the data lands (§8). The frame owns the label and the caption; the row owns itself."
                code={`<SurfaceCard.Base isSkeleton label="My courses" description={…}>
  <ProfileRow isSkeleton />
</SurfaceCard.Base>`}
            >
                <SurfaceCard.Base
                    isSkeleton
                    showAnatomy
                    label="My courses"
                    description="Three left to finish this month."
                >
                    <ProfileRow isSkeleton />
                </SurfaceCard.Base>
            </BlockAnatomy>
        </div>
    ),
}

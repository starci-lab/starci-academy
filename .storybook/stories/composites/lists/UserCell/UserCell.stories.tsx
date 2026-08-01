import type { Meta, StoryObj } from "@storybook/nextjs"
import { GraduationCapIcon } from "@phosphor-icons/react"
import { UserCell } from "@sb-components/composites/lists/UserCell/UserCell"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `UserCell`: the system's ONE person row (avatar + name + optional `@handle`).
 * Promoted from the atom tier (ATOM-3): a component composing `Avatar` AND
 * `Typography` is assembling the vocabulary, not being a word in it — moved to
 * `composites/lists/`, beside `IdentityContentRow`, the other "face beside
 * content" shape in this folder.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). A prop with a shape gets its own leaf: `size` ·
 * `handle` · `trailing` · `leadingIcon` · `isOwnRow` · `isSkeleton`. Props
 * WITHOUT a leaf: `username`/`displayName` (content that fills every leaf, the
 * same role `text` plays on `Chip` — not a "shape" of its own to test);
 * `avatar` (only swaps the IMAGE inside `Avatar`, which already has its own
 * story — `Atoms/Display/Avatar/Avatar`, leaf `Source`; repeating it here would
 * be re-testing the child, not testing `UserCell`); `leadingTone` (only tints
 * the `IconTile` that `leadingIcon` already grows a leaf for — `IconTile`'s own
 * story owns the `tone` axis, leaf `Tones`); `className`
 * (plumbing, generates no new shape).
 *
 * ⭐ ADDED 2026-08-01 (additive): `leadingIcon`/`leadingTone` let the row lead
 * with a framed `IconTile` instead of `Avatar` — for rows that aren't a person
 * (a course/org/resource). Omitted, every other leaf on this page is
 * unaffected — the row renders `Avatar` exactly as before.
 *
 * ⭐ PROMOTED 2026-08-01 (ATOM-3): the atom-tier `Typography` no longer accepts
 * `anatPart` (an atom self-names, ATOM-10), so the two child `Typography`
 * calls below no longer pass one — the panel still finds them, badged as
 * `Typography`, exactly as before. Skeleton bars for name/handle now delegate
 * to `Typography isSkeleton` (fractional `classNames` width) instead of a raw
 * HeroUI `Skeleton`, so COMPOSITE-10 holds: this composite decides which parts
 * shimmer and how many, the atom decides the shape of each.
 *
 * DEPS — `Avatar` and `Typography` BOTH have their own story, so they're
 * declared via `annotate` for click-through. `Trailing` is a free slot the
 * caller pours content into, with no "canonical shape" of its own, so it gets
 * no `storyId`.
 *
 * MIGRATED TO `states` (2026-07-27): leaves that used to stack a "before/after"
 * pair by hand in one `children` block now carry one `states[]` entry per value,
 * each with its own `why` and its own `code`.
 */

/** Description shown at the top of the autodocs page. UI-facing copy is written in English. */
const USER_CELL_DOC = `
## Composition

A UserCell is an avatar, a name, and two optional lines: a muted handle under the
name, and a slot on the far right for anything the row needs — a role chip, a follow
button, a status dot.

**Name only** covers the common case: a list of people where the name alone tells
them apart.

**Add a handle** when the name is ambiguous, or the row needs a stable identifier
under the display name — a username, an email, a login.

**Add trailing content** for a row-level action or status the reader needs at a
glance, aligned to the far right so a scanning eye finds it in the same spot every
time.

## Leading with a tile instead of a face

Pass \`leadingIcon\` when the row isn't a person — a course, an org, a resource.
The leading circle swaps for a framed \`IconTile\` carrying that glyph instead of
\`Avatar\`; \`leadingTone\` tints it. Everything else about the row (name, handle,
trailing slot, sizing) keeps its current meaning.

## Sizing

Two densities. \`sm\` fits list rows and comment threads where many people stack up;
\`md\` gives the row more room on a profile header or a settings page. Both sizes
scale the avatar through the shared avatar atom, so the two never drift apart.

## Highlighting your own row

Pass \`isOwnRow\` in a list where the viewer might be scanning for themselves — a
leaderboard, a comment thread, a member list. The name switches to the accent tone;
everything else about the row stays the same, so it reads as "that's me" without
shouting.

## Loading

Pass \`isSkeleton\` and the whole row swaps for a shimmer placeholder — the caller
never assembles a skeleton by hand. Both the avatar circle and the name/handle bars
delegate to their own atom's \`isSkeleton\`, so every shimmer always matches the row's
\`size\` and type scale instead of a hand-matched rectangle.
`

const meta: Meta<typeof UserCell> = {
    title: "Composites/Lists/UserCell/UserCell",
    component: UserCell,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: USER_CELL_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof UserCell>

/**
 * Shared DOM annotation table for every leaf.
 *
 * ⚠️ 2026-07-28 (naming pass): `UserCell` forwards `showAnatomy` straight
 * into the composed `Avatar` (no `anatPart` given to opaque it), so
 * `Avatar`'s OWN internal HeroUI nodes (`Avatar`/`AvatarImage`/
 * `AvatarFallback`) surface directly inside THIS tree — real names, `tier:
 * "heroui"`, no `storyId` (a library component has no story of ours to jump
 * to). The previous `Avatar` entry (`tier: "atom"`, `storyId` to Avatar's
 * own story) was itself mislabeled: that key was never matched by an opaque
 * "Avatar" wrapper (none exists here), only by AvatarBase's own inner
 * `Avatar` HeroUI node leaking through — so it needed `tier: "heroui"`, not
 * `"atom"`, and no `storyId`. Fixing the FORWARDING itself (passing `anatPart`
 * instead) is a structural change out of scope for a naming-only pass.
 *
 * `Name`/`Handle` renamed to `Typography` (the real component both
 * instances are, duplicate names allowed — the panel groups by DOM element).
 * `Skeleton` now covers all three shimmer bars (avatar circle + name + handle),
 * since all three resolve to the same real HeroUI `Skeleton`. `Trailing` stays
 * OUT of `annotate` — it is a free slot the caller fills with ANY node, not a
 * fixed component with a real name.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Avatar": {
        role: "the HeroUI avatar frame inside the composed Avatar, surfacing here because forwards straight through",
        tier: "heroui",
    },
    "AvatarImage": {
        role: "the real or generated photo inside Avatar's fallback chain, when one is showing",
        tier: "heroui",
    },
    "AvatarFallback": {
        role: "the initials/icon fallback inside Avatar, when there is no photo to show",
        tier: "heroui",
    },
    "Typography": {
        role: "the name and, when set, the muted @handle line — two separate Typography instances",
        tier: "atom",
        storyId: "atoms-text-typography-typography--plain",
    },
    "Skeleton": {
        role: "shimmer bar — the avatar circle (delegated to Avatar), the name bar, and the handle bar all resolve to this same HeroUI Skeleton",
        tier: "heroui",
    },
}

/** BARE leaf — no prop turned on: empty avatar (fallback), one name line, no handle/trailing. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="UserCell"
                tier="composite"
                leaf="Bare cell"
                reason="The one person-row in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                annotate={ANNOTATE}
                states={[
                    {
                        name: "no avatar URL, no handle, no trailing",
                        why: "The avatar falls back to its generated face and only one line of text — the name — renders below it. This is the baseline shape every other leaf on this page differs from by exactly one prop.",
                        code: "<UserCell username=\"oliviabennett\" displayName=\"Olivia Bennett\" />",
                        render: <UserCell username="oliviabennett" displayName="Olivia Bennett" avatar={null} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — TWO densities, rendering the FULL union. Migrated to `states` 2026-07-27. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="UserCell"
                tier="composite"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "Only the avatar preset and the row's own gap shrink; the text scale stays put, so a size swap never reflows the name column width. A comment thread or a member list stacks many rows at once, so the tighter density keeps the list scannable.",
                        code: "<UserCell username=\"marcusreed\" displayName=\"Marcus Reed\" size=\"sm\" />",
                        render: <UserCell username="marcusreed" displayName="Marcus Reed" avatar={null} size="sm" />,
                    },
                    {
                        name: "size = \"md\"",
                        why: "The avatar preset and the row's gap grow one notch, again with the text scale staying put. A profile header or a settings page has room to breathe, so the larger density gives the row more air.",
                        code: "<UserCell username=\"marcusreed\" displayName=\"Marcus Reed\" size=\"md\" />",
                        render: <UserCell username="marcusreed" displayName="Marcus Reed" avatar={null} size="md" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `handle` — a string grows a muted `@handle` line under the name. Migrated to `states` 2026-07-27. */
export const Handle: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="UserCell"
                tier="composite"
                leaf="Prop `handle`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "handle = undefined",
                        why: "Only one text line renders — the name — with no reserved blank line waiting under it. A row where the display name alone is enough to tell people apart doesn't need a second line taking up space.",
                        code: "<UserCell username=\"nataliecross\" displayName=\"Natalie Cross\" />",
                        render: <UserCell username="nataliecross" displayName="Natalie Cross" avatar={null} />,
                    },
                    {
                        name: "handle = \"@nataliecross\"",
                        why: "A second, muted text line mounts beneath the name carrying the handle string. A display name is friendly but not always unique, so the handle line gives the reader a stable identifier when they need to be sure which person this is.",
                        code: "<UserCell username=\"nataliecross\" displayName=\"Natalie Cross\" handle=\"@nataliecross\" />",
                        render: <UserCell username="nataliecross" displayName="Natalie Cross" avatar={null} handle="@nataliecross" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Trailing badge component (COMPOSITE-8): `UserCell` calls this itself and forwards `isSkeleton`. */
const AdminBadge = () => <Chip tone="accent" text="Admin" />

/** Leaf prop `trailing` — a free right-side slot, only grows when the caller names a component for it. Migrated to `states` 2026-07-27. */
export const Trailing: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="UserCell"
                tier="composite"
                leaf="Prop `trailing`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "trailing = undefined",
                        why: "The row ends right after the name/handle column, with no reserved space on the right edge. Nothing renders in the slot because nothing was passed to it.",
                        code: "<UserCell username=\"emmafoster\" displayName=\"Emma Foster\" handle=\"@emmafoster\" />",
                        render: <UserCell username="emmafoster" displayName="Emma Foster" avatar={null} handle="@emmafoster" />,
                    },
                    {
                        name: "trailing = AdminBadge",
                        why: "A `Trailing` node mounts pinned to the far right with `ml-auto`, regardless of how short the name/handle column is. A team list needs a role badge on the right and a follower list needs a follow button in the same spot, and the slot is generic on purpose so it never cares which one lands there.",
                        code: `const AdminBadge = () => <Chip tone="accent" text="Admin" />

<UserCell
    username="emmafoster"
    displayName="Emma Foster"
    handle="@emmafoster"
    trailing={AdminBadge}
/>`,
                        render: (
                            <UserCell
                                username="emmafoster"
                                displayName="Emma Foster"
                                avatar={null}
                                handle="@emmafoster"
                                trailing={AdminBadge}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `leadingIcon` — swaps the leading `Avatar` for a framed `IconTile`,
 * for rows led by a course/org/resource glyph rather than a person. ADDED
 * 2026-08-01, additive: omitted, every other leaf on this page renders `Avatar`
 * exactly as before — nothing about `username`/`handle`/`trailing`/`isOwnRow`
 * changes meaning.
 */
export const LeadingIcon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="UserCell"
                tier="composite"
                leaf="Prop `leadingIcon`"
                annotate={{
                    ...ANNOTATE,
                    "IconTile": {
                        role: "the framed icon tile that replaces Avatar when `leadingIcon` is set",
                        tier: "atom",
                        storyId: "atoms-display-icontile-icontile--default",
                    },
                }}
                states={[
                    {
                        name: "leadingIcon = undefined (default)",
                        why: "The row renders `Avatar` exactly as every other leaf on this page — a course/org row with no glyph of its own falls back to the same generated-face avatar a person row would get.",
                        code: "<UserCell username=\"riverdale-cs101\" displayName=\"CS101 Study Group\" handle=\"12 members\" />",
                        render: <UserCell username="riverdale-cs101" displayName="CS101 Study Group" avatar={null} handle="12 members" />,
                    },
                    {
                        name: "leadingIcon = GraduationCapIcon",
                        why: "`Avatar` swaps for a framed `IconTile` at its own `\"sm\"` step (40px) — a course/org glyph leads the row instead of a face, for rows that aren't a person (a leaderboard row for a team, a \"posted in <course>\" byline). `leadingTone` (default `\"accent\"`) tints the tile the same way `IconTile`'s own `tone` prop does.",
                        code: "<UserCell username=\"riverdale-cs101\" displayName=\"CS101 Study Group\" handle=\"12 members\" leadingIcon={GraduationCapIcon} />",
                        render: <UserCell username="riverdale-cs101" displayName="CS101 Study Group" handle="12 members" leadingIcon={GraduationCapIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `isOwnRow` — NEW (phase 2, following the phase-1 codemod). Replaces
 * the now-deleted `nameClassName` back door: the caller no longer passes a raw
 * class string, it just flips a semantic flag and the atom itself switches
 * `Typography` to `color="accent"`. Migrated to `states` 2026-07-27.
 */
export const OwnRow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="UserCell"
                tier="composite"
                leaf="Prop `isOwnRow`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isOwnRow = false (default)",
                        why: "The `Name` node renders in the default foreground tone, no different from any other row in the list. This is the plain peer row, the shape every row in a leaderboard or a thread starts from.",
                        code: "<UserCell username=\"danielortiz\" displayName=\"Daniel Ortiz\" handle=\"@danielortiz\" />",
                        render: <UserCell username="danielortiz" displayName="Daniel Ortiz" avatar={null} handle="@danielortiz" />,
                    },
                    {
                        name: "isOwnRow = true",
                        why: "Only the `Name` node's colour flips to the accent tone — the avatar, the handle, and the trailing slot stay exactly as they are for everyone else. A leaderboard or a comment thread is a list of peers, and the one row that is the viewer needs to jump out without a special layout of its own.",
                        code: "<UserCell username=\"danielortiz\" displayName=\"Daniel Ortiz\" handle=\"@danielortiz\" isOwnRow />",
                        render: <UserCell username="danielortiz" displayName="Daniel Ortiz" avatar={null} handle="@danielortiz" isOwnRow />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c). Renders the FULL `size`
 * union (`sm`/`md`) to PROVE the phase-1 bug is fixed: the atom used to hard-code
 * the avatar shimmer at `size-9` regardless of `size`, so both rows came out
 * pixel-identical (an ATOM bug, not a story bug). Now `isSkeleton` delegates
 * straight to `Avatar isSkeleton size={size}`, so the circle changes with the
 * preset — and (phase 2, promotion) `Typography isSkeleton` covers both text
 * lines, replacing the bare HeroUI `Skeleton` used before (COMPOSITE-10).
 * Migrated to `states` 2026-07-27 — each size is its own state so the reader can
 * flip between the two and see the circle change.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="UserCell"
                tier="composite"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true, size = \"sm\"",
                        why: "The avatar circle mirrors the `sm` preset instead of a hard-coded width, because the shimmer delegates straight to `Avatar isSkeleton size={size}`. The name and (when a handle is set) handle bars mirror the live row's two-line shape at the same density, each drawn by `Typography isSkeleton`.",
                        code: "<UserCell username=\"placeholder\" handle=\"@placeholder\" size=\"sm\" isSkeleton />",
                        render: <UserCell username="placeholder" handle="@placeholder" size="sm" isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, size = \"md\"",
                        why: "The avatar circle grows to the `md` preset, visibly larger than the `sm` state's circle, because the shimmer follows `size` instead of locking to one fixed width. Whoever owns the row shape owns which parts shimmer and how many (COMPOSITE-10); the shape of each shimmer stays the composed atom's own job.",
                        code: "<UserCell username=\"placeholder\" handle=\"@placeholder\" size=\"md\" isSkeleton />",
                        render: <UserCell username="placeholder" handle="@placeholder" size="md" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

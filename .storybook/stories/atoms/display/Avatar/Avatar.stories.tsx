import type { Meta, StoryObj } from "@storybook/nextjs"
import { UserIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * ATOM — `Avatar`: the system's one avatar, wrapping HeroUI `Avatar` directly.
 *
 * One prop = one leaf, each of the props with a shape: `Default` · `Source` (the
 * src → generated → initials → icon fallback chain, including the failed-load case) ·
 * `Fallback` · `Status` (4 tones) · `Sizes` (3 tiers) · `Colors` (5 tints) ·
 * `Skeleton`. A prop with no shape (`className`) gets no leaf. Each `states[]` entry
 * renders exactly one `Avatar` instance.
 *
 * Icon = Phosphor — pass the component (`icon={UserIcon}`), not JSX; the atom forces
 * the scale and weight from `size`.
 */
/**
 * Every part this atom renders is a DIRECT HeroUI import (no member of ours has its
 * own story to jump to) — all four get `tier: "heroui"`, no `storyId` (§ heroui rule,
 * 2026-07-28 naming pass). Renamed from role-words (`Image`/`Fallback`) to the REAL
 * exported names (`AvatarImage`/`AvatarFallback`); `Avatar`/`Skeleton` already matched.
 *
 * `Status` is the ONE part with no HeroUI counterpart — a hand-drawn presence dot the
 * atom owns itself (§13z). It gets its own leaf/story right in this file (`Status`,
 * every tone × size), so it links there instead of going undeclared or getting a
 * dishonest `tier: "heroui"` for something that isn't a library import.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Avatar": {
        tier: "heroui",
        role: "the HeroUI avatar frame holding whichever fallback candidate is currently showing",
    },
    "AvatarImage": {
        tier: "heroui",
        role: "the real photo or the generated (DiceBear) face — whichever image candidate is currently loaded",
    },
    "AvatarFallback": {
        tier: "heroui",
        role: "initials or a plain icon glyph, shown once every image candidate is exhausted",
    },
    "Skeleton": {
        tier: "heroui",
        role: "the resting circle shimmer, drawn in place of the whole avatar while isSkeleton is on",
    },
    "Status": {
        tier: "atom",
        role: "the presence dot at the avatar's corner, drawn by this atom itself — see the dedicated Status leaf for every tone × size",
        storyId: "atoms-display-avatar-avatar--status",
    },
}
const meta: Meta<typeof Avatar> = {
    title: "Atoms/Display/Avatar/Avatar",
    component: Avatar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof Avatar>
// A real photo already in use elsewhere in the app — no new asset needed.
const REAL_IMG = "https://i.pravatar.cc/150?img=12"
// Guaranteed 404 — used to prove the fallback chain steps down after a load error.
const BROKEN_IMG = "https://example.com/nope.png"
// Stable identity for the generated (DiceBear) face — same seed, same face everywhere.
const SEED = "mai.chi@starci.vn"
const NAME = "Mai Chi"
/** BARE leaf — no prop turned on yet, to show the default shape. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Avatar"
                tier="atom"
                leaf="Bare avatar"
                annotate={ANNOTATE}
                reason="The one avatar in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                states={[
                    {
                        name: "no src, no name, no icon",
                        why: "With no `src`, `name`, or `icon` passed, the atom still has to draw something, so it falls through to `fallback=\"generated\"` and asks DiceBear for a face using its own built-in placeholder seed. Size defaults to `md` and no status dot is drawn, since neither was requested.",
                        code: "<Avatar />",
                        render: <Avatar />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf `Source` — the IMAGE-SOURCE axis (folded from 4 old leaves): a real photo,
 * a generated face (DiceBear, seed), initials, a plain icon, and the FAILED-LOAD
 * src case that steps down to the generated face rather than skipping straight
 * to initials. Each value below is its own single-instance state.
 */
export const Source: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Avatar"
                tier="atom"
                leaf="Source chain"
                annotate={ANNOTATE}
                reason="An avatar tries harder before it gives up: a real photo, then a generated face so the person still looks like someone, then initials, then a plain icon. Which step you land on depends on what data you actually have."
                states={[
                    {
                        name: "src set",
                        why: "This cell passes a real `src`, so the atom renders the actual photo directly, the strongest link in the fallback chain. A real photo always wins over every other fallback, which is why it sits at the top of the chain.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} />,
                    },
                    {
                        name: "seed set",
                        why: "This cell passes no `src` but does pass a `seed`, so the atom asks DiceBear for a generated face keyed to that seed. The generated face exists so the person still looks like someone even without a real photo on file.",
                        code: `<Avatar seed="${SEED}" name="Mai Chi" />`,
                        render: <Avatar seed={SEED} name={NAME} />,
                    },
                    {
                        name: "name only",
                        why: "This cell passes only a `name` and forces `fallback=\"initials\"`, so the atom draws the person's initials instead of a face. Initials are the next best identity marker once no photo or generated face is wanted.",
                        code: "<Avatar name=\"Mai Chi\" fallback=\"initials\" />",
                        render: <Avatar name={NAME} fallback="initials" />,
                    },
                    {
                        name: "icon only",
                        why: "This cell passes only an `icon` and forces `fallback=\"icon\"`, so the atom draws a plain generic glyph with no personal identity at all. This is the last resort in the chain, used when there is nothing personal to show.",
                        code: "<Avatar icon={UserIcon} fallback=\"icon\" />",
                        render: <Avatar icon={UserIcon} fallback="icon" />,
                    },
                    {
                        name: "broken src + seed",
                        why: "This cell passes a `src` that fails to load together with a `seed`, so the atom listens for the image load error and steps down to the generated face instead of jumping straight to initials. HeroUI only mounts the `<img>` once it has loaded, so the atom has to catch that failure itself to land on this exact cell.",
                        code: `<Avatar src="${BROKEN_IMG}" seed="${SEED}" name="Mai Chi" />`,
                        render: <Avatar src={BROKEN_IMG} seed={SEED} name={NAME} />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `fallback` — the face shown when there is NO `src`. `src` is
 * deliberately dropped in every state below: WITH a `src`, all three would
 * render the same picture (the photo beats every fallback) ⇒ meaningless.
 */
export const Fallback: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Avatar"
                tier="atom"
                leaf="Prop `fallback`"
                annotate={ANNOTATE}
                reason="This prop only matters when there is no photo: it decides how far down the chain the avatar is allowed to fall. Leave it alone and you get the generated face, turn it off when you need a plain, non-identifying mark."
                states={[
                    {
                        name: "fallback = \"generated\"",
                        why: "With no `src` and `fallback` set to `\"generated\"`, the atom asks DiceBear for a face using the `name` as its seed instead of drawing initials or an icon. This is the default fallback because a generated face still reads as a specific person, more than a placeholder ever could.",
                        code: "<Avatar fallback=\"generated\" name=\"Mai Chi\" />",
                        render: <Avatar fallback="generated" name={NAME} />,
                    },
                    {
                        name: "fallback = \"initials\"",
                        why: "With no `src` and `fallback` set to `\"initials\"`, the atom draws the person's initials pulled from the `name` prop instead of any face. This is the fallback to reach for when a generated face still feels wrong for the surface, for example a compact list row.",
                        code: "<Avatar fallback=\"initials\" name=\"Mai Chi\" />",
                        render: <Avatar fallback="initials" name={NAME} />,
                    },
                    {
                        name: "fallback = \"icon\"",
                        why: "With no `src` and `fallback` set to `\"icon\"`, the atom draws the passed `icon` with no name or face at all. This is the fallback for a genuinely anonymous or system slot, where there is no person's identity to represent.",
                        code: "<Avatar fallback=\"icon\" icon={UserIcon} />",
                        render: <Avatar fallback="icon" icon={UserIcon} />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `status` — the presence dot. Every state below fixes ONE tone at
 * ONE size, so the dot-diameter table (`SIZE_MAP.dot`: size-2 / 2.5 / 3) can be
 * checked step by step across `sm`/`md`/`lg` without drifting from the atom's
 * own size steps.
 */
export const Status: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Avatar"
                tier="atom"
                leaf="Prop `status`"
                annotate={ANNOTATE}
                reason="The dot tells the reader whether this person is reachable right now, without them opening a profile. It sits at the same corner and scales with the avatar at every size."
                states={[
                    {
                        name: "status = \"online\", size = \"sm\"",
                        why: "This cell sets `status=\"online\"` at `size=\"sm\"`, so the dot appears at its smallest diameter to signal the person is active right now inside a dense row. Comparing it against the `md` and `lg` cells of the same status is what proves the dot actually grows step by step instead of staying a fixed size.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="online" size="sm" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="online" size="sm" />,
                    },
                    {
                        name: "status = \"online\", size = \"md\"",
                        why: "This cell sets `status=\"online\"` at `size=\"md\"`, so the dot appears at its default diameter to signal the person is active right now on a normal card or list. Sitting between the `sm` and `lg` cells is what shows the dot scaling smoothly instead of jumping.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="online" size="md" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="online" size="md" />,
                    },
                    {
                        name: "status = \"online\", size = \"lg\"",
                        why: "This cell sets `status=\"online\"` at `size=\"lg\"`, so the dot appears at its largest diameter to signal the person is active right now on a profile header or hero. This is the top end of the scale, where the dot has to stay legible next to the biggest avatar box.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="online" size="lg" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="online" size="lg" />,
                    },
                    {
                        name: "status = \"offline\", size = \"sm\"",
                        why: "This cell sets `status=\"offline\"` at `size=\"sm\"`, so the dot shows the muted tone for someone not signed in, drawn at its smallest diameter for a dense row. Checking it beside the `md` and `lg` offline cells confirms the same muted tone scales correctly across sizes.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="offline" size="sm" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="offline" size="sm" />,
                    },
                    {
                        name: "status = \"offline\", size = \"md\"",
                        why: "This cell sets `status=\"offline\"` at `size=\"md\"`, so the dot shows the muted tone for someone not signed in, drawn at the default diameter used in cards and lists. It sits at the middle step of the size scale for this status.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="offline" size="md" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="offline" size="md" />,
                    },
                    {
                        name: "status = \"offline\", size = \"lg\"",
                        why: "This cell sets `status=\"offline\"` at `size=\"lg\"`, so the dot shows the muted tone for someone not signed in, drawn at its largest diameter for a profile header. This is the top step, where the offline tone still has to read clearly at a bigger scale.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="offline" size="lg" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="offline" size="lg" />,
                    },
                    {
                        name: "status = \"busy\", size = \"sm\"",
                        why: "This cell sets `status=\"busy\"` at `size=\"sm\"`, so the dot signals the person is in a call and should not be disturbed, drawn small for a dense row. Comparing it to the `md` and `lg` busy cells is what confirms this tone keeps its meaning as the avatar grows.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="busy" size="sm" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="busy" size="sm" />,
                    },
                    {
                        name: "status = \"busy\", size = \"md\"",
                        why: "This cell sets `status=\"busy\"` at `size=\"md\"`, so the dot signals the person is in a call and should not be disturbed, drawn at the default card size. This is the middle step of the busy status across the size scale.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="busy" size="md" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="busy" size="md" />,
                    },
                    {
                        name: "status = \"busy\", size = \"lg\"",
                        why: "This cell sets `status=\"busy\"` at `size=\"lg\"`, so the dot signals the person is in a call and should not be disturbed, drawn at its largest size for a profile header. This is the top step, where the busy tone still has to sit legibly at the corner of a bigger avatar.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="busy" size="lg" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="busy" size="lg" />,
                    },
                    {
                        name: "status = \"away\", size = \"sm\"",
                        why: "This cell sets `status=\"away\"` at `size=\"sm\"`, so the dot signals the person stepped away, drawn small for a dense row. This is the first step of the away status across the size scale.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="away" size="sm" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="away" size="sm" />,
                    },
                    {
                        name: "status = \"away\", size = \"md\"",
                        why: "This cell sets `status=\"away\"` at `size=\"md\"`, so the dot signals the person stepped away, drawn at the default size used in cards and lists. This is the middle step of the away status across the size scale.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="away" size="md" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="away" size="md" />,
                    },
                    {
                        name: "status = \"away\", size = \"lg\"",
                        why: "This cell sets `status=\"away\"` at `size=\"lg\"`, so the dot signals the person stepped away, drawn at its largest size for a profile header. This is the last step of the away status, confirming the dot still scales up correctly at the top end.",
                        code: `<Avatar src="${REAL_IMG}" name="Mai Chi" status="away" size="lg" />`,
                        render: <Avatar src={REAL_IMG} name={NAME} status="away" size="lg" />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `size` — 3 tiers, EACH state carries an icon so the glyph weight can
 * be seen changing with size (§5.0a: `sm` → size-4 → `bold`; `md`/`lg` →
 * `regular`). Without an icon there's nothing to compare the weight against.
 */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Avatar"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="Three presets cover every place an avatar shows up: a dense row, a default card, a profile header, and the atom owns the exact pixels, so no call-site ever picks a size in between."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "This cell sets `size=\"sm\"` on an icon-only avatar, so the box shrinks to its smallest preset and the glyph switches to a bold stroke weight to survive being drawn that small. This is the size meant for dense rows like tables and comment threads.",
                        code: "<Avatar icon={UserIcon} size=\"sm\" />",
                        render: <Avatar icon={UserIcon} size="sm" />,
                    },
                    {
                        name: "size = \"md\"",
                        why: "This cell sets `size=\"md\"` on an icon-only avatar, so the box grows to the default preset and the glyph switches back to a regular stroke weight. This is the size used in ordinary cards and lists, the default when no size is specified.",
                        code: "<Avatar icon={UserIcon} size=\"md\" />",
                        render: <Avatar icon={UserIcon} size="md" />,
                    },
                    {
                        name: "size = \"lg\"",
                        why: "This cell sets `size=\"lg\"` on an icon-only avatar, so the box grows to its largest preset while the glyph keeps the regular stroke weight from `md`. This is the size meant for a profile header or hero section where the avatar is the focal point.",
                        code: "<Avatar icon={UserIcon} size=\"lg\" />",
                        render: <Avatar icon={UserIcon} size="lg" />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `color` — the tint of the FALLBACK BACKGROUND. Every state below
 * pairs one of the 5 tints with one of the two fallbacks that have a
 * background (initials, icon); `color` never touches a real photo, so no
 * state needs a `src`.
 */
export const Colors: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Avatar"
                tier="atom"
                leaf="Prop `color`"
                annotate={ANNOTATE}
                reason="Color only paints the fallback surface: it gives an initials or icon avatar a bit of identity when there is no photo to carry it. A photographed avatar ignores it entirely, which is why no state below has a `src`."
                states={[
                    {
                        name: "color = \"accent\", fallback = \"initials\"",
                        why: "This cell sets `color=\"accent\"` on an initials avatar with no `src`, so the fallback background paints the brand tint behind the person's initials. Accent carries no status meaning here, it is just the default brand color when nothing else applies.",
                        code: "<Avatar color=\"accent\" name=\"Mai Chi\" fallback=\"initials\" />",
                        render: <Avatar color="accent" name={NAME} fallback="initials" />,
                    },
                    {
                        name: "color = \"danger\", fallback = \"initials\"",
                        why: "This cell sets `color=\"danger\"` on an initials avatar with no `src`, so the fallback background paints the danger tint behind the person's initials. This tint is meant to flag that something about this person or their state needs attention.",
                        code: "<Avatar color=\"danger\" name=\"Mai Chi\" fallback=\"initials\" />",
                        render: <Avatar color="danger" name={NAME} fallback="initials" />,
                    },
                    {
                        name: "color = \"default\", fallback = \"initials\"",
                        why: "This cell sets `color=\"default\"` on an initials avatar with no `src`, so the fallback background paints the plain neutral tint behind the person's initials. This tint carries no meaning at all, it is the baseline color when nothing needs to stand out.",
                        code: "<Avatar color=\"default\" name=\"Mai Chi\" fallback=\"initials\" />",
                        render: <Avatar color="default" name={NAME} fallback="initials" />,
                    },
                    {
                        name: "color = \"success\", fallback = \"initials\"",
                        why: "This cell sets `color=\"success\"` on an initials avatar with no `src`, so the fallback background paints the success tint behind the person's initials. This tint is meant to carry a positive signal, such as a completed or approved state.",
                        code: "<Avatar color=\"success\" name=\"Mai Chi\" fallback=\"initials\" />",
                        render: <Avatar color="success" name={NAME} fallback="initials" />,
                    },
                    {
                        name: "color = \"warning\", fallback = \"initials\"",
                        why: "This cell sets `color=\"warning\"` on an initials avatar with no `src`, so the fallback background paints the warning tint behind the person's initials. This tint is meant to carry a caution signal, such as a state that needs a second look.",
                        code: "<Avatar color=\"warning\" name=\"Mai Chi\" fallback=\"initials\" />",
                        render: <Avatar color="warning" name={NAME} fallback="initials" />,
                    },
                    {
                        name: "color = \"accent\", fallback = \"icon\"",
                        why: "This cell sets `color=\"accent\"` on an icon-only avatar with no `src`, so the fallback background paints the brand tint behind the plain glyph instead of the letters. This confirms the same tint that painted the initials state also paints the icon state, since color only touches the surface, not the glyph drawn on it.",
                        code: "<Avatar color=\"accent\" icon={UserIcon} fallback=\"icon\" />",
                        render: <Avatar color="accent" icon={UserIcon} fallback="icon" />,
                    },
                    {
                        name: "color = \"danger\", fallback = \"icon\"",
                        why: "This cell sets `color=\"danger\"` on an icon-only avatar with no `src`, so the fallback background paints the danger tint behind the plain glyph. Repeating the danger tint on the icon fallback proves it is the surface being painted, not the initials text from the state above.",
                        code: "<Avatar color=\"danger\" icon={UserIcon} fallback=\"icon\" />",
                        render: <Avatar color="danger" icon={UserIcon} fallback="icon" />,
                    },
                    {
                        name: "color = \"default\", fallback = \"icon\"",
                        why: "This cell sets `color=\"default\"` on an icon-only avatar with no `src`, so the fallback background paints the plain neutral tint behind the glyph. This is the baseline icon state against which every other tinted icon state is compared.",
                        code: "<Avatar color=\"default\" icon={UserIcon} fallback=\"icon\" />",
                        render: <Avatar color="default" icon={UserIcon} fallback="icon" />,
                    },
                    {
                        name: "color = \"success\", fallback = \"icon\"",
                        why: "This cell sets `color=\"success\"` on an icon-only avatar with no `src`, so the fallback background paints the success tint behind the glyph. Seeing the same positive tint on both the initials and icon fallback confirms the color only paints the surface.",
                        code: "<Avatar color=\"success\" icon={UserIcon} fallback=\"icon\" />",
                        render: <Avatar color="success" icon={UserIcon} fallback="icon" />,
                    },
                    {
                        name: "color = \"warning\", fallback = \"icon\"",
                        why: "This cell sets `color=\"warning\"` on an icon-only avatar with no `src`, so the fallback background paints the warning tint behind the glyph. Seeing the same caution tint on both the initials and icon fallback confirms the color only paints the surface.",
                        code: "<Avatar color=\"warning\" icon={UserIcon} fallback=\"icon\" />",
                        render: <Avatar color="warning" icon={UserIcon} fallback="icon" />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `isSkeleton` — shimmer OWNED by the atom (hybrid C, §12c), one
 * state per (size × status-presence) pair.
 *
 * The atom draws a NEUTRAL status dot (`bg-default-300`) right inside the
 * skeleton branch when `status` is set, it doesn't know online/offline yet so
 * it doesn't paint a state color, but HAVING a dot is the atom's real loading
 * shape (without it, the "has status" and "no status" states would render
 * identical pixels, violating §D). So every no-status/with-status pair below
 * MUST differ: the with-status state always carries an extra gray dot in the
 * corner.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Avatar"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                reason="Whoever owns the shape owns its resting state, so the avatar draws its own shimmer instead of a shared skeleton wrapper: a circle sized to match the size it will resolve to, plus a neutral dot when a status will eventually show."
                states={[
                    {
                        name: "size = \"sm\", no status",
                        why: "This cell renders the `sm` skeleton shimmer with no `status` prop at all, so only the circular shimmer shows with no dot anywhere on it. This is the plain loading shape for a slot that will never show a presence dot.",
                        code: "<Avatar isSkeleton size=\"sm\" />",
                        render: <Avatar isSkeleton size="sm" />,
                    },
                    {
                        name: "size = \"sm\", status = \"online\"",
                        why: "This cell renders the `sm` skeleton shimmer with `status=\"online\"`, so a neutral grey dot is drawn at the corner even though the real online color is not known yet. Reserving that dot now is what stops the avatar's footprint from jumping once the real status color lands.",
                        code: "<Avatar isSkeleton size=\"sm\" status=\"online\" />",
                        render: <Avatar isSkeleton size="sm" status="online" />,
                    },
                    {
                        name: "size = \"md\", no status",
                        why: "This cell renders the `md` skeleton shimmer with no `status` prop at all, so only the circular shimmer shows with no dot anywhere on it. This is the default-size loading shape used for a slot that will never carry a status.",
                        code: "<Avatar isSkeleton size=\"md\" />",
                        render: <Avatar isSkeleton size="md" />,
                    },
                    {
                        name: "size = \"md\", status = \"online\"",
                        why: "This cell renders the `md` skeleton shimmer with `status=\"online\"`, so a neutral grey dot sits at the corner at the default size before the real status color is known. Comparing this against the no-status `md` state is what proves the dot reserves its own space rather than appearing only once real data lands.",
                        code: "<Avatar isSkeleton size=\"md\" status=\"online\" />",
                        render: <Avatar isSkeleton size="md" status="online" />,
                    },
                    {
                        name: "size = \"lg\", no status",
                        why: "This cell renders the `lg` skeleton shimmer with no `status` prop at all, so only the circular shimmer shows with no dot anywhere on it. This is the largest loading shape, used where the resolved avatar will sit in a profile header.",
                        code: "<Avatar isSkeleton size=\"lg\" />",
                        render: <Avatar isSkeleton size="lg" />,
                    },
                    {
                        name: "size = \"lg\", status = \"online\"",
                        why: "This cell renders the `lg` skeleton shimmer with `status=\"online\"`, so a neutral grey dot sits at the corner at the largest size before the real status color is known. This confirms the reserved-dot behavior holds at every size step, not only at the smaller ones.",
                        code: "<Avatar isSkeleton size=\"lg\" status=\"online\" />",
                        render: <Avatar isSkeleton size="lg" status="online" />,
                    },
                ]}
            />
        </div>
    ),
}
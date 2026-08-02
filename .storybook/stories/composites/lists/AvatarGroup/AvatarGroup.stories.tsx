import type { Meta, StoryObj } from "@storybook/nextjs"
import { AvatarGroup } from "@sb-components/composites/lists/AvatarGroup/AvatarGroup"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * `AvatarGroup` — a row of edge-overlapping avatars ("who follows") plus a "+N" chip. Leaves:
 * `Default` (items mapping), `Overflow` (`max` and `total`, both producing the "+N" chip),
 * `Sizes` (cluster-level `size`), and the `isSkeleton` mirror. Per-avatar state
 * (status/colors/fallback) lives in `Avatar`; `AvatarGroup` imports `Avatar` to build each one.
 */
// Stable local data-URI "photo" so image avatars render without an external host.
const PHOTO = (hue: number) =>
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='hsl(${hue}%2C60%25%2C55%25)'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Cpath d='M16 90a32 32 0 0 1 64 0z' fill='white'/%3E%3C/svg%3E`
const members = [
    { key: "minh.tran", name: "Noah Mitchell", src: PHOTO(210) },
    { key: "lan.pham", name: "Ava Parker", src: PHOTO(320) },
    { key: "hoang.le", name: "Liam Harper" },
    { key: "an.nguyen", name: "Emma Nelson" },
    { key: "thu.vo", name: "Mia Vaughn" },
    { key: "khoa.dinh", name: "Lucas Dean" },
]
/**
 * `Avatar` = an edge-overlapping member (repeats ×N, has its own story to jump to).
 * The "+N" chip is HeroUI's own `Avatar` reused to hold a count instead of a person
 * (real name, `tier: "heroui"` — no `storyId`, there's no story of ours to jump to for
 * a library component); its skeleton mirror is HeroUI `Skeleton`, same reasoning.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Avatar": {
        storyId: "atoms-display-avatar-avatar--default",
        tier: "atom",
        role: "one Avatar per person, overlapped, the ring separating it from the one beneath",
    },
    "HeroAvatar": {
        tier: "heroui",
        role: "the plus-N overflow chip — HeroUI's own Avatar reused to hold a count instead of a person, so it is not an Avatar",
    },
    "Skeleton": {
        tier: "heroui",
        role: "the overflow chip's shimmer while loading, HeroUI Skeleton mirroring the same ring and size as every avatar slot",
    },
}
const meta: Meta<typeof AvatarGroup> = {
    title: "Composites/Lists/AvatarGroup",
    component: AvatarGroup,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof AvatarGroup>
/** Bare leaf — `items` maps straight to the row, no `max`/`total`/`size`/`isSkeleton` turned on yet. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AvatarGroup"
                tier="composite"
                leaf="Default"
                annotate={ANNOTATE}
                reason="The overlapping row builds every Avatar itself from `items`, and callers never pass children."
                states={[
                    {
                        name: "items = 4 members, no max/total",
                        why: "Four avatars render in a row, each riding a ring so it separates from the one underneath it. Four fit without any cap, so no plus-N chip shows up at the end.",
                        code: "<AvatarGroup items={[{ key: \"u1\", name: \"Noah\", src: \"…\" }, …]} />",
                        render: <AvatarGroup items={members.slice(0, 4)} />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf props `max` / `total` — TWO paths landing on the SAME shape (the "+N"
 * chip), so they merge into one leaf instead of splitting in two (mirrors the dot exception on `Chip`).
 */
export const Overflow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AvatarGroup"
                tier="composite"
                leaf="Props `max` / `total`"
                annotate={ANNOTATE}
                reason="The plus-N chip is a count, not a face, and it has two different triggers. `max` cuts a row already held in full. `total` covers the page-one case, where only a handful of members were fetched but the server reported the real count. Both roads land on the exact same chip; nothing distinguishes which one fired, because the reader only needs to know more exist, not why."
                states={[
                    {
                        name: "max = 3, items = 6 members",
                        why: "The row cuts to three avatars and a plus-3 chip grows at the end. `max` caps a row the caller already holds in full.",
                        code: "<AvatarGroup max={3} items={/* 6 members */} />",
                        render: <AvatarGroup max={3} items={members} />,
                    },
                    {
                        name: "total = 12, items = 4 loaded",
                        why: "All four loaded avatars render and a plus-8 chip grows at the end, reading off `total` rather than counting `items`. `total` covers the page-one case, where only a handful of members were fetched but the server already reported the real count.",
                        code: "<AvatarGroup items={/* first 4 loaded */} total={12} />",
                        render: <AvatarGroup items={members.slice(0, 4)} total={12} />,
                    },
                ]}
            />
        </div>
    ),
}
/** Leaf prop `size` — CLUSTER LEVEL (§12d), the whole row is always same-sized. FULL 3-tier union. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AvatarGroup"
                tier="composite"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="Size lives on the group, not the member, because a row of mismatched avatars would read as a layout bug rather than a feature. `Avatar` never sees a size prop from here; the group hands the same value to every avatar it builds."
                states={[
                    {
                        name: "size = sm, items = 3",
                        why: "All three avatars render at the smallest tier. This size suits compact contexts like table rows or comment threads.",
                        code: "<AvatarGroup size=\"sm\" items={[…]} />",
                        render: <AvatarGroup size="sm" items={members.slice(0, 3)} />,
                    },
                    {
                        name: "size = md, items = 3",
                        why: "All three avatars render at the default tier. This is the size a group gets without passing `size` at all, used in cards and panels.",
                        code: "<AvatarGroup size=\"md\" items={[…]} />",
                        render: <AvatarGroup size="md" items={members.slice(0, 3)} />,
                    },
                    {
                        name: "size = lg, items = 3",
                        why: "All three avatars render at the largest tier. This size suits a hero context like a profile header.",
                        code: "<AvatarGroup size=\"lg\" items={[…]} />",
                        render: <AvatarGroup size="lg" items={members.slice(0, 3)} />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `isSkeleton` — a rule-correct exception to §12g: it re-renders the
 * exact SHAPE this very prop produces while loading. The group doesn't draw its
 * own shimmer — it passes `isSkeleton` down to every `Avatar`, so each slot
 * mirrors into a circle, keeping the same footprint.
 *
 * Two cases: a row with NO overflow (4/4, no chip) and a row WITH overflow
 * (`max` cuts it, `extra > 0`) — the latter case, where the "+N" chip shows up,
 * must shimmer too (§D: a real number sneaking into a loading row is a bug), no
 * showing real text like "+2" during loading.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AvatarGroup"
                tier="composite"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                reason="The group does not own a shimmer shape of its own; it flips isSkeleton down to every Avatar it builds, so the whole row mirrors as circles instead of growing a separate loading component to keep in sync. The overflow chip mirrors too, so no real count sneaks into a loading row."
                states={[
                    {
                        name: "isSkeleton = true, items = 4 members, no max",
                        why: "All four slots mirror into plain circle shimmers and no chip shows up, matching `Default`'s no-overflow shape. Nothing is cut here, so the resting shape carries no plus-N placeholder either.",
                        code: "<AvatarGroup isSkeleton items={/* 4 members */} />",
                        render: <AvatarGroup isSkeleton items={members.slice(0, 4)} />,
                    },
                    {
                        name: "isSkeleton = true, max = 4, items = 6 members",
                        why: "Four circle shimmers render plus a fifth shimmer standing in for the plus-2 chip, matching `Overflow`'s cut shape. The chip that would normally show a real number becomes a matching circle shimmer instead, the same size and ring as every avatar slot, so no real count leaks into a loading row.",
                        code: "<AvatarGroup isSkeleton max={4} items={/* 6 members */} />",
                        render: <AvatarGroup isSkeleton max={4} items={members} />,
                    },
                ]}
            />
        </div>
    ),
}
import type { Meta, StoryObj } from "@storybook/nextjs"
import { UserCell } from "@sb-components/atoms/display/UserCell/UserCell"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `UserCell.Base`: hàng người DUY NHẤT của hệ (avatar + tên + `@handle` tuỳ chọn).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Prop có hình → mỗi cái một leaf: `size` · `handle` ·
 * `trailing` · `isOwnRow` · `isSkeleton`. Prop KHÔNG có leaf: `username`/`displayName`
 * (nội dung điền vào mọi leaf, y hệt vai trò của `text` ở `Chip.Base` — không phải một
 * "hình" riêng để test); `avatar` (chỉ đổi ẢNH bên trong `Avatar.Base`, phần đó đã có
 * story riêng của chính nó — `Atoms/Display/Avatar/Avatar.Base`, leaf `Source`; lặp lại
 * ở đây là test lại con, không phải test `UserCell`); `className`/`showAnatomy` (cửa
 * nghề, không sinh hình mới).
 *
 * ⭐ CODEMOD 2026-07-26 (chặng 1): atom bỏ cửa hậu `classNames`/`nameClassName` (kiểu
 * `undefined`, không gán được) đổi sang prop ngữ nghĩa `isOwnRow`; avatar skeleton
 * chuyển từ khoá cứng `size-9` sang uỷ quyền `Avatar.Base isSkeleton size={size}` nên
 * giờ mirror đúng cỡ hàng thật (§12c); hai dòng chữ đổi tên anat part riêng
 * `Name`/`Handle` (trước cùng phát `Text`, dedupe mất một node).
 *
 * DEPS — `Avatar.Base` và `Typography.Base` đều CÓ story riêng nên khai qua
 * `annotate` để bấm nhảy được. `Trailing` là khe tự do do caller đổ nội dung vào,
 * không có "hình chuẩn" của riêng nó nên không gắn `storyId`.
 *
 * MIGRATED TO `states` (2026-07-27): leaves that used to stack a "before/after"
 * pair by hand in one `children` block now carry one `states[]` entry per value,
 * each with its own `why` and its own `code`.
 */

/** Hướng dẫn hiện đầu trang autodocs. Chữ trên UI viết TIẾNG ANH. */
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
never assembles a skeleton by hand. The avatar circle is delegated to the shared
avatar atom's own skeleton, so it always matches the row's \`size\` instead of
locking to one width.
`

const meta: Meta<typeof UserCell.Base> = {
    title: "Atoms/Display/UserCell/UserCell.Base",
    component: UserCell.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: USER_CELL_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof UserCell.Base>

/**
 * Bảng chú giải DOM dùng chung cho mọi leaf.
 *
 * ⚠️ 2026-07-28 (naming pass): `UserCell.Base` forwards `showAnatomy` straight
 * into the composed `Avatar.Base` (no `anatPart` given to opaque it), so
 * `Avatar.Base`'s OWN internal HeroUI nodes (`Avatar`/`AvatarImage`/
 * `AvatarFallback`) surface directly inside THIS tree — real names, `tier:
 * "heroui"`, no `storyId` (a library component has no story of ours to jump
 * to). The previous `Avatar` entry (`tier: "atom"`, `storyId` to Avatar.Base's
 * own story) was itself mislabeled: that key was never matched by an opaque
 * "Avatar.Base" wrapper (none exists here), only by AvatarBase's own inner
 * `Avatar` HeroUI node leaking through — so it needed `tier: "heroui"`, not
 * `"atom"`, and no `storyId`. Fixing the FORWARDING itself (passing `anatPart`
 * instead) is a structural change out of scope for a naming-only pass.
 *
 * `Name`/`Handle` renamed to `Typography.Base` (the real component both
 * instances are, duplicate names allowed — the panel groups by DOM element).
 * `Skeleton` now covers all three shimmer bars (avatar circle + name + handle),
 * since all three resolve to the same real HeroUI `Skeleton`. `Trailing` stays
 * OUT of `annotate` — it is a free slot the caller fills with ANY node, not a
 * fixed component with a real name.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Avatar: {
        role: "the HeroUI avatar frame inside the composed Avatar.Base, surfacing here because showAnatomy forwards straight through",
        tier: "heroui",
    },
    AvatarImage: {
        role: "the real or generated photo inside Avatar.Base's fallback chain, when one is showing",
        tier: "heroui",
    },
    AvatarFallback: {
        role: "the initials/icon fallback inside Avatar.Base, when there is no photo to show",
        tier: "heroui",
    },
    "Typography.Base": {
        role: "the name and, when set, the muted @handle line — two separate Typography.Base instances",
        tier: "atom",
        storyId: "atoms-text-typography-typography-base--plain",
    },
    Skeleton: {
        role: "shimmer bar — the avatar circle (delegated to Avatar.Base), the name bar, and the handle bar all resolve to this same HeroUI Skeleton",
        tier: "heroui",
    },
}

/** Leaf TRẦN — chưa bật prop nào: avatar rỗng (fallback), một dòng tên, không handle/trailing. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Bare cell"
                reason="The one person-row in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                annotate={ANNOTATE}
                states={[
                    {
                        name: "no avatar URL, no handle, no trailing",
                        why: "The avatar falls back to its generated face and only one line of text — the name — renders below it. This is the baseline shape every other leaf on this page differs from by exactly one prop.",
                        code: "<UserCell.Base username=\"oliviabennett\" displayName=\"Olivia Bennett\" />",
                        render: <UserCell.Base username="oliviabennett" displayName="Olivia Bennett" avatar={null} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — HAI mật độ, render ĐỦ union. Migrated to `states` 2026-07-27. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "Only the avatar preset and the row's own gap shrink; the text scale stays put, so a size swap never reflows the name column width. A comment thread or a member list stacks many rows at once, so the tighter density keeps the list scannable.",
                        code: "<UserCell.Base username=\"marcusreed\" displayName=\"Marcus Reed\" size=\"sm\" />",
                        render: <UserCell.Base username="marcusreed" displayName="Marcus Reed" avatar={null} size="sm" showAnatomy />,
                    },
                    {
                        name: "size = \"md\"",
                        why: "The avatar preset and the row's gap grow one notch, again with the text scale staying put. A profile header or a settings page has room to breathe, so the larger density gives the row more air.",
                        code: "<UserCell.Base username=\"marcusreed\" displayName=\"Marcus Reed\" size=\"md\" />",
                        render: <UserCell.Base username="marcusreed" displayName="Marcus Reed" avatar={null} size="md" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `handle` — có chuỗi thì mọc dòng `@handle` mờ dưới tên. Migrated to `states` 2026-07-27. */
export const Handle: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Prop `handle`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "handle = undefined",
                        why: "Only one text line renders — the name — with no reserved blank line waiting under it. A row where the display name alone is enough to tell people apart doesn't need a second line taking up space.",
                        code: "<UserCell.Base username=\"nataliecross\" displayName=\"Natalie Cross\" />",
                        render: <UserCell.Base username="nataliecross" displayName="Natalie Cross" avatar={null} showAnatomy />,
                    },
                    {
                        name: "handle = \"@nataliecross\"",
                        why: "A second, muted text line mounts beneath the name carrying the handle string. A display name is friendly but not always unique, so the handle line gives the reader a stable identifier when they need to be sure which person this is.",
                        code: "<UserCell.Base username=\"nataliecross\" displayName=\"Natalie Cross\" handle=\"@nataliecross\" />",
                        render: <UserCell.Base username="nataliecross" displayName="Natalie Cross" avatar={null} handle="@nataliecross" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `trailing` — khe phải tự do, chỉ mọc khi caller đổ nội dung vào. Migrated to `states` 2026-07-27. */
export const Trailing: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Prop `trailing`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "trailing = undefined",
                        why: "The row ends right after the name/handle column, with no reserved space on the right edge. Nothing renders in the slot because nothing was passed to it.",
                        code: "<UserCell.Base username=\"emmafoster\" displayName=\"Emma Foster\" handle=\"@emmafoster\" />",
                        render: <UserCell.Base username="emmafoster" displayName="Emma Foster" avatar={null} handle="@emmafoster" showAnatomy />,
                    },
                    {
                        name: "trailing = <Chip.Base tone=\"accent\" text=\"Admin\" />",
                        why: "A `Trailing` node mounts pinned to the far right with `ml-auto`, regardless of how short the name/handle column is. A team list needs a role badge on the right and a follower list needs a follow button in the same spot, and the slot is generic on purpose so it never cares which one lands there.",
                        code: `<UserCell.Base
    username="emmafoster"
    displayName="Emma Foster"
    handle="@emmafoster"
    trailing={<Chip.Base tone="accent" text="Admin" />}
/>`,
                        render: (
                            <UserCell.Base
                                username="emmafoster"
                                displayName="Emma Foster"
                                avatar={null}
                                handle="@emmafoster"
                                trailing={<Chip.Base tone="accent" text="Admin" />}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `isOwnRow` — MỚI (chặng 2, theo codemod chặng 1). Thay cho cửa hậu
 * `nameClassName` đã bị xoá: caller không còn truyền chuỗi class thô, chỉ bật cờ
 * ngữ nghĩa và atom tự đổi `Typography` sang `color="accent"`. Migrated to `states`
 * 2026-07-27.
 */
export const OwnRow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Prop `isOwnRow`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isOwnRow = false (default)",
                        why: "The `Name` node renders in the default foreground tone, no different from any other row in the list. This is the plain peer row, the shape every row in a leaderboard or a thread starts from.",
                        code: "<UserCell.Base username=\"danielortiz\" displayName=\"Daniel Ortiz\" handle=\"@danielortiz\" />",
                        render: <UserCell.Base username="danielortiz" displayName="Daniel Ortiz" avatar={null} handle="@danielortiz" showAnatomy />,
                    },
                    {
                        name: "isOwnRow = true",
                        why: "Only the `Name` node's colour flips to the accent tone — the avatar, the handle, and the trailing slot stay exactly as they are for everyone else. A leaderboard or a comment thread is a list of peers, and the one row that is the viewer needs to jump out without a special layout of its own.",
                        code: "<UserCell.Base username=\"danielortiz\" displayName=\"Daniel Ortiz\" handle=\"@danielortiz\" isOwnRow />",
                        render: <UserCell.Base username="danielortiz" displayName="Daniel Ortiz" avatar={null} handle="@danielortiz" isOwnRow />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c). Render ĐỦ union `size` (`sm`/`md`)
 * để CHỨNG MINH bug đã sửa ở chặng 1: trước atom khoá cứng avatar shimmer ở `size-9`
 * bất kể `size`, nên hai hàng ra pixel y hệt nhau (lỗi ATOM, không phải story). Nay
 * `isSkeleton` uỷ quyền thẳng `Avatar.Base isSkeleton size={size}` nên vòng tròn đổi
 * theo đúng preset. Migrated to `states` 2026-07-27 — each size is its own state so
 * the reader can flip between the two and see the circle change.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true, size = \"sm\"",
                        why: "The avatar circle mirrors the `sm` preset instead of a hard-coded width, because the shimmer delegates straight to `Avatar.Base isSkeleton size={size}`. The name and (when a handle is set) handle bars mirror the live row's two-line shape at the same density.",
                        code: "<UserCell.Base username=\"placeholder\" handle=\"@placeholder\" size=\"sm\" isSkeleton />",
                        render: <UserCell.Base username="placeholder" handle="@placeholder" size="sm" isSkeleton showAnatomy />,
                    },
                    {
                        name: "isSkeleton = true, size = \"md\"",
                        why: "The avatar circle grows to the `md` preset, visibly larger than the `sm` state's circle, because the shimmer follows `size` instead of locking to one fixed width. Whoever owns the row shape owns its resting state, so the cell draws its own shimmer instead of the caller assembling one from separate skeleton atoms.",
                        code: "<UserCell.Base username=\"placeholder\" handle=\"@placeholder\" size=\"md\" isSkeleton />",
                        render: <UserCell.Base username="placeholder" handle="@placeholder" size="md" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

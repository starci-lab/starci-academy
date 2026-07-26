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
 * Bảng chú giải DOM dùng chung cho mọi leaf. `Avatar` và tên/handle có story riêng
 * (`Typography.Base`) nên nhảy được; `Trailing` là khe tự do (không "hình chuẩn").
 *
 * `Name` và `Handle` là hai `data-anat-part` RIÊNG (đổi 2026-07-26) — trước cả hai
 * cùng phát `Text` nên cây suy từ DOM chỉ gom được một node dù có hai dòng chữ.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Avatar: {
        role: "avatar — uploaded → generated → initials → icon fallback chain, owned by Avatar.Base",
        tier: "atom",
        storyId: "atoms-display-avatar-avatar-base--default",
    },
    Name: {
        role: "primary label — displayName ?? username, accent tone when isOwnRow",
        tier: "atom",
        storyId: "atoms-text-typography-typography-base--plain",
    },
    Handle: {
        role: "muted @handle line, shown only when handle is passed",
        tier: "atom",
        storyId: "atoms-text-typography-typography-base--plain",
    },
    Trailing: {
        role: "right-aligned slot the caller fills — role chip, button, status dot",
        tier: "atom",
    },
    Skeleton: {
        role: "avatar shimmer circle — delegated to Avatar.Base isSkeleton, so it matches size",
        tier: "atom",
    },
}

/** Leaf TRẦN — chưa bật prop nào: avatar rỗng (fallback), một dòng tên, không handle/trailing. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Bare cell"
                reason="The one person-row in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                note="No avatar URL, so the avatar atom falls back to its generated face. No handle, no trailing — just the name line."
                annotate={ANNOTATE}
                code={"<UserCell.Base username=\"oliviabennett\" displayName=\"Olivia Bennett\" />"}
            >
                <UserCell.Base username="oliviabennett" displayName="Olivia Bennett" avatar={null} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — HAI mật độ, render ĐỦ union. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Prop `size`"
                reason="Density follows the list it sits in. A comment thread or a member list stacks many rows, so sm keeps them tight; a profile header or a settings page has room to breathe, so md gives the row more air."
                note="Only the avatar preset and the row's own gap change — the text scale stays put in both, so a size swap never reflows the name column width."
                annotate={ANNOTATE}
                code={`<UserCell.Base username="marcusreed" displayName="Marcus Reed" size="sm" />
<UserCell.Base username="marcusreed" displayName="Marcus Reed" size="md" />`}
            >
                <div className="flex flex-col gap-4">
                    <UserCell.Base username="marcusreed" displayName="Marcus Reed" avatar={null} size="sm" showAnatomy />
                    <UserCell.Base username="marcusreed" displayName="Marcus Reed" avatar={null} size="md" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `handle` — có chuỗi thì mọc dòng `@handle` mờ dưới tên. */
export const Handle: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Prop `handle`"
                reason="A display name is friendly but not always unique. The handle line gives the row a stable identifier — a username, an email, a login — for the reader who needs to be sure which person this is."
                note="The handle line only takes up space when you pass one; there is no reserved blank line under a nameless-only row."
                annotate={ANNOTATE}
                code={`<UserCell.Base username="nataliecross" displayName="Natalie Cross" />
<UserCell.Base username="nataliecross" displayName="Natalie Cross" handle="@nataliecross" />`}
            >
                <div className="flex flex-col gap-4">
                    <UserCell.Base username="nataliecross" displayName="Natalie Cross" avatar={null} showAnatomy />
                    <UserCell.Base username="nataliecross" displayName="Natalie Cross" avatar={null} handle="@nataliecross" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `trailing` — khe phải tự do, chỉ mọc khi caller đổ nội dung vào. */
export const Trailing: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Prop `trailing`"
                reason="A team list needs a role badge on the right; a follower list needs a follow button in the same spot. The slot is generic on purpose — the cell doesn't know or care what lands in it, only that it stays pinned to the far edge."
                note="The slot pushes to the far right with ml-auto regardless of how short the name/handle column is, so a row of mixed name lengths still lines its trailing content up in one column."
                annotate={ANNOTATE}
                code={`<UserCell.Base username="emmafoster" displayName="Emma Foster" handle="@emmafoster" />
<UserCell.Base
    username="emmafoster"
    displayName="Emma Foster"
    handle="@emmafoster"
    trailing={<Chip.Base tone="accent" text="Admin" />}
/>`}
            >
                <div className="flex flex-col gap-4">
                    <UserCell.Base username="emmafoster" displayName="Emma Foster" avatar={null} handle="@emmafoster" showAnatomy />
                    <UserCell.Base
                        username="emmafoster"
                        displayName="Emma Foster"
                        avatar={null}
                        handle="@emmafoster"
                        trailing={<Chip.Base tone="accent" text="Admin" />}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `isOwnRow` — MỚI (chặng 2, theo codemod chặng 1). Thay cho cửa hậu
 * `nameClassName` đã bị xoá: caller không còn truyền chuỗi class thô, chỉ bật cờ
 * ngữ nghĩa và atom tự đổi `Typography` sang `color="accent"`.
 */
export const OwnRow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Prop `isOwnRow`"
                reason="A leaderboard or a comment thread is a list of peers — the one row that is you needs to jump out without a special layout. Flipping the name to the accent tone is enough; the avatar, the handle, and the trailing slot stay exactly as they are for everyone else."
                note="This replaces the old nameClassName back door: a caller used to be able to hand the row any class string, which meant the tone the row could take on was whatever CSS existed, not a fixed set of meanings. isOwnRow only ever means one thing."
                annotate={ANNOTATE}
                code={`<UserCell.Base username="danielortiz" displayName="Daniel Ortiz" handle="@danielortiz" />
<UserCell.Base username="danielortiz" displayName="Daniel Ortiz" handle="@danielortiz" isOwnRow />`}
            >
                <div className="flex flex-col gap-4">
                    <UserCell.Base username="danielortiz" displayName="Daniel Ortiz" avatar={null} handle="@danielortiz" showAnatomy />
                    <UserCell.Base username="danielortiz" displayName="Daniel Ortiz" avatar={null} handle="@danielortiz" isOwnRow />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c). Render ĐỦ union `size` (`sm`/`md`)
 * để CHỨNG MINH bug đã sửa ở chặng 1: trước atom khoá cứng avatar shimmer ở `size-9`
 * bất kể `size`, nên hai hàng ra pixel y hệt nhau (lỗi ATOM, không phải story). Nay
 * `isSkeleton` uỷ quyền thẳng `Avatar.Base isSkeleton size={size}` nên vòng tròn đổi
 * theo đúng preset — hai ô dưới đây khác nhau thật (avatar `size-8` vs `size-10`).
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="UserCell.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the row shape owns its resting state, so the cell draws its own shimmer instead of the caller assembling one from separate skeleton primitives."
                note="The avatar circle is delegated to Avatar.Base's own isSkeleton, so it mirrors size instead of locking to one width — the sm row below has a visibly smaller circle than the md row. The name and (when handle is set) handle bars mirror the live row's two-line shape the same way for both sizes."
                annotate={ANNOTATE}
                code={`<UserCell.Base username="placeholder" handle="@placeholder" size="sm" isSkeleton />
<UserCell.Base username="placeholder" handle="@placeholder" size="md" isSkeleton />`}
            >
                <div className="flex flex-col gap-4">
                    <UserCell.Base username="placeholder" handle="@placeholder" size="sm" isSkeleton showAnatomy />
                    <UserCell.Base username="placeholder" handle="@placeholder" size="md" isSkeleton />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

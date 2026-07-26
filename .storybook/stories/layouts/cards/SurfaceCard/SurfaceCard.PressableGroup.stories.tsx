import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Typography } from "@heroui/react"
import { CaretRightIcon, FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardPressableGroupItem } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import type { VerdictBandVariant } from "@sb-components/layouts/cards/verdict-band"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `SurfaceCard.PressableGroup` KHÔNG đẻ nghĩa
 * mới cho từng ô — nó chỉ LAYOUT + dựng lại `SurfaceCard.Pressable` từ `items`. Nên story
 * ở đây CHỈ render state THUỘC VỀ CỤM: mapping `items` · `columns` (container query) ·
 * `gap` cấp cụm · slot `icon` do cụm sở hữu cỡ/màu · phím tắt 1–N · dải verdict ·
 * ghim vị trí trong grid · skeleton CẢ CỤM.
 *
 * State của TỪNG Ô (`selected` · `isDisabled` · `href` vs `onPress`) sống ở story
 * `SurfaceCard.Pressable` — KHÔNG lặp lại ở đây.
 *
 * 2026-07-26 (thầy) — hệ lưới riêng của member này (`SurfaceCardPressableGroupColumns`
 * 7 bậc, thang container NỬA CỠ `@sm`/`@md`) bị xoá; `columns`/`gap` nay dùng
 * {@link GridColumns}/`SpaceScale` DÙNG CHUNG của `Grid.Base` (§13) — thang ĐẦY CỠ
 * `@app-sm`/`@app-md`/`@app-lg`. Panel anatomy cũng đổi: prop `parts`/`AnatomyNode`
 * (đường cũ, khai cấu trúc bằng tay) → `annotate` (chỉ chú giải WHY, cấu trúc suy từ
 * DOM), và chỉ giữ entry có `storyId` THẬT.
 */
const meta: Meta<typeof SurfaceCard.PressableGroup> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.PressableGroup",
    component: SurfaceCard.PressableGroup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.PressableGroup>

/**
 * Mock-content chuẩn (C-fixture) cho MỌI story: khi ô `content` là một card có children
 * bên trong, đổ bằng ProfileCard — avatar + title + description. Avatar đi TRONG
 * `content` (slot `icon` chỉ dành cho icon thường).
 */
const profileTile = (initials: string, title: string, description: string) => (
    <div className="flex flex-row items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{title}</span>
            <span className="truncate text-xs text-muted">{description}</span>
        </div>
    </div>
)

const MENTORS = [
    { initials: "SC", title: "StarCi Academy", description: "Learn fullstack, system design, and DevOps on an interview-prep roadmap." },
    { initials: "QN", title: "Thầy Quang", description: "Fullstack mentor — reviews projects and runs mock interviews." },
    { initials: "MM", title: "Mia Mia English", description: "Practice test sets and phrases with the SM-2 method." },
    { initials: "DV", title: "DevOps Lab", description: "Hands-on 4-cloud practice with real credentials." },
]

const profileItems: Array<SurfaceCardPressableGroupItem> = MENTORS.map((m) => ({
    key: m.initials,
    onPress: () => {},
    label: m.title,
    content: profileTile(m.initials, m.title, m.description),
}))

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: ReactNode) => <div className="p-8"><div className="max-w-2xl">{node}</div></div>

/**
 * Live grid leaf: mỗi ô là một `Item` LẶP — một `SurfaceCard.Pressable` mà `content` do
 * caller compose tự do (ProfileCard ở đây). `Item` CÓ story riêng
 * (`SurfaceCard.Pressable/Default`) nên khai `storyId` để bấm nhảy sang được.
 *
 * 2026-07-26 (thầy): đổi từ mảng `parts: Array<AnatomyNode>` viết tay sang bảng
 * `annotate: Record<string, AnatomyAnnotation>` — cấu trúc cây nay suy từ DOM
 * (`data-anat-part="Item"` do chính story gắn ở dưới), phần khai tay chỉ còn WHY.
 */
const ITEM_ANNOTATE: Record<string, AnatomyAnnotation> = {
    Item: {
        tier: "primitive",
        role: "SurfaceCard.Pressable repeated — its own story lives at SurfaceCard.Pressable/Default.",
        storyId: "layouts-cards-surfacecard-surfacecard-pressable--default",
    },
}

const VERDICTS: Array<VerdictBandVariant> = ["success", "warning", "danger", "accent"]

/** Default — `items` là DỮ LIỆU (danh sách LẶP thì cấm children); cả grid là MỘT unit có nhãn. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Default"
                annotate={ITEM_ANNOTATE}
                reason="Grid of SurfaceCard.Pressable cards: the whole group is ONE labelled unit (role=group + aria-label), and each cell is a repeated Item. A REPEATING list → `items` must be DATA, never children (khung API law)."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Mentors"
  columns={{ base: 1, sm: 2 }}
  items={[
    { key: "SC", label: "StarCi Academy", onPress: () => {}, content: profileTile(…) },
    { key: "QN", label: "Thầy Quang", onPress: () => {}, content: profileTile(…) },
  ]}
/>`}
            >
                <SurfaceCard.PressableGroup ariaLabel="Mentors" columns={{ base: 1, sm: 2 }} items={profileItems} showAnatomy />
            </BlockAnatomy>,
        ),
}

/**
 * `columns` — số cột theo BỀ RỘNG CONTAINER (container query `@app-sm`/`@app-md`/`@app-lg`…),
 * KHÔNG phải viewport: cùng một grid có thể nằm trong cột trang rộng hay trong rail 256px.
 * Kéo hẹp cửa sổ để thấy hai khung dưới đây reflow ĐỘC LẬP với nhau.
 */
export const Columns: Story = {
    render: () => (
        <div className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Columns"
                annotate={ITEM_ANNOTATE}
                note="Same composition as leaf Default — `columns` only swaps the grid-template by CONTAINER width, no new part."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Mentors"
  columns={{ base: 1, sm: 2, lg: 4 }}
  items={[…]}
/>`}
            >
                <div className="flex flex-col gap-4">
                    <div className="max-w-2xl">
                        <Typography type="body-xs" color="muted">wide container → up to 4 columns</Typography>
                        <SurfaceCard.PressableGroup
                            ariaLabel="Mentors (wide container)"
                            columns={{ base: 1, sm: 2, lg: 4 }}
                            items={profileItems}
                            showAnatomy
                        />
                    </div>
                    <div className="max-w-xs">
                        <Typography type="body-xs" color="muted">narrow container → still 1 column, even on a wide viewport</Typography>
                        <SurfaceCard.PressableGroup
                            ariaLabel="Mentors (narrow container)"
                            columns={{ base: 1, sm: 2, lg: 4 }}
                            items={profileItems.slice(0, 2)}
                        />
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** `gap` — khoảng cách giữa các ô đặt ở CẤP CỤM (grid luôn đều), item không tự chỉnh. */
export const Gap: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Gap"
                annotate={ITEM_ANNOTATE}
                note="`gap` is a prop of the GROUP (items don't have one) — the grid always keeps an even gap; `2` for a dense grid, `3` (default) for a normal one."
                code={`<SurfaceCard.PressableGroup gap={2} ariaLabel="Mentors" items={[…]} />
<SurfaceCard.PressableGroup gap={3} ariaLabel="Mentors" items={[…]} />  // default`}
            >
                <div className="flex flex-col gap-4">
                    <SurfaceCard.PressableGroup ariaLabel="Mentors (gap 2)" columns={{ base: 1, sm: 2 }} gap={2} items={profileItems.slice(0, 2)} showAnatomy />
                    <SurfaceCard.PressableGroup ariaLabel="Mentors (gap 3)" columns={{ base: 1, sm: 2 }} gap={3} items={profileItems.slice(2)} />
                </div>
            </BlockAnatomy>,
        ),
}

/** `item.icon` — slot icon TRẦN: cụm tự ép `size-5` + màu muted một chỗ (§4/§5a), call-site không tự set class. */
export const WithIcon: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="WithIcon"
                annotate={ITEM_ANNOTATE}
                note="`icon` is passed BARE, the group owns its size/color; `iconPosition` only flips the side (leading default / trailing) — still one Item part."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Resources"
  items={[
    { key: "docs", icon: <FolderOpenIcon />, content: <Typography type="body-sm">Docs</Typography>, onPress: () => {} },
    { key: "labs", icon: <FolderOpenIcon />, iconPosition: "trailing", content: <Typography type="body-sm">Labs</Typography>, onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.PressableGroup
                    ariaLabel="Resources"
                    columns={{ base: 1, sm: 2 }}
                    showAnatomy
                    items={[
                        {
                            key: "docs",
                            icon: <FolderOpenIcon />,
                            content: <Typography type="body-sm" weight="medium">Docs</Typography>,
                            onPress: () => {},
                        },
                        {
                            key: "labs",
                            icon: <FolderOpenIcon />,
                            iconPosition: "trailing",
                            content: <Typography type="body-sm" weight="medium">Labs</Typography>,
                            onPress: () => {},
                        },
                    ]}
                />
            </BlockAnatomy>,
        ),
}

/**
 * `keyboardShortcut` — cả group là hành động CHÍNH của màn hình: phím số `1`–`N` chọn ô
 * không cần chuột. Bấm 1 đến 4 để thử. Opt-in vì listener nằm ở `window`.
 */
export const KeyboardShortcut: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="KeyboardShortcut"
                annotate={ITEM_ANNOTATE}
                note="Same composition as leaf Default — `keyboardShortcut` only adds a GROUP-level 1–N shortcut, no change to the parts tree."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Select a mentor by number key"
  keyboardShortcut
  items={[…]}
/>`}
            >
                <SurfaceCard.PressableGroup
                    ariaLabel="Select a mentor by number key"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems}
                    keyboardShortcut
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/**
 * `item.withVerdict` — dải TÍN HIỆU DATA bên trái mỗi tile (cùng band canonical với
 * `SectionCard` / `SurfaceCard.List`), phủ lên content ProfileCard.
 */
export const Verdict: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Verdict"
                annotate={ITEM_ANNOTATE}
                note="Same composition as leaf Default — `withVerdict` only overlays a DATA color band on each Item's edge, no new part."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Mentors by status"
  items={items.map((item, i) => ({ ...item, withVerdict: { enable: true, variant: VERDICTS[i] } }))}
/>`}
            >
                <SurfaceCard.PressableGroup
                    ariaLabel="Mentors by status"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems.map((item, index) => ({
                        ...item,
                        withVerdict: { enable: true, variant: VERDICTS[index] },
                    }))}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/**
 * `item.className` với biến CONTAINER (`@app-sm:col-start-2`) — một pager card lẻ ghim vào
 * cột phải (card trước bị thiếu). Phải dùng biến container ĐÚNG bậc mà `Grid.Base` dùng
 * cho `columns` (`@app-sm`/`@app-md`/`@app-lg`, KHÔNG phải `@sm`/`@md`/`@lg` nửa-cỡ của
 * Tailwind) nên nó bật ĐÚNG lúc grid đạt 2 cột. Thu hẹp cửa sổ: nó vẫn full-width khi còn 1 cột.
 *
 * 2026-07-26 (thầy): đổi từ `@sm:col-start-2` → `@app-sm:col-start-2` — `.PressableGroup`
 * nay dựng lưới bằng `Grid.Base` (thang container ĐẦY CỠ `@app-*`), nên biến ghim cột
 * phải khớp CÙNG thang, không thì bật sai bậc so với lúc grid thật sự chuyển 2 cột.
 */
export const PagerPinRight: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.PressableGroup"
                    tier="primitive"
                    leaf="PagerPinRight"
                    annotate={ITEM_ANNOTATE}
                    note="Only 1 Item pinned via `@app-sm:col-start-2` — still the same Item part; the pin class must be the CONTAINER variant matching `columns` (`@app-sm:`), not a viewport one."
                    code={`<SurfaceCard.PressableGroup
  ariaLabel="Go to previous or next content"
  columns={{ base: 1, sm: 2 }}
  items={[{ key: "next", href: "#", className: "@app-sm:col-start-2", content: <…/> }]}
/>`}
                >
                    <SurfaceCard.PressableGroup
                        ariaLabel="Go to previous or next content"
                        columns={{ base: 1, sm: 2 }}
                        items={[
                            {
                                key: "next",
                                href: "#",
                                className: "@app-sm:col-start-2",
                                content: (
                                    <div className="flex items-center justify-between gap-3">
                                        <Typography type="body-sm" weight="medium">Next content</Typography>
                                        {/* Caret điều hướng: phosphor CaretRightIcon size-3 muted, KHÔNG trượt (§5a/§5b). */}
                                        <CaretRightIcon className="size-3 shrink-0 text-muted" aria-hidden focusable="false" />
                                    </div>
                                ),
                            },
                        ]}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/**
 * Loading — `isSkeleton` tự vẽ mirror grid GENERIC, giữ đúng columns/gap/tile-chrome.
 * Không Skeleton rời ngoài. `SkeletonTile` không có story riêng (mirror nội bộ) nên
 * KHÔNG có `storyId` để trỏ tới — panel bỏ hẳn prop deps ở leaf này.
 */
export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Loading"
                note="`isSkeleton` swaps every Item for a GENERIC SkeletonTile (avatar + 2 lines), keeping columns/gap/tile-chrome — it does not assume the real content's shape."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Mentors"
  columns={{ base: 1, sm: 2 }}
  items={[…]}
  isSkeleton
/>`}
            >
                <SurfaceCard.PressableGroup
                    ariaLabel="Mentors"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems}
                    isSkeleton
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

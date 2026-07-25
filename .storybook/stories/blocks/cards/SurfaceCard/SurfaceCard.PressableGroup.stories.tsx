import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Typography } from "@heroui/react"
import { CaretRightIcon, FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardPressableGroupItem } from "@sb-components/blocks/cards/SurfaceCard/SurfaceCard"
import type { VerdictBandVariant } from "@sb-components/blocks/cards/verdict-band"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `SurfaceCard.PressableGroup` KHÔNG đẻ nghĩa
 * mới cho từng ô — nó chỉ LAYOUT + dựng lại `SurfaceCard.Pressable` từ `items`. Nên story
 * ở đây CHỈ render state THUỘC VỀ CỤM: mapping `items` · `columns` (container query) ·
 * `gap` cấp cụm · slot `icon` do cụm sở hữu cỡ/màu · phím tắt 1–N · dải verdict ·
 * ghim vị trí trong grid · skeleton CẢ CỤM.
 *
 * State của TỪNG Ô (`selected` · `isDisabled` · `href` vs `onPress`) sống ở story
 * `SurfaceCard.Pressable` — KHÔNG lặp lại ở đây.
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
    { initials: "SC", title: "StarCi Academy", description: "Học fullstack, system design và DevOps theo lộ trình phỏng vấn." },
    { initials: "QN", title: "Thầy Quang", description: "Mentor fullstack — review dự án và mock interview." },
    { initials: "MM", title: "Mia Mia English", description: "Luyện đề và học cụm từ theo phương pháp SM-2." },
    { initials: "DV", title: "DevOps Lab", description: "Thực hành 4-cloud với credentials thật." },
]

const profileItems: Array<SurfaceCardPressableGroupItem> = MENTORS.map((m) => ({
    key: m.initials,
    onPress: () => {},
    label: m.title,
    content: profileTile(m.initials, m.title, m.description),
}))

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: ReactNode) => <div className="p-8"><div className="max-w-2xl">{node}</div></div>

// Live grid leaf: mỗi ô là một `Item` LẶP — một `SurfaceCard.Pressable` mà `content` do
// caller compose tự do (ProfileCard ở đây); Item là part DUY NHẤT cụm này tự đặt tên.
const ITEM_PARTS: Array<AnatomyNode> = [
    { name: "Item", tier: "primitive", role: "SurfaceCard.Pressable lặp lại — nội dung `content` do caller compose tự do" },
]

// Loading leaf: mọi ô đổi sang mirror skeleton chung thay cho `Item`.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "SkeletonTile", tier: "primitive", role: "tile mirror avatar + 2 dòng text — placeholder khi isSkeleton" },
]

/** Default — `items` là DỮ LIỆU (danh sách LẶP thì cấm children); cả grid là MỘT unit có nhãn. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Default"
                parts={ITEM_PARTS}
                reason="Grid các SurfaceCard.Pressable: cả nhóm là MỘT unit có nhãn (role=group + aria-label), mỗi ô là một Item lặp lại. Danh sách LẶP → `items` bắt buộc là dữ liệu, không children (luật API tầng khung)."
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
 * `columns` — số cột theo BỀ RỘNG CONTAINER (container query `@sm`/`@md`/`@lg`…), KHÔNG
 * phải viewport: cùng một grid có thể nằm trong cột trang rộng hay trong rail 256px.
 * Kéo hẹp cửa sổ để thấy hai khung dưới đây reflow ĐỘC LẬP với nhau.
 */
export const Columns: Story = {
    render: () => (
        <div className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Columns"
                parts={ITEM_PARTS}
                note="Cùng composition với leaf Default — `columns` chỉ đổi grid-template theo bề rộng CONTAINER, không thêm part mới."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Mentors"
  columns={{ base: 1, sm: 2, lg: 4 }}
  items={[…]}
/>`}
            >
                <div className="flex flex-col gap-4">
                    <div className="max-w-2xl">
                        <Typography type="body-xs" color="muted">container rộng → tới 4 cột</Typography>
                        <SurfaceCard.PressableGroup
                            ariaLabel="Mentors (container rộng)"
                            columns={{ base: 1, sm: 2, lg: 4 }}
                            items={profileItems}
                            showAnatomy
                        />
                    </div>
                    <div className="max-w-xs">
                        <Typography type="body-xs" color="muted">container hẹp → vẫn 1 cột, dù viewport rộng</Typography>
                        <SurfaceCard.PressableGroup
                            ariaLabel="Mentors (container hẹp)"
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
                parts={ITEM_PARTS}
                note="`gap` là prop RIÊNG của cụm (item không có) — grid luôn đều khoảng cách; `2` cho grid dày, `3` (mặc định) cho grid thường."
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
                parts={ITEM_PARTS}
                note="`icon` đi TRẦN, cụm sở hữu cỡ/màu; `iconPosition` đổi bên (leading mặc định / trailing) — vẫn 1 part Item."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Tài nguyên"
  items={[
    { key: "docs", icon: <FolderOpenIcon />, content: <Typography type="body-sm">Tài liệu</Typography>, onPress: () => {} },
    { key: "labs", icon: <FolderOpenIcon />, iconPosition: "trailing", content: <Typography type="body-sm">Bài lab</Typography>, onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.PressableGroup
                    ariaLabel="Tài nguyên"
                    columns={{ base: 1, sm: 2 }}
                    showAnatomy
                    items={[
                        {
                            key: "docs",
                            icon: <FolderOpenIcon />,
                            content: <Typography type="body-sm" weight="medium">Tài liệu</Typography>,
                            onPress: () => {},
                        },
                        {
                            key: "labs",
                            icon: <FolderOpenIcon />,
                            iconPosition: "trailing",
                            content: <Typography type="body-sm" weight="medium">Bài lab</Typography>,
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
                parts={ITEM_PARTS}
                note="Cùng composition với leaf Default — `keyboardShortcut` chỉ thêm phím tắt 1–N ở cấp CỤM, không đổi cây parts."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Chọn mentor bằng phím số"
  keyboardShortcut
  items={[…]}
/>`}
            >
                <SurfaceCard.PressableGroup
                    ariaLabel="Chọn mentor bằng phím số"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems}
                    keyboardShortcut
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

const VERDICTS: Array<VerdictBandVariant> = ["success", "warning", "danger", "accent"]

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
                parts={ITEM_PARTS}
                note="Cùng composition với leaf Default — `withVerdict` chỉ phủ một dải màu DATA lên viền mỗi Item, không thêm part mới."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Mentors theo trạng thái"
  items={items.map((item, i) => ({ ...item, withVerdict: { enable: true, variant: VERDICTS[i] } }))}
/>`}
            >
                <SurfaceCard.PressableGroup
                    ariaLabel="Mentors theo trạng thái"
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
 * `item.className` với biến CONTAINER (`@sm:col-start-2`) — một pager card lẻ ghim vào cột
 * phải (card trước bị thiếu). Phải dùng biến container đúng bước grid đạt 2 cột nên không
 * rơi vào track ẩn. Thu hẹp cửa sổ: nó vẫn full-width khi còn 1 cột.
 */
export const PagerPinRight: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.PressableGroup"
                    tier="primitive"
                    leaf="PagerPinRight"
                    parts={ITEM_PARTS}
                    note="Chỉ 1 Item ghim `@sm:col-start-2` — vẫn cùng part Item; class ghim phải là biến CONTAINER (`@sm:`), không phải viewport."
                    code={`<SurfaceCard.PressableGroup
  ariaLabel="Đi tới nội dung trước hoặc sau"
  columns={{ base: 1, sm: 2 }}
  items={[{ key: "next", href: "#", className: "@sm:col-start-2", content: <…/> }]}
/>`}
                >
                    <SurfaceCard.PressableGroup
                        ariaLabel="Đi tới nội dung trước hoặc sau"
                        columns={{ base: 1, sm: 2 }}
                        items={[
                            {
                                key: "next",
                                href: "#",
                                className: "@sm:col-start-2",
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

/** Loading — `isSkeleton` tự vẽ mirror grid GENERIC, giữ đúng columns/gap/tile-chrome. Không Skeleton rời ngoài. */
export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="`isSkeleton` swap toàn bộ Item sang SkeletonTile GENERIC (avatar + 2 dòng), giữ nguyên columns/gap/tile-chrome — không giả định shape content thật."
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

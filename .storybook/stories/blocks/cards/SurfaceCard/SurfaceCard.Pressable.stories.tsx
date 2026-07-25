import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Avatar, AvatarFallback, Button } from "@heroui/react"
import { SurfaceCard } from "@sb-components/blocks/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (Layouts) — vỏ card BẤM-ĐƯỢC, slot-agnostic: khung surface + phản hồi press
 * (hover trơ, `active:scale-[0.97]` + ripple). Tồn tại vì HeroUI v3 `Card` là `<div>`
 * không tương tác — khung này đặt đúng bộ style card lên một `<button>`/`<a>` thật.
 *
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): story ở đây CHỈ render state do CHÍNH
 * `.Pressable` đẻ ra — đích press (`onPress`/`href`), stretched-link (`actions` + `label`),
 * `isSelected`, `isDisabled`, `isSkeleton`. Bộ slot `header`/`body`/`footer` là cơ chế
 * CHUNG của khung-bọc, đã diễn ở `SurfaceCard.Base` → không lặp lại.
 *
 * ANATOMY IS PER-LEAF: mỗi story là một leaf riêng với BlockAnatomy riêng — phần lớn chỉ
 * có `Content`; `WithActions` thêm part thứ hai `Actions`, `Loading` sụp về mirror `Skeleton`.
 */
const meta: Meta<typeof SurfaceCard.Pressable> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.Pressable",
    component: SurfaceCard.Pressable,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Pressable>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8"><div className="max-w-md">{node}</div></div>

/**
 * Fixture chuẩn (C-fixture) = ProfileCard (avatar + title + description). LƯU Ý:
 * `SurfaceCard.Pressable` tự vẽ khung card (surface/rounded-3xl/p-3/shadow-surface), nên
 * ở đây KHÔNG bọc thêm `Card`/`CardContent` ngoài — chỉ giữ row bên trong, tránh
 * card-in-card.
 */
const ProfileRow = () => (
    <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">StarCi Academy</span>
            <span className="truncate text-xs text-muted">
                Học fullstack, system design và DevOps theo lộ trình phỏng vấn.
            </span>
        </div>
    </div>
)

// Whole-card press target (Default / AsLink / Selected / Disabled): nội dung caller
// compose CHÍNH LÀ nhãn a11y của cả thẻ — MỘT part có tên.
const CONTENT_PARTS: Array<AnatomyNode> = [
    { name: "Content", tier: "primitive", role: "nội dung tự do do caller compose — cũng là nhãn a11y của cả thẻ" },
]

// Stretched-link (actions + label): overlay bấm-toàn-thẻ NẰM DƯỚI một vùng nút phụ
// bấm riêng được — HAI part có tên.
const ACTIONS_PARTS: Array<AnatomyNode> = [
    { name: "Content", tier: "primitive", role: "nội dung tự do do caller compose" },
    { name: "Actions", tier: "primitive", role: "vùng nút phụ độc lập (Continue + menu), đứng trên overlay press toàn thẻ" },
]

// Loading: nhánh isSkeleton thay CẢ hai slot bằng một mirror chung — shape khác hẳn,
// không phụ thuộc shape thật của body.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "primitive", role: "mirror khối icon + 2 dòng chữ, không phụ thuộc body thật" },
]

/** Default — tile điều hướng: cả thẻ là MỘT đích press, body của nó là nhãn a11y. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="Default"
                parts={CONTENT_PARTS}
                reason="Cần MỘT khung card có press-feedback (hover trơ, lún nhẹ + ripple) dùng chung cho mọi tile bấm-được — thay vì mỗi nơi tự viết lại surface/rounded-3xl/p-3/shadow-surface + ripple. Slot-agnostic (body tự do) nên đứng ở tầng khung; chỉ khi cần nút phụ độc lập bên trong (stretched-link) mới phát sinh part thứ hai (Actions)."
                code={`<SurfaceCard.Pressable onPress={() => {}}>
  <ProfileRow />
</SurfaceCard.Pressable>`}
            >
                <SurfaceCard.Pressable onPress={() => {}} showAnatomy>
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
        ),
}

/** `href` — cả thẻ là MỘT link a11y (điều hướng khi click). */
export const AsLink: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="AsLink"
                parts={CONTENT_PARTS}
                note="`href` thay `onPress` → thẻ render <a>, cùng shape (một Content) với leaf Default."
                code={`<SurfaceCard.Pressable href="#">
  <ProfileRow />
</SurfaceCard.Pressable>`}
            >
                <SurfaceCard.Pressable href="#" showAnatomy>
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
        ),
}

/**
 * `actions` + `label` — vùng press thứ hai, độc lập, nằm TRONG thẻ (stretched-link):
 * overlay bấm-toàn-thẻ TRONG SUỐT nằm dưới, CTA + menu đứng trên nên bấm riêng được.
 * TypeScript ép `label` thành BẮT BUỘC ngay khi có `actions` (overlay không có chữ nào).
 */
export const WithActions: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="WithActions"
                parts={ACTIONS_PARTS}
                note="`actions` + `label` → chuyển sang stretched-link: overlay bấm-toàn-thẻ TRONG SUỐT nằm dưới Content, Actions đứng trên overlay (z-10) để Continue/menu bấm riêng được."
                code={`<SurfaceCard.Pressable
  onPress={() => {}}
  label="Open the StarCi Academy profile"
  actions={
    <>
      <Button size="sm" variant="secondary">Continue</Button>
      <Button size="sm" variant="tertiary" isIconOnly aria-label="More options">⋯</Button>
    </>
  }
>
  <ProfileRow />
</SurfaceCard.Pressable>`}
            >
                <SurfaceCard.Pressable
                    onPress={() => {}}
                    label="Open the StarCi Academy profile"
                    showAnatomy
                    actions={(
                        <>
                            <Button size="sm" variant="secondary" onPress={() => {}}>Continue</Button>
                            <Button size="sm" variant="tertiary" isIconOnly aria-label="More options" onPress={() => {}}>⋯</Button>
                        </>
                    )}
                >
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
        ),
}

/** `isSelected` — ô ĐƯỢC CHỌN trong một lưới chọn: ring accent quanh thẻ (tương đương dấu check của row). */
export const Selected: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="Selected"
                parts={CONTENT_PARTS}
                note="`isSelected` chỉ thêm `ring-2 ring-accent` + `aria-pressed`/`aria-current` — cùng shape Content với leaf Default."
                code={`<SurfaceCard.Pressable isSelected onPress={() => {}}>
  <ProfileRow />
</SurfaceCard.Pressable>`}
            >
                <SurfaceCard.Pressable isSelected onPress={() => {}} showAnatomy>
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
        ),
}

/** `isDisabled` — lựa chọn tạm thời không dùng được: dim + tắt tương tác, VẪN hiện để sự tồn tại của nó đọc được. */
export const Disabled: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="Disabled"
                parts={CONTENT_PARTS}
                note="`isDisabled` chỉ dim + tắt tương tác (không ripple/không press-scale) — cùng shape Content với leaf Default."
                code={`<SurfaceCard.Pressable isDisabled onPress={() => {}}>
  <ProfileRow />
</SurfaceCard.Pressable>`}
            >
                <SurfaceCard.Pressable isDisabled onPress={() => {}} showAnatomy>
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
        ),
}

/** Đang tải — `isSkeleton` tự vẽ mirror (khối icon + 2 dòng chữ), không cần Skeleton rời. */
export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="`isSkeleton` thay TOÀN BỘ nội dung bằng một mirror chung (icon tile + 2 thanh chữ) — khác composition hẳn với các leaf Content/Actions ở trên."
                code={`<SurfaceCard.Pressable
  isSkeleton
/>`}
            >
                <SurfaceCard.Pressable isSkeleton showAnatomy>
                    <ProfileRow />
                </SurfaceCard.Pressable>
            </BlockAnatomy>,
        ),
}

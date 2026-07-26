import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Avatar, AvatarFallback, Button } from "@heroui/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
 * `.Pressable` KHÔNG nằm trong BA TRỤC `variant`/`padding`/`radius` (thầy chốt
 * 2026-07-26) — chỉ `.Base`/`.Nested`/`.List`/`.Accordion`/`.CrossList` có ba prop đó.
 *
 * ANATOMY: mỗi story là một leaf riêng với BlockAnatomy riêng. 2026-07-26 (thầy) —
 * panel bỏ prop `parts`/`AnatomyNode` (đường cũ, khai cấu trúc bằng tay) lẫn tab
 * States; cấu trúc nay suy từ DOM, chú giải qua `annotate` CHỈ khi part có `storyId`
 * THẬT (bấm nhảy được). `Content`/`Actions`/`Skeleton` ở đây là các slot NỘI BỘ của
 * chính `.Pressable`, không component nào trong số đó có story riêng để trỏ tới —
 * nên bỏ hẳn prop panel-parts, không thay bằng `annotate` rỗng.
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
                Learn fullstack, system design, and DevOps on an interview-prep roadmap.
            </span>
        </div>
    </div>
)

/** Default — tile điều hướng: cả thẻ là MỘT đích press, body của nó là nhãn a11y. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.Pressable"
                tier="primitive"
                leaf="Default"
                reason="Needs ONE card frame with press feedback (inert hover, a subtle press-in + ripple) shared by every pressable tile — instead of every call site re-writing surface/rounded-3xl/p-3/shadow-surface + ripple by hand. Slot-agnostic (free-form body), so it belongs at the khung tier; a second part (Actions) only appears once the card also needs its own independent buttons (stretched-link)."
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
                note="`href` replaces `onPress` → the card renders an `<a>`, same shape (one Content) as leaf Default."
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
                note="`actions` + `label` → switches to the stretched-link pattern: a transparent whole-card press overlay sits under Content, and Actions sit above the overlay (z-10) so Continue/menu stay separately clickable."
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
                note="`isSelected` only adds `ring-2 ring-accent` + `aria-pressed`/`aria-current` — same Content shape as leaf Default."
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
                note="`isDisabled` only dims + disables interaction (no ripple / no press-scale) — same Content shape as leaf Default."
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
                note="`isSkeleton` replaces the ENTIRE content with a shared mirror (icon tile + 2 text bars) — a completely different composition from the Content/Actions leaves above."
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

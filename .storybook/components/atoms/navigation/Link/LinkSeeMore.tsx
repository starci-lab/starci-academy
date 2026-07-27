import React from "react"
import type { ReactNode } from "react"
import { Link as HeroUILink, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/navigation/SeeMoreLink`.
 * Authored in Storybook (not `src`); synced to `src` later.
 *
 * Reused by the surface-card header ("Xem thêm →") and by ContinueCard's item CTA
 * (`decorative`), so both read as the same control.
 *
 * 2026-07-26: gộp vào namespace `Link.*` cùng `LinkBack` (§12a) — "quay lại" và
 * "xem thêm" là hai hình thái của cùng một khái niệm (text-link + mũi tên), không
 * phải hai component rời.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Visual size for {@link LinkSeeMore} — mirrors the label row it sits beside
 * (`sm` next to a section label, `xs` next to a subtle eyebrow).
 */
export type LinkSeeMoreSize = "sm" | "xs"

/** Props for {@link LinkSeeMore}. */
export interface LinkSeeMoreProps {
    /** Link label — e.g. "Xem thêm", "Tiếp tục", "Xem tất cả". */
    label: ReactNode
    /**
     * Press handler. Ignored when {@link href} is set, and when
     * {@link decorative} is true (the parent owns the press target).
     */
    onPress?: () => void
    /** Optional destination URL. Takes priority over {@link onPress}. */
    href?: string
    /**
     * When true, render plain markup (no own `<a>`/`<button>`) — for use inside
     * an already-interactive surface (e.g. ContinueCard `item`, where the whole
     * card is the one press target). Hover still rides on a parent `group`
     * class: opacity fade + arrow slide.
     */
    decorative?: boolean
    /** Text size. Defaults to `sm`. */
    size?: LinkSeeMoreSize
    /** Extra classes on the link. */
    className?: string
    /** `true` → gắn `data-anat-part` cho từng part để BlockAnatomy badge. */
    showAnatomy?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Shared look — semibold accent text + `gap-2` tới mũi tên.
 *
 * ⭐ 2026-07-26 (thầy, khi gom namespace `Link`): `gap-1` → `gap-2` cho khớp
 * {@link LinkBack}. Hai member nằm cùng một namespace mà chừa hai khoảng cách khác
 * nhau giữa chữ và mũi tên là drift — gom lại chính là để lộ ra chỗ này.
 */
const baseClassName = (size: LinkSeeMoreSize, className?: string) =>
    cn(
        "inline-flex w-fit shrink-0 items-center gap-2 font-semibold text-accent-soft-foreground no-underline",
        TEXT_CLASS[size],
        className,
    )

/** `size` → cỡ CHỮ. Tách bảng để nó đứng cạnh {@link ARROW_CLASS}, không lệch nhau được. */
const TEXT_CLASS: Record<LinkSeeMoreSize, string> = {
    sm: "text-sm",
    xs: "text-xs",
}

/**
 * `size` → cỡ MŨI TÊN. Icon là HÀM của size (§12d) — caller KHÔNG chỉnh riêng.
 *
 * Thang §5a (đối chiếu font-size, không phải line-height): `text-sm` 14px → `size-3.5`
 * (14px) · `text-xs` 12px → `size-3` (12px). Cả hai đều nhỏ hơn `size-5` nên đều
 * `weight="bold"` (§5.0a).
 *
 * ❌ neo (2026-07-26): trước đó mũi tên khoá cứng `size-3.5` cho CẢ HAI size — leaf
 * `Size` render hai chữ khác cỡ mà mũi tên y hệt nhau, đúng dấu hiệu "hai ô nhìn
 * giống nhau = LỖI ATOM" của §12g. Story render đủ union chính là cái bắt được.
 */
const ARROW_CLASS: Record<LinkSeeMoreSize, string> = {
    sm: "size-3.5",
    xs: "size-3",
}

/**
 * Nhãn — gạch chân khi hover, ĐÚNG như {@link LinkBack}.
 *
 * ⭐ 2026-07-26 (thầy): thay `opacity-60` cũ. Cùng một hành vi "đi tới đó" mà hai
 * member cho hai tín hiệu khác nhau (một gạch chân, một mờ đi) thì người đọc phải
 * học hai lần. Gạch chân là affordance go-there chuẩn của hệ; mờ-đi dễ đọc nhầm
 * thành *đang bị vô hiệu*.
 *
 * Gạch chân đặt trên NHÃN chứ không trên cả cụm, để mũi tên không bị gạch theo.
 */
const LABEL_HOVER = "underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline"

/**
 * The shared "See more →" / "Continue →" affordance: semibold accent text + an
 * ARROW that slides right on hover (§5b — ARROW is the CTA affordance that slides;
 * a caret would NOT slide), and the LABEL underlines on hover — same go-there
 * signal as {@link LinkBack}, only mirrored (its arrow slides left). Used by
 * `SurfaceCardHeader`'s `onSeeMore` and ContinueCard's item CTA so both read as
 * the same control.
 *
 * @param props - {@link LinkSeeMoreProps}
 */
export const LinkSeeMore = ({
    label,
    onPress,
    href,
    decorative = false,
    size = "sm",
    className,
    showAnatomy = false,
    anatPart,
}: LinkSeeMoreProps) => {
    // Tên node PHẢI khớp CÁI ĐANG RENDER THẬT (2026-07-27, heroui tier): chỉ nhánh
    // `HeroUILink` (không `href`, không `decorative`) thực sự là component heroui
    // `Link` — hai nhánh kia render `<a>`/`<span>` trần, gắn tên "Link" ở đó là bịa
    // (Rule 1). Fallback chỉ áp dụng cho đúng nhánh heroui; `anatPart` do composite
    // cha forward vẫn thắng tuyệt đối, bất kể thẻ nào.
    const isHeroUILinkBranch = !decorative && !href
    const rootPart = anatPart ?? (showAnatomy && isHeroUILinkBranch ? "Link" : undefined)

    // `Arrow` KHÔNG được tag: span nội bộ bọc glyph Phosphor, không phải component
    // thật của ta lẫn heroui (cùng lý do `Icon` span của `Tabs.Base` không được tag).
    const arrow = (
        <span aria-hidden className="inline-flex shrink-0">
            {/*
              Glyph Phosphor ở `size-3.5` cho khớp `text-sm`, nhỏ hơn `size-5` nên
              phải `weight="bold"` bù nét (§5.0a). Tailwind v4: `translate` là
              property RIÊNG → transition phải `[translate]`, `transition-transform`
              không ăn. Cùng khuôn `LinkBack`/`Breadcrumbs` — chỉ khác chiều trượt.
            */}
            <ArrowRightIcon
                focusable="false"
                weight="bold"
                className={cn(ARROW_CLASS[size], "shrink-0 transition-[translate] group-hover:translate-x-1")}
            />
        </span>
    )

    // Nhãn tách ra một span riêng để gạch chân chỉ ăn vào CHỮ, mũi tên đứng ngoài.
    const text = <span className={LABEL_HOVER}>{label}</span>

    if (decorative) {
        // Parent supplies `group` (e.g. ContinueCard wrapper) — hover fires from
        // anywhere on that surface, not a hover zone of this span alone.
        return (
            <span data-anat-part={rootPart} className={baseClassName(size, className)}>
                {text}
                {arrow}
            </span>
        )
    }

    const interactiveClassName = cn(baseClassName(size, className), "group cursor-pointer")

    if (href) {
        return (
            <a data-anat-part={rootPart} href={href} className={interactiveClassName}>
                {text}
                {arrow}
            </a>
        )
    }

    return (
        <HeroUILink data-anat-part={rootPart} onPress={onPress} className={interactiveClassName}>
            {text}
            {arrow}
        </HeroUILink>
    )
}

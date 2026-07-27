import React from "react"
import type { ReactNode } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { CheckIcon } from "@phosphor-icons/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the target `StepBadge`. Authored in Storybook
 * (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * Grounded in the numbered step badge hand-rolled inline in `GithubTeamGate`
 * (`src/components/features/auth/GithubTeamGate/index.tsx`, `stepBadge(n)`:
 * `flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft
 * text-xs font-medium text-accent-soft-foreground`) and generalised against the
 * private `StepIndicator` inside the `Stepper` port
 * (`.storybook/stories/blocks/navigation/Stepper/Stepper.tsx`, states
 * done/current/upcoming) into a standalone, reusable numbered/checked badge so
 * any step-style flow (guided modals, wizards, changelogs…) can drop it in
 * without re-hand-rolling a local `stepBadge` closure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Visual state of the badge. */
export type StepBadgeState = "done" | "active" | "muted"

/** Badge size. */
export type StepBadgeSize = "sm" | "md"

/** Props chung — TRỪ cụm `number`/`isSkeleton` (xem {@link StepBadgeProps}). */
interface StepBadgeOwnProps {
    /**
     * Visual state. `"done"` swaps the number for a check and fills success
     * (step completed); `"active"` fills accent-soft (the current step —
     * matches the original hand-rolled badge); `"muted"` reads as a
     * not-yet-reached step. Defaults to `"active"`.
     */
    state?: StepBadgeState
    /** Badge size. Defaults to `"sm"` (20px, matches the hand-rolled `size-5`). */
    size?: StepBadgeSize
    /** Extra classes. */
    className?: string
    /** `true` → gắn `data-anat-part` cho từng part để `BlockAnatomy` badge được. */
    showAnatomy?: boolean
    /**
     * Tên `data-anat-part` gắn ở GỐC badge. Component BỌC nó (vd `Stepper`) truyền
     * xuống (vd `"StepBadge"`) để cây deps nhận ra "chỗ này là một StepBadge" — cây
     * dựng từ DOM nên không có nhãn thì không thấy.
     */
    anatPart?: string
}

/**
 * `number` BẮT BUỘC khi render badge thật, KHÔNG cần khi `isSkeleton` — pill shimmer
 * không có nội dung để căn giữa. Cùng khuôn với `ChipBaseProps`/`TypographyProps` (§12c).
 */
export type StepBadgeProps = StepBadgeOwnProps &
    ({ isSkeleton: true; number?: ReactNode } | { isSkeleton?: false; number: ReactNode })

/** state → filled tone. */
const STATE: Record<StepBadgeState, string> = {
    done: "bg-success text-success-foreground",
    active: "bg-accent-soft text-accent-soft-foreground",
    muted: "bg-default text-muted",
}

/** size → badge box + text scale + auto icon size (§5: text-xs → size-4, text-sm → size-5). */
const SIZE: Record<StepBadgeSize, string> = {
    sm: "size-5 text-xs [&_svg]:size-4",
    md: "size-6 text-sm [&_svg]:size-5",
}

/**
 * size → WEIGHT của glyph, bảng đặt NGAY CẠNH {@link SIZE} để hai thang không lệch.
 *
 * §5.0a: `sm` render icon `size-4` (16px < 20px) ⇒ `bold` bù nét; `md` render `size-5`
 * (20px, đúng cỡ chuẩn) ⇒ `regular`.
 *
 * ❌ neo (2026-07-26): trước đó `weight="bold"` ép CỨNG cho cả hai — nấc `md` vì thế
 * đậm hơn mọi glyph `size-5` khác trong hệ. Đây là ca NGƯỢC với lỗi thường gặp (quên
 * bold ở cỡ nhỏ), nên quét theo hướng "thiếu bold" sẽ không bao giờ thấy nó.
 */
const ICON_WEIGHT: Record<StepBadgeSize, "regular" | "bold"> = {
    sm: "bold",
    md: "regular",
}

/** size → skeleton box (mirrors {@link SIZE} without the text/icon scale). */
const SKELETON_SIZE: Record<StepBadgeSize, string> = {
    sm: "size-5",
    md: "size-6",
}

/**
 * A generic, round numbered badge for step-by-step flows — a leading
 * indicator showing either a number/glyph or (once `state="done"`) a check.
 * Pure/props-only; owns its size + tone (§4) so callers just pass the number
 * and a state, e.g. a guided-flow ordered list (`1` active → `2`/`3` muted,
 * flipping to `done` as each step completes).
 *
 * @param props - {@link StepBadgeProps}
 */
const StepBadgeBase = ({
    number,
    state = "active",
    size = "sm",
    className,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: StepBadgeProps) => {
    if (isSkeleton) {
        // Nhánh skeleton xét TRƯỚC mọi nhánh rẽ hình (§12c) — không có `number` để căn giữa.
        return (
            <HeroSkeleton
                className={cn("rounded-full", SKELETON_SIZE[size], className)}
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
            />
        )
    }
    return (
        <span
            aria-hidden
            data-anat-part={anatPart ?? (showAnatomy ? "Badge" : undefined)}
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full font-medium",
                SIZE[size],
                STATE[state],
                className,
            )}
        >
            {state === "done" ? (
                <span aria-hidden data-anat-part={showAnatomy ? "Icon" : undefined} className="inline-flex shrink-0">
                    <CheckIcon weight={ICON_WEIGHT[size]} />
                </span>
            ) : (
                number
            )}
        </span>
    )
}

/** `StepBadge.*` — numbered step-badge namespace. */
export const StepBadge = Object.assign(StepBadgeBase, {
    Base: StepBadgeBase,
})

import React from "react"
import { Link as HeroUILink, cn } from "@heroui/react"
import { ArrowLeftIcon } from "@phosphor-icons/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/navigation/BackLink`.
 * Authored in Storybook (not `src`); synced to `src` later.
 *
 * The real block derives its label from next-intl (`common.goBack` /
 * `common.goBackTo`); this local copy inlines English defaults ("Back") so the
 * design renders standalone without the i18n provider.
 *
 * 2026-07-26: gộp vào namespace `Link.*` cùng `LinkSeeMore` (§12a) — "quay lại" và
 * "xem thêm" là hai hình thái của cùng một khái niệm (text-link + mũi tên), không
 * phải hai component rời.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link LinkBack}. */
export interface LinkBackProps {
    /** Full label override; omit to compose from `target` / the generic "Back". */
    label?: string
    /** Destination name appended to the generic label — "Back to {target}" (e.g. "Back to preview"). */
    target?: string
    /** Fired when the link is pressed — the caller owns the routing. */
    onPress: () => void
    /** `true` → tag the root with `data-anat-part="Link"` (heroui tier, 2026-07-27) so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    /** Anatomy tag override — a composite forwards its OWN atom name here (e.g. `"Link.Back"`) so the deps tree can jump to this atom's own story instead of the underlying HeroUI element. */
    anatPart?: string
    /** Extra classes on the link. */
    className?: string
}

/**
 * The single back affordance of a leaf / sub-view page ("← Back",
 * "← Back to challenge"…), rendered top-left — typically into `PageHeader`'s
 * `breadcrumb` slot. A quiet text link (muted), NOT a pill/button. Hover =
 * the arrow slides left + the label underlines (go-there affordance); the
 * atom owns the look so every back link reads the same.
 *
 * @param props - {@link LinkBackProps}
 */
export const LinkBack = ({ label, target, onPress, showAnatomy = false, anatPart, className }: LinkBackProps) => {
    const text = label ?? (target ? `Back to ${target}` : "Back")

    return (
        <HeroUILink
            onPress={onPress}
            data-anat-part={anatPart ?? (showAnatomy ? "Link" : undefined)}
            className={cn(
                "group flex w-fit cursor-pointer items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-foreground",
                className,
            )}
        >
            {/*
              Glyph Phosphor ở `size-3.5` cho khớp `text-sm`, nhỏ hơn `size-5` nên
              phải `weight="bold"` bù nét (§5.0a). Tailwind v4: `translate` là
              property RIÊNG → transition phải `[translate]`, `transition-transform`
              không ăn (mũi tên nhảy giật thay vì trượt). Cùng khuôn `Breadcrumbs`.
            */}
            <ArrowLeftIcon
                aria-hidden
                focusable="false"
                weight="bold"
                className="size-3.5 transition-[translate] group-hover:-translate-x-1"
            />
            <span className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">{text}</span>
        </HeroUILink>
    )
}

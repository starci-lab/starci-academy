import React from "react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import { Tabs as HeroTabs, Badge as HeroBadge, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Tabs`: the ONE constrained tab-strip atom over HeroUI `Tabs`.
 *
 * Data-driven (like `Chip` is prop-driven): the caller passes `items`
 * (id + label + optional `icon`/`badge`/`isDisabled`) and the atom renders the
 * FULL HeroUI compound internally — `Tabs.ListContainer > Tabs.List > Tabs.Tab`
 * (+ `Tabs.Indicator`) plus the `sr-only` `Tabs.Panel`s react-aria needs to keep
 * the tab↔tabpanel ARIA relationship valid. Variants (icon / badge / disabled)
 * are LEAVES driven by per-item props, NOT separate components (§6 granularity).
 *
 * Rules (Chip/Input):
 *   • NAMESPACE bắt buộc — chỉ export `Tabs = { Base, Extended }` (từ `./Tabs`),
 *     không export component trần từ file này (thầy chốt 2026-07-25).
 *   • KHÔNG `children` — tab truyền qua `items` dữ liệu; `label` là prop
 *     `ReactNode` (nhãn), không phải children.
 *   • Bọc HeroUI TỐI ĐA (`Tabs`, `Badge`), alias `Hero*`.
 *   • STRICT §4: `selectedKey` + `onSelectionChange` TRẦN — the atom owns all
 *     tab chrome (indicator, icon scale `size-4`, badge float); the consumer
 *     never touches the compound structure.
 *   • `icon` = COMPONENT reference (`icon: House`), atom renders it at label
 *     scale — caller can't inject a wrong-size glyph (§5).
 *   • `isSkeleton` → tab-strip skeleton co-located (HeroSkeleton, hybrid C);
 *     shape follows `variant` (pill vs underline bar) — fixed 2026-07-27, see
 *     prop doc below.
 *
 * Tách file 2026-07-26 (theo khuôn `Button/ButtonBase.tsx`): namespace `Tabs.*`
 * gom ở `./Tabs.tsx`, member này chỉ chứa `TabsBase`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** An icon passed as a COMPONENT (e.g. `House`), rendered by the atom at label scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/**
 * Glyph của tab — cỡ + nét, một chỗ duy nhất (§4: atom sở hữu scale, caller đưa icon TRẦN).
 *
 * Nhãn tab là `text-sm` (14px, đo DOM 2026-07-26) ⇒ glyph `size-3.5` (14px) theo thang
 * §5a (đối chiếu FONT-SIZE, không phải line-height), và vì nhỏ hơn `size-5` nên phải
 * `weight="bold"` bù nét (§5.0a).
 *
 * ❌ neo (2026-07-26): trước đó là `size-4` (16px) TRẦN, không weight — icon to hơn chữ
 * một nấc và nét mảnh hơn mọi atom khác cùng hàng. Sai lặng lẽ vì không có gì kiểm.
 */
const TAB_ICON_CLASS = "size-3.5"
const TAB_ICON_WEIGHT = "bold" as const

/** One tab in a {@link TabsBase} strip. */
export interface TabItem {
    /** Stable id used as the selection key. */
    key: string
    /** Tab label text. */
    label: ReactNode
    /** Leading icon as a COMPONENT reference (not JSX). Atom renders it at `size-3.5` + `bold` (§5a/§5.0a). */
    icon?: IconComponent
    /** Count/notice floated over the label as a HeroUI `Badge` (e.g. `3`, `"9+"`). */
    badge?: ReactNode
    /** Render the tab but block selection. */
    isDisabled?: boolean
}

/** Props for {@link TabsBase}. */
export interface TabsBaseProps {
    /** Tabs in display order. */
    items: Array<TabItem>
    /** Currently selected tab id (controlled). */
    selectedKey: string
    /** Fired with the newly selected tab id. */
    onSelectionChange: (key: string) => void
    /** Accessible name for the tab list. */
    ariaLabel: string
    /**
     * `"primary"` (default) = HeroUI's segmented pill for a page-level panel
     * switch. `"secondary"` = the underline in-page content-tabs look.
     */
    variant?: "primary" | "secondary"
    /**
     * Render the tab-strip shimmer instead of the tabs. Shape follows `variant`
     * — filled pill for `primary`, label+underline bar for `secondary` — so the
     * loading shape matches what the real strip is about to become.
     */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/**
 * The tab-strip atom. See file header for the strict data-driven contract.
 *
 * @param props - {@link TabsBaseProps}
 */
export const TabsBase = ({
    items,
    selectedKey,
    onSelectionChange,
    ariaLabel,
    variant = "primary",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: TabsBaseProps) => {
    if (isSkeleton) {
        // Leaf skeleton OWNED by the atom (hybrid C) — shape follows `variant`,
        // known ahead of load same as `size` on Button (§12g): `primary` is
        // a filled segmented pill, `secondary` an underline in-page tab, so its
        // shimmer is a label bar + underline bar, not a pill. Before this branch,
        // BOTH variants rendered the identical pill shimmer — a real layout jump
        // once secondary's actual underline tabs mounted (same bug class as the
        // `Button` skeleton once using one fixed width for every size).
        // Real heroui render is each `HeroSkeleton` (`Skeleton`) bar itself, NOT the plain
        // wrapping `<div>` — tagging the div would be a made-up name (2026-07-27).
        if (variant === "secondary") {
            return (
                <div className={cn("flex items-center gap-2", className)}>
                    {items.map((item) => (
                        <div key={item.key} className="flex flex-col items-center gap-2 px-1 py-2">
                            <HeroSkeleton className="h-4 w-14 rounded-md" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                            <HeroSkeleton className="h-0.5 w-14 rounded-full" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                        </div>
                    ))}
                </div>
            )
        }
        return (
            <div className={cn("flex items-center gap-2", className)}>
                {items.map((item) => (
                    <HeroSkeleton key={item.key} className="h-9 w-24 rounded-xl" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                ))}
            </div>
        )
    }
    return (
        <HeroTabs
            variant={variant}
            selectedKey={selectedKey}
            onSelectionChange={(key) => onSelectionChange(String(key))}
            className={cn("whitespace-nowrap", className)}
        >
            <HeroTabs.ListContainer>
                <HeroTabs.List aria-label={ariaLabel}>
                    {items.map((item) => {
                        const Icon = item.icon
                        return (
                            <HeroTabs.Tab
                                key={item.key}
                                id={item.key}
                                isDisabled={item.isDisabled}
                                data-anat-part={showAnatomy ? "Tabs.Tab" : undefined}
                            >
                                <span className="flex items-center gap-2">
                                    {Icon ? (
                                        // Atom owns the glyph scale (§4/§5) — untagged: a plain span
                                        // wrapping a caller-supplied Phosphor icon, not a real named
                                        // component of ours or of heroui (§ two-rule pass, 2026-07-27).
                                        <span aria-hidden className="inline-flex shrink-0">
                                            <Icon className={TAB_ICON_CLASS} weight={TAB_ICON_WEIGHT} />
                                        </span>
                                    ) : null}
                                    {item.badge !== undefined && item.badge !== null ? (
                                        // `Badge.Anchor` neo badge vào góc TRÊN-PHẢI của anchor, mà anchor ở
                                        // đây ôm sát một dòng CHỮ — chữ không có góc trống nào nên badge đè
                                        // lên nét chữ (đo 2026-07-26: phủ 12px với badge 1 ký tự, 14px với
                                        // `9+`; thò ra ngoài 4–5px).
                                        //
                                        // `pr-4` chừa 16px cho badge đậu (≥ 14px đo được, dư một nhịp cho
                                        // badge 3 ký tự). ⚠️ ĐÁNH ĐỔI (thầy chốt 2026-07-26, đã cân nhắc
                                        // phương án đặt số CẠNH nhãn rồi bỏ): nhãn có badge bị đệm LỆCH một
                                        // bên, nên tab có badge rộng hơn tab không có ⇒ khoảng cách giữa các
                                        // tab không còn đều. Giữ vẻ "nổi" là lý do chọn cách này.
                                        <HeroBadge.Anchor className="pr-4" data-anat-part={showAnatomy ? "Badge.Anchor" : undefined}>
                                            <span>{item.label}</span>
                                            <HeroBadge size="sm" color="danger" data-anat-part={showAnatomy ? "Badge" : undefined}>
                                                {item.badge}
                                            </HeroBadge>
                                        </HeroBadge.Anchor>
                                    ) : (
                                        <span>{item.label}</span>
                                    )}
                                </span>
                                <HeroTabs.Indicator data-anat-part={showAnatomy ? "Tabs.Indicator" : undefined} />
                            </HeroTabs.Tab>
                        )
                    })}
                </HeroTabs.List>
            </HeroTabs.ListContainer>
            {/* react-aria's useTab always computes an `aria-controls` id pointing at a
                tabpanel; this atom carries no panel CONTENT (callers render their own
                below), so these stay empty/`sr-only` to satisfy the ARIA relationship. */}
            {items.map((item) => (
                <HeroTabs.Panel key={item.key} id={item.key} className="sr-only">
                    {null}
                </HeroTabs.Panel>
            ))}
        </HeroTabs>
    )
}

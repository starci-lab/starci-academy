import React from "react"
import type { ReactNode } from "react"
import { Tabs as HeroTabs, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Tabs.Extended`: full port of `@/components/blocks/navigation/ExtendedTabs`,
 * gộp vào namespace `Tabs.*` bên cạnh `Tabs.Base` (2026-07-26, thầy chốt: hai
 * component cùng bọc HeroUI `Tabs` phải sống chung một namespace).
 *
 * The `.extended-tabs` hug-content override lives in the app globals.css (kept in
 * `src`), so the `variant="secondary"` look renders here only when Storybook loads
 * those globals — the class name is preserved verbatim for fidelity.
 *
 * ✅ `children` Ở ĐÂY LÀ NGOẠI LỆ §12b CÓ TÊN — atom-WRAPPER (thẩm tra lại 2026-07-26).
 *
 *   Bản ghi trước gọi đây là "VI PHẠM §12b thật", lý lẽ: *`Tabs.Base` đã chứng minh
 *   cùng bài toán chọn-1-trong-N đi được bằng `items`*. Lý lẽ đó **SAI**, vì nó chỉ
 *   nhìn `Tabs.Base` mà không nhìn consumer. Đọc `Toolbar` (layout, consumer thật)
 *   thì mỗi `Tabs.Tab` nó dựng mang ba thứ mà `TabItem` KHÔNG chở nổi:
 *     • class theo `accent` / `muted` — hình của Toolbar, không phải của atom;
 *     • ẩn nhãn trên mobile khi có icon (`sr-only @app-sm:not-sr-only`) — hành vi
 *       responsive của Toolbar;
 *     • `size="sm"` bơm class riêng vào từng tab.
 *
 *   Ép sang `items` nghĩa là nhồi ba trục ấy vào atom, tức atom gánh ngữ nghĩa của
 *   caller — vi phạm §12b theo CHIỀU NGƯỢC LẠI, nặng hơn. Nên hai member cùng bọc
 *   HeroUI `Tabs` mà khác đường vào là ĐÚNG, không phải nợ:
 *     • `Tabs.Base`     — DỮ LIỆU (`items`), atom tự dựng, dùng khi tab là nội dung thuần.
 *     • `Tabs.Extended` — WRAPPER, caller dựng cây `Tabs.*` khi cần chrome riêng.
 *   Cùng nhóm ngoại lệ với `Tooltip.Base` (bọc trigger bất kỳ) / `Badge.Base`.
 *
 * ⚠️ Nợ THẬT còn lại (khác cái trên): hình của `variant="secondary"` dựa vào class
 * GLOBAL `.extended-tabs` nằm ở `src/app/globals.css`, KHÔNG ở bản vẽ — sửa hình
 * phải sang `src` (§0). Cùng bệnh với `.highlight-card-sweep`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link TabsExtended}. */
export interface TabsExtendedProps {
    /** Currently selected tab id (controlled). */
    selectedKey: string
    /** Fired with the newly selected tab id. */
    onSelectionChange: (key: string) => void
    /**
     * Tab anatomy — keep using the HeroUI compound parts inside:
     * `Tabs.ListContainer` > `Tabs.List` > `Tabs.Tab` (+ `Tabs.Indicator`).
     *
     * ✅ NGOẠI LỆ §12b có tên (atom-WRAPPER) — KHÔNG phải nợ. Caller dựng cây `Tabs.*`
     * vì mỗi tab có thể mang chrome riêng của nó (class theo accent/muted, ẩn nhãn
     * responsive) mà một `TabItem` dữ liệu không chở nổi. Cần tab thuần nội dung thì
     * dùng `Tabs.Base` (`items`). Xem header file để đọc bằng chứng.
     */
    children: ReactNode
    /**
     * HeroUI `Tabs` variant. `"secondary"` (default) = in-page CONTENT tabs —
     * hugs its own label width (packs left, `.extended-tabs` override), no
     * outer baseline (the feature wrapper owns any full-width chrome; see
     * `Toolbar.Base` §1). `"primary"` = page-FEATURE tabs that switch the ENTIRE
     * panel content — HeroUI's own default rendering (segmented pill,
     * full-width, evenly-stretched tabs), untouched by the `.extended-tabs`
     * hug-content override. Use `"primary"` for top-level section switches
     * (e.g. Bắt đầu/Lịch sử/Thống kê), `"secondary"` for a content filter/
     * language-switcher riding alongside a reading column.
     */
    variant?: "primary" | "secondary"
    /**
     * `"md"` (default) = full-width (`w-full`), evenly-stretched tabs — the
     * only size this block used to support. `"sm"` shrinks a `"primary"` tab
     * strip to `w-fit` (segments size to their label, don't stretch) — for a
     * compact secondary choice that shouldn't claim the full row (e.g. a
     * setting nested inside a modal panel). Has no effect on `"secondary"`
     * (already hug-content via `.extended-tabs`).
     */
    size?: "sm" | "md"
    /**
     * `true` → tag the root `HeroTabs` with `data-anat-part="Tabs"` so a BlockAnatomy
     * panel can badge it (heroui tier, 2026-07-27). The `children` tree is the
     * CALLER's own — it stays untagged here, since it isn't this atom's own render.
     */
    showAnatomy?: boolean
    /** Extra classes on the root `Tabs`. */
    className?: string
}

/**
 * The StarCi standard tab strip: a thin wrapper over the HeroUI `Tabs` root.
 * `variant="secondary"` (default) bakes in the underline look — foreground text
 * on the selected tab + an accent indicator — and drops the built-in
 * `.tabs__list` baseline. `variant="primary"` renders HeroUI's plain default Tabs
 * (full-width segmented pill) for page-level feature switches. Drop-in replacement
 * for `<Tabs>`; the children still use the `Tabs.*` compound parts.
 *
 * @param props - {@link TabsExtendedProps}
 */
export const TabsExtended = ({
    selectedKey,
    onSelectionChange,
    children,
    className,
    variant = "secondary",
    size = "md",
    showAnatomy = false,
}: TabsExtendedProps) => {
    return (
        <HeroTabs
            variant={variant}
            selectedKey={selectedKey}
            onSelectionChange={(key) => onSelectionChange(String(key))}
            className={cn(
                // tab labels must never wrap to a 2nd line — white-space inherits down to
                // every Tabs.Tab, so a squeezed segment truncates (w-full) or sizes to the
                // one-line label (w-fit) instead of stacking words.
                "whitespace-nowrap",
                variant === "secondary" ? "extended-tabs" : size === "sm" ? "w-fit" : "w-full",
                className,
            )}
            data-anat-part={showAnatomy ? "Tabs" : undefined}
        >
            {children}
        </HeroTabs>
    )
}

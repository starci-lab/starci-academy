import type { ReactNode } from "react"
import { Tooltip as HeroTooltip } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Tooltip.Base`: the ONE constrained hover-hint atom over HeroUI Tooltip.
 *
 * Bọc HeroUI `Tooltip` TỐI ĐA (alias `HeroTooltip`) và SỞ HỮU toàn bộ chrome của
 * tooltip: inset, max-width, arrow. Consumer chỉ truyền `label` (nội dung) + trigger
 * (`children`) + `placement` — KHÔNG tự dựng panel/arrow.
 *
 * NAMESPACE (thầy chốt 2026-07-25): atom KHÔNG export component trần — mọi thành
 * viên đi qua `Tooltip.*` (hôm nay chỉ có `Base`), khớp `Chip.*` / `Button.*`.
 *
 * ⚠️ `children` GIỮ vì atom-wrapper BUỘC bọc phần tử khác — NGOẠI LỆ CÓ TÊN, atom
 * khác CẤM TUYỆT ĐỐI. Tooltip không tự dựng được trigger: nó giải thích một phần tử
 * BẤT KỲ do consumer đưa (chip · icon-button · thuật ngữ inline · ô số), và
 * react-aria phải gắn hover/focus/aria-describedby thẳng lên chính phần tử đó. Ép
 * thành `triggerLabel` sẽ khoá trigger về đúng một hình thái text ⇒ mất khả năng
 * bọc. (Ngoại lệ này chỉ gồm `Tooltip` và `Badge` — mọi atom khác dùng prop dữ liệu.)
 *
 * STRICT §4: `label` là nhãn giải thích (ReactNode text — NỘI DUNG, được phép),
 * `children` là trigger TRẦN. `placement` giới hạn 4 phía. `isOpen`/`defaultOpen` để
 * STORY pin panel mở (soi tĩnh) — production để react-aria tự mở khi hover.
 *
 * Overlay portal: `Tooltip.Content` render RA NGOÀI render-box (body portal) nên badge
 * on-render chỉ neo được `Trigger`; `Content`/`Arrow` vẫn hiện trong legend + Cây.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link TooltipBase}. */
export interface TooltipBaseProps {
    /**
     * The trigger element the tooltip explains (term / chip / icon button).
     *
     * NGOẠI LỆ children — xem doc header: atom-wrapper buộc bọc phần tử bất kỳ.
     */
    children: ReactNode
    /** Tooltip body — plain-language hint. */
    label: ReactNode
    /** Placement relative to the trigger. Default `"top"`. */
    placement?: "top" | "bottom" | "left" | "right"
    /** Render the little arrow pointing at the trigger. Default `true`. */
    showArrow?: boolean
    /** Open delay (ms) on hover. Default `200`. Ignored when `isOpen` is controlled. */
    delay?: number
    /** Controlled open — pin the panel open (STORY soak). */
    isOpen?: boolean
    /** Uncontrolled initial-open — panel starts open then follows hover. */
    defaultOpen?: boolean
    /** Dev/spec: emit `data-anat-part` on Trigger/Content so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    /** Extra classes on the trigger wrapper. */
    className?: string
}

/**
 * The base tooltip atom. See file header for the strict contract (incl. the named
 * `children` exception).
 *
 * @param props - {@link TooltipBaseProps}
 */
const TooltipBase = ({
    children,
    label,
    placement = "top",
    showArrow = true,
    delay = 200,
    isOpen,
    defaultOpen,
    showAnatomy = false,
    className,
}: TooltipBaseProps) => {
    return (
        <HeroTooltip delay={delay} isOpen={isOpen} defaultOpen={defaultOpen}>
            <HeroTooltip.Trigger className={className} data-anat-part={showAnatomy ? "Trigger" : undefined}>
                {children}
            </HeroTooltip.Trigger>
            <HeroTooltip.Content
                placement={placement}
                showArrow={showArrow}
                className="max-w-[260px]"
                data-anat-part={showAnatomy ? "Content" : undefined}
            >
                {showArrow ? <HeroTooltip.Arrow data-anat-part={showAnatomy ? "Arrow" : undefined} /> : null}
                {label}
            </HeroTooltip.Content>
        </HeroTooltip>
    )
}

/**
 * `Tooltip.*` — the hover-hint ATOM namespace. `Tooltip.Base` là atom tooltip DUY
 * NHẤT và là một trong hai atom được GIỮ `children` (wrapper bắt buộc).
 */
export const Tooltip = Object.assign(TooltipBase, {
    Base: TooltipBase,
})

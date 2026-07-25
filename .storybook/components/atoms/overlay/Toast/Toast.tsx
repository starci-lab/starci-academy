import type { ComponentType, ReactNode, SVGProps } from "react"
import { Alert } from "@sb-components/atoms/feedback/Alert/Alert"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Toast.Base`: the ONE constrained notification-surface atom.
 *
 * Compose từ atom `Alert.Base` (thầy chốt 2026-07-25 — toast và callout là CÙNG một
 * hạt alert, chỉ khác chỗ đặt: toast nổi, callout nằm trong surface). Trước đây file
 * này tự `import { Alert } from "@heroui/react"` và tự nuôi bảng icon + nút × song
 * song với `Feedback.Callout` → drift. Nay chỉ còn CHỖ ĐẶT: `tone="plain"` (tint mặc
 * định, không ép soft) + glyph `sm`. Port xuống HeroUI nằm DUY NHẤT ở `Alert.Base`.
 *
 * Đây là bề mặt thông báo TĨNH (soi được, không cần queue sống) — feature dùng nó làm
 * thân của một toast/inline-alert.
 *
 * NAMESPACE (thầy chốt 2026-07-25): atom KHÔNG export component trần — mọi thành
 * viên đi qua `Toast.*` (hôm nay chỉ có `Base`), khớp `Chip.*` / `Button.*`.
 *
 * KHÔNG `children` (luật ② thầy chốt 2026-07-25): toast vốn đã 100% prop dữ liệu —
 * `title`/`description`/`action` là NỘI DUNG (ReactNode được phép), không phải
 * children. Không có gì phải bọc ⇒ không thuộc ngoại lệ wrapper.
 *
 * STRICT §4: `status` chọn tone (success/warning/danger/info), atom tự chọn icon —
 * consumer KHÔNG truyền icon sai valence. `title`/`description` là nội dung; `action`
 * (tuỳ chọn) đặt trước nút ×; `onClose` bật ×. Bảng icon nằm DUY NHẤT ở `Alert.Base`
 * (`@phosphor-icons/react` — MỘT BỘ DUY NHẤT, §5.0).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** An icon passed as a COMPONENT (Phosphor), rendered by the atom at status-icon scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/** Semantic tone of the toast. */
export type ToastStatus = "success" | "warning" | "danger" | "info"

/** `status` → the `Alert.Base` atom status (info folds to the accent tint). */
const STATUS_TO_ALERT: Record<ToastStatus, "success" | "warning" | "danger" | "accent"> = {
    success: "success",
    warning: "warning",
    danger: "danger",
    info: "accent",
}

/** Props for {@link ToastBase}. */
export interface ToastBaseProps {
    /** Semantic tone — drives tint + default icon. Default `"info"`. */
    status?: ToastStatus
    /** Headline line (always shown). */
    title: ReactNode
    /** Optional supporting line under the title. */
    description?: ReactNode
    /** Optional custom indicator icon COMPONENT; omit for the status default. */
    icon?: IconComponent
    /** Optional trailing action (e.g. a Button), rendered before the close button. */
    action?: ReactNode
    /** When set → renders a × and calls this on click. */
    onClose?: () => void
    /** Accessible label for the × (caller passes a localised string). */
    closeLabel?: string
    /** Dev/spec: emit `data-anat-part` on Icon/Title/Description/Action/Close so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    /** Placement utilities only (e.g. `mb-4`). */
    className?: string
}

/**
 * The base toast/notification atom. See file header for the strict contract.
 *
 * @param props - {@link ToastBaseProps}
 */
const ToastBase = ({
    status = "info",
    title,
    description,
    icon,
    action,
    onClose,
    closeLabel,
    showAnatomy = false,
    className,
}: ToastBaseProps) => (
    <Alert.Base
        status={STATUS_TO_ALERT[status]}
        tone="plain"
        title={title}
        description={description}
        icon={icon}
        action={action}
        onClose={onClose}
        closeAriaLabel={closeLabel}
        className={className}
        showAnatomy={showAnatomy}
    />
)

/**
 * `Toast.*` — the notification-surface ATOM namespace. `Toast.Base` là bề mặt thông
 * báo DUY NHẤT (status/action/close đều là LEAF prop-driven của nó).
 */
export const Toast = Object.assign(ToastBase, {
    Base: ToastBase,
})

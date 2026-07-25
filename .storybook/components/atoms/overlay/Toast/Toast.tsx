import type { ComponentType, ReactNode, SVGProps } from "react"
import { Alert as HeroAlert, cn } from "@heroui/react"
import { CircleCheck, CircleInfo, CircleXmark, TriangleExclamation, Xmark } from "@gravity-ui/icons"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Toast.Base`: the ONE constrained notification-surface atom over HeroUI Alert.
 *
 * Bọc HeroUI `Alert` TỐI ĐA (Indicator · Content · Title · Description). Đây là bề
 * mặt thông báo TĨNH (soi được, không cần queue sống) — feature dùng nó làm thân của
 * một toast/inline-alert. Atom SỞ HỮU: map status→tone, icon mặc định theo status
 * (gravity), scale icon, layout action/close.
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
 * (tuỳ chọn) đặt trước nút ×; `onClose` bật ×. Icon lib = gravity (KHÔNG có `weight`).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** An icon passed as a COMPONENT (gravity), rendered by the atom at status-icon scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/** Semantic tone of the toast. */
export type ToastStatus = "success" | "warning" | "danger" | "info"

/** `status` → HeroUI `Alert` status (info folds to the accent tint). */
const STATUS_TO_ALERT: Record<ToastStatus, "success" | "warning" | "danger" | "accent"> = {
    success: "success",
    warning: "warning",
    danger: "danger",
    info: "accent",
}

/** Default indicator icon per status (gravity, outline). */
const STATUS_ICON: Record<ToastStatus, IconComponent> = {
    success: CircleCheck,
    warning: TriangleExclamation,
    danger: CircleXmark,
    info: CircleInfo,
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
}: ToastBaseProps) => {
    const Icon = icon ?? STATUS_ICON[status]
    return (
        <HeroAlert status={STATUS_TO_ALERT[status]} className={cn("shadow-none", className)}>
            <HeroAlert.Indicator className="[&_svg]:size-5!" data-anat-part={showAnatomy ? "Icon" : undefined}>
                <Icon aria-hidden />
            </HeroAlert.Indicator>
            <HeroAlert.Content data-anat-part={showAnatomy ? "Content" : undefined}>
                <HeroAlert.Title data-anat-part={showAnatomy ? "Title" : undefined}>{title}</HeroAlert.Title>
                {description ? (
                    <HeroAlert.Description data-anat-part={showAnatomy ? "Description" : undefined}>{description}</HeroAlert.Description>
                ) : null}
            </HeroAlert.Content>
            {action ? (
                <div className="shrink-0" data-anat-part={showAnatomy ? "Action" : undefined}>
                    {action}
                </div>
            ) : null}
            {onClose ? (
                <button
                    type="button"
                    aria-label={closeLabel ?? "Đóng"}
                    onClick={onClose}
                    data-anat-part={showAnatomy ? "Close" : undefined}
                    className="text-muted inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 outline-none transition hover:bg-current/10 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent [&_svg]:size-4"
                >
                    <Xmark aria-hidden />
                </button>
            ) : null}
        </HeroAlert>
    )
}

/**
 * `Toast.*` — the notification-surface ATOM namespace. `Toast.Base` là bề mặt thông
 * báo DUY NHẤT (status/action/close đều là LEAF prop-driven của nó).
 */
export const Toast = {
    Base: ToastBase,
}

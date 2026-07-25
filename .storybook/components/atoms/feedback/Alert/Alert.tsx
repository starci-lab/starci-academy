import type { ComponentType, ReactNode, SVGProps } from "react"
import { Alert as HeroAlert, cn } from "@heroui/react"
import { CircleCheck, CircleInfo, CircleXmark, TriangleExclamation, Xmark } from "@gravity-ui/icons"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Alert.Base`: the ONE "một thông điệp có valence + lối thoát" atom.
 *
 * Thầy chốt 2026-07-25: `Feedback.Callout` và `Toast.Base` HOÁ RA là cùng một hạt
 * (alert có fill màu), chỉ khác CHỖ ĐẶT — callout nằm trong surface, toast nổi.
 * Trước đó mỗi bên tự `import { Alert } from "@heroui/react"` rồi tự nuôi bảng
 * màu/close riêng → "đổi 1 phải đổi hết" (drift C-compose). Atom này là port DUY
 * NHẤT xuống HeroUI Alert; hai bên kia compose từ đây, không cắt thẳng nữa.
 *
 * ATOM SỞ HỮU: map `status`→tint · icon mặc định đúng valence · scale glyph (§4/§5)
 * · skin nút × theo status · layout Indicator/Content/Action/Close.
 * CONSUMER CHỈ ĐƯA: nội dung (`title`/`description`/`body`) + `action` + `onClose`.
 *
 * NAMESPACE (§13a): KHÔNG export component trần — mọi thành viên qua `Alert.*`.
 *
 * §12b: KHÔNG mở `children` — `body` là đường DUY NHẤT để nhét nội dung tự do
 * (list ngắn, meta row) dưới description. `Alert.Base` không phải wrapper thật
 * (không có "nội dung của caller" nào cần bọc ngoài data props sẵn có), nên
 * children ở đây chỉ là escape hatch trùng lặp với `body` — bỏ.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** An icon passed as a COMPONENT (gravity), rendered by the atom at its own scale (§4/§5). */
export type AlertIcon = ComponentType<SVGProps<SVGSVGElement>>

/** Semantic tone — drives tint, default icon and close-button skin. */
export type AlertStatus = "default" | "accent" | "success" | "warning" | "danger"

/**
 * Fill strategy. `soft` ép dải tint phẳng `bg-<status>-soft` (đọc như highlight
 * strip, KHÔNG như card-in-card — dùng khi alert nằm TRONG một surface). `plain`
 * để nguyên tint mặc định của HeroUI (alert đứng trên canvas / nổi).
 */
export type AlertTone = "soft" | "plain"

/** Default indicator icon per status — gravity outline, matching the atom layer. */
const STATUS_ICON: Record<AlertStatus, AlertIcon> = {
    default: CircleInfo,
    accent: CircleInfo,
    success: CircleCheck,
    warning: TriangleExclamation,
    danger: CircleXmark,
}

/** Soft tint per status — the ONE table (was duplicated in Callout + Toast). */
const STATUS_TINT: Record<AlertStatus, string> = {
    default: "bg-default",
    accent: "bg-accent-soft",
    success: "bg-success-soft",
    warning: "bg-warning-soft",
    danger: "bg-danger-soft",
}

/**
 * Close (×) colour + hover tint per status. The `!` beats `Button.Icon`'s own
 * `ghost` text/hover (a plain utility would lose to it). Hover = a tint of the
 * alert's OWN tone.
 */
const STATUS_CLOSE_TONE: Record<AlertStatus, string> = {
    default: "!text-muted hover:!bg-default",
    accent: "!text-accent-soft-foreground hover:!bg-accent-soft",
    success: "!text-success-soft-foreground hover:!bg-success-soft",
    warning: "!text-warning-soft-foreground hover:!bg-warning-soft",
    danger: "!text-danger-soft-foreground hover:!bg-danger-soft",
}

/**
 * Glyph scale — MỘT cỡ cho mọi alert (thầy chốt 2026-07-25, soi mắt trên story
 * `Tones`). Trước đó atom có trục `size` sm/md chỉ để giữ nguyên hình cũ của
 * Callout (size-6) vs Toast (size-5); thầy chốt cả hai về size-5 ⇒ trục đó thừa,
 * gỡ luôn (§6: đừng nuôi prop không mang khác biệt thật).
 */
const GLYPH_SCALE = "[&_svg]:size-5!"

/** Props for {@link Alert.Base}. */
export interface AlertBaseProps {
    /** Semantic tone — drives tint + default icon + close skin. Default `"default"`. */
    status?: AlertStatus
    /** Fill strategy — `soft` for alerts INSIDE a surface. Default `"soft"`. */
    tone?: AlertTone
    /** Headline line (always shown) — the header slot. */
    title: ReactNode
    /** Optional supporting line under the title — the body TEXT slot. */
    description?: ReactNode
    /** Optional free-form body under `description` (a short list, a meta row). */
    body?: ReactNode
    /** Optional custom indicator icon COMPONENT; omit for the status default. */
    icon?: AlertIcon
    /** Optional trailing action (e.g. a Button), rendered before the close button. */
    action?: ReactNode
    /** When provided, renders a status-coloured × wired to this. */
    onClose?: () => void
    /** Accessible label for the × (caller passes a localised string). */
    closeAriaLabel?: string
    /** Placement utilities only (e.g. `mb-4`) — NOT for restyling the alert. */
    className?: string
    /** Anatomy tag: names this frame so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * The base alert atom. See the file header for the strict contract.
 *
 * @param props - {@link AlertBaseProps}
 */
const AlertBase = ({
    status = "default",
    tone = "soft",
    title,
    description,
    body,
    icon,
    action,
    onClose,
    closeAriaLabel,
    className,
    anatPart,
    showAnatomy = false,
}: AlertBaseProps) => {
    const Icon = icon ?? STATUS_ICON[status]
    return (
        <HeroAlert
            status={status}
            className={cn("shadow-none", tone === "soft" && STATUS_TINT[status], className)}
            data-anat-part={anatPart}
        >
            {/* §4: khung sở hữu scale glyph — caller đưa icon TRẦN (component ref). */}
            <HeroAlert.Indicator className={GLYPH_SCALE} data-anat-part={showAnatomy ? "Icon" : undefined}>
                <Icon aria-hidden />
            </HeroAlert.Indicator>
            <HeroAlert.Content data-anat-part={showAnatomy ? "Content" : undefined}>
                <HeroAlert.Title data-anat-part={showAnatomy ? "Title" : undefined}>{title}</HeroAlert.Title>
                {description ? (
                    <HeroAlert.Description data-anat-part={showAnatomy ? "Description" : undefined}>
                        {description}
                    </HeroAlert.Description>
                ) : null}
                {body != null ? (
                    <div className="mt-2 w-full" data-anat-part={showAnatomy ? "Body" : undefined}>{body}</div>
                ) : null}
            </HeroAlert.Content>
            {action ? (
                <div className="shrink-0" data-anat-part={showAnatomy ? "Action" : undefined}>{action}</div>
            ) : null}
            {onClose ? (
                // §11a: badge dừng ở node "Close" (atom `Button.Icon`) — không drill vào ruột atom.
                <span className="shrink-0" data-anat-part={showAnatomy ? "Close" : undefined}>
                    <Button.Icon
                        icon={Xmark}
                        ariaLabel={closeAriaLabel ?? "Đóng"}
                        variant="ghost"
                        size="sm"
                        onPress={onClose}
                        className={STATUS_CLOSE_TONE[status]}
                    />
                </span>
            ) : null}
        </HeroAlert>
    )
}

/**
 * `Alert.*` — the alert ATOM namespace. `Alert.Base` là bề mặt alert DUY NHẤT của
 * hệ; `Feedback.Callout` (đặt trong surface) và `Toast.Base` (nổi) đều compose từ nó.
 */
export const Alert = Object.assign(AlertBase, {
    Base: AlertBase,
})

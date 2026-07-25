import type { ComponentType, ReactNode, SVGProps } from "react"
import { Alert as HeroAlert, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, XIcon } from "@phosphor-icons/react"
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
 * · skin nút × theo status · layout Indicator/Content/Action/Close · skeleton của
 * chính hình này (§12c).
 * CONSUMER CHỈ ĐƯA: nội dung (`title`/`description`/`body`) + `action` + `onClose`.
 *
 * ICON (§5.0, thầy chốt 2026-07-26): MỘT bộ duy nhất `@phosphor-icons/react`.
 * Weight theo size (§5.0a): glyph chỉ báo `size-5` ⇒ regular (không truyền
 * `weight`); glyph × trong `Button.Icon size="sm"` bị ép `size-3.5` ⇒ `weight="bold"`.
 *
 * NAMESPACE (§13a): KHÔNG export component trần — mọi thành viên qua `Alert.*`.
 *
 * §12b: KHÔNG mở `children` — `body` là đường DUY NHẤT để nhét nội dung tự do
 * (list ngắn, meta row) dưới description. `Alert.Base` không phải wrapper thật
 * (không có "nội dung của caller" nào cần bọc ngoài data props sẵn có), nên
 * children ở đây chỉ là escape hatch trùng lặp với `body` — bỏ.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * An icon passed as a COMPONENT (Phosphor), rendered by the atom at its own scale (§4/§5).
 * Kiểu để TRẦN `ComponentType<SVGProps<SVGSVGElement>>` (§5.0) — không khai kiểu
 * riêng của thư viện icon, kẻo khoá cả cây vào một nhà cung cấp.
 */
export type AlertIcon = ComponentType<SVGProps<SVGSVGElement>>

/** Semantic tone — drives tint, default icon and close-button skin. */
export type AlertStatus = "default" | "accent" | "success" | "warning" | "danger"

/**
 * Fill strategy. `soft` ép dải tint phẳng `bg-<status>-soft` (đọc như highlight
 * strip, KHÔNG như card-in-card — dùng khi alert nằm TRONG một surface). `plain`
 * để nguyên tint mặc định của HeroUI (alert đứng trên canvas / nổi).
 */
export type AlertTone = "soft" | "plain"

/**
 * Default indicator icon per status — Phosphor regular (§5.0). Cùng KHUÔN tròn cho
 * 4/5 status; `warning` giữ tam giác vì đó là ngữ nghĩa cảnh báo chuẩn.
 */
const STATUS_ICON: Record<AlertStatus, AlertIcon> = {
    default: InfoIcon,
    accent: InfoIcon,
    success: CheckCircleIcon,
    warning: WarningIcon,
    danger: XCircleIcon,
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

/**
 * Glyph × của nút đóng. `Button.Icon size="sm"` ép icon xuống `size-3.5` — nhỏ hơn
 * `size-5` nên §5.0a bắt bù `weight="bold"`; để regular thì nét × mảnh hơn ~33% so
 * với glyph chỉ báo `size-5` đứng cùng hàng, nhìn ra hai độ đậm khác nhau.
 */
const CloseGlyph = (props: SVGProps<SVGSVGElement>) => <XIcon {...props} weight="bold" />

/** Props RIÊNG của {@link Alert.Base} — TRỪ cặp `title`/`isSkeleton` (xem {@link AlertBaseProps}). */
interface AlertBaseOwnProps {
    /** Semantic tone — drives tint + default icon + close skin. Default `"default"`. */
    status?: AlertStatus
    /** Fill strategy — `soft` for alerts INSIDE a surface. Default `"soft"`. */
    tone?: AlertTone
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
 * Props for {@link Alert.Base}.
 *
 * §12c: `isSkeleton` là state CO-LOCATED — atom này là bản gốc DUY NHẤT của hình
 * alert nên nó tự vẽ luôn hình loading của mình (không có compound `Skeleton.*`).
 * Khi `isSkeleton`, `title` thành OPTIONAL bằng UNION (không hạ optional đại trà —
 * nhánh sống vẫn BẮT BUỘC có tiêu đề).
 */
export type AlertBaseProps = AlertBaseOwnProps &
    (
        | { isSkeleton: true; title?: ReactNode }
        | { isSkeleton?: false; title: ReactNode }
    )

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
    isSkeleton = false,
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
                {/* §12c: nhánh skeleton xét TRƯỚC mọi nhánh rẽ hình của phần chữ. */}
                {isSkeleton ? (
                    // KHUNG (tint · radius · shadow · gap) và ICON render THẬT — chỉ CHỮ
                    // thành gạch. Bar khớp đúng hộp dòng nên không nhảy layout (§8):
                    // title `text-sm leading-6` → my-1 + h-4 = 24px; description
                    // `text-sm` (leading-5) → my-1 + h-3 = 20px.
                    <>
                        <HeroSkeleton
                            className="my-1 h-4 w-40 rounded"
                            data-anat-part={showAnatomy ? "Title" : undefined}
                        />
                        <HeroSkeleton
                            className="my-1 h-3 w-full max-w-64 rounded"
                            data-anat-part={showAnatomy ? "Description" : undefined}
                        />
                    </>
                ) : (
                    <>
                        <HeroAlert.Title data-anat-part={showAnatomy ? "Title" : undefined}>{title}</HeroAlert.Title>
                        {description ? (
                            <HeroAlert.Description data-anat-part={showAnatomy ? "Description" : undefined}>
                                {description}
                            </HeroAlert.Description>
                        ) : null}
                    </>
                )}
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
                        icon={CloseGlyph}
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

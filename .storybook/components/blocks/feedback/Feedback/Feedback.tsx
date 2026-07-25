import type { ComponentType, ReactNode, SVGProps } from "react"
import { Alert, AlertDialog, Typography as HeroTypography, cn } from "@heroui/react"
import { CircleCheck, CircleInfo, CircleXmark, TriangleExclamation, Xmark } from "@gravity-ui/icons"
import { Button } from "../../../atoms/buttons/Button/Button"
import { Typography } from "../../../atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Feedback.*`, the ONE "nói cho người dùng biết
 * chuyện gì đang xảy ra" KHUNG namespace (thầy chốt 2026-07-25, canon §13a).
 *
 * Ba khung anh em từng nằm rời ở ba thư mục (`Callout` · `EmptyState` ·
 * `ConfirmDialog`) giờ là MEMBER của một namespace — cùng tier, cùng việc (đặt
 * một THÔNG ĐIỆP + lối thoát vào một khung có sẵn hình), một import:
 *
 * | Member | Khung | Kênh nội dung |
 * |---|---|---|
 * | `.Callout` | dải tint phẳng NẰM TRONG một surface | `title`/`description`/`body`(+`children`)/`action` |
 * | `.Empty`   | chồng dọc CANH GIỮA lấp chỗ trống/lỗi | `code`/`icon`/`title`/`description`/`body`(+`children`)/`action` |
 * | `.Confirm` | vỏ dialog chặn-đường cho hành động không lùi được | `title`/`description` + `confirmLabel`/`cancelLabel` |
 *
 * ⚠️ `InfoTooltip` KHÔNG có mặt ở đây — đã XOÁ theo §13c (xem cuối file).
 *
 * KHUNG API LAW (§13b):
 * - Không member nào là DANH SÁCH LẶP → không có khung nào nhận `items`.
 * - Slot CÓ TÊN là đường chính. `title` = header, `description`/`body` = body,
 *   `action` = footer — ba khung này có HÌNH CỐ ĐỊNH nên slot mang tên theo vai
 *   (không đổi thành header/body/footer trần, sẽ mất nghĩa).
 * - `children` chỉ là shorthand của `body` (khung BỌC), và CHỈ ở `.Callout`/`.Empty`
 *   — `.Confirm` là vỏ dialog dựng sẵn header/body/footer nên KHÔNG mở children.
 * - Namespace only — KHÔNG export component trần (§13a).
 *
 * ATOM COMPOSITION (§12): chữ đi qua `Typography.*`, nút đi qua `Button.*`, icon
 * lấy từ `@gravity-ui/icons` (component ref, khung tự ép size — §4/§5).
 * NGOẠI LỆ CÓ CHỦ Ý: `.Callout` giữ `Alert.Title`/`Alert.Description` của HeroUI
 * vì chính HeroUI mang hợp đồng MÀU-THEO-STATUS (`.alert--warning .alert__title`
 * → `text-warning-soft-foreground`). Thay bằng `Typography` sẽ phải tự nuôi một
 * bảng màu tay — đó mới là "tự vẽ". Khi có atom `Alert.Base` thì đổi sang atom.
 *
 * Hành vi/skin của mỗi member giữ NGUYÊN từ thư mục cũ; đây là refactor API +
 * hạ tầng atom, không phải đổi thị giác. Sync sang `src` sau.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Icon passed as a COMPONENT (gravity), never JSX — the frame owns its scale (§4/§5). */
export type FeedbackIcon = ComponentType<SVGProps<SVGSVGElement>>

// ─────────────────────────────────────────────────────────────────────────────
// .Callout — tinted flat strip inside a surface (was `Callout`)
// ─────────────────────────────────────────────────────────────────────────────

/** Semantic tone — maps 1:1 to HeroUI `Alert` `status`. */
export type FeedbackCalloutStatus = "default" | "accent" | "success" | "warning" | "danger"

/** Default icon per status — gravity, matching every other icon in the atom layer. */
const CALLOUT_ICON: Record<FeedbackCalloutStatus, FeedbackIcon> = {
    default: CircleInfo,
    accent: CircleInfo,
    success: CircleCheck,
    warning: TriangleExclamation,
    danger: CircleXmark,
}

/** Soft tint per status — a nested callout reads as a thin highlight strip, not a card-in-card. */
const CALLOUT_TINT: Record<FeedbackCalloutStatus, string> = {
    default: "bg-default",
    accent: "bg-accent-soft",
    success: "bg-success-soft",
    warning: "bg-warning-soft",
    danger: "bg-danger-soft",
}

/**
 * Action button bg/text per status — SOLID `bg-<status>` CTA against the lighter
 * tint. Exported (not a component → §13a chỉ cấm export COMPONENT trần) because the
 * CTA lives in the caller's `action` slot, so the caller needs the matching skin.
 */
export const CALLOUT_ACTION_CLASS: Record<FeedbackCalloutStatus, string> = {
    default: "bg-foreground text-background",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    danger: "bg-danger text-danger-foreground",
}

/**
 * Close (×) colour + hover tint per status — folded in from the retired
 * `ElementCloseButton`. The `!` beats the atom's `ghost` variant own text/hover
 * (a plain utility would lose to it). Hover = a tint of the callout's OWN tone.
 */
const CALLOUT_CLOSE_TONE: Record<FeedbackCalloutStatus, string> = {
    default: "!text-muted hover:!bg-default",
    accent: "!text-accent-soft-foreground hover:!bg-accent-soft",
    success: "!text-success-soft-foreground hover:!bg-success-soft",
    warning: "!text-warning-soft-foreground hover:!bg-warning-soft",
    danger: "!text-danger-soft-foreground hover:!bg-danger-soft",
}

/** Props for {@link Feedback.Callout}. */
export interface FeedbackCalloutProps {
    /** Semantic tone (drives tint + icon/title colour). Default `"default"`. */
    status?: FeedbackCalloutStatus
    /** Headline line (always shown) — the header slot of this frame. */
    title: ReactNode
    /** Optional supporting line under the title — the body TEXT slot. */
    description?: ReactNode
    /**
     * Optional free-form body under `description` (a short list, a meta row).
     * Equivalent to `children`; wins over it when both are passed.
     */
    body?: ReactNode
    /** Shorthand for {@link FeedbackCalloutProps.body}. */
    children?: ReactNode
    /** Optional custom indicator icon as a COMPONENT; omit for the status default. */
    icon?: FeedbackIcon
    /** Optional trailing action (the footer slot), rendered before the close button. */
    action?: ReactNode
    /** When provided, renders a status-coloured close (×) wired to this. */
    onClose?: () => void
    /** Accessible label for the close button. */
    closeAriaLabel?: string
    /** Placement utilities only (e.g. `mb-4`) — NOT for restyling the callout. */
    className?: string
    /** Anatomy tag: names this frame so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * A tinted, flat note for use INSIDE a card / surface (surface-in-surface): a thin
 * `bg-<status>-soft` + `shadow-none` highlight strip, so it doesn't read as a
 * card-in-card. For a standalone alert on the page canvas, use the raw `Alert`.
 *
 * @param props - {@link FeedbackCalloutProps}
 */
const Callout = ({
    status = "default",
    title,
    description,
    body,
    children,
    icon,
    action,
    onClose,
    closeAriaLabel,
    className,
    anatPart,
    showAnatomy = false,
}: FeedbackCalloutProps) => {
    const Icon = icon ?? CALLOUT_ICON[status]
    const main = body ?? children
    return (
        <Alert
            status={status}
            className={cn("shadow-none", CALLOUT_TINT[status], className)}
            data-anat-part={anatPart}
        >
            {/* §4: khung sở hữu scale glyph — caller đưa icon TRẦN (component ref). */}
            <Alert.Indicator className="[&_svg]:size-6!" data-anat-part={showAnatomy ? "Icon" : undefined}>
                <Icon />
            </Alert.Indicator>
            <Alert.Content data-anat-part={showAnatomy ? "Content" : undefined}>
                <Alert.Title data-anat-part={showAnatomy ? "Title" : undefined}>{title}</Alert.Title>
                {description ? (
                    <Alert.Description data-anat-part={showAnatomy ? "Description" : undefined}>
                        {description}
                    </Alert.Description>
                ) : null}
                {main != null ? (
                    <div className="mt-2 w-full" data-anat-part={showAnatomy ? "Body" : undefined}>{main}</div>
                ) : null}
            </Alert.Content>
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
                        className={CALLOUT_CLOSE_TONE[status]}
                    />
                </span>
            ) : null}
        </Alert>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Empty — centered placeholder stack (was `EmptyState`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link Feedback.Empty}. */
export interface FeedbackEmptyProps {
    /**
     * Optional decorative icon as a COMPONENT (gravity) above the title — the frame
     * renders it `size-8` + toned. Ignored in `size="compact"`.
     */
    icon?: FeedbackIcon
    /**
     * Optional large status numeral (e.g. `"404"`, `"500"`) above the icon/title.
     * Intended for `size="page"`; ignored in `size="compact"`.
     */
    code?: ReactNode
    /** Primary message describing why the area is empty (e.g. "No results"). */
    title: ReactNode
    /** Optional supporting text under the title. Ignored in `size="compact"`. */
    description?: ReactNode
    /**
     * Optional free-form body under `description` (a hint list, an illustration).
     * Equivalent to `children`; wins over it. Ignored in `size="compact"`.
     */
    body?: ReactNode
    /** Shorthand for {@link FeedbackEmptyProps.body}. */
    children?: ReactNode
    /**
     * Optional call-to-action (typically a Button) below the body. Ignored in
     * `size="compact"`. In `size="page"`, multiple actions are centered and wrap.
     */
    action?: ReactNode
    /**
     * Icon tone. `"neutral"` (default) tints the icon `text-foreground`;
     * `"danger"` tints it `text-danger` for error placeholders. Only the icon
     * colour changes — title and description stay as-is.
     */
    tone?: "neutral" | "danger"
    /**
     * Layout size:
     * - `"default"` — the standard centered stack for lists/panels/sections.
     * - `"compact"` — a single muted title-only line (no icon/description/body/action/code).
     * - `"page"` — roomy full-page sizing for whole-route failures (404/500), with a
     *   larger title and room for a `code` numeral above it.
     */
    size?: "default" | "compact" | "page"
    /** Extra classes on the wrapper. */
    className?: string
    /** Anatomy tag: names this frame so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * When on, each composed part emits `data-anat-part` (`Code`/`Icon`/`Title`/
     * `Description`/`Body`/`Action`) for a BlockAnatomy panel.
     *
     * ⚠️ Thay cho bộ 5 prop `codeAnatPart`/`iconAnatPart`/… của `EmptyState` cũ —
     * một cờ, tên part CỐ ĐỊNH (khớp mọi khung khác của hệ).
     */
    showAnatomy?: boolean
}

/**
 * Centered placeholder for lists, panels, sections, or whole routes with no content —
 * and for the "tải hỏng" variant of the same hole (`tone="danger"` + a retry `action`).
 * A vertical, centered stack: optional `code` → optional icon → title → optional
 * description → optional body → optional action. Omits a card wrapper — the caller
 * wraps it in a surface (e.g. `SurfaceCard.List emptyState={…}`) when a frame is wanted.
 *
 * @param props - {@link FeedbackEmptyProps}
 */
const Empty = ({
    icon: Icon,
    code,
    title,
    description,
    body,
    children,
    action,
    tone = "neutral",
    size = "default",
    className,
    anatPart,
    showAnatomy = false,
}: FeedbackEmptyProps) => {
    if (size === "compact") {
        // ⚠️ Atom `Typography.*` KHÔNG nhận prop lạ (không spread rest) → mọi tag
        // anatomy phải nằm trên một phần tử BỌC, không nhét vào atom.
        return (
            <span className={cn("block", className)} data-anat-part={showAnatomy ? "Title" : anatPart}>
                <Typography.Sm text={title} color="muted" />
            </span>
        )
    }

    const isPage = size === "page"
    const main = body ?? children

    return (
        <div
            data-anat-part={anatPart}
            className={cn(
                isPage
                    ? "mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-16 text-center"
                    : "flex flex-col items-center gap-3 py-6 text-center",
                className,
            )}
        >
            {code != null ? (
                // ⚠️ HeroUI Typography (KHÔNG phải atom) cho HAI slot cỡ heading của
                // `size="page"`: atom `Typography.*` dừng ở `Lg` (text-lg) nên ép cỡ
                // bằng className thô sẽ đụng luật `no-hero-heading-class`. Xem GAP cuối file.
                <div data-anat-part={showAnatomy ? "Code" : undefined}>
                    <HeroTypography type="h1" weight="bold" color="muted">{code}</HeroTypography>
                </div>
            ) : null}
            {Icon ? (
                <span
                    data-anat-part={showAnatomy ? "Icon" : undefined}
                    className={cn("inline-flex", tone === "danger" ? "text-danger" : "text-foreground")}
                >
                    <Icon className="size-8" />
                </span>
            ) : null}
            {isPage ? (
                <div className="flex flex-col gap-2">
                    <div data-anat-part={showAnatomy ? "Title" : undefined}>
                        <HeroTypography type="h4" weight="semibold" align="center">{title}</HeroTypography>
                    </div>
                    {description ? (
                        <div data-anat-part={showAnatomy ? "Description" : undefined}>
                            <Typography.Sm text={description} color="muted" />
                        </div>
                    ) : null}
                </div>
            ) : (
                <>
                    <div data-anat-part={showAnatomy ? "Title" : undefined}>
                        <Typography.Base text={title} weight="medium" />
                    </div>
                    {description ? (
                        <div data-anat-part={showAnatomy ? "Description" : undefined}>
                            <Typography.Xs text={description} color="muted" />
                        </div>
                    ) : null}
                </>
            )}
            {main != null ? (
                <div data-anat-part={showAnatomy ? "Body" : undefined}>{main}</div>
            ) : null}
            {action ? (
                <div
                    data-anat-part={showAnatomy ? "Action" : undefined}
                    className={isPage ? "flex flex-wrap items-center justify-center gap-3" : undefined}
                >
                    {action}
                </div>
            ) : null}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Confirm — blocking confirmation shell (was `ConfirmDialog`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link Feedback.Confirm}. */
export interface FeedbackConfirmProps {
    /** Whether the dialog is currently open (controlled). Forwarded to HeroUI `AlertDialog`. */
    isOpen: boolean
    /**
     * Open-state change handler (fires on cancel and, when dismissable, on Escape).
     * The confirm button does NOT close the dialog itself — the caller closes it via
     * this handler once {@link FeedbackConfirmProps.onConfirm} resolves.
     */
    onOpenChange: (open: boolean) => void
    /** Dialog heading — a short question ("Huỷ ghi danh khoá này?"). The header slot. */
    title: ReactNode
    /**
     * Optional supporting copy under the title (the body slot) — spell out the
     * consequence so the choice is informed.
     */
    description?: ReactNode
    /** Label for the confirming action button. Default `"Xác nhận"`. */
    confirmLabel?: string
    /** Label for the cancel / dismiss button. Default `"Huỷ"`. */
    cancelLabel?: string
    /** Fires when the user presses confirm. Run the irreversible action here. */
    onConfirm: () => void
    /**
     * Visual weight of the confirm action. `"danger"` styles the confirm button as
     * destructive for actions that delete or undo; `"default"` for benign ones.
     */
    tone?: "default" | "danger"
    /**
     * When `true`, the confirm button shows a spinner and blocks further presses
     * while the action is in flight; the cancel button is disabled too.
     */
    isConfirming?: boolean
    /** Extra classes on the dialog. */
    className?: string
    /** When on, emit `data-anat-part` on each composed part for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * A controlled confirmation dialog for irreversible actions (huỷ ghi danh, xoá bài
 * nộp) built on HeroUI `AlertDialog`. Khung thuần trình bày — open state và mọi
 * callback vào bằng prop; khung không giữ state, không fetch.
 *
 * Vỏ dựng sẵn ĐỦ header/body/footer (footer = `Button.Group` huỷ + xác nhận) nên
 * KHÔNG mở `children`: nội dung đi bằng `title`/`description`.
 *
 * @param props - {@link FeedbackConfirmProps}
 */
const Confirm = ({
    isOpen,
    onOpenChange,
    title,
    description,
    confirmLabel = "Xác nhận",
    cancelLabel = "Huỷ",
    onConfirm,
    tone = "default",
    isConfirming = false,
    className,
    showAnatomy = false,
}: FeedbackConfirmProps) => {
    const isDanger = tone === "danger"
    return (
        <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
            <AlertDialog.Backdrop>
                <AlertDialog.Container size="sm">
                    <AlertDialog.Dialog className={cn(className)}>
                        {/* No status icon — text-only; layout GIỮ NGUYÊN (heading/body trái, footer phải) — thầy chốt 2026-07-23. */}
                        <AlertDialog.Header data-anat-part={showAnatomy ? "Header" : undefined}>
                            <AlertDialog.Heading>{title}</AlertDialog.Heading>
                        </AlertDialog.Header>
                        {description != null ? (
                            <AlertDialog.Body data-anat-part={showAnatomy ? "Body" : undefined}>
                                <Typography.Sm text={description} color="muted" />
                            </AlertDialog.Body>
                        ) : null}
                        <AlertDialog.Footer className="w-full" data-anat-part={showAnatomy ? "Footer" : undefined}>
                            {/* §11a: badge dừng ở Footer — ruột `Button.Group` là story của atom. */}
                            <Button.Group
                                className="w-full justify-end"
                                items={[
                                    {
                                        key: "cancel",
                                        label: cancelLabel,
                                        variant: "secondary",
                                        isDisabled: isConfirming,
                                        onPress: () => onOpenChange(false),
                                    },
                                    {
                                        key: "confirm",
                                        label: confirmLabel,
                                        variant: isDanger ? "danger" : "primary",
                                        isPending: isConfirming,
                                        onPress: onConfirm,
                                    },
                                ]}
                            />
                        </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog>
    )
}

/**
 * `Feedback.*` — the feedback KHUNG namespace: ba khung đặt một THÔNG ĐIỆP vào
 * đúng chỗ của nó.
 *
 * | Member | Kênh nội dung |
 * |---|---|
 * | `.Callout` | `title` · `description` · `body`/`children` · `action` · `onClose` |
 * | `.Empty`   | `code` · `icon` · `title` · `description` · `body`/`children` · `action` |
 * | `.Confirm` | `title` · `description` · `confirmLabel`/`cancelLabel` (không children) |
 *
 * ⛔ ĐÃ XOÁ khỏi họ này — `InfoTooltip` (§13c): nó chỉ là `Tooltip.Base` (atom)
 * khoác thêm một trigger gạch-chân-chấm + một chồng 2 dòng chữ, KHÔNG thêm khái
 * niệm khung nào. Consumer dùng thẳng `Tooltip.Base` với `label` là nội dung
 * (một hoặc hai dòng `Typography.*`). Nếu muốn giữ quy ước "thuật ngữ khó gạch
 * chân chấm" thì đó là component TẦNG DESIGN (ví dụ `GlossaryTerm`) — mang nghĩa
 * nội dung, không phải khung — nằm ngoài tầng này.
 *
 * ⚠️ GAP đã biết (ngoài vùng, cần chốt riêng): atom `Typography.*` dừng ở `Lg`
 * (text-lg) và chỉ có `weight` medium|bold → KHÔNG diễn được cỡ heading. Vì vậy
 * đúng HAI slot của `.Empty size="page"` (`code` = h1, `title` = h4) vẫn dùng
 * HeroUI `Typography` — ép cỡ bằng className thô sẽ vi phạm luật lint
 * `starci-fe/no-hero-heading-class`. Khi atom mở member cỡ heading thì đổi 2 chỗ này.
 */
export const Feedback = {
    Callout,
    Empty,
    Confirm,
}

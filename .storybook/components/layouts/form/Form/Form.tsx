import type { FormEvent, ReactNode } from "react"
import { cn } from "@heroui/react"
import { Button, type ButtonGroupItem } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { GAP_CLASS, type SpaceScale } from "@sb-components/layouts/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Form.*`, the ONE form KHUNG namespace
 * (tầng LAYOUT §13, thầy chốt 2026-07-25).
 *
 * Sau khi atom form TỰ MANG `label`/`hint`/`errorMessage`/`isRequired` (§12e —
 * tầng `Field.*` đã bị XOÁ theo §13c), khung form không còn gì để "mặc áo" cho
 * field nữa. Việc còn lại của nó là DUY NHẤT BỐ CỤC: dựng `<form>` thật, gom
 * field thành nhóm có tiêu đề, và xếp hàng nút cuối.
 *
 * | Member | Khung | Kênh nội dung |
 * |---|---|---|
 * | `.Base`    | vỏ `<form>` + cột nội dung + hàng nút | slot `body` (+`children`) · `actions` |
 * | `.Section` | nhóm field có tiêu đề                 | `title`/`description` + slot `body` (+`children`) |
 * | `.Actions` | hàng nút cuối form                     | **`items` — CẤM children** |
 *
 * KHUNG API LAW (§13b):
 * - `.Base` / `.Section` là khung BỌC → slot CÓ TÊN (`body`) là đường chính,
 *   `children` giữ lại như shorthand của `body`.
 * - `.Actions` là DANH SÁCH LẶP (N nút cùng kiểu) → BẮT BUỘC `items` dữ liệu,
 *   CẤM children — y hệt `Button.Group items` (§12b).
 * - Namespace only — KHÔNG export component trần (§13a).
 *
 * KHUNG KHÔNG MANG CHỨC NĂNG (§13):
 * - ⛔ KHÔNG đẻ lại `label`/`hint`/`errorMessage`/`isRequired` — atom lo (§12e).
 * - ⛔ KHÔNG validation, KHÔNG state field, KHÔNG business rule — đó là tầng
 *   `block`. Khung chỉ biết "đang khoá hay không" (`isDisabled`) và "submit".
 * - ⛔ KHÔNG tự vẽ nút — `.Actions` COMPOSE atom `Button.Group` (§13c).
 *
 * SPACING (§10c): mọi khoảng đi qua {@link SpacingStep} — union literal `0·1·2·3·6·8`.
 * Khung ÉP thang bằng TYPE, không nhận số tuỳ ý; off-scale (`gap-4/5/…`) không
 * gọi được. Khoảng đến từ **gap của parent**, KHÔNG margin của con (§10a).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * §10c — thang token spacing DUY NHẤT của cả design system:
 * `flush(0) · tight(1) · related(2) · grouped(3) · section(6) · page(8)`.
 * Là UNION LITERAL nên off-scale bị TypeScript chặn ngay tại call-site.
 */
export type SpacingStep = SpaceScale

// ─────────────────────────────────────────────────────────────────────────────
// .Base — the `<form>` shell
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link Form.Base}. */
export interface FormBaseProps {
    /**
     * Submit handler. Khung tự `preventDefault()` rồi gọi hàm này, nên phím
     * ENTER trong một field cũng submit (hành vi native của `<form>` — lý do
     * khung render thẻ `<form>` THẬT thay vì một `<div>` xếp cột).
     * Bỏ trống → form không submit (vẫn chặn reload trang).
     */
    onSubmit?: () => void
    /** Vùng nội dung chính (các `Form.Section` / field). Thắng `children` khi truyền cả hai. */
    body?: ReactNode
    /** Shorthand của {@link FormBaseProps.body} — khung BỌC nhận nội dung bất kỳ (§13b). */
    children?: ReactNode
    /**
     * Hàng nút cuối form — thường là một {@link Form.Actions}. Là slot CÓ TÊN
     * (không phải node cuối của `body`) để khung biết đâu là "đáy" và giữ
     * nhịp `gap` cho đúng seam.
     */
    actions?: ReactNode
    /**
     * Nhịp dọc giữa các vùng con của form. Default `6` (= `section`, §10b:
     * design ↔ design trong một block). Xuống `3` cho form ngắn trong modal.
     */
    gap?: SpacingStep
    /**
     * `true` → KHOÁ CẢ FORM (đang submit / chờ server). Dùng `<fieldset disabled>`
     * native nên MỌI control con (kể cả nút trong `actions`) tắt theo — khung
     * không phải thread `isDisabled` xuống từng field.
     */
    isDisabled?: boolean
    /** Extra classes trên thẻ `<form>`. */
    className?: string
    /** `true` → gắn `data-anat-part` cho từng part để BlockAnatomy badge. */
    showAnatomy?: boolean
}

/**
 * Vỏ `<form>` của tầng khung: một thẻ `<form>` thật (submit bằng ENTER, a11y),
 * một cột nội dung theo nhịp `gap`, và một slot `actions` ở đáy.
 *
 * KHÔNG biết gì về field bên trong — không validation, không giá trị, không lỗi.
 * Cờ duy nhất nó sở hữu là `isDisabled` (đang khoá), thi hành bằng `<fieldset
 * disabled>` để native lo việc tắt mọi control con.
 *
 * @param props - {@link FormBaseProps}
 */
const Base = ({
    onSubmit,
    body,
    children,
    actions,
    gap = 6,
    isDisabled = false,
    className,
    showAnatomy = false,
}: FormBaseProps) => {
    const main = body ?? children
    const submit = (event: FormEvent<HTMLFormElement>) => {
        // Luôn chặn navigation mặc định của form, kể cả khi không có handler.
        event.preventDefault()
        onSubmit?.()
    }
    return (
        <form onSubmit={submit} noValidate className={className}>
            {/*
                `<fieldset disabled>` = cách NATIVE khoá cả cụm: mọi <input>/<button>
                con tắt theo, không cần khung thread cờ xuống từng field. `min-w-0`
                vì fieldset mặc định `min-width: min-content` (sẽ phá truncate bên trong).
            */}
            <fieldset disabled={isDisabled} className={cn("flex min-w-0 flex-col", GAP_CLASS[gap])}>
                {main != null ? (
                    <div className={cn("flex min-w-0 flex-col", GAP_CLASS[gap])} data-anat-part={showAnatomy ? "Body" : undefined}>
                        {main}
                    </div>
                ) : null}
                {actions != null ? (
                    <div data-anat-part={showAnatomy ? "Actions" : undefined}>{actions}</div>
                ) : null}
            </fieldset>
        </form>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Section — a titled group of fields
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link Form.Section}. */
export interface FormSectionProps {
    /** Tiêu đề nhóm — `Typography.Sm` medium (§9b: nhấn làm-việc, không phải heading trang). */
    title: ReactNode
    /** Dòng mô tả dưới tiêu đề — `Typography.Xs` muted (§9a). Bỏ trống → chỉ còn tiêu đề. */
    description?: ReactNode
    /** Các field của nhóm. Thắng `children` khi truyền cả hai. */
    body?: ReactNode
    /** Shorthand của {@link FormSectionProps.body} — khung BỌC (§13b). */
    children?: ReactNode
    /**
     * Nhịp dọc: dùng cho CẢ hai seam của section (header ↔ body, và field ↔ field).
     * Default `3` (= `grouped`, §10b: hàng/khối xếp trong một khối). Một token,
     * một chủ — đổi nhịp của nhóm ở ĐÚNG một chỗ.
     */
    gap?: SpacingStep
    /** Extra classes trên `<section>`. */
    className?: string
    /** `true` → gắn `data-anat-part` cho từng part để BlockAnatomy badge. */
    showAnatomy?: boolean
}

/**
 * Nhóm field có tiêu đề: một khối `header` (tiêu đề + mô tả tuỳ chọn, `gap-1`
 * tight vì là một CẶP dính nhau — §10b) rồi tới cột field.
 *
 * Chỉ bố cục + chữ qua atom `Typography.*` (§9c). Không đẻ nghĩa mới: tiêu đề ở
 * đây KHÔNG phải `label` của field (label thuộc atom, §12e).
 *
 * @param props - {@link FormSectionProps}
 */
const Section = ({
    title,
    description,
    body,
    children,
    gap = 3,
    className,
    showAnatomy = false,
}: FormSectionProps) => {
    const main = body ?? children
    return (
        <section className={cn("flex min-w-0 flex-col", GAP_CLASS[gap], className)}>
            {/* tight gap-1: title ↔ description là một CẶP, không phải hai vùng (§10b). */}
            <div className="flex min-w-0 flex-col gap-1" data-anat-part={showAnatomy ? "Header" : undefined}>
                <span data-anat-part={showAnatomy ? "Title" : undefined}>
                    <Typography.Base size="sm" text={title} weight="medium" />
                </span>
                {description != null ? (
                    <span data-anat-part={showAnatomy ? "Description" : undefined}>
                        <Typography.Base size="xs" text={description} color="muted" />
                    </span>
                ) : null}
            </div>
            {main != null ? (
                <div className={cn("flex min-w-0 flex-col", GAP_CLASS[gap])} data-anat-part={showAnatomy ? "Body" : undefined}>
                    {main}
                </div>
            ) : null}
        </section>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Actions — the closing button row
// ─────────────────────────────────────────────────────────────────────────────

/** Căn hàng nút: `end` (mặc định — CTA nằm phải) · `start` · `between` (huỷ trái, CTA phải). */
export type FormActionsAlign = "start" | "end" | "between"

/** Props for {@link Form.Actions}. */
export interface FormActionsProps {
    /**
     * Hàng nút mô tả bằng DỮ LIỆU (§13b: danh sách lặp ⇒ `items`, CẤM children).
     * Cùng shape với `Button.Group` items — khung chuyển thẳng xuống atom, KHÔNG
     * tự vẽ nút (§13c).
     */
    items: Array<ButtonGroupItem>
    /** Căn hàng nút trong bề ngang form. Default `end`. */
    align?: FormActionsAlign
    /**
     * `true` → hàng nút DÍNH đáy khung cuộn (`sticky bottom-0`) với vạch ngăn +
     * nền, cho form dài trong modal/drawer. Chỉ là chrome khung, không đổi API nút.
     */
    sticky?: boolean
    /** Extra classes trên hàng nút. */
    className?: string
    /** `true` → gắn `data-anat-part` cho từng part để BlockAnatomy badge. */
    showAnatomy?: boolean
}

/** Căn ngang → class. `between` cần hàng nút CHIẾM HẾT bề ngang mới đẩy được hai mép. */
const ALIGN_CLASS: Record<FormActionsAlign, string> = {
    start: "justify-start",
    end: "justify-end",
    between: "justify-between",
}

/**
 * Hàng nút cuối form. COMPOSE atom `Button.Group` (§13c — khung không hand-roll
 * lại nút): khung chỉ thêm khái niệm khung thật là CĂN NGANG (`align`) và DÍNH
 * ĐÁY (`sticky`).
 *
 * Vai trò/hành vi từng nút (`variant`/`isPending`/`isDisabled`) vẫn thuộc atom —
 * khung chỉ chuyển tiếp qua `items`.
 *
 * @param props - {@link FormActionsProps}
 */
const Actions = ({
    items,
    align = "end",
    sticky = false,
    className,
    showAnatomy = false,
}: FormActionsProps) => (
    <div
        className={cn(
            "flex",
            ALIGN_CLASS[align],
            // Chrome của khung dính đáy: vạch ngăn + nền đặc để nội dung cuộn dưới không lộ.
            sticky && "sticky bottom-0 z-10 border-t border-default bg-background py-3",
            className,
        )}
    >
        <Button.Group
            items={items}
            // `between` = hai mép ⇒ cụm nút phải chiếm hết bề ngang mới đẩy ra được.
            className={align === "between" ? "w-full justify-between" : undefined}
            showAnatomy={showAnatomy}
        />
    </div>
)

/**
 * `Form.*` — form KHUNG namespace (tầng layout §13). `Base` (vỏ `<form>` +
 * cột nội dung + slot nút) · `Section` (nhóm field có tiêu đề) · `Actions`
 * (hàng nút, `items` dữ liệu → atom `Button.Group`).
 *
 * Nhãn/mô tả/lỗi/bắt buộc của field KHÔNG ở đây — atom form tự mang (§12e).
 */
export const Form = {
    Base,
    Section,
    Actions,
}

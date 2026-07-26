import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { GAP_CLASS, PADDING_CLASS, type SpaceScale } from "@sb-components/layouts/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (khung) — `Container.*`: KHỔ NỘI DUNG. Một member, `Container.Base`
 * (một khổ chỉ có một hình; bề rộng và đệm là PROP, §6b).
 *
 * KHUNG API LAW (§13b): khung BỌC ⇒ slot có tên `header`/`body`/`footer` là đường
 * chính, `children` là shorthand của `body`. Không có danh sách lặp nên không có
 * `items`.
 *
 * ⭐ VÌ SAO CÓ KHUNG NÀY (thầy chốt 2026-07-26). `Page.Container` cũ KHÔNG `mx-auto`,
 * KHÔNG `max-w`, và chỉ đệm BÊN PHẢI — nên mọi trang tự viết lấy khổ của mình:
 * `mx-auto flex w-full max-w-3xl flex-col gap-6` lặp 14 lần, `mx-auto w-full max-w-3xl`
 * 12 lần, và `max-w-3xl` xuất hiện 72 lần trong `src`. Khổ nội dung là một KHÁI NIỆM
 * có thật, nên nó phải là một khung có tên, không phải một chuỗi class chép tay.
 *
 * ⭐⭐ KHUNG NÀY MỞ `@container` (thầy chốt 2026-07-26) — đây là quyết định quan
 * trọng nhất của file, đọc kỹ trước khi sửa:
 *
 * `@app-sm/md/lg/xl` là container query, chúng đo **`@container` gần nhất**. Trước
 * đây chỉ có shell (`InnerLayout`) mở một cái, nên mọi lưới trong app đều nghe theo
 * bề rộng CỘT APP — kể cả lưới nằm trong một khổ `max-w-3xl` hẹp hơn nhiều. Hậu quả:
 * một `Grid` xin 4 cột ở bậc `lg` vẫn nhảy lên 4 cột dù khổ chứa nó chỉ rộng 48rem.
 *
 * Khung này mở `@container` của riêng nó ⇒ mọi `@app-*` bên trong đo **khổ này**,
 * không phải shell nữa. Lưới trong khổ hẹp tự biết mình hẹp.
 *
 * ⭐ HỆ QUẢ ĐẸP — `size` nói CÙNG NGÔN NGỮ với breakpoint. Cả hai đến từ MỘT bộ token
 * `--container-app-*` khai trong `globals.css` (Tailwind v4 `@theme`): cùng token đó
 * sinh ra biến thể `@app-md:` VÀ tiện ích `max-w-app-md`. Nên:
 *
 * | `size` | bề rộng | bậc `@app-*` còn bắn được BÊN TRONG |
 * |---|---|---|
 * | `sm` | 40rem | `@app-sm` (đúng mép) |
 * | `md` | 48rem | `@app-sm` · `@app-md` (đúng mép) |
 * | `lg` | 64rem | thêm `@app-lg` |
 * | `xl` | 80rem | thêm `@app-xl` |
 * | `full` | không chặn | tuỳ cha |
 *
 * Đọc bảng này theo chiều NGƯỢC cũng đúng, và đó mới là chỗ nó có ích: xin
 * `columns={{ lg: 4 }}` bên trong `size="md"` là **xin một bậc không bao giờ tới** —
 * lưới sẽ đứng yên ở bậc `md`. Không phải bug, là khổ giấy quá hẹp cho 4 cột.
 *
 * §10: `padding` và `gap` là {@link SpaceScale} union literal — off-scale là lỗi tsc
 * tại call-site, không phải phát hiện lúc review.
 * §13: không nội dung domain, không hành vi — chỉ bố trí.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Bề rộng khổ. Mỗi bậc trỏ THẲNG vào một token `--container-app-*`, nên khổ và
 * breakpoint không bao giờ lệch nhau (xem bảng ở header).
 */
export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full"

/**
 * Bậc → tiện ích `max-w-*` sinh từ chính token `--container-app-*`.
 *
 * Viết literal vì Tailwind không bao giờ emit chuỗi nội suy `max-w-app-${size}`.
 * ⚠️ ĐỪNG đổi sang `max-w-3xl`/`max-w-5xl` cho "gọn": số đó trùng giá trị hôm nay
 * (48rem/64rem) nhưng là NGUỒN KHÁC — token đổi thì khổ và breakpoint lệch nhau
 * âm thầm, không có lỗi nào bắt được.
 */
const SIZE_CLASS: Record<ContainerSize, string> = {
    sm: "max-w-app-sm",
    md: "max-w-app-md",
    lg: "max-w-app-lg",
    xl: "max-w-app-xl",
    full: "max-w-none",
}

/** Props cho {@link Container.Base}. */
export interface ContainerBaseProps {
    /**
     * Bề rộng tối đa của khổ. Mặc định `md` (48rem) — đo trên app thật: `max-w-3xl`
     * (đúng 48rem) là khổ được dùng nhiều nhất, 72 lần.
     */
    size?: ContainerSize
    /**
     * Đệm quanh nội dung, thang §10c. Mặc định `6` (thầy chốt: khổ web = `p-6`).
     * Đặt `0` khi con tự ôm mép (ảnh bìa tràn viền, bảng tràn ngang).
     */
    padding?: SpaceScale
    /**
     * Seam dọc giữa `header` ↔ `body` ↔ `footer`. Mặc định `8` — nhịp TRANG, cố ý
     * rộng hơn nhịp trong thẻ (§10b). Chỉ có tác dụng khi có nhiều hơn một vùng.
     */
    gap?: SpaceScale
    /** Vùng trên — thường là một `Page.Header`. */
    header?: ReactNode
    /** Vùng chính. Tương đương `children`; thắng `children` khi truyền cả hai. */
    body?: ReactNode
    /** Vùng dưới TRONG DÒNG (footer trang, hàng CTA kết). Không phải thanh ghim đáy. */
    footer?: ReactNode
    /** Shorthand của {@link ContainerBaseProps.body} — khung bọc thì bọc được mọi thứ. */
    children?: ReactNode
    /** Class thêm cho khổ. */
    className?: string
    /**
     * `true` → mỗi vùng phát `data-anat-part` để panel BlockAnatomy gắn badge.
     * Tắt trong production.
     */
    showAnatomy?: boolean
}

/**
 * Khổ nội dung: căn giữa, chặn bề rộng theo `size`, tự đệm, và MỞ `@container` để
 * mọi `@app-*` bên trong đo chính nó (xem header).
 *
 * Không có `header` lẫn `footer` thì `body` render TRẦN — gọi kiểu chỉ-`children`
 * ra đúng cây DOM tối giản, không đẻ thêm một lớp `div` thừa.
 *
 * @param props - {@link ContainerBaseProps}
 */
const ContainerBase = ({
    size = "md",
    padding = 6,
    gap = 8,
    header,
    body,
    footer,
    children,
    className,
    showAnatomy = false,
}: ContainerBaseProps) => {
    const main = body ?? children
    const content = header == null && footer == null
        ? main
        : (
            <div className={cn("flex flex-col", GAP_CLASS[gap])}>
                {header != null ? <div data-anat-part={showAnatomy ? "Header" : undefined}>{header}</div> : null}
                {main != null ? <div data-anat-part={showAnatomy ? "Body" : undefined}>{main}</div> : null}
                {footer != null ? <div data-anat-part={showAnatomy ? "Footer" : undefined}>{footer}</div> : null}
            </div>
        )

    return (
        // `@container` PHẢI nằm trên chính phần tử bị `max-w` chặn: container query
        // đo hộp của phần tử mở container, nên đặt ở đây thì con mới đo đúng khổ.
        <div
            data-anat-part={showAnatomy ? "Container" : undefined}
            className={cn(
                "@container mx-auto w-full",
                SIZE_CLASS[size],
                PADDING_CLASS[padding],
                className,
            )}
        >
            {content}
        </div>
    )
}

/**
 * `Container.*` — khung KHỔ NỘI DUNG. Namespace, không export component trần (§13a).
 *
 * | Member | Đường vào nội dung |
 * |---|---|
 * | `.Base` | slot `header`/`body`/`footer` (+ `children` = body) |
 */
export const Container = {
    Base: ContainerBase,
}

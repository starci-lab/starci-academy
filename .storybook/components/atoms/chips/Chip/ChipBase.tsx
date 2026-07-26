import type { ComponentType, ReactNode, SVGProps } from "react"
import { Chip as HeroChip, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { CircleIcon, XIcon } from "@phosphor-icons/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `ChipBase`: viên chip DUY NHẤT của hệ. Bọc HeroUI Chip.
 *
 * BA THAY ĐỔI LỚN 2026-07-26 (thầy chốt):
 *
 * 1. **`Chip.Dot` XOÁ, gộp vào đây bằng `dotColor`/`dotClassName`.** Chấm trạng thái
 *    không phải một hình thái chip khác — nó là cùng viên chip, thay glyph dẫn đầu
 *    bằng một chấm. Y như `isIconOnly` của `Button.Base`. Nuôi hai component song
 *    song nghĩa là mọi luật (tone · skeleton · nút ×) phải sửa hai chỗ, và khối nút
 *    × đã bị copy nguyên si sang bản thứ hai đúng như dự đoán.
 *
 * 2. **`StatusChip` XOÁ.** Nó chỉ là chip này khoá cứng `tone` + một bản sao nữa của
 *    khối ×. Một component anh em mà không thêm HÀNH VI nào thì không có lý do sống.
 *
 * 3. **Bảng tone về ở ngay trong file này** (`chip-tone.ts` xoá). File token riêng chỉ
 *    có lý do khi ≥2 component NGANG HÀNG cùng cần bảng — ở đây `ChipGroup` dựng lại
 *    `ChipBase` nên nó cứ import thẳng từ đây, không cần file trung gian.
 *
 * ⭐ BỀ MẶT CỦA CHIP CHẤM — chọn gì và vì sao (quyết định 2026-07-26):
 * Bản `Chip.Dot` cũ dùng `bg-default` + `text-foreground` (nền ĐẶC), còn `tone="neutral"`
 * của chip này đi qua HeroUI soft = `--default-soft` + `--default-soft-foreground`.
 * Đo token thật trong theme:
 *   • `--default-soft` = `color-mix(--default 50%, transparent)` — CÙNG màu, chỉ 50% đục.
 *   • `--default-soft-foreground` = `--default-foreground`, và giá trị của nó trùng
 *     `--foreground` tới hai chữ số (sáng lẫn tối) ⇒ CHỮ KHÔNG ĐỔI.
 * Vậy khác biệt thật chỉ còn **độ đục của nền**. Chọn: **bỏ nền đặc, chip chấm về đúng
 * bề mặt `tone`**. Lý do: nghĩa của chip chấm nằm ở CHẤM chứ không ở độ đậm của viên;
 * thêm một giá trị `tone` kiểu `neutral-solid` là lén nhét trục BỀ MẶT vào một union
 * vốn mang trục NGHĨA (§12d: hai trục phải ở riêng) — và ngay sau đó sẽ có người đòi
 * bản đặc cho success/warning/… thành nguyên một trục thứ hai. Một tone, một bề mặt.
 *
 * Rules:
 *   • STRICT §4: prop hẹp, KHÔNG mở structure. KHÔNG `children` (§12b) — nhãn đi bằng
 *     prop dữ liệu `text`.
 *   • Ô GLYPH DẪN ĐẦU CHỈ CÓ MỘT: `icon` và cặp `dotColor`/`dotClassName` loại trừ nhau,
 *     ép ở compile-time chứ không tin caller.
 *   • `isSkeleton` → shimmer CO-LOCATED (§12c), bám đúng hộp chip và số ô nó đang có.
 *   • Glyph: scale + `weight` do ATOM ép — caller chỉ chọn "hình gì" (§4).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Tone NGỮ NGHĨA của chip → màu soft của HeroUI. */
export type ChipTone = "neutral" | "success" | "warning" | "danger" | "accent"

/** Map tone → `color` của HeroUI Chip. `neutral` không có tên riêng bên HeroUI nên về `default`. */
const TONE_COLOR: Record<ChipTone, "default" | "success" | "warning" | "danger" | "accent"> = {
    neutral: "default",
    success: "success",
    warning: "warning",
    danger: "danger",
    accent: "accent",
}

/**
 * Icon truyền vào dạng COMPONENT (vd `CheckCircleIcon`), atom tự render ở cỡ chip.
 *
 * Kiểu để MỞ (`SVGProps` + `weight` tuỳ chọn), KHÔNG khai `Icon` của Phosphor — khai chặt
 * theo một thư viện là khoá cả cây vào một nhà cung cấp (§5.0). `weight` có mặt để ATOM tự
 * áp luật §5.0a lên icon caller đưa vào; chỉ HAI nấc `regular`/`bold`.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/**
 * ICON SCALE = FONT SCALE (luật tầng atom). HeroUI cho chip `md` chữ `text-xs`
 * (12px, xem `.chip { text-xs }` trong `@heroui/styles`) ⇒ glyph phải là `size-3`.
 *
 * ⚠️ Sửa 2026-07-26: trước đó atom render `size-3.5` và JSDoc viện "khớp `text-sm` của
 * chip" — chip không hề có `text-sm`, nên icon to hơn chữ một nấc ở MỌI chip của hệ.
 * KHÔNG cần `!important` ở đây (khác `Button`): `chip.css` không có rule `.chip svg` nào
 * để mà tranh specificity.
 */
const ICON_CLS = "size-3"

/** Chấm 6px — nhỏ hơn `size-5` nên vẫn theo luật weight nặng (§5.0a), ở đây là `fill`. */
const DOT_PX = 6

/**
 * Bề ngang shimmer theo SỐ Ô chip thật đang có: chỉ nhãn · nhãn + một ô (glyph dẫn đầu
 * HOẶC nút ×) · nhãn + cả hai ô. Skeleton phải giữ đúng footprint, nếu không hàng chip
 * nhảy khi dữ liệu về (§12c).
 */
const SKELETON_W = ["w-16", "w-20", "w-24"] as const

/**
 * Chiều cao shimmer = hộp chip THẬT: HeroUI `.chip` là `py-0.5` + `leading-5` ⇒ 24px = `h-6`.
 *
 * ⚠️ Sửa 2026-07-26: trước đó là `h-7`, sai 4px so với chip thật — dấu vết còn nằm ngay ở
 * call-site (`EnumChip` phải đắp `className="h-6"` để kéo shimmer về đúng cỡ). Call-site
 * phải vá hình của atom chính là dấu hiệu atom sai, không phải call-site sai.
 */
const SKELETON_H = "h-6"

/** Props chung — TRỪ cụm `text`/`isSkeleton` và ô glyph dẫn đầu, xem {@link ChipBaseProps}. */
interface ChipBaseOwnProps {
    /** Tone ngữ nghĩa → màu soft. Default `neutral`. */
    tone?: ChipTone
    /** Có hàm này → chip mọc nút × ở đuôi, bấm thì gọi hàm. */
    onRemove?: () => void
    /** Nhãn a11y cho nút × (caller đưa chuỗi đã dịch). */
    removeLabel?: string
    /** `true` → gắn `data-anat-part` cho từng part để BlockAnatomy badge. */
    showAnatomy?: boolean
    /**
     * Tên `data-anat-part` gắn ở GỐC chip. Component BỌC nó (vd `ChipGroup`) truyền
     * `"Chip.Base"` xuống để cây deps nhận ra "chỗ này là một Chip.Base" và cho bấm sang
     * story của nó — cây dựng từ DOM nên không có nhãn thì không thấy.
     */
    anatPart?: string
    className?: string
}

/**
 * Ô GLYPH DẪN ĐẦU chỉ có MỘT chỗ ngồi, nên `icon` và chấm loại trừ nhau ở compile-time.
 *
 * Chấm hiện lên khi (và chỉ khi) caller cho nó một MÀU — chấm sinh ra để tải màu, chấm
 * không màu thì chỉ là trang trí. Vì thế không có prop boolean `hasDot`: hai cách nói
 * cùng một chuyện là mở đường cho trạng thái vô nghĩa (`hasDot` mà không màu).
 */
type ChipLeadingProps =
    | { icon?: IconComponent; dotColor?: never; dotClassName?: never }
    | {
          icon?: never
          /**
           * Màu chấm dạng HEX thô (vd `#3178c6` của bảng màu ngôn ngữ GitHub) — cho màu
           * KHÔNG nằm trong bảng token Tailwind. Thắng `dotClassName`; cùng cơ chế `currentColor`.
           */
          dotColor?: string
          /**
           * Class text-color của Tailwind LÀM MÀU CHO CHẤM (vd `text-success`). Chấm là
           * `CircleIcon weight="fill"` ăn `currentColor` nên class ở span cha quyết màu;
           * chữ của chip vẫn theo tone.
           */
          dotClassName?: string
      }

/**
 * `text` BẮT BUỘC khi render chip thật, KHÔNG cần khi `isSkeleton` — pill shimmer không
 * có nhãn. Cùng khuôn với `ButtonBaseProps`/`TypographyProps` (§12c).
 */
export type ChipBaseProps = ChipBaseOwnProps &
    ChipLeadingProps &
    ({ isSkeleton: true; text?: ReactNode } | { isSkeleton?: false; text: ReactNode })

export const ChipBase = ({
    tone = "neutral",
    text,
    icon: Icon,
    dotColor,
    dotClassName,
    onRemove,
    removeLabel,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
    className,
}: ChipBaseProps) => {
    // Chấm chỉ xuất hiện khi caller cho nó màu (xem {@link ChipLeadingProps}).
    const hasDot = dotColor != null || dotClassName != null

    if (isSkeleton) {
        // Nhánh skeleton xét TRƯỚC mọi nhánh rẽ hình (§12c).
        const slots = (hasDot || Icon ? 1 : 0) + (onRemove ? 1 : 0)
        return (
            <HeroSkeleton
                className={cn(SKELETON_H, SKELETON_W[slots], "rounded-2xl", className)}
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
            />
        )
    }

    /** Ô glyph dẫn đầu: chấm màu HOẶC icon — không bao giờ cả hai (ép ở kiểu). */
    const leading = hasDot ? (
        <span
            aria-hidden
            data-anat-part={showAnatomy ? "Dot" : undefined}
            className={cn("inline-flex shrink-0", dotClassName)}
            style={dotColor ? { color: dotColor } : undefined}
        >
            {/* Chấm ĐẶC = `CircleIcon weight="fill"` (Phosphor không có bản `*Fill` riêng);
                fill mặc định = `currentColor` nên màu đặt ở span cha giữ nguyên. */}
            <CircleIcon weight="fill" width={DOT_PX} height={DOT_PX} />
        </span>
    ) : Icon ? (
        <span aria-hidden data-anat-part={showAnatomy ? "Icon" : undefined} className="inline-flex shrink-0">
            {/* Atom sở hữu scale glyph (§4): bằng cỡ chữ chip, và dưới `size-5` ⇒ `bold` (§5.0a). */}
            <Icon className={ICON_CLS} weight="bold" />
        </span>
    ) : null

    return (
        <HeroChip
            color={TONE_COLOR[tone]}
            variant="soft"
            size="md"
            // w-fit: chip là viên ôm nội dung — không có nó thì `align-items: stretch` của
            // flex-col cha kéo chip dài hết hàng.
            className={cn("w-fit", className)}
            data-anat-part={anatPart}
        >
            {leading}
            <HeroChip.Label data-anat-part={showAnatomy ? "Label" : undefined}>{text}</HeroChip.Label>
            {onRemove ? (
                // Nút × cỡ CHIP (size-4 vùng bấm, size-3 glyph), ăn tone của chip qua
                // `currentColor` — KHÔNG dùng `Button` isIconOnly (nút đó ~32px, thổi bay
                // viên 24px). Đây là HÀNH ĐỘNG (gỡ) nên phải là `<button>` thật, không phải link.
                <button
                    type="button"
                    aria-label={removeLabel ?? "Remove"}
                    onClick={onRemove}
                    data-anat-part={showAnatomy ? "Remove" : undefined}
                    className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 outline-none transition hover:bg-current/15 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent [&_svg]:size-3"
                >
                    {/* × bị ép size-3 (< size-5) ⇒ weight="bold" (§5.0a). */}
                    <XIcon aria-hidden weight="bold" />
                </button>
            ) : null}
        </HeroChip>
    )
}

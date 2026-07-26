import React from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DESIGN — `VariantChip.*`: họ chip ÁP MỘT VAI NGHĨA lên atom `Chip.*`.
 *
 * Đúng tầng `design` (§14d — design mang WHY): không đẻ hình mới, chỉ gắn Ý NGHĨA
 * + thang màu của vai đó lên hình đã có ở atom. Đổi HÌNH chip = việc của atom;
 * đổi Ý NGHĨA "độ khó" / "ngôn ngữ" / "nền tảng" = việc của file này.
 *
 * MEMBER = VAI NGHĨA, không phải hình thái. Đây là chỗ tầng design khác tầng atom:
 * atom chỉ có MỘT viên chip (`Chip.Base`) và chia theo PROP, design chia theo WHY.
 *
 * ⛔ **DESIGN TUYỆT ĐỐI KHÔNG MỞ `custom` VÀ `bare`** (thầy chốt 2026-07-26):
 * không nhãn tự đặt, không đổi hình. Mở hai thứ đó ra thì caller đổi được cả chữ
 * lẫn dáng — lúc ấy nó thôi là VAI NGHĨA, chỉ còn là một cái chip. Design phải là
 * BẢN CHUẨN DUY NHẤT của vai đó; muốn chip tự do thì gọi thẳng atom `Chip.*`.
 *
 * Hệ quả: `difficulty` là trục DUY NHẤT — nó quyết cả nhãn lẫn màu.
 *
 * KHÔNG có member `Base`: một "variant chip" không mang vai nào thì chính là
 * `Chip.Base` có chấm — đẻ `Base` rỗng ở đây là namespace rỗng (§12a cấm).
 *
 * Họ này sẽ còn `.Language` · `.HostPlatform` · `.AiCategory` (đang ở `_legacy`).
 * Chỉ dựng thành viên nào SCREEN ĐANG CẦN — không nuôi member không ai gọi.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The supported difficulty levels a piece of content can be tagged with. */
export type Difficulty = "beginner" | "intermediate" | "advanced" | "insane"

/**
 * Thang màu chấm theo bậc độ khó — SSOT của ramp này, import chứ đừng khai lại.
 *
 * Dùng ramp palette Tailwind (tuần tự, càng nóng càng khó) CHỨ KHÔNG dùng 5 token
 * ngữ nghĩa (`accent`/`success`/`warning`/`danger`/`default`): độ khó là **BẬC**,
 * không phải **TRẠNG THÁI** — ép 4 bậc vào token ngữ nghĩa sẽ đụng `danger` hai lần.
 */
export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
    beginner: "text-emerald-500",
    intermediate: "text-amber-500",
    advanced: "text-orange-500",
    insane: "text-rose-500",
}

/** Props for {@link VariantChip.Difficulty}. */
export interface VariantChipDifficultyProps {
    /** Bậc độ khó — quyết CẢ nhãn LẪN màu chấm. Đây là trục DUY NHẤT. */
    difficulty: Difficulty
    /** Extra classes on the wrapper. */
    className?: string
    /** `true` → gạch skeleton mirror đúng hình chấm+nhãn (atom tự vẽ). */
    isSkeleton?: boolean
    /** Dev/spec: phủ nhãn anatomy lên chip này. */
    showAnatomy?: boolean
    /** Anatomy tag: đặt tên part để BlockAnatomy badge được. */
    anatPart?: string
}

/** Title-case a difficulty key for the default label. */
const capitalize = (value: Difficulty): string => value.charAt(0).toUpperCase() + value.slice(1)

/**
 * `VariantChip.Difficulty` — chấm màu theo bậc + chữ độ khó (kiểu GitHub language
 * dot). Bọc mỏng atom `Chip.Base`; màu lấy từ {@link DIFFICULTY_COLOR}.
 *
 * ⚠️ Đổi 2026-07-26: trước đây gọi `Chip.Dot`. Atom đã gộp chấm thành PROP của viên
 * chip DUY NHẤT, nên chấm giờ là `dotClassName` trên `Chip.Base` — không có member
 * riêng nữa. Hình không đổi, chỉ đổi lối gọi.
 *
 * Hình LUÔN là viên pill — đúng mặc định của atom, và design không mở trục hình ra
 * cho caller (xem ⛔ ở doc đầu file).
 *
 * @param props - {@link VariantChipDifficultyProps}
 */
const VariantChipDifficulty = ({
    difficulty,
    className,
    isSkeleton,
    showAnatomy = false,
    anatPart,
}: VariantChipDifficultyProps) => {
    // Tên part để cây anatomy gọi đúng cái design này dựng lại — cây đọc từ DOM nên
    // không gắn tên thì nhìn story không biết nó làm bằng gì (thầy bắt 2026-07-25).
    // Nhãn phải là tên NAMESPACE (`Chip.Base`) vì người đọc tra theo tên story.
    const chipPart = showAnatomy ? "Chip.Base" : undefined
    // Hai nhánh vì `isSkeleton` của atom là union rời (skeleton thì `text` không bắt
    // buộc): truyền một biến `boolean | undefined` vào chung một chỗ là không khớp kiểu.
    // Nhánh skeleton VẪN giữ `dotClassName` để atom đếm đủ ô mà chừa chỗ cho chấm.
    const chip = isSkeleton ? (
        <Chip.Base
            isSkeleton
            dotClassName={DIFFICULTY_COLOR[difficulty]}
            className={className}
            anatPart={chipPart}
        />
    ) : (
        <Chip.Base
            dotClassName={DIFFICULTY_COLOR[difficulty]}
            text={capitalize(difficulty)}
            className={className}
            showAnatomy={showAnatomy}
            anatPart={chipPart}
        />
    )
    // Tên part đặt lên chính span BỌC chip — KHÔNG qua `AnatomyOverlay`.
    //
    // Overlay phát một span `inset-0` nằm CẠNH chip chứ không bọc nó, nên `Dot`/`Label`
    // (bên trong chip) leo tổ tiên KHÔNG gặp được `VariantChip.Difficulty` → cây anatomy
    // ra phẳng sai, hai atom nhảy lên ngang hàng với design (thầy bắt 2026-07-26).
    // Cây suy từ DOM nên tên phải nằm trên node THẬT SỰ chứa con.
    return showAnatomy ? (
        <span className="inline-flex" data-anat-part={anatPart ?? "VariantChip.Difficulty"}>
            {chip}
        </span>
    ) : chip
}

/**
 * `VariantChip.*` — họ chip mang vai nghĩa. Member đặt theo VAI (§14d), không theo
 * hình. Không có `Base` (xem doc đầu file).
 */
export const VariantChip = {
    Difficulty: VariantChipDifficulty,
}

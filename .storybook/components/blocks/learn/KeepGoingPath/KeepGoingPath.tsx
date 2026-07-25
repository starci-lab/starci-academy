import React from "react"
import { CheckCircleIcon, CircleIcon, LockIcon, PlayCircleIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { VariantChip, type Difficulty } from "@sb-components/designs/chips/VariantChip/VariantChip"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `KeepGoingPath.Base`: ĐƯỜNG HỌC TIẾP của chương hiện tại.
 *
 * LÝ DO TỒN TẠI (thầy chốt 2026-07-25): **lên SCREEN tuyệt đối không xài atom —
 * only block.** Screen `/learn/content` từng tự viết tiêu đề bằng `Typography`,
 * tự `.map()` danh sách và tự chọn icon theo trạng thái bài.
 *
 * ⚠️ ĐỒNG NHẤT RENDER (thầy soi mắt 2026-07-25): **không chế thêm khái niệm render.**
 * Cụm này và `LearnNudges` ngay trên nó TRÔNG GIỐNG HỆT (danh sách hàng trong khung
 * viền) nên phải đi CÙNG một layout: `SurfaceCard.List`. Bản đầu tiên của block này
 * tự vẽ `div.rounded-2xl.border` rồi nhét `List.Row` vào — hai đường render cho một
 * hình, đúng thứ drift phải dẹp. Tiêu đề cũng đi `label` của SurfaceCard (render
 * NGOÀI/trên surface) chứ không phải một `Typography` rời.
 *
 * BLOCK SỞ HỮU: map trạng thái → icon dẫn đầu · chip độ khó · dấu khoá premium ·
 * **VÀ CẢ CÂU TIÊU ĐỀ**. Caller chỉ đưa DỮ LIỆU MIỀN.
 *
 * ⛔ **KHÔNG nhận `heading`** (thầy chốt 2026-07-26): chữ tiêu đề là phần trình bày,
 * block sở hữu. Caller chỉ nói **tên chương** (`moduleTitle`) — dữ liệu; block tự
 * ghép thành "Tiếp tục · <tên chương>". Nhận `heading` là mở lối custom (§14d.1).
 *
 * 📛 **THUẬT NGỮ: `contents`, KHÔNG phải `lessons`** (thầy chốt 2026-07-26 —
 * strict mọi chỗ, ĐỪNG tin code cũ: `src/` vẫn gọi `lessons`, đó là chỗ sai).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Trạng thái học của một bài trong đường học. */
export type KeepGoingContentState = "done" | "active" | "todo"

/** Một bài trong đường học — DỮ LIỆU thuần, block tự dựng hình. */
export interface KeepGoingContent {
    /** Stable React key. */
    id: string
    /** Tên bài. */
    title: string
    /** Thời lượng đọc (phút) — block tự ghép thành dòng phụ. */
    minutes: number
    /** Đã xong / đang học / chưa học — quyết định icon dẫn đầu. */
    state: KeepGoingContentState
    /** Độ khó — block tự dựng `VariantChip.Difficulty`. */
    difficulty: Difficulty
    /** Bài thuộc gói trả phí → hiện dấu khoá. */
    locked?: boolean
    /** Bấm vào hàng. */
    onPress?: () => void
}

/**
 * Icon dẫn đầu theo trạng thái — block sở hữu bảng này, caller không tự chọn.
 * Đi đường `leading` (node) chứ không `leadingIcon`, vì mỗi trạng thái mang MỘT
 * MÀU riêng còn `leadingIcon` ép chung `text-muted`.
 *
 * BA TRẠNG THÁI CÙNG MỘT KHUÔN TRÒN (thầy chốt 2026-07-26):  chứ
 * KHÔNG phải  tam giác trần — hai anh em /
 * đều là hình tròn, để một cái khác khuôn thì hàng đọc bị gãy nhịp.
 *
 *  — cỡ icon dẫn đầu của hàng (thầy chốt 2026-07-26: heading icon = 5;
 * icon trong chip mới đi theo font).
 */
const CONTENT_LEADING: Record<KeepGoingContentState, { Icon: typeof CircleIcon, className: string }> = {
    active: { Icon: PlayCircleIcon, className: "size-5 text-accent-soft-foreground" },
    done: { Icon: CheckCircleIcon, className: "size-5 text-success-soft-foreground" },
    todo: { Icon: CircleIcon, className: "size-5 text-foreground" },
}

/**
 * Bài KHOÁ → ổ khoá **THAY** icon trạng thái ở đầu hàng, không treo thêm ở cuối
 * (thầy chốt 2026-07-26).
 *
 * MÀU: `warning` (thầy chốt 2026-07-26) — KHÔNG muted. Ổ khoá muted thì tàng hình,
 * mà đây không phải trang trí: nó là CỬA BÁN HÀNG, phải thấy được. Dùng nấc
 * `-soft-foreground` cho khớp anh em (accent/success), không phải `text-warning` đậm.
 *
 * Lý do đặt ở ĐẦU hàng: hàng list chuẩn đã có đủ leading · title · subtitle · meta; nhét icon thứ
 * hai ở đuôi là đẻ thêm một vị trí không ai đọc. Và về nghĩa: bài chưa mở khoá thì
 * "đã đọc / đang đọc / chưa đọc" vô nghĩa — **khoá CHÍNH LÀ trạng thái của nó**.
 */
const LOCKED_LEADING = { Icon: LockIcon, className: "size-5 text-warning-soft-foreground" }

/** Props for {@link KeepGoingPath.Base}. */
export interface KeepGoingPathBaseProps {
    /**
     * TÊN CHƯƠNG hiện tại — DỮ LIỆU, không phải câu tiêu đề. Block tự ghép thành
     * "Tiếp tục · {moduleTitle}". Caller KHÔNG được đưa cả câu vào (§14d.1).
     */
    moduleTitle: string
    /** Các content trong đường học tiếp theo. */
    contents: Array<KeepGoingContent>
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Đường học tiếp — tiêu đề chương + danh sách bài, cùng layout với `LearnNudges`.
 *
 * @param props - {@link KeepGoingPathBaseProps}
 */
const KeepGoingPathBase = ({
    moduleTitle,
    contents,
    showAnatomy = false,
    anatPart,
}: KeepGoingPathBaseProps) => (
    <SurfaceCard.List
        // Câu tiêu đề do BLOCK ghép — caller chỉ đưa tên chương.
        label={`Tiếp tục · ${moduleTitle}`}
        anatPart={anatPart}
        showAnatomy={showAnatomy}
        items={contents.map((content) => {
            // Khoá THAY icon trạng thái, không cộng thêm ở cuối hàng.
            const { Icon, className } = content.locked
                ? LOCKED_LEADING
                : CONTENT_LEADING[content.state]
            return {
                key: content.id,
                leading: (
                    <Icon
                        aria-label={content.locked ? "Nội dung trả phí" : undefined}
                        aria-hidden={content.locked ? undefined : true}
                        focusable="false"
                        className={className}
                    />
                ),
                title: content.title,
                subtitle: `${content.minutes} phút đọc`,
                onPress: content.onPress,
                // Meta chỉ còn ĐÚNG MỘT thứ: độ khó. Hình do DESIGN sở hữu — block
                // không đổi dáng chip (§14d.1).
                meta: (
                    <VariantChip.Difficulty
                        difficulty={content.difficulty}
                        showAnatomy={showAnatomy}
                    />
                ),
            }
        })}
    />
)

/** `KeepGoingPath.*` — namespace một-component ⇒ chỉ có `.Base`. */
export const KeepGoingPath = Object.assign(KeepGoingPathBase, {
    Base: KeepGoingPathBase,
})

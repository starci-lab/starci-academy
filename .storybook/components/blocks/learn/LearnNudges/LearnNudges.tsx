import React from "react"
import { ArrowRightIcon, CardsIcon, MicrophoneStageIcon, TrophyIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `LearnNudges.Base`: VIỆC NÊN LÀM HÔM NAY.
 *
 * LÝ DO TỒN TẠI (§14a): mỗi CHỨC NĂNG của screen là MỘT block. "Hôm nay nên làm
 * gì" là một chức năng, nên nó phải có tên. Trước 2026-07-25 screen `/learn/content`
 * gọi thẳng `SurfaceCard.List` (tầng LAYOUT) rồi tự nhét items + tự chọn icon —
 * screen lắp chi tiết thay cho block, đọc code screen không ra được trang làm gì.
 *
 * §14b — CALLER CHỈ ĐƯA DỮ LIỆU: `kind` là ENUM, không phải icon. Block sở hữu bảng
 * `kind → icon`; screen KHÔNG được biết "ôn thẻ" trông ra sao. Nếu prop là
 * `leadingIcon` thì screen lại phải cầm atom/icon ⇒ thủng luật.
 *
 * §14c — block chỉ LẮP: vỏ và nhịp đi qua `SurfaceCard.List`, CÙNG layout với
 * `KeepGoingPath` ngay dưới nó. Không tự vẽ khung, không tự chọn border.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Loại việc — ENUM dữ liệu; block tự quyết nó trông thế nào. */
export type LearnNudgeKind = "flashcards" | "interview" | "league"

/** Icon theo loại việc — block SỞ HỮU bảng này, caller không chọn được. */
const NUDGE_ICON: Record<LearnNudgeKind, typeof CardsIcon> = {
    flashcards: CardsIcon,
    interview: MicrophoneStageIcon,
    league: TrophyIcon,
}

/** Một việc nên làm — DỮ LIỆU thuần. */
export interface LearnNudge {
    /** Stable React key. */
    id: string
    /** Loại việc → quyết định icon dẫn đầu. */
    kind: LearnNudgeKind
    /**
     * Dòng chữ của hàng.
     *
     * ⛔ KHÔNG có `count` riêng (thầy chốt 2026-07-26): tiêu đề đã chứa số rồi
     * ("Ôn 12 thẻ đến hạn"), hiện thêm chip `12` bên phải là **nói hai lần**.
     * Một dữ kiện chỉ được xuất hiện MỘT chỗ trong một hàng.
     */
    title: string
    /** Bấm vào hàng. */
    onPress?: () => void
}

/** Props for {@link LearnNudges.Base}. */
export interface LearnNudgesBaseProps {
    /** Các việc nên làm. */
    items: Array<LearnNudge>
    /**
     * ⏳ Nguồn của dải này VỀ SAU dữ liệu chính của trang → giai đoạn chờ phải giữ
     * CHỖ, không được biến mất rồi hiện lại.
     *
     * Neo bug thật (src ghi 2026-07-12): `dueSwr`/`leaderboardSwr` resolve sau
     * `outline`, nên trong lúc chờ `dueCount`/`rank` mặc định 0/null → block từng
     * `return null` rồi bật lại ⇒ **dải NHẤP NHÁY**. Đó là lý do state này tồn tại;
     * bỏ nó đi là dựng lại đúng con bug đó.
     */
    isPending?: boolean
    /** Số hàng giả khi `isPending`. Default 2 — đúng số nudge hay gặp nhất. */
    pendingRows?: number
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Việc nên làm hôm nay — danh sách lối tắt sang việc học kế tiếp.
 *
 * @param props - {@link LearnNudgesBaseProps}
 */
const LearnNudgesBase = ({
    items,
    isPending = false,
    pendingRows = 2,
    showAnatomy = false,
    anatPart,
}: LearnNudgesBaseProps) => (
    <SurfaceCard.List
        // Tiêu đề do BLOCK sở hữu — caller KHÔNG truyền `heading` (§14d.1, thầy chốt
        // 2026-07-26). Cụm này luôn trả lời đúng một câu hỏi nên câu dẫn là hằng số.
        label="Việc nên làm hôm nay"
        anatPart={anatPart}
        showAnatomy={showAnatomy}
        items={
            isPending
                // ĐI ĐÚNG MỘT ĐƯỜNG RENDER: vẫn là `SurfaceCard.List`, chỉ thay
                // nội dung hàng bằng gạch. Không đẻ nhánh vẽ khung thứ hai —
                // đúng bài học "hai đường render cho một hình" ở `KeepGoingPath`.
                ? Array.from({ length: pendingRows }).map((_, index) => ({
                    key: `pending-${index}`,
                    title: <Typography size="sm" isSkeleton className="w-2/3" />,
                }))
                : items.map((item) => ({
                    key: item.id,
                    leadingIcon: NUDGE_ICON[item.kind],
                    title: item.title,
                    trailingIcon: ArrowRightIcon,
                    onPress: item.onPress,
                }))
        }
    />
)

/** `LearnNudges.*` — namespace một-component ⇒ chỉ có `.Base`. */
export const LearnNudges = Object.assign(LearnNudgesBase, {
    Base: LearnNudgesBase,
})

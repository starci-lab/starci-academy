import React from "react"
import { GithubLogoIcon } from "@phosphor-icons/react"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `CourseTeamGate.Base`: nhắc học viên vào GitHub team của khoá.
 *
 * LÝ DO TỒN TẠI (§14a): screen chỉ được liệt kê BLOCK. Trước đó screen
 * `/learn/content` gọi thẳng `Feedback.Callout` (tầng LAYOUT) và tự viết nội dung —
 * screen tự khai chi tiết một chức năng thay vì gọi tên nó. Block này mỏng, nhưng
 * nó tồn tại vì RANH GIỚI TẦNG + vì nó ôm ĐIỀU KIỆN HIỆN (dưới đây).
 *
 * 🔴 ĐIỀU KIỆN HIỆN — dành cho người **ĐÃ MUA** (thầy chốt 2026-07-25).
 * Backend scope team theo `is_enrolled = true` (`features/auth/GithubTeamGate`), nên:
 *   • ĐÃ MUA + chưa vào team → HIỆN cảnh báo
 *   • Trial / đã ở trong team → TỰ ẨN
 * Chưa mua thì làm gì có team mà vào.
 *
 * ⚠️ Bản screen dựng 2026-07-25 từng gate ngược (`viewer === "trial"`) — hiện cho
 * người chưa mua, ẩn với người đã mua. Đó là regression so với cây đã duyệt 24/07
 * (cây ghi rõ "paid chưa vào team"). Giữ ghi chú này để đừng lật lại lần nữa.
 *
 * §14c — block chỉ LẮP: toàn bộ hình đi qua `Feedback.Callout`, không tự vẽ.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link CourseTeamGate.Base}. */
export interface CourseTeamGateBaseProps {
    /**
     * Người học ĐÃ MUA khoá chưa. Chỉ người đã mua mới có team để vào (xem header).
     * Chưa biết (query chưa về) → truyền `false` để không nháy.
     */
    isEnrolled: boolean
    /** Đã ở trong GitHub team chưa. `true` → block tự ẩn. */
    isInTeam: boolean
    /** Bấm nút tham gia team. */
    onJoin?: () => void
    /**
     * Truyền XUỐNG `Feedback.Callout` để panel anatomy thấy block này ref tới đâu.
     * Không forward thì nhìn anatomy không biết nó dựng bằng gì.
     */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Cảnh báo không chặn: học viên đã mua nhưng chưa vào GitHub team của khoá (một số
 * bài lab cần quyền repo). Tự ẩn khi không đúng đối tượng.
 *
 * @param props - {@link CourseTeamGateBaseProps}
 */
const CourseTeamGateBase = ({
    isEnrolled,
    isInTeam,
    onJoin,
    showAnatomy = false,
    anatPart,
}: CourseTeamGateBaseProps) => {
    // TỰ ẨN — block sở hữu điều kiện hiện của chính nó, screen không phải hỏi.
    if (!isEnrolled || isInTeam) {
        return null
    }

    return (
        <Feedback.Callout
            anatPart={anatPart}
            showAnatomy={showAnatomy}
            status="warning"
            icon={GithubLogoIcon}
            title="Bạn chưa vào GitHub team của khoá"
            description="Một số bài lab cần quyền repo — bấm để tham gia."
            actionLabel="Vào team"
            onAction={onJoin}
        />
    )
}

/** `CourseTeamGate.*` — namespace một-component ⇒ chỉ có `.Base`. */
export const CourseTeamGate = Object.assign(CourseTeamGateBase, {
    Base: CourseTeamGateBase,
})

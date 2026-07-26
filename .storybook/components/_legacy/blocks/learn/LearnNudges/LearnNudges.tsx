import React from "react"
import { ArrowRightIcon, CardsIcon, MicrophoneStageIcon, TrophyIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `LearnNudges`, block VIỆC NÊN LÀM HÔM NAY.
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
    /** Dòng chữ của hàng. */
    title: string
    /** Số đếm tuỳ chọn (vd 12 thẻ đến hạn) — block tự dựng meta accent. */
    count?: number
    /** Bấm vào hàng. */
    onPress?: () => void
}

/** Props for {@link LearnNudges}. */
export interface LearnNudgesProps {
    /** Dòng dẫn trên khung (vd "Việc nên làm hôm nay"). */
    heading: string
    /** Các việc nên làm. */
    items: Array<LearnNudge>
    /**
     * Vỏ VIỀN thay vì shadow — CHỈ khi block nằm TRONG một surface đã tô nền (§1).
     * Đứng thẳng trên nền trang thì bỏ trống. Block không biết cha nó là gì (§14b).
     */
    bordered?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Việc nên làm hôm nay — danh sách lối tắt sang việc học kế tiếp.
 *
 * @param props - {@link LearnNudgesProps}
 */
export const LearnNudges = ({
    heading,
    items,
    bordered = false,
    showAnatomy = false,
    anatPart,
}: LearnNudgesProps) => (
    // Codemod 2026-07-26: `bordered={bordered}` → `variant={bordered ? "nested" : "surface"}`
    // (API 3-trục SurfaceCard). Prop `bordered` của CHÍNH LearnNudges vẫn giữ tên cũ — chỉ
    // đổi cách nó rót vào SurfaceCard.List.
    <SurfaceCard.List
        variant={bordered ? "nested" : "surface"}
        label={heading}
        anatPart={anatPart}
        showAnatomy={showAnatomy}
        items={items.map((item) => ({
            key: item.id,
            leadingIcon: NUDGE_ICON[item.kind],
            title: item.title,
            metaText: item.count != null ? String(item.count) : undefined,
            trailingIcon: ArrowRightIcon,
            onPress: item.onPress,
        }))}
    />
)

import React from "react"
import { CheckCircleIcon, CircleIcon, LockIcon, PlayIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { DifficultyChip, type Difficulty } from "@sb-components/_designs/chips/DifficultyChip/DifficultyChip"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `KeepGoingPath`, block ĐƯỜNG HỌC TIẾP.
 *
 * LÝ DO TỒN TẠI (thầy chốt 2026-07-25): **lên SCREEN tuyệt đối không xài atom —
 * only block.** Screen `/learn/content` từng tự viết tiêu đề bằng `Typography`,
 * tự `.map()` danh sách và tự chọn icon theo trạng thái bài.
 *
 * ⚠️ ĐỒNG NHẤT RENDER (thầy soi mắt 2026-07-25): **không chế thêm khái niệm render.**
 * Cụm này và `LearnNudges` ngay trên nó TRÔNG GIỐNG HỆT (danh sách hàng trong khung
 * viền) nên phải đi CÙNG một layout: `SurfaceCard.List`. Bản đầu tiên của
 * block này tự vẽ `div.rounded-2xl.border` rồi nhét `List.Row` vào — hai đường render
 * cho một hình, đúng thứ drift phải dẹp. Tiêu đề cũng đi `label` của SurfaceCard
 * (render NGOÀI/trên surface) chứ không phải một `Typography` rời.
 *
 * BLOCK SỞ HỮU: map trạng thái bài → icon dẫn đầu · chip độ khó · dấu khoá premium.
 * CALLER CHỈ ĐƯA DỮ LIỆU: `heading` + mảng `lessons`. Không node, không class.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Trạng thái học của một bài trong đường học. */
export type KeepGoingLessonState = "done" | "active" | "todo"

/** Một bài trong đường học — DỮ LIỆU thuần, block tự dựng hình. */
export interface KeepGoingLesson {
    /** Stable React key. */
    id: string
    /** Tên bài. */
    title: string
    /** Thời lượng đọc (phút) — block tự ghép thành dòng phụ. */
    minutes: number
    /** Đã xong / đang học / chưa học — quyết định icon dẫn đầu. */
    state: KeepGoingLessonState
    /** Độ khó — block tự dựng `DifficultyChip`. */
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
 */
const LESSON_LEADING: Record<KeepGoingLessonState, { Icon: typeof PlayIcon, className: string }> = {
    active: { Icon: PlayIcon, className: "size-5 text-accent-soft-foreground" },
    done: { Icon: CheckCircleIcon, className: "size-5 text-success-soft-foreground" },
    todo: { Icon: CircleIcon, className: "size-5 text-foreground" },
}

/** Props for {@link KeepGoingPath}. */
export interface KeepGoingPathProps {
    /** Dòng dẫn trên khung (ví dụ "Tiếp tục · Chương 2 · Container hoá"). */
    heading: string
    /** Các bài trong đường học tiếp theo. */
    lessons: Array<KeepGoingLesson>
    /**
     * Vỏ VIỀN thay vì shadow — CHỈ khi block nằm TRONG một surface đã tô nền
     * (surface-in-surface). Đứng thẳng trên nền trang thì bỏ trống → `shadow-surface`.
     *
     * Block KHÔNG tự quyết được vì nó không biết cha mình là gì → caller truyền.
     * Thầy soi mắt 2026-07-25: bản đầu hard-code `bordered` (bê từ code cũ) nên hai
     * cụm trên nền trang trần lại vẽ viền — sai luật của `SurfaceCard`.
     */
    bordered?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Đường học tiếp — tiêu đề chương + danh sách bài, cùng layout với `LearnNudges`.
 *
 * @param props - {@link KeepGoingPathProps}
 */
export const KeepGoingPath = ({
    heading,
    lessons,
    bordered = false,
    showAnatomy = false,
    anatPart,
}: KeepGoingPathProps) => (
    <SurfaceCard.List
        bordered={bordered}
        label={heading}
        anatPart={anatPart}
        showAnatomy={showAnatomy}
        items={lessons.map((lesson) => {
            const { Icon, className } = LESSON_LEADING[lesson.state]
            return {
                key: lesson.id,
                leading: <Icon aria-hidden focusable="false" className={className} />,
                title: lesson.title,
                subtitle: `${lesson.minutes} phút đọc`,
                onPress: lesson.onPress,
                meta: (
                    <div className="flex items-center gap-2">
                        <DifficultyChip difficulty={lesson.difficulty} />
                        {lesson.locked ? (
                            <LockIcon aria-label="Premium" focusable="false" className="size-5 text-muted" />
                        ) : null}
                    </div>
                ),
            }
        })}
    />
)

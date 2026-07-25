"use client"

import React from "react"
import type { ReactNode, SVGProps } from "react"
import { TrayIcon, WarningIcon, type Icon as PhosphorIcon } from "@phosphor-icons/react"

import { Feedback, type FeedbackIcon } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { Button } from "@sb-components/_designs/buttons/Button/Button"
import { AnatomyOverlay } from "@sb-utils/AnatomyOverlay/AnatomyOverlay"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `AsyncContent.*`, the ONE async-state KHUNG
 * namespace (thầy chốt 2026-07-25). Three sibling frames that used to live as
 * three loose folders (`AsyncContent` · `EmptyContent` · `ErrorContent`) are now
 * MEMBERS of one namespace — same tier, same job (cầm vòng đời của MỘT vùng dữ
 * liệu async: error → loading → empty → content), one import.
 *
 * | Member | Vai trò | Kênh nội dung |
 * |---|---|---|
 * | `.Base`  | khung CHUYỂN TRẠNG THÁI (switch 4 nhánh) | slot `content` (+ `children` = rút gọn), `skeleton`, `emptyContent`, `errorContent` |
 * | `.Empty` | khung THÔNG ĐIỆP RỖNG  | props `title`/`description`/`action` |
 * | `.Error` | khung THÔNG ĐIỆP LỖI   | props `title`/`description`/`action` |
 *
 * KHUNG API LAW (§13b):
 * - `.Base` là khung BỌC → slot có tên (`content`) là đường chính, `children` vẫn
 *   cho (= `content` rút gọn); ba nhánh còn lại là slot có tên riêng của nó
 *   (`skeleton` · `emptyContent` · `errorContent`).
 * - `.Empty`/`.Error` là khung THÔNG ĐIỆP props-only — KHÔNG `children`: chúng
 *   không bọc nội dung, chúng SẮP một thông điệp (icon · title · description ·
 *   action) đã dịch sẵn do caller truyền vào. Không mang chữ/ngữ nghĩa domain.
 * - Namespace only — KHÔNG export component trần.
 *
 * Behaviour/skin của mỗi member giữ NGUYÊN VĂN từ thư mục cũ; đây là refactor
 * API, không phải refactor thị giác. Điểm MỚI duy nhất: slot `action` tổng quát
 * trên `.Empty`/`.Error` (shorthand `onRetry` + `retryLabel` vẫn chạy y như cũ).
 * Synced to `src` later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared message-frame plumbing (.Empty / .Error)
// ─────────────────────────────────────────────────────────────────────────────

/** Props chung của hai khung THÔNG ĐIỆP `.Empty` / `.Error`. */
interface MessageProps {
    /** Dòng chính (đã dịch). */
    title: ReactNode
    /** Dòng phụ dưới tiêu đề (đã dịch). Tuỳ chọn. */
    description?: ReactNode
    /**
     * Ghi đè glyph mặc định — nhận **COMPONENT REF** (`icon={TrayIcon}`), KHÔNG phải
     * JSX. §14b: caller (nhất là SCREEN) không được cầm node dựng sẵn. Khung sở hữu
     * scale + `weight="duotone"` (§4/§5) nên mọi empty/error trong hệ nói cùng một
     * giọng glyph — caller chỉ chọn "hình gì", không chọn "trông thế nào".
     */
    icon?: PhosphorIcon
    /**
     * Slot HÀNH ĐỘNG tổng quát dưới mô tả — nhận node bất kỳ (một `Button`, một
     * cụm hai nút…). THẮNG shorthand `onRetry`/`retryLabel` khi truyền cả hai.
     */
    action?: ReactNode
    /** Shorthand: handler thử lại — chỉ render nút khi ĐI KÈM `retryLabel`. */
    onRetry?: () => void
    /** Shorthand: nhãn (đã dịch) của nút thử lại — bắt buộc để nút hiện ra. */
    retryLabel?: ReactNode
    /** Class thêm trên wrapper. */
    className?: string
    /** Bật → phát `data-anat-part` trên các part để BlockAnatomy gắn badge. */
    showAnatomy?: boolean
}

/**
 * Ép `weight="duotone"` cho glyph của khung thông điệp — §4/§5: KHUNG sở hữu cách
 * glyph trông ra sao, caller chỉ chọn glyph nào. Trước 2026-07-25 khung nhận
 * `icon?: ReactNode` nên mỗi caller tự quyết weight → đã lệch sẵn (story duotone,
 * screen không). Adapter `nodeAsIcon` cũ đã xoá theo ghi chú nợ của chính nó.
 */
const withDuotone = (Icon: PhosphorIcon): FeedbackIcon => {
    const Glyph = (props: SVGProps<SVGSVGElement>) => <Icon {...props} weight="duotone" />
    return Glyph
}

/**
 * Dựng nội dung slot `action`: node `action` tự do thắng; nếu không, cặp
 * `onRetry` + `retryLabel` được gói thành một `Button` secondary size sm.
 */
const composeAction = ({ action, onRetry, retryLabel, showAnatomy }: MessageProps): ReactNode => {
    if (action != null) {
        return showAnatomy ? <span data-anat-part="Action">{action}</span> : action
    }
    if (onRetry && retryLabel) {
        return (
            <Button
                variant="secondary"
                size="sm"
                onPress={onRetry}
                anatPart={showAnatomy ? "Button" : undefined}
            >
                {retryLabel}
            </Button>
        )
    }
    return undefined
}

// ─────────────────────────────────────────────────────────────────────────────
// .Base — the 4-branch state switch (was `AsyncContent`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props cho {@link AsyncContent.Base}. */
export interface AsyncContentBaseProps {
    /**
     * True khi lần load ĐẦU đang chạy (chưa có cache). Đang true thì
     * {@link AsyncContentBaseProps.skeleton} hiện ra. Truyền điều kiện đã rút gọn,
     * ví dụ `isLoading && items.length === 0`.
     */
    isLoading: boolean
    /**
     * Slot NHÁNH LOADING: skeleton mirror đúng layout thật (một cây `Skeleton.*`),
     * để hộp không sập/không giật lúc resolve.
     */
    skeleton: ReactNode
    /** True (sau khi load xong) → khung rơi về nhánh rỗng. */
    isEmpty?: boolean
    /**
     * Slot NHÁNH RỖNG, truyền bằng PROPS (không phải node) — chuyển thẳng cho
     * {@link AsyncContent.Empty}. Bỏ trống → nhánh rỗng render null (section tự ẩn).
     */
    emptyContent?: AsyncContentEmptyProps
    /**
     * Truthy → khung rơi về nhánh lỗi (ƯU TIÊN CAO NHẤT, thắng cả loading).
     * Truyền `error` của SWR (chỉ khi không còn cache để hiển thị).
     */
    error?: unknown
    /**
     * Slot NHÁNH LỖI, truyền bằng PROPS — chuyển thẳng cho {@link AsyncContent.Error}.
     * ⚠️ Bỏ trống thì nhánh lỗi KHÔNG kích hoạt (khung rơi tiếp xuống loading/empty/
     * content) — giữ nguyên hợp đồng cũ, không đổi hành vi trong lần gom này.
     */
    errorContent?: AsyncContentErrorProps
    /**
     * Slot NHÁNH CONTENT — dữ liệu đã tải xong. Đường chính của khung BỌC;
     * `children` là lối rút gọn. `content` thắng khi truyền cả hai.
     */
    content?: ReactNode
    /** Rút gọn của {@link AsyncContentBaseProps.content}. */
    children?: ReactNode
    /** Dev/spec: phủ annotation anatomy quanh nhánh đang render. */
    showAnatomy?: boolean
}

/**
 * Khung CHUYỂN TRẠNG THÁI chuẩn cho mọi vùng dữ liệu async — nơi DUY NHẤT giữ
 * bốn nhánh mà hợp đồng render của SWR đòi. Thứ tự ưu tiên:
 *
 *   error → loading → empty → content
 *
 * Hai nhánh thông điệp cấu hình bằng PROPS (không phải node):
 * `emptyContent={{ title, description, onRetry, retryLabel }}`; `skeleton` là cây
 * `Skeleton.*` mirror layout thật.
 *
 * @param props - {@link AsyncContentBaseProps}
 */
const Base = ({
    isLoading,
    skeleton,
    isEmpty = false,
    emptyContent,
    error,
    errorContent,
    content,
    children,
    showAnatomy = false,
}: AsyncContentBaseProps) => {
    let branch: React.ReactNode
    // Anatomy label = the node the switch PICKED, so a BlockAnatomy leaf badges the
    // branch actually on screen (each branch is its own leaf with its own tree).
    let branchName: string
    if (error && errorContent) {
        branch = <ErrorMessage {...errorContent} />
        branchName = "AsyncContent.Error"
    } else if (isLoading) {
        branch = skeleton
        branchName = "Skeleton"
    } else if (isEmpty) {
        branch = emptyContent ? <Empty {...emptyContent} /> : null
        branchName = "AsyncContent.Empty"
    } else {
        branch = content ?? children
        branchName = "Content"
    }
    // `branch == null` = the SILENT empty branch: nothing rendered, so there is no
    // node to annotate — skip the overlay instead of badging an empty box.
    return showAnatomy && branch != null ? (
        <div className="relative" data-anat>
            {branch}
            <AnatomyOverlay
                label={branchName}
                tier="primitive"
                href="/?path=/docs/layouts-async-asynccontent-asynccontent-base--docs"
            />
        </div>
    ) : <>{branch}</>
}

// ─────────────────────────────────────────────────────────────────────────────
// .Empty — the empty-message frame (was `EmptyContent`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props cho {@link AsyncContent.Empty} — khung thông điệp rỗng (props-only). */
export type AsyncContentEmptyProps = MessageProps

/**
 * Khung THÔNG ĐIỆP RỖNG độc lập — icon khay, tiêu đề + mô tả tuỳ chọn, và một
 * slot hành động (hoặc shorthand "thử lại"), canh giữa. Là `emptyContent` chuẩn
 * của {@link AsyncContent.Base}.
 *
 * Lớp MỎNG trên khung `Feedback.Empty`: chỉ thêm `TrayIcon` mặc định và gói
 * `onRetry`/`retryLabel` thành nút cho slot `action` — KHÔNG tự vẽ lại icon +
 * title + description + button.
 *
 * @param props - {@link AsyncContentEmptyProps}
 */
const Empty = (props: AsyncContentEmptyProps) => {
    const { title, description, icon, className, showAnatomy } = props
    return (
        <Feedback.Empty
            anatPart={showAnatomy ? "Feedback.Empty" : undefined}
            className={className}
            icon={withDuotone(icon ?? TrayIcon)}
            title={title}
            description={description}
            action={composeAction(props)}
        />
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Error — the error-message frame (was `ErrorContent`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props cho {@link AsyncContent.Error} — khung thông điệp lỗi (props-only). */
export type AsyncContentErrorProps = MessageProps

/**
 * Khung THÔNG ĐIỆP LỖI độc lập — icon cảnh báo, tiêu đề + mô tả tuỳ chọn, và một
 * slot hành động (thường là "thử lại"), canh giữa. Là `errorContent` chuẩn của
 * {@link AsyncContent.Base}.
 *
 * Lớp MỎNG trên khung `Feedback.Empty` với `tone="danger"`.
 *
 * @param props - {@link AsyncContentErrorProps}
 */
const ErrorMessage = (props: AsyncContentErrorProps) => {
    const { title, description, icon, className, showAnatomy } = props
    return (
        <Feedback.Empty
            anatPart={showAnatomy ? "Feedback.Empty" : undefined}
            className={className}
            tone="danger"
            icon={withDuotone(icon ?? WarningIcon)}
            title={title}
            description={description}
            action={composeAction(props)}
        />
    )
}

/**
 * Namespace KHUNG của vòng đời async — ba member, một import:
 *
 * | Member | Kênh nội dung |
 * |---|---|
 * | `.Base`  | `content` (+ `children` = rút gọn) · `skeleton` · `emptyContent` · `errorContent` |
 * | `.Empty` | props-only (`title`/`description`/`icon`/`action`) |
 * | `.Error` | props-only (`title`/`description`/`icon`/`action`) |
 */
export const AsyncContent = {
    Base,
    Empty,
    Error: ErrorMessage,
}

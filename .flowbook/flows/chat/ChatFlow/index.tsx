import React from "react"

import { Typography } from "@heroui/react"

import { ContentAiChatMock, type ScreenId } from "../ContentAiChatMock"
import { LessonScreen } from "../LessonScreen"

/**
 * The Content-AI journey as a STORYBOOD — every screen rendered at once (not an
 * interactive walk). Screen 1 is the wide lesson host page; screens 2–14 are the chat
 * rail views, each posed at the app's real ~380px rail width. Each note points at the
 * Storybook story / prototype that documents the same surface in isolation.
 */
const RAIL_SCREENS: Array<{ id: ScreenId; title: string; draft?: string; note: string }> = [
    { id: "empty", title: "2. Chat rỗng", note: "features/learn/ContentAiChat — empty" },
    { id: "composing", title: "3. Đang soạn", draft: "Giải thích idempotency key giúp mình", note: "blocks/feed/Composer" },
    { id: "selection", title: "4. Bôi đen đoạn → hỏi", note: "ContentAiChat — selected passage" },
    { id: "sending", title: "5. Đang gửi", note: "blocks/feed/ChatBubble — thinking" },
    { id: "streaming", title: "6. Đang trả lời (stream)", note: "blocks/feed/ChatBubble — partial" },
    { id: "answered", title: "7. Đã trả lời + nguồn", note: "blocks/learn/ChatToolResult" },
    { id: "error", title: "8. Lỗi", note: "blocks/feed/ChatBubble — error" },
    { id: "gated", title: "9. Hết lượt AI", note: "enroll-gate-teaser — quota gate" },
    { id: "search", title: "10. Tìm nội dung / quiz", note: "ContentAiChat — search view" },
    { id: "conversations", title: "11. Lịch sử trò chuyện", note: "ContentAiChat — conversations view" },
    { id: "rename", title: "12. Đổi tên hội thoại", note: "ContentAiChat — inline rename" },
    { id: "skillMenu", title: "13. Menu kỹ năng", note: "ContentAiChat — skill menu" },
    { id: "modelPicker", title: "14. Chọn model", note: "blocks/grading/GradeModelDropdown" },
]

/** One labelled card in the storyboard. */
const ScreenCard = ({
    title,
    note,
    children,
    wide,
}: {
    title: string
    note: string
    children: React.ReactNode
    wide?: boolean
}) => (
    <div className={wide ? "flex w-full max-w-[720px] flex-col gap-2" : "flex w-[380px] flex-col gap-2"}>
        <div className="flex flex-col">
            <Typography type="body-sm">{title}</Typography>
            <Typography type="body-xs" color="muted">
                <code>{note}</code>
            </Typography>
        </div>
        {children}
    </div>
)

export const ChatFlow = () => (
    <div className="flex flex-col gap-6">
        <ScreenCard title="1. Vô bài học" note="features/learn (host page)" wide>
            <LessonScreen />
        </ScreenCard>

        <div className="flex flex-wrap gap-6">
            {RAIL_SCREENS.map((screen) => (
                <ScreenCard key={screen.id} title={screen.title} note={screen.note}>
                    <div className="flex h-[520px] flex-col rounded-2xl border border-default bg-surface p-4 shadow-lg">
                        <ContentAiChatMock screen={screen.id} draft={screen.draft} />
                    </div>
                </ScreenCard>
            ))}
        </div>
    </div>
)

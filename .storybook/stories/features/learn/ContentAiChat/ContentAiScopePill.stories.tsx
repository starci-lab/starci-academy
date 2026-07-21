import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { ContentAiScopePill } from "@/components/features/learn/ContentAiChat/ContentAiScopePill"

/**
 * `ContentAiScopePill` — what the content-AI chat will ground its NEXT answer on,
 * rendered in the panel header (rail + drawer) rather than above the composer.
 *
 * It is a container: it reads the open lesson / course from redux and the widening
 * flag from `useContentAiChatScopeStore`, because the same pill renders in two
 * hosts and prop-drilling four values through both would drift.
 */
const meta = {
    title: "Features/Learn/ContentAiChat/ContentAiScopePill",
    component: ContentAiScopePill,
} satisfies Meta<typeof ContentAiScopePill>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default — reads whatever scope the store/redux currently hold. In Storybook
 * there is no open lesson, so it renders the COURSE face (the lesson-less
 * fallback), which is exactly the state that used to be mislabelled in the app.
 */
export const Default: Story = {
    tags: ["news"],
    parameters: {
        usage: "Chờ duyệt — pill ngữ cảnh của chat, giờ nằm ở HEADER panel thay cho tiêu đề. Trước đây panel nói ngữ cảnh HAI lần: tiêu đề trên cùng (\"DevOps Mastery\") và pill dưới composer (\"Cả khoá · DevOps Mastery\"). Gộp về một chỗ, và đặt đúng nơi có nút đổi scope. Storybook không có bài nào mở nên pill hiện mặt CẢ KHOÁ — đúng trạng thái mà app trước đây gán nhãn sai thành \"bài này\".",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Trong header panel</Label>
                <Typography type="body-sm" color="muted">
                    pill co giãn (`flex-1`) cạnh các nút icon, nên tên bài dài bị cắt bằng `truncate` chứ không đẩy nút ra khỏi hàng.
                </Typography>
            </div>
            <div className="flex w-[392px] items-center gap-2 rounded-2xl border border-default bg-surface p-3">
                <ContentAiScopePill className="min-w-0 flex-1" />
                <div className="size-8 shrink-0 rounded-lg border border-default" />
                <div className="size-8 shrink-0 rounded-lg border border-default" />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Đứng một mình</Label>
                <Typography type="body-sm" color="muted">
                    mặt CẢ KHOÁ (`border-info`) — dùng khi không có bài nào mở. Khi đang đọc một bài, pill đổi sang `border-accent` kèm link “Hỏi cả khoá” để nới.
                </Typography>
            </div>
            <div className="w-[392px]">
                <ContentAiScopePill />
            </div>
        </div>
    ),
}

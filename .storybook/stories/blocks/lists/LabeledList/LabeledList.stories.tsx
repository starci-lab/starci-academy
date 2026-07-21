import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, ListBox, Typography } from "@heroui/react"
import { CardsIcon } from "@phosphor-icons/react"
import { LabeledList } from "@/components/blocks/lists/LabeledList"
import { DifficultyChip } from "@/components/blocks/chips/DifficultyChip"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof LabeledList> = {
    title: "Blocks/List/LabeledList",
    component: LabeledList,
}
export default meta
type Story = StoryObj<typeof LabeledList>

/** One challenge row: title + difficulty dot, mirroring `LessonChallenges`. */
const challenges = [
    { id: "two-sum", title: "Two Sum", difficulty: "beginner" as const },
    { id: "sliding-window", title: "Sliding Window Maximum", difficulty: "advanced" as const },
    { id: "lru-cache", title: "LRU Cache", difficulty: "intermediate" as const },
]

/** Flashcard decks RAG-related to a lesson, mirroring `LessonFlashcards` (plain rows, no chip). */
const decks = [
    { id: "closures", title: "JavaScript Closures" },
    { id: "event-loop", title: "Event Loop" },
]

/** Quick-access shortcuts, mirroring the dashboard `QuickActions` rail. */
const shortcuts = [
    { id: "courses", label: "Khoá học" },
    { id: "review", label: "Ôn tập thẻ ghi nhớ" },
    { id: "practice", label: "Luyện tập" },
]

/**
 * Toàn bộ hình hài của LabeledList: rỗng, một mục, nhiều mục kèm action, có icon
 * dẫn đầu, và lồng ListBox điều hướng thay cho row tĩnh. LabeledList không có card
 * frame/props riêng cho state — mọi trạng thái (rỗng/loading/error) là do CALLER
 * (thường bọc AsyncContent) quyết định render gì vào children, block chỉ giữ layout
 * 3 nhóm label/list/action cách nhau gap-3.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng cho panel rail kiểu \"label + danh sách ngắn (+ CTA)\" khi một card đầy đủ khung là quá nặng, ví dụ panel Ôn tập/Luyện tập ở rail bài học hay danh sách truy cập nhanh ở dashboard. Block chỉ lo layout (icon + Label, khối children gap-2, action gap-3 phía dưới) — rỗng/loading/error do caller quyết định (thường bọc AsyncContent bên ngoài) chứ LabeledList không tự có state riêng.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Rỗng"
                hint="Danh sách chưa có mục nào (ví dụ deck ôn tập RAG-liên-quan chưa tìm được kết quả nào cho bài học). LabeledList vẫn render khối label bình thường, không tự ẩn — caller quyết định ẩn cả panel qua AsyncContent isEmpty ở tầng ngoài."
            >
                <LabeledList label="Ôn tập bài này">
                    {[].map(() => null)}
                </LabeledList>
            </Variant>
            <Variant
                label="Một mục, không action"
                hint="Chỉ một deck liên quan tới bài học — panel review khi chưa cần CTA riêng, ví dụ đang xem trước khi có nút bắt đầu ôn tập."
            >
                <LabeledList label="Ôn tập bài này">
                    {decks.slice(0, 1).map((deck) => (
                        <Typography key={deck.id} type="body-sm" color="muted" truncate>
                            {deck.title}
                        </Typography>
                    ))}
                </LabeledList>
            </Variant>
            <Variant
                label="Nhiều mục, kèm action"
                hint="Panel luyện tập ở rail bài học: mỗi challenge là một hàng tiêu đề + độ khó, và nút CTA chính ở dưới mở tab Challenges — đúng khuôn của LessonChallenges."
            >
                <LabeledList
                    label="Luyện tập bài này"
                    action={(
                        <Button size="sm" variant="primary" className="self-start">
                            Luyện tập ngay
                        </Button>
                    )}
                >
                    {challenges.map((challenge) => (
                        <div key={challenge.id} className="flex items-center justify-between gap-2">
                            <Typography type="body-sm" color="muted" truncate>
                                {challenge.title}
                            </Typography>
                            <DifficultyChip difficulty={challenge.difficulty} />
                        </div>
                    ))}
                </LabeledList>
            </Variant>
            <Variant
                label="Có icon dẫn đầu"
                hint="Truyền icon khi panel cần một dấu hiệu trực quan trước label, ví dụ icon thẻ ghi nhớ đứng trước tiêu đề Ôn tập để phân biệt nhanh với panel Luyện tập bên cạnh."
            >
                <LabeledList
                    label="Thẻ ghi nhớ liên quan"
                    icon={<CardsIcon aria-hidden focusable="false" className="size-5" />}
                >
                    {decks.map((deck) => (
                        <Typography key={deck.id} type="body-sm" color="muted" truncate>
                            {deck.title}
                        </Typography>
                    ))}
                </LabeledList>
            </Variant>
            <Variant
                label="Lồng ListBox điều hướng"
                hint="Children không bắt buộc là text tĩnh — panel Truy cập nhanh ở dashboard lồng cả ListBox chọn-điều-hướng bên trong, LabeledList chỉ lo khung label/spacing bên ngoài, không quan tâm caller render gì."
            >
                <LabeledList label="Truy cập nhanh">
                    <ListBox aria-label="Truy cập nhanh" selectionMode="none" className="gap-1 p-0">
                        {shortcuts.map((shortcut) => (
                            <ListBox.Item
                                key={shortcut.id}
                                id={shortcut.id}
                                textValue={shortcut.label}
                                className="flex cursor-pointer items-center gap-3 rounded-large px-2 py-2 text-foreground outline-none data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-accent data-[hovered=true]:bg-default"
                            >
                                <span className="min-w-0 flex-1 truncate text-sm">
                                    {shortcut.label}
                                </span>
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </LabeledList>
            </Variant>
        </Gallery>
    ),
}

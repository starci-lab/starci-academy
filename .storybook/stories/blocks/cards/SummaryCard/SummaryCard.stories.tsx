import type { Meta, StoryObj } from "@storybook/nextjs"
import { BookOpenIcon, FireIcon, TrophyIcon } from "@phosphor-icons/react"
import { SummaryCard } from "./SummaryCard"

const meta: Meta<typeof SummaryCard> = {
    title: "Design/Cards/SummaryCard",
    component: SummaryCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SummaryCard>

/** With hint — a short gloss line under the label (e.g. the most recent milestone). */
export const WithHint: Story = {
    parameters: {
        usage:
            "Dùng khi value + label chưa đủ ngữ cảnh — thêm 1 dòng `hint` chìm (mốc gần nhất, phạm vi tính). " +
            "Icon truyền TRẦN (card tự ép `size-6`, §4); bỏ `hint` khi số liệu đã tự giải thích.",
    },
    render: () => (
        <div className="max-w-xs">
            <SummaryCard
                icon={<BookOpenIcon aria-hidden focusable="false" />}
                value="12"
                label="Khóa đã hoàn thành"
                hint="Gần nhất: 15/07/2026"
                onPress={() => {}}
            />
        </div>
    ),
}

/** No hint — value + label already explain themselves (e.g. a learning streak). */
export const NoHint: Story = {
    parameters: {
        usage: "Bỏ `hint` khi value + label đã đủ nghĩa (streak, số đếm trực tiếp) — tránh dòng meta thừa.",
    },
    render: () => (
        <div className="max-w-xs">
            <SummaryCard
                icon={<FireIcon aria-hidden focusable="false" />}
                value="7"
                label="Ngày học liên tiếp"
                onPress={() => {}}
            />
        </div>
    ),
}

/** Long content — label / hint longer than usual: the card keeps a fixed width and wraps, never truncates. */
export const LongContent: Story = {
    parameters: {
        usage: "Kiểm chứng label/hint dài: card giữ chiều rộng cố định và WRAP (không cắt cụt) — không cần prop riêng.",
    },
    render: () => (
        <div className="max-w-xs">
            <SummaryCard
                icon={<TrophyIcon aria-hidden focusable="false" />}
                value="4.8/5"
                label="Điểm trung bình các bài chấm phỏng vấn thử"
                hint="Tính trên toàn bộ lượt chấm trong 3 tháng gần nhất"
                onPress={() => {}}
            />
        </div>
    ),
}

/** Group — the real usage: a cluster of metric cards via `SummaryCard.Group`, each linking to a tab. */
export const Group: Story = {
    parameters: {
        usage:
            "Dùng `SummaryCard.Group` khi có ≥2 card cùng vai (overview) — group tự lo `gap-3` + width đều + wrap, " +
            "caller KHÔNG hand-roll `<div className=\"w-56\">` quanh từng card (§6 fold cluster → 1 primitive).",
    },
    render: () => (
        <SummaryCard.Group
            items={[
                {
                    icon: <BookOpenIcon aria-hidden focusable="false" />,
                    value: "12",
                    label: "Khóa đã hoàn thành",
                    hint: "Gần nhất: 15/07/2026",
                    onPress: () => {},
                },
                {
                    icon: <FireIcon aria-hidden focusable="false" />,
                    value: "7",
                    label: "Ngày học liên tiếp",
                    onPress: () => {},
                },
                {
                    icon: <TrophyIcon aria-hidden focusable="false" />,
                    value: "4.8/5",
                    label: "Điểm trung bình bài chấm",
                    onPress: () => {},
                },
            ]}
        />
    ),
}

/** Loading — `isSkeleton` self-renders the skeleton mirror (icon · value · label · hint), no loose Skeleton. */
export const Loading: Story = {
    parameters: {
        usage: "Truyền `isSkeleton` khi số liệu đang tải — card (và `SummaryCard.Group`) tự vẽ skeleton mirror đúng layout. Không dựng Skeleton rời ngoài.",
    },
    render: () => (
        <SummaryCard.Group
            isSkeleton
            items={[
                {
                    icon: <BookOpenIcon aria-hidden focusable="false" />,
                    value: "12",
                    label: "Khóa đã hoàn thành",
                    hint: "Gần nhất: 15/07/2026",
                },
                {
                    icon: <FireIcon aria-hidden focusable="false" />,
                    value: "7",
                    label: "Ngày học liên tiếp",
                },
                {
                    icon: <TrophyIcon aria-hidden focusable="false" />,
                    value: "4.8/5",
                    label: "Điểm trung bình bài chấm",
                },
            ]}
        />
    ),
}

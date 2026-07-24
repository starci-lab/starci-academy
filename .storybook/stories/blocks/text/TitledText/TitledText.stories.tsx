import type { Meta, StoryObj } from "@storybook/nextjs"
import { TitledText } from "./TitledText"

/**
 * PRIMITIVE — a primary line + optional muted secondary (and hint) stacked as ONE
 * unit. Use this instead of hand-rolling two/three raw Typography every time a row,
 * header, or metric needs a title↔subtitle. `size` picks the scale:
 * `row` (dense) · `header` (section) · `stat` (metric value + label + hint).
 */
const meta: Meta<typeof TitledText> = {
    title: "Primitives/Text/TitledText",
    component: TitledText,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof TitledText>

const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/** ROW — the default dense case: title (body-sm medium) + muted subtitle (body-xs). */
export const Row: Story = {
    render: () => shell(
        <TitledText title="Chấm bài với model premium" subtitle="Mở khoá khi nâng cấp gói" />,
    ),
}

/** HEADER — a section header: title (h3 semibold) + muted description (body-sm). */
export const Header: Story = {
    render: () => shell(
        <TitledText size="header" title="Khoá học DevOps" subtitle="12 mô-đun · cập nhật 2 ngày trước" />,
    ),
}

/** STAT — a metric: big bold value + foreground label + muted hint (3 lines). */
export const Stat: Story = {
    render: () => shell(
        <TitledText size="stat" title="1.284" subtitle="Học viên" hint="+12% so với tháng trước" />,
    ),
}

/** TITLE ONLY — subtitle omitted (single line). */
export const TitleOnly: Story = {
    render: () => shell(<TitledText title="Thông báo" />),
}

/** SIZES — row · header · stat side by side. */
export const Sizes: Story = {
    render: () => shell(
        <div className="flex flex-col gap-6">
            <TitledText title="Row scale" subtitle="body-sm medium + body-xs muted" />
            <TitledText size="header" title="Header scale" subtitle="h3 semibold + body-sm muted" />
            <TitledText size="stat" title="98%" subtitle="Hoàn thành" hint="+4% tuần này" />
        </div>,
    ),
}

/** TRUNCATE — both lines clamp to one line inside a bounded width. */
export const Truncate: Story = {
    render: () => shell(
        <div className="w-56 rounded-2xl border border-separator p-3">
            <TitledText
                title="Một tiêu đề rất dài sẽ bị cắt bớt ở cuối dòng"
                subtitle="Và một mô tả phụ cũng dài không kém sẽ bị cắt tương tự"
                truncate
            />
        </div>,
    ),
}

/** SKELETON — the loading mirror (bars sized per line). */
export const Skeleton: Story = {
    render: () => shell(
        <div className="flex flex-col gap-6">
            <TitledText title="" subtitle="x" isSkeleton />
            <TitledText size="stat" title="" subtitle="x" hint="x" isSkeleton />
        </div>,
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Skeleton } from "./index"

const meta: Meta<typeof Skeleton> = {
    title: "Blocks/Skeleton",
    component: Skeleton,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof Skeleton>

/** Dùng cho placeholder shimmer thô — tự định cỡ qua className (h/w/rounded) khi cần 1 mảng loading không khớp component cụ thể nào. */
export const Bar: Story = {
    parameters: { usage: "Dùng cho placeholder shimmer thô — tự định cỡ qua className (h/w/rounded) khi cần 1 mảng loading không khớp component cụ thể nào." },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <Skeleton className="h-28 w-full rounded-xl" />
        </div>
    ),
}

/** Đặt cạnh nhau bộ placeholder dựng sẵn (mỗi cái khớp hộp của một component HeroUI) để chọn đúng mảnh khi mirror layout thật lúc làm loading state. */
export const Primitives: Story = {
    parameters: { usage: "Đặt cạnh nhau bộ placeholder dựng sẵn (mỗi cái khớp hộp của một component HeroUI) để chọn đúng mảnh khi mirror layout thật lúc làm loading state." },
    render: () => (
        <div className="grid w-[560px] grid-cols-2 gap-x-8 gap-y-5">
            <SkeletonRow label="Typography"><Skeleton.Typography type="body-sm" /></SkeletonRow>
            <SkeletonRow label="Paragraph"><Skeleton.Paragraph lines={3} /></SkeletonRow>
            <SkeletonRow label="Avatar"><Skeleton.Avatar size="md" /></SkeletonRow>
            <SkeletonRow label="Chip"><Skeleton.Chip /></SkeletonRow>
            <SkeletonRow label="Button"><Skeleton.Button /></SkeletonRow>
            <SkeletonRow label="Input"><Skeleton.Input /></SkeletonRow>
            <SkeletonRow label="ListRow"><Skeleton.ListRow /></SkeletonRow>
            <SkeletonRow label="Metric"><Skeleton.Metric /></SkeletonRow>
        </div>
    ),
}

/** Ví dụ ghép đúng chuẩn: mirror cây layout thật của một thẻ người dùng (avatar + 2 dòng chữ + nút), giữ nguyên cấu trúc và chỉ thay node nội dung bằng Skeleton.<Component>. */
export const ComposedExample: Story = {
    parameters: { usage: "Ví dụ ghép đúng chuẩn: mirror cây layout thật của một thẻ người dùng (avatar + 2 dòng chữ + nút), giữ nguyên cấu trúc và chỉ thay node nội dung bằng Skeleton.<Component>." },
    render: () => (
        <div className="flex w-80 items-center gap-3 rounded-2xl border border-default p-4">
            <Skeleton.Avatar size="md" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton.Typography type="body-sm" />
                <Skeleton.Typography type="body-xs" />
            </div>
            <Skeleton.Button />
        </div>
    ),
}

/** Nhãn nhỏ cạnh mỗi mẫu skeleton trong story Primitives. */
const SkeletonRow = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex flex-col gap-2">
        <span className="text-xs text-muted">{label}</span>
        {children}
    </div>
)

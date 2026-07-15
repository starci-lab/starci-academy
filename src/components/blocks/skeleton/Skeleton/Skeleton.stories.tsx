import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Label } from "@heroui/react"
import { Skeleton } from "./index"

const meta: Meta<typeof Skeleton> = {
    title: "Blocks/Skeleton/Skeleton",
    component: Skeleton,
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

/** Bảng tra để chọn đúng mảnh khi dựng loading state: tìm kind khớp node thật rồi thay vào. Nguyên tắc là mirror cây layout THẬT — giữ nguyên node cấu trúc (separator, wrapper, gap) và chỉ thay node nội dung bằng Skeleton.<Component>, không rải shimmer bừa. Cần một mảng thô không khớp component nào thì dùng Skeleton trần (story Bar) và tự định cỡ bằng className. */
export const AllKinds: Story = {
    parameters: { usage: "Bảng tra để chọn đúng mảnh khi dựng loading state: tìm kind khớp node thật rồi thay vào. Nguyên tắc là mirror cây layout THẬT — giữ nguyên node cấu trúc (separator, wrapper, gap) và chỉ thay node nội dung bằng Skeleton.<Component>, không rải shimmer bừa. Cần một mảng thô không khớp component nào thì dùng Skeleton trần (story Bar) và tự định cỡ bằng className." },
    render: () => (
        <div className="flex w-[720px] flex-col gap-8">
            <SkeletonGroup title="Chữ">
                <SkeletonRow label="Typography"><Skeleton.Typography type="h3" width="2/3" /></SkeletonRow>
                <SkeletonRow label="Paragraph"><Skeleton.Paragraph lines={3} /></SkeletonRow>
            </SkeletonGroup>

            <SkeletonGroup title="Form">
                <SkeletonRow label="Input"><Skeleton.Input /></SkeletonRow>
                <SkeletonRow label="Select"><Skeleton.Select /></SkeletonRow>
                <SkeletonRow label="TextArea"><Skeleton.TextArea rows={3} /></SkeletonRow>
                <SkeletonRow label="Slider">
                    <div className="w-56"><Skeleton.Slider /></div>
                </SkeletonRow>
                <SkeletonRow label="Button"><Skeleton.Button /></SkeletonRow>
                <SkeletonRow label="Switch"><Skeleton.Switch /></SkeletonRow>
                <SkeletonRow label="Checkbox"><Skeleton.Checkbox /></SkeletonRow>
                <SkeletonRow label="RadioGroup"><Skeleton.RadioGroup /></SkeletonRow>
            </SkeletonGroup>

            <SkeletonGroup title="Danh tính">
                <SkeletonRow label="Avatar"><Skeleton.Avatar size="lg" /></SkeletonRow>
                <SkeletonRow label="UserCell"><Skeleton.UserCell /></SkeletonRow>
                <SkeletonRow label="Chip"><Skeleton.Chip /></SkeletonRow>
                <SkeletonRow label="Kbd"><Skeleton.Kbd /></SkeletonRow>
                <SkeletonRow label="Badge"><Skeleton.Badge /></SkeletonRow>
            </SkeletonGroup>

            <SkeletonGroup title="Tiến trình / số liệu">
                <SkeletonRow label="ProgressBar">
                    <div className="w-56"><Skeleton.ProgressBar /></div>
                </SkeletonRow>
                <SkeletonRow label="Meter">
                    <div className="w-56"><Skeleton.Meter /></div>
                </SkeletonRow>
                <SkeletonRow label="SegmentBar">
                    <div className="w-56"><Skeleton.SegmentBar legendItems={3} /></div>
                </SkeletonRow>
                <SkeletonRow label="Metric"><Skeleton.Metric /></SkeletonRow>
            </SkeletonGroup>

            <SkeletonGroup title="Khối chứa">
                <SkeletonRow label="Card"><Skeleton.Card lines={3} /></SkeletonRow>
                <SkeletonRow label="Disclosure">
                    <div className="w-72"><Skeleton.Disclosure /></div>
                </SkeletonRow>
                <SkeletonRow label="Accordion">
                    <div className="w-full"><Skeleton.Accordion items={3} /></div>
                </SkeletonRow>
            </SkeletonGroup>

            <SkeletonGroup title="Điều hướng">
                <SkeletonRow label="Tabs"><Skeleton.Tabs count={3} /></SkeletonRow>
                <SkeletonRow label="Breadcrumbs"><Skeleton.Breadcrumbs count={3} /></SkeletonRow>
                <SkeletonRow label="Pagination"><Skeleton.Pagination count={5} /></SkeletonRow>
                <SkeletonRow label="Menu">
                    <div className="w-56"><Skeleton.Menu items={4} /></div>
                </SkeletonRow>
            </SkeletonGroup>

            <SkeletonGroup title="Danh sách / bảng">
                <SkeletonRow label="ListBox">
                    <div className="w-56"><Skeleton.ListBox items={4} /></div>
                </SkeletonRow>
                <SkeletonRow label="ListRow">
                    <div className="w-72"><Skeleton.ListRow withTrailing /></div>
                </SkeletonRow>
                <SkeletonRow label="Table">
                    <div className="w-full"><Skeleton.Table rows={5} cols={4} /></div>
                </SkeletonRow>
            </SkeletonGroup>
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

/** Nhãn của 1 mẫu skeleton trong story AllKinds. */
const SkeletonRow = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex flex-col gap-3">
        <Label>{label}</Label>
        {children}
    </div>
)

/** Một họ skeleton trong story AllKinds: tiêu đề nhỏ + các mẫu xếp dọc. */
const SkeletonGroup = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-6">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <div className="flex flex-col gap-6">{children}</div>
    </section>
)

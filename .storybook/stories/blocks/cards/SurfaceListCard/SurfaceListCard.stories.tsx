import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Button, Chip, Label, Typography } from "@heroui/react"
import {
    CaretRightIcon,
    CheckCircleIcon,
    CircleIcon,
    CreditCardIcon,
    TrayIcon,
    WalletIcon,
    XCircleIcon,
} from "@phosphor-icons/react"
import { SurfaceListCard, SurfaceListCardItem, SurfaceListCardRow } from "./SurfaceListCard"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

const meta: Meta<typeof SurfaceListCard> = {
    title: "Primitives/Card/SurfaceListCard",
    component: SurfaceListCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceListCard>

const caret = <CaretRightIcon className="size-3 text-muted" aria-hidden focusable="false" />

/**
 * Mock-content chuẩn (C-fixture) cho ô `children` TỰ DO của `SurfaceListCardItem`:
 * avatar + title + description. `SurfaceListCardItem` đã LÀ hộp row (padding + hover +
 * separator riêng) nên KHÔNG bọc thêm `Card` ngoài (tránh card-in-card) — chỉ giữ row
 * (neo `GroupPressableCard.stories.tsx` `profileTile`, cùng lý do: item đã là shell).
 */
const profileRow = (initials: string, title: string, description: string) => (
    <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{title}</span>
            <span className="truncate text-xs text-muted">{description}</span>
        </div>
    </div>
)

const rows = (
    <>
        <SurfaceListCardRow title="Programming fundamentals" subtitle="12 lessons · 4 hours" onPress={() => {}} trailing={caret} />
        <SurfaceListCardRow title="Data structures & algorithms" subtitle="18 lessons · 7 hours" onPress={() => {}} trailing={caret} />
        <SurfaceListCardRow title="System design" subtitle="9 lessons · 5 hours" onPress={() => {}} trailing={caret} />
    </>
)

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard>{rows}</SurfaceListCard>
        </div>
    ),
}

export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard label="Lộ trình của tôi">{rows}</SurfaceListCard>
        </div>
    ),
}

export const SeeMore: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard label="Khoá nổi bật" onSeeMore={() => {}}>{rows}</SurfaceListCard>
        </div>
    ),
}

export const LabelEnd: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard label="Khoá của tôi" labelEnd="3 khoá">{rows}</SurfaceListCard>
        </div>
    ),
}

export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard label="Phương thức thanh toán" action={<Button variant="secondary" size="sm">Thêm</Button>}>
                <SurfaceListCardRow title="Visa •••• 6411" subtitle="Hết hạn 09/27" onPress={() => {}} />
                <SurfaceListCardRow title="Momo" subtitle="0912••••88" onPress={() => {}} />
            </SurfaceListCard>
        </div>
    ),
}

export const SubtleLabel: Story = {
    render: () => (
        <div className="p-8">
            {/* subtleLabel = a MINOR header (eyebrow) over a block, UNDER a primary section Label. */}
            <div className="flex flex-col gap-3">
                <Label>Hoạt động gần đây</Label>
                <SurfaceListCard label="Hôm nay" subtleLabel>
                    <SurfaceListCardRow title="Hoàn thành: REST semantics" subtitle="09:20" onPress={() => {}} trailing={caret} />
                    <SurfaceListCardRow title="Nộp bài: Input contract" subtitle="10:05" onPress={() => {}} trailing={caret} />
                </SurfaceListCard>
                <SurfaceListCard label="Hôm qua" subtleLabel>
                    <SurfaceListCardRow title="Xem lại: Error handling" subtitle="21:40" onPress={() => {}} trailing={caret} />
                </SurfaceListCard>
            </div>
        </div>
    ),
}

export const Description: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard
                label="Cần hoàn thành"
                description={<Typography type="body-xs" color="muted">Xong cả 3 mục để mở khoá milestone tiếp theo.</Typography>}
            >
                {rows}
            </SurfaceListCard>
        </div>
    ),
}

export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            {/* surface-in-surface: nested list delineates with a BORDER (shadow is near-invisible in dark mode). */}
            <div className="rounded-3xl bg-surface p-3 shadow-surface">
                <SurfaceListCard label="Phương thức thanh toán" bordered>
                    <SurfaceListCardRow title="MoMo wallet" subtitle="Linked on 12/06/2026" onPress={() => {}} />
                    <SurfaceListCardRow title="Visa card •••• 4242" subtitle="Expires 08/28" onPress={() => {}} selected />
                </SurfaceListCard>
            </div>
        </div>
    ),
}

/** `selected` tints a row `bg-accent-soft` — the "currently-in-use" choice (language, payment method). */
export const Selected: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard>
                <SurfaceListCardRow title="Vietnamese" onPress={() => {}} />
                <SurfaceListCardRow title="English" selected onPress={() => {}} />
            </SurfaceListCard>
        </div>
    ),
}

/** `isDisabled` dimmed + non-interactive: an option that EXISTS but isn't unlocked yet — kept visible, not hidden. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard>
                <SurfaceListCardRow title="Export PDF invoice" onPress={() => {}} />
                <SurfaceListCardRow title="Export Excel report (coming soon)" subtitle="Not yet available on the current plan" isDisabled onPress={() => {}} />
            </SurfaceListCard>
        </div>
    ),
}

/** `hover="underline"`: the row is a link (navigates away) — the TITLE underlines on hover, no row fill. */
export const HoverUnderline: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard>
                <SurfaceListCardRow title="Why do learners drop out of courses?" subtitle="12.4k reads" hover="underline" href="#" />
                <SurfaceListCardRow title="The path to becoming a Senior Backend engineer" subtitle="9.1k reads" hover="underline" href="#" />
            </SurfaceListCard>
        </div>
    ),
}

/** `leading` (thumbnail/icon) + `meta` (a short per-row tag) — the row is a composition, not flat. */
export const LeadingMeta: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard>
                <SurfaceListCardRow
                    leading={
                        <div className="flex size-10 items-center justify-center rounded-full bg-default">
                            <CreditCardIcon className="size-5 text-muted" aria-hidden focusable="false" />
                        </div>
                    }
                    title="One-time payment"
                    subtitle="Pay the full tuition now"
                    meta={<Chip size="sm" variant="soft" color="success" className="shrink-0">Save 10%</Chip>}
                    selected
                    onPress={() => {}}
                />
                <SurfaceListCardRow
                    leading={
                        <div className="flex size-10 items-center justify-center rounded-full bg-default">
                            <WalletIcon className="size-5 text-muted" aria-hidden focusable="false" />
                        </div>
                    }
                    title="Installments over 3 months"
                    subtitle="No interest"
                    onPress={() => {}}
                />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * `SurfaceListCardItem` takes arbitrary `children` — the free-form branch (no fixed
 * leading/title/subtitle slots). Content = ProfileCard fixture (C-fixture), row-only
 * because `SurfaceListCardItem` is already the row shell.
 */
export const FreeForm: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard>
                <SurfaceListCardItem onPress={() => {}}>
                    {profileRow("SC", "StarCi Academy", "Học fullstack, system design và DevOps theo lộ trình phỏng vấn.")}
                </SurfaceListCardItem>
                <SurfaceListCardItem onPress={() => {}}>
                    {profileRow("QN", "Thầy Quang", "Mentor fullstack — review dự án và mock interview.")}
                </SurfaceListCardItem>
            </SurfaceListCard>
        </div>
    ),
}

/** State markers: a leading icon as a STATUS SIGNAL (todo/done/fail) with the title tinted to match (`icon.md` §7). */
export const StateMarkers: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard>
                <SurfaceListCardRow
                    leading={<CircleIcon className="size-5 shrink-0 text-foreground" aria-hidden focusable="false" />}
                    title="Đọc nội dung bài học"
                    meta={<Typography type="body-xs" color="muted">0/1</Typography>}
                />
                <SurfaceListCardRow
                    leading={<CheckCircleIcon className="size-5 shrink-0 text-success-soft-foreground" aria-hidden focusable="false" />}
                    title={<span className="text-success-soft-foreground">Ôn 5 flashcard</span>}
                    meta={<Typography type="body-xs" color="muted">5/5</Typography>}
                />
                <SurfaceListCardRow
                    leading={<XCircleIcon className="size-5 shrink-0 text-danger" aria-hidden focusable="false" />}
                    title={<span className="text-danger">Hoàn thành 1 phiên Phỏng vấn thử</span>}
                    meta={<Typography type="body-xs" color="muted">Hết hạn</Typography>}
                />
            </SurfaceListCard>
        </div>
    ),
}

/** Static (read-only): no `onPress`/`href` → a plain `<div>` row, no hover/focus/cursor (don't fake clickable). */
export const Static: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard>
                <SurfaceListCardRow title="Resilience" meta={<Chip size="sm" variant="soft" color="danger" className="shrink-0">nhớ 25%</Chip>} />
                <SurfaceListCardRow title="Error Handling" meta={<Chip size="sm" variant="soft" color="warning" className="shrink-0">nhớ 33%</Chip>} />
                <SurfaceListCardRow title="Authorization" meta={<Chip size="sm" variant="soft" color="success" className="shrink-0">nhớ 57%</Chip>} />
            </SurfaceListCard>
        </div>
    ),
}

/** `withVerdict`: an inset left band whose colour MEANS something from data (a tier / promote-demote zone). */
export const Verdict: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard>
                <SurfaceListCardRow title="Shell & hệ thống file" withVerdict={{ enable: true, variant: "success" }} onPress={() => {}} />
                <SurfaceListCardRow title="Redirect & pipe" withVerdict={{ enable: true, variant: "warning" }} onPress={() => {}} />
                <SurfaceListCardRow title="Quyền file cơ bản" withVerdict={{ enable: true, variant: "danger" }} onPress={() => {}} />
            </SurfaceListCard>
        </div>
    ),
}

export const SingleRow: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard>
                <SurfaceListCardRow title="Chỉ một mục" subtitle="Separator tự ẩn ở row cuối" onPress={() => {}} trailing={caret} />
            </SurfaceListCard>
        </div>
    ),
}

/** Empty: no rows → the {@link EmptyState} primitive fills the surface (not a blank card). */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard
                label="Khoá của tôi"
                emptyState={
                    <EmptyState
                        icon={<TrayIcon weight="duotone" />}
                        title="Chưa có khoá nào"
                        description="Ghi danh một khoá để thấy nó ở đây."
                        action={<Button variant="primary" size="sm">Khám phá khoá học</Button>}
                    />
                }
            />
        </div>
    ),
}

/**
 * Loading: MIRROR the real card — the same JOINED `SurfaceListCard` frame + real
 * `SurfaceListCardRow`s (so the full-bleed separators + shadow-surface frame stay),
 * only the title text is swapped for a single-line `Skeleton` bar (skeleton.md: mirror
 * the layout tree, keep structural nodes — list skeleton = joined card, NOT loose rows).
 */
export const SkeletonLoading: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceListCard label="Khoá của tôi">
                {[0, 1, 2].map((i) => (
                    <SurfaceListCardRow key={i} title={<Skeleton className="h-[14px] w-1/2 rounded" />} />
                ))}
            </SurfaceListCard>
        </div>
    ),
}

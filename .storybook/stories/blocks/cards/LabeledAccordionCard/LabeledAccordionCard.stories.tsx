import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { LabeledAccordionCard, type LabeledAccordionCardItem } from "@/components/blocks/cards/LabeledAccordionCard"
import { StatusChip } from "@/components/blocks/chips/StatusChip"

/**
 * `LabeledAccordionCard` — a labeled "Accordion Card": a section label OUTSIDE the
 * card, then one `bg-surface` frame of collapsible sections whose separators run
 * FULL-BLEED to the card edge (the `SurfaceListCard` skin, but each row expands).
 * Uses `Accordion variant="default"` so the base full-bleed separator shows; the
 * surface frame comes from the wrapping `SurfaceListCard`.
 */
const meta: Meta<typeof LabeledAccordionCard> = {
    title: "Blocks/Cards/LabeledAccordionCard",
    component: LabeledAccordionCard,
    parameters: { layout: "padded" },
}

export default meta

type Story = StoryObj<typeof LabeledAccordionCard>

/** A short body node reused across the demo sections. */
const body = (text: string) => (
    <Typography type="body-sm" color="muted">
        {text}
    </Typography>
)

const ITEMS: Array<LabeledAccordionCardItem> = [
    {
        id: "container",
        title: "Container",
        subtitle: "3 đang chạy",
        body: body("web-1, db-1, cache-1 — mỗi container một dòng, bấm để xem chi tiết cổng và mount."),
    },
    {
        id: "image",
        title: "Image",
        subtitle: "5 image",
        body: body("node:20-alpine, postgres:16, redis:7, nginx:1.27, myapp:latest."),
    },
    {
        id: "network",
        title: "Network",
        subtitle: "2 mạng",
        body: body("bridge (mặc định) và app-net — các container cùng app-net gọi nhau bằng tên service."),
    },
]

/** Default: single-open, first section expanded, full-bleed separators. */
export const Default: Story = {
    tags: ["news"],
    args: {
        label: "Tài nguyên",
        labelEnd: "10 mục",
        items: ITEMS,
        defaultExpandedKeys: new Set(["container"]),
    },
    parameters: {
        usage: "Chờ duyệt — block MỚI. Label \"Tài nguyên\" ngoài card; mỗi nhóm là 1 section gập/mở, separator chạm SÁT MÉP card (full-bleed) — khác accordion surface mặc định của HeroUI vốn thụt vào 3%. Một section mở tại một thời điểm (single-open).",
    },
}

/** Multiple sections open at once — for reference lists where the learner wants
 * to compare groups side by side. */
export const MultipleExpanded: Story = {
    tags: ["news"],
    args: {
        label: "Tài nguyên",
        items: ITEMS,
        allowsMultipleExpanded: true,
        defaultExpandedKeys: new Set(["container", "image", "network"]),
    },
    parameters: {
        usage: "Chờ duyệt — `allowsMultipleExpanded` cho mở nhiều section cùng lúc (KHÔNG `selectionMode` — prop đó không tồn tại trên HeroUI Accordion). Cả ba section mở sẵn qua `defaultExpandedKeys` (một `Set`, không phải mảng).",
    },
}

/** With a trailing `titleEnd` chip per section — a status/score that belongs to the
 * collapsed header (milestone status, per-requirement score…). */
export const WithTitleEnd: Story = {
    tags: ["news"],
    args: {
        label: "Cột mốc",
        items: [
            { id: "m1", title: "1. Khởi tạo dự án", titleEnd: <StatusChip tone="success">Xong</StatusChip>, body: body("3/3 nhiệm vụ hoàn thành.") },
            { id: "m2", title: "2. Xây API", titleEnd: <StatusChip tone="warning">Đang làm</StatusChip>, body: body("1/4 nhiệm vụ hoàn thành.") },
            { id: "m3", title: "3. Triển khai", titleEnd: <StatusChip tone="neutral">Chưa bắt đầu</StatusChip>, body: body("0/2 nhiệm vụ.") },
        ],
        defaultExpandedKeys: new Set(["m2"]),
    },
    parameters: {
        usage: "Chờ duyệt — `items[].titleEnd`: node phụ bên phải title (trái caret) cho chip/score thuộc header đã gập. Title truncate nhường chỗ, titleEnd giữ nguyên bề rộng. Dùng khi trigger cần mang status/score (CourseMilestoneOutline, ChallengeView requirements…).",
    },
}

/** No `label` — for a pane that already carries its own heading/tab (e.g. the
 * Playground Lab "Tài nguyên" tab), where a second label would be label-on-label. */
export const NoLabel: Story = {
    tags: ["news"],
    args: {
        items: ITEMS,
        allowsMultipleExpanded: true,
        defaultExpandedKeys: new Set(["container"]),
    },
    parameters: {
        usage: "Chờ duyệt — BỎ `label`: card render trần (chỉ khung `SurfaceListCard` + accordion), cho pane đã có tab/heading riêng làm nhãn — thêm label nữa là nhãn-chồng-nhãn (accordion.md §3d). Đây là dạng dùng ở tab \"Tài nguyên\" của Playground Lab.",
    },
}

/** Nested inside a modal/drawer body → `bordered` delineates with a border instead
 * of a shadow that can vanish in dark mode. */
export const Bordered: Story = {
    tags: ["news"],
    args: {
        label: "Tài nguyên",
        items: ITEMS,
        bordered: true,
        defaultExpandedKeys: new Set(["container"]),
    },
    parameters: {
        usage: "Chờ duyệt — `bordered`: khi card nằm NESTED trong 1 surface khác (thân modal/drawer), dùng border thay shadow (shadow-surface có thể vô hình ở dark mode — card.md §0). Forward xuống `SurfaceListCard`.",
    },
}

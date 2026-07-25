import type { Meta, StoryObj } from "@storybook/nextjs"
import { Breadcrumbs, Button, Chip, Typography } from "@heroui/react"
import { Page } from "@sb-components/layouts/layout/Page/Page"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Page.Header` — the breadcrumb/title/description/actions/meta khung of a route.
 * NOT a generic wrapper: it takes no `children`, only its own semantic slots.
 */
const meta: Meta<typeof Page.Header> = {
    title: "Layouts/Layout/Page/Page.Header",
    component: Page.Header,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Page.Header>

// Bare set: no breadcrumb, no meta, no actions.
const TITLE_DESCRIPTION_PARTS: Array<AnatomyNode> = [
    { name: "Title", tier: "primitive", role: "primary title (H3 heading, or body-bold when size=\"compact\")" },
    { name: "Description", tier: "primitive", role: "supporting line under the title, muted, clamps to 2 lines on mobile" },
]

// Full set leaf: breadcrumb row + actions slot + a meta chip/stat strip below.
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Breadcrumb", tier: "primitive", role: "breadcrumb row above the main title row" },
    { name: "Title", tier: "primitive", role: "primary title (H3 heading)" },
    { name: "Description", tier: "primitive", role: "supporting line under the title, muted" },
    { name: "Actions", tier: "primitive", role: "right-aligned control slot, shrink-0" },
    { name: "Meta", tier: "primitive", role: "stat/meta chip row below the title block" },
]

/** Minimal set: a title + one description line — a page entered straight from a menu, no breadcrumb. */
export const Minimal: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-3xl">
                <BlockAnatomy
                    name="Page.Header"
                    tier="primitive"
                    leaf="Minimal"
                    parts={TITLE_DESCRIPTION_PARTS}
                    note="Chỉ title + description — không breadcrumb/actions/meta được truyền."
                >
                    <Page.Header
                        title="Manage students"
                        description="View and edit every enrolled student."
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Full set: breadcrumb + title + description + actions + meta strip — a page deep in the hierarchy. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-3xl">
                <BlockAnatomy
                    name="Page.Header"
                    tier="primitive"
                    leaf="Full"
                    parts={FULL_PARTS}
                    reason="Khung này gom breadcrumb·title·description·actions·meta thành MỘT chỗ thay vì mỗi trang tự dàn layout riêng — leaf này bật đủ cả 5 slot."
                >
                    <Page.Header
                        breadcrumb={
                            // TODO: swap for ResponsiveBreadcrumb local when ported.
                            <Breadcrumbs>
                                <Breadcrumbs.Item href="#">Courses</Breadcrumbs.Item>
                                <Breadcrumbs.Item>Fullstack Mastery</Breadcrumbs.Item>
                            </Breadcrumbs>
                        }
                        title="Fullstack Mastery"
                        description="A path from the fundamentals to shipping a real product, graded by AI."
                        actions={<Button variant="secondary" size="sm" onPress={() => {}}>Edit course</Button>}
                        meta={
                            <div className="flex flex-wrap items-center gap-2">
                                {/* status chip leading (far left); stat strip = dot-separated TEXT */}
                                <Chip size="sm" variant="soft" color="success"><Chip.Label>Open</Chip.Label></Chip>
                                <Typography type="body-xs" color="muted">24 Modules · 87 Lessons · 32 hours</Typography>
                            </div>
                        }
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Long description clamps to 2 lines — the narrow frame below is intentional, to expose the clamp point. */
export const DescriptionClamped: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-sm">
                <BlockAnatomy
                    name="Page.Header"
                    tier="primitive"
                    leaf="DescriptionClamped"
                    parts={TITLE_DESCRIPTION_PARTS}
                    note="Cùng composition với Minimal — description dài hơn khung hẹp nên bị line-clamp-2."
                >
                    <Page.Header
                        title="Configure payment gateways"
                        description="Set up SePay and PayOS, choose the default gateway for new students, configure installment plans applied per course, and track transaction status in real time."
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `size="page"` (default) — the title renders at H3, for the OWN title of a whole route. */
export const SizePage: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Page.Header"
                tier="primitive"
                leaf="SizePage"
                parts={TITLE_DESCRIPTION_PARTS}
                note={"size=\"page\" (mặc định) — Title dùng Typography.Heading level 3."}
            >
                <Page.Header
                    title="Chuẩn bị máy"
                    description="Trước khi vào playground, cài công cụ dòng lệnh rồi nối StarCi Agent."
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `size="compact"` — body-scale bold, for a header labelling a PANE/PHASE inside an existing page shell. */
export const SizeCompact: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Page.Header"
                tier="primitive"
                leaf="SizeCompact"
                parts={TITLE_DESCRIPTION_PARTS}
                note={"size=\"compact\" — CÙNG 2 part Title/Description, Title đổi sang body-bold thay vì H3."}
            >
                <Page.Header
                    size="compact"
                    title="Chuẩn bị máy"
                    description="Trước khi vào playground, cài công cụ dòng lệnh rồi nối StarCi Agent."
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseBrief } from "@sb-components/_legacy/blocks/learn/CourseBrief/CourseBrief"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof CourseBrief> = {
    title: "Legacy/Block/Learn/CourseBrief",
    component: CourseBrief,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseBrief>

const PARTS: Array<AnatomyNode> = [
    { name: "Page.Header", tier: "primitive", role: "KHUNG bố cục (layout) — breadcrumb → title → description → meta. Block ĐẶT nội dung vào đây, KHÔNG tự vẽ." },
    { name: "Breadcrumbs", tier: "atom", role: "đường dẫn — block tự dựng từ `breadcrumbItems` (DỮ LIỆU), screen không cầm atom" },
    { name: "Title", tier: "atom", role: "tên khoá — prop `title`" },
    { name: "Meta", tier: "atom", role: "scalar catalog (chương · giờ · học viên) — §1 muted text, KHÔNG chip" },
]

const CRUMBS = [
    { key: "courses", label: "Khoá học", onPress: () => {} },
    { key: "course", label: "DevOps Mastery" },
]

/**
 * Leaf DUY NHẤT — block không có view-switch, không có state đổi cây. Nó tồn tại để
 * screen có thứ để GỌI, chứ không phải vì tự mang trạng thái.
 */
export const Default: Story = {
    render: () => (
        <div className="max-w-3xl p-8">
            <BlockAnatomy
                name="CourseBrief"
                tier="block"
                leaf="Default"
                parts={PARTS}
                reason="Lên SCREEN tuyệt đối không xài atom — only block (thầy chốt 2026-07-25). Screen từng tự gọi khung Page.Header + atom Breadcrumbs.Base; block này gánh cả hai để screen chỉ còn ghép block."
                note="Nhận `breadcrumbItems` là DỮ LIỆU, không phải node — nếu nhận ReactNode thì screen lại phải cầm atom, thủng đúng luật này. KHÔNG có chip trạng thái (thầy bỏ): tiến độ đã do ContinueCard nói."
                code={"<CourseBrief breadcrumbItems={[…]} title=\"…\" description=\"…\" meta=\"…\" />"}
            >
                <CourseBrief
                    breadcrumbItems={CRUMBS}
                    title="DevOps Mastery"
                    description="Từ CI/CD tới Kubernetes production — lộ trình thực chiến."
                    meta="8 chương · ~14 giờ học · 2,481 học viên"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

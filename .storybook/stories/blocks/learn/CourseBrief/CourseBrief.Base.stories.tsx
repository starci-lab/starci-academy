import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseBrief } from "@sb-components/blocks/learn/CourseBrief/CourseBrief"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `CourseBrief.Base`: cụm ĐỊNH DANH KHOÁ ở đầu trang.
 *
 * Tồn tại vì RANH GIỚI TẦNG: screen không được cầm khung `Page.Header` (layout) hay
 * atom `Breadcrumbs`. Block nhận **DỮ LIỆU** (`breadcrumbItems` là mảng crumb) rồi
 * tự dựng atom — nếu để `breadcrumb?: ReactNode` thì screen lại phải cầm atom.
 *
 * ⚠️ Meta là **dải chữ muted ngăn dấu `·`**, KHÔNG phải chip (thầy soi mắt chốt).
 *
 * 📐 **LEAF theo CẤU TRÚC** (§14d.2): hai leaf dưới là leaf THẬT vì **mất node**.
 * Trail dài chỉ đổi số crumb ⇒ STATE, render chung trong leaf đủ-bộ.
 */
const meta: Meta<typeof CourseBrief.Base> = {
    title: "Blocks/Learn/CourseBrief.Base",
    component: CourseBrief.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseBrief.Base>

const CRUMBS = [
    { key: "courses", label: "Khoá học", onPress: () => {} },
    { key: "course", label: "DevOps Mastery" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Breadcrumbs: { tier: "atom", role: "đường dẫn — block dựng từ DỮ LIỆU crumb" },
}

const leafShell = (leaf: string, node: ReactNode, note?: ReactNode) => (
    <div className="mx-auto max-w-3xl p-8">
        <BlockAnatomy
            name="CourseBrief.Base"
            tier="block"
            leaf={leaf}
            parts={[]}
            annotate={ANNOTATE}
            note={note}
        >
            {node}
        </BlockAnatomy>
    </div>
)

/** LEAF — đủ bộ: breadcrumb → tên khoá → mô tả → dải meta. Kèm ca trail dài (state). */
export const Full: Story = {
    render: () =>
        leafShell(
            "Đủ bộ",
            <div className="flex flex-col gap-8">
                <CourseBrief.Base
                    anatPart="CourseBrief"
                    showAnatomy
                    breadcrumbItems={CRUMBS}
                    title="DevOps Mastery"
                    description="Từ CI/CD tới Kubernetes production — lộ trình thực chiến."
                    moduleCount={8}
                    hours={14}
                    learnerCount={2481}
                />
                <CourseBrief.Base
                    breadcrumbItems={[
                        { key: "home", label: "Trang chủ", onPress: () => {} },
                        { key: "courses", label: "Khoá học", onPress: () => {} },
                        { key: "devops", label: "DevOps", onPress: () => {} },
                        { key: "module", label: "Chương 2", onPress: () => {} },
                        { key: "course", label: "Container hoá" },
                    ]}
                    title="DevOps Mastery"
                    moduleCount={8}
                    hours={14}
                />
            </div>,
            "Trail dài → atom `Breadcrumbs` tự thu về back-link. Thu gọn là hành vi BÊN TRONG atom ⇒ state, không phải leaf.",
        ),
}

/** LEAF — vào thẳng từ trang khác ⇒ **mất** node `Breadcrumbs`. */
export const NoBreadcrumb: Story = {
    render: () =>
        leafShell(
            "Không breadcrumb",
            <CourseBrief.Base
                anatPart="CourseBrief"
                showAnatomy
                title="DevOps Mastery"
                description="Từ CI/CD tới Kubernetes production — lộ trình thực chiến."
                moduleCount={8}
                hours={14}
                learnerCount={2481}
            />,
        ),
}

/** LEAF — khoá mới toanh ⇒ **mất** cả `Meta` lẫn mô tả, cụm rút còn breadcrumb + tên. */
export const TitleOnly: Story = {
    render: () =>
        leafShell(
            "Chỉ tiêu đề",
            <CourseBrief.Base
                anatPart="CourseBrief"
                showAnatomy
                breadcrumbItems={CRUMBS}
                title="DevOps Mastery"
            />,
        ),
}

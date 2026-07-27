import React from "react"
import type { ReactNode } from "react"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `CourseBrief`, block ĐỊNH DANH KHOÁ.
 *
 * LÝ DO TỒN TẠI (thầy chốt 2026-07-25): **lên SCREEN tuyệt đối không xài atom —
 * only block.** Trước đó screen `/learn/content` tự gọi khung `PageHeader` (layout)
 * và tự nhét `Breadcrumbs` (atom) vào — sai tầng. Block này là thứ screen gọi
 * THAY cho cả hai. Nó tồn tại vì RANH GIỚI TẦNG, không phải vì nó có state riêng.
 *
 * ⚠️ KHÔNG có chip trạng thái (thầy soi mắt 2026-07-25 rồi bỏ). Trạng thái học của
 * khoá đã do `ContinueCard` bên dưới nói; nhắc lại ở đây là thừa.
 *
 * Tên đặt theo CHỨC NĂNG, không theo vị trí: KHÔNG `CourseContentsPageHeader` (vừa
 * là vị trí, vừa khoá vào một màn). `CourseBrief` = "tóm tắt khoá" nên trang bán
 * khoá / trang `/learn` đều dùng lại được.
 *
 * HỢP ĐỒNG: block nhận **DỮ LIỆU**, không nhận atom dựng sẵn — `breadcrumbItems` là
 * mảng crumb, block tự dựng `Breadcrumbs`. Nếu để prop `breadcrumb?: ReactNode`
 * thì caller (screen) lại phải cầm atom → thủng đúng cái luật này.
 *
 * COMPOSE: khung `PageHeader` (layout) + `Breadcrumbs` (atom) + `Typography`.
 * Block KHÔNG tự vẽ khung — nó ĐẶT business vào khung có sẵn.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Một mắt xích breadcrumb — dữ liệu thuần, block tự dựng atom từ nó. */
export interface CourseBriefCrumb {
    /** Khoá React. */
    key: string
    /** Nhãn hiển thị. */
    label: string
    /** Có handler → crumb bấm được; crumb cuối (trang hiện tại) bỏ trống. */
    onPress?: () => void
}

/** Props for {@link CourseBrief}. */
export interface CourseBriefProps {
    /** Đường dẫn breadcrumb dạng DỮ LIỆU — block tự dựng `Breadcrumbs`. */
    breadcrumbItems?: Array<CourseBriefCrumb>
    /** Tên khoá. */
    title: ReactNode
    /** Một câu mô tả khoá. */
    description?: ReactNode
    /**
     * Meta scalar tự do (số chương · giờ học · học viên). §1: muted text
     * dot-separated, KHÔNG chip.
     */
    meta?: ReactNode
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Cụm định danh khoá ở đầu trang. Xem file header cho hợp đồng đầy đủ.
 *
 * @param props - {@link CourseBriefProps}
 */
export const CourseBrief = ({
    breadcrumbItems,
    title,
    description,
    meta,
    showAnatomy = false,
    anatPart,
}: CourseBriefProps) => (
    <div data-anat-part={anatPart}>
        <PageHeader
            breadcrumb={
                breadcrumbItems?.length ? (
                    <div className="w-fit" data-anat-part={showAnatomy ? "Breadcrumbs" : undefined}>
                        {/* collapse: dưới @app-sm hoặc trail ≥ 4 crumb → back-link (năng lực
                        cũ của ResponsiveBreadcrumb, nay là prop của atom Breadcrumbs). */}
                        <Breadcrumbs collapseOnMobile collapseFrom={4} items={breadcrumbItems} />
                    </div>
                ) : undefined
            }
            title={<span data-anat-part={showAnatomy ? "Title" : undefined}>{title}</span>}
            description={description}
            meta={
                meta != null ? (
                    <span data-anat-part={showAnatomy ? "Meta" : undefined}>
                        <Typography size="xs" color="muted" text={meta} />
                    </span>
                ) : undefined
            }
        />
    </div>
)

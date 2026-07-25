import React from "react"
import { Page } from "@sb-components/layouts/layout/Page/Page"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `CourseBrief.Base`: block ĐỊNH DANH KHOÁ.
 *
 * LÝ DO TỒN TẠI (thầy chốt 2026-07-25): **lên SCREEN tuyệt đối không xài atom —
 * only block.** Trước đó screen `/learn/content` tự gọi khung `Page.Header` (layout)
 * và tự nhét `Breadcrumbs.Base` (atom) vào — sai tầng. Block này là thứ screen gọi
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
 * mảng crumb, block tự dựng `Breadcrumbs.Base`. Nếu để prop `breadcrumb?: ReactNode`
 * thì caller (screen) lại phải cầm atom → thủng đúng cái luật này.
 *
 * COMPOSE: khung `Page.Header` (layout) + `Breadcrumbs.Base` (atom) + `Typography`.
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

/** Props for {@link CourseBrief.Base}. */
export interface CourseBriefBaseProps {
    /** Đường dẫn breadcrumb dạng DỮ LIỆU — block tự dựng `Breadcrumbs.Base`. */
    breadcrumbItems?: Array<CourseBriefCrumb>
    /** Tên khoá. */
    title: string
    /** Một câu mô tả khoá. */
    description?: string
    /**
     * ⛔ KHÔNG có prop `meta` chuỗi format sẵn (thầy chốt 2026-07-26).
     * Truyền `meta="8 chương · ~14 giờ học · 2,481 học viên"` là **phá cấu trúc**:
     * caller quyết luôn cách ghép, đơn vị, dấu ngăn — block hết sở hữu hình.
     * Dưới đây là DỮ LIỆU SỐ rời; block tự ghép dải muted ngăn dấu `·`.
     */
    moduleCount?: number
    /** Tổng giờ học (làm tròn) — block tự thêm `~` và chữ "giờ học". */
    hours?: number
    /** Số học viên đã tham gia — block tự phân tách hàng nghìn. */
    learnerCount?: number
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Cụm định danh khoá ở đầu trang. Xem file header cho hợp đồng đầy đủ.
 *
 * @param props - {@link CourseBriefBaseProps}
 */
const CourseBriefBase = ({
    breadcrumbItems,
    title,
    description,
    moduleCount,
    hours,
    learnerCount,
    showAnatomy = false,
    anatPart,
}: CourseBriefBaseProps) => {
    // Dải meta do BLOCK ghép từ SỐ — đơn vị, dấu ngăn, phân tách hàng nghìn đều là
    // phần trình bày, caller không đụng vào (§14d.1).
    const metaParts = [
        moduleCount != null ? `${moduleCount} chương` : null,
        hours != null ? `~${hours} giờ học` : null,
        learnerCount != null ? `${learnerCount.toLocaleString("vi-VN")} học viên` : null,
    ].filter(Boolean)

    return (
        <div data-anat-part={anatPart}>
            <Page.Header
                showAnatomy={showAnatomy}
                breadcrumb={
                    breadcrumbItems?.length ? (
                        <div className="w-fit" data-anat-part={showAnatomy ? "Breadcrumbs" : undefined}>
                            {/* collapse: dưới @app-sm hoặc trail ≥ 4 crumb → back-link (năng lực
                        cũ của ResponsiveBreadcrumb, nay là prop của atom Breadcrumbs.Base). */}
                            <Breadcrumbs.Base
                                collapseOnMobile
                                collapseFrom={4}
                                items={breadcrumbItems}
                                showAnatomy={showAnatomy}
                            />
                        </div>
                    ) : undefined
                }
                title={<span data-anat-part={showAnatomy ? "Title" : undefined}>{title}</span>}
                description={description}
                meta={
                    metaParts.length > 0 ? (
                        <span data-anat-part={showAnatomy ? "Meta" : undefined}>
                            <Typography.Base size="xs" color="muted" text={metaParts.join(" · ")} />
                        </span>
                    ) : undefined
                }
            />
        </div>
    )
}

/** `CourseBrief.*` — namespace một-component ⇒ chỉ có `.Base`. */
export const CourseBrief = Object.assign(CourseBriefBase, {
    Base: CourseBriefBase,
})

import React from "react"
import { cn } from "@heroui/react"
import { CheckCircleIcon, StarIcon } from "@phosphor-icons/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/marketing/SitePreview`. Authored in Storybook (not `src`);
 * synced to `src` later. A fixed marketing preview of a course-catalog page
 * (nav + filter sidebar + course list) — fills its parent's height, meant to sit
 * inside `ShowcaseMockup aspect="video"`.
 */

/** Một khoá trong list preview (minh hoạ marketing, không phải data thật). */
interface PreviewCourse {
    initial: string
    name: string
    level: string
    rating: string
    price: string
    tone: "accent" | "success" | "warning"
}

const COURSES: ReadonlyArray<PreviewCourse> = [
    { initial: "FS", name: "Fullstack Mastery", level: "Trung cấp", rating: "4.9", price: "1.290k", tone: "accent" },
    { initial: "SD", name: "System Design", level: "Nâng cao", rating: "5.0", price: "1.490k", tone: "success" },
    { initial: "DO", name: "DevOps Mastery", level: "Nâng cao", rating: "4.8", price: "1.390k", tone: "warning" },
]

const TONE_TILE: Record<PreviewCourse["tone"], string> = {
    accent: "bg-accent-soft text-accent-soft-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
}

/** 1 dòng filter có ô tick (checked = accent). */
const FilterRow = ({ label, on, anatPart }: { label: string; on?: boolean; anatPart?: string }) => (
    <span data-anat-part={anatPart} className="flex items-center gap-2 text-muted">
        <span
            className={cn(
                "flex size-3.5 shrink-0 items-center justify-center rounded border",
                on ? "border-accent bg-accent text-accent-foreground" : "border-default",
            )}
        >
            {on ? <CheckCircleIcon weight="bold" aria-hidden focusable="false" className="size-2.5" /> : null}
        </span>
        {label}
    </span>
)

/** Props của SitePreview (minh hoạ marketing, không nhận data). */
interface SitePreviewProps {
    /** Khi bật, mỗi part phát `data-anat-part` để panel anatomy neo badge. */
    showAnatomy?: boolean
}

/**
 * Preview 1 trang web (kiểu catalog tìm khoá học) — header nav + sidebar bộ lọc + list
 * khoá có rating/giá. Token-aware (`bg-surface`/`border-default`/`text-foreground`…) nên
 * đọc tốt cả light/dark. Lấp đầy chiều cao cha (dùng trong `ShowcaseMockup aspect="video"`).
 * Nội dung là minh hoạ marketing, không phải data thật.
 */
export const SitePreview = ({ showAnatomy }: SitePreviewProps = {}) => (
    <div className="flex h-full flex-col bg-surface text-foreground">
        {/* app nav */}
        <div
            data-anat-part={showAnatomy ? "Navbar" : undefined}
            className="flex shrink-0 items-center justify-between border-b border-default px-4 py-2"
        >
            <div className="flex items-center gap-3">
                <span data-anat-part={showAnatomy ? "Brand" : undefined} className="flex items-center gap-2 font-semibold">
                    <span aria-hidden className="size-3.5 rounded-md bg-accent" />
                    StarCi
                </span>
                <span
                    data-anat-part={showAnatomy ? "Menu" : undefined}
                    className="hidden items-center gap-3 text-xs text-muted @app-sm:flex"
                >
                    <span className="text-foreground">Khóa học</span>
                    <span>Lộ trình</span>
                    <span>Bảng giá</span>
                </span>
            </div>
            <span
                data-anat-part={showAnatomy ? "SignUpButton" : undefined}
                className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
            >
                Đăng ký
            </span>
        </div>

        {/* body: sidebar filter + list khoá */}
        <div data-anat-part={showAnatomy ? "Body" : undefined} className="flex min-h-0 flex-1">
            <div
                data-anat-part={showAnatomy ? "FilterSidebar" : undefined}
                className="hidden w-1/3 max-w-[180px] shrink-0 flex-col gap-3 border-r border-default p-3 text-xs @app-sm:flex"
            >
                <div data-anat-part={showAnatomy ? "TopicGroup" : undefined} className="flex flex-col gap-2">
                    <span className="font-medium text-muted">Chủ đề</span>
                    <FilterRow label="Fullstack" on anatPart={showAnatomy ? "FilterRow" : undefined} />
                    <FilterRow label="System Design" anatPart={showAnatomy ? "FilterRow" : undefined} />
                    <FilterRow label="DevOps" anatPart={showAnatomy ? "FilterRow" : undefined} />
                </div>
                <div data-anat-part={showAnatomy ? "FormatGroup" : undefined} className="flex flex-col gap-2">
                    <span className="font-medium text-muted">Hình thức</span>
                    <FilterRow label="Tự học" on anatPart={showAnatomy ? "FilterRow" : undefined} />
                    <FilterRow label="Có mentor" anatPart={showAnatomy ? "FilterRow" : undefined} />
                </div>
            </div>

            <div
                data-anat-part={showAnatomy ? "CourseList" : undefined}
                className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden p-3"
            >
                {COURSES.map((course) => (
                    <div
                        key={course.name}
                        data-anat-part={showAnatomy ? "CourseRow" : undefined}
                        className="flex items-center gap-3 rounded-xl border border-default bg-surface px-3 py-2"
                    >
                        <span
                            data-anat-part={showAnatomy ? "InitialTile" : undefined}
                            className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold", TONE_TILE[course.tone])}
                        >
                            {course.initial}
                        </span>
                        <div data-anat-part={showAnatomy ? "InfoCluster" : undefined} className="flex min-w-0 flex-1 flex-col">
                            <span data-anat-part={showAnatomy ? "CourseName" : undefined} className="flex items-center gap-1 truncate text-sm font-medium">
                                {course.name}
                                <CheckCircleIcon aria-hidden focusable="false" className="size-3.5 shrink-0 text-success-soft-foreground" />
                            </span>
                            <span data-anat-part={showAnatomy ? "RatingMeta" : undefined} className="flex items-center gap-1 text-xs text-muted">
                                <StarIcon weight="fill" aria-hidden focusable="false" className="size-3 text-warning-soft-foreground" />
                                {course.rating} · {course.level}
                            </span>
                        </div>
                        <div data-anat-part={showAnatomy ? "Price" : undefined} className="shrink-0 text-right">
                            <span className="block text-sm font-semibold text-accent-soft-foreground">{course.price}</span>
                            <span className="block text-[10px] text-muted">/ khóa</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

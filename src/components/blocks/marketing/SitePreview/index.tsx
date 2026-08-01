import React from "react"
import { cn } from "@heroui/react"
import { CheckCircleIcon, StarIcon } from "@phosphor-icons/react"

/** One course in the preview list (marketing illustration, not real data). */
interface PreviewCourse {
    initial: string
    name: string
    level: string
    rating: string
    price: string
    tone: "accent" | "success" | "warning"
}

const COURSES: ReadonlyArray<PreviewCourse> = [
    { initial: "FS", name: "Fullstack Mastery", level: "Intermediate", rating: "4.9", price: "1.290k", tone: "accent" },
    { initial: "SD", name: "System Design", level: "Advanced", rating: "5.0", price: "1.490k", tone: "success" },
    { initial: "DO", name: "DevOps Mastery", level: "Advanced", rating: "4.8", price: "1.390k", tone: "warning" },
]

const TONE_TILE: Record<PreviewCourse["tone"], string> = {
    accent: "bg-accent-soft text-accent-soft-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
}

/** One filter row with a tick box (checked = accent). */
const FilterRow = ({ label, on }: { label: string; on?: boolean }) => (
    <span className="flex items-center gap-2 text-muted">
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

/**
 * A one-page website preview (course-catalog style) — header nav + filter sidebar + course
 * list with rating/price. Token-aware (`bg-surface`/`border-default`/`text-foreground`…) so it
 * reads well in both light and dark. Fills the parent's height (used in `ShowcaseMockup aspect="video"`).
 * The content is a marketing illustration, not real data.
 */
export const SitePreview = () => (
    <div className="flex h-full flex-col bg-surface text-foreground">
        {/* app nav */}
        <div className="flex shrink-0 items-center justify-between border-b border-default px-4 py-2">
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 font-semibold">
                    <span aria-hidden className="size-3.5 rounded-md bg-accent" />
                    StarCi
                </span>
                <span className="hidden items-center gap-3 text-xs text-muted @app-sm:flex">
                    <span className="text-foreground">Courses</span>
                    <span>Roadmap</span>
                    <span>Pricing</span>
                </span>
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">Sign up</span>
        </div>

        {/* body: filter sidebar + course list */}
        <div className="flex min-h-0 flex-1">
            <div className="hidden w-1/3 max-w-[180px] shrink-0 flex-col gap-3 border-r border-default p-3 text-xs @app-sm:flex">
                <div className="flex flex-col gap-2">
                    <span className="font-medium text-muted">Topic</span>
                    <FilterRow label="Fullstack" on />
                    <FilterRow label="System Design" />
                    <FilterRow label="DevOps" />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-medium text-muted">Format</span>
                    <FilterRow label="Self-paced" on />
                    <FilterRow label="With mentor" />
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden p-3">
                {COURSES.map((course) => (
                    <div
                        key={course.name}
                        className="flex items-center gap-3 rounded-xl border border-default bg-surface px-3 py-2"
                    >
                        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold", TONE_TILE[course.tone])}>
                            {course.initial}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="flex items-center gap-1 truncate text-sm font-medium">
                                {course.name}
                                <CheckCircleIcon aria-hidden focusable="false" className="size-3.5 shrink-0 text-success-soft-foreground" />
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted">
                                <StarIcon weight="fill" aria-hidden focusable="false" className="size-3 text-warning-soft-foreground" />
                                {course.rating} · {course.level}
                            </span>
                        </div>
                        <div className="shrink-0 text-right">
                            <span className="block text-sm font-semibold text-accent-soft-foreground">{course.price}</span>
                            <span className="block text-[10px] text-muted">/ course</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

import type { IconComponent } from "@/types"
import type { SidebarTab } from "@/redux/slices/sidebar"

/**
 * Which labelled cluster a sidebar row belongs to — grouping by ROLE so the
 * hierarchy reads (the required spine vs. the aids vs. the meta surfaces):
 * - `path`     — the mandatory learning spine (course content → capstone).
 * - `practice` — the aids that orbit the spine (review, interview, reference).
 * - `track`    — the meta surfaces (orientation + motivation).
 */
export type LearnNavGroup = "path" | "practice" | "track"

/**
 * A trailing status badge on a sidebar row: a due-card count (`due`) or the
 * viewer's leaderboard rank (`rank`). Only shown when the value is meaningful.
 */
export interface LearnNavBadge {
    /** Which badge style to render. */
    tone: "due" | "rank"
    /** The value (due-card count, or 1-based rank). */
    value: number
}

/**
 * One row in the course-learn sidebar navigation.
 */
export interface LearnNavItem {
    /** Visible label. */
    label: string
    /** Stable list key. */
    value: string
    /** Sidebar tab enum value this row activates. */
    tab: SidebarTab
    /** Icon component rendered before the label. */
    icon: IconComponent
    /** Which labelled group this row sits in. */
    group: LearnNavGroup
    /** Navigation target the row routes to when pressed. */
    url?: string
    /** Whether this surface is locked for the viewer (enroll-required + not enrolled). */
    locked?: boolean
    /** Optional trailing status badge (due count / rank). Suppressed while locked. */
    badge?: LearnNavBadge
}

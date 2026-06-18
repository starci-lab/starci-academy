import {
    useMemo,
    useState,
} from "react"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryMyCoursesSwr,
} from "@/hooks"

/**
 * Owns the data + derivation for the dashboard history rail: the viewer
 * identity, the `myCourses` leaf query, the title filter, and the derived
 * loading/error flags. The component keeps only the render branches.
 */
export const useHistoryRail = () => {
    const user = useAppSelector((state) => state.user.user)

    // the rail reads its own leaf query directly (component-owned state)
    const courses = useQueryMyCoursesSwr()

    /** Immediate filter input (filters the course list by title). */
    const [query, setQuery] = useState("")

    // first-load (no data yet) → show the rail skeleton
    const isLoading = courses.isLoading
    // the leaf failed (often a dead session behind a stale cookie)
    const hasError = Boolean(courses.error)

    /**
     * Display name shown next to the avatar. Prefers the user's chosen display
     * name; otherwise derives a readable handle from the email/username by taking
     * the part before "@" (so we never surface a raw email by default).
     */
    const displayName = useMemo(
        () => {
            const explicit = user?.displayName?.trim()
            if (explicit) {
                return explicit
            }
            const base = user?.email ?? user?.username ?? ""
            return base.split("@")[0]
        },
        [
            user,
        ],
    )

    /** Course (milestone) rows filtered by the label query. */
    const filteredCourses = useMemo(
        () => {
            const needle = query.trim().toLowerCase()
            const rows = courses.data ?? []
            return needle
                ? rows.filter((item) => item.label.toLowerCase().includes(needle))
                : rows
        },
        [
            query,
            courses.data,
        ],
    )

    return {
        user,
        displayName,
        query,
        setQuery,
        filteredCourses,
        isLoading,
        hasError,
        mutate: courses.mutate,
    }
}

import type {
    DifficultyFilter,
    PracticeFilters,
    ProblemStatus,
    SortKey,
    StatusFilter,
} from "@/modules/types/practice-hub"
import { CodingDifficulty } from "@/modules/api/graphql/queries/types/coding"
import type { CodingProblem, MyCodingProgress } from "@/modules/api/graphql/queries/types/coding"

/**
 * Page size requested from `codingProblems`. Phase 1 loads the whole catalog in
 * one page and filters/searches/sorts CLIENT-side (the backend only server-filters
 * difficulty + a single tag, with no status/domain facets or cursor paging). Real
 * server pagination + facets are deferred to phase 2.
 */
export const PROBLEMS_PAGE_LIMIT = 500

/**
 * CODING difficulty scale (easy/medium/hard) → semantic colour + StatusChip tone,
 * matching the profile Coding tab. easy → success/green, medium → warning/yellow,
 * hard → danger/red.
 */
export const CODING_DIFFICULTY_META: Record<
    CodingDifficulty,
    { color: string; tone: "success" | "warning" | "danger"; labelKey: string }
> = {
    [CodingDifficulty.Easy]: {
        color: "var(--success)",
        tone: "success",
        labelKey: "publicProfile.skillsSnapshot.diffEasy",
    },
    [CodingDifficulty.Medium]: {
        color: "var(--warning)",
        tone: "warning",
        labelKey: "publicProfile.skillsSnapshot.diffMedium",
    },
    [CodingDifficulty.Hard]: {
        color: "var(--danger)",
        tone: "danger",
        labelKey: "publicProfile.skillsSnapshot.diffHard",
    },
}

/** Difficulty filter chips, in display order (`all` first). */
export const DIFFICULTY_FILTERS: ReadonlyArray<DifficultyFilter> = [
    "all",
    CodingDifficulty.Easy,
    CodingDifficulty.Medium,
    CodingDifficulty.Hard,
]

/** Status filter chips, in display order (`all` first). */
export const STATUS_FILTERS: ReadonlyArray<StatusFilter> = [
    "all",
    "unsolved",
    "attempted",
    "solved",
]

/** Sort options surfaced in the sort `Select`. */
export const SORT_KEYS: ReadonlyArray<SortKey> = [
    "default",
    "difficulty",
    "points",
]

/** Difficulty ordering weight used by the "difficulty" sort (easy → hard). */
export const DIFFICULTY_ORDER: Record<CodingDifficulty, number> = {
    [CodingDifficulty.Easy]: 0,
    [CodingDifficulty.Medium]: 1,
    [CodingDifficulty.Hard]: 2,
}

/**
 * Derive a problem's solve status from the user's progress: solved when its id is
 * in `solvedProblemIds`, attempted when in `attemptedProblemIds` (but not solved),
 * otherwise unsolved.
 *
 * @param problemId - the problem id to classify.
 * @param progress - the user's coding progress (null when anonymous / inactive).
 * @returns the {@link ProblemStatus} for the problem.
 */
export const deriveStatus = (
    problemId: string,
    progress: MyCodingProgress | null | undefined,
): ProblemStatus => {
    if (progress?.solvedProblemIds.includes(problemId)) {
        return "solved"
    }
    if (progress?.attemptedProblemIds.includes(problemId)) {
        return "attempted"
    }
    return "unsolved"
}

/**
 * Apply the active client-side filters (difficulty / status / domain / title
 * search) to the catalog, returning the matching problems in catalog order.
 *
 * @param problems - the full loaded catalog.
 * @param progress - the user's coding progress, for the status filter overlay.
 * @param filters - the active filter state.
 * @returns the filtered problems (catalog order preserved).
 */
export const filterProblems = (
    problems: ReadonlyArray<CodingProblem>,
    progress: MyCodingProgress | null | undefined,
    filters: PracticeFilters,
): Array<CodingProblem> => {
    const query = filters.q.trim().toLowerCase()
    return problems.filter((problem) => {
        if (filters.difficulty !== "all" && problem.difficulty !== filters.difficulty) {
            return false
        }
        if (filters.domain !== "all" && problem.domain !== filters.domain) {
            return false
        }
        if (filters.status !== "all" && deriveStatus(problem.id, progress) !== filters.status) {
            return false
        }
        if (query && !problem.title.toLowerCase().includes(query)) {
            return false
        }
        return true
    })
}

/**
 * Sort a problem list by the active sort key. `default` keeps catalog order
 * (`sortIndex`); `difficulty` orders easy → hard; `points` orders high → low.
 * Returns a new array (does not mutate the input).
 *
 * @param problems - the problems to sort.
 * @param sort - the active sort key.
 * @returns a new, sorted array.
 */
export const sortProblems = (
    problems: ReadonlyArray<CodingProblem>,
    sort: PracticeFilters["sort"],
): Array<CodingProblem> => {
    const next = [...problems]
    if (sort === "difficulty") {
        next.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
            || a.sortIndex - b.sortIndex)
    } else if (sort === "points") {
        next.sort((a, b) => b.points - a.points || a.sortIndex - b.sortIndex)
    } else {
        next.sort((a, b) => a.sortIndex - b.sortIndex)
    }
    return next
}

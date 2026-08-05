"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type Key,
} from "react"
import { useLocale, useTranslations } from "next-intl"
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { _CourseQa } from "./component"
import { useQueryCourseQuestionsSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseQuestionsSwr"
import { CourseQuestionFilter } from "@/modules/api/graphql/queries/types/course-questions"
import { mutateCreateComment } from "@/modules/api/graphql/mutations/mutation-create-comment"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"

/** Questions shown per page before the pager kicks in (mirrors the request limit). */
const QUESTIONS_PER_PAGE = 20

/** Debounce (ms) before a keystroke turns into a new search request. */
const SEARCH_DEBOUNCE_MS = 300

/** URL `?filter=` values that map to a real {@link CourseQuestionFilter}. */
const FILTER_ORDER: ReadonlyArray<CourseQuestionFilter> = [
    CourseQuestionFilter.Unanswered,
    CourseQuestionFilter.Answered,
    CourseQuestionFilter.Engagement,
    CourseQuestionFilter.Mine,
    CourseQuestionFilter.All,
]

/** Coerce a raw `?filter=` string into a valid filter, defaulting to "unanswered". */
const parseFilter = (raw: string | null): CourseQuestionFilter =>
    FILTER_ORDER.find((value) => value === raw) ?? CourseQuestionFilter.Unanswered

/**
 * Course-wide Q&A roll-up — the CONNECTED half: it owns the URL-synced filter,
 * the debounced search, the question-list fetch and its pagination, the
 * course-general "ask course-wide" mutation, and resolves every label, handing
 * them to the presentational {@link _CourseQa}. See `tiers/split.md`.
 *
 * The active filter is URL-synced (`?filter=`) so it is shareable + survives
 * back/forward; search is debounced then folded into the SWR key. The composer
 * posts a course-general question (`courseId` only, `contentId` omitted) via
 * the shared `createComment` mutation, then revalidates the list.
 */
export const CourseQa = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    // display id (slug) builds the "into the course content" funnel route
    const displayId = useAppSelector((state) => state.course.displayId)
    // primary key (uuid) the createComment mutation needs for a course-general question
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // real enrollment count for the honest strip — no manufactured/fake presence, just
    // the actual number of learners enrolled in this course (already fetched by `course`)
    const enrollmentCount = useAppSelector((state) => state.course.entity?.enrollmentCount)
    const currentUser = useAppSelector((state) => state.user.user)
    const currentUserId = currentUser?.id ?? null
    // guards the composer's submit button against a double-post while the mutation is in flight
    const [isPostingQuestion, setIsPostingQuestion] = useState(false)

    // active filter is the source of truth in the URL; default = "unanswered" (founder queue)
    const filter = parseFilter(searchParams.get("filter"))

    // raw search box value (immediate) + its debounced twin (feeds the query)
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(searchInput)
        }, SEARCH_DEBOUNCE_MS)
        return () => window.clearTimeout(timer)
    }, [searchInput])

    // 1-based page for the server pager
    const [page, setPage] = useState(1)
    // changing filter or search shrinks/reshapes the list — snap back to page 1
    useEffect(() => {
        setPage(1)
    }, [filter, debouncedSearch])

    const { data, isLoading, error, mutate } = useQueryCourseQuestionsSwr({
        filter,
        search: debouncedSearch,
        page,
    })

    const questions = data?.questions ?? []
    const total = data?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / QUESTIONS_PER_PAGE))

    // honest aggregate for the strip: total questions + how many are already answered
    const answeredCount = useMemo(
        () => questions.filter((question) => question.replyCount > 0).length,
        [questions],
    )

    /** Write the chosen filter into the URL (`?filter=`); the list re-reads it. */
    const onSelectFilter = useCallback(
        (key: Key) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("filter", String(key))
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [pathname, router, searchParams],
    )

    /** The mandatory course funnel: send the learner into the course content. */
    const goToContent = useCallback(() => {
        if (!displayId) {
            return
        }
        router.push(pathConfig().locale(locale).course(displayId).learn().content().build())
    }, [displayId, locale, router])

    /**
     * Posts a course-general question ("ask course-wide" — `courseId` only, no
     * `contentId`) then revalidates the list so it shows up immediately.
     */
    const submitQuestion = useCallback(async (body: string) => {
        if (!courseId) {
            return
        }
        setIsPostingQuestion(true)
        try {
            await mutateCreateComment({
                request: {
                    courseId,
                    body,
                },
            })
            void mutate()
        } finally {
            setIsPostingQuestion(false)
        }
    }, [courseId, mutate])

    // whether the roll-up is empty AFTER a resolved load (no filter/search applied yet
    // AND zero rows) → the invitation state; a filtered-empty result is handled inline.
    const hasQuery = (filter !== CourseQuestionFilter.All && filter !== CourseQuestionFilter.Engagement)
        || debouncedSearch.trim().length > 0
    const isInvitationEmpty = !isLoading && !error && total === 0 && !hasQuery

    const filterTabs = FILTER_ORDER.map((value) => ({
        key: value,
        label: t(`courseQa.filter.${value}`),
    }))

    return (
        <_CourseQa
            // first load, nothing in hand → shimmer (loading-and-skeleton.md's first-load formula)
            isSkeleton={isLoading && questions.length === 0}
            isEmpty={questions.length === 0}
            // only a settled fetch error (nothing in hand) reaches the block
            error={questions.length === 0 ? error : undefined}
            onRetry={() => { void mutate() }}
            isInvitationEmpty={isInvitationEmpty}
            onGoToContent={goToContent}
            filterTabs={filterTabs}
            selectedFilterKey={filter}
            onSelectFilter={onSelectFilter}
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            currentUserId={currentUserId}
            currentUser={currentUser ? { username: currentUser.username, avatar: currentUser.avatar } : null}
            isPostingQuestion={isPostingQuestion}
            onSubmitQuestion={(body) => { void submitQuestion(body) }}
            questions={questions}
            onAnswered={() => { void mutate() }}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            labels={{
                breadcrumbCurrent: t("courseQa.title"),
                title: t("courseQa.title"),
                description: t("courseQa.description"),
                emptyInvitationTitle: t("courseQa.empty.title"),
                emptyInvitationHint: t("courseQa.empty.hint"),
                emptyInvitationCta: t("courseQa.emptyCta"),
                enrollmentLine: enrollmentCount ? t("courseQa.learnersLine", { count: enrollmentCount }) : undefined,
                answeredLine: t("courseQa.answeredLine", { total, answered: answeredCount }),
                filterAriaLabel: t("courseQa.filterAria"),
                searchPlaceholder: t("courseQa.searchPlaceholder"),
                countLabel: t("courseQa.count", { count: total }),
                composerPlaceholder: t("courseQa.composerPlaceholder"),
                composerSubmitLabel: t("courseQa.composerSubmit"),
                searchEmptyTitle: t("courseQa.searchEmpty"),
                errorTitle: t("courseQa.loadError"),
                retryLabel: t("courseQa.retry"),
                paginationAriaLabel: t("common.pagination.navAria"),
            }}
        />
    )
}

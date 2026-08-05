"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQueryCourseQuestionsSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseQuestionsSwr"
import { CourseQuestionFilter } from "@/modules/api/graphql/queries/types/course-questions"
import { mutateCreateComment } from "@/modules/api/graphql/mutations/mutation-create-comment"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import { _CourseQaPage } from "./component"
import type { CourseQaHeaderCrumb } from "@/components/starci/blocks/learn/CourseQaHeader"
import type { CourseQaFilter } from "@/components/starci/blocks/learn/CourseQaToolbar"

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

/** `CourseQuestionFilter` (v1's request vocabulary) → `CourseQaFilter` (the block's own vocabulary). */
const FILTER_TO_PROP: Record<CourseQuestionFilter, CourseQaFilter> = {
    [CourseQuestionFilter.Unanswered]: "unanswered",
    [CourseQuestionFilter.Answered]: "answered",
    [CourseQuestionFilter.Engagement]: "engagement",
    [CourseQuestionFilter.Mine]: "mine",
    [CourseQuestionFilter.All]: "all",
}

/** `CourseQaFilter` (the block's own vocabulary) → `CourseQuestionFilter` (v1's request vocabulary). */
const PROP_TO_FILTER: Record<CourseQaFilter, CourseQuestionFilter> = {
    unanswered: CourseQuestionFilter.Unanswered,
    answered: CourseQuestionFilter.Answered,
    engagement: CourseQuestionFilter.Engagement,
    mine: CourseQuestionFilter.Mine,
    all: CourseQuestionFilter.All,
}

/**
 * Course-wide Q&A roll-up screen — the CONNECTED half of the course Q&A page.
 * The active
 * filter is URL-synced (`?filter=`), search is debounced then folded into the
 * SWR key, the composer posts a course-general question (`courseId` only, no
 * `contentId`) via the shared `createComment` mutation and revalidates the list,
 * and the empty-board invitation funnels into the course content. Everything is
 * resolved into typed data and handed to the presentational {@link _CourseQaPage}.
 *
 * Each question opens its own conversation inline through `QaQuestionThread`, which
 * owns the answer thread's own fetch and every write — so this file hands the list
 * whole question nodes rather than a flattened display shape.
 */
export const CourseQaPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // display id (slug) builds the "into the course content" funnel route
    const displayId = useAppSelector((state) => state.course.displayId)
    const course = useAppSelector((state) => state.course.entity)
    // primary key (uuid) the createComment mutation needs for a course-general question
    const courseId = course?.id
    // real enrollment count for the honest strip — no manufactured/fake presence, just
    // the actual number of learners enrolled in this course (already fetched by `course`)
    const enrollmentCount = course?.enrollmentCount
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

    const { data, isLoading, mutate } = useQueryCourseQuestionsSwr({
        filter,
        search: debouncedSearch,
        page,
    })

    const rawQuestions = useMemo(() => data?.questions ?? [], [data])
    const total = data?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / QUESTIONS_PER_PAGE))

    // honest aggregate for the strip: total questions + how many are already answered
    const answeredCount = useMemo(
        () => rawQuestions.filter((question) => question.replyCount > 0).length,
        [rawQuestions],
    )

    // The list hands each question straight to `QaQuestionThread`, which needs the
    // whole node (body, answers, lesson route) to open the conversation — so no
    // display-shape adapter sits in between any more.

    /** Write the chosen filter into the URL (`?filter=`); the list re-reads it. */
    const onFilterChange = useCallback(
        (next: CourseQaFilter) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("filter", PROP_TO_FILTER[next])
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [pathname, router, searchParams],
    )

    /** The mandatory course funnel: send the learner into the course content. */
    const onGoToContent = useCallback(() => {
        if (!displayId) {
            return
        }
        router.push(pathConfig().locale(locale).course(displayId).learn().content().build())
    }, [displayId, locale, router])

    /**
     * Posts a course-general question ("ask course-wide" — `courseId` only, no
     * `contentId`) then revalidates the list so it shows up immediately.
     */
    const onAskQuestion = useCallback(async (body: string) => {
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

    // Home › Courses › <course> › Q&A — same trail `LearnBreadcrumb` builds, as
    // DATA (this screen's `CourseQaHeader` block builds its own `Breadcrumbs`
    // atom rather than taking a node).
    const breadcrumbItems: Array<CourseQaHeaderCrumb> = [
        {
            key: "home",
            label: t("nav.home"),
            onPress: () => router.push(pathConfig().locale().build()),
        },
        {
            key: "courses",
            label: t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course().build()),
        },
        {
            key: "course",
            label: course?.title || t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course(displayId).build()),
        },
        {
            key: "current",
            label: t("courseQa.title"),
        },
    ]

    return (
        <_CourseQaPage
            breadcrumbItems={breadcrumbItems}
            title={t("courseQa.title")}
            description={t("courseQa.description")}
            enrollmentCount={enrollmentCount}
            totalQuestions={total}
            answeredQuestions={answeredCount}
            filter={FILTER_TO_PROP[filter]}
            onFilterChange={onFilterChange}
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            currentUser={currentUser ? { displayName: currentUser.displayName || currentUser.username, avatarUrl: currentUser.avatar } : null}
            currentUserId={currentUserId}
            questions={rawQuestions}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onAskQuestion={(body) => { void onAskQuestion(body) }}
            onAnswered={() => { void mutate() }}
            onGoToContent={onGoToContent}
            labels={{
                inviteTitle: t("courseQa.empty.title"),
                inviteHint: t("courseQa.empty.hint"),
                inviteCta: t("courseQa.emptyCta"),
                filterAriaLabel: t("courseQa.filterAria"),
                searchAriaLabel: t("courseQa.searchAria"),
                pagerAriaLabel: t("courseQa.pagerAria"),
                composerPlaceholder: t("courseQa.composerPlaceholder"),
            }}
            isSkeleton={isLoading && rawQuestions.length === 0 && !isPostingQuestion}
        />
    )
}

export default CourseQaPage

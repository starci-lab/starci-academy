"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type Key,
} from "react"
import {
    Button,
    Card,
    Pagination,
    Typography,
} from "@heroui/react"
import {
    ArrowRightIcon,
    ChatsCircleIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { QuestionRow } from "./QuestionRow"
import { CourseQaSkeleton } from "./CourseQaSkeleton"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { CommentComposer } from "@/components/features/community/Discussion/CommentComposer"
import { LearnBreadcrumb } from "@/components/features/learn/shared/LearnBreadcrumb"
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
 * Course-wide Q&A roll-up (S2 of `CourseCommunity/LAYOUT-BRAINSTORM.md`): every
 * top-level learner question across the course's lessons, with founder-answered
 * status, a filter/search toolbar and pagination. Vertical layout inside the
 * learn shell's centered reading column:
 *
 *   PageHeader → honest strip → composer ("hỏi chung khóa") → toolbar (filter tabs +
 *   search + count) → list → pager
 *
 * The active filter is URL-synced (`?filter=`) so it is shareable + survives back/
 * forward; search is debounced then folded into the SWR key. The empty state is an
 * invitation card that funnels into the course content (the mandatory course-CTA).
 * The composer posts a course-general question (no specific lesson — `courseId` only,
 * `contentId` omitted) via the shared `createComment` mutation, then revalidates the list.
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
    const pageNumbers = useMemo(
        () => Array.from({ length: totalPages }, (_unused, index) => index + 1),
        [totalPages],
    )

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
     * Posts a course-general question ("hỏi chung khóa" — `courseId` only, no
     * `contentId`) then revalidates the list so it shows up immediately.
     */
    const onSubmitQuestion = useCallback(async (body: string) => {
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
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
            {/* A · page heading */}
            <PageHeader
                breadcrumb={<LearnBreadcrumb current={t("courseQa.title")} />}
                title={t("courseQa.title")}
                description={t("courseQa.description")}
            />

            {isInvitationEmpty ? (
                // Rỗng (0 câu) — invitation card that funnels into the course content.
                <Card>
                    <div className="flex flex-col items-center gap-4 py-6 text-center">
                        <ChatsCircleIcon aria-hidden className="size-8 text-muted" />
                        <div className="flex max-w-md flex-col gap-2">
                            <Typography type="body" weight="semibold">
                                {t("courseQa.empty.title")}
                            </Typography>
                            <Typography type="body-sm" color="muted">
                                {t("courseQa.empty.hint")}
                            </Typography>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            onPress={goToContent}
                        >
                            {t("courseQa.emptyCta")}
                            <ArrowRightIcon aria-hidden className="size-5" />
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* B · "không học một mình" honest strip — real aggregates only
                        (enrollment count from `course`, no manufactured presence/FOMO). */}
                    <div className="flex flex-col gap-1">
                        {enrollmentCount ? (
                            <Typography type="body-sm" color="muted">
                                {t("courseQa.learnersLine", { count: enrollmentCount })}
                            </Typography>
                        ) : null}
                        <Typography type="body-sm" color="muted">
                            {t("courseQa.answeredLine", { total, answered: answeredCount })}
                        </Typography>
                    </div>

                    {/* course-general composer ("hỏi chung khóa") — avatar-led
                        collapse→expand pill that expands to a textarea on click */}
                    <CommentComposer
                        collapsible
                        currentUser={currentUser ? { username: currentUser.username, avatar: currentUser.avatar } : null}
                        placeholder={t("courseQa.composerPlaceholder")}
                        submitLabel={t("courseQa.composerSubmit")}
                        busy={isPostingQuestion}
                        onSubmit={(body) => { void onSubmitQuestion(body) }}
                    />

                    {/* C · toolbar — filter tabs + search + result count */}
                    <div className="flex flex-col gap-3">
                        <TabsCard
                            leftTabs={{
                                items: filterTabs,
                                selectedKey: filter,
                                ariaLabel: t("courseQa.filterAria"),
                                onSelectionChange: onSelectFilter,
                            }}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <SearchInput
                                className="w-full @app-sm:max-w-sm"
                                value={searchInput}
                                onValueChange={setSearchInput}
                                placeholder={t("courseQa.searchPlaceholder")}
                            />
                            <Typography type="body-sm" color="muted" className="shrink-0">
                                {t("courseQa.count", { count: total })}
                            </Typography>
                        </div>
                    </div>

                    {/* E · list of questions (+ F · pager) */}
                    <AsyncContent
                        isLoading={isLoading && questions.length === 0}
                        skeleton={<CourseQaSkeleton />}
                        isEmpty={questions.length === 0}
                        emptyContent={{ title: t("courseQa.searchEmpty") }}
                        error={questions.length === 0 ? error : undefined}
                        errorContent={{
                            title: t("courseQa.loadError"),
                            onRetry: () => { void mutate() },
                            retryLabel: t("courseQa.retry"),
                        }}
                    >
                        <div className="flex flex-col gap-6">
                            {/* social inbox: one card, flush conversation rows (each expands inline) */}
                            <SurfaceListCard className="divide-y divide-default">
                                {questions.map((question) => (
                                    <QuestionRow
                                        key={question.id}
                                        question={question}
                                        currentUserId={currentUserId}
                                        currentUser={currentUser ? { username: currentUser.username, avatar: currentUser.avatar } : null}
                                        onAnswered={() => { void mutate() }}
                                    />
                                ))}
                            </SurfaceListCard>

                            {/* pager: left-aligned + hover, hidden on a single page. */}
                            {totalPages > 1 ? (
                                <Pagination
                                    aria-label={t("common.pagination.navAria")}
                                    className="justify-start"
                                    size="sm"
                                >
                                    <Pagination.Content className="flex flex-wrap justify-start gap-2">
                                        <Pagination.Item>
                                            <Pagination.Previous
                                                aria-label={t("common.pagination.previous")}
                                                isDisabled={page <= 1}
                                                className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                                onPress={() => setPage((current) => Math.max(1, current - 1))}
                                            >
                                                <Pagination.PreviousIcon />
                                            </Pagination.Previous>
                                        </Pagination.Item>
                                        {pageNumbers.map((pageNumber) => (
                                            <Pagination.Item key={pageNumber}>
                                                <Pagination.Link
                                                    isActive={pageNumber === page}
                                                    className="cursor-pointer rounded-medium transition-colors hover:bg-default data-[active=true]:hover:bg-accent"
                                                    onPress={() => setPage(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </Pagination.Link>
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Item>
                                            <Pagination.Next
                                                aria-label={t("common.pagination.next")}
                                                isDisabled={page >= totalPages}
                                                className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                                onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
                                            >
                                                <Pagination.NextIcon />
                                            </Pagination.Next>
                                        </Pagination.Item>
                                    </Pagination.Content>
                                </Pagination>
                            ) : null}
                        </div>
                    </AsyncContent>
                </div>
            )}
        </div>
    )
}

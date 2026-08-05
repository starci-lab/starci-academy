"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react"
import { useLocale, useTranslations, type Locale } from "next-intl"
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import {
    _PersonalProjectWorkspaceLayout,
} from "./component"
import { pathConfig } from "@/resources/path"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setSelectedAttemptId, setSelectedTaskId } from "@/redux/slices/milestone"
import { buildMilestoneTaskProgressLookup, isPersonalProjectTaskActionUnlocked } from "@/components/utils/task-lookup"
import { dayjs, getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { usePersonalProjectGithubForm } from "@/hooks/zustand/personalProjectGithub/usePersonalProjectGithubForm"
import { usePersonalProjectGithubStore } from "@/hooks/zustand/personalProjectGithub/store"
import { useQueryMilestonesSwr } from "@/hooks/swr/api/graphql/queries/useQueryMilestonesSwr"
import { useQueryMilestoneTaskProgressSwr } from "@/hooks/swr/api/graphql/queries/useQueryMilestoneTaskProgressSwr"
import { useQueryMilestoneTaskSwr } from "@/hooks/swr/api/graphql/queries/useQueryMilestoneTaskSwr"
import { useQueryUserPersonalTaskAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserPersonalTaskAttemptsSwr"
import { useQueryUserPersonalTaskAttemptFeedbacksSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserPersonalTaskAttemptFeedbacksSwr"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { useMutateSyncPersonalProjectGithubSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSyncPersonalProjectGithubSwr"
import { useMutateSyncPersonalProjectGithubBranchSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSyncPersonalProjectGithubBranchSwr"
import { JobStatus } from "@/modules/types/enums/job-status"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { MilestoneSeverity } from "@/modules/types/enums/milestone-severity"
import { resolveSearchResultHref } from "@/modules/learn/resolve-search-result-href"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import type {
    PersonalProjectDashboardTask,
    PersonalProjectTaskSubtitleState,
} from "@/components/starci/blocks/learn/PersonalProjectDashboard"
import type {
    PersonalProjectTaskLegacyCriterionItem,
    PersonalProjectTaskLegacyCodeImplementationItem,
} from "@/components/pages/PersonalProjectTaskPage"
import type { AiModelCategory as SubmissionModelCategory } from "@/components/starci/blocks/learn/SubmissionScoreCard"
import type { SubmissionAttempt } from "@/components/starci/blocks/learn/SubmissionAttemptSelector"
import type { SubmissionFinding, SubmissionFeedbackSeverity } from "@/components/starci/blocks/learn/SubmissionFindingsList"
import type { ContentRelatedItem } from "@/components/starci/blocks/learn/ContentRelatedList"

/**
 * `PersonalProjectWorkspace` — the CONNECTED half of the SRC TWIN of
 * `.storybook/components/starci/pages/PersonalProjectWorkspace`. Mirrors the data
 * wiring already proven in `src/components/features/learn/PersonalProject`
 * (the v1 `PersonalProjectWorkspace` + its `PersonalProjectDashboard`, `Task`/
 * `TaskSubmissionPanel` split, and `TaskResult`) onto the storybook-driven screen
 * tree in `./component` instead of that v1's hand-built layout — same routes
 * (`/learn/personal-project…`, NOT swapped here), same redux/SWR/zustand sources.
 *
 * STAGED, route NOT swapped — this twin is built and mounted nowhere yet
 * (`src-tier-ported-but-unused`, matching batches 1–16). The live routes still
 * render the v1 `PersonalProjectWorkspace`; deleting v1 or swapping the route is
 * deferred debt, handled by a later batch.
 *
 * Like the blueprint and v1, this is a THREE-LEAF structural switch keyed off the
 * URL (not a data state of one shape): no `taskId` → `dashboard`; a `taskId` whose
 * path ends in `/result` → `result`; otherwise → `task`. Each leaf is its own
 * connected sub-component so its hooks run only when that leaf is mounted (rules of
 * hooks — the three view fetch surfaces never share one component).
 */
export const PersonalProjectWorkspaceLayout = () => {
    const params = useParams()
    const pathname = usePathname()
    const taskId = typeof params?.taskId === "string" ? params.taskId : undefined
    const isResult = /\/result\/?$/.test(pathname)

    if (!taskId) {
        return <DashboardView />
    }
    if (isResult) {
        return <ResultView taskId={taskId} />
    }
    return <TaskView taskId={taskId} />
}

/** github.com URL → `owner/repo` (drops scheme + trailing .git) for a compact label. */
const toRepoLabel = (url: string): string =>
    url
        .trim()
        .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
        .replace(/\.git$/i, "")
        .replace(/\/$/, "")

/** MilestoneSeverity enum → the presentational block's severity union. */
const SEVERITY_TO_TWIN: Record<MilestoneSeverity, SubmissionFeedbackSeverity> = {
    [MilestoneSeverity.High]: "high",
    [MilestoneSeverity.Medium]: "medium",
    [MilestoneSeverity.Low]: "low",
}

/** v1 AiModelCategory enum → the presentational block's category union (same string values). */
const MODEL_CATEGORY_TO_TWIN: Record<AiModelCategory, SubmissionModelCategory> = {
    [AiModelCategory.Medium]: "medium",
    [AiModelCategory.High]: "high",
    // Low is the chat rung and the embedding tiers never grade — folded to the
    // lowest grading chip so the record stays exhaustive over the enum
    [AiModelCategory.Low]: "low",
    [AiModelCategory.EmbeddingBulk]: "low",
    [AiModelCategory.EmbeddingDoc]: "low",
}

/**
 * Map raw `searchCourseContent` hits into the presentational `ContentRelatedItem`
 * rows — mirrors `RelatedContentList`'s own filter/slice/resolve, but returns DATA
 * (the block expects resolved rows, not a self-contained search). Drops the current
 * surface's own source and any hit whose kind lacks the ids it needs to route.
 */
const toRelatedItems = (
    results: Array<SearchCourseContentItem>,
    locale: Locale,
    courseDisplayId: string,
    excludeId: string | undefined,
    limit = 3,
): Array<ContentRelatedItem> =>
    results
        .filter((item) => !excludeId
            || (item.contentId !== excludeId && item.deckId !== excludeId && item.taskId !== excludeId))
        .slice(0, limit)
        .map((item, index): ContentRelatedItem | null => {
            const href = resolveSearchResultHref(item, locale, courseDisplayId)
            if (!href) {
                return null
            }
            return {
                key: `${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`,
                title: item.title,
                breadcrumb: item.breadcrumb ?? undefined,
                isLocked: item.isLocked,
                href,
            }
        })
        .filter((row): row is ContentRelatedItem => row != null)

/** Home › Courses › <course> › Capstone breadcrumb rows, structurally usable by every leaf. */
const useLearnCrumbs = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    return useMemo(() => [
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
            onPress: () => router.push(pathConfig().locale(locale).course(courseDisplayId).build()),
        },
        {
            key: "capstone",
            label: t("course.finalProjectTitle"),
        },
    ], [t, locale, router, course?.title, courseDisplayId])
}

/**
 * `view="dashboard"` — the capstone landing overview. Lifts the wiring of the v1
 * `PersonalProjectDashboard` (milestones + progress SWR, enrollment GitHub status,
 * the next-task/current-milestone/stats derivations) into the presentational
 * dashboard block's prop surface.
 */
const DashboardView = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const crumbs = useLearnCrumbs()

    const milestonesSwr = useQueryMilestonesSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const enrollment = useAppSelector((state) => state.user.enrollment)
    const githubUrl = enrollment?.personalProjectGithubUrl ?? ""
    const githubBranch = enrollment?.personalProjectGithubBranch ?? ""

    const milestones = useMemo(
        () => [...milestoneEntities].sort((prev, next) => prev.sortIndex - next.sortIndex),
        [milestoneEntities],
    )
    const completionTasks = progressSwr.data?.milestoneTaskProgress?.data?.completionTasks
    const progressMap = useMemo(
        () => buildMilestoneTaskProgressLookup(completionTasks),
        [completionTasks],
    )
    const currentTaskId = progressSwr.data?.milestoneTaskProgress?.data?.currentTask?.id

    const currentTask = useMemo(() => {
        if (!currentTaskId) {
            return undefined
        }
        for (const milestone of milestones) {
            const task = (milestone.tasks ?? []).find((entity) => entity.id === currentTaskId)
            if (task) {
                return task
            }
        }
        return undefined
    }, [milestones, currentTaskId])

    const currentMilestone = useMemo(() => {
        if (currentTaskId) {
            const owning = milestones.find((milestone) =>
                (milestone.tasks ?? []).some((task) => task.id === currentTaskId))
            if (owning) {
                return owning
            }
        }
        return milestones[0]
    }, [milestones, currentTaskId])

    const stats = useMemo(() => {
        let total = 0
        for (const milestone of milestones) {
            total += (milestone.tasks ?? []).length
        }
        let done = 0
        let attempts = 0
        let scoreSum = 0
        let maxSum = 0
        let scored = 0
        for (const item of completionTasks ?? []) {
            attempts += item.numAttempts ?? 0
            if (item.completed) {
                done += 1
                if (typeof item.lastScore === "number") {
                    scoreSum += item.lastScore
                    maxSum += item.maxScore ?? 20
                    scored += 1
                }
            }
        }
        const avgScore = scored > 0 ? Math.round(scoreSum / scored) : null
        const avgMax = scored > 0 ? Math.round(maxSum / scored) : 20
        return {
            done,
            total,
            attempts,
            avgLabel: avgScore != null ? `${avgScore}/${avgMax}` : "—",
        }
    }, [milestones, completionTasks])

    const isConnected = githubUrl.trim().length > 0
    const githubLabel = isConnected
        ? `${toRepoLabel(githubUrl)} · ${githubBranch || "main"}`
        : t("finalProject.dashboard.notConnected")

    const onContinue = useCallback(() => {
        const nextId = currentTaskId ?? milestones[0]?.tasks?.[0]?.id
        if (!nextId) {
            return
        }
        dispatch(setSelectedTaskId(nextId))
        router.push(
            pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(nextId).build(),
        )
    }, [currentTaskId, milestones, dispatch, router, locale, courseDisplayId])

    const onSelectTask = useCallback(
        (id: string) => {
            dispatch(setSelectedTaskId(id))
            router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(id).build(),
            )
        },
        [dispatch, router, locale, courseDisplayId],
    )

    const tasks = useMemo((): Array<PersonalProjectDashboardTask> =>
        (currentMilestone?.tasks ?? []).map((task) => {
            const isCompleted = progressMap.get(task.id)?.completed ?? false
            const isActive = task.id === currentTaskId
            const isLocked = !isPersonalProjectTaskActionUnlocked(task.id, progressMap, currentTaskId)
            const subtitleState: PersonalProjectTaskSubtitleState = isActive
                ? "active"
                : isCompleted
                    ? "done"
                    : isLocked
                        ? "locked"
                        : "todo"
            return {
                id: task.id,
                sortIndex: task.sortIndex,
                title: task.title,
                subtitleState,
            }
        }),
    [currentMilestone?.tasks, progressMap, currentTaskId])

    const hasMilestones = milestones.length > 0
    const isLoading = (!hasMilestones && !milestonesSwr.error && (milestonesSwr.isLoading || !milestonesSwr.data))
        || (progressSwr.isLoading && !progressSwr.data)
    const isEmpty = !hasMilestones && !milestonesSwr.isLoading && !!milestonesSwr.data && !milestonesSwr.error

    return (
        <_PersonalProjectWorkspaceLayout
            view="dashboard"
            breadcrumbItems={crumbs}
            title={t("finalProject.dashboard.title")}
            description={t("finalProject.dashboard.subtitle")}
            githubStatus={{ isConnected, label: githubLabel }}
            currentTask={currentTask ? { sortIndex: currentTask.sortIndex, title: currentTask.title } : undefined}
            onContinue={onContinue}
            milestoneLabel={currentMilestone?.title}
            tasks={tasks}
            onSelectTask={onSelectTask}
            stats={stats}
            isLoading={isLoading}
            isEmpty={isEmpty}
            isSkeleton={enrollment == null}
        />
    )
}

/**
 * `view="task"` — the read-left/act-right task solve split. Lifts the wiring of the
 * v1 `Task` reading column (redux task detail + per-language brief + legacy
 * rubric/guides + related lessons) and the `TaskSubmissionPanel` act column (the
 * shared GitHub form store + the `TaskActions` gating + the latest graded result).
 *
 * The grading-settings drawer and the attempts-history drawer are NOT built in this
 * twin (see the recorded debt): `onOpenSettings`/`onOpenAttempts` are chrome-only
 * no-ops here, and the v1 AI-processing status line has no presentational surface.
 */
const TaskView = ({ taskId }: { taskId: string }) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const crumbs = useLearnCrumbs()

    // URL is the source of truth for which task is open — sync it into redux the same
    // way the v1 dashboard/rail select does, so every colocated hook reads the id.
    useEffect(() => {
        dispatch(setSelectedTaskId(taskId))
    }, [dispatch, taskId])

    const milestoneTaskQuery = useQueryMilestoneTaskSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
    const attemptsSwr = useQueryUserPersonalTaskAttemptsSwr()
    const aiModelsSwr = useQueryAiModelsSwr()
    const syncGithubSwr = useMutateSyncPersonalProjectGithubSwr()
    const syncBranchSwr = useMutateSyncPersonalProjectGithubBranchSwr()
    const githubForm = usePersonalProjectGithubForm({ enableSync: true })

    const course = useAppSelector((state) => state.course.entity)
    const selectedTaskDetail = useAppSelector((state) => state.milestone.selectedTaskDetail)
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const milestoneTaskIdToJobId = useAppSelector((state) => state.milestone.milestoneTaskIdToJobId)
    const jobStatusByJobId = useAppSelector((state) => state.socketIo.jobStatusByJobId)

    const displayTask = useMemo(() => {
        if (selectedTaskDetail?.id === taskId) {
            return selectedTaskDetail
        }
        for (const milestone of milestoneEntities) {
            const found = milestone.tasks?.find((task) => task.id === taskId)
            if (found) {
                return found
            }
        }
        return undefined
    }, [taskId, selectedTaskDetail, milestoneEntities])

    // Locked-preview gate — same derivation as v1 TaskLockedAlert / TaskActions.
    const progressMap = useMemo(
        () => buildMilestoneTaskProgressLookup(progressSwr.data?.milestoneTaskProgress?.data?.completionTasks),
        [progressSwr.data],
    )
    const currentTaskId = progressSwr.data?.milestoneTaskProgress?.data?.currentTask?.id
    const isActionUnlocked = useMemo(() => {
        if (progressSwr.isLoading) {
            return true
        }
        return isPersonalProjectTaskActionUnlocked(taskId, progressMap, currentTaskId)
    }, [taskId, progressMap, currentTaskId, progressSwr.isLoading])
    const isLocked = !isActionUnlocked

    // Brief: schema-v2 authored body for the active grading language, else "" (legacy tasks).
    const briefs = displayTask?.briefs ?? []
    const briefBody = useMemo(() => {
        const picked = briefs.find((brief) => brief.lang === githubForm.lang) ?? briefs[0]
        return picked?.body ?? ""
    }, [briefs, githubForm.lang])

    // Legacy rubric + per-language implementation guides — only when there is NO brief.
    const hasBrief = briefs.length > 0
    const legacyCriteria = useMemo((): Array<PersonalProjectTaskLegacyCriterionItem> | undefined => {
        if (hasBrief) {
            return undefined
        }
        return [...(displayTask?.criterias ?? [])]
            .sort((prev, next) => prev.sortIndex - next.sortIndex)
            .map((criteria) => ({
                key: criteria.id,
                text: criteria.text,
                score: criteria.score,
                hint: criteria.hint || undefined,
            }))
    }, [hasBrief, displayTask?.criterias])
    const legacyCodeImplementations = useMemo((): Array<PersonalProjectTaskLegacyCodeImplementationItem> | undefined => {
        if (hasBrief) {
            return undefined
        }
        return (displayTask?.codeImplementations ?? []).map((impl) => ({
            key: impl.id,
            lang: impl.lang,
            guide: impl.guide,
            example: impl.example,
        }))
    }, [hasBrief, displayTask?.codeImplementations])

    // Related reading — RAG search off the task's own title/description (no typing), mapped to rows.
    const relatedQuery = displayTask?.title
        ? `${displayTask.title} ${displayTask.description ?? ""}`
        : ""
    const relatedSwr = useQuerySearchCourseContentSwr(course?.id ?? null, relatedQuery, Boolean(course?.id && relatedQuery.trim()))
    const relatedItems = useMemo(
        () => toRelatedItems(relatedSwr.data ?? [], locale, course?.displayId ?? "", displayTask?.id),
        [relatedSwr.data, locale, course?.displayId, displayTask?.id],
    )

    // Act column — GitHub form + evaluate gating (TaskActions) + latest graded result (TaskResults).
    const attemptRows = useMemo(() => attemptsSwr.data?.data ?? [], [attemptsSwr.data?.data])
    const hasAttempts = attemptRows.length > 0
    const latestAttempt = attemptRows[0]

    const reviewJobId = milestoneTaskIdToJobId[taskId]
    const reviewJobStatus = reviewJobId ? jobStatusByJobId[reviewJobId]?.data?.status : undefined

    const isEvaluateDisabled = !isActionUnlocked
        || githubForm.isSubmitting
        || attemptsSwr.isLoading
        || syncGithubSwr.isMutating
        || syncBranchSwr.isMutating
    const isEvaluatePending = githubForm.isSubmitting
        || (Boolean(reviewJobId) && (reviewJobStatus === JobStatus.Processing || reviewJobStatus === JobStatus.Queued))

    const langLabelMap: Record<string, string> = {
        typescript: t("programmingLanguage.typescript"),
        java: t("programmingLanguage.java"),
        csharp: t("programmingLanguage.csharp"),
        go: t("programmingLanguage.go"),
    }

    const modelCategoryMap = useMemo(() => {
        const map = new Map<string, SubmissionModelCategory>()
        for (const model of aiModelsSwr.data?.aiModels?.data?.gradableModels ?? []) {
            map.set(model.model, MODEL_CATEGORY_TO_TWIN[model.category])
        }
        return map
    }, [aiModelsSwr.data])

    const panelResult = useMemo(() => {
        if (!latestAttempt) {
            return undefined
        }
        const timeAgo = latestAttempt.processedAt
            ? getTimeAgoLabel(getTimeAgoMessage(dayjs(latestAttempt.processedAt)), t)
            : undefined
        return {
            score: latestAttempt.score ?? 0,
            maxScore: displayTask?.maxScore ?? undefined,
            isPassing: latestAttempt.passed,
            shortFeedback: latestAttempt.shortFeedback ?? undefined,
            gradedByModel: latestAttempt.servedModel ?? undefined,
            modelCategory: latestAttempt.servedModel ? modelCategoryMap.get(latestAttempt.servedModel) : undefined,
            timeAgo: timeAgo ?? undefined,
        }
    }, [latestAttempt, displayTask?.maxScore, modelCategoryMap, t])

    const onEvaluate = useCallback(() => {
        void githubForm.submit()
    }, [githubForm])
    const onOpenFeedbackDetails = useCallback(() => router.push(`${pathname}/result`), [router, pathname])

    const isSkeleton = !displayTask || milestoneTaskQuery.isLoading

    return (
        <_PersonalProjectWorkspaceLayout
            view="task"
            breadcrumbItems={crumbs}
            task={{ title: displayTask?.title ?? "", description: displayTask?.description || undefined }}
            isLocked={isLocked}
            brief={{ body: briefBody }}
            legacyCriteria={legacyCriteria}
            legacyCodeImplementations={legacyCodeImplementations}
            relatedItems={relatedItems}
            relatedLabel={t("task.relatedContent.label")}
            submissionPanelProps={{
                repoUrl: githubForm.githubUrl,
                onRepoUrlChange: githubForm.setGithubUrl,
                repoUrlError: githubForm.touched.githubUrl ? (githubForm.errors.githubUrl ?? undefined) : undefined,
                settingsLangLabel: langLabelMap[githubForm.lang] ?? githubForm.lang,
                settingsBranch: githubForm.branch,
                // Settings drawer not built in this twin — chrome-only no-op (see debt).
                onOpenSettings: () => {},
                onEvaluate,
                isEvaluatePending,
                isEvaluateDisabled,
                hasAttempts,
                onOpenFeedbackDetails,
                // Attempts-history drawer not built in this twin — chrome-only no-op (see debt).
                onOpenAttempts: () => {},
                result: panelResult,
            }}
            isSkeleton={isSkeleton}
        />
    )
}

/**
 * `view="result"` — the graded-attempt verdict. Lifts the wiring of the v1
 * `PersonalProjectTaskResult` (attempts + feedbacks SWR gated on redux
 * `selectedAttemptId`, the AI-model catalog for the grader byline, the severity
 * sort, the failing-attempt related search, and the passing-attempt next-task
 * handoff) into the presentational result screen's prop surface.
 *
 * The attempts-history overflow drawer is NOT built in this twin (see debt): all
 * attempts are shown inline and no "+N" overflow trigger is surfaced.
 */
const ResultView = ({ taskId }: { taskId: string }) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setSelectedTaskId(taskId))
    }, [dispatch, taskId])

    useQueryMilestoneTaskSwr()
    const progressSwr = useQueryMilestoneTaskProgressSwr()
    const attemptsSwr = useQueryUserPersonalTaskAttemptsSwr()
    const feedbacksSwr = useQueryUserPersonalTaskAttemptFeedbacksSwr()
    const aiModelsSwr = useQueryAiModelsSwr()

    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const selectedTaskDetail = useAppSelector((state) => state.milestone.selectedTaskDetail)
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const githubUrl = usePersonalProjectGithubStore((state) => state.githubUrl)

    const maxScore = selectedTaskDetail?.maxScore ?? 0
    const attemptParam = searchParams.get("attempt")

    const attempts = useMemo(() => attemptsSwr.data?.data ?? [], [attemptsSwr.data])
    const selectedAttempt = useMemo(
        () => (attemptParam ? attempts.find((attempt) => attempt.id === attemptParam) : undefined) ?? attempts[0],
        [attempts, attemptParam],
    )

    // The feedbacks hook is gated on redux `selectedAttemptId` — keep it in sync.
    useEffect(() => {
        dispatch(setSelectedAttemptId(selectedAttempt?.id))
    }, [dispatch, selectedAttempt?.id])

    const feedbacks = useMemo(() => feedbacksSwr.data?.data ?? [], [feedbacksSwr.data])
    const passing = selectedAttempt?.passed ?? false

    const modelCategoryMap = useMemo(() => {
        const map = new Map<string, SubmissionModelCategory>()
        for (const model of aiModelsSwr.data?.aiModels?.data?.gradableModels ?? []) {
            map.set(model.model, MODEL_CATEGORY_TO_TWIN[model.category])
        }
        return map
    }, [aiModelsSwr.data])
    const servedCategory = selectedAttempt?.servedModel ? modelCategoryMap.get(selectedAttempt.servedModel) : undefined

    const attemptItems = useMemo((): Array<SubmissionAttempt> =>
        attempts.map((attempt) => ({
            id: attempt.id,
            attemptNumber: attempt.attemptNumber,
            score: attempt.score,
            isPassing: attempt.passed,
        })),
    [attempts])

    const findings = useMemo((): Array<SubmissionFinding> =>
        feedbacks.map((feedback) => ({
            id: feedback.id,
            message: feedback.message,
            suggestion: feedback.suggestion ?? undefined,
            location: feedback.location ?? undefined,
            severity: SEVERITY_TO_TWIN[feedback.severity] ?? "medium",
            sortIndex: feedback.sortIndex,
        })),
    [feedbacks])

    // Next milestone task once this one passes — look its title up across the tree.
    const nextTaskId = progressSwr.data?.milestoneTaskProgress?.data?.currentTask?.id ?? undefined
    const nextTask = useMemo(() => {
        if (!passing || !nextTaskId || nextTaskId === taskId) {
            return undefined
        }
        for (const milestone of milestoneEntities) {
            const found = milestone.tasks?.find((task) => task.id === nextTaskId)
            if (found) {
                return { title: found.title }
            }
        }
        return undefined
    }, [passing, nextTaskId, taskId, milestoneEntities])
    const onGoToNextTask = useCallback(() => {
        if (!nextTaskId || !courseDisplayId) {
            return
        }
        router.push(
            pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(nextTaskId).build(),
        )
    }, [nextTaskId, courseDisplayId, locale, router])

    // Related reading — only meaningful on a FAILED attempt; query auto-built from the top findings.
    const failingQuery = useMemo(
        () => [...findings]
            .sort((a, b) => (a.severity === b.severity ? (a.sortIndex ?? 0) - (b.sortIndex ?? 0) : 0))
            .slice(0, 3)
            .map((finding) => finding.message)
            .join(" "),
        [findings],
    )
    const relatedSwr = useQuerySearchCourseContentSwr(
        course?.id ?? null,
        failingQuery,
        Boolean(!passing && course?.id && failingQuery.trim()),
    )
    const relatedItems = useMemo(
        () => (passing ? [] : toRelatedItems(relatedSwr.data ?? [], locale, courseDisplayId ?? "", taskId)),
        [passing, relatedSwr.data, locale, courseDisplayId, taskId],
    )

    const timeAgo = selectedAttempt?.processedAt
        ? getTimeAgoLabel(getTimeAgoMessage(dayjs(selectedAttempt.processedAt)), t)
        : undefined

    const taskHref = pathname.replace(/\/result\/?$/, "")
    const onBack = useCallback(() => router.push(taskHref), [router, taskHref])
    const onSelectAttempt = useCallback(
        (id: string) => router.push(`${pathname}?attempt=${id}`),
        [router, pathname],
    )

    const attemptsLoading = attemptsSwr.data == null ? !attemptsSwr.error : false

    return (
        <_PersonalProjectWorkspaceLayout
            view="result"
            backLabel={t("personalProjectResult.backToTask")}
            onBack={onBack}
            title={selectedTaskDetail?.title ?? t("personalProjectResult.title")}
            description={selectedTaskDetail?.description || undefined}
            attempts={attemptItems}
            selectedAttemptId={selectedAttempt?.id}
            onSelectAttempt={onSelectAttempt}
            attemptsAriaLabel={t("personalProjectResult.history")}
            scoreLabel={t("personalProjectResult.resultLabel")}
            score={selectedAttempt?.score ?? undefined}
            maxScore={maxScore > 0 ? maxScore : undefined}
            isPassing={passing}
            shortFeedback={selectedAttempt?.shortFeedback ?? undefined}
            submissionUrl={githubUrl || undefined}
            gradedByModel={selectedAttempt?.servedModel ?? undefined}
            modelCategory={servedCategory}
            timeAgo={timeAgo}
            findingsLabel={t("personalProjectResult.feedbackLabel")}
            findings={findings}
            repositoryUrl={githubUrl || undefined}
            relatedItems={relatedItems}
            relatedLabel={t("personalProjectResult.relatedContent.label")}
            nextTask={nextTask}
            onGoToNextTask={onGoToNextTask}
            isSkeleton={attemptsLoading}
        />
    )
}

"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useRef,
} from "react"
import useSWR from "swr"
import Editor from "@monaco-editor/react"
import {
    Button,
    Tabs,
    Typography,
} from "@heroui/react"
import { ArrowCounterClockwiseIcon, PlayIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useParams, useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { AIProcessingText } from "@/components/features/learn/AIProcessingText"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { StatusChip, type StatusChipTone } from "@/components/blocks/chips/StatusChip"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import { StatGridCard } from "@/components/blocks/stats/StatGridCard"
import { IOExampleCard } from "@/components/blocks/code/IOExampleCard"
import { CodeConsole } from "@/components/blocks/code/CodeConsole"
import { TestCaseResultGrid, type TestCaseResult } from "@/components/blocks/code/TestCaseResultGrid"
import { PracticeProblemSkeleton } from "./PracticeProblemSkeleton"
import { queryCodingProblem } from "@/modules/api/graphql/queries/query-coding-problem"
import { queryCodingProblemHint } from "@/modules/api/graphql/queries/query-coding-problem-hint"
import { queryMyCodingSubmissions } from "@/modules/api/graphql/queries/query-my-coding-submissions"
import { mutateSubmitCodingSolution } from "@/modules/api/graphql/mutations/mutation-submit-coding-solution"
import { mutateRevealCodingSolution } from "@/modules/api/graphql/mutations/mutation-reveal-coding-solution"
import {
    CodingDifficulty,
    CodingLanguage,
    CodingVerdict,
    parsePerCaseResults,
    type CodingProblem,
    type CodingProblemSolution,
    type CodingSubmission,
} from "@/modules/api/graphql/queries/types/coding"
import { useJobNotificationsSocketIo } from "@/hooks/socketio/useJobNotificationsSocketIo"
import { PublicationEvent } from "@/hooks/socketio/enums/publication-event"
import { JobCategory } from "@/modules/types/enums/job-category"
import { JobStatus } from "@/modules/types/enums/job-status"
import { useAppSelector } from "@/redux/hooks"

/** Props for {@link PracticeProblem}. */
export type PracticeProblemProps = Record<string, never>

/** Seniority level i18n key per difficulty (easy=junior, medium=mid, hard=senior). */
const LEVEL_KEY: Record<CodingDifficulty, string> = {
    [CodingDifficulty.Easy]: "junior",
    [CodingDifficulty.Medium]: "mid",
    [CodingDifficulty.Hard]: "senior",
}

/** Difficulty → chip tone (mirrors the list-card difficulty palette). */
const DIFFICULTY_TONE: Record<CodingDifficulty, StatusChipTone> = {
    [CodingDifficulty.Easy]: "success",
    [CodingDifficulty.Medium]: "warning",
    [CodingDifficulty.Hard]: "danger",
}

/** Map a coding language to its Monaco editor language id. */
const MONACO_LANGUAGE: Record<CodingLanguage, string> = {
    [CodingLanguage.Python]: "python",
    [CodingLanguage.JavaScript]: "javascript",
    [CodingLanguage.TypeScript]: "typescript",
    [CodingLanguage.Java]: "java",
    [CodingLanguage.Cpp]: "cpp",
}

/** Chip tone per verdict (accepted = success, terminal failures = danger). */
const VERDICT_TONE: Record<CodingVerdict, StatusChipTone> = {
    [CodingVerdict.Accepted]: "success",
    [CodingVerdict.WrongAnswer]: "danger",
    [CodingVerdict.TimeLimitExceeded]: "danger",
    [CodingVerdict.MemoryLimitExceeded]: "danger",
    [CodingVerdict.RuntimeError]: "danger",
    [CodingVerdict.CompileError]: "danger",
    [CodingVerdict.InternalError]: "warning",
    [CodingVerdict.Pending]: "neutral",
    [CodingVerdict.Judging]: "neutral",
}

/** Left-pane tab ids. */
type LeftTab = "description" | "solution" | "submissions"
/** Console (right-pane bottom) tab ids. */
type ConsoleTab = "testcase" | "result"

/** Terminal job statuses — judging has finished (success or failure). */
const isTerminalStatus = (status: JobStatus | undefined): boolean =>
    status === JobStatus.Completed || status === JobStatus.Failed

/**
 * Coding-problem detail + editor — a full-bleed 2-pane IDE (`/practice/[slug]`).
 * LEFT = tabbed reading column (`ExtendedTabs`: Mô tả / Lời giải / Nộp trước);
 * RIGHT = Monaco editor over a `CodeConsole` (Test case / Kết quả) whose result
 * tab renders the judged PER-CASE outcome (`TestCaseResultGrid` off the API's
 * `perCaseResults`) plus runtime/memory stats. The submit → async-judge →
 * realtime-verdict flow (SWR + `/job_notifications` socket + anti-cheat
 * telemetry) is unchanged from the prior build; only the shell is new.
 */
export const PracticeProblem = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const params = useParams()
    const slug = String(params.slug ?? "")
    const { theme } = useTheme()
    const socket = useJobNotificationsSocketIo()

    const [language, setLanguage] = useState<CodingLanguage>(CodingLanguage.Python)
    const [code, setCode] = useState<string>("")
    const [pendingJobId, setPendingJobId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [leftTab, setLeftTab] = useState<LeftTab>("description")
    const [consoleTab, setConsoleTab] = useState<ConsoleTab>("testcase")
    // Live job status mirrored from Redux — the global /job_notifications lifecycle
    // dispatches every subscribed job's status into socketIo.jobStatusByJobId, the same
    // single source the challenge panel reads (no per-component EventEmitter listener).
    const pendingJobMessage = useAppSelector((state) =>
        (pendingJobId ? state.socketIo.jobStatusByJobId[pendingJobId] : undefined))
    const pendingJobStatus = pendingJobMessage?.data?.status
    const pendingJobError = pendingJobMessage?.data?.error
    const [showHint, setShowHint] = useState(false)
    const [showSolution, setShowSolution] = useState(false)
    // reference solutions arrive ONLY from the gated reveal mutation (never the
    // problem detail read) — held here once the learner reveals them
    const [revealedSolutions, setRevealedSolutions] = useState<Array<CodingProblemSolution>>([])
    const [solutionLanguage, setSolutionLanguage] = useState<CodingLanguage>(CodingLanguage.Python)
    const [touchedLanguages, setTouchedLanguages] = useState<Set<CodingLanguage>>(new Set())

    const telemetryRef = useRef({
        pasteCount: 0,
        pasteSizeMax: 0,
        keystrokeCount: 0,
        tabBlurCount: 0,
        timeOpen: Date.now(),
    })

    // Reset telemetry when the slug changes (user selects a new problem)
    useEffect(() => {
        telemetryRef.current = {
            pasteCount: 0,
            pasteSizeMax: 0,
            keystrokeCount: 0,
            tabBlurCount: 0,
            timeOpen: Date.now(),
        }
    }, [slug])

    // Track when window loses focus (user switching browser tabs/windows)
    useEffect(() => {
        const handleBlur = () => {
            telemetryRef.current.tabBlurCount += 1
        }
        window.addEventListener("blur", handleBlur)
        return () => window.removeEventListener("blur", handleBlur)
    }, [])

    const { data: problem, isLoading } = useSWR<CodingProblem | null>(
        ["coding-problem", slug],
        async () => {
            const response = await queryCodingProblem({ request: { slug } })
            return response.data?.codingProblem.data ?? null
        },
    )

    const { data: hint } = useSWR<string | null>(
        ["coding-problem-hint", slug],
        async () => {
            const response = await queryCodingProblemHint({ request: { slug } })
            return response.data?.codingProblemHint.data?.hint ?? null
        },
    )

    const { data: submissionsData, mutate: mutateSubmissions } = useSWR(
        ["my-coding-submissions", slug],
        async () => {
            const response = await queryMyCodingSubmissions({
                request: { slug, page: 1, limit: 20 },
            })
            return response.data?.myCodingSubmissions.data ?? null
        },
    )

    const starterByLanguage = useMemo(() => {
        const map = new Map<CodingLanguage, string>()
        problem?.starterCodes?.forEach((starter) => map.set(starter.language, starter.code))
        return map
    }, [problem?.starterCodes])

    const languages = useMemo<Array<CodingLanguage>>(() => {
        const withStarter = problem?.starterCodes?.map((starter) => starter.language) ?? []
        return withStarter.length > 0 ? withStarter : Object.values(CodingLanguage)
    }, [problem?.starterCodes])

    useEffect(() => {
        if (languages.length > 0 && !languages.includes(language)) {
            setLanguage(languages[0])
        }
    }, [languages, language])

    useEffect(() => {
        if (!touchedLanguages.has(language)) {
            setCode(starterByLanguage.get(language) ?? "")
        }
    }, [language, starterByLanguage, touchedLanguages])

    const latestSubmission = useMemo<CodingSubmission | undefined>(
        () => submissionsData?.submissions[0],
        [submissionsData?.submissions],
    )

    // decode the judged per-case outcome (input/expected/got for samples) — the
    // data the API always returned but the old UI threw away.
    const resultCases = useMemo<Array<TestCaseResult>>(
        () => parsePerCaseResults(latestSubmission?.perCaseResults ?? null).map((perCase) => ({
            key: String(perCase.orderIndex),
            label: t("codingPractice.caseLabel", { index: perCase.orderIndex }),
            passed: perCase.verdict === CodingVerdict.Accepted,
            isSample: perCase.isSample,
            input: perCase.input,
            expectedOutput: perCase.expectedOutput,
            got: perCase.stdout,
        })),
        [latestSubmission?.perCaseResults, t],
    )

    // reference solution code keyed by language (revealed in the "answer" panel)
    const solutionByLanguage = useMemo(() => {
        const map = new Map<CodingLanguage, string>()
        revealedSolutions.forEach((solution) => map.set(solution.language, solution.code))
        return map
    }, [revealedSolutions])

    // languages that actually ship a reference solution
    const solutionLanguages = useMemo<Array<CodingLanguage>>(
        () => revealedSolutions.map((solution) => solution.language),
        [revealedSolutions],
    )

    // keep the solution language switcher pinned to an available language
    useEffect(() => {
        if (solutionLanguages.length > 0 && !solutionLanguages.includes(solutionLanguage)) {
            setSolutionLanguage(solutionLanguages[0])
        }
    }, [solutionLanguages, solutionLanguage])

    /** Back to the practice catalog. */
    const onBack = useCallback(
        () => router.push(pathConfig().locale(locale).practice().build()),
        [router, locale],
    )

    /** Reset the editor to the language's starter code (drops local edits). */
    const onResetCode = useCallback(() => {
        setCode(starterByLanguage.get(language) ?? "")
        setTouchedLanguages((prev) => {
            const next = new Set(prev)
            next.delete(language)
            return next
        })
    }, [language, starterByLanguage])

    // toggle the answer panel; revealing it forfeits the problem's points, so
    // confirm first and record the reveal server-side (best-effort)
    const onToggleSolution = useCallback(async () => {
        if (showSolution) {
            setShowSolution(false)
            return
        }
        if (!window.confirm(t("codingPractice.revealConfirm"))) {
            return
        }
        try {
            // the gated reveal mutation both records the forfeit AND returns the
            // reference solutions — the only path by which they reach the client
            const response = await mutateRevealCodingSolution({ request: { slug } })
            setRevealedSolutions(response.data?.revealCodingSolution.data?.solutions ?? [])
            setShowSolution(true)
        } catch {
            // reveal failed (network/auth) — keep the answer panel closed
        }
    }, [showSolution, slug, t])

    const onSubmit = useCallback(async () => {
        setSubmitting(true)
        setConsoleTab("result")
        try {
            const timeOpenToSubmitMs = Date.now() - telemetryRef.current.timeOpen
            const response = await mutateSubmitCodingSolution({
                request: {
                    slug,
                    language,
                    sourceCode: code,
                    telemetry: {
                        pasteCount: telemetryRef.current.pasteCount,
                        pasteSizeMax: telemetryRef.current.pasteSizeMax,
                        keystrokeCount: telemetryRef.current.keystrokeCount,
                        tabBlurCount: telemetryRef.current.tabBlurCount,
                        timeOpenToSubmitMs,
                    },
                },
            })
            const jobId = response.data?.submitCodingSolution.data?.jobId
            if (!jobId) return
            // Subscribe to the job room BEFORE the refetch so an early socket push is
            // never missed (race-free, like challenge). Status comes from Redux.
            setPendingJobId(jobId)
            socket.emit(PublicationEvent.SubscribeJobNotification, {
                data: { jobId },
                locale,
            })
            void mutateSubmissions()
        } finally {
            setSubmitting(false)
        }
    }, [slug, language, code, mutateSubmissions, socket, locale])

    // When the watched job reaches a terminal status (from Redux), refetch the
    // submissions (verdict now persisted) and stop watching.
    useEffect(() => {
        if (pendingJobId && isTerminalStatus(pendingJobStatus)) {
            void mutateSubmissions()
            setPendingJobId(null)
        }
    }, [pendingJobId, pendingJobStatus, mutateSubmissions])

    const judging = pendingJobId !== null

    if (isLoading || !problem) {
        return <PracticeProblemSkeleton />
    }

    const samples = problem.testcases ?? []
    const memoryMb = problem.memoryLimitKb ? Math.round(problem.memoryLimitKb / 1024) : null

    /** LEFT: problem statement, samples, hint. */
    const descriptionPanel = (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <Typography type="h4" weight="bold">{problem.title}</Typography>
                    <StatusChip tone={DIFFICULTY_TONE[problem.difficulty]}>
                        {t(`codingPractice.level.${LEVEL_KEY[problem.difficulty]}`)}
                    </StatusChip>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <span>{t("codingPractice.points", { points: problem.points })}</span>
                    {problem.timeLimitMs ? <span>· {t("codingPractice.timeLimit", { ms: problem.timeLimitMs })}</span> : null}
                    {memoryMb ? <span>· {t("codingPractice.memoryLimit", { mb: memoryMb })}</span> : null}
                    {problem.tags.map((tag) => <span key={tag}>· {tag}</span>)}
                </div>
            </div>

            <MarkdownContent markdown={problem.statement ?? ""} />

            {samples.length > 0 && (
                <div className="flex flex-col gap-3">
                    <hr className="border-default" />
                    <p className="font-semibold">{t("codingPractice.samples")}</p>
                    {samples.map((testcase, index) => (
                        <IOExampleCard
                            key={testcase.id}
                            rows={[
                                { key: "in", label: `${t("codingPractice.example")} ${index + 1} · ${t("codingPractice.input")}`, value: testcase.input },
                                { key: "out", label: t("codingPractice.output"), value: testcase.expectedOutput },
                            ]}
                        />
                    ))}
                </div>
            )}

            {hint && (
                <div className="flex flex-col gap-3">
                    <hr className="border-default" />
                    <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{t("codingPractice.hintTitle")}</p>
                        <Button size="sm" variant="secondary" onPress={() => setShowHint((prev) => !prev)}>
                            {showHint ? t("codingPractice.hideHint") : t("codingPractice.showHint")}
                        </Button>
                    </div>
                    {showHint && <MarkdownContent markdown={hint} />}
                </div>
            )}
        </div>
    )

    /** LEFT: reveal-gated reference solution, one tab per language. */
    const solutionPanel = (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{t("codingPractice.solutionTitle")}</p>
                <Button size="sm" variant="secondary" onPress={onToggleSolution}>
                    {showSolution ? t("codingPractice.hideSolution") : t("codingPractice.showSolution")}
                </Button>
            </div>
            {showSolution && solutionLanguages.length > 0 ? (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {solutionLanguages.map((option) => (
                            <Button
                                key={option}
                                size="sm"
                                variant={solutionLanguage === option ? "primary" : "secondary"}
                                onPress={() => setSolutionLanguage(option)}
                            >
                                {t(`codingPractice.language.${option}`)}
                            </Button>
                        ))}
                    </div>
                    <MarkdownContent
                        markdown={`\`\`\`${MONACO_LANGUAGE[solutionLanguage]}\n${
                            solutionByLanguage.get(solutionLanguage) ?? ""
                        }\n\`\`\``}
                    />
                </div>
            ) : (
                <Typography type="body-sm" color="muted">
                    {t("codingPractice.solutionLocked")}
                </Typography>
            )}
        </div>
    )

    /** LEFT: the learner's prior submissions for this problem. */
    const submissionsPanel = submissionsData && submissionsData.submissions.length > 0 ? (
        <SurfaceListCard>
            {submissionsData.submissions.map((submission: CodingSubmission) => (
                <SurfaceListCardRow
                    key={submission.id}
                    title={new Date(submission.createdAt).toLocaleString()}
                    meta={(
                        <>
                            <Typography type="body-xs" color="muted">
                                {t(`codingPractice.language.${submission.language}`)}
                            </Typography>
                            <StatusChip tone={VERDICT_TONE[submission.verdict]}>
                                {t(`codingPractice.verdict.${submission.verdict}`)}
                            </StatusChip>
                        </>
                    )}
                />
            ))}
        </SurfaceListCard>
    ) : (
        <EmptyState title={t("codingPractice.historyEmpty")} />
    )

    /** CONSOLE: sample testcases (pre-run reference). */
    const testcaseTab = samples.length > 0 ? (
        <div className="flex flex-col gap-3">
            {samples.map((testcase, index) => (
                <IOExampleCard
                    key={testcase.id}
                    rows={[
                        { key: "in", label: `${t("codingPractice.example")} ${index + 1} · ${t("codingPractice.input")}`, value: testcase.input },
                        { key: "out", label: t("codingPractice.output"), value: testcase.expectedOutput },
                    ]}
                />
            ))}
        </div>
    ) : (
        <Typography type="body-sm" color="muted">{t("codingPractice.noSamples")}</Typography>
    )

    /** CONSOLE: live judging / verdict + per-case grid + stats. */
    const resultTab = judging && pendingJobStatus ? (
        <AIProcessingText
            jobCategory={JobCategory.JudgeCoding}
            jobStatus={pendingJobStatus}
            error={pendingJobError}
        />
    ) : latestSubmission ? (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
                <StatusChip tone={VERDICT_TONE[latestSubmission.verdict]}>
                    {t(`codingPractice.verdict.${latestSubmission.verdict}`)}
                </StatusChip>
                <Typography type="body-sm" color="muted">
                    {t("codingPractice.passed")}: {latestSubmission.passedCount}/{latestSubmission.totalCount}
                </Typography>
            </div>

            <StatGridCard
                items={[
                    {
                        key: "passed",
                        content: (
                            <div className="flex flex-col gap-0">
                                <span className="text-lg font-bold">{latestSubmission.passedCount}/{latestSubmission.totalCount}</span>
                                <span className="text-xs text-muted">{t("codingPractice.statPassed")}</span>
                            </div>
                        ),
                    },
                    {
                        key: "runtime",
                        content: (
                            <div className="flex flex-col gap-0">
                                <span className="text-lg font-bold">{latestSubmission.runtimeMs ?? "—"}<span className="text-xs"> ms</span></span>
                                <span className="text-xs text-muted">{t("codingPractice.statRuntime")}</span>
                            </div>
                        ),
                    },
                    {
                        key: "memory",
                        content: (
                            <div className="flex flex-col gap-0">
                                <span className="text-lg font-bold">{latestSubmission.memoryKb ?? "—"}<span className="text-xs"> KB</span></span>
                                <span className="text-xs text-muted">{t("codingPractice.statMemory")}</span>
                            </div>
                        ),
                    },
                ]}
            />

            {resultCases.length > 0 && (
                <TestCaseResultGrid
                    cases={resultCases}
                    labels={{
                        input: t("codingPractice.input"),
                        expected: t("codingPractice.expected"),
                        got: t("codingPractice.got"),
                        hidden: t("codingPractice.hiddenCase"),
                    }}
                />
            )}

            {latestSubmission.compileOutput && (
                <pre className="whitespace-pre-wrap rounded-2xl bg-danger-soft p-3 text-xs text-danger-soft-foreground">
                    {latestSubmission.compileOutput}
                </pre>
            )}
        </div>
    ) : (
        <Typography type="body-sm" color="muted">{t("codingPractice.resultEmpty")}</Typography>
    )

    return (
        // full-bleed 2-pane IDE: left reading column | right editor + console
        <div className="grid h-[calc(100vh-4rem)] grid-cols-1 @app-lg:grid-cols-2">

            {/* ── LEFT: tabbed reading column ── */}
            <div className="flex min-h-0 flex-col overflow-hidden border-r border-default">
                <div className="flex flex-col gap-3 border-b border-default px-6 py-3">
                    <BackLink target={t("codingPractice.title")} onPress={onBack} />
                    <ExtendedTabs
                        selectedKey={leftTab}
                        onSelectionChange={(key) => setLeftTab(key as LeftTab)}
                    >
                        <Tabs.ListContainer>
                            <Tabs.List aria-label={problem.title}>
                                <Tabs.Tab id="description">
                                    {t("codingPractice.tabDescription")}
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab id="solution">
                                    {t("codingPractice.tabSolution")}
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab id="submissions">
                                    {t("codingPractice.tabSubmissions")}
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.ListContainer>
                    </ExtendedTabs>
                </div>
                <div className="min-h-0 flex-1 overflow-auto px-6 py-5">
                    {leftTab === "description" && descriptionPanel}
                    {leftTab === "solution" && solutionPanel}
                    {leftTab === "submissions" && submissionsPanel}
                </div>
            </div>

            {/* ── RIGHT: editor + console ── */}
            <div className="flex min-h-0 flex-col overflow-hidden">
                {/* language selector + reset */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-default px-4 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                        {languages.map((option) => (
                            <Button
                                key={option}
                                size="sm"
                                variant={language === option ? "primary" : "secondary"}
                                onPress={() => setLanguage(option)}
                            >
                                {t(`codingPractice.language.${option}`)}
                            </Button>
                        ))}
                    </div>
                    <Button size="sm" variant="tertiary" onPress={onResetCode}>
                        <ArrowCounterClockwiseIcon className="size-4" aria-hidden focusable="false" />
                        {t("codingPractice.resetCode")}
                    </Button>
                </div>

                {/* Monaco editor */}
                <div className="min-h-0 flex-1">
                    <Editor
                        height="100%"
                        language={MONACO_LANGUAGE[language]}
                        theme={theme === "dark" ? "vs-dark" : "light"}
                        value={code}
                        onChange={(value) => {
                            setCode(value ?? "")
                            setTouchedLanguages((prev) => new Set(prev).add(language))
                        }}
                        onMount={(editor) => {
                            editor.getDomNode()?.querySelector("textarea")?.setAttribute("spellcheck", "false")
                            editor.onDidPaste((e) => {
                                const model = editor.getModel()
                                const pastedText = model ? model.getValueInRange(e.range) : ""
                                const size = pastedText.length
                                telemetryRef.current.pasteCount += 1
                                telemetryRef.current.pasteSizeMax = Math.max(
                                    telemetryRef.current.pasteSizeMax,
                                    size
                                )
                            })
                            editor.onKeyDown(() => {
                                telemetryRef.current.keystrokeCount += 1
                            })
                            editor.onDidBlurEditorText(() => {
                                telemetryRef.current.tabBlurCount += 1
                            })
                        }}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            padding: { top: 12, bottom: 12 },
                            bracketPairColorization: { enabled: true },
                            cursorBlinking: "smooth",
                            smoothScrolling: true,
                        }}
                    />
                </div>

                {/* bottom console — Test case / Kết quả + Run/Submit bar */}
                <CodeConsole
                    className="h-[42%]"
                    ariaLabel={t("codingPractice.consoleLabel")}
                    selectedTab={consoleTab}
                    onSelectTab={(key) => setConsoleTab(key as ConsoleTab)}
                    tabs={[
                        { key: "testcase", label: t("codingPractice.tabTestcase"), content: testcaseTab },
                        { key: "result", label: t("codingPractice.tabResult"), content: resultTab },
                    ]}
                    hint={t("codingPractice.runVsSubmit")}
                    actions={(
                        <>
                            {/* "Chạy thử trên sample" cần endpoint judge-sample riêng ở BE —
                                chưa có, để disabled (console hint giải thích) thay vì âm thầm bỏ. */}
                            <Button
                                size="sm"
                                variant="secondary"
                                isDisabled
                            >
                                <PlayIcon className="size-4" aria-hidden focusable="false" />
                                {t("codingPractice.run")}
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                isPending={submitting || judging}
                                isDisabled={code.trim().length === 0}
                                onPress={onSubmit}
                            >
                                {judging ? t("codingPractice.judging") : t("codingPractice.submit")}
                            </Button>
                        </>
                    )}
                />
            </div>
        </div>
    )
}

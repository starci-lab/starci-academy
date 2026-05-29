"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"
import useSWR from "swr"
import Editor from "@monaco-editor/react"
import {
    Button,
    Card,
    CardContent,
    Chip,
    Spinner,
} from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import {
    queryCodingProblem,
    queryMyCodingSubmissions,
    mutateSubmitCodingSolution,
    CodingLanguage,
    CodingVerdict,
    type CodingProblem,
    type CodingSubmission,
} from "@/modules/api/graphql"
import {
    useJobNotificationsSocketIo,
    jobNotificationsSocketIoEventEmitter,
    PublicationEvent,
    SubscriptionEvent,
} from "@/hooks/singleton/socketio"
import { JobStatus, type JobStatusUpdatedSocketIoMessage } from "@/modules/types"

/** Props for {@link PracticeProblem}. */
export interface PracticeProblemProps {
    /** Problem slug from the route. */
    slug: string
}

/** Map a coding language to its Monaco editor language id. */
const MONACO_LANGUAGE: Record<CodingLanguage, string> = {
    [CodingLanguage.Python]: "python",
    [CodingLanguage.JavaScript]: "javascript",
    [CodingLanguage.TypeScript]: "typescript",
    [CodingLanguage.Java]: "java",
    [CodingLanguage.Cpp]: "cpp",
}

/** HeroUI Chip color per verdict (Accepted green, errors red, in-flight default). */
const VERDICT_COLOR: Record<CodingVerdict, "success" | "danger" | "warning" | "default"> = {
    [CodingVerdict.Accepted]: "success",
    [CodingVerdict.WrongAnswer]: "danger",
    [CodingVerdict.TimeLimitExceeded]: "danger",
    [CodingVerdict.MemoryLimitExceeded]: "danger",
    [CodingVerdict.RuntimeError]: "danger",
    [CodingVerdict.CompileError]: "danger",
    [CodingVerdict.InternalError]: "warning",
    [CodingVerdict.Pending]: "default",
    [CodingVerdict.Judging]: "default",
}

/** Terminal job statuses — judging has finished (success or failure). */
const isTerminalStatus = (status: JobStatus | undefined): boolean =>
    status === JobStatus.Completed || status === JobStatus.Failed

/**
 * Coding-problem detail + editor. Loads the problem (statement, samples, starter
 * code), lets the user pick a language and edit code in Monaco, submits for
 * judging, and shows the verdict in realtime by subscribing to the judging job
 * over the `job_notifications` Socket.IO channel.
 */
export const PracticeProblem = ({ slug }: PracticeProblemProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const theme = useTheme()
    // shared job-notifications socket (auto-connects on auth)
    const socket = useJobNotificationsSocketIo()

    // editor + submission UI state
    const [language, setLanguage] = useState<CodingLanguage>(CodingLanguage.Python)
    const [code, setCode] = useState<string>("")
    const [pendingJobId, setPendingJobId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    // tracks whether the user has manually edited so we don't clobber their code
    const [touchedLanguages, setTouchedLanguages] = useState<Set<CodingLanguage>>(new Set())

    // load the problem detail (statement, samples, starter code)
    const { data: problem, isLoading } = useSWR<CodingProblem | null>(
        ["coding-problem", slug],
        async () => {
            const response = await queryCodingProblem({ request: { slug } })
            return response.data?.codingProblem.data ?? null
        },
    )

    // load the user's submission history for this problem (mutate after judging)
    const { data: submissionsData, mutate: mutateSubmissions } = useSWR(
        ["my-coding-submissions", slug],
        async () => {
            const response = await queryMyCodingSubmissions({
                request: { slug, page: 1, limit: 20 },
            })
            return response.data?.myCodingSubmissions.data ?? null
        },
    )

    // starter code map (language → code) from the loaded problem
    const starterByLanguage = useMemo(() => {
        const map = new Map<CodingLanguage, string>()
        problem?.starterCodes?.forEach((starter) => map.set(starter.language, starter.code))
        return map
    }, [problem?.starterCodes])

    // available languages = those with starter code, else the full set
    const languages = useMemo<Array<CodingLanguage>>(() => {
        const withStarter = problem?.starterCodes?.map((starter) => starter.language) ?? []
        return withStarter.length > 0 ? withStarter : Object.values(CodingLanguage)
    }, [problem?.starterCodes])

    // when the problem loads, default the language to the first available one
    useEffect(() => {
        if (languages.length > 0 && !languages.includes(language)) {
            setLanguage(languages[0])
        }
    }, [languages, language])

    // seed the editor with starter code for the active language (unless edited)
    useEffect(() => {
        if (!touchedLanguages.has(language)) {
            setCode(starterByLanguage.get(language) ?? "")
        }
    }, [language, starterByLanguage, touchedLanguages])

    // latest submission drives the result panel
    const latestSubmission = useMemo<CodingSubmission | undefined>(
        () => submissionsData?.submissions[0],
        [submissionsData?.submissions],
    )

    // submit handler: persist + enqueue judging, then subscribe to the job
    const onSubmit = useCallback(async () => {
        // guard against double-submits
        setSubmitting(true)
        try {
            // create the submission + judging job on the backend
            const response = await mutateSubmitCodingSolution({
                request: { slug, language, sourceCode: code },
            })
            const jobId = response.data?.submitCodingSolution.data?.jobId
            if (!jobId) {
                return
            }
            // refetch history so the new pending row appears immediately
            await mutateSubmissions()
            // subscribe to the judging job for the realtime verdict push
            setPendingJobId(jobId)
            socket.emit(PublicationEvent.SubscribeJobNotification, {
                data: { jobId },
                locale,
            })
        } finally {
            setSubmitting(false)
        }
    }, [slug, language, code, mutateSubmissions, socket, locale])

    // listen for the judging job to finish, then refetch the verdict
    useEffect(() => {
        if (!pendingJobId) {
            return
        }
        const onMessage = (message: JobStatusUpdatedSocketIoMessage) => {
            // ignore updates for other jobs
            if (message.data?.jobId !== pendingJobId) {
                return
            }
            // once terminal, refresh history (the row now carries the verdict)
            if (isTerminalStatus(message.data?.status)) {
                void mutateSubmissions()
                setPendingJobId(null)
            }
        }
        jobNotificationsSocketIoEventEmitter.on(SubscriptionEvent.JobStatusUpdated, onMessage)
        return () => {
            jobNotificationsSocketIoEventEmitter.off(SubscriptionEvent.JobStatusUpdated, onMessage)
        }
    }, [pendingJobId, mutateSubmissions])

    // judging is in-flight while we have a pending job
    const judging = pendingJobId !== null

    if (isLoading || !problem) {
        return (
            <div className="flex justify-center py-20">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-2">
            {/* ── left: statement + samples ── */}
            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                        <h1 className="text-xl font-bold">{problem.title}</h1>
                        <Chip size="sm" variant="soft" color="default">
                            {t(`codingPractice.difficulty.${problem.difficulty}`)}
                        </Chip>
                    </div>
                    <MarkdownContent markdown={problem.statement ?? ""} />

                    {/* sample testcases */}
                    {(problem.testcases?.length ?? 0) > 0 && (
                        <div className="flex flex-col gap-3">
                            <div className="border-t border-default-200" />
                            <h2 className="font-semibold">{t("codingPractice.samples")}</h2>
                            {problem.testcases?.map((testcase, index) => (
                                <div key={testcase.id} className="rounded-medium bg-default-100 p-3">
                                    <p className="text-sm font-medium">
                                        {t("codingPractice.example")} {index + 1}
                                    </p>
                                    <pre className="mt-1 whitespace-pre-wrap text-sm">
                                        <span className="text-muted">{t("codingPractice.input")}: </span>
                                        {testcase.input}
                                    </pre>
                                    <pre className="whitespace-pre-wrap text-sm">
                                        <span className="text-muted">{t("codingPractice.output")}: </span>
                                        {testcase.expectedOutput}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── right: editor + result + history ── */}
            <div className="flex flex-col gap-4">
                <Card>
                    <CardContent className="flex flex-col gap-3">
                        {/* language selector */}
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

                        {/* code editor */}
                        <div className="overflow-hidden rounded-medium border border-default-200">
                            <Editor
                                height="420px"
                                language={MONACO_LANGUAGE[language]}
                                theme={theme.theme === "dark" ? "vs-dark" : "light"}
                                value={code}
                                onChange={(value) => {
                                    setCode(value ?? "")
                                    // mark this language touched so language switches don't reset it
                                    setTouchedLanguages((prev) => new Set(prev).add(language))
                                }}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </div>

                        {/* submit */}
                        <Button
                            variant="primary"
                            isPending={submitting || judging}
                            isDisabled={code.trim().length === 0}
                            onPress={onSubmit}
                        >
                            {judging ? t("codingPractice.judging") : t("codingPractice.submit")}
                        </Button>
                    </CardContent>
                </Card>

                {/* result panel — latest submission verdict */}
                {latestSubmission && (
                    <Card>
                        <CardContent className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold">{t("codingPractice.result")}</h2>
                                <Chip variant="soft" color={VERDICT_COLOR[latestSubmission.verdict]}>
                                    {t(`codingPractice.verdict.${latestSubmission.verdict}`)}
                                </Chip>
                            </div>
                            <p className="text-sm text-muted">
                                {t("codingPractice.passed")}: {latestSubmission.passedCount}/{latestSubmission.totalCount}
                                {latestSubmission.runtimeMs !== null && (
                                    <> · {latestSubmission.runtimeMs} ms</>
                                )}
                                {latestSubmission.memoryKb !== null && (
                                    <> · {latestSubmission.memoryKb} KB</>
                                )}
                            </p>
                            {latestSubmission.compileOutput && (
                                <pre className="whitespace-pre-wrap rounded-medium bg-danger-50 p-2 text-xs text-danger">
                                    {latestSubmission.compileOutput}
                                </pre>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* submission history */}
                {(submissionsData?.submissions.length ?? 0) > 0 && (
                    <Card>
                        <CardContent className="flex flex-col gap-2">
                            <h2 className="font-semibold">{t("codingPractice.history")}</h2>
                            <div className="flex flex-col gap-1">
                                {submissionsData?.submissions.map((submission) => (
                                    <div
                                        key={submission.id}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="text-muted">
                                            {new Date(submission.createdAt).toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Chip size="sm" variant="soft" color="default">
                                                {t(`codingPractice.language.${submission.language}`)}
                                            </Chip>
                                            <Chip size="sm" variant="soft" color={VERDICT_COLOR[submission.verdict]}>
                                                {t(`codingPractice.verdict.${submission.verdict}`)}
                                            </Chip>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

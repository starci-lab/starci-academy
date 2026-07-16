"use client"

import React, {
    useEffect,
    useMemo,
    useState,
} from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    Button,
    Card,
    CardContent,
    Chip,
    Input,
    ScrollShadow,
    TextArea,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArrowRightIcon,
    CodeIcon,
    FileArrowUpIcon,
    GithubLogoIcon,
    GraduationCapIcon,
    PaperPlaneTiltIcon,
    SparkleIcon,
    StackIcon,
} from "@phosphor-icons/react"
import { HeroBanner } from "@/components/blocks/marketing/HeroBanner"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { SelectableCardGroup } from "@/components/blocks/navigation/SelectableCardGroup"
import { Callout } from "@/components/blocks/feedback/Callout"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { useMutateIndexRagPlaygroundSwr } from "@/hooks/swr/api/graphql/mutations/useMutateIndexRagPlaygroundSwr"
import { useMutateAskRagPlaygroundSwr } from "@/hooks/swr/api/graphql/mutations/useMutateAskRagPlaygroundSwr"
import { useQueryRagPlaygroundSamplesSwr } from "@/hooks/swr/api/graphql/queries/useQueryRagPlaygroundSamplesSwr"
import { useRagPlaygroundRunStreamSocketIo } from "@/hooks/socketio/useRagPlaygroundRunStreamSocketIo"
import { RagPlaygroundSourceKind } from "@/modules/api/graphql/mutations/types/index-rag-playground"
import type { RagPlaygroundSourceChunk } from "@/modules/api/graphql/mutations/types/ask-rag-playground"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { pathConfig } from "@/resources/path"

/** One asked-and-(possibly-still-)answering turn in the local Q&A thread. */
interface PlaygroundTurn {
    /** Temp id before the ask resolves, then the server-assigned `runId`. */
    id: string
    question: string
    answerText: string
    sources: Array<RagPlaygroundSourceChunk>
    done: boolean
    asking: boolean
    errorMessage?: string
}

/** Flat chat input — the composer pill owns fill/padding; Input is just where you type. */
const FLAT_CHAT_INPUT_CLASS =
    "w-full !rounded-none border-0 !bg-transparent !p-0 !shadow-none ring-0 focus:ring-0 hover:!bg-transparent focus:!bg-transparent data-[hovered=true]:!bg-transparent data-[focused=true]:!bg-transparent"

/** Props for the {@link RagPlayground} feature. */
export type RagPlaygroundProps = WithClassNames<undefined>

/**
 * PUBLIC RAG Playground — a marketing demo: import a code sample (paste /
 * upload / sample / GitHub URL), have it indexed into an ephemeral Qdrant
 * collection, then ask questions about it, answered live (token-streamed) by
 * the teacher's self-hosted local model at $0 cost. No login required.
 *
 * Split 2-pane layout: left = code import, right = chat + citations.
 */
export const RagPlayground = ({ className }: RagPlaygroundProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const [sessionId] = useState(() =>
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    )

    // ── import ────────────────────────────────────────────────────────────
    const [kind, setKind] = useState<RagPlaygroundSourceKind>(RagPlaygroundSourceKind.Paste)
    const [pasteCode, setPasteCode] = useState("")
    const [uploadFileName, setUploadFileName] = useState<string>()
    const [uploadCode, setUploadCode] = useState("")
    const [githubUrl, setGithubUrl] = useState("")
    const [selectedSampleId, setSelectedSampleId] = useState<string>()
    const [indexed, setIndexed] = useState<{ chunkCount: number; sourceLabel?: string | null } | null>(null)
    const [importError, setImportError] = useState<string>()
    const indexMutation = useMutateIndexRagPlaygroundSwr()
    const samplesQuery = useQueryRagPlaygroundSamplesSwr()

    // Pre-select the first catalog entry once it loads, so the Sample tab stays
    // "always ready" (no forced extra click) while still reflecting a real choice.
    useEffect(() => {
        if (selectedSampleId || !samplesQuery.data || samplesQuery.data.length === 0) {
            return
        }
        setSelectedSampleId(samplesQuery.data[0].id)
    }, [samplesQuery.data, selectedSampleId])

    const KIND_TABS = useMemo(
        () => [
            {
                key: RagPlaygroundSourceKind.Paste,
                label: t("ragPlayground.import.tabs.paste"),
                icon: <CodeIcon aria-hidden focusable="false" className="size-4" />,
            },
            {
                key: RagPlaygroundSourceKind.Upload,
                label: t("ragPlayground.import.tabs.upload"),
                icon: <FileArrowUpIcon aria-hidden focusable="false" className="size-4" />,
            },
            {
                key: RagPlaygroundSourceKind.Sample,
                label: t("ragPlayground.import.tabs.sample"),
                icon: <StackIcon aria-hidden focusable="false" className="size-4" />,
            },
            {
                key: RagPlaygroundSourceKind.Github,
                label: t("ragPlayground.import.tabs.github"),
                icon: <GithubLogoIcon aria-hidden focusable="false" className="size-4" />,
            },
        ],
        [t],
    )

    const canImport = useMemo(() => {
        switch (kind) {
        case RagPlaygroundSourceKind.Paste:
            return pasteCode.trim().length > 0
        case RagPlaygroundSourceKind.Upload:
            return uploadCode.trim().length > 0
        case RagPlaygroundSourceKind.Sample:
            return selectedSampleId != null
        case RagPlaygroundSourceKind.Github:
            return githubUrl.trim().length > 0
        default:
            return false
        }
    }, [
        kind,
        pasteCode,
        uploadCode,
        githubUrl,
        selectedSampleId,
    ])

    const onFileChange = (file?: File) => {
        if (!file) {
            return
        }
        setUploadFileName(file.name)
        const reader = new FileReader()
        reader.onload = () => setUploadCode(String(reader.result ?? ""))
        reader.readAsText(file)
    }

    const onImport = async () => {
        setImportError(undefined)
        try {
            const response = await indexMutation.trigger({
                sessionId,
                kind,
                code: kind === RagPlaygroundSourceKind.Paste
                    ? pasteCode
                    : kind === RagPlaygroundSourceKind.Upload
                        ? uploadCode
                        : undefined,
                fileName: kind === RagPlaygroundSourceKind.Upload ? uploadFileName : undefined,
                githubUrl: kind === RagPlaygroundSourceKind.Github ? githubUrl.trim() : undefined,
                sampleId: kind === RagPlaygroundSourceKind.Sample ? selectedSampleId : undefined,
            })
            const payload = response.data?.indexRagPlayground
            if (payload?.success && payload.data) {
                setIndexed({
                    chunkCount: payload.data.chunkCount,
                    sourceLabel: payload.data.sourceLabel,
                })
                setTurns([])
            } else {
                setImportError(payload?.error ?? payload?.message ?? t("ragPlayground.import.genericError"))
            }
        } catch {
            setImportError(t("ragPlayground.import.genericError"))
        }
    }

    // ── chat ──────────────────────────────────────────────────────────────
    const [question, setQuestion] = useState("")
    const [turns, setTurns] = useState<Array<PlaygroundTurn>>([])
    const askMutation = useMutateAskRagPlaygroundSwr()
    const {
        state: streamState,
        subscribe,
        abort,
    } = useRagPlaygroundRunStreamSocketIo()

    useEffect(() => {
        if (!streamState.runId) {
            return
        }
        setTurns((prev) => prev.map((turn) => (
            turn.id === streamState.runId
                ? {
                    ...turn,
                    answerText: streamState.text,
                    done: streamState.done,
                    asking: false,
                    sources: streamState.sources.length > 0 ? streamState.sources : turn.sources,
                    errorMessage: streamState.errorMessage,
                }
                : turn
        )))
         
    }, [streamState])

    const busy = turns.length > 0 && !turns[turns.length - 1].done

    const onAsk = async () => {
        const trimmed = question.trim()
        if (!trimmed || !indexed || busy) {
            return
        }
        setQuestion("")
        const tempId = `pending-${Date.now()}`
        setTurns((prev) => [
            ...prev,
            {
                id: tempId,
                question: trimmed,
                answerText: "",
                sources: [],
                done: false,
                asking: true,
            },
        ])
        try {
            const response = await askMutation.trigger({ sessionId, question: trimmed })
            const payload = response.data?.askRagPlayground
            if (payload?.success && payload.data) {
                const { runId, sources } = payload.data
                setTurns((prev) => prev.map((turn) => (
                    turn.id === tempId ? { ...turn, id: runId, sources } : turn
                )))
                subscribe(runId)
            } else {
                setTurns((prev) => prev.map((turn) => (
                    turn.id === tempId
                        ? {
                            ...turn,
                            done: true,
                            asking: false,
                            errorMessage: payload?.error ?? payload?.message ?? t("ragPlayground.chat.genericError"),
                        }
                        : turn
                )))
            }
        } catch {
            setTurns((prev) => prev.map((turn) => (
                turn.id === tempId
                    ? { ...turn, done: true, asking: false, errorMessage: t("ragPlayground.chat.genericError") }
                    : turn
            )))
        }
    }

    const onStop = () => {
        const last = turns[turns.length - 1]
        if (last && !last.done) {
            abort(last.id)
        }
    }

    const onSeePlayground = () => {
        document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" })
    }

    // house rule (call-to-action funnel): the demo has to point somewhere — the
    // AI & LLM Mastery course is the outcome this free local-model demo funnels
    // toward. ONE primary CTA on the surface (the import CTA above is a distinct
    // in-page action, not a competing funnel exit).
    const onSeeCourse = () => {
        router.push(pathConfig().locale(locale).course("3-ai-llm-mastery").build())
    }

    return (
        <div className={className}>
            <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pt-8 pb-16 sm:px-6 md:gap-20 md:pb-20 md:pt-10 lg:px-8">
                {/* hero */}
                <div className="flex min-h-[calc(70dvh-4rem)] flex-col justify-center">
                    <HeroBanner
                        eyebrow={t("ragPlayground.hero.eyebrow")}
                        eyebrowIcon={<SparkleIcon aria-hidden focusable="false" className="size-3" />}
                        headline={t.rich("ragPlayground.hero.headline", {
                            accent: (chunks) => <span className="text-accent-soft-foreground">{chunks}</span>,
                        })}
                        subline={t("ragPlayground.hero.subline")}
                        primary={(
                            <Button variant="primary" size="lg" onPress={onSeePlayground}>
                                {t("ragPlayground.hero.cta")}
                                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                            </Button>
                        )}
                    />
                </div>

                {/* split 2-pane playground */}
                <div id="playground" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* left — import */}
                    <div className="flex flex-col gap-3">
                        <TabsCard
                            leftTabs={{
                                items: KIND_TABS,
                                selectedKey: kind,
                                ariaLabel: t("ragPlayground.import.tabsAria"),
                                onSelectionChange: (key) => setKind(key as RagPlaygroundSourceKind),
                            }}
                        />
                        <Card>
                            <CardContent className="flex flex-col gap-3">
                                {kind === RagPlaygroundSourceKind.Paste ? (
                                    <TextField aria-label={t("ragPlayground.import.pastePlaceholder")}>
                                        <TextArea
                                            rows={14}
                                            className="font-mono text-sm"
                                            placeholder={t("ragPlayground.import.pastePlaceholder")}
                                            value={pasteCode}
                                            onChange={(event) => setPasteCode(event.target.value)}
                                        />
                                    </TextField>
                                ) : null}

                                {kind === RagPlaygroundSourceKind.Upload ? (
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="rag-playground-upload"
                                            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-default bg-surface px-4 py-10 text-center transition-colors hover:bg-default"
                                        >
                                            <FileArrowUpIcon aria-hidden focusable="false" className="size-6 text-muted" />
                                            <Typography type="body-sm" color="muted">
                                                {uploadFileName ?? t("ragPlayground.import.uploadHint")}
                                            </Typography>
                                        </label>
                                        <input
                                            id="rag-playground-upload"
                                            type="file"
                                            accept=".ts,.tsx,.js,.jsx,.py,.go,.java,.cs,.rb,.php,.rs,.cpp,.c,.h,.md,.txt,.json,.yaml,.yml"
                                            className="hidden"
                                            onChange={(event) => onFileChange(event.target.files?.[0])}
                                        />
                                    </div>
                                ) : null}

                                {kind === RagPlaygroundSourceKind.Sample ? (
                                    <div className="flex flex-col gap-3">
                                        <Typography type="body-sm" color="muted">
                                            {t("ragPlayground.import.sampleHint")}
                                        </Typography>
                                        <AsyncContent
                                            isLoading={samplesQuery.isLoading && !samplesQuery.data}
                                            skeleton={(
                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                    {[0, 1, 2, 3].map((cell) => (
                                                        <Skeleton key={cell} className="h-[52px] w-full rounded-xl" />
                                                    ))}
                                                </div>
                                            )}
                                            error={samplesQuery.error}
                                            errorContent={{
                                                title: t("ragPlayground.import.samplePicker.loadError"),
                                                onRetry: () => void samplesQuery.mutate(),
                                                retryLabel: t("ragPlayground.import.cta"),
                                            }}
                                        >
                                            {samplesQuery.data && samplesQuery.data.length > 0 ? (
                                                <SelectableCardGroup
                                                    ariaLabel={t("ragPlayground.import.samplePicker.ariaLabel")}
                                                    items={samplesQuery.data.map((sample) => ({
                                                        value: sample.id,
                                                        label: sample.label,
                                                    }))}
                                                    value={selectedSampleId ?? samplesQuery.data[0].id}
                                                    onChange={setSelectedSampleId}
                                                    columns={2}
                                                />
                                            ) : (
                                                <EmptyContent
                                                    title={t("ragPlayground.import.samplePicker.emptyTitle")}
                                                    description={t("ragPlayground.import.samplePicker.emptyDescription")}
                                                />
                                            )}
                                        </AsyncContent>
                                    </div>
                                ) : null}

                                {kind === RagPlaygroundSourceKind.Github ? (
                                    <TextField aria-label={t("ragPlayground.import.githubPlaceholder")}>
                                        <Input
                                            placeholder={t("ragPlayground.import.githubPlaceholder")}
                                            value={githubUrl}
                                            onChange={(event) => setGithubUrl(event.target.value)}
                                        />
                                    </TextField>
                                ) : null}

                                {importError ? (
                                    <Callout
                                        status="danger"
                                        title={importError}
                                        onClose={() => setImportError(undefined)}
                                        closeAriaLabel={t("ragPlayground.import.dismissError")}
                                    />
                                ) : null}

                                <Button
                                    variant="primary"
                                    size="lg"
                                    isPending={indexMutation.isMutating}
                                    isDisabled={!canImport}
                                    onPress={() => void onImport()}
                                >
                                    {t("ragPlayground.import.cta")}
                                    <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                                </Button>

                                {indexed ? (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Chip size="sm" className="bg-success-soft text-success-soft-foreground">
                                            <Chip.Label>
                                                {t("ragPlayground.import.indexed", { count: indexed.chunkCount })}
                                            </Chip.Label>
                                        </Chip>
                                        {indexed.sourceLabel ? (
                                            <Typography type="body-xs" color="muted">
                                                {indexed.sourceLabel}
                                            </Typography>
                                        ) : null}
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    </div>

                    {/* right — chat */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <Typography type="body" weight="semibold">
                                {t("ragPlayground.chat.title")}
                            </Typography>
                            <Chip size="sm" className="bg-accent-soft text-accent-soft-foreground">
                                <SparkleIcon aria-hidden focusable="false" className="size-4" />
                                <Chip.Label>{t("ragPlayground.chat.freeBadge")}</Chip.Label>
                            </Chip>
                        </div>

                        <Card className="flex-1">
                            <CardContent className="flex h-full flex-col gap-3">
                                <ScrollShadow
                                    hideScrollBar
                                    className="flex max-h-[28rem] min-h-[16rem] flex-col gap-4 overflow-y-auto"
                                >
                                    {!indexed ? (
                                        <EmptyContent
                                            icon={<CodeIcon aria-hidden focusable="false" className="size-8 text-muted" />}
                                            title={t("ragPlayground.chat.emptyNoIndexTitle")}
                                            description={t("ragPlayground.chat.emptyNoIndexDescription")}
                                        />
                                    ) : turns.length === 0 ? (
                                        <EmptyContent
                                            icon={<SparkleIcon aria-hidden focusable="false" className="size-8 text-muted" />}
                                            title={t("ragPlayground.chat.emptyReadyTitle")}
                                            description={t("ragPlayground.chat.emptyReadyDescription")}
                                        />
                                    ) : (
                                        turns.map((turn) => (
                                            <div key={turn.id} className="flex flex-col gap-2">
                                                <div className="self-end rounded-2xl bg-accent px-4 py-2">
                                                    <Typography type="body-sm" className="text-accent-foreground">
                                                        {turn.question}
                                                    </Typography>
                                                </div>
                                                <div className="rounded-2xl border border-default bg-surface px-4 py-3">
                                                    {turn.errorMessage ? (
                                                        <Typography type="body-sm" className="text-danger-soft-foreground">
                                                            {turn.errorMessage}
                                                        </Typography>
                                                    ) : turn.answerText ? (
                                                        <MarkdownContent markdown={turn.answerText} />
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="size-2 animate-pulse rounded-full bg-muted" />
                                                            <Typography type="body-sm" color="muted">
                                                                {t("ragPlayground.chat.thinking")}
                                                            </Typography>
                                                        </div>
                                                    )}
                                                    {turn.sources.length > 0 ? (
                                                        <div className="mt-3 flex flex-col gap-1 border-t border-default pt-3">
                                                            <Typography type="body-xs" color="muted">
                                                                {t("ragPlayground.chat.sources")}
                                                            </Typography>
                                                            <SurfaceListCard bordered>
                                                                {turn.sources.map((source, index) => (
                                                                    <SurfaceListCardRow
                                                                        key={`${turn.id}-${index}`}
                                                                        title={<span className="font-mono">{source.filePath}</span>}
                                                                        subtitle={source.snippet}
                                                                    />
                                                                ))}
                                                            </SurfaceListCard>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </ScrollShadow>

                                <div className={cn(
                                    "flex flex-col gap-2 rounded-2xl bg-default px-3 py-2 focus-within:ring-2 focus-within:ring-accent",
                                    !indexed && "opacity-60",
                                )}
                                >
                                    <TextField
                                        aria-label={t("ragPlayground.chat.placeholder")}
                                        className="w-full"
                                        isDisabled={!indexed}
                                    >
                                        <Input
                                            className={FLAT_CHAT_INPUT_CLASS}
                                            placeholder={t("ragPlayground.chat.placeholder")}
                                            value={question}
                                            onChange={(event) => setQuestion(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault()
                                                    void onAsk()
                                                }
                                            }}
                                        />
                                    </TextField>
                                    <div className="flex w-full items-center justify-end gap-2">
                                        {busy ? (
                                            <Button variant="tertiary" size="sm" onPress={onStop}>
                                                {t("ragPlayground.chat.stop")}
                                            </Button>
                                        ) : null}
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="primary"
                                            isPending={askMutation.isMutating}
                                            isDisabled={!indexed || busy || !question.trim()}
                                            aria-label={t("ragPlayground.chat.send")}
                                            onPress={() => void onAsk()}
                                        >
                                            <PaperPlaneTiltIcon aria-hidden focusable="false" className="size-5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* closing course-CTA funnel — the demo has to point somewhere */}
                <Card className="mx-auto w-full max-w-3xl">
                    <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                        <GraduationCapIcon aria-hidden focusable="false" className="size-8 text-accent-soft-foreground" />
                        <Typography type="h6" weight="bold">
                            {t("ragPlayground.closingCta.title")}
                        </Typography>
                        <Typography type="body-sm" color="muted" className="max-w-lg">
                            {t("ragPlayground.closingCta.description")}
                        </Typography>
                        <Button variant="primary" size="lg" onPress={onSeeCourse}>
                            {t("ragPlayground.closingCta.cta")}
                            <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

"use client"

import React, { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import {
    Button,
    Input,
    ScrollShadow,
    Tabs,
    TextArea,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import {
    CodeIcon,
    FileArrowUpIcon,
    PaperPlaneTiltIcon,
    SparkleIcon,
    StackIcon,
} from "@phosphor-icons/react"
import { ExtendedTabs } from "@/components/blocks/navigation/ExtendedTabs"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { SelectableCardGroup } from "@/components/blocks/navigation/SelectableCardGroup"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { RagSourceGraph } from "@/components/blocks/rendering/RagSourceGraph"
import { GithubIcon } from "@/components/svg/GithubIcon"
import { RagPlaygroundSourceKind, RAG_SAMPLES } from "./source"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One retrieved source chunk backing an answer (mirrors the socket `rag:citations` shape). */
interface PlaygroundRagWorkspaceSource {
    /** File path (or synthetic label) the chunk came from. */
    filePath: string
    /** Truncated excerpt of the chunk's content. */
    snippet: string
    /** Retrieval score (0-1), when the local retriever reports one. */
    score?: number
}

/** One asked-and-(possibly-still-)answering turn in the local Q&A thread. */
interface PlaygroundTurn {
    /** The `runId` correlating this turn to its streamed `rag:answer`/`rag:citations`. */
    id: string
    question: string
    answerText: string
    sources: Array<PlaygroundRagWorkspaceSource>
    done: boolean
    asking: boolean
}

/** Which view a turn's sources section renders — the plain citation list, or a graph of question→source edges. */
type SourcesViewMode = "doc" | "graph"

/** All four import kinds — the agent now resolves sample (built-in catalog) and github (REST) too, not just inline code. */
type WorkspaceImportKind = RagPlaygroundSourceKind

/** Flat chat input — the composer pill owns fill/padding; Input is just where you type. */
const FLAT_CHAT_INPUT_CLASS =
    "w-full !rounded-none border-0 !bg-transparent !p-0 !shadow-none ring-0 focus:ring-0 hover:!bg-transparent focus:!bg-transparent data-[hovered=true]:!bg-transparent data-[focused=true]:!bg-transparent"

/** Props for the {@link PlaygroundRagWorkspace} feature. */
export interface PlaygroundRagWorkspaceProps extends WithClassNames<undefined> {
    /** Latest streamed answer chunk from the agent (`state.ragAnswer`), or `null`. */
    ragAnswer: { runId: string; text: string; done: boolean } | null
    /** Latest citations from the agent (`state.ragCitations`), or `null`. */
    ragCitations: { runId: string; sources: Array<PlaygroundRagWorkspaceSource> } | null
    /** Emit `rag:index` — ask the connected agent to index a source (the parent owns the socket). */
    sendRagIndex: (source: { kind: string; code?: string; fileName?: string; githubUrl?: string; sampleId?: string }) => void
    /** Emit `rag:ask` — ask the connected agent a question over the indexed code, correlated by `runId`. */
    sendRagAsk: (runId: string, question: string) => void
}

/**
 * Machine-backed RAG workspace — the RIGHT pane of a `kind: "rag"`
 * {@link import("@/components/features/learn/Playground/PlaygroundRagSession").PlaygroundRagSession}.
 * A chat UX (import → ask → streamed answer bubbles → citations with a per-turn
 * "Tài liệu / Sơ đồ" source toggle) that runs over the Playground BYOM socket —
 * the learner's own local Ollama, relayed by the paired CLI agent. This is the
 * app's ONLY RAG surface (the old server-side marketing demo was removed).
 *
 * Purely presentational over the socket: the parent `PlaygroundRagSession` owns
 * the `usePlaygroundByomSocketIo` hook and passes the streamed `ragAnswer` /
 * `ragCitations` down plus the `sendRagIndex` / `sendRagAsk` emitters. This
 * component holds only the local composer + turn-thread state, folding each
 * streamed chunk into the matching turn by `runId`.
 *
 * Import supports all four sources — paste / upload (inline code), a built-in
 * sample from the static {@link RAG_SAMPLES} catalog, or a public GitHub repo:
 * the agent resolves sample id → local catalog code and github URL → repo files
 * (via the GitHub REST API) before chunking + embedding.
 *
 * @param props - See {@link PlaygroundRagWorkspaceProps}.
 *
 * @see Story: .storybook/stories/features/learn/Playground/PlaygroundRagWorkspace/PlaygroundRagWorkspace.stories
 */
export const PlaygroundRagWorkspace = ({
    ragAnswer,
    ragCitations,
    sendRagIndex,
    sendRagAsk,
    className,
}: PlaygroundRagWorkspaceProps) => {
    const t = useTranslations()

    // ── import ────────────────────────────────────────────────────────────
    const [importKind, setImportKind] = useState<WorkspaceImportKind>(RagPlaygroundSourceKind.Paste)
    const [pasteCode, setPasteCode] = useState("")
    const [uploadFileName, setUploadFileName] = useState<string>()
    const [uploadCode, setUploadCode] = useState("")
    const [githubUrl, setGithubUrl] = useState("")
    // built-in catalog is a static id+label list (the agent owns the code and
    // resolves the chosen id locally on index) — pre-select the first so the
    // Sample tab is never empty.
    const [selectedSampleId, setSelectedSampleId] = useState<string>(RAG_SAMPLES[0].id)
    const [imported, setImported] = useState(false)

    // ── chat ──────────────────────────────────────────────────────────────
    const [question, setQuestion] = useState("")
    const [turns, setTurns] = useState<Array<PlaygroundTurn>>([])
    const [sourcesModeByTurn, setSourcesModeByTurn] = useState<Record<string, SourcesViewMode>>({})
    // monotonic fallback id when crypto.randomUUID is unavailable.
    const runCounterRef = useRef(0)

    const canImport = (() => {
        switch (importKind) {
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
    })()

    // a turn is still streaming while its last entry isn't done → block a new ask.
    const busy = turns.length > 0 && !turns[turns.length - 1].done

    // fold each streamed answer chunk into the matching turn (by runId).
    useEffect(() => {
        if (!ragAnswer) {
            return
        }
        setTurns((prev) => prev.map((turn) => (
            turn.id === ragAnswer.runId
                ? { ...turn, answerText: ragAnswer.text, done: ragAnswer.done, asking: false }
                : turn
        )))
    }, [ragAnswer])

    // attach citations to the matching turn (by runId).
    useEffect(() => {
        if (!ragCitations) {
            return
        }
        setTurns((prev) => prev.map((turn) => (
            turn.id === ragCitations.runId ? { ...turn, sources: ragCitations.sources } : turn
        )))
    }, [ragCitations])

    const onFileChange = (file?: File) => {
        if (!file) {
            return
        }
        setUploadFileName(file.name)
        const reader = new FileReader()
        reader.onload = () => setUploadCode(String(reader.result ?? ""))
        reader.readAsText(file)
    }

    const onImport = () => {
        if (!canImport) {
            return
        }
        switch (importKind) {
        case RagPlaygroundSourceKind.Paste:
            sendRagIndex({ kind: RagPlaygroundSourceKind.Paste, code: pasteCode })
            break
        case RagPlaygroundSourceKind.Upload:
            sendRagIndex({ kind: RagPlaygroundSourceKind.Upload, code: uploadCode, fileName: uploadFileName })
            break
        case RagPlaygroundSourceKind.Sample:
            sendRagIndex({ kind: RagPlaygroundSourceKind.Sample, sampleId: selectedSampleId })
            break
        case RagPlaygroundSourceKind.Github:
            sendRagIndex({ kind: RagPlaygroundSourceKind.Github, githubUrl: githubUrl.trim() })
            break
        }
        setImported(true)
        setTurns([])
        setSourcesModeByTurn({})
    }

    const onAsk = () => {
        const trimmed = question.trim()
        if (!trimmed || !imported || busy) {
            return
        }
        setQuestion("")
        const runId =
            typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `pending-${(runCounterRef.current += 1)}`
        setTurns((prev) => [
            ...prev,
            { id: runId, question: trimmed, answerText: "", sources: [], done: false, asking: true },
        ])
        sendRagAsk(runId, trimmed)
    }

    const IMPORT_TABS = [
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
            icon: <GithubIcon aria-hidden className="size-4" />,
        },
    ]

    return (
        <div className={cn("flex h-full flex-col", className)}>
            {/* ── import strip ── */}
            <div className="flex flex-col gap-3 border-b border-default px-4 py-3">
                <TabsCard
                    leftTabs={{
                        items: IMPORT_TABS,
                        selectedKey: importKind,
                        ariaLabel: t("ragPlayground.import.tabsAria"),
                        onSelectionChange: (key) => setImportKind(key as WorkspaceImportKind),
                    }}
                />
                {importKind === RagPlaygroundSourceKind.Paste ? (
                    <TextField aria-label={t("ragPlayground.import.pastePlaceholder")}>
                        <TextArea
                            rows={5}
                            className="font-mono text-sm"
                            placeholder={t("ragPlayground.import.pastePlaceholder")}
                            value={pasteCode}
                            onChange={(event) => setPasteCode(event.target.value)}
                        />
                    </TextField>
                ) : null}
                {importKind === RagPlaygroundSourceKind.Upload ? (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="playground-rag-workspace-upload"
                            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-default bg-surface px-4 py-6 text-center transition-colors hover:bg-default"
                        >
                            <FileArrowUpIcon aria-hidden focusable="false" className="size-6 text-muted" />
                            <Typography type="body-sm" color="muted">
                                {uploadFileName ?? t("ragPlayground.import.uploadHint")}
                            </Typography>
                        </label>
                        <input
                            id="playground-rag-workspace-upload"
                            type="file"
                            accept=".ts,.tsx,.js,.jsx,.py,.go,.java,.cs,.rb,.php,.rs,.cpp,.c,.h,.md,.txt,.json,.yaml,.yml"
                            className="hidden"
                            onChange={(event) => onFileChange(event.target.files?.[0])}
                        />
                    </div>
                ) : null}
                {importKind === RagPlaygroundSourceKind.Sample ? (
                    <div className="flex flex-col gap-2">
                        <Typography type="body-xs" color="muted">
                            {t("ragPlayground.import.sampleHint")}
                        </Typography>
                        <SelectableCardGroup
                            ariaLabel={t("ragPlayground.import.samplePicker.ariaLabel")}
                            items={RAG_SAMPLES.map((sample) => ({
                                value: sample.id,
                                label: sample.label,
                            }))}
                            value={selectedSampleId}
                            onChange={setSelectedSampleId}
                            columns={1}
                        />
                    </div>
                ) : null}
                {importKind === RagPlaygroundSourceKind.Github ? (
                    <div className="flex flex-col gap-2">
                        <Typography type="body-xs" color="muted">
                            {t("ragPlayground.import.githubHint")}
                        </Typography>
                        <TextField aria-label={t("ragPlayground.import.githubPlaceholder")}>
                            <Input
                                placeholder={t("ragPlayground.import.githubPlaceholder")}
                                value={githubUrl}
                                onChange={(event) => setGithubUrl(event.target.value)}
                            />
                        </TextField>
                    </div>
                ) : null}
                <Button
                    variant="primary"
                    size="sm"
                    isDisabled={!canImport}
                    onPress={onImport}
                >
                    {t("ragPlayground.import.cta")}
                </Button>
            </div>

            {/* ── turns thread ── */}
            <ScrollShadow
                hideScrollBar
                className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4"
            >
                {!imported ? (
                    <EmptyContent
                        icon={<CodeIcon aria-hidden focusable="false" className="size-8 text-muted" />}
                        title={t("playground.ragWorkspace.emptyNoImportTitle")}
                    />
                ) : turns.length === 0 ? (
                    <EmptyContent
                        icon={<SparkleIcon aria-hidden focusable="false" className="size-8 text-muted" />}
                        title={t("playground.ragWorkspace.emptyReadyTitle")}
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
                                {turn.answerText ? (
                                    <MarkdownContent markdown={turn.answerText} />
                                ) : !turn.done ? (
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 animate-pulse rounded-full bg-muted" />
                                        <Typography type="body-sm" color="muted">
                                            {t("ragPlayground.chat.thinking")}
                                        </Typography>
                                    </div>
                                ) : null}
                                {turn.sources.length > 0 ? (
                                    <div className="mt-3 flex flex-col gap-2 border-t border-default pt-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <Typography type="body-xs" color="muted">
                                                {t("ragPlayground.chat.sources")}
                                            </Typography>
                                            <ExtendedTabs
                                                size="sm"
                                                selectedKey={sourcesModeByTurn[turn.id] ?? "doc"}
                                                onSelectionChange={(key) => setSourcesModeByTurn((prev) => ({
                                                    ...prev,
                                                    [turn.id]: key as SourcesViewMode,
                                                }))}
                                            >
                                                <Tabs.ListContainer>
                                                    <Tabs.List aria-label={t("ragPlayground.chat.sources")}>
                                                        <Tabs.Tab id="doc">
                                                            {t("ragPlayground.chat.sourcesModeDoc")}
                                                            <Tabs.Indicator />
                                                        </Tabs.Tab>
                                                        <Tabs.Tab id="graph">
                                                            {t("ragPlayground.chat.sourcesModeGraph")}
                                                            <Tabs.Indicator />
                                                        </Tabs.Tab>
                                                    </Tabs.List>
                                                </Tabs.ListContainer>
                                            </ExtendedTabs>
                                        </div>
                                        {(sourcesModeByTurn[turn.id] ?? "doc") === "graph" ? (
                                            <RagSourceGraph question={turn.question} sources={turn.sources} />
                                        ) : (
                                            <SurfaceListCard bordered>
                                                {turn.sources.map((source, index) => (
                                                    <SurfaceListCardRow
                                                        key={`${turn.id}-${index}`}
                                                        title={<span className="font-mono">{source.filePath}</span>}
                                                        subtitle={source.snippet}
                                                    />
                                                ))}
                                            </SurfaceListCard>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))
                )}
            </ScrollShadow>

            {/* ── composer, pinned at the bottom ── */}
            <div className="border-t border-default px-4 py-3">
                <div className={cn(
                    "flex flex-col gap-2 rounded-2xl bg-default px-3 py-2 focus-within:ring-2 focus-within:ring-accent",
                    !imported && "opacity-60",
                )}
                >
                    <TextField
                        aria-label={t("ragPlayground.chat.placeholder")}
                        className="w-full"
                        isDisabled={!imported}
                    >
                        <Input
                            className={FLAT_CHAT_INPUT_CLASS}
                            placeholder={t("ragPlayground.chat.placeholder")}
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault()
                                    onAsk()
                                }
                            }}
                        />
                    </TextField>
                    <div className="flex w-full items-center justify-end gap-2">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="primary"
                            isDisabled={!imported || busy || !question.trim()}
                            aria-label={t("ragPlayground.chat.send")}
                            onPress={onAsk}
                        >
                            <PaperPlaneTiltIcon aria-hidden focusable="false" className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

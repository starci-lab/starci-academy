import { ArrowClockwiseIcon, PaperPlaneRightIcon, PlugsConnectedIcon, SparkleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ChipButtonList } from "@sb-components/composites/buttons/ChipButtonList/ChipButtonList"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Disclosure } from "@sb-components/composites/layout/Disclosure/Disclosure"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AgentTaskConsole` — the "operations assistant" tab. The expert gives the agent
 * a task in words; the agent runs ONE of their n8n workflows (or answers directly)
 * and reports back, beside the list of workflows it can use. The five phases —
 * `idle`, `running`, `result-ran-workflow`, `result-direct-answer`, `no-tools` —
 * are DATA, so they are STATES of the single shape. Grounded in the real
 * `ClawbotService.act(goal)` → `AgentRun` and `N8nToolsService.list()` → `N8nTool`.
 */

/** One n8n workflow the agent may call — a subset of the real `N8nTool`. */
export interface AgentToolView {
    /** Workflow id in n8n (`N8nTool.id`). */
    id: string
    /** Readable workflow name the expert sees (`N8nTool.description`). */
    name: string
    /** Webhook path that fires it, or null when the workflow has no Webhook trigger yet (`N8nTool.webhookPath`). */
    webhookPath?: string | null
}

/** One completed task the agent ran — a subset of the real `AgentRun`. */
export interface AgentRunView {
    /** Stable row id. */
    id: string
    /** The goal the expert gave, in words (`AgentRun.goal`). */
    goal: string
    /** The workflow the agent ran (`AgentRun.toolUsed`), or null when it answered directly. */
    toolUsed: string | null
    /** Raw workflow output — present only when a workflow ran (`AgentRun.toolOutput`). */
    toolOutput?: string | null
    /** The agent's final answer (`AgentRun.result`); empty on error. */
    result: string
    /** Error message when the run failed, or null on success (the UI's `error` field). */
    error?: string | null
}

/** Props for {@link AgentTaskConsole}. */
export interface AgentTaskConsoleProps {
    /** The goal the expert is typing — the console's only free input. */
    goal: string
    /** Fires as the goal changes. */
    onGoalChange: (value: string) => void
    /** Give the current goal to the agent — the connected layer runs `agentAct(goal)`. */
    onSubmit: () => void
    /** `true` → a task is in flight (input + submit lock, submit shows a spinner). */
    isRunning?: boolean
    /** Suggested tasks offered as one-tap chips. */
    suggestions: Array<string>
    /** Fires with a suggestion's text when its chip is tapped. */
    onSuggestion: (goal: string) => void
    /** The completed tasks, newest first. */
    runs: Array<AgentRunView>
    /** The workflows the agent can currently use — empty is the `no-tools` state. */
    tools: Array<AgentToolView>
    /** Re-read the workflow list from n8n. */
    onReloadTools: () => void
    /**
     * `true` → the block's own first fetch is in flight: the same two-region
     * shape renders the console card, a fixed count of result-shaped rows, and a
     * fixed count of tool-shaped rows, every content node shimmering (§12b). The
     * reload action drops while it loads. Threaded straight down — never a
     * separate skeleton tree, and independent of {@link isRunning}.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: AgentTaskConsoleLabels
}

/** The already-resolved copy the block renders. */
export interface AgentTaskConsoleLabels {
    /** Console card title (e.g. "Operations assistant"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Placeholder inside the goal field. */
    inputPlaceholder: string
    /** Accessible name for the goal field. */
    inputAriaLabel: string
    /** Submit button label at rest. */
    submitLabel: string
    /** Submit button label while a task runs. */
    submitRunningLabel: string
    /** Eyebrow above each result's goal (e.g. "Task"). */
    taskLabel: string
    /** Prefix before the workflow name on a "ran a workflow" result (e.g. "Ran"). */
    ranPrefix: string
    /** Chip label for a direct answer (e.g. "Answered directly"). */
    directAnswerLabel: string
    /** Chip label for a failed run (e.g. "Error"). */
    errorLabel: string
    /** Disclosure trigger for the raw workflow output. */
    rawOutputLabel: string
    /** Shown when no task has run yet. */
    emptyRunsLabel: string
    /** Tools card title (e.g. "Workflows the assistant can use"). */
    toolsTitle: string
    /** Reload-tools button label. */
    reloadLabel: string
    /** Prefix before a workflow's webhook path (e.g. "webhook"). */
    webhookPrefix: string
    /** Shown for a workflow that has no Webhook trigger yet. */
    noWebhookLabel: string
    /** Empty-tools title. */
    noToolsTitle: string
    /** Empty-tools supporting line. */
    noToolsDescription: string
}

/** Minimum goal length before Submit is offered — mirrors the real app's `goal.trim()` guard. */
const MIN_GOAL_LENGTH = 1

/** How many placeholder rows each loading mirror draws while its data hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder result rows — sized like a real run so the shimmer mirrors the loaded shape. */
const SKELETON_RUNS: Array<AgentRunView> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-run-${index}`,
    goal: "A task the assistant handled",
    toolUsed: "workflow-name",
    result: "A short summary of what the assistant did for this task.",
    error: null,
}))

/** Placeholder tool rows — sized like a real workflow so the shimmer mirrors the loaded shape. */
const SKELETON_TOOLS: Array<AgentToolView> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-tool-${index}`,
    name: "Workflow name",
    webhookPath: "webhook-path",
}))

/**
 * The operations assistant console. See the file header for why the five phases
 * are states of one shape rather than separate leaves, and how `isSkeleton`
 * mirrors the loaded shape.
 *
 * @param props - {@link AgentTaskConsoleProps}
 */
const AgentTaskConsole = ({
    goal,
    onGoalChange,
    onSubmit,
    isRunning = false,
    suggestions,
    onSuggestion,
    runs,
    tools,
    onReloadTools,
    isSkeleton = false,
    labels,
}: AgentTaskConsoleProps) => {
    const canSubmit = goal.trim().length >= MIN_GOAL_LENGTH && !isRunning && !isSkeleton

    /** Result badge: error → danger, a workflow → accent, a direct answer → neutral. */
    const statusOf = (run: AgentRunView): { tone: ChipTone; text: string } => {
        if (run.error) {
            return { tone: "danger", text: labels.errorLabel }
        }
        if (run.toolUsed) {
            return { tone: "accent", text: `${labels.ranPrefix}: ${run.toolUsed}` }
        }
        return { tone: "default", text: labels.directAnswerLabel }
    }

    /** The console card: header, goal field + submit, and the suggestion chips. */
    const ConsoleCard = () => (
        <SurfaceCard
            padding={3}
            isSkeleton={isSkeleton}
            body={() => (
                <StackV
                    gap={3}
                    isSkeleton={isSkeleton}
                    items={[
                        () => (
                            <StackH
                                gap={2}
                                isSkeleton={isSkeleton}
                                items={[
                                    () => (
                                        <SparkleIcon
                                            aria-hidden
                                            focusable="false"
                                            weight="fill"
                                            className="size-5 shrink-0 text-accent"
                                        />
                                    ),
                                    () => <Typography size="base" weight="semibold" isSkeleton={isSkeleton} text={labels.title} />,
                                ]}
                            />
                        ),
                        () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.description} />,
                        () => (
                            <StackH
                                gap={2}
                                align="end"
                                isSkeleton={isSkeleton}
                                items={[
                                    () => (
                                        <InputText
                                            variant="secondary"
                                            ariaLabel={labels.inputAriaLabel}
                                            placeholder={labels.inputPlaceholder}
                                            value={goal}
                                            onValueChange={onGoalChange}
                                            isDisabled={isRunning}
                                            isSkeleton={isSkeleton}
                                            classNames={["flex-1", "min-w-0"]}
                                        />
                                    ),
                                    () => (
                                        <Button
                                            variant="primary"
                                            prefixIcon={PaperPlaneRightIcon}
                                            label={isRunning ? labels.submitRunningLabel : labels.submitLabel}
                                            onPress={onSubmit}
                                            isDisabled={!canSubmit}
                                            isPending={isRunning}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                ]}
                            />
                        ),
                        () => (
                            <ChipButtonList
                                isSkeleton={isSkeleton}
                                items={suggestions.map((text) => ({
                                    id: text,
                                    label: text,
                                    onPress: () => onSuggestion(text),
                                    isDisabled: isRunning,
                                }))}
                            />
                        ),
                    ]}
                />
            )}
        />
    )

    /**
     * One result card — the goal, the status badge, the answer, and the optional
     * raw output. The SAME shape drives the loaded and the loading rows;
     * `isSkeleton` threads down so a loading row is the loaded row shimmering.
     */
    const RunCard = ({ run, isSkeleton: rowSkeleton }: { run: AgentRunView; isSkeleton: boolean }) => {
        const status = statusOf(run)
        return (
            <SurfaceCard
                variant="nested"
                padding={3}
                isSkeleton={rowSkeleton}
                body={() => (
                    <StackV
                        gap={2}
                        isSkeleton={rowSkeleton}
                        items={[
                            () => <Typography size="xs" color="muted" isSkeleton={rowSkeleton} text={labels.taskLabel} />,
                            () => <Typography size="sm" weight="semibold" isSkeleton={rowSkeleton} text={run.goal} />,
                            () => <Chip tone={status.tone} isSkeleton={rowSkeleton} text={status.text} />,
                            () => (
                                <Typography
                                    size="sm"
                                    color={run.error ? "danger" : "default"}
                                    preserveWhitespace
                                    isSkeleton={rowSkeleton}
                                    text={run.error ?? run.result}
                                />
                            ),
                            ...(run.toolOutput
                                ? [
                                    () => (
                                        <Disclosure
                                            title={labels.rawOutputLabel}
                                            isSkeleton={rowSkeleton}
                                            body={() => (
                                                <SurfaceCard
                                                    variant="nested"
                                                    padding={3}
                                                    isSkeleton={rowSkeleton}
                                                    body={() => (
                                                        <Typography
                                                            size="xs"
                                                            color="muted"
                                                            preserveWhitespace
                                                            isSkeleton={rowSkeleton}
                                                            text={run.toolOutput ?? ""}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    ),
                                ]
                                : []),
                        ]}
                    />
                )}
            />
        )
    }

    /** The console column: the card, then the results (or an empty note). While loading, a fixed count of result-shaped rows. */
    const runRows = isSkeleton ? SKELETON_RUNS : runs
    const ConsoleColumn = () => (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                () => <ConsoleCard />,
                ...(!isSkeleton && runs.length === 0
                    ? [() => <Typography size="sm" color="muted" text={labels.emptyRunsLabel} />]
                    : runRows.map((run) => () => <RunCard run={run} isSkeleton={isSkeleton} />)),
            ]}
        />
    )

    /** The tools column: available workflows (name + webhook) with a reload action. While loading, a fixed count of tool-shaped rows and no reload action. */
    const toolRows = isSkeleton ? SKELETON_TOOLS : tools
    const ToolsColumn = () => (
        <SurfaceCard
            padding={3}
            label={labels.toolsTitle}
            isSkeleton={isSkeleton}
            action={isSkeleton
                ? undefined
                : () => (
                    <Button
                        variant="secondary"
                        size="sm"
                        prefixIcon={ArrowClockwiseIcon}
                        label={labels.reloadLabel}
                        onPress={onReloadTools}
                    />
                )}
            body={() =>
                !isSkeleton && tools.length === 0 ? (
                    <EmptyState
                        icon={PlugsConnectedIcon}
                        title={labels.noToolsTitle}
                        description={labels.noToolsDescription}
                    />
                ) : (
                    <StackV
                        gap={2}
                        isSkeleton={isSkeleton}
                        items={toolRows.map((tool) => () => (
                            <SurfaceCard
                                variant="nested"
                                padding={3}
                                isSkeleton={isSkeleton}
                                body={() => (
                                    <StackV
                                        gap={1}
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={tool.name} />,
                                            () => (
                                                <Typography
                                                    size="xs"
                                                    color="muted"
                                                    isSkeleton={isSkeleton}
                                                    text={
                                                        tool.webhookPath
                                                            ? `${labels.webhookPrefix}: ${tool.webhookPath}`
                                                            : labels.noWebhookLabel
                                                    }
                                                />
                                            ),
                                        ]}
                                    />
                                )}
                            />
                        ))}
                    />
                )
            }
        />
    )

    // Two regions — the console and the tools list — stacked as ONE column. The
    // block owns WHICH regions exist and their data; a page decides whether to sit
    // them side by side (blocks take no `className`, so placement is the page's call).
    return (
        <div data-tier="block" data-component="AgentTaskConsole">
            <StackV
                gap={4}
                isSkeleton={isSkeleton}
                items={[() => <ConsoleColumn />, () => <ToolsColumn />]}
            />
        </div>
    )
}

export { AgentTaskConsole }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AgentTaskConsole" } as const

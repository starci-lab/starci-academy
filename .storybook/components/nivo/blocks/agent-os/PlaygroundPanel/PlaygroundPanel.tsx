import { ChatCircleIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PlaygroundPanel` — the Agent OS pod's "Playground" tab: a chat-test panel
 * to try an agent's replies before it goes live. Two DATA states of the
 * single shape: `empty` (no turns sent yet) and `with-turns`. A BASIC
 * stub-section shell — sending a message is real, agent picking and
 * transcript history are deferred to a later pass.
 */

/** Who sent one playground turn. */
export type PlaygroundTurnRoleKey = "user" | "agent"

/** One message turn in the test conversation. */
export interface PlaygroundTurn {
    /** Turn id. */
    id: string
    /** Who sent it — drives alignment + tone (mirrors `TicketThread`'s bubble convention). */
    role: PlaygroundTurnRoleKey
    /** Message body. */
    body: string
}

/** Props for {@link PlaygroundPanel}. */
export interface PlaygroundPanelProps {
    /** Already-resolved caption naming which agent is under test (e.g. "Testing — Sales · Mai"). */
    agentLabel: string
    /** The test conversation, oldest first. */
    turns: Array<PlaygroundTurn>
    /** The composer's current text. */
    composerValue: string
    /** Fires as the composer changes. */
    onComposerChange: (value: string) => void
    /** Send the test message — the connected layer runs the agent and appends its reply. */
    onSend: () => void
    /** `true` → a reply is in flight (send button busy, composer locks). */
    isSending?: boolean
    /**
     * `true` → the panel's own first fetch is in flight (loading which agent is
     * under test): the caption and composer shimmer, and send is dropped.
     * Threaded straight down — never fed to a separate skeleton tree.
     * Independent from {@link isSending}, which is a live in-flight reply on an
     * already-loaded panel.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: PlaygroundPanelLabels
}

/** The already-resolved copy the block renders. */
export interface PlaygroundPanelLabels {
    /** Card title (e.g. "Playground"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** The two turn-author labels, keyed by role (e.g. "You" / "Agent"). */
    roleOptions: Record<PlaygroundTurnRoleKey, string>
    /** Placeholder in the composer. */
    composerPlaceholder: string
    /** Send-button label. */
    sendLabel: string
    /** Accessible name for the composer field. */
    composerAriaLabel: string
    /** Empty-state title, shown before the first turn is sent. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** How many placeholder turns the loading mirror draws while the panel hasn't landed yet. */
const SKELETON_TURN_COUNT = 2

/** Placeholder turns — mixed roles so the shimmer mirrors the aligned loaded conversation. */
const SKELETON_TURNS: Array<PlaygroundTurn> = Array.from({ length: SKELETON_TURN_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    role: index === 1 ? "agent" : "user",
    body: "Playground message placeholder text.",
}))

/**
 * One turn bubble — aligned by role (the tester's on the end, the agent's on
 * the start). The SAME shape drives the loaded and the loading bubbles;
 * `isSkeleton` threads down so a loading bubble is the loaded bubble with its
 * content nodes shimmering.
 */
const TurnBubble = ({ turn, labels, isSkeleton }: {
    turn: PlaygroundTurn
    labels: PlaygroundPanelLabels
    isSkeleton: boolean
}) => (
    <StackH
        gap={3}
        principle="flex-action"
        justify={turn.role === "user" ? "end" : "start"}
        isSkeleton={isSkeleton}
        items={[
            () => (
                <SurfaceCard
                    variant="nested"
                    padding={3}
                    isSkeleton={isSkeleton}
                    body={() => (
                        <StackV
                            gap={1}
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <Typography
                                        size="xs"
                                        weight="medium"
                                        color={turn.role === "user" ? "accent" : "muted"}
                                        isSkeleton={isSkeleton}
                                        text={labels.roleOptions[turn.role]}
                                    />
                                ),
                                () => <Typography size="sm" preserveWhitespace isSkeleton={isSkeleton} text={turn.body} />,
                            ]}
                        />
                    )}
                />
            ),
        ]}
    />
)

/**
 * The agent-test playground panel. See the file header for why empty vs
 * with-turns are states of one shape rather than separate leaves, and how
 * `isSkeleton` mirrors the loaded conversation.
 *
 * @param props - {@link PlaygroundPanelProps}
 */
const PlaygroundPanel = ({
    agentLabel,
    turns,
    composerValue,
    onComposerChange,
    onSend,
    isSending = false,
    isSkeleton = false,
    labels,
}: PlaygroundPanelProps) => {
    const canSend = composerValue.trim().length > 0
    const bubbles = isSkeleton ? SKELETON_TURNS : turns

    return (
        <div data-tier="block" data-component="PlaygroundPanel">
            <SurfaceCard
                padding={3}
                label={labels.title}
                description={labels.description}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        gap={4}
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={agentLabel} />,
                            () =>
                                !isSkeleton && turns.length === 0 ? (
                                    <EmptyState
                                        icon={ChatCircleIcon}
                                        title={labels.emptyTitle}
                                        description={labels.emptyDescription}
                                    />
                                ) : (
                                    <StackV
                                        gap={3}
                                        isSkeleton={isSkeleton}
                                        items={bubbles.map((turn) => () => (
                                            <TurnBubble turn={turn} labels={labels} isSkeleton={isSkeleton} />
                                        ))}
                                    />
                                ),
                            () => (
                                <StackV
                                    gap={2}
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => (
                                            <InputTextarea
                                                variant="secondary"
                                                ariaLabel={labels.composerAriaLabel}
                                                placeholder={labels.composerPlaceholder}
                                                rows={2}
                                                isSkeleton={isSkeleton}
                                                value={composerValue}
                                                onValueChange={onComposerChange}
                                                isDisabled={isSending}
                                            />
                                        ),
                                        () => (
                                            <Button
                                                variant="primary"
                                                prefixIcon={PaperPlaneTiltIcon}
                                                label={labels.sendLabel}
                                                isSkeleton={isSkeleton}
                                                onPress={isSkeleton ? undefined : onSend}
                                                isDisabled={!canSend}
                                                isPending={isSending}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { PlaygroundPanel }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "PlaygroundPanel" } as const

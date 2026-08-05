import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ChoiceSwitch, InputText, InputTextarea } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ChipGroup } from "@sb-components/composites/chips/ChipGroup/ChipGroup"
import { KeyValueList } from "@sb-components/composites/data/KeyValue/KeyValue"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AgentDetailDrawer` — overlay drawer over one Agent OS agent: read-only
 * model/channels, an active/paused switch, then editable persona name +
 * system prompt, then the tools it may call and the knowledge sources it may
 * cite. `status` moved out of the read-only `KeyValueList` into its own
 * switch row on 2026-08-05 — `KeyValueList`'s own contract keeps `value` a
 * plain `string` (never a control), so a toggleable field cannot live inside
 * it (see that composite's own file header).
 */

/** A channel an agent can be wired to. */
export type AgentOsChannelKind = "zalo" | "telegram" | "whatsapp"

/** Whether the agent is currently answering messages. */
export type AgentDetailStatusKey = "active" | "paused"

/** Props for {@link AgentDetailDrawer}. */
export interface AgentDetailDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** Persona name (controlled) — the drawer's own title. */
    personaName: string
    /** Fires as the persona-name field changes. */
    onPersonaNameChange: (value: string) => void
    /** The model driving this agent (read-only here — model choice is a Models-section concern). */
    model: string
    /** Whether the agent is currently answering messages. */
    status: AgentDetailStatusKey
    /** Fires with the next status when the switch is pressed (`true` = active). */
    onToggleStatus: (active: boolean) => void
    /** `true` → the status toggle mutation is in flight (switch busy/disabled). */
    isTogglingStatus?: boolean
    /** Channels this agent answers on (read-only here — wiring a channel is a Channels-section concern). */
    channels: ReadonlyArray<AgentOsChannelKind>
    /** System prompt (controlled). */
    systemPrompt: string
    /** Fires as the system-prompt field changes. */
    onSystemPromptChange: (value: string) => void
    /** Tool names this agent may call. */
    tools: ReadonlyArray<string>
    /** Knowledge-source names this agent may cite. */
    knowledgeSources: ReadonlyArray<string>
    /** Save the edited persona + prompt. */
    onSave: () => void
    /** Discard edits and close. */
    onCancel: () => void
    /** `true` → the save mutation is in flight (save button busy, fields lock). */
    isSaving?: boolean
    /**
     * `true` → the drawer's own first fetch is in flight: the title, the
     * read-only meta pairs, both fields, and both chip rows all shimmer.
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: AgentDetailDrawerLabels
}

/** The already-resolved copy the drawer renders. */
export interface AgentDetailDrawerLabels {
    /** The two status labels, keyed by status. */
    statusOptions: Record<AgentDetailStatusKey, string>
    /** The three channel labels, keyed by channel. */
    channelOptions: Record<AgentOsChannelKind, string>
    /** Label of the read-only "model" meta row. */
    modelLabel: string
    /** Label of the read-only "status" meta row. */
    statusLabel: string
    /** Label of the read-only "channels" meta row. */
    channelsLabel: string
    /** Label above the persona-name field. */
    personaFieldLabel: string
    /** Label above the system-prompt field. */
    promptFieldLabel: string
    /** Heading above the tools chip row. */
    toolsLabel: string
    /** Heading above the knowledge-sources chip row. */
    knowledgeLabel: string
    /** Cancel button label. */
    cancelLabel: string
    /** Save button label. */
    saveLabel: string
}

/**
 * The agent-detail drawer. See the file header for the read-only-then-editable
 * layout and why `isSkeleton` reaches every region.
 *
 * @param props - {@link AgentDetailDrawerProps}
 */
const AgentDetailDrawer = ({
    isOpen,
    onOpenChange,
    personaName,
    onPersonaNameChange,
    model,
    status,
    onToggleStatus,
    isTogglingStatus = false,
    channels,
    systemPrompt,
    onSystemPromptChange,
    tools,
    knowledgeSources,
    onSave,
    onCancel,
    isSaving = false,
    isSkeleton = false,
    labels,
}: AgentDetailDrawerProps) => (
    <DrawerShell
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="right"
        title={personaName}
        isSkeleton={isSkeleton}
        body={({ isSkeleton }: SkeletonProps) => (
            <StackV
                gap={6}
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <KeyValueList
                            isSkeleton={isSkeleton}
                            items={[
                                { key: "model", label: labels.modelLabel, value: model },
                                { key: "channels", label: labels.channelsLabel, value: channels.map((channel) => labels.channelOptions[channel]).join(", ") },
                            ]}
                        />
                    ),
                    () => (
                        <StackH
                            align="center"
                            justify="between"
                            gap={3}
                            isSkeleton={isSkeleton}
                            items={[
                                () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.statusLabel} />,
                                () => (
                                    <ChoiceSwitch
                                        isSelected={status === "active"}
                                        onValueChange={(next) => onToggleStatus(next)}
                                        isDisabled={isSkeleton || isTogglingStatus}
                                        isSkeleton={isSkeleton}
                                        label={labels.statusOptions[status]}
                                    />
                                ),
                            ]}
                        />
                    ),
                    () => (
                        <InputText
                            label={labels.personaFieldLabel}
                            value={personaName}
                            onValueChange={onPersonaNameChange}
                            isDisabled={isSaving}
                            isSkeleton={isSkeleton}
                        />
                    ),
                    () => (
                        <InputTextarea
                            label={labels.promptFieldLabel}
                            value={systemPrompt}
                            onValueChange={onSystemPromptChange}
                            rows={5}
                            isDisabled={isSaving}
                            isSkeleton={isSkeleton}
                        />
                    ),
                    () => (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={[
                                () => <Typography size="xs" weight="medium" color="muted" isSkeleton={isSkeleton} text={labels.toolsLabel} />,
                                () => <ChipGroup items={tools.map((tool) => ({ key: tool, text: tool }))} isSkeleton={isSkeleton} />,
                            ]}
                        />
                    ),
                    () => (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={[
                                () => <Typography size="xs" weight="medium" color="muted" isSkeleton={isSkeleton} text={labels.knowledgeLabel} />,
                                () => <ChipGroup items={knowledgeSources.map((source) => ({ key: source, text: source }))} isSkeleton={isSkeleton} />,
                            ]}
                        />
                    ),
                ]}
            />
        )}
        footer={() => (
            <>
                <Button variant="ghost" label={labels.cancelLabel} onPress={onCancel} isDisabled={isSaving} />
                <Button variant="primary" label={labels.saveLabel} onPress={onSave} isPending={isSaving} />
            </>
        )}
    />
)

export { AgentDetailDrawer }

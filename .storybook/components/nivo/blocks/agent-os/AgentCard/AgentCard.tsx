import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ChipGroup } from "@sb-components/composites/chips/ChipGroup/ChipGroup"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AgentCard` — one Agent OS agent, tappable into its `AgentDetailDrawer`:
 * persona name + model, its connected channels as a chip row, and a status
 * line. Two DATA states of `status` (`active` / `paused`), plus the
 * co-located `isSkeleton` loading mirror.
 */

/** A channel an agent can be wired to. Mirrors the platforms Agent OS connects (Zalo/Telegram/WhatsApp). */
export type AgentOsChannelKind = "zalo" | "telegram" | "whatsapp"

/** Whether the agent is currently answering messages. */
export type AgentCardStatusKey = "active" | "paused"

/** Props for {@link AgentCard}. */
export interface AgentCardProps {
    /** Persona name (e.g. "Sales — Mai"). */
    name: string
    /** The model driving this agent (e.g. "GPT-4o mini"). */
    model: string
    /** Channels this agent answers on. Empty → the chip row renders no chips. */
    channels: ReadonlyArray<AgentOsChannelKind>
    /** Whether the agent is currently answering messages. */
    status: AgentCardStatusKey
    /** Opens this agent's {@link AgentDetailDrawer}. */
    onOpen: () => void
    /**
     * `true` → the card's own first fetch is in flight: name, model, one
     * placeholder channel chip, and the status line all shimmer, and the press
     * is dropped (there is no id to open yet). Threaded straight down — never
     * fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: AgentCardLabels
}

/** The already-resolved copy the card renders. */
export interface AgentCardLabels {
    /** The two status labels, keyed by status. */
    statusOptions: Record<AgentCardStatusKey, string>
    /** The three channel labels, keyed by channel. */
    channelOptions: Record<AgentOsChannelKind, string>
    /** Accessible name for the whole-card press target (e.g. "Open agent"). */
    openAriaLabel: string
}

/** Status → the dot color riding on the neutral status `Chip` (`Chip`'s own `dotClassName` leaf). */
const STATUS_DOT_CLASS: Record<AgentCardStatusKey, string> = {
    active: "text-success",
    paused: "text-muted",
}

/** One placeholder channel while `isSkeleton` — enough for the chip row to hold its shape. */
const SKELETON_CHANNELS: ReadonlyArray<AgentOsChannelKind> = ["zalo"]

/**
 * The agent card. See the file header for why active/paused are DATA states of
 * one shape, and how `isSkeleton` mirrors the loaded card.
 *
 * @param props - {@link AgentCardProps}
 */
const AgentCard = ({ name, model, channels, status, onOpen, isSkeleton = false, labels }: AgentCardProps) => {
    const shownChannels = isSkeleton ? SKELETON_CHANNELS : channels
    return (
        <div data-tier="block" data-component="AgentCard">
            <SurfaceCard
                padding={3}
                isSkeleton={isSkeleton}
                {...(!isSkeleton ? { onPress: onOpen, ariaLabel: `${labels.openAriaLabel}: ${name}` } : {})}
                body={() => (
                    <StackV
                        gap={4}
                        principle="label-field"
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    principle="identity"
                                    align="center"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <Avatar name={name} seed={name} size="md" isSkeleton={isSkeleton} />,
                                        () => (
                                            <StackV
                                                gap={1}
                                                classNames={["min-w-0"]}
                                                isSkeleton={isSkeleton}
                                                items={[
                                                    () => <Typography size="sm" weight="medium" truncate isSkeleton={isSkeleton} text={name} />,
                                                    () => <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} text={model} />,
                                                ]}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                            () => (
                                <ChipGroup
                                    items={shownChannels.map((channel) => ({ key: channel, text: labels.channelOptions[channel] }))}
                                    isSkeleton={isSkeleton}
                                />
                            ),
                            () => (
                                <Chip
                                    tone="default"
                                    dotClassName={STATUS_DOT_CLASS[status]}
                                    isSkeleton={isSkeleton}
                                    text={labels.statusOptions[status]}
                                />
                            ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { AgentCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AgentCard" } as const

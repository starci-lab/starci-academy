import type { ComponentType, SVGProps } from "react"
import { ChatCircleIcon, LinkSimpleIcon, PlugsIcon, TelegramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react"
import type { AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ChannelList` — the pod's connected platforms with a "connect a channel"
 * trigger. Two DATA states of the single shape: `empty` and `with-rows`; a
 * failed channel's trailing action swaps from "view" to "reconnect".
 */

/** A channel Agent OS can connect to. */
export type AgentOsChannelKind = "zalo" | "telegram" | "whatsapp"

/** Connection health of one channel. */
export type ChannelStatusKey = "connected" | "disconnected" | "error"

/** One connected (or failed) channel. */
export interface ChannelListItem {
    /** Stable id. */
    id: string
    /** Which platform. */
    kind: AgentOsChannelKind
    /** Display name (e.g. "Zalo OA — Nivo Sales"). */
    name: string
    /** Connection health — drives the row's tone and trailing action. */
    status: ChannelStatusKey
}

/** Props for {@link ChannelList}. */
export interface ChannelListProps {
    /** Connected channels, in reading order. */
    channels: ReadonlyArray<ChannelListItem>
    /** Open a healthy channel's inbox. */
    onViewChannel: (channelId: string) => void
    /** Re-authenticate a channel whose token failed. */
    onReconnectChannel: (channelId: string) => void
    /** Open the {@link ConnectChannelModal} flow. */
    onConnectNew: () => void
    /**
     * `true` → the list's own first fetch is in flight: the same titled card
     * renders a fixed count of channel-shaped rows with every content node
     * shimmering, and the header connect trigger and per-row actions are
     * dropped. Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ChannelListLabels
}

/** The already-resolved copy the list renders. */
export interface ChannelListLabels {
    /** Card title (e.g. "Connected channels"). */
    title: string
    /** Header "connect a channel" button label. */
    connectLabel: string
    /** The three channel labels, keyed by channel. */
    channelOptions: Record<AgentOsChannelKind, string>
    /** The three status labels, keyed by status. */
    statusOptions: Record<ChannelStatusKey, string>
    /** Trailing action label on a healthy row (e.g. "View conversations"). */
    viewLabel: string
    /** Trailing action label on an `error` row (e.g. "Reconnect"). */
    reconnectLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Channel → its glyph. */
const CHANNEL_ICON: Record<AgentOsChannelKind, ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>> = {
    zalo: ChatCircleIcon,
    telegram: TelegramLogoIcon,
    whatsapp: WhatsappLogoIcon,
}

/** Status → the tile tone, and the muted/danger text color for its status line. */
const STATUS_TONE: Record<ChannelStatusKey, AlertStatus> = {
    connected: "success",
    disconnected: "default",
    error: "danger",
}

/** How many placeholder rows the loading mirror draws while `channels` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_CHANNELS: ReadonlyArray<ChannelListItem> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    kind: "zalo",
    name: "Channel name",
    status: "connected",
}))

/**
 * One channel row — icon tile, name + status line, and a trailing action that
 * depends on the channel's own status. The SAME shape drives the loaded and
 * loading rows; `isSkeleton` threads down so a loading row is the loaded row
 * with its content nodes shimmering and the trailing action dropped (there is
 * no id to act on yet).
 */
const ChannelRow = ({ channel, onView, onReconnect, labels, isSkeleton }: {
    channel: ChannelListItem
    onView: () => void
    onReconnect: () => void
    labels: ChannelListLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        body={() => (
            <StackH
                gap={3}
                align="center"
                justify="between"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <StackH
                            gap={3}
                            align="center"
                            classNames={["min-w-0"]}
                            isSkeleton={isSkeleton}
                            items={[
                                () => <IconTile icon={CHANNEL_ICON[channel.kind]} tone={STATUS_TONE[channel.status]} size="sm" isSkeleton={isSkeleton} />,
                                () => (
                                    <StackV
                                        gap={1}
                                        classNames={["min-w-0"]}
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => <Typography size="sm" weight="medium" truncate isSkeleton={isSkeleton} text={channel.name} />,
                                            () => (
                                                <Typography
                                                    size="xs"
                                                    color={channel.status === "error" ? "danger" : "muted"}
                                                    truncate
                                                    isSkeleton={isSkeleton}
                                                    text={labels.statusOptions[channel.status]}
                                                />
                                            ),
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    ),
                    ...(!isSkeleton
                        ? [() => (
                            channel.status === "error" ? (
                                <Button variant="ghost" size="sm" label={labels.reconnectLabel} onPress={onReconnect} />
                            ) : (
                                <Button variant="ghost" size="sm" label={labels.viewLabel} onPress={onView} />
                            )
                        )]
                        : []),
                ]}
            />
        )}
    />
)

/**
 * The channel list. See the file header for why empty vs with-rows are states
 * of one shape rather than separate leaves, and how `isSkeleton` mirrors the
 * loaded rows.
 *
 * @param props - {@link ChannelListProps}
 */
const ChannelList = ({ channels, onViewChannel, onReconnectChannel, onConnectNew, isSkeleton = false, labels }: ChannelListProps) => {
    const rows = isSkeleton ? SKELETON_CHANNELS : channels
    return (
        <div data-tier="block" data-component="ChannelList">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                action={isSkeleton ? undefined : () => (
                    <Button variant="secondary" size="sm" prefixIcon={LinkSimpleIcon} label={labels.connectLabel} onPress={onConnectNew} />
                )}
                body={() =>
                    !isSkeleton && channels.length === 0 ? (
                        <EmptyState icon={PlugsIcon} title={labels.emptyTitle} description={labels.emptyDescription} />
                    ) : (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={rows.map((channel) => () => (
                                <ChannelRow
                                    channel={channel}
                                    onView={() => onViewChannel(channel.id)}
                                    onReconnect={() => onReconnectChannel(channel.id)}
                                    labels={labels}
                                    isSkeleton={isSkeleton}
                                />
                            ))}
                        />
                    )
                }
            />
        </div>
    )
}

export { ChannelList }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ChannelList" } as const

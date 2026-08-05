import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText } from "@sb-components/atoms/forms"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { ChoiceRadioGroup } from "@sb-components/composites/form/ChoiceRadioGroup/ChoiceRadioGroup"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ConnectChannelModal` — overlay modal that starts wiring a new channel into
 * the pod: pick the platform, name the connection, then hand off to that
 * platform's own OAuth screen. Never collects a credential itself.
 */

/** A channel Agent OS can connect to. */
export type AgentOsChannelKind = "zalo" | "telegram" | "whatsapp"

/** Props for {@link ConnectChannelModal}. */
export interface ConnectChannelModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** Currently chosen platform (controlled). */
    selectedChannel: AgentOsChannelKind
    /** Fires with the newly chosen platform. */
    onSelectedChannelChange: (channel: AgentOsChannelKind) => void
    /** Display name for the connection being created (controlled). */
    displayName: string
    /** Fires as the display-name field changes. */
    onDisplayNameChange: (value: string) => void
    /** Start the platform's OAuth hand-off. The connected layer navigates there. */
    onConnect: () => void
    /** `true` → the hand-off is starting (connect button busy, fields lock). */
    isConnecting?: boolean
    /**
     * `true` → the modal's own first fetch (e.g. resolving which platforms this
     * tier still allows) is in flight: the picker, the field, and the notice
     * all shimmer. Threaded straight down — never fed to a separate skeleton
     * tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ConnectChannelModalLabels
}

/** The already-resolved copy the modal renders. */
export interface ConnectChannelModalLabels {
    /** Modal title. */
    title: string
    /** Heading above the channel picker. */
    channelFieldLabel: string
    /** The three channel labels, keyed by channel. */
    channelOptions: Record<AgentOsChannelKind, string>
    /** Label above the display-name field. */
    displayNameFieldLabel: string
    /** Placeholder in the display-name field. */
    displayNamePlaceholder: string
    /** Short heading on the OAuth notice. */
    oauthNoticeTitle: string
    /** Full OAuth hand-off explanation. */
    oauthNotice: string
    /** Cancel button label. */
    cancelLabel: string
    /** Connect button label. */
    connectLabel: string
}

/** Fixed channel order for the picker — matches the platforms Agent OS supports. */
const CHANNEL_ORDER: ReadonlyArray<AgentOsChannelKind> = ["zalo", "telegram", "whatsapp"]

/**
 * The connect-channel modal. See the file header for the pick → name → hand-off
 * flow and why this modal never touches a credential itself.
 *
 * @param props - {@link ConnectChannelModalProps}
 */
const ConnectChannelModal = ({
    isOpen,
    onOpenChange,
    selectedChannel,
    onSelectedChannelChange,
    displayName,
    onDisplayNameChange,
    onConnect,
    isConnecting = false,
    isSkeleton = false,
    labels,
}: ConnectChannelModalProps) => (
    <ModalShell
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={labels.title}
        size="md"
        isSkeleton={isSkeleton}
        body={({ isSkeleton }: SkeletonProps) => (
            <StackV
                gap={6}
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <ChoiceRadioGroup
                            groupLabel={labels.channelFieldLabel}
                            value={selectedChannel}
                            onValueChange={(value) => onSelectedChannelChange(value as AgentOsChannelKind)}
                            options={CHANNEL_ORDER.map((channel) => ({ value: channel, label: labels.channelOptions[channel] }))}
                            isDisabled={isConnecting}
                            isSkeleton={isSkeleton}
                        />
                    ),
                    () => (
                        <InputText
                            label={labels.displayNameFieldLabel}
                            placeholder={labels.displayNamePlaceholder}
                            value={displayName}
                            onValueChange={onDisplayNameChange}
                            isDisabled={isConnecting}
                            isSkeleton={isSkeleton}
                        />
                    ),
                    () => <Callout status="info" title={labels.oauthNoticeTitle} description={labels.oauthNotice} isSkeleton={isSkeleton} />,
                ]}
            />
        )}
        footer={() => (
            <>
                <Button variant="ghost" label={labels.cancelLabel} onPress={() => onOpenChange(false)} isDisabled={isConnecting} />
                <Button variant="primary" label={labels.connectLabel} onPress={onConnect} isPending={isConnecting} isDisabled={displayName.trim().length === 0} />
            </>
        )}
    />
)

export { ConnectChannelModal }

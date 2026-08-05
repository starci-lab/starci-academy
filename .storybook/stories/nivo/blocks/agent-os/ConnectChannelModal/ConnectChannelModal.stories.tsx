import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    ConnectChannelModal,
    type ConnectChannelModalLabels,
    type AgentOsChannelKind,
} from "@sb-components/nivo/blocks/agent-os/ConnectChannelModal/ConnectChannelModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ConnectChannelModal` — overlay modal that starts wiring a new channel into
 * the pod: pick the platform, name the connection, then hand off to that
 * platform's own OAuth screen. Never collects a credential itself.
 */
const meta: Meta<typeof ConnectChannelModal> = {
    title: "Nivo/Blocks/AgentOs/ConnectChannelModal/ConnectChannelModal",
    component: ConnectChannelModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ConnectChannelModal>

const LABELS: ConnectChannelModalLabels = {
    title: "Connect a new channel",
    channelFieldLabel: "Choose a platform",
    channelOptions: { zalo: "Zalo OA", telegram: "Telegram", whatsapp: "WhatsApp" },
    displayNameFieldLabel: "Connection display name",
    displayNamePlaceholder: "e.g. Zalo OA — Nivo Accounting",
    oauthNoticeTitle: "You'll be redirected to authorize",
    oauthNotice: "You'll be sent to the platform's own authorization screen — Agent OS only ever reads and sends messages through the connection you approve there.",
    cancelLabel: "Cancel",
    connectLabel: "Continue to authorize",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    ChoiceRadioGroup: { tier: "composite", role: "the platform picker (Zalo / Telegram / WhatsApp)" },
    InputText: { tier: "atom", role: "the connection's display name" },
    Callout: { tier: "composite", role: "the OAuth hand-off notice — this modal never touches a credential itself" },
    Button: { tier: "atom", role: "cancel (ghost) and continue-to-authorize (primary, busy while starting, disabled with no name)" },
}

/** Shared controlled wrapper — one `isOpen`/picker/field state feeds every leaf state below. */
const ControlledConnectChannelModal = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [channel, setChannel] = useState<AgentOsChannelKind>("zalo")
    const [displayName, setDisplayName] = useState("")

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        selectedChannel: channel,
        onSelectedChannelChange: setChannel,
        displayName,
        onDisplayNameChange: setDisplayName,
        onConnect: () => setIsOpen(false),
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <div className="self-start">
                <Button label="Connect channel" variant="secondary" size="sm" onPress={() => setIsOpen(true)} />
            </div>
            <BlockAnatomy
                name="ConnectChannelModal"
                tier="block"
                leaf="Connect a channel"
                annotate={ANNOTATE}
                reason="A presentational overlay modal that only picks a platform and names the connection — it hands off to that platform's own OAuth screen rather than ever collecting a credential. The connect action stays disabled until a display name is entered, so the hand-off always has a name to label the new connection with."
                states={[
                    {
                        name: "displayName = \"\" (connect disabled)",
                        why: "A platform is picked but no name entered yet — the connect action stays disabled so a nameless connection is never started.",
                        code: `<ConnectChannelModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  selectedChannel="zalo"
  onSelectedChannelChange={setChannel}
  displayName=""
  onDisplayNameChange={setDisplayName}
  onConnect={connect}
  labels={labels}
/>`,
                        render: <ConnectChannelModal {...base} />,
                    },
                    {
                        name: "displayName filled in",
                        why: "Once a display name is entered, the connect action lights up and starts the OAuth hand-off named in the callout.",
                        code: "<ConnectChannelModal displayName=\"Zalo OA — Nivo Accounting\" … />",
                        render: <ConnectChannelModal {...base} displayName="Zalo OA — Nivo Accounting" onDisplayNameChange={() => {}} />,
                    },
                    {
                        name: "isConnecting = true",
                        why: "The hand-off is starting — both fields lock and the connect button shows its busy state so the operator can't double-trigger the redirect.",
                        code: "<ConnectChannelModal isConnecting … />",
                        render: <ConnectChannelModal {...base} displayName="Zalo OA — Nivo Accounting" onDisplayNameChange={() => {}} isConnecting />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The modal's own first fetch (which platforms this tier still allows) hasn't resolved yet, so the picker, the field, and the notice all shimmer together.",
                        code: "<ConnectChannelModal isSkeleton … />",
                        render: <ConnectChannelModal {...base} isSkeleton />,
                    },
                ]}
            />
        </div>
    )
}

/** All four states (disabled, filled, connecting, loading) live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => <ControlledConnectChannelModal />,
}

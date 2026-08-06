import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ChannelCredentialsDrawer,
    type ChannelCredentialFieldRow,
    type ChannelCredentialGroup,
    type ChannelCredentialsDrawerLabels,
} from "@sb-components/nivo/blocks/agent-os/ChannelCredentialsDrawer/ChannelCredentialsDrawer"
import type { SecretFieldStatus } from "@sb-components/composites/form/SecretField/SecretField"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ChannelCredentialsDrawer` — the panel where a customer types the tokens their
 * channels need, grouped by channel rather than by key name, because a person
 * arrives holding "my Telegram bot stopped answering", not a variable name.
 *
 * Every field is written INDEPENDENTLY — the operation behind this surface takes
 * one key per call — so each row owns its own save, its own failure line, and its
 * own delivery state. While one write is in flight the other rows lock, since the
 * server rolls the customer's pod on every save and two overlapping saves mean
 * two overlapping restarts.
 *
 * `isReadPathMissing` is not decoration. When the server offers no way to list
 * what is already stored, the drawer must say so once, at the top, and every row
 * must sit at `unknown` rather than claiming nothing is configured. The moment a
 * real status arrives for any row, that note is FALSE and stops rendering — its
 * whole claim is "you are only seeing what you just sent".
 *
 * `blockingMessage` replaces the groups outright, for the failures where no field
 * on the surface can succeed: no workspace to write into, or an expired session.
 * A per-field error there would repeat the same sentence seventeen times.
 */
const meta: Meta<typeof ChannelCredentialsDrawer> = {
    title: "Nivo/Blocks/AgentOs/ChannelCredentialsDrawer/ChannelCredentialsDrawer",
    component: ChannelCredentialsDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChannelCredentialsDrawer>

const LABELS: ChannelCredentialsDrawerLabels = {
    title: "Channel keys",
    description: "The tokens your channels need, grouped by channel.",
    restartWarningTitle: "Saving one key restarts your agent",
    restartWarningDescription:
        "The server writes the key into your pod, then rolls the agent and its sidecar. Your agent stops answering for about a minute.",
    readPathMissingTitle: "This server cannot list the keys you have already saved",
    readPathMissingDescription:
        "Each field below can only show the result of what you just sent in this session.",
    closeLabel: "Close",
    field: {
        editLabel: "Set key",
        saveLabel: "Save",
        cancelLabel: "Cancel",
        unknownLabel: "Not known — this server cannot be asked",
        unsetLabel: "Nothing stored",
        setLabel: "Saved",
        endingLabel: "ending",
        revealLabel: "Show the value",
        hideLabel: "Hide the value",
    },
}

/** One entry of the server's key allowlist, with the wording and masking that key deserves. */
interface CredentialKeySpec {
    /** The exact allowlisted key. */
    key: string
    /** Group this key belongs to. */
    group: string
    /** Field label. */
    label: string
    /** Optional supporting line. */
    hint?: string
    /** `false` only where masking would hide a typo rather than protect anything. */
    isMasked: boolean
}

/** The seventeen keys the server accepts, in the order the drawer lists them. */
const KEYS: ReadonlyArray<CredentialKeySpec> = [
    { key: "TELEGRAM_BOT_TOKEN", group: "telegram", label: "Bot token", hint: "From @BotFather after you create the bot.", isMasked: true },
    { key: "ZALO_BOT_TOKEN", group: "zalo", label: "Bot token", isMasked: true },
    { key: "ZALO_OA_ACCESS_TOKEN", group: "zalo", label: "OA access token", isMasked: true },
    { key: "ZALO_OA_SECRET", group: "zalo", label: "OA secret key", isMasked: true },
    { key: "MESSENGER_PAGE_ACCESS_TOKEN", group: "messenger", label: "Page access token", isMasked: true },
    { key: "MESSENGER_VERIFY_TOKEN", group: "messenger", label: "Verify token (you choose it)", isMasked: true },
    { key: "MESSENGER_APP_SECRET", group: "messenger", label: "App secret", isMasked: true },
    { key: "WHATSAPP_ACCESS_TOKEN", group: "whatsapp", label: "Access token", isMasked: true },
    { key: "WHATSAPP_PHONE_NUMBER_ID", group: "whatsapp", label: "Phone number ID", hint: "Digits only, and not the phone number itself.", isMasked: false },
    { key: "SLACK_BOT_TOKEN", group: "slack", label: "Bot token (xoxb-)", isMasked: true },
    { key: "SLACK_SIGNING_SECRET", group: "slack", label: "Signing secret", isMasked: true },
    { key: "DISCORD_BOT_TOKEN", group: "discord", label: "Bot token", isMasked: true },
    { key: "SMTP_HOST", group: "smtp", label: "SMTP host", hint: "The host name only, for example smtp.gmail.com.", isMasked: false },
    { key: "SMTP_PORT", group: "smtp", label: "Port", isMasked: false },
    { key: "SMTP_USER", group: "smtp", label: "Username", isMasked: false },
    { key: "SMTP_PASSWORD", group: "smtp", label: "App password", hint: "For Gmail this is the 16-character app password, not your account password.", isMasked: true },
    { key: "SMTP_FROM", group: "smtp", label: "From address", isMasked: false },
]

/** One group heading in the drawer's fixed display order. */
interface CredentialGroupSpec {
    /** Stable group key, matching {@link CredentialKeySpec.group}. */
    key: string
    /** Channel name as the reader knows it. */
    title: string
    /** Optional line under the title. */
    description?: string
}

/** Group headings, in display order. */
const GROUPS: ReadonlyArray<CredentialGroupSpec> = [
    { key: "telegram", title: "Telegram" },
    { key: "zalo", title: "Zalo" },
    { key: "messenger", title: "Messenger" },
    { key: "whatsapp", title: "WhatsApp" },
    { key: "slack", title: "Slack" },
    { key: "discord", title: "Discord" },
    { key: "smtp", title: "Email (SMTP)", description: "Gmail and any other mailbox are configured here." },
]

/** Per-key overrides a story applies on top of the resting shape. */
type FieldOverrides = Readonly<Record<string, Partial<ChannelCredentialFieldRow>>>

const NOOP = () => {}

/**
 * Builds the seven groups from the allowlist. `countLabel` reads "— fields"
 * while nothing on the surface is known, because "0/3" is a claim the client is
 * not in a position to make.
 */
const buildGroups = (overrides: FieldOverrides = {}): ReadonlyArray<ChannelCredentialGroup> =>
    GROUPS.map((group) => {
        const fields = KEYS.filter((spec) => spec.group === group.key).map((spec): ChannelCredentialFieldRow => ({
            key: spec.key,
            label: spec.label,
            hint: spec.hint,
            status: "unknown" as SecretFieldStatus,
            mode: "summary",
            value: "",
            onValueChange: NOOP,
            onEdit: NOOP,
            onCancel: NOOP,
            onSubmit: NOOP,
            isMasked: spec.isMasked,
            ...overrides[spec.key],
        }))
        const known = fields.filter((field) => field.status !== "unknown").length
        const saved = fields.filter((field) => field.status === "set").length
        return {
            key: group.key,
            title: group.title,
            description: group.description,
            countLabel: known === 0 ? `— of ${fields.length}` : `${saved}/${fields.length} saved`,
            fields,
        }
    })

const ALL_SET: FieldOverrides = Object.fromEntries(
    KEYS.map((spec) => [spec.key, { status: "set" as SecretFieldStatus, valueHint: "7f3a" }]),
)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    DrawerShell: {
        tier: "composite",
        role: "the panel scaffold — header, scrolling body, and the footer close action",
        storyId: "composites-layout-drawershell-drawershell--default",
    },
    Disclosure: {
        tier: "composite",
        role: "one collapsible group per channel; only the deep-linked one starts open",
        storyId: "composites-layout-disclosure-disclosure--default",
    },
    SecretField: {
        tier: "composite",
        role: "one row per allowlisted key, each with its own save and its own failure line",
        storyId: "composites-form-secretfield-secretfield--default",
    },
    Callout: {
        tier: "composite",
        role: "the permanent restart warning, the read-path note, and the whole-surface failure",
        storyId: "composites-feedback-callout--default",
    },
    Button: {
        tier: "atom",
        role: "closes the drawer — refused while a write is still rolling the pod",
        storyId: "atoms-buttons-button-button--default",
    },
}

/** Shared controlled wrapper — one `isOpen`/`openGroupKey` pair feeds every state below. */
const ControlledChannelCredentialsDrawer = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [openGroupKey, setOpenGroupKey] = useState<string | null>("telegram")

    const base = {
        isOpen,
        onClose: () => setIsOpen(false),
        openGroupKey,
        onOpenGroupChange: setOpenGroupKey,
        isReadPathMissing: true,
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChannelCredentialsDrawer"
                tier="block"
                leaf="Channel keys"
                annotate={ANNOTATE}
                reason="Blocks take no `className`: this one owns the server's seventeen-key allowlist, so the field set is a fixed shape and only its statuses are data. It is a drawer off the channels section rather than a tenth rail item, because the person who needs it is already looking at the channel that stopped working."
                states={[
                    {
                        name: "every field unknown (the resting state today)",
                        why: "No read path exists, so every row says the client cannot tell, and the group counts read \"— of N\" rather than \"0/N\". The note at the top is what makes that honest instead of merely vague.",
                        code: "<ChannelCredentialsDrawer groups={buildGroups()} isReadPathMissing openGroupKey=\"telegram\" … />",
                        render: <ChannelCredentialsDrawer {...base} groups={buildGroups()} />,
                    },
                    {
                        name: "some fields saved",
                        why: "Two rows came back from a save this session. Their groups switch to a real count; the rest keep the dash. The top note is gone, because \"you only see what you just sent\" stops being true the moment any row carries a real status.",
                        code: "<ChannelCredentialsDrawer groups={buildGroups(someSaved)} isReadPathMissing={false} … />",
                        render: (
                            <ChannelCredentialsDrawer
                                {...base}
                                isReadPathMissing={false}
                                groups={buildGroups({
                                    TELEGRAM_BOT_TOKEN: { status: "set", valueHint: "7f3a" },
                                    SMTP_PASSWORD: { status: "set", valueHint: "b19c" },
                                })}
                            />
                        ),
                    },
                    {
                        name: "every field saved",
                        why: "All seventeen on file. There is deliberately NO green \"all done\" banner: the server marks a key stored, which proves storage and says nothing about whether Telegram accepts it.",
                        code: "<ChannelCredentialsDrawer groups={buildGroups(allSet)} isReadPathMissing={false} … />",
                        render: (
                            <ChannelCredentialsDrawer
                                {...base}
                                isReadPathMissing={false}
                                groups={buildGroups(ALL_SET)}
                            />
                        ),
                    },
                    {
                        name: "isSaving = true",
                        why: "One row's write is in flight: its save button spins, every other row is inert, and the close action is refused — the pod is mid-restart and leaving now tells the reader nothing about how it ended.",
                        code: "<ChannelCredentialsDrawer isSaving groups={buildGroups(oneSaving)} … />",
                        render: (
                            <ChannelCredentialsDrawer
                                {...base}
                                isSaving
                                groups={buildGroups({
                                    TELEGRAM_BOT_TOKEN: { mode: "editing", value: "8100000000:AAHkq2y0d3wKQ1p9ZtR", isPending: true },
                                })}
                            />
                        ),
                    },
                    {
                        name: "one field failed",
                        why: "The failure sits on the row that failed. The server replaces its own per-field reasons with a generic string before they reach the client, so this sentence is written here and nowhere else.",
                        code: "<ChannelCredentialsDrawer groups={buildGroups(oneFailed)} … />",
                        render: (
                            <ChannelCredentialsDrawer
                                {...base}
                                groups={buildGroups({
                                    TELEGRAM_BOT_TOKEN: {
                                        mode: "editing",
                                        value: "8100000000",
                                        errorMessage: "That does not look like a token from @BotFather.",
                                    },
                                })}
                            />
                        ),
                    },
                    {
                        name: "saved, not delivered",
                        why: "Written down, not yet handed to the running pod. Kept as its own line rather than folded into \"saved\", because that is precisely the moment a customer would otherwise be told their channel is connected.",
                        code: "<ChannelCredentialsDrawer groups={buildGroups(pendingDelivery)} isReadPathMissing={false} … />",
                        render: (
                            <ChannelCredentialsDrawer
                                {...base}
                                isReadPathMissing={false}
                                groups={buildGroups({
                                    TELEGRAM_BOT_TOKEN: {
                                        status: "set",
                                        valueHint: "7f3a",
                                        deliveryLabel: "Not delivered to the pod yet",
                                        deliveryTone: "warning",
                                    },
                                })}
                            />
                        ),
                    },
                    {
                        name: "delivered",
                        why: "The value reached the pod. Worded as \"last delivered\" because the server stamps every deliverable key for that pod at once — the timestamp belongs to the delivery, not to this key.",
                        code: "<ChannelCredentialsDrawer groups={buildGroups(delivered)} isReadPathMissing={false} … />",
                        render: (
                            <ChannelCredentialsDrawer
                                {...base}
                                isReadPathMissing={false}
                                groups={buildGroups({
                                    TELEGRAM_BOT_TOKEN: {
                                        status: "set",
                                        valueHint: "7f3a",
                                        deliveryLabel: "Last delivered 14:32 06/08",
                                        deliveryTone: "success",
                                    },
                                })}
                            />
                        ),
                    },
                    {
                        name: "openGroupKey = \"slack\"",
                        why: "Opened from a Slack row, so Slack starts expanded and the other six stay collapsed. Slack and SMTP have no connected-channel record at all until something succeeds, which is why the section-header entry point exists beside the per-row one.",
                        code: "<ChannelCredentialsDrawer openGroupKey=\"slack\" groups={buildGroups()} … />",
                        render: <ChannelCredentialsDrawer {...base} openGroupKey="slack" groups={buildGroups()} />,
                    },
                    {
                        name: "blockingMessage set (no workspace)",
                        why: "No field on the surface can succeed, so the groups are replaced rather than each row repeating the same sentence seventeen times.",
                        code: "<ChannelCredentialsDrawer blockingMessage=\"You do not have an Agent OS pod yet.\" groups={buildGroups()} … />",
                        render: (
                            <ChannelCredentialsDrawer
                                {...base}
                                blockingMessage="You do not have an Agent OS pod yet, so there is nowhere to write these keys."
                                groups={buildGroups()}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Today the drawer has nothing to fetch, so the app passes `false`. The state is built and storied anyway: the day a listing query lands, the drawer must shimmer rather than flash seventeen unknown rows and then rewrite them.",
                        code: "<ChannelCredentialsDrawer isSkeleton groups={buildGroups()} … />",
                        render: <ChannelCredentialsDrawer {...base} isSkeleton groups={buildGroups()} />,
                    },
                ]}
            />
        </div>
    )
}

/** LEAF — one shape; the allowlist is fixed, so every state below is DATA about the same seventeen rows. */
export const Default: Story = {
    render: () => <ControlledChannelCredentialsDrawer />,
}

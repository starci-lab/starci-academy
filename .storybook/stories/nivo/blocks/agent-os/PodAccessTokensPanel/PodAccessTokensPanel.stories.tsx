import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PodAccessTokensPanel,
    type PodAccessTokensPanelLabels,
    type PodAccessTokensResult,
} from "@sb-components/nivo/blocks/agent-os/PodAccessTokensPanel/PodAccessTokensPanel"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PodAccessTokensPanel` — the form that mints a pod's access tokens and the
 * result of that minting, in ONE block, because the warning has to be on screen
 * BEFORE the call and both halves read the same rotation flag.
 *
 * The result has FOUR shapes, not two, and each renders differently. A call
 * without rotation reuses the live registration and mints NO raw registration
 * token, which is the ORDINARY outcome rather than a failure — so a null token
 * renders as an explained absence, never as an empty box, never as the string
 * "null", and never as a copy control with nothing behind it.
 *
 * The helm command is conditional on the hint being non-empty, and the hint is
 * empty exactly when nothing was minted. An empty command frame that still looks
 * copy-pasteable is worse than no frame: it invites a reader to paste a command
 * that would register nothing.
 *
 * The command is labelled "copy, then fill in" rather than "run this". It ships
 * with four unfilled placeholders, and a reader who pastes it unchanged installs a
 * pod with no database password.
 *
 * URL validation and the rotation confirmation are NOT here — this half takes
 * already-decided error strings and an already-confirmed submit, so every state
 * below can be rendered from a story with nothing running behind it.
 */
const meta: Meta<typeof PodAccessTokensPanel> = {
    title: "Nivo/Blocks/AgentOs/PodAccessTokensPanel/PodAccessTokensPanel",
    component: PodAccessTokensPanel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PodAccessTokensPanel>

const LABELS: PodAccessTokensPanelLabels = {
    n8nBaseUrlLabel: "n8n address",
    n8nBaseUrlHint: "The domain root only — https, on a domain we own, with no path.",
    openclawBaseUrlLabel: "Agent address",
    openclawBaseUrlHint: "The domain root only — https, on a domain we own, with no path.",
    rotateLabel: "Rotate the agent's gateway token",
    submitLabel: "Issue tokens",
    rotateSubmitLabel: "Rotate tokens",
    onceWarningTitle: "Both tokens are shown exactly once",
    onceWarningDescription:
        "The server keeps only a hash — nobody can retrieve them afterwards, including us. Copy and store them before you leave this page.",
    rotateWarningTitle: "Rotating invalidates the token in use",
    rotateWarningDescription: "Your pod loses its connection until you install the new one.",
    registrationTitle: "Registration token",
    gatewayTitle: "Gateway token",
    nothingMintedTitle: "No new token was created",
    nothingMintedDescription:
        "Your pod already has a live registration, so nothing was minted and there is nothing to show. Switch rotation on if you want to replace the old one.",
    gatewayOnlyTitle: "Only the gateway token was created",
    gatewayOnlyDescription:
        "The helm command needs a registration token, and the current registration is still valid — use the helm command you saved last time.",
    helmCommandLabel: "Copy, then fill the four placeholders",
    helmPlaceholderIntro: "These four are still unfilled:",
    reveal: {
        acknowledgeLabel: "I have stored it",
        acknowledgeCheckboxLabel: "I have copied this value somewhere safe",
    },
}

const HELM_HINT =
    "helm upgrade --install pod-7f3a nivo/agentos \\\n" +
    "  --set controlPlane.url=<controlPlane.url> \\\n" +
    "  --set registrationToken=regtok_9f2c41ae7b0d4c5f8e13a6b27d94f7f3a \\\n" +
    "  --set secrets.dbPassword=<secrets.dbPassword> \\\n" +
    "  --set secrets.n8nEncryptionKey=<secrets.n8nEncryptionKey> \\\n" +
    "  --set secrets.n8nOwnerPassword=<secrets.n8nOwnerPassword>"

const BOTH_MINTED: PodAccessTokensResult = {
    podId: "pod-7f3a",
    registrationToken: "regtok_9f2c41ae7b0d4c5f8e13a6b27d94f7f3a",
    openclawGatewayToken: "gwtok_31b8d0e5a7c94216f8b03d7e5a1c9b4e",
    helmSetHint: HELM_HINT,
}

const NOTHING_MINTED: PodAccessTokensResult = {
    podId: "pod-7f3a",
    registrationToken: null,
    openclawGatewayToken: null,
    helmSetHint: "",
}

const GATEWAY_ONLY: PodAccessTokensResult = {
    podId: "pod-7f3a",
    registrationToken: null,
    openclawGatewayToken: "gwtok_31b8d0e5a7c94216f8b03d7e5a1c9b4e",
    helmSetHint: "",
}

const REGISTRATION_ONLY: PodAccessTokensResult = {
    podId: "pod-7f3a",
    registrationToken: "regtok_9f2c41ae7b0d4c5f8e13a6b27d94f7f3a",
    openclawGatewayToken: null,
    helmSetHint: HELM_HINT,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Form: {
        tier: "composite",
        role: "the real form shell — Enter submits, and the whole fieldset locks together",
        storyId: "composites-form-form-form--default",
    },
    FormActions: {
        tier: "composite",
        role: "the closing button row, described as data rather than hand-drawn buttons",
        storyId: "composites-form-form-formactions--default",
    },
    InputText: {
        tier: "atom",
        role: "the two addresses — plain, because a URL is not a secret and a masked typo is invisible",
        storyId: "atoms-forms-inputtext--default",
    },
    ChoiceSwitch: {
        tier: "atom",
        role: "arms rotation, which changes both the warning set and the button's word",
        storyId: "atoms-forms-choiceswitch--default",
    },
    Callout: {
        tier: "composite",
        role: "the shown-once warning, the rotation warning, the submit failure, and the gateway-only note",
        storyId: "composites-feedback-callout--default",
    },
    OneTimeReveal: {
        tier: "composite",
        role: "each token, and the explained absence when one was not minted",
        storyId: "composites-feedback-onetimereveal-onetimereveal--default",
    },
    SnippetIcon: {
        tier: "atom",
        role: "copies the helm command — present only when there is a command to copy",
        storyId: "atoms-display-snippeticon-snippeticon--default",
    },
    Typography: {
        tier: "atom",
        role: "the helm command at code scale, and the list of placeholders it still needs",
        storyId: "atoms-text-typography-typography--default",
    },
}

/** Shared controlled wrapper — one address/rotation state feeds every state below. */
const ControlledPodAccessTokensPanel = () => {
    const [n8nBaseUrl, setN8nBaseUrl] = useState("https://n8n.nivo.vn")
    const [openclawBaseUrl, setOpenclawBaseUrl] = useState("https://agent.nivo.vn")
    const [rotate, setRotate] = useState(false)

    const base = {
        n8nBaseUrl,
        onN8nBaseUrlChange: setN8nBaseUrl,
        openclawBaseUrl,
        onOpenclawBaseUrlChange: setOpenclawBaseUrl,
        rotate,
        onRotateChange: setRotate,
        onSubmit: () => {},
        isRegistrationAcknowledged: false,
        onAcknowledgeRegistration: () => {},
        isGatewayAcknowledged: false,
        onAcknowledgeGateway: () => {},
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PodAccessTokensPanel"
                tier="block"
                leaf="Access tokens"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                reason="Blocks take no `className`: this one owns the minting call's four possible results and words each one itself. The form and the result live in one block because the shown-once warning has to be readable BEFORE the button is pressed, and because the rotation flag decides both the warning set and what comes back."
                states={[
                    {
                        name: "resting",
                        why: "Both addresses filled, rotation off. The shown-once warning is already on screen — after the call is too late to learn that the value will never be shown again.",
                        code: "<PodAccessTokensPanel n8nBaseUrl={url} openclawBaseUrl={url} rotate={false} onSubmit={submit} labels={labels} />",
                        render: <PodAccessTokensPanel {...base} rotate={false} />,
                    },
                    {
                        name: "rotate = true",
                        why: "Arming rotation adds a second, danger-toned warning and changes the button's word: retiring the token a running pod authenticates with is a different act from issuing a first one.",
                        code: "<PodAccessTokensPanel rotate onSubmit={submit} labels={labels} … />",
                        render: <PodAccessTokensPanel {...base} rotate />,
                    },
                    {
                        name: "both addresses rejected",
                        why: "The server replaces its own reasons with a generic string before they reach the client, so each sentence here is written by the front end — and each says WHICH rule the address broke rather than that it is invalid.",
                        code: "<PodAccessTokensPanel n8nBaseUrlError=\"Must be https.\" openclawBaseUrlError=\"…\" … />",
                        render: (
                            <PodAccessTokensPanel
                                {...base}
                                n8nBaseUrlError="Must be https."
                                openclawBaseUrlError="Enter the domain root only — drop the path."
                            />
                        ),
                    },
                    {
                        name: "isPending = true",
                        why: "The minting call is in flight. The submit button carries an explicit spinner — the vendor's busy flag draws none by itself — and both fields lock so the addresses cannot change under the request.",
                        code: "<PodAccessTokensPanel isPending onSubmit={submit} … />",
                        render: <PodAccessTokensPanel {...base} isPending />,
                    },
                    {
                        name: "submitError set",
                        why: "The call failed as a whole rather than at one field, so the failure sits with the form instead of pointing at an address that was fine.",
                        code: "<PodAccessTokensPanel submitError=\"Your session has expired.\" … />",
                        render: (
                            <PodAccessTokensPanel
                                {...base}
                                submitError="Your session has expired. Sign in again and retry."
                            />
                        ),
                    },
                    {
                        name: "result — both tokens minted",
                        why: "The full outcome: two reveals and the command that installs them. Each token is behind its own tick-then-press, because they are stored in different places.",
                        code: "<PodAccessTokensPanel result={bothMinted} … />",
                        render: <PodAccessTokensPanel {...base} rotate result={BOTH_MINTED} />,
                    },
                    {
                        name: "result — nothing minted (null / null / empty hint)",
                        why: "The COMMON outcome of a call without rotation, and not a failure. No reveal boxes at all — one explained absence, and a pointer at the switch that would have changed it.",
                        code: "<PodAccessTokensPanel result={nothingMinted} … />",
                        render: <PodAccessTokensPanel {...base} result={NOTHING_MINTED} />,
                    },
                    {
                        name: "result — gateway only, empty hint",
                        why: "The row a naive build gets wrong: a token to show, and no command to show it in. The panel says so rather than rendering an empty command frame beside it.",
                        code: "<PodAccessTokensPanel result={gatewayOnly} … />",
                        render: <PodAccessTokensPanel {...base} rotate result={GATEWAY_ONLY} />,
                    },
                    {
                        name: "result — registration only",
                        why: "A first registration with no rotation asked for: the registration reveal and its command, and no gateway box standing in for a token that was never minted.",
                        code: "<PodAccessTokensPanel result={registrationOnly} … />",
                        render: <PodAccessTokensPanel {...base} result={REGISTRATION_ONLY} />,
                    },
                    {
                        name: "result — acknowledged",
                        why: "After both ticks, the values are gone from state and only the tails remain. This is the state a reader leaves the page in, so it has to be worth leaving.",
                        code: "<PodAccessTokensPanel result={bothMinted} isRegistrationAcknowledged isGatewayAcknowledged … />",
                        render: (
                            <PodAccessTokensPanel
                                {...base}
                                rotate
                                result={BOTH_MINTED}
                                isRegistrationAcknowledged
                                registrationAcknowledgedSummary="Hidden · ending 7f3a"
                                isGatewayAcknowledged
                                gatewayAcknowledgedSummary="Hidden · ending 9b4e"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The route's own first read has not resolved. Both fields and the switch shimmer at their real sizes and the action row locks, so the form does not jump when it becomes usable.",
                        code: "<PodAccessTokensPanel isSkeleton … />",
                        render: <PodAccessTokensPanel {...base} isSkeleton />,
                    },
                ]}
            />
        </div>
    )
}

/** LEAF — one shape; the form and its four possible results are DATA states of the same panel. */
export const Default: Story = {
    render: () => <ControlledPodAccessTokensPanel />,
}

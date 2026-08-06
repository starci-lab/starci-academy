import { SnippetIcon } from "@sb-components/atoms/display/SnippetIcon/SnippetIcon"
import { ChoiceSwitch, InputText } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { OneTimeReveal, type OneTimeRevealLabels } from "@sb-components/composites/feedback/OneTimeReveal/OneTimeReveal"
import { Form, FormActions } from "@sb-components/composites/form/Form/Form"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

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

/** What the server returned from one minting call. */
export interface PodAccessTokensResult {
    /** The pod the tokens belong to. */
    podId: string
    /** Raw registration token — `null` whenever the live registration was reused, which is the common case. */
    registrationToken: string | null
    /** Raw gateway token — `null` when rotation was not asked for. */
    openclawGatewayToken: string | null
    /** The helm command, or the EMPTY STRING when nothing was minted. */
    helmSetHint: string
}

/** The already-resolved copy the panel renders. */
export interface PodAccessTokensPanelLabels {
    /** Label above the n8n base-URL field. */
    n8nBaseUrlLabel: string
    /** Supporting line under the n8n field — say the origin only, no path. */
    n8nBaseUrlHint: string
    /** Label above the agent base-URL field. */
    openclawBaseUrlLabel: string
    /** Supporting line under the agent field. */
    openclawBaseUrlHint: string
    /** Label beside the rotation switch. */
    rotateLabel: string
    /** Submit button while rotation is OFF. */
    submitLabel: string
    /** Submit button while rotation is ON — a different act deserves a different word. */
    rotateSubmitLabel: string
    /** Heading of the permanent "shown once" warning. */
    onceWarningTitle: string
    /** Body of the "shown once" warning. */
    onceWarningDescription: string
    /** Heading of the rotation warning, shown only while rotation is armed. */
    rotateWarningTitle: string
    /** Body of the rotation warning — say the running pod loses its connection. */
    rotateWarningDescription: string
    /** Title above the registration reveal. */
    registrationTitle: string
    /** Title above the gateway reveal. */
    gatewayTitle: string
    /** Heading of the note shown when NOTHING was minted. */
    nothingMintedTitle: string
    /** Body of that note — say how to mint anyway. */
    nothingMintedDescription: string
    /** Heading of the note shown when a gateway token exists but no helm command does. */
    gatewayOnlyTitle: string
    /** Body of that note — point at the helm command saved from a previous call. */
    gatewayOnlyDescription: string
    /** Label above the helm command — say "copy, then fill in", never "run this". */
    helmCommandLabel: string
    /** Line introducing the placeholder list under the command. */
    helmPlaceholderIntro: string
    /** Copy shared by both reveals. */
    reveal: OneTimeRevealLabels
}

/** Props for {@link PodAccessTokensPanel}. */
export interface PodAccessTokensPanelProps {
    /** The n8n origin (controlled). */
    n8nBaseUrl: string
    /** Fires as the n8n origin changes. */
    onN8nBaseUrlChange: (next: string) => void
    /** Already-decided failure line for the n8n field — the server's own reasons never reach the client. */
    n8nBaseUrlError?: string
    /** The agent origin (controlled). */
    openclawBaseUrl: string
    /** Fires as the agent origin changes. */
    onOpenclawBaseUrlChange: (next: string) => void
    /** Already-decided failure line for the agent field. */
    openclawBaseUrlError?: string
    /** `true` → the call will retire the token the running pod authenticates with. */
    rotate: boolean
    /** Fires with the next rotation state. */
    onRotateChange: (next: boolean) => void
    /** Mint. The caller has already confirmed a rotating call before this fires. */
    onSubmit: () => void
    /** `true` → the minting call is in flight; the submit button carries an explicit spinner. */
    isPending?: boolean
    /** Whole-form failure line, or `null`. */
    submitError?: string | null
    /** `null` before the call has been made. See {@link PodAccessTokensResult}. */
    result?: PodAccessTokensResult | null
    /** `true` → the reader has confirmed they stored the registration token. */
    isRegistrationAcknowledged: boolean
    /** Fires when they confirm it. */
    onAcknowledgeRegistration: () => void
    /** `true` → the reader has confirmed they stored the gateway token. */
    isGatewayAcknowledged: boolean
    /** Fires when they confirm it. */
    onAcknowledgeGateway: () => void
    /** Tail fragment shown in place of the registration token after acknowledgement, or `null`. */
    registrationAcknowledgedSummary?: string | null
    /** Tail fragment shown in place of the gateway token after acknowledgement, or `null`. */
    gatewayAcknowledgedSummary?: string | null
    /**
     * `true` → the panel's own first read is in flight: both fields and the action
     * row shimmer. Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: PodAccessTokensPanelLabels
}

/**
 * The four helm values the command leaves for the reader to fill in. Literal chart
 * keys, not copy — they are the same word in every language, and listing them here
 * keeps the panel from claiming a command is ready to run when it is not.
 */
const HELM_PLACEHOLDERS: ReadonlyArray<string> = [
    "controlPlane.url",
    "secrets.dbPassword",
    "secrets.n8nEncryptionKey",
    "secrets.n8nOwnerPassword",
]

/**
 * The token panel. See the file header for the four result shapes and why an empty
 * helm hint renders no command frame at all.
 *
 * @param props - {@link PodAccessTokensPanelProps}
 */
const PodAccessTokensPanel = ({
    n8nBaseUrl,
    onN8nBaseUrlChange,
    n8nBaseUrlError,
    openclawBaseUrl,
    onOpenclawBaseUrlChange,
    openclawBaseUrlError,
    rotate,
    onRotateChange,
    onSubmit,
    isPending = false,
    submitError = null,
    result = null,
    isRegistrationAcknowledged,
    onAcknowledgeRegistration,
    isGatewayAcknowledged,
    onAcknowledgeGateway,
    registrationAcknowledgedSummary = null,
    gatewayAcknowledgedSummary = null,
    isSkeleton = false,
    labels,
}: PodAccessTokensPanelProps) => {
    const hasRegistration = result != null && result.registrationToken != null
    const hasGateway = result != null && result.openclawGatewayToken != null
    const mintedNothing = result != null && !hasRegistration && !hasGateway
    // The hint is empty exactly when there is no registration token to put in it.
    const hasHelmCommand = result != null && result.helmSetHint !== ""

    const resultItems = result == null
        ? []
        : [
            // Nothing minted: ONE explained absence, owned by the reveal itself, so a
            // caller can never render a box around a token that does not exist.
            ...(mintedNothing
                ? [
                    () => (
                        <OneTimeReveal
                            title={labels.registrationTitle}
                            value={null}
                            absenceTitle={labels.nothingMintedTitle}
                            absenceDescription={labels.nothingMintedDescription}
                            warningTitle={labels.onceWarningTitle}
                            warningDescription={labels.onceWarningDescription}
                            isAcknowledged={isRegistrationAcknowledged}
                            onAcknowledge={onAcknowledgeRegistration}
                            labels={labels.reveal}
                        />
                    ),
                ]
                : []),
            ...(hasRegistration
                ? [
                    () => (
                        <OneTimeReveal
                            title={labels.registrationTitle}
                            value={result.registrationToken}
                            absenceTitle={labels.nothingMintedTitle}
                            absenceDescription={labels.nothingMintedDescription}
                            warningTitle={labels.onceWarningTitle}
                            warningDescription={labels.onceWarningDescription}
                            isAcknowledged={isRegistrationAcknowledged}
                            onAcknowledge={onAcknowledgeRegistration}
                            acknowledgedSummary={registrationAcknowledgedSummary}
                            labels={labels.reveal}
                        />
                    ),
                ]
                : []),
            ...(hasGateway
                ? [
                    () => (
                        <OneTimeReveal
                            title={labels.gatewayTitle}
                            value={result.openclawGatewayToken}
                            absenceTitle={labels.nothingMintedTitle}
                            absenceDescription={labels.nothingMintedDescription}
                            warningTitle={labels.onceWarningTitle}
                            warningDescription={labels.onceWarningDescription}
                            isAcknowledged={isGatewayAcknowledged}
                            onAcknowledge={onAcknowledgeGateway}
                            acknowledgedSummary={gatewayAcknowledgedSummary}
                            labels={labels.reveal}
                        />
                    ),
                ]
                : []),
            // A gateway token with no command to install it in: the one combination a
            // naive build renders as a token the reader cannot use anywhere.
            ...(hasGateway && !hasHelmCommand
                ? [
                    () => (
                        <Callout
                            status="warning"
                            title={labels.gatewayOnlyTitle}
                            description={labels.gatewayOnlyDescription}
                        />
                    ),
                ]
                : []),
            ...(hasHelmCommand
                ? [
                    () => (
                        <StackV
                            gap={2}
                            principle="title-subtitle"
                            items={[
                                () => (
                                    <StackH
                                        gap={3}
                                        align="center"
                                        justify="between"
                                        principle="value-row"
                                        items={[
                                            () => (
                                                <Typography
                                                    size="sm"
                                                    weight="medium"
                                                    text={labels.helmCommandLabel}
                                                />
                                            ),
                                            () => <SnippetIcon copyString={result.helmSetHint} />,
                                        ]}
                                    />
                                ),
                                () => (
                                    <Typography
                                        size="code"
                                        preserveWhitespace
                                        classNames={["min-w-0"]}
                                        text={result.helmSetHint}
                                    />
                                ),
                                () => (
                                    <Typography
                                        size="xs"
                                        color="muted"
                                        text={labels.helmPlaceholderIntro}
                                    />
                                ),
                                () => (
                                    <StackV
                                        gap={1}
                                        items={HELM_PLACEHOLDERS.map((placeholder) => () => (
                                            <Typography size="xs" color="muted" text={`<${placeholder}>`} />
                                        ))}
                                    />
                                ),
                            ]}
                        />
                    ),
                ]
                : []),
        ]

    return (
        // The block's identity is worn BY its root frame, never by a wrapper div
        // stacked on top just to hold a name — a block draws no shape of its own.
        <StackV
            identity={{ tier: "block", component: "PodAccessTokensPanel" }}
            gap={6}
            principle="block-boundary"
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Form
                        onSubmit={onSubmit}
                        isSkeleton={isSkeleton}
                        body={({ isSkeleton: isBodySkeleton }: SkeletonProps) => (
                            <StackV
                                gap={4}
                                isSkeleton={isBodySkeleton}
                                items={[
                                    ({ isSkeleton: isFieldSkeleton }: SkeletonProps) =>
                                        isFieldSkeleton ? (
                                            <InputText isSkeleton label={labels.n8nBaseUrlLabel} hint={labels.n8nBaseUrlHint} />
                                        ) : (
                                            <InputText
                                                label={labels.n8nBaseUrlLabel}
                                                hint={labels.n8nBaseUrlHint}
                                                value={n8nBaseUrl}
                                                onValueChange={onN8nBaseUrlChange}
                                                errorMessage={n8nBaseUrlError}
                                                isDisabled={isPending}
                                                isRequired
                                            />
                                        ),
                                    ({ isSkeleton: isFieldSkeleton }: SkeletonProps) =>
                                        isFieldSkeleton ? (
                                            <InputText isSkeleton label={labels.openclawBaseUrlLabel} hint={labels.openclawBaseUrlHint} />
                                        ) : (
                                            <InputText
                                                label={labels.openclawBaseUrlLabel}
                                                hint={labels.openclawBaseUrlHint}
                                                value={openclawBaseUrl}
                                                onValueChange={onOpenclawBaseUrlChange}
                                                errorMessage={openclawBaseUrlError}
                                                isDisabled={isPending}
                                                isRequired
                                            />
                                        ),
                                    ({ isSkeleton: isFieldSkeleton }: SkeletonProps) => (
                                        <ChoiceSwitch
                                            isSelected={rotate}
                                            onValueChange={onRotateChange}
                                            isDisabled={isFieldSkeleton || isPending}
                                            isSkeleton={isFieldSkeleton}
                                            label={labels.rotateLabel}
                                        />
                                    ),
                                    // The warning sits ABOVE the button, on screen from first
                                    // paint — after the call is too late to be told the value
                                    // will never be shown again.
                                    () => (
                                        <Callout
                                            status="warning"
                                            title={labels.onceWarningTitle}
                                            description={labels.onceWarningDescription}
                                        />
                                    ),
                                    ...(rotate
                                        ? [
                                            () => (
                                                <Callout
                                                    status="danger"
                                                    title={labels.rotateWarningTitle}
                                                    description={labels.rotateWarningDescription}
                                                />
                                            ),
                                        ]
                                        : []),
                                    ...(submitError != null
                                        ? [() => <Callout status="danger" title={submitError} />]
                                        : []),
                                ]}
                            />
                        )}
                        actions={({ isSkeleton: isActionsSkeleton }: SkeletonProps) => (
                            <FormActions
                                principle="flex-action-end"
                                items={[
                                    {
                                        key: "submit",
                                        // A rotating call is a different act from a first issue, so
                                        // the button says a different word for it.
                                        label: rotate ? labels.rotateSubmitLabel : labels.submitLabel,
                                        variant: rotate ? "danger" : "primary",
                                        // `Button` swaps its glyph for a real `Spinner` here; the
                                        // vendor's own busy flag draws nothing on its own.
                                        isPending,
                                        // `FormActions` has no skeleton of its own, so the row locks
                                        // rather than shimmering while the panel is still resting.
                                        isDisabled: isActionsSkeleton,
                                        onPress: onSubmit,
                                    },
                                ]}
                            />
                        )}
                    />
                ),
                ...resultItems,
            ]}
        />
    )
}

export { PodAccessTokensPanel }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "PodAccessTokensPanel" } as const

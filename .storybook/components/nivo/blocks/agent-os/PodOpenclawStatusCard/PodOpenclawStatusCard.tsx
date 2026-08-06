import { ArrowClockwiseIcon, KeyIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { KeyValueList, type KeyValueListItem } from "@sb-components/composites/data/KeyValue/KeyValue"
import { Box } from "@sb-components/frames/Box/Box"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PodOpenclawStatusCard` — one live probe of the pod's agent, stated as FOUR
 * readings rather than an up/down boolean, because the four have four different
 * causes and three different fixes.
 *
 * `never-issued` is the one a boolean loses: no token has been minted, so no
 * probe was made at all. Reporting that as "down" would send a reader hunting a
 * network fault that does not exist, when the remedy is to issue a token.
 * `rejected` is the signature of a rotation whose restart never landed — the
 * control plane holds a new token and the container still holds the old one.
 *
 * The token line reads "a token is on file", never "the agent is authenticated".
 * What the server can see is its OWN record; whether the container is actually
 * running with that value is a different question, and only the probe answers it.
 *
 * `checkedAtLabel` is always rendered, because this card is a MEASUREMENT taken
 * at a moment rather than a state that persists — an untimed reading invites a
 * reader to trust a probe that ran an hour ago.
 */

/** The four distinct readings — see the file header for why this is not a boolean. */
export type PodOpenclawReading =
    /** No token has been minted for this pod, so no probe was attempted. */
    | "never-issued"
    /** The pod answered normally. */
    | "reachable"
    /** A token exists but nothing answered — DNS, timeout, or transport. */
    | "unreachable"
    /** The pod answered and refused the token on file. */
    | "rejected"

/** The already-resolved copy the card renders. */
export interface PodOpenclawStatusCardLabels {
    /** Card title. */
    title: string
    /** One sentence per reading — the caller words each, since each has its own remedy. */
    readings: Record<PodOpenclawReading, string>
    /** Chip text beside the reading sentence, per reading. */
    readingChips: Record<PodOpenclawReading, string>
    /** Label of the HTTP-status row. */
    httpStatusRowLabel: string
    /** Label of the token row — must describe the control plane's record, not the container's config. */
    tokenRowLabel: string
    /** Value of the token row when no hint is available but a token is on file. */
    tokenOnFileLabel: string
    /** Value of the token row when no token has been minted. */
    tokenMissingLabel: string
    /** Already-composed "checked at" line, e.g. "Checked at 14:32". */
    checkedAtLabel: string
    /** Label of the re-probe action in the card header. */
    refreshLabel: string
    /** Label of the remedy shown only in the `never-issued` reading. */
    issueTokensLabel: string
}

/** Props for {@link PodOpenclawStatusCard}. */
export interface PodOpenclawStatusCardProps {
    /** Which of the four readings this probe produced. See {@link PodOpenclawReading}. */
    reading: PodOpenclawReading
    /** Already-formatted HTTP status ("401"), or `null` when nothing answered. */
    httpStatusLabel?: string | null
    /** Tail fragment of the token on file, or `null` when the server returned none. */
    tokenHint?: string | null
    /**
     * Take the probe again.
     */
    onRefresh: () => void
    /**
     * Go and mint a token. Rendered ONLY in the `never-issued` reading, which is
     * the only one whose remedy is issuing rather than retrying. Omitted, that
     * reading states the problem without offering the fix.
     */
    onIssueTokens?: () => void
    /**
     * `true` → the block's own first probe is in flight: the card keeps its title
     * and every value shimmers in place. Threaded straight down — never fed to a
     * separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: PodOpenclawStatusCardLabels
}

/**
 * Reading → chip tone. `never-issued` is a WARNING, not a danger: nothing is
 * broken, a step has not been taken.
 */
const READING_TONE: Record<PodOpenclawReading, ChipTone> = {
    "never-issued": "warning",
    reachable: "success",
    unreachable: "danger",
    rejected: "danger",
}

/**
 * The pod-agent probe card. See the file header for the four readings and why the
 * token line is worded the way it is.
 *
 * @param props - {@link PodOpenclawStatusCardProps}
 */
const PodOpenclawStatusCard = ({
    reading,
    httpStatusLabel = null,
    tokenHint = null,
    onRefresh,
    onIssueTokens,
    isSkeleton = false,
    labels,
}: PodOpenclawStatusCardProps) => {
    const tokenValue =
        reading === "never-issued"
            ? labels.tokenMissingLabel
            : tokenHint != null
                ? tokenHint
                : labels.tokenOnFileLabel

    const rows: ReadonlyArray<KeyValueListItem> = [
        ...(httpStatusLabel != null
            ? [{ key: "httpStatus", label: labels.httpStatusRowLabel, value: httpStatusLabel }]
            : []),
        { key: "token", label: labels.tokenRowLabel, value: tokenValue },
    ]

    return (
        // The block's identity is worn BY its root frame, never by a wrapper div
        // stacked on top just to hold a name — a block draws no shape of its own.
        <Box identity={{ tier: "block", component: "PodOpenclawStatusCard" }}>
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                action={({ isSkeleton: isActionSkeleton }: SkeletonProps) => (
                    <Button
                        variant="ghost"
                        size="sm"
                        prefixIcon={ArrowClockwiseIcon}
                        label={labels.refreshLabel}
                        isSkeleton={isActionSkeleton}
                        onPress={isActionSkeleton ? undefined : onRefresh}
                    />
                )}
                body={({ isSkeleton: isBodySkeleton }: SkeletonProps) => (
                    <StackV
                        gap={3}
                        principle="sibling-stack"
                        isSkeleton={isBodySkeleton}
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    align="center"
                                    principle="chip-row"
                                    isSkeleton={isBodySkeleton}
                                    items={[
                                        () => (
                                            <Chip
                                                tone={READING_TONE[reading]}
                                                isSkeleton={isBodySkeleton}
                                                text={labels.readingChips[reading]}
                                            />
                                        ),
                                        () => (
                                            <Typography
                                                size="sm"
                                                classNames={["min-w-0"]}
                                                isSkeleton={isBodySkeleton}
                                                text={labels.readings[reading]}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                            () => <KeyValueList items={rows} isSkeleton={isBodySkeleton} />,
                            // Always rendered: the card is a measurement, so it timestamps itself.
                            () => (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    isSkeleton={isBodySkeleton}
                                    text={labels.checkedAtLabel}
                                />
                            ),
                            ...(reading === "never-issued" && onIssueTokens != null
                                ? [
                                    ({ isSkeleton: isRemedySkeleton }: SkeletonProps) => (
                                        <StackH
                                            gap={2}
                                            justify="start"
                                            principle="flex-action"
                                            isSkeleton={isRemedySkeleton}
                                            items={[
                                                () => (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        prefixIcon={KeyIcon}
                                                        label={labels.issueTokensLabel}
                                                        isSkeleton={isRemedySkeleton}
                                                        onPress={isRemedySkeleton ? undefined : onIssueTokens}
                                                    />
                                                ),
                                            ]}
                                        />
                                    ),
                                ]
                                : []),
                        ]}
                    />
                )}
            />
        </Box>
    )
}

export { PodOpenclawStatusCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "PodOpenclawStatusCard" } as const

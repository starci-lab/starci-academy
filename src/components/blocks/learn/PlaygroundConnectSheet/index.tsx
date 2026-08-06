import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { ArrowClockwiseIcon, CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip, type ChipTone } from "@/components/atoms/chips/Chip"
import { Typography, type TypographyColor } from "@/components/atoms/text/Typography"
import { StatRibbon, type StatRibbonItem } from "@/components/composites/stats/StatRibbon"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * BLOCK — `PlaygroundConnectSheet`: the docked connection console under the lab
 * canvas — a peek row (status + reconnect) that never leaves the screen, and a
 * body the learner opens to see device specs and the live agent log.
 *
 * ONE LEAF, THREE DATA STATES (see the component's file header for the full
 * reasoning): `connected` shows the real device panel, `waiting` and `dropped`
 * share the same not-connected hint body and differ only in the peek chip's
 * wording/tone — `dropped` cannot happen without a prior connection, so no
 * extra `everConnected` prop is needed to tell the two apart.
 */

/** How the lab's device pairing currently stands. */
export type PlaygroundConnectionState = "connected" | "waiting" | "dropped"

/** One line the local agent printed, already leveled by the caller. */
export type PlaygroundAgentLogLevel = "info" | "success" | "warn" | "error"

/** The learner's machine, as reported by the connected agent. */
export interface PlaygroundDeviceSpec {
    /** e.g. `"Windows"`, `"macOS"`, `"Linux"`. */
    platform: string
    /** e.g. `"x64"`, `"arm64"`. */
    arch: string
    hostname: string
    cpuCores: number
    cpuModel: string
    totalMemBytes: number
    freeMemBytes: number
    /** Omitted → the machine has no discrete GPU the agent could report. */
    gpu?: string
    vramTotalMb?: number
    vramFreeMb?: number
}

/** One printed line from the local agent's live log. */
export interface PlaygroundAgentLogLine {
    level: PlaygroundAgentLogLevel
    line: string
}

interface PlaygroundConnectSheetOwnProps {
    /** Round-trip time to the local agent. Only shown while `connection === "connected"`. */
    latencyMs?: number
    /**
     * The paired machine's specs. Present only once the agent has reported at
     * least once — its presence is how `"dropped"` differs from `"waiting"` in
     * spirit, even though both render the same hint body (see file header).
     */
    device?: PlaygroundDeviceSpec
    /** Fired when the learner presses the peek row's reconnect action. */
    onReconnect: () => void
    /** Whether the body (device specs + log, or the hint) is expanded. Controlled. */
    open: boolean
    /** Fired with the next expanded state when the learner presses the toggle. */
    onOpenChange: (open: boolean) => void
}

/**
 * Props for {@link PlaygroundConnectSheet}. `connection`/`agentLog` are
 * REQUIRED unless `isSkeleton` (§12b) — the pairing state itself hasn't
 * resolved yet on first mount.
 */
export type PlaygroundConnectSheetProps = PlaygroundConnectSheetOwnProps &
    (
        | { isSkeleton: true; connection?: PlaygroundConnectionState; agentLog?: Array<PlaygroundAgentLogLine> }
        | {
            isSkeleton?: false
            /** Current pairing state — drives the peek chip's tone and wording. */
            connection: PlaygroundConnectionState
            /** Live tail of the local agent's log, oldest first. Shown only while connected. */
            agentLog: Array<PlaygroundAgentLogLine>
        }
    )

const STATUS_TONE: Record<PlaygroundConnectionState, ChipTone> = {
    connected: "success",
    waiting: "warning",
    dropped: "danger",
}

const STATUS_DOT_CLASS: Record<PlaygroundConnectionState, string> = {
    connected: "text-success",
    waiting: "text-warning",
    dropped: "text-danger",
}

/** The block owns this vocabulary — the caller only ever hands over the enum. */
const STATUS_LABEL: Record<PlaygroundConnectionState, string> = {
    connected: "Connected",
    waiting: "Waiting to connect",
    dropped: "Disconnected",
}

const LOG_COLOR: Record<PlaygroundAgentLogLevel, TypographyColor> = {
    info: "muted",
    success: "success",
    warn: "warning",
    error: "danger",
}

/** Same hint for both not-connected states — see file header on `waiting` vs `dropped`. */
const NOT_CONNECTED_HINT =
    "Turn on the agent on your machine, then press Reconnect. Your device specs and log will show up here as soon as the connection is back."

/** `1 234 567 890` → `"1.1 GB"` / `"48 MB"` — the block owns this wording, not a shared util (one call site). */
const formatBytes = (bytes: number): string => {
    const GIB = 1024 ** 3
    if (bytes >= GIB) return `${(bytes / GIB).toFixed(1)} GB`
    return `${Math.round(bytes / 1024 ** 2)} MB`
}

/** Device spec → the 3–4 {@link StatRibbon} cells, GPU cell only when the machine reports one. */
const buildDeviceItems = (device: PlaygroundDeviceSpec): Array<StatRibbonItem> => {
    const items: Array<StatRibbonItem> = [
        { key: "host", value: device.hostname, label: `${device.platform} · ${device.arch}` },
        { key: "cpu", value: `${device.cpuCores} cores`, label: device.cpuModel },
        {
            key: "ram",
            value: `${formatBytes(device.freeMemBytes)} / ${formatBytes(device.totalMemBytes)}`,
            label: "RAM free / total",
        },
    ]
    if (device.gpu != null) {
        items.push({
            key: "gpu",
            value: device.gpu,
            label:
                device.vramTotalMb != null
                    ? `VRAM ${device.vramFreeMb != null ? `${device.vramFreeMb} / ` : ""}${device.vramTotalMb} MB`
                    : "GPU",
        })
    }
    return items
}

/**
 * The docked connection console. See the file header for the reuse check and
 * the judgement calls (no new composite file, scope-disciplined toggle instead
 * of drag-resize, shared not-connected hint).
 *
 * @param props - {@link PlaygroundConnectSheetProps}
 */
const PlaygroundConnectSheet = ({
    connection,
    latencyMs,
    device,
    agentLog,
    onReconnect,
    open,
    onOpenChange,
    isSkeleton = false,
}: PlaygroundConnectSheetProps) => {
    if (isSkeleton) {
        return (
            <div className="overflow-hidden rounded-t-3xl border border-default bg-surface shadow-surface">
                <StackH
                    gap={4}
                    principle="cell-pad"
                    explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body."
                    padding={4}
                    isSkeleton={isSkeleton}
                    body={() => (
                        <StackH
                            gap={4}
                            principle="content-row"
                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                            align="center"
                            justify="between"
                            isSkeleton={isSkeleton}
                            items={[
                                () => <Skeleton className="h-5 w-24 rounded-full" />,
                                () => <Skeleton className="h-8 w-24 rounded-xl" />,
                            ]}
                        />
                    )}
                />
            </div>
        )
    }
    // `connection` is REQUIRED whenever `isSkeleton` is false (the discriminated union
    // above, already guaranteed by the early return) — the fallback only satisfies
    // narrowing across the destructure, it never actually fires.
    const safeConnection = connection ?? "waiting"
    const isConnected = safeConnection === "connected"
    const showDeviceBody = isConnected && device != null

    const statusGroup = (
        <StackH
            gap={3}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            align="center"
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Chip
                        tone={STATUS_TONE[safeConnection]}
                        dotClassName={STATUS_DOT_CLASS[safeConnection]}
                        text={STATUS_LABEL[safeConnection]}
                        isSkeleton={isSkeleton}
                    />
                ),
                ...(isConnected && latencyMs != null ? [() => (
                    <Typography
                        size="sm"
                        color="muted"
                        tabularNums
                        isSkeleton={isSkeleton}
                        text={`${latencyMs} ms`}

                    />
                )] : []),
            ]}
        />
    )

    const actionsGroup = (
        <StackH
            gap={3}
            principle="flex-action"
            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
            align="center"
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Button
                        label="Reconnect"
                        variant="secondary"
                        size="sm"
                        prefixIcon={ArrowClockwiseIcon}
                        onPress={onReconnect}
                        isSkeleton={isSkeleton}
                    />
                ),
                () => (
                    <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        prefixIcon={open ? CaretUpIcon : CaretDownIcon}
                        ariaLabel={open ? "Collapse connection panel" : "Expand connection panel"}
                        onPress={() => onOpenChange(!open)}
                        isSkeleton={isSkeleton}
                    />
                ),
            ]}
        />
    )

    // Depends on the loop variable, so it cannot be hoisted to a const above the
    // return — a small named helper instead, in the style this file already uses.
    const renderLogLine = (entry: PlaygroundAgentLogLine) => (
        <Typography
            size="xs"
            color={LOG_COLOR[entry.level]}
            tabularNums={false}
            text={entry.line}

        />
    )

    const sheetBody = showDeviceBody ? (
        <>
            <div>
                <StatRibbon items={buildDeviceItems(device)} valueType="body" bordered />
            </div>
            <StackV gap={2} isSkeleton={isSkeleton} items={(agentLog ?? []).map((entry) => () => renderLogLine(entry))} />
        </>
    ) : (
        <Typography size="sm" color="muted" text={NOT_CONNECTED_HINT} />
    )

    return (
        <div className="overflow-hidden rounded-t-3xl border border-default bg-surface shadow-surface">
            {/* PEEK — always visible: status + reconnect, plus the toggle that opens the body. */}
            <StackH
                gap={4}
                principle="cell-pad"
                explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body."
                padding={4}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackH
                        gap={4}
                        principle="content-row"
                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                        align="center"
                        justify="between"
                        isSkeleton={isSkeleton}
                        items={[
                            () => statusGroup,
                            () => actionsGroup,
                        ]}
                    />
                )}
            />
            {/* BODY — mounted only while open, matching a real bottom-sheet's collapsed state. */}
            {open ? (
                <div className="border-t border-default">
                    <StackV gap={4} principle="cell-pad"
                        explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body."
                        padding={4} isSkeleton={isSkeleton} body={() => (
                            <StackV gap={4} principle="card-caption"
                                explain="Holds caption text under card media so the caption stays attached to the image above it."
                                isSkeleton={isSkeleton} items={[() => sheetBody]}  />
                        )} />
                </div>
            ) : null}
        </div>
    )
}

export { PlaygroundConnectSheet }

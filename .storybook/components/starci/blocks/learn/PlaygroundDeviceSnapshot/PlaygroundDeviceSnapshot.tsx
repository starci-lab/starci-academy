import React from "react"
import { StatRibbon, type StatRibbonItem } from "@sb-components/composites/stats/StatRibbon/StatRibbon"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * `PlaygroundDeviceSnapshot` — "Your machine": the paired agent's `device:info`
 * report as a 4-cell stat ribbon (OS, CPU, RAM, GPU). Owns the domain judgement
 * on top of `StatRibbon`: unit math (bytes -> whole GB, MiB -> GB for VRAM,
 * matching the model-recommendation tiers), the `win32`/`darwin`/`linux` ->
 * "Windows"/"macOS"/"Linux" name table, and the three VRAM phrasings ("no GPU" /
 * "GPU with no VRAM read" / "X GB VRAM · Y MB free"). The caller supplies the
 * label. The dynamic half of each cell carries `isSkeleton`; captions stay
 * fixed. The two-line label is a raw `<span>` (phrasing content required inside
 * `StatRibbon`'s inline label slot).
 */

/**
 * The paired agent's hardware/OS snapshot, exactly as it arrives over the
 * `device:info` socket message — ported faithfully from
 * `PlaygroundDeviceInfo` in
 * `src/components/features/learn/Playground/PlaygroundPrepare/index.tsx`
 * (itself mirroring `PlaygroundByomDeviceInfoSocketIoMessage`).
 */
export interface PlaygroundDeviceInfo {
    /** `win32` | `linux` | `darwin`. */
    platform: string
    /** CPU architecture (`x64`, `arm64`, …). */
    arch: string
    /** Machine hostname. */
    hostname: string
    /** CPU model string. */
    cpuModel: string
    /** Logical CPU core count. */
    cpuCores: number
    /** Total RAM in bytes. */
    totalMemBytes: number
    /** Free RAM in bytes (at snapshot time). */
    freeMemBytes: number
    /** First discrete GPU name, or `null` if it couldn't be read. */
    gpu: string | null
    /** Free GPU VRAM in MiB (NVIDIA only); omitted when no NVIDIA GPU. */
    vramFreeMb?: number
    /** Total GPU VRAM in MiB (NVIDIA only); omitted when no NVIDIA GPU. */
    vramTotalMb?: number
}

/** Bytes → whole GB, the unit the ribbon reads in. */
const gbOf = (bytes: number): number => Math.round(bytes / 1e9)

/**
 * Node's `process.platform` id → the name a learner recognises.
 * @param platform - `win32` / `darwin` / `linux` (or anything else, passed through).
 */
const platformLabel = (platform: string): string =>
    platform === "win32"
        ? "Windows"
        : platform === "darwin"
            ? "macOS"
            : platform === "linux" ? "Linux" : platform

/**
 * The GPU cell's detail line: total + free VRAM when the agent could read an
 * NVIDIA card, an empty second line when a GPU exists but VRAM couldn't be
 * read, or an explicit "unknown" when no GPU was detected at all — three
 * distinct facts, not one string with a blank filled in.
 */
const vramDetail = (gpu: string | null, vramTotalMb?: number, vramFreeMb?: number): string =>
    vramTotalMb
        ? `${Math.round(vramTotalMb / 1024)} GB VRAM${vramFreeMb != null ? ` · ${vramFreeMb} MB free` : ""}`
        : gpu ? "" : "couldn't read"

/** Props for {@link DeviceStatLabel}. */
interface DeviceStatLabelProps {
    /** Fixed category word ("Operating system", "CPU"…) — real text even while `isSkeleton`. */
    caption: string
    /** Supporting detail line, computed from `deviceInfo`. */
    detail: string
    isSkeleton: boolean
}

/**
 * One ribbon cell's two-line label: the fixed category on top, the computed
 * detail beneath. See the file header for why this is a raw `<span>` rather
 * than a `StackV` frame.
 */
const DeviceStatLabel = ({ caption, detail, isSkeleton }: DeviceStatLabelProps) => (
    <span className="flex flex-col">
        <span>{caption}</span>
        {isSkeleton ? (
            <Typography size="xs" isSkeleton />
        ) : (
            <span className="truncate">{detail}</span>
        )}
    </span>
)

/** Props for {@link PlaygroundDeviceSnapshot}. */
export interface PlaygroundDeviceSnapshotProps {
    /** The paired machine's hardware/OS snapshot to render as a stat ribbon. */
    deviceInfo: PlaygroundDeviceInfo
    /** `true` → every cell's value/detail line swaps to its own shimmer. */
    isSkeleton?: boolean
}

/**
 * "Your machine": the paired agent's hardware report as a 4-cell stat ribbon
 * (OS · CPU · RAM · GPU). See the file header for the unit math, the
 * platform-name table, and why this composes `StatRibbon` instead of a new
 * shape.
 *
 * @param props - {@link PlaygroundDeviceSnapshotProps}
 */
const PlaygroundDeviceSnapshot = ({
    deviceInfo,
    isSkeleton = false,
}: PlaygroundDeviceSnapshotProps) => {
    const skeletonValue = (
        <Typography size="base" isSkeleton />
    )

    const items: ReadonlyArray<StatRibbonItem> = [
        {
            key: "os",
            value: isSkeleton ? skeletonValue : platformLabel(deviceInfo.platform),
            label: (
                <DeviceStatLabel
                    caption="Operating system"
                    detail={`${deviceInfo.arch} · ${deviceInfo.hostname}`}
                    isSkeleton={isSkeleton}

                />
            ),
        },
        {
            key: "cpu",
            value: isSkeleton ? skeletonValue : `${deviceInfo.cpuCores} cores`,
            label: (
                <DeviceStatLabel
                    caption="CPU"
                    detail={deviceInfo.cpuModel}
                    isSkeleton={isSkeleton}

                />
            ),
        },
        {
            key: "ram",
            value: isSkeleton ? skeletonValue : `${gbOf(deviceInfo.totalMemBytes)} GB`,
            label: (
                <DeviceStatLabel
                    caption="RAM"
                    detail={`${gbOf(deviceInfo.freeMemBytes)} GB free`}
                    isSkeleton={isSkeleton}

                />
            ),
        },
        {
            key: "gpu",
            value: isSkeleton ? skeletonValue : deviceInfo.gpu ?? "—",
            label: (
                <DeviceStatLabel
                    caption="GPU"
                    detail={vramDetail(deviceInfo.gpu, deviceInfo.vramTotalMb, deviceInfo.vramFreeMb)}
                    isSkeleton={isSkeleton}

                />
            ),
        },
    ]

    return (
        <div>
            <StatRibbon
                valueType="body"
                items={items}

            />
        </div>
    )
}

export { PlaygroundDeviceSnapshot }

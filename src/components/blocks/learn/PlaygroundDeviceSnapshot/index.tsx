import React from "react"
import { StatRibbon, type StatRibbonItem } from "@/components/composites/stats/StatRibbon"

/**
 * `PlaygroundDeviceSnapshot` — "Your machine": the paired agent's raw hardware
 * report turned into the same 4-cell `StatRibbon` the Lab route shows, so setup and
 * the live lab agree about what the machine can run. Reuses `StatRibbon`; the block
 * owns the domain judgement — bytes → GB rounding, the `win32`/`darwin`/`linux` →
 * "Windows"/"macOS"/"Linux" table, and the three sentences a GPU cell can say
 * depending on which of `gpu`/`vramTotalMb`/`vramFreeMb` came back. Every
 * `deviceInfo` combination and `isSkeleton` are states of the 4-cell shape.
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

/**
 * One ribbon cell's label: the fixed category word, plus the computed detail
 * when there is one — `StatRibbonItem.label` is a plain `string` (the ribbon
 * renders it itself through `Typography`), so caption and detail join into a
 * single line instead of the old two-line `<span>`.
 */
const deviceStatLabel = (caption: string, detail: string): string =>
    detail ? `${caption} · ${detail}` : caption

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
    const items: ReadonlyArray<StatRibbonItem> = [
        {
            key: "os",
            value: platformLabel(deviceInfo.platform),
            label: deviceStatLabel("Operating system", `${deviceInfo.arch} · ${deviceInfo.hostname}`),
        },
        {
            key: "cpu",
            value: `${deviceInfo.cpuCores} cores`,
            label: deviceStatLabel("CPU", deviceInfo.cpuModel),
        },
        {
            key: "ram",
            value: `${gbOf(deviceInfo.totalMemBytes)} GB`,
            label: deviceStatLabel("RAM", `${gbOf(deviceInfo.freeMemBytes)} GB free`),
        },
        {
            key: "gpu",
            value: deviceInfo.gpu ?? "—",
            label: deviceStatLabel("GPU", vramDetail(deviceInfo.gpu, deviceInfo.vramTotalMb, deviceInfo.vramFreeMb)),
        },
    ]

    return (
        <div>
            <StatRibbon
                valueType="body"
                isSkeleton={isSkeleton}
                items={items}

            />
        </div>
    )
}

export { PlaygroundDeviceSnapshot }

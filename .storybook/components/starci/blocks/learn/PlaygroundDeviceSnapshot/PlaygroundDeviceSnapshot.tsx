import React from "react"
import { StatRibbon, type StatRibbonItem } from "@sb-components/composites/stats/StatRibbon/StatRibbon"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PlaygroundDeviceSnapshot`: "Your machine" — the paired agent's raw
 * `device:info` report, turned into the 4-cell stat ribbon a learner reads to
 * decide "is my machine good enough".
 *
 * REUSED ACROSS TWO SURFACES ON PURPOSE. The real screen (`PlaygroundPrepare`,
 * `src/components/features/learn/Playground/PlaygroundPrepare/index.tsx`) renders
 * this exact ribbon both in the setup step ("Your machine") and again once the
 * learner reaches the Lab route — same component, not two hand-rolled panels —
 * so the two surfaces can never quietly disagree about what "8 GB free" means.
 * That is also why this block does NOT own the "Your machine" title: the source
 * wraps it in a `LabeledList` whose label differs per surface context, so the
 * label stays the CALLER's job and this block stays just the ribbon.
 *
 * WHY A BLOCK ON TOP OF `StatRibbon` (see `ContentModeNav`'s file header for the
 * incident that makes this rule non-negotiable): the composite knows how to lay
 * out N stat cells; it does not know what a hardware report IS. This block owns
 * three pieces of real domain judgement the composite has no business holding —
 *   • UNIT MATH — bytes → whole GB (`gbOf`), MiB → GB for VRAM, rounding rules
 *     that must match `recommendGenModel`'s tiers or the ribbon would show a
 *     number the pull-command math disagrees with.
 *   • THE PLATFORM-NAME TABLE — `win32`/`darwin`/`linux` → "Windows"/"macOS"/
 *     "Linux", the vocabulary a learner recognises instead of Node's platform id.
 *   • VRAM PHRASING — "no GPU" / "GPU with no VRAM read" / "X GB VRAM · Y MB
 *     free" are three different sentences built from three different states of
 *     the same two optional fields, not one string with a blank filled in.
 * None of that is StatRibbon's to know, and a block that only forwarded
 * `deviceInfo` untouched would be a passthrough (gate: check-passthrough-block) —
 * this one earns its layer on the three points above.
 *
 * 📐 ONE LEAF (§14d.2). `deviceInfo`'s fields never change the SHAPE of the
 * tree — always 4 cells, always OS → CPU → RAM → GPU, in that order — only the
 * numbers and strings inside them. `isSkeleton` stays a STATE of that one leaf
 * for the same reason `ChallengeScoreCard` keeps it a state: the ribbon's shape
 * does not change, only which atoms shimmer.
 *
 * `StatRibbon` HAS NO `isSkeleton` OF ITS OWN (its cells take `ReactNode`
 * value/label). Same move `PlaygroundHubHeader`/`ChallengeScoreCard` make for
 * their own composites-without-skeleton: this block calls the `Typography` atom
 * directly with `isSkeleton` and feeds the shimmer bar into the slot instead of
 * building a parallel skeleton tree (§12c). Only the DYNAMIC half of each cell
 * shimmers — the caption word ("CPU", "RAM"…) is fixed vocabulary independent of
 * `deviceInfo`, so it stays real text even while the value/detail lines shimmer.
 *
 * ⚠️ THE TWO-LINE LABEL STAYS A RAW `<span className="flex flex-col">`, not a
 * `StackV` frame, ported faithfully from the source's own `deviceStat` helper.
 * `StatRibbon`'s `label` slot is rendered INSIDE a HeroUI `Typography` — an
 * inline `<p>` — and `<p>` only accepts phrasing content; a frame's `<div>`
 * would be invalid there and get silently hoisted out by the browser, breaking
 * the two-line layout. `<span>` is phrasing content, so it is the one place in
 * this block a raw flex wrapper is correct instead of a canon violation.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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

/**
 * Compact, human-readable formatting for the live per-component resource
 * metrics on `/architecture` (CPU / memory / network). Kept local to this
 * feature since the shape (auto-pick unit, short precision, no unit for `0`
 * bytes) is specific to this dense rail-row / detail-panel presentation —
 * there is no existing shared byte-formatting util elsewhere in the repo.
 *
 * Every formatter takes a possibly-`null` number and returns `null` when
 * there's nothing to show, so a call-site can do
 * `formatBytes(x) ?? "" /* omit the line entirely *\/` without ever
 * rendering a fake `0`/"N/A" placeholder (see `ComponentMetrics` — a null
 * field means "no sample", not "zero usage").
 */

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const

/**
 * Formats a byte count as a short human string, auto-picking the largest unit
 * that keeps the number readable (e.g. `1234567` → `"1.18 MB"`). Uses 1024-based
 * (binary) units, matching how container memory limits/usage are normally read.
 *
 * @param bytes - Byte count, or `null`/`undefined` when there's no sample.
 * @param fractionDigits - Decimal places once past the first unit (bytes/KB stay whole).
 */
export const formatBytes = (bytes: number | null | undefined, fractionDigits = 2): string | null => {
    if (bytes == null || Number.isNaN(bytes)) return null
    if (bytes < 0) return null
    if (bytes < 1024) return `${Math.round(bytes)} ${BYTE_UNITS[0]}`

    let value = bytes
    let unitIndex = 0
    while (value >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
        value /= 1024
        unitIndex += 1
    }
    // KB reads fine whole; MB+ keeps a couple of decimals for precision
    const digits = unitIndex <= 1 ? 0 : fractionDigits
    return `${value.toFixed(digits)} ${BYTE_UNITS[unitIndex]}`
}

/**
 * Formats a throughput (bytes/second) the same way as {@link formatBytes},
 * with a trailing `/s`.
 */
export const formatBytesPerSecond = (bytesPerSecond: number | null | undefined): string | null => {
    const formatted = formatBytes(bytesPerSecond)
    return formatted == null ? null : `${formatted}/s`
}

/**
 * Formats a memory reading as `"used"` (no limit / limit unbounded) or
 * `"used / limit"` (bounded container) — e.g. `"184 MB"` or `"184 MB / 512 MB"`.
 * Returns `null` when there's no usage sample at all (nothing to show).
 *
 * @param usedBytes - Resident memory in bytes, or `null` when there's no sample.
 * @param limitBytes - Memory limit in bytes, or `null` when unbounded/unknown.
 */
export const formatMemory = (usedBytes: number | null | undefined, limitBytes: number | null | undefined): string | null => {
    const used = formatBytes(usedBytes)
    if (used == null) return null
    const limit = formatBytes(limitBytes)
    return limit == null ? used : `${used} / ${limit}`
}

/**
 * Formats a CPU percentage (already expressed as % of one core, per the
 * backend contract — can exceed 100 on multi-core work) to a whole-number
 * string with a trailing `%`, e.g. `"12%"`. Returns `null` when there's no sample.
 */
export const formatCpuPercent = (cpuPercent: number | null | undefined): string | null => {
    if (cpuPercent == null || Number.isNaN(cpuPercent)) return null
    if (cpuPercent < 0) return null
    return `${Math.round(cpuPercent)}%`
}

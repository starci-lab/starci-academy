/**
 * Shared time-bucketing for the flashcard "Lịch sử" surfaces (thầy 2026-07-13
 * relayout: history rendered as time buckets, mirroring the activity-log pattern
 * — "bucket events by meaningful time windows"). Groups already-fetched,
 * `updatedAt DESC`-ordered history items into ordered day-relative buckets so a
 * learner can scan "what did I do this week / older".
 */

/** Ordered bucket ids; the i18n label lives at `flashcard.timeBucket.<key>`. */
export type TimeBucketKey = "day" | "days3" | "week" | "month" | "year" | "older"

/** One populated bucket: its id (→ i18n label) plus the items that fell in it. */
export interface TimeBucket<T> {
    key: TimeBucketKey
    items: Array<T>
}

/** Bucket order, most-recent window first. Empty buckets are dropped by {@link groupByTimeBucket}. */
const BUCKET_ORDER: ReadonlyArray<TimeBucketKey> = ["day", "days3", "week", "month", "year", "older"]

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Day-relative bucket for one ISO timestamp (`now` passed in so callers stay
 * pure/testable). Windows finer-grained than the original today/week/month/older
 * (thầy 2026-07-17 "render kiểu 1 ngày 3 ngày 7 ngày 1 tháng 1 năm"): ≤1d, ≤3d,
 * ≤7d, ≤30d (~1 tháng), ≤365d (~1 năm), else older.
 */
const bucketFor = (iso: string, now: number): TimeBucketKey => {
    const diffDays = Math.floor((now - new Date(iso).getTime()) / DAY_MS)
    if (diffDays <= 1) {
        return "day"
    }
    if (diffDays <= 3) {
        return "days3"
    }
    if (diffDays <= 7) {
        return "week"
    }
    if (diffDays <= 30) {
        return "month"
    }
    if (diffDays <= 365) {
        return "year"
    }
    return "older"
}

/**
 * Groups history items into ordered, non-empty time buckets. Input is expected
 * already sorted `updatedAt DESC` (as both history queries return it), so within
 * a bucket the newest run stays first — no re-sort. Empty buckets are omitted.
 *
 * @param items - history items (any shape carrying a date)
 * @param getIso - reads the ISO timestamp to bucket by (e.g. `(item) => item.updatedAt`)
 * @param now - current epoch ms (defaults to `Date.now()`; injectable for tests)
 */
export const groupByTimeBucket = <T>(
    items: ReadonlyArray<T>,
    getIso: (item: T) => string,
    now: number = Date.now(),
): Array<TimeBucket<T>> => {
    const byKey = new Map<TimeBucketKey, Array<T>>()
    for (const item of items) {
        const key = bucketFor(getIso(item), now)
        const existing = byKey.get(key)
        if (existing) {
            existing.push(item)
        } else {
            byKey.set(key, [item])
        }
    }
    return BUCKET_ORDER.filter((key) => byKey.has(key)).map((key) => ({
        key,
        items: byKey.get(key) as Array<T>,
    }))
}

import {
    DayOfWeek,
} from "@/modules/types"

/**
 * Maps a {@link DayOfWeek} enum value to its JS `Date#getDay()` index
 * (0 = Sunday … 6 = Saturday).
 */
export const dayOfWeekToNumber: Record<DayOfWeek, number> = {
    [DayOfWeek.Sunday]: 0,
    [DayOfWeek.Monday]: 1,
    [DayOfWeek.Tuesday]: 2,
    [DayOfWeek.Wednesday]: 3,
    [DayOfWeek.Thursday]: 4,
    [DayOfWeek.Friday]: 5,
    [DayOfWeek.Saturday]: 6,
}

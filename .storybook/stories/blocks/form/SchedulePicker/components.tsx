import { CalendarDate } from "@internationalized/date"

// Fixed literals so stories are deterministic — never `new Date()`.
export const MIN_DATE = new CalendarDate(2026, 7, 16)
export const INITIAL_DATE = new CalendarDate(2026, 7, 20)

export const SLOTS = [
    { id: "0900", label: "09:00 - 10:00" },
    { id: "1030", label: "10:30 - 11:30" },
    { id: "1330", label: "13:30 - 14:30", isDisabled: true },
    { id: "1500", label: "15:00 - 16:00" },
    { id: "1630", label: "16:30 - 17:30", isDisabled: true },
    { id: "1900", label: "19:00 - 20:00" },
]

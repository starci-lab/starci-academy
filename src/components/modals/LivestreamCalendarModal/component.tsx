import React from "react"
import { Calendar } from "@heroui/react"
import { CalendarDate, getLocalTimeZone, today, type DateValue } from "@internationalized/date"
import { ClockIcon } from "@phosphor-icons/react"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { MarkdownContent } from "@/components/composites/viewers/MarkdownContent"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import { Cluster } from "@/components/frames/Cluster"
import { Box } from "@/components/frames/Box"

/**
 * `_LivestreamCalendarModal` — the presentational half of `LivestreamCalendarModal`:
 * a date-picker calendar (dims any weekday with no recurring session) above a bounded
 * list of the course's recurring livestream sessions (day + time-range chip row, next
 * occurrence, an optional markdown note). Composes `ModalShell` (dialog scaffold) +
 * `SurfaceCardList` (the row list) + `MarkdownContent` (the note); falls to
 * `AsyncContentEmpty` when there are no sessions to show.
 *
 * ⚠️ MISSING VOCABULARY: there is no atom/composite wrapping a STANDALONE, always-visible
 * HeroUI `Calendar` (`atoms/forms/Input`'s `InputDate` only wraps one inside a text-field
 * popover). Kept as a direct `@heroui/react` import here, minimal, pending that atom —
 * see the task's `missingVocabulary` report. Do not spread this pattern elsewhere. The
 * `DateValue` type it needs comes from `@internationalized/date` (the same nominal type
 * `@heroui/react/rac` re-exports) so this stays the ONLY direct HeroUI import in the file;
 * `Box` (the frames escape hatch for "a composite wrapping a foreign library") carries the
 * `overflow-hidden`/`shadow-none` reset instead of a raw `className` on `Calendar` itself.
 *
 * No `isSkeleton`: `rows` comes straight off redux (`state.livestreamSession.entities`,
 * populated synchronously wherever the store is hydrated), so there is no async
 * first-load formula to compute a skeleton from — the original component had no
 * loading state either.
 *
 * @param props - {@link LivestreamCalendarModalProps}
 */

/** One recurring livestream session, fully resolved for display by the connected `LivestreamCalendarModal`. */
export interface LivestreamCalendarSessionRow {
    /** Stable row key (the session id). */
    id: string
    /** Weekday label, already localized (`t("livestream.calendar.days.<dow>")`). */
    dayLabel: string
    /** `"09:00 - 10:00"`-shaped range, already localized + interpolated. */
    timeRangeLabel: string
    /** "Next on <date>" line, already localized + interpolated with the formatted date. */
    nextOnLabel: string
    /** Session note, raw markdown source — `undefined` when blank/absent. */
    note?: string
}

/** All display text, already localized by the connected `LivestreamCalendarModal`; a story passes i18n keys. */
export interface LivestreamCalendarModalLabels {
    /** Modal header title. */
    modalTitle: string
    /** Accessible name for the calendar grid. */
    calendarAriaLabel: string
    /** Empty-state title, shown when there are no recurring sessions. */
    emptyTitle: string
}

/** Props for {@link _LivestreamCalendarModal} — presentational; all data resolved, no fetch/store/i18n. */
export interface LivestreamCalendarModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. */
    onOpenChange: (open: boolean) => void
    /** Date the calendar opens focused on — the next occurrence of the earliest session, or `undefined` when there are none. */
    defaultFocusedValue?: CalendarDate
    /** `true` for a weekday the course has no recurring session on — dims it in the grid. */
    isDateUnavailable: (date: DateValue) => boolean
    /** The recurring sessions, already sorted for display (latest weekday first). */
    rows: Array<LivestreamCalendarSessionRow>
    labels: LivestreamCalendarModalLabels
}

/** One row's free-form body: day/time chip row, the next-occurrence line, and an optional note. */
const sessionRowContent = (row: LivestreamCalendarSessionRow) => (
    <StackV
        gap={4}
        items={[
            () => (
                <Cluster
                    gap={3}
                    align="center"
                    principles={["chip-row"]}
                    items={[
                        () => <Chip text={row.dayLabel} />,
                        () => <ClockIcon aria-hidden focusable="false" className="size-3 text-muted" />,
                        () => <Typography size="sm" color="muted" text={row.timeRangeLabel} />,
                    ]}
                />
            ),
            () => <Typography size="sm" text={row.nextOnLabel} />,
            ...(row.note ? [() => <MarkdownContent source={row.note as string} measure="compact" />] : []),
        ]}
    />
)

export const _LivestreamCalendarModal = ({
    isOpen,
    onOpenChange,
    defaultFocusedValue,
    isDateUnavailable,
    rows,
    labels,
}: LivestreamCalendarModalProps) => {
    const isEmpty = rows.length === 0

    const calendarSlot = () => (
        <Box className="overflow-hidden shadow-none">
            <Calendar
                aria-label={labels.calendarAriaLabel}
                defaultFocusedValue={defaultFocusedValue}
                defaultValue={today(getLocalTimeZone())}
                firstDayOfWeek="mon"
                isDateUnavailable={isDateUnavailable}
            />
        </Box>
    )

    const listItems: Array<SurfaceCardListItem> = rows.map((row) => ({
        key: row.id,
        content: () => sessionRowContent(row),
    }))

    const bodySlot = () => (
        isEmpty ? (
            <AsyncContentEmpty title={labels.emptyTitle} />
        ) : (
            <StackV
                gap={4}
                items={[
                    () => <StackV gap={1} align="center" body={calendarSlot} />,
                    () => <SurfaceCardList items={listItems} variant="nested" />,
                ]}
            />
        )
    )

    return (
        <div data-tier="overlay" data-component="LivestreamCalendarModal">
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={labels.modalTitle}
                size="lg"
                containerClassName="max-w-lg"
                body={bodySlot}
            />
        </div>
    )
}

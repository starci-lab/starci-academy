/**
 * Countdown broken into days, hours, minutes, and seconds.
 */
export interface CountdownParts {
    /** Whole days remaining. */
    days: number
    /** Whole hours remaining (0–23). */
    hours: number
    /** Whole minutes remaining (0–59). */
    minutes: number
    /** Whole seconds remaining (0–59). */
    seconds: number
}

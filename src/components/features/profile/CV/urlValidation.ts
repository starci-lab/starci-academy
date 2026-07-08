import { z } from "zod"

/**
 * Accepts an empty string (the field is optional-as-you-type) OR a valid
 * absolute URL. Used to gate the `isInvalid` state on CV URL fields
 * (LinkedIn, certification credential link, …) — validated on blur, not on
 * every keystroke, so a half-typed URL doesn't flash red.
 */
const OPTIONAL_URL_SCHEMA = z.union([z.literal(""), z.string().trim().url()])

/** True when `value` is empty or a syntactically valid URL. */
export const isValidOptionalUrl = (value: string): boolean =>
    OPTIONAL_URL_SCHEMA.safeParse(value.trim()).success

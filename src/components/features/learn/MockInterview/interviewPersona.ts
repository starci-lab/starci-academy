/** The 3-notch difficulty tier a run is conducted at (mirrors the session's `MockInterviewTier`). */
export type MockInterviewPersonaTier = "so" | "trung" | "cao"

/**
 * A presentational interviewer identity for the room — FE-only (the backend
 * returns no persona; the interviewer is a text/voice presence). StarCi is the
 * interviewer: a single fixed brand identity (name + face photo + a static role
 * label). The chosen tier still scales the QUESTIONS/rubric in the session, but
 * not this persona.
 */
export interface MockInterviewPersona {
    /** Display name — the brand itself is the interviewer (no fake human name). */
    name: string
    /** Static role label shown under the name (e.g. "Solution Architect"). */
    role: string
    /** One-letter monogram fallback for the avatar (used only if the photo fails to load). */
    monogram: string
    /** The interviewer's face — a real photo served from `public/`. */
    avatarSrc: string
}

/** The interviewer IS the brand — one recurring StarCi identity across the room. */
const PERSONA_NAME = "StarCi"

/** Static role label — kept in English (standard tech-industry title), same in both locales. */
const PERSONA_ROLE = "Solution Architect"

/** The brand face shown for the interviewer (public asset). */
const PERSONA_AVATAR = "/starci.jpg"

/**
 * Resolve the interviewer persona. StarCi is the interviewer — a single fixed
 * brand identity (name + face + role). The chosen tier still scales the
 * QUESTIONS/rubric (see the session), but the persona itself no longer changes
 * with it, so this takes no arguments.
 */
export const personaFor = (): MockInterviewPersona => ({
    name: PERSONA_NAME,
    role: PERSONA_ROLE,
    monogram: PERSONA_NAME.charAt(0),
    avatarSrc: PERSONA_AVATAR,
})

/** The 3-notch difficulty tier a run is conducted at (mirrors the session's `MockInterviewTier`). */
export type MockInterviewPersonaTier = "so" | "trung" | "cao"

/**
 * A presentational interviewer identity for the room — FE-only (the backend
 * returns no persona; the interviewer is a text/voice presence). The persona's
 * SENIORITY scales with the chosen tier so a harder run reads as a more senior
 * interviewer, mirroring the backend's `LEVEL_EXPECTATION_MAP` (junior → staff
 * gets progressively stricter). The role label itself is resolved via i18n
 * (`mockInterview.personaRole.<tier>`) at the call site.
 */
export interface MockInterviewPersona {
    /** Display name (fixed — one recurring interviewer identity). */
    name: string
    /** One-letter monogram for the avatar tile. */
    monogram: string
    /** i18n key suffix for the role/title, scaled by tier (`mockInterview.personaRole.<tier>`). */
    roleTier: MockInterviewPersonaTier
}

/** The one recurring interviewer name shown across the room. */
const PERSONA_NAME = "Minh"

/**
 * Resolve the interviewer persona for a given tier. Name is fixed; the role
 * (resolved by the caller via `mockInterview.personaRole.<roleTier>`) scales
 * with tier — Sơ → engineer, Trung → senior, Cao → staff.
 */
export const personaFor = (tier: MockInterviewPersonaTier): MockInterviewPersona => ({
    name: PERSONA_NAME,
    monogram: PERSONA_NAME.charAt(0),
    roleTier: tier,
})

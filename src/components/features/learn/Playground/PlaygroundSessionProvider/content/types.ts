/** One install guide authored in both app locales (markdown source per locale). */
export interface LocalizedGuide {
    /** Vietnamese source — the language guides are authored in first. */
    vi: string
    /** English mirror of {@link LocalizedGuide.vi}. */
    en: string
}

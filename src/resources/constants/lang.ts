/** Supported UI language codes and their display labels. */
export const languages: Array<Language> = [
    { code: "en", label: "English" },
    { code: "vi", label: "Tiếng Việt" },
]

/** One entry in {@link languages}. */
export interface Language {
    code: string
    label: string
}
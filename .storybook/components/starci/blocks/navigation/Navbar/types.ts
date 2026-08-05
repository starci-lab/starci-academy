/** One selectable locale in the language dropdown. */
export interface NavbarLanguageOption {
    /** Locale code (e.g. `"vi"`), also the value reported to `onLocaleChange`. */
    code: string
    /** Visible language name, already localized by the caller. */
    label: string
}

/**
 * The CV template font catalog. Every entry renders in the live preview AND in
 * the PDF/Word export, so the set is limited to fonts with a VIETNAMESE subset
 * (diacritics must not break — see `fe-lint-no-next-img-directive-and-serif-polish`).
 *
 * Google fonts are loaded via a `<link>` in the editor (for the preview) and
 * injected into the export HTML `<head>` (so Puppeteer fetches + renders them
 * before printing). System fonts (`google: undefined`) need no network.
 */
export interface CvFont {
    /** Stable key stored in `cv_blocks.style.font`. */
    key: string
    /** Human label shown in the picker (rendered in its own font). */
    label: string
    /** CSS `font-family` stack (with a safe fallback). */
    family: string
    /** Google Fonts family param (URL form, e.g. `Open+Sans`); omit for system fonts. */
    google?: string
    /** Whether this is a serif face (for grouping/labels). */
    serif?: boolean
}

/** The fonts offered by the style rail (sans first, then serif, then system). */
export const CV_FONTS: Array<CvFont> = [
    { key: "inter", label: "Inter", family: "'Inter', 'Helvetica Neue', Arial, sans-serif", google: "Inter" },
    { key: "beVietnam", label: "Be Vietnam Pro", family: "'Be Vietnam Pro', Arial, sans-serif", google: "Be+Vietnam+Pro" },
    { key: "roboto", label: "Roboto", family: "'Roboto', Arial, sans-serif", google: "Roboto" },
    { key: "openSans", label: "Open Sans", family: "'Open Sans', Arial, sans-serif", google: "Open+Sans" },
    { key: "montserrat", label: "Montserrat", family: "'Montserrat', Arial, sans-serif", google: "Montserrat" },
    { key: "lexend", label: "Lexend", family: "'Lexend', Arial, sans-serif", google: "Lexend" },
    { key: "nunito", label: "Nunito", family: "'Nunito', Arial, sans-serif", google: "Nunito" },
    { key: "lora", label: "Lora", family: "'Lora', Georgia, serif", google: "Lora", serif: true },
    { key: "merriweather", label: "Merriweather", family: "'Merriweather', Georgia, serif", google: "Merriweather", serif: true },
    { key: "sourceSerif", label: "Source Serif", family: "'Source Serif 4', Georgia, serif", google: "Source+Serif+4", serif: true },
    { key: "playfair", label: "Playfair Display", family: "'Playfair Display', Georgia, serif", google: "Playfair+Display", serif: true },
    { key: "georgia", label: "Georgia", family: "Georgia, 'Times New Roman', serif", serif: true },
]

/** `font key → CSS font-family stack`, derived from {@link CV_FONTS}. */
export const CV_FONT_STACK: Record<string, string> = Object.fromEntries(
    CV_FONTS.map((font) => [font.key, font.family]),
)

/** The default font family stack (Inter) when a style has no/unknown font key. */
export const DEFAULT_FONT_FAMILY = CV_FONT_STACK.inter

/** Resolves a stored font key to its CSS `font-family` stack. */
export const fontFamilyOf = (fontKey: string): string => CV_FONT_STACK[fontKey] ?? DEFAULT_FONT_FAMILY

/**
 * A single Google Fonts stylesheet href loading EVERY catalog google-font (for
 * the live preview, so any pick renders instantly). Weights 400/600/700.
 */
export const CV_GOOGLE_FONTS_HREF = `https://fonts.googleapis.com/css2?${CV_FONTS
    .filter((font) => font.google)
    .map((font) => `family=${font.google}:wght@400;600;700`)
    .join("&")}&display=swap`

/**
 * The Google Fonts href for ONE font key (for the export HTML head), or `null`
 * for a system font that needs no network fetch.
 */
export const googleFontHrefOf = (fontKey: string): string | null => {
    const font = CV_FONTS.find((entry) => entry.key === fontKey)
    if (!font?.google) {
        return null
    }
    return `https://fonts.googleapis.com/css2?family=${font.google}:wght@400;600;700&display=swap`
}

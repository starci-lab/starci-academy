/**
 * BATCH 19 — approved semantic contract resolvers (src TypeScript twin).
 * Mappings must stay identical to `./_semantic-contracts.mjs` and the Storybook twin.
 */

/** Named DrawerShell dialog width. */
export type DrawerDialogWidth = "default" | "cart"
/** Named DrawerShell footer layout. */
export type DrawerFooterVariant = "default" | "stacked"
/** Named ModalShell viewport fit. */
export type ModalViewportFit = "default" | "near-fullscreen"
/** Named PDFView canvas height. */
export type PDFViewHeight =
    | "compact"
    | "standard"
    | "tall"
    | "expanded"
    | "document"
    | "viewport"
/** Named SurfaceCard body layout (does not include relative). */
export type SurfaceCardBodyVariant = "default" | "stacked" | "tile"
/** Named SurfaceCard outer chrome (independent of body layout). */
export type SurfaceCardChromeVariant = "default" | "tile"

const DRAWER_DIALOG_WIDTH: Record<DrawerDialogWidth, string | undefined> = {
    default: undefined,
    cart: "sm:max-w-md",
}

const DRAWER_FOOTER_VARIANT: Record<DrawerFooterVariant, string | undefined> = {
    default: undefined,
    stacked: "flex-col! items-stretch! justify-start! gap-3! border-t",
}

const MODAL_VIEWPORT_FIT: Record<ModalViewportFit, string | undefined> = {
    default: undefined,
    "near-fullscreen": "h-[92vh] w-[96vw] max-w-[96vw]",
}

const PDF_VIEW_HEIGHT: Record<PDFViewHeight, string> = {
    compact: "h-[200px]",
    standard: "h-[320px]",
    tall: "h-[400px]",
    expanded: "h-[420px]",
    document: "h-[560px]",
    viewport: "h-[84vh]",
}

const SURFACE_CARD_BODY_VARIANT: Record<SurfaceCardBodyVariant, string | undefined> = {
    default: undefined,
    stacked: "flex flex-col gap-3",
    tile: "flex flex-col gap-3 overflow-hidden",
}

const SURFACE_CARD_CHROME_VARIANT: Record<SurfaceCardChromeVariant, string | undefined> = {
    default: undefined,
    tile: "rounded-2xl shadow-field",
}

const resolve = <T extends string>(value: T, table: Record<T, string | undefined>, label: string): string | undefined => {
    if (!(value in table)) {
        throw new TypeError(`Invalid ${label}: ${JSON.stringify(value)}`)
    }
    return table[value]
}

/** Resolves DrawerShell `dialogWidth` to dialog classes (`cart` → `sm:max-w-md`). */
export const resolveDrawerDialogWidth = (width: DrawerDialogWidth = "default"): string | undefined =>
    resolve(width, DRAWER_DIALOG_WIDTH, "DrawerDialogWidth")

/** Resolves DrawerShell `footerVariant` to footer classes (`stacked` → MiniCart column footer). */
export const resolveDrawerFooterVariant = (variant: DrawerFooterVariant = "default"): string | undefined =>
    resolve(variant, DRAWER_FOOTER_VARIANT, "DrawerFooterVariant")

/** Resolves ModalShell `viewportFit` to container classes (`near-fullscreen` → CvPreview geometry). */
export const resolveModalViewportFit = (fit: ModalViewportFit = "default"): string | undefined =>
    resolve(fit, MODAL_VIEWPORT_FIT, "ModalViewportFit")

/** Resolves PDFView `height` to a private height class; rejects arbitrary CSS. */
export const resolvePDFViewHeight = (height: PDFViewHeight = "document"): string =>
    resolve(height, PDF_VIEW_HEIGHT, "PDFViewHeight") ?? PDF_VIEW_HEIGHT.document

/** Resolves SurfaceCard `bodyVariant` to body layout classes (does not include `relative`). */
export const resolveSurfaceCardBodyVariant = (variant: SurfaceCardBodyVariant = "default"): string | undefined =>
    resolve(variant, SURFACE_CARD_BODY_VARIANT, "SurfaceCardBodyVariant")

/** Resolves SurfaceCard `chromeVariant` to outer chrome classes (`tile` → TILE_CHROME). */
export const resolveSurfaceCardChromeVariant = (variant: SurfaceCardChromeVariant = "default"): string | undefined =>
    resolve(variant, SURFACE_CARD_CHROME_VARIANT, "SurfaceCardChromeVariant")

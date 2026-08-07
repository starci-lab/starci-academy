/**
 * BATCH 19 — approved semantic contract resolvers (pure; shared by tests).
 * Source of truth for class mappings. TypeScript twins must stay identical.
 */

/** @typedef {"default" | "cart"} DrawerDialogWidth */
/** @typedef {"default" | "stacked"} DrawerFooterVariant */
/** @typedef {"default" | "near-fullscreen"} ModalViewportFit */
/** @typedef {"compact" | "standard" | "tall" | "expanded" | "document" | "viewport"} PDFViewHeight */
/** @typedef {"default" | "stacked" | "tile"} SurfaceCardBodyVariant */

export const DRAWER_DIALOG_WIDTH = /** @type {const} */ ({
  default: undefined,
  cart: "sm:max-w-md",
})

export const DRAWER_FOOTER_VARIANT = /** @type {const} */ ({
  default: undefined,
  stacked: "flex-col! items-stretch! justify-start! gap-3! border-t",
})

export const MODAL_VIEWPORT_FIT = /** @type {const} */ ({
  default: undefined,
  "near-fullscreen": "h-[92vh] w-[96vw] max-w-[96vw]",
})

export const PDF_VIEW_HEIGHT = /** @type {const} */ ({
  compact: "h-[200px]",
  standard: "h-[320px]",
  tall: "h-[400px]",
  expanded: "h-[420px]",
  document: "h-[560px]",
  viewport: "h-[84vh]",
})

export const SURFACE_CARD_BODY_VARIANT = /** @type {const} */ ({
  default: undefined,
  stacked: "flex flex-col gap-3",
  tile: "flex flex-col gap-3 overflow-hidden",
})

/**
 * @param {string} value
 * @param {Record<string, string | undefined>} table
 * @param {string} label
 */
function resolve(value, table, label) {
  if (!(value in table)) {
    throw new TypeError(`Invalid ${label}: ${JSON.stringify(value)}`)
  }
  return table[value]
}

/** @param {DrawerDialogWidth} [width="default"] */
export function resolveDrawerDialogWidth(width = "default") {
  return resolve(width, DRAWER_DIALOG_WIDTH, "DrawerDialogWidth")
}

/** @param {DrawerFooterVariant} [variant="default"] */
export function resolveDrawerFooterVariant(variant = "default") {
  return resolve(variant, DRAWER_FOOTER_VARIANT, "DrawerFooterVariant")
}

/** @param {ModalViewportFit} [fit="default"] */
export function resolveModalViewportFit(fit = "default") {
  return resolve(fit, MODAL_VIEWPORT_FIT, "ModalViewportFit")
}

/** @param {PDFViewHeight} [height="document"] */
export function resolvePDFViewHeight(height = "document") {
  return resolve(height, PDF_VIEW_HEIGHT, "PDFViewHeight")
}

/** @param {SurfaceCardBodyVariant} [variant="default"] */
export function resolveSurfaceCardBodyVariant(variant = "default") {
  return resolve(variant, SURFACE_CARD_BODY_VARIANT, "SurfaceCardBodyVariant")
}

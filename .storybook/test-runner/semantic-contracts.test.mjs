/**
 * BATCH 19 — focused tests for approved semantic contract resolvers.
 * Positive: exact class mappings. Negative: arbitrary CSS values rejected.
 */
import assert from "node:assert/strict"
import test from "node:test"
import {
    resolveDrawerDialogWidth,
    resolveDrawerFooterVariant,
    resolveModalViewportFit,
    resolvePDFViewHeight,
    resolveSurfaceCardBodyVariant,
    resolveSurfaceCardChromeVariant,
    DRAWER_DIALOG_WIDTH,
    DRAWER_FOOTER_VARIANT,
    MODAL_VIEWPORT_FIT,
    PDF_VIEW_HEIGHT,
    SURFACE_CARD_BODY_VARIANT,
    SURFACE_CARD_CHROME_VARIANT,
} from "../components/composites/_semantic-contracts.mjs"
import * as srcContracts from "../../src/components/composites/_semantic-contracts.mjs"

test("DrawerShell dialogWidth resolver", () => {
    assert.equal(resolveDrawerDialogWidth("default"), undefined)
    assert.equal(resolveDrawerDialogWidth("cart"), "sm:max-w-md")
    assert.equal(resolveDrawerDialogWidth(), undefined)
})

test("DrawerShell footerVariant resolver", () => {
    assert.equal(resolveDrawerFooterVariant("default"), undefined)
    assert.equal(
        resolveDrawerFooterVariant("stacked"),
        "flex-col! items-stretch! justify-start! gap-3! border-t",
    )
})

test("ModalShell viewportFit resolver", () => {
    assert.equal(resolveModalViewportFit("default"), undefined)
    assert.equal(resolveModalViewportFit("near-fullscreen"), "h-[92vh] w-[96vw] max-w-[96vw]")
})

test("PDFView height resolver", () => {
    assert.equal(resolvePDFViewHeight("compact"), "h-[200px]")
    assert.equal(resolvePDFViewHeight("standard"), "h-[320px]")
    assert.equal(resolvePDFViewHeight("tall"), "h-[400px]")
    assert.equal(resolvePDFViewHeight("expanded"), "h-[420px]")
    assert.equal(resolvePDFViewHeight("document"), "h-[560px]")
    assert.equal(resolvePDFViewHeight("viewport"), "h-[84vh]")
    assert.equal(resolvePDFViewHeight(), "h-[560px]")
})

test("SurfaceCard bodyVariant resolver (relative not duplicated)", () => {
    assert.equal(resolveSurfaceCardBodyVariant("default"), undefined)
    assert.equal(resolveSurfaceCardBodyVariant("stacked"), "flex flex-col gap-3")
    assert.equal(resolveSurfaceCardBodyVariant("tile"), "flex flex-col gap-3 overflow-hidden")
    assert.ok(!String(resolveSurfaceCardBodyVariant("tile")).includes("relative"))
})

test("SurfaceCard chromeVariant resolver (independent of bodyVariant)", () => {
    assert.equal(resolveSurfaceCardChromeVariant("default"), undefined)
    assert.equal(resolveSurfaceCardChromeVariant("tile"), "rounded-2xl shadow-field")
    assert.ok(!String(resolveSurfaceCardChromeVariant("tile")).includes("flex"))
    assert.notEqual(resolveSurfaceCardChromeVariant("tile"), resolveSurfaceCardBodyVariant("tile"))
})

test("negative: arbitrary CSS values are rejected", () => {
    assert.throws(() => resolveDrawerDialogWidth(/** @type {any} */ ("sm:max-w-lg")), /Invalid DrawerDialogWidth/)
    assert.throws(() => resolveDrawerFooterVariant(/** @type {any} */ ("flex-col")), /Invalid DrawerFooterVariant/)
    assert.throws(() => resolveModalViewportFit(/** @type {any} */ ("h-[92vh] w-[96vw] max-w-[96vw]")), /Invalid ModalViewportFit/)
    assert.throws(() => resolvePDFViewHeight(/** @type {any} */ ("h-[560px]")), /Invalid PDFViewHeight/)
    assert.throws(() => resolvePDFViewHeight(/** @type {any} */ ("h-[999px]")), /Invalid PDFViewHeight/)
    assert.throws(() => resolveSurfaceCardBodyVariant(/** @type {any} */ ("relative flex flex-col gap-3 overflow-hidden")), /Invalid SurfaceCardBodyVariant/)
    assert.throws(() => resolveSurfaceCardBodyVariant(/** @type {any} */ ("grid gap-3")), /Invalid SurfaceCardBodyVariant/)
    assert.throws(() => resolveSurfaceCardChromeVariant(/** @type {any} */ ("rounded-2xl shadow-field")), /Invalid SurfaceCardChromeVariant/)
    assert.throws(() => resolveSurfaceCardChromeVariant(/** @type {any} */ ("stacked")), /Invalid SurfaceCardChromeVariant/)
})

test("SB and src resolver tables stay identical", () => {
    assert.deepEqual(DRAWER_DIALOG_WIDTH, srcContracts.DRAWER_DIALOG_WIDTH)
    assert.deepEqual(DRAWER_FOOTER_VARIANT, srcContracts.DRAWER_FOOTER_VARIANT)
    assert.deepEqual(MODAL_VIEWPORT_FIT, srcContracts.MODAL_VIEWPORT_FIT)
    assert.deepEqual(PDF_VIEW_HEIGHT, srcContracts.PDF_VIEW_HEIGHT)
    assert.deepEqual(SURFACE_CARD_BODY_VARIANT, srcContracts.SURFACE_CARD_BODY_VARIANT)
    assert.deepEqual(SURFACE_CARD_CHROME_VARIANT, srcContracts.SURFACE_CARD_CHROME_VARIANT)
})

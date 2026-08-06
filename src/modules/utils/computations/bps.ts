import Decimal from "decimal.js"

const BPS_FACTOR = 10_000

/** Converts a Decimal fraction into basis points. */
export const decimalToBps = (decimal: Decimal): Decimal =>
    decimal.mul(BPS_FACTOR)
  
/** Converts basis points into a Decimal fraction. */
export const bpsToDecimal = (bps: Decimal): Decimal =>
    bps.div(BPS_FACTOR)
import Decimal from "decimal.js"
import BN from "bn.js"

type Pow10DecimalParams = {
  exponent: Decimal
  asBN?: false
}

type Pow10BNParams = {
  exponent: Decimal
  asBN: true
}

// overload signatures
/** Returns 10^exponent as Decimal or BN. */
export function pow10(params: Pow10BNParams): BN
/** Returns 10^exponent as Decimal or BN. */
export function pow10(params: Pow10DecimalParams): Decimal

// implementation
/** Returns 10^exponent as Decimal or BN. */
export function pow10({
    exponent,
    asBN,
}: Pow10BNParams | Pow10DecimalParams): BN | Decimal {
    if (asBN) {
        return new BN(10).pow(new BN(exponent.toFixed(0)))
    }
    return new Decimal(10).pow(exponent)
}
import { TickMath } from "@cetusprotocol/cetus-sui-clmm-sdk"
import Decimal from "decimal.js"

export const tickIndexToPrice = (tick: number, decimalsA: number, decimalsB: number) => {
    return TickMath.tickIndexToPrice(tick, decimalsA, decimalsB)
}

export const tickIndexToSqrtPriceX64 = (tick: number) => {
    return TickMath.tickIndexToSqrtPriceX64(tick)
}

export const binIdToPrice = (
    { binId, binStep, basisPointMax, decimalsA, decimalsB }: BinIdToPriceParams
) => {
    const rawPrice = new Decimal(1).add(new Decimal(binStep).div(basisPointMax)).pow(binId)
    const price = rawPrice.mul(
        new Decimal(10).pow(new Decimal(decimalsA).sub(decimalsB))
    )
    return price
}

export interface BinIdToPriceParams {
    binId: Decimal
    binStep: Decimal
    basisPointMax: Decimal
    decimalsA: Decimal
    decimalsB: Decimal
}
import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useDepositDisclosure = () => {
    const { deposit } = use(DiscloresureContext)!
    return deposit
}

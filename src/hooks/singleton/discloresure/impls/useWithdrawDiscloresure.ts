import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useWithdrawDisclosure = () => {
    const { withdraw } = use(DiscloresureContext)!
    return withdraw
}

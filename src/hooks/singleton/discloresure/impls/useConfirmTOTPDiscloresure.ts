import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useConfirmTOTPDisclosure = () => {
    const { confirmTOTP } = use(DiscloresureContext)!
    return confirmTOTP
}

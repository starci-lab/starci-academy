import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useMFAVerificationDisclosure = () => {
    const { mfaVerification } = use(DiscloresureContext)!
    return mfaVerification
}

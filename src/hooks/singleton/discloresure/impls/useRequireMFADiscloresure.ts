import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useRequireMFADisclosure = () => {
    const { requireMFA } = use(DiscloresureContext)!
    return requireMFA
}

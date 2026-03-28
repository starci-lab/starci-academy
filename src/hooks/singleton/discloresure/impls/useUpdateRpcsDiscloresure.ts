import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useUpdateRpcsDisclosure = () => {
    const { updateRpcs } = use(DiscloresureContext)!
    return updateRpcs
}

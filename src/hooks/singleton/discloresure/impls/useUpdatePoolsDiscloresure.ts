import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useUpdatePoolsDisclosure = () => {
    const { updatePools } = use(DiscloresureContext)!
    return updatePools
}

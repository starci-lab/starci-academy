import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useSelectPoolsDisclosure = () => {
    const { selectPools } = use(DiscloresureContext)!
    return selectPools
}

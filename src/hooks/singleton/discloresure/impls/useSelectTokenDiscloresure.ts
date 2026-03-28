import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useSelectTokenDisclosure = () => {
    const { selectToken } = use(DiscloresureContext)!
    return selectToken
}

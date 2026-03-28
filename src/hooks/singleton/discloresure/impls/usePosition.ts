import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const usePositionDisclosure = () => {
    const { position } = use(DiscloresureContext)!
    return position
}

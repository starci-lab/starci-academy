import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useSortByDisclosure = () => {
    const { sortBy } = use(DiscloresureContext)!
    return sortBy
}

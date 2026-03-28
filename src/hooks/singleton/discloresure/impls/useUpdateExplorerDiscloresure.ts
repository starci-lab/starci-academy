import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useUpdateExplorerDisclosure = () => {
    const { updateExplorer } = use(DiscloresureContext)!
    return updateExplorer
}

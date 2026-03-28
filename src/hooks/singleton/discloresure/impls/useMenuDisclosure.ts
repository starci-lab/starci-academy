import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useMenuDisclosure = () => {
    const { menu } = use(DiscloresureContext)!
    return menu
}

import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useContentDisclosure = () => {
    const { content } = use(DiscloresureContext)!
    return content
}

import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useLanguageDisclosure = () => {
    const { language } = use(DiscloresureContext)!
    return language
}

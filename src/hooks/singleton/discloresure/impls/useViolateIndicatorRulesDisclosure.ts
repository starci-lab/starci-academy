import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"
    
export const useViolateIndicatorRulesDisclosure = () => {
    const { violateIndicatorRules } = use(DiscloresureContext)!
    return violateIndicatorRules
}

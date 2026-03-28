import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useAdvancedConfigurationDisclosure = () => {
    const { advancedConfiguration } = use(DiscloresureContext)!
    return advancedConfiguration
}

import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useManageMFASettingsDisclosure = () => {
    const { manageMFASettings } = use(DiscloresureContext)!
    return manageMFASettings
}

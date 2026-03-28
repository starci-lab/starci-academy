import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useExportPrivateKeyDisclosure = () => {
    const { exportPrivateKey } = use(DiscloresureContext)!
    return exportPrivateKey
}

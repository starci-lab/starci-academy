import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useAccountMenuDisclosure = () => {
    const { accountMenu } = use(DiscloresureContext)!
    return accountMenu
}

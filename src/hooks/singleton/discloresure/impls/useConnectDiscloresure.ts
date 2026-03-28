import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useConnectDisclosure = () => {
    const { connect } = use(DiscloresureContext)!
    return connect
}

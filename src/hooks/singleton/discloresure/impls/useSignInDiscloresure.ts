import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useSignInDisclosure = () => {
    const { signIn } = use(DiscloresureContext)!
    return signIn
}

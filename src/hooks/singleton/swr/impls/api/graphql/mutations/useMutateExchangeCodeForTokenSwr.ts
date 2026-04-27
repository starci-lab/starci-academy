import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateExchangeCodeForTokenSwr = () => {
    const { mutateExchangeCodeForTokenSwr } = use(SwrContext)!
    return mutateExchangeCodeForTokenSwr
}

import { use } from "react"
import { SwrContext } from "../../../../SwrContext"

export const useMutateSignInInitSwr = () => {
    const { mutateSignInInitSwr } = use(SwrContext)!
    return mutateSignInInitSwr
}


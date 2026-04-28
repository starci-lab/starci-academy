import { use } from "react"
import { SwrContext } from "../../../../SwrContext"

export const useMutationSignOutSwr = () => {
    const { mutateSignOutSwr } = use(SwrContext)!
    return mutateSignOutSwr
}   
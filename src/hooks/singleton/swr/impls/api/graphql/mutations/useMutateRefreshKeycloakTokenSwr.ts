import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateRefreshKeycloakTokenSwr = () => {
    const { mutateRefreshKeycloakTokenSwr } = use(SwrContext)!
    return mutateRefreshKeycloakTokenSwr
}

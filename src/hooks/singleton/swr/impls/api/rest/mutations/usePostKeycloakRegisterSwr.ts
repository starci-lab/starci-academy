import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const usePostKeycloakRegisterSwr = () => {
    const { postKeycloakRegisterSwr } = use(SwrContext)!
    return postKeycloakRegisterSwr
}

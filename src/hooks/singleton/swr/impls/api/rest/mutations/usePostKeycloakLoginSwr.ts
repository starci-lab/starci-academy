import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const usePostKeycloakLoginSwr = () => {
    const { postKeycloakLoginSwr } = use(SwrContext)!
    return postKeycloakLoginSwr
}

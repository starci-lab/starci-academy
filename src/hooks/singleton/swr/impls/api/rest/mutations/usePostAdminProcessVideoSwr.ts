import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const usePostAdminProcessVideoSwr = () => {
    const { postAdminProcessVideoSwr } = use(SwrContext)!
    return postAdminProcessVideoSwr
}

import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const usePostAdminPresignedUrlSwr = () => {
    const { postAdminPresignedUrlSwr } = use(SwrContext)!
    return postAdminPresignedUrlSwr
}

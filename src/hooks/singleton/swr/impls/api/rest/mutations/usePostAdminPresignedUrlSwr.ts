import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for generating an admin pre-signed URL.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const usePostAdminPresignedUrlSwr = () => {
    const { postAdminPresignedUrlSwr } = use(SwrContext)!
    return postAdminPresignedUrlSwr
}

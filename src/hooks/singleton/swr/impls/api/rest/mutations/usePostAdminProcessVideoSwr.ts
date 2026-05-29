import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for triggering admin video processing.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const usePostAdminProcessVideoSwr = () => {
    const { postAdminProcessVideoSwr } = use(SwrContext)!
    return postAdminProcessVideoSwr
}

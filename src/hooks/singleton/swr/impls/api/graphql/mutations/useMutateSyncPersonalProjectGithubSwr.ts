import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for syncing the personal project GitHub URL.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateSyncPersonalProjectGithubSwr = () => {
    const { mutateSyncPersonalProjectGithubSwr } = use(SwrContext)!
    return mutateSyncPersonalProjectGithubSwr
}

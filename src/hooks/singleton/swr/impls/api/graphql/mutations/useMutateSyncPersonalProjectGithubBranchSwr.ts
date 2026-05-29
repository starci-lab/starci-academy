import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for syncing the personal project GitHub branch.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateSyncPersonalProjectGithubBranchSwr = () => {
    const { mutateSyncPersonalProjectGithubBranchSwr } = use(SwrContext)!
    return mutateSyncPersonalProjectGithubBranchSwr
}

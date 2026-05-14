import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateSyncPersonalProjectGithubBranchSwr = () => {
    const { mutateSyncPersonalProjectGithubBranchSwr } = use(SwrContext)!
    return mutateSyncPersonalProjectGithubBranchSwr
}

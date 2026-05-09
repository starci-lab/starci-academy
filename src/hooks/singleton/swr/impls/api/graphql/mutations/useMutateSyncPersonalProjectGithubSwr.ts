import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateSyncPersonalProjectGithubSwr = () => {
    const { mutateSyncPersonalProjectGithubSwr } = use(SwrContext)!
    return mutateSyncPersonalProjectGithubSwr
}

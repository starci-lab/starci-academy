import { querySavedContents } from "@/modules/api"
import useSWR from "swr"

export const useQuerySavedContentsSwrCore = () => {
    // SWR to fetch user saved contents, no params needed (it takes skip=0, take=20 by default for now)
    const swr = useSWR(
        ["QUERY_SAVED_CONTENTS_SWR"],
        async () => {
            const data = await querySavedContents({
                request: {},
            })
            if (!data?.data?.savedContents?.data) {
                throw new Error("Failed to fetch saved contents")
            }
            return data.data.savedContents.data
        },
    )
    return swr
}

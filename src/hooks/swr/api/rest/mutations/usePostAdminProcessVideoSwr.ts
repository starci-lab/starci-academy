import {
    adminProcessVideo,
    type AdminProcessVideoParams,
    type AdminProcessVideoResponse,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

/**
 * SWR mutation wrapper for {@link adminProcessVideo}.
 */
export const usePostAdminProcessVideoSwr = () => {
    const swr = useSWRMutation<
        AdminProcessVideoResponse,
        Error,
        string,
        AdminProcessVideoParams
    >(
        "POST_ADMIN_PROCESS_VIDEO_SWR",
        async (_key, { arg }) => {
            return adminProcessVideo(arg)
        }
    )
    return swr
}

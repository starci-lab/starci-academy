import {
    adminPresignedUrl,
    type AdminPresignedUrlParams,
    type AdminPresignedUrlResponse,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

/**
 * SWR mutation wrapper for {@link adminPresignedUrl}.
 */
export const usePostAdminPresignedUrlSwr = () => {
    const swr = useSWRMutation<
        AdminPresignedUrlResponse,
        Error,
        string,
        AdminPresignedUrlParams
    >(
        "POST_ADMIN_PRESIGNED_URL_SWR",
        async (_key, { arg }) => {
            return adminPresignedUrl(arg)
        }
    )
    return swr
}

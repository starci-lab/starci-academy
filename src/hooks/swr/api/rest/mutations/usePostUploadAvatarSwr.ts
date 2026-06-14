import {
    uploadAvatar,
    type UploadAvatarParams,
    type UploadAvatarResponse,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

/**
 * SWR mutation wrapper for {@link uploadAvatar} (multipart avatar upload).
 */
export const usePostUploadAvatarSwr = () => {
    const swr = useSWRMutation<
        UploadAvatarResponse,
        Error,
        string,
        UploadAvatarParams
    >(
        "POST_UPLOAD_AVATAR_SWR",
        async (_key, { arg }) => {
            return uploadAvatar(arg)
        }
    )
    return swr
}

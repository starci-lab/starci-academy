import { publicEnv } from "@/resources/env"
import { LocalStorage, LocalStorageId } from "@/modules/storage"
import { getCachedFingerprint } from "../../fingerprint"
import type { UploadAvatarResponse } from "./types"
import axios from "axios"

/** Params for the avatar-upload REST call. */
export interface UploadAvatarParams {
    /** The image file selected by the user. */
    file: File
    /** Optional abort signal (forwarded to axios). */
    signal?: AbortSignal
}

/**
 * Uploads the current user's avatar to `POST /api/v1/profile/avatar` (multipart).
 *
 * Authenticates with the same Bearer access token the GraphQL stack uses
 * (read from LocalStorage) plus the device fingerprint header; cookies are
 * forwarded for session validation. The endpoint stores the image in S3,
 * persists the URL on the user, and returns the public URL.
 *
 * @param params - The selected file (and optional abort signal).
 * @returns The public avatar URL on success; throws on failure.
 */
export const uploadAvatar = async ({
    file,
    signal,
}: UploadAvatarParams): Promise<UploadAvatarResponse> => {
    // build the multipart body — the BE expects the field name "file"
    const form = new FormData()
    form.append("file", file)

    // mirror the GraphQL auth: Bearer access token from LocalStorage
    const accessToken = LocalStorage.getItemAsString(LocalStorageId.KeycloakAccessToken)
    // device fingerprint backs the session-bound device check on the server
    const fingerprint = getCachedFingerprint()

    // POST to the avatar endpoint under the API base (already includes /api/v1)
    const url = `${publicEnv().api.http}/profile/avatar`
    const response = await axios.post<UploadAvatarResponse>(
        url,
        form,
        {
            // forward the session cookie so the server can validate the device
            withCredentials: true,
            headers: {
                // let the browser set the multipart boundary itself
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                ...(fingerprint ? { "x-device-fingerprint": fingerprint } : {}),
            },
            signal,
        },
    )

    return response.data
}

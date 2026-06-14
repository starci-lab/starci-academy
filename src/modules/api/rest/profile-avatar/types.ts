/**
 * Request / response shapes for the avatar-upload REST endpoint.
 */

/** Payload returned on a successful avatar upload (RestTransform `data`). */
export interface UploadAvatarData {
    /** Public URL of the uploaded avatar (also persisted on the user). */
    url: string
}

/** Full envelope returned by `POST /api/v1/profile/avatar`. */
export interface UploadAvatarResponse {
    /** Whether the upload succeeded. */
    success?: boolean
    /** Human-readable status message. */
    message?: string
    /** The uploaded avatar payload. */
    data: UploadAvatarData
}

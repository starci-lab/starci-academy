import { publicEnv } from "@/resources/env/public"

/** Navigates the browser to the backend Google Keycloak redirect endpoint. */
export const redirectToGoogleAuth = async () => {
    const url = `${publicEnv().api.http}/keycloak/google/redirect`
    window.location.href = url
}
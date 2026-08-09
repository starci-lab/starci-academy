import { publicEnv } from "@/resources/env/public"

/** Absolute URL for the backend GitHub OAuth redirect endpoint. */
export const githubRedirect = {
    redirect: new URL(`${publicEnv().api.http}/github/oauth/redirect`)
}
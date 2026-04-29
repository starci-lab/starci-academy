import { publicEnv } from "@/resources"

export const githubRedirect = {
    redirect: new URL(`${publicEnv().api.http}/github/oauth/redirect`)
}
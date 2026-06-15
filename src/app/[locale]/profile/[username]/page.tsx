import React from "react"
import type { Metadata } from "next"
import { publicEnv } from "@/resources"
import {
    PublicProfile,
} from "@/components/layouts/profile/PublicProfile"

/** Route params for the public profile page. */
interface ProfilePageParams {
    /** Active locale segment. */
    locale: string
    /** Target user's username (the URL handle). */
    username: string
}

/** Minimal userProfile query used only to build share metadata (server-side). */
const USER_PROFILE_META_QUERY =
    "query($username:String!){userProfile(username:$username){data{username displayName bio avatar profileLocked}}}"

/**
 * Build per-user share metadata (title + description + Open Graph / Twitter card)
 * so a `/profile/<username>` link unfurls with the person's name + avatar on
 * social. Fetches the public profile server-side (no auth needed); a locked
 * profile keeps a neutral description (its bio is private). Falls back to a
 * generic title if the user is missing or the API is unreachable.
 *
 * @param props.params - the awaited route params (locale + username).
 * @returns the page metadata.
 */
export const generateMetadata = async ({
    params,
}: {
    params: Promise<ProfilePageParams>
}): Promise<Metadata> => {
    const { username } = await params
    try {
        // public read of the profile header, server-side, never cached
        const response = await fetch(publicEnv().api.graphql, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: USER_PROFILE_META_QUERY,
                variables: {
                    username,
                },
            }),
            cache: "no-store",
        })
        const payload = await response.json()
        const user = payload?.data?.userProfile?.data
        // unknown user → generic title (the page itself renders a 404 state)
        if (!user) {
            return {
                title: "Profile · StarCi Academy",
            }
        }
        // prefer the display name; fall back to the username
        const name = user.displayName?.trim() ? user.displayName : user.username
        const title = `${name} (@${user.username}) · StarCi Academy`
        // a locked profile hides its bio → keep the description neutral
        const description = (!user.profileLocked && user.bio?.trim())
            ? user.bio
            : `${name} on StarCi Academy`
        // avatar (when set) becomes the share image
        const images = user.avatar ? [{ url: user.avatar }] : []
        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images,
                type: "profile",
            },
            twitter: {
                card: "summary",
                title,
                description,
                images: user.avatar ? [user.avatar] : [],
            },
        }
    } catch {
        // API unreachable / malformed response → generic title, never throw
        return {
            title: "Profile · StarCi Academy",
        }
    }
}

/**
 * Route `/[locale]/profile/[username]` — any user's public, GitHub-style profile
 * (viewable by anyone), addressed by username like `github.com/<username>`. This
 * is a server component (for `generateMetadata`); it renders the client
 * `PublicProfile`, which reads the username from the route itself.
 *
 * Static `/profile/*` children (edit, bookmarks, sessions, …) take precedence
 * over this dynamic segment in Next routing, so the viewer's own profile hub and
 * its sub-pages are unaffected.
 */
const Page = () => {
    return <PublicProfile />
}

export default Page

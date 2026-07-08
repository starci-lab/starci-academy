"use client"

import useSWR from "swr"
import {
    queryMyPickableCvAchievements,
} from "@/modules/api/graphql/queries/query-my-pickable-cv-achievements"
import { useAppSelector } from "@/redux/hooks"

/**
 * Loads the signed-in user's pickable StarCi capstone projects (the "pick from
 * StarCi" source for the CV block editor). Verified content by construction —
 * every item exists only because a real passed capstone does.
 *
 * @param enabled - Gate the fetch (e.g. only when the CV editor is visible).
 */
export const useQueryMyPickableCvAchievementsSwr = (enabled = true) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWR(
        authenticated && enabled
            ? [
                "QUERY_MY_PICKABLE_CV_ACHIEVEMENTS_SWR",
                authenticated,
            ]
            : null,
        async () => {
            const response = await queryMyPickableCvAchievements({
                debug: false,
            })

            const payload = response.data?.myPickableCvAchievements?.data
            if (!payload) {
                throw new Error("Pickable CV achievements not found")
            }

            return payload
        },
    )

    return swr
}

import useSWR from "swr"
import { queryPublicUserCv } from "@/modules/api/graphql/queries/query-public-user-cv"

/**
 * SWR query wrapper for {@link queryPublicUserCv}. `data` is the user's ONE
 * public CV (`{ id, label, pdfUrl, updatedAt }`) or `null` when they have no
 * public CV. Keyed by username; runs for anonymous viewers too (public read).
 * Powers the `/profile/<username>/cv` public view and the CV-tab gate.
 *
 * @param username - the username whose public CV to fetch.
 */
export const useQueryPublicUserCvSwr = (username: string | null | undefined) => {
    return useSWR(
        username ? ["QUERY_PUBLIC_USER_CV_SWR", username] : null,
        async () => {
            const data = await queryPublicUserCv({
                request: {
                    username: username as string,
                },
            })
            if (!data || !data.data) {
                throw new Error("Failed to fetch public CV")
            }
            // `data` is intentionally nullable — null = the user has no public CV.
            return data.data.publicUserCv?.data ?? null
        },
    )
}

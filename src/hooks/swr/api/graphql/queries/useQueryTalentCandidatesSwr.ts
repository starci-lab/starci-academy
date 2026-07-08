import useSWR from "swr"
import { queryTalentCandidates } from "@/modules/api/graphql/queries/query-talent-candidates"

/** Recruiter-marketplace page size. */
const PAGE_LIMIT = 24

/**
 * SWR hook for the recruiter marketplace: open-to-work candidates FILTERED to one
 * track (`courseId`) and RANKED by that track's `depthScore` DESC — the ordering
 * is done server-side, so simply changing `courseId` re-keys the request and
 * fetches the freshly re-ranked list (no client-side re-sort). Public — works for
 * anonymous viewers. Pass null/undefined `courseId` to disable (e.g. before a
 * track is chosen). Returns the page of `{ user, track }` items (empty array on
 * absent data).
 *
 * @param courseId - the track to filter + rank on; null/undefined disables the query
 * @param offset - rows to skip (offset pagination); defaults to 0
 * @returns the SWR handle (data = array of ranked candidates for the track)
 */
export const useQueryTalentCandidatesSwr = (
    courseId: string | null | undefined,
    offset = 0,
) => {
    const swr = useSWR(
        courseId ? ["QUERY_TALENT_CANDIDATES_SWR", courseId, offset] : null,
        async () => {
            const data = await queryTalentCandidates({
                request: {
                    courseId: courseId as string,
                    limit: PAGE_LIMIT,
                    offset,
                },
            })
            if (!data || !data.data) {
                throw new Error("Failed to fetch talent candidates")
            }
            return data.data.talentCandidates?.data ?? []
        },
    )
    return swr
}

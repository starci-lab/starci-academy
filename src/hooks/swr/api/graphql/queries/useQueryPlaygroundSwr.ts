import useSWR from "swr"
import { queryPlayground } from "@/modules/api/graphql/queries/playground"

/**
 * Loads one Playground exercise by slug (guided steps + command hints) for
 * the session work surface.
 * @param slug - the playground's URL slug, or `undefined` while the route param is resolving.
 */
export const useQueryPlaygroundSwr = (slug: string | undefined) => {
    const swr = useSWR(
        slug
            ? [
                "QUERY_PLAYGROUND_SWR",
                slug,
            ]
            : null,
        async () => {
            if (!slug) {
                throw new Error("Playground slug not found")
            }
            const data = await queryPlayground({
                request: { slug },
            })
            return data.data?.playground.data ?? null
        },
    )
    return swr
}

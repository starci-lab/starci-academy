import useSWR from "swr"
import { queryBlogPost } from "@/modules/api/graphql/queries/query-blog-post"
import type { QueryBlogPostDetail } from "@/modules/api/graphql/queries/types/blog"

/**
 * SWR hook for the public `/blog/[slug]` article. Keyed by `slug` so navigating
 * between articles re-fetches; `data` is `null` when no published post matches.
 *
 * @param slug - the `/blog/[slug]` route segment
 * @returns the SWR handle (data = QueryBlogPostDetail | null | undefined, isLoading, error, mutate)
 */
export const useQueryBlogPostSwr = (slug: string) => {
    return useSWR<QueryBlogPostDetail | null>(
        slug ? ["QUERY_BLOG_POST_SWR", slug] : null,
        async () => {
            const response = await queryBlogPost({ request: { slug } })
            return response.data?.blogPost.data ?? null
        },
    )
}

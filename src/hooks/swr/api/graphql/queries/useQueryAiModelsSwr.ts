import { usePathname, useSearchParams } from "next/navigation"
import useSWR from "swr"
import { queryAiModels } from "@/modules/api/graphql/queries/query-ai-models"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setAiModels } from "@/redux/slices/ai-models"

/**
 * SWR query core for the AI models query. Returns the viewer's tier-scoped model
 * list, so it only runs once the viewer is authenticated. Only fetches under `/learn`,
 * the standalone `/profile/cv` route, or the public profile's `?tab=cv` mode (the CV
 * workspace also renders there — see {@link ProfileCvTab} — since the
 * "unify edit into ?tab=cv&edit=true mode" change; the CV picker lives on a query
 * param there, not a path segment, so `pathname` alone can't detect it) —
 * (consumers: StarciAi + ChallengeModal submission panel + the CV generation model
 * picker) — avoids fetching on every other page.
 * @returns the SWR query handle.
 */
export const useQueryAiModelsSwr = () => {
    const dispatch = useAppDispatch()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const onLearnPage = pathname.includes("/learn")
    const onCvPage = pathname.includes("/profile/cv") || searchParams.get("tab") === "cv"

    const swr = useSWR(
        authenticated && (onLearnPage || onCvPage) ? ["QUERY_AI_MODELS_SWR"] : null,
        async () => {
            const data = await queryAiModels({})

            if (!data || !data.data) {
                throw new Error("Failed to fetch AI models")
            }

            const result = data.data.aiModels?.data
            if (result) {
                dispatch(setAiModels({
                    tier: result.tier,
                    models: result.models,
                }))
            }

            return data.data
        },
    )

    return swr
}

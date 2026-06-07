import { useEffect } from "react"
import { useAppDispatch } from "@/redux"
import { setContent } from "@/redux/slices"
import { useQueryContentSwr } from "@/hooks/swr"

/**
 * Mirrors the content SWR result into Redux `content.entity` so every Redux reader stays in sync —
 * INCLUDING cache hits (e.g. navigating back to an already-viewed lesson), where the SWR fetcher
 * does not re-run and so could not dispatch on its own.
 *
 * Lives in `effects/` (the URL/SWR → Redux sync family, like `useSyncReduxContentId`), not inside
 * the SWR hook. Mounted once globally via `UseEffects`.
 * @returns void
 */
export const useSyncReduxContent = () => {
    const dispatch = useAppDispatch()
    const { data } = useQueryContentSwr()
    useEffect(
        () => {
            if (data) {
                dispatch(setContent(data))
            }
        },
        [
            data,
            dispatch,
        ],
    )
}

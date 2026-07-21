import { useEffect } from "react"
import { TopLoader } from "@/components/blocks/layout/TopLoader"

/** Fire a fake navigation (pushState) right after mount, to demonstrate the
 *  loader bar running rather than sitting still and invisible. */
export const TriggerNavigation = () => {
    useEffect(() => {
        window.history.pushState({}, "", window.location.href)
    }, [])
    return <TopLoader />
}

/** Force `prefers-reduced-motion: reduce` then fire a fake navigation, to
 *  demonstrate the branch with no trickle effect. */
export const TriggerReducedMotion = () => {
    useEffect(() => {
        const original = window.matchMedia
        window.matchMedia = (query: string) =>
            ({
                ...original(query),
                matches: query.includes("prefers-reduced-motion"),
            }) as MediaQueryList
        window.history.pushState({}, "", window.location.href)
        return () => {
            window.matchMedia = original
        }
    }, [])
    return <TopLoader />
}

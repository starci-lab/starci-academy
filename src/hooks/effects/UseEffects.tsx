import React from "react"
import { useSyncReduxCourseId } from "./useSyncReduxCourseId"
import { useSetCookie } from "./useSetCookie"

export const UseEffects = () => {
    /** The useEffect to sync the redux course id. */
    useSyncReduxCourseId()
    useSetCookie()
    return (
        <></>
    )
}
import React from "react"
import { useSyncReduxCourseId } from "./useSyncReduxCourseId"
import { useSetCookie } from "./useSetCookie"
import { useSyncReduxModuleId } from "./useSyncReduxModuleId"

export const UseEffects = () => {
    /** The useEffect to sync the redux course id. */
    useSyncReduxCourseId()
    /** The useEffect to sync the redux module id. */
    useSyncReduxModuleId()
    /** The useEffect to set the cookie. */
    useSetCookie()
    return (
        <></>
    )
}
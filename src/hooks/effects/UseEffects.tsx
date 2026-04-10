import React from "react"
import { useSyncReduxCourseId } from "./useSyncReduxCourseId"
import { useSetCookie } from "./useSetCookie"
import { useSyncReduxModuleId } from "./useSyncReduxModuleId"
import { useSetTabQuery } from "./useSetTabQuery"

export const UseEffects = () => {
    /** The useEffect to sync the redux course id. */
    useSyncReduxCourseId()
    /** The useEffect to sync the redux module id. */
    useSyncReduxModuleId()
    /** The useEffect to set the cookie. */
    useSetCookie()
    /** The useEffect to set the tab query. */
    useSetTabQuery()
    return (
        <></>
    )
}
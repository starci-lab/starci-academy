import React from "react"
import { useSyncReduxCourseId } from "./useSyncReduxCourseId"
import { useSyncReduxModuleId } from "./useSyncReduxModuleId"
import { useSetTabQuery } from "./useSetTabQuery"
import { useSidebar } from "./useSidebar"
import { useSyncReduxContentId } from "./useSyncReduxContentId"
import { useDefaultRedirect } from "./useDefaultRedirect"
import { useExchangeCodeForToken } from "./useExchangeCodeForToken"

export const UseEffects = () => {
    /** The useEffect to sync the redux course id. */
    useSyncReduxCourseId()
    /** The useEffect to sync the redux module id. */
    useSyncReduxModuleId()
    /** The useEffect to sync the redux content id. */
    useSyncReduxContentId()
    /** The useEffect to set the tab query. */
    useSetTabQuery()
    /** The useEffect to sync sidebar selection and route. */
    useSidebar()
    /** The useEffect to redirect to the default path. */
    useDefaultRedirect()
    /** OIDC: exchange `code` from Keycloak redirect for app tokens. */
    useExchangeCodeForToken()
    return (
        <></>
    )
}
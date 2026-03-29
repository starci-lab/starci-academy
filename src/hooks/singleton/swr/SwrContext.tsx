"use client"
import React, { PropsWithChildren, useMemo } from "react"
import { createContext } from "react"
import {
    useQueryCourseSwrCore,
    useQueryCoursesSwrCore,
    useQueryUserSwrCore,
} from "./core"

export interface SwrContextType {
    queryCourseSwr: ReturnType<typeof useQueryCourseSwrCore>;
    queryCoursesSwr: ReturnType<typeof useQueryCoursesSwrCore>;
    queryUserSwr: ReturnType<typeof useQueryUserSwrCore>;
}

export const SwrContext = createContext<SwrContextType | null>(null)

export const SwrProvider = ({ children }: PropsWithChildren) => {
    const queryCourseSwr = useQueryCourseSwrCore()
    const queryCoursesSwr = useQueryCoursesSwrCore()
    const queryUserSwr = useQueryUserSwrCore()
    const values = useMemo(
        () => ({
            queryCourseSwr,
            queryCoursesSwr,
            queryUserSwr,
        }),
        [queryCourseSwr, queryCoursesSwr, queryUserSwr]
    )
    return (
        <SwrContext.Provider value={values}>
            {children}
        </SwrContext.Provider>
    )
}

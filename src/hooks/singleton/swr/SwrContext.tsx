"use client"
import React, { PropsWithChildren, useMemo } from "react"
import { createContext } from "react"
import {
    useQueryCourseSwrCore,
    useQueryCoursesSwrCore,
} from "./core"

export interface SwrContextType {
    queryCourseSwr: ReturnType<typeof useQueryCourseSwrCore>;
    queryCoursesSwr: ReturnType<typeof useQueryCoursesSwrCore>;
}

export const SwrContext = createContext<SwrContextType | null>(null)

export const SwrProvider = ({ children }: PropsWithChildren) => {
    const queryCourseSwr = useQueryCourseSwrCore()
    const queryCoursesSwr = useQueryCoursesSwrCore()
    const values = useMemo(() => ({
        queryCourseSwr,
        queryCoursesSwr,
    }), [
        queryCourseSwr,
        queryCoursesSwr,
    ])
    return (
        <SwrContext.Provider
            value={values}
        >
            {children}
        </SwrContext.Provider>
    )
}

"use client"
import React, { PropsWithChildren, useMemo } from "react"
import { createContext } from "react"
import {
    useMutateCourseEnrollSwrCore,
    useQueryChallengeSwrCore,
    useQueryChallengesSwrCore,
    useQueryContentSwrCore,
    useQueryContentsSwrCore,
    useQueryCourseEnrollmentStatusSwrCore,
    useQueryCourseSwrCore,
    useQueryCoursesSwrCore,
    useQueryLessonVideoSwrCore,
    useQueryLessonVideosSwrCore,
    useQueryUserSwrCore,
    useQueryModuleSwrCore,
} from "./core"

export interface SwrContextType {
    queryCourseSwr: ReturnType<typeof useQueryCourseSwrCore>;
    queryCourseEnrollmentStatusSwr: ReturnType<typeof useQueryCourseEnrollmentStatusSwrCore>;
    queryCoursesSwr: ReturnType<typeof useQueryCoursesSwrCore>;
    queryUserSwr: ReturnType<typeof useQueryUserSwrCore>;
    mutateCourseEnrollSwr: ReturnType<typeof useMutateCourseEnrollSwrCore>;
    queryModuleSwr: ReturnType<typeof useQueryModuleSwrCore>;
    queryContentSwr: ReturnType<typeof useQueryContentSwrCore>;
    queryLessonVideo: ReturnType<typeof useQueryLessonVideoSwrCore>;
    queryChallengeSwr: ReturnType<typeof useQueryChallengeSwrCore>;
    queryContentsSwr: ReturnType<typeof useQueryContentsSwrCore>;
    queryLessonVideosSwr: ReturnType<typeof useQueryLessonVideosSwrCore>;
    queryChallengesSwr: ReturnType<typeof useQueryChallengesSwrCore>;
}

export const SwrContext = createContext<SwrContextType | null>(null)

export const SwrProvider = ({ children }: PropsWithChildren) => {
    const queryCourseSwr = useQueryCourseSwrCore()
    const queryCourseEnrollmentStatusSwr = useQueryCourseEnrollmentStatusSwrCore()
    const queryCoursesSwr = useQueryCoursesSwrCore()
    const queryUserSwr = useQueryUserSwrCore()
    const mutateCourseEnrollSwr = useMutateCourseEnrollSwrCore()
    const queryModuleSwr = useQueryModuleSwrCore()
    const queryContentSwr = useQueryContentSwrCore()
    const queryLessonVideo = useQueryLessonVideoSwrCore()
    const queryChallengeSwr = useQueryChallengeSwrCore()
    const queryContentsSwr = useQueryContentsSwrCore()
    const queryLessonVideosSwr = useQueryLessonVideosSwrCore()
    const queryChallengesSwr = useQueryChallengesSwrCore()
    const values = useMemo(
        () => ({
            queryCourseSwr,
            queryCourseEnrollmentStatusSwr,
            queryCoursesSwr,
            queryUserSwr,
            mutateCourseEnrollSwr,
            queryModuleSwr,
            queryContentSwr,
            queryLessonVideo,
            queryChallengeSwr,
            queryContentsSwr,
            queryLessonVideosSwr,
            queryChallengesSwr,
        }),
        [
            queryCourseSwr,
            queryCourseEnrollmentStatusSwr,
            queryCoursesSwr,
            queryUserSwr,
            mutateCourseEnrollSwr,
            queryModuleSwr,
            queryContentSwr,
            queryLessonVideo,
            queryChallengeSwr,
            queryContentsSwr,
            queryLessonVideosSwr,
            queryChallengesSwr,
        ]
    )
    return (
        <SwrContext.Provider value={values}>
            {children}
        </SwrContext.Provider>
    )
}

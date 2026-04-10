"use client"
import React, { PropsWithChildren, useMemo } from "react"
import { createContext } from "react"
import {
    useMutateCourseEnrollSwrCore,
    useMutateSubmitChallengeSubmissionsSwrCore,
    useMutateSyncChallengeSubmissionsSwrCore,
    useQueryChallengeSwrCore,
    useQueryChallengesSwrCore,
    useQueryContentSwrCore,
    useQueryContentsSwrCore,
    useQueryCourseEnrollmentStatusSwrCore,
    useQueryCourseSwrCore,
    useQueryCoursesSwrCore,
    useQueryLessonVideoSwrCore,
    useQueryLessonVideosSwrCore,
    useQueryLivestreamSessionsSwrCore,
    useQueryUserSwrCore,
    useQueryModuleSwrCore,
    useQueryChallengeSubmissionsSwrCore,
    useQuerySubmissionAttemptsSwrCore,
    useQuerySubmissionFeedbacksSwrCore,
} from "./core"

export interface SwrContextType {
    queryCourseSwr: ReturnType<typeof useQueryCourseSwrCore>;
    queryCourseEnrollmentStatusSwr: ReturnType<typeof useQueryCourseEnrollmentStatusSwrCore>;
    queryCoursesSwr: ReturnType<typeof useQueryCoursesSwrCore>;
    queryUserSwr: ReturnType<typeof useQueryUserSwrCore>;
    mutateCourseEnrollSwr: ReturnType<typeof useMutateCourseEnrollSwrCore>;
    mutateSyncChallengeSubmissionsSwr: ReturnType<typeof useMutateSyncChallengeSubmissionsSwrCore>;
    mutateSubmitChallengeSubmissionsSwr: ReturnType<typeof useMutateSubmitChallengeSubmissionsSwrCore>;
    queryModuleSwr: ReturnType<typeof useQueryModuleSwrCore>;
    queryContentSwr: ReturnType<typeof useQueryContentSwrCore>;
    queryLessonVideo: ReturnType<typeof useQueryLessonVideoSwrCore>;
    queryChallengeSwr: ReturnType<typeof useQueryChallengeSwrCore>;
    queryContentsSwr: ReturnType<typeof useQueryContentsSwrCore>;
    queryLessonVideosSwr: ReturnType<typeof useQueryLessonVideosSwrCore>;
    queryLivestreamSessionsSwr: ReturnType<typeof useQueryLivestreamSessionsSwrCore>;
    queryChallengesSwr: ReturnType<typeof useQueryChallengesSwrCore>;
    queryChallengeSubmissionsSwr: ReturnType<typeof useQueryChallengeSubmissionsSwrCore>;
    querySubmissionAttemptsSwr: ReturnType<typeof useQuerySubmissionAttemptsSwrCore>;
    querySubmissionFeedbacksSwr: ReturnType<typeof useQuerySubmissionFeedbacksSwrCore>;
}

export const SwrContext = createContext<SwrContextType | null>(null)

export const SwrProvider = ({ children }: PropsWithChildren) => {
    const queryCourseSwr = useQueryCourseSwrCore()
    const queryCourseEnrollmentStatusSwr = useQueryCourseEnrollmentStatusSwrCore()
    const queryCoursesSwr = useQueryCoursesSwrCore()
    const queryUserSwr = useQueryUserSwrCore()
    const mutateCourseEnrollSwr = useMutateCourseEnrollSwrCore()
    const mutateSyncChallengeSubmissionsSwr =
        useMutateSyncChallengeSubmissionsSwrCore()
    const mutateSubmitChallengeSubmissionsSwr =
        useMutateSubmitChallengeSubmissionsSwrCore()
    const queryModuleSwr = useQueryModuleSwrCore()
    const queryContentSwr = useQueryContentSwrCore()
    const queryLessonVideo = useQueryLessonVideoSwrCore()
    const queryChallengeSwr = useQueryChallengeSwrCore()
    const queryContentsSwr = useQueryContentsSwrCore()
    const queryLessonVideosSwr = useQueryLessonVideosSwrCore()
    const queryLivestreamSessionsSwr = useQueryLivestreamSessionsSwrCore()
    const queryChallengesSwr = useQueryChallengesSwrCore()
    const queryChallengeSubmissionsSwr = useQueryChallengeSubmissionsSwrCore()
    const querySubmissionAttemptsSwr = useQuerySubmissionAttemptsSwrCore()
    const querySubmissionFeedbacksSwr = useQuerySubmissionFeedbacksSwrCore()
    const values = useMemo(
        () => ({
            queryCourseSwr,
            queryCourseEnrollmentStatusSwr,
            queryCoursesSwr,
            queryUserSwr,
            mutateCourseEnrollSwr,
            mutateSyncChallengeSubmissionsSwr,
            mutateSubmitChallengeSubmissionsSwr,
            queryModuleSwr,
            queryContentSwr,
            queryLessonVideo,
            queryChallengeSwr,
            queryContentsSwr,
            queryLessonVideosSwr,
            queryLivestreamSessionsSwr,
            queryChallengesSwr,
            queryChallengeSubmissionsSwr,
            querySubmissionAttemptsSwr,
            querySubmissionFeedbacksSwr,
        }),
        [
            queryCourseSwr,
            queryCourseEnrollmentStatusSwr,
            queryCoursesSwr,
            queryUserSwr,
            mutateCourseEnrollSwr,
            mutateSyncChallengeSubmissionsSwr,
            mutateSubmitChallengeSubmissionsSwr,
            queryModuleSwr,
            queryContentSwr,
            queryLessonVideo,
            queryChallengeSwr,
            queryContentsSwr,
            queryLessonVideosSwr,
            queryLivestreamSessionsSwr,
            queryChallengesSwr,
            queryChallengeSubmissionsSwr,
            querySubmissionAttemptsSwr,
            querySubmissionFeedbacksSwr,
        ]
    )
    return (
        <SwrContext.Provider value={values}>
            {children}
        </SwrContext.Provider>
    )
}

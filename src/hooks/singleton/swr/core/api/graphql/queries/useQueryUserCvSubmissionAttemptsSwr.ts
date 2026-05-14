import {
    defaultUserCvSubmissionAttemptsSorts,
    queryUserCvSubmissionAttempts,
} from "@/modules/api"
import { useCvSubmissionAttemptsDrawerOverlayState } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { useState } from "react"
import useSWR from "swr"

export const USER_CV_SUBMISSION_ATTEMPTS_PAGE_SIZE = 5

/**
 * Loads paginated CV submission attempts for the current user (singleton SWR).
 * Fetches only while the CV attempts drawer overlay is open.
 */
export const useQueryUserCvSubmissionAttemptsSwrCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const { isOpen } = useCvSubmissionAttemptsDrawerOverlayState()
    const [pageNumber, setPageNumber] = useState(0)
    const swr = useSWR(
        authenticated && isOpen
            ? [
                "QUERY_USER_CV_SUBMISSION_ATTEMPTS_SWR",
                authenticated,
                isOpen,
                pageNumber,
            ]
            : null,
        async () => {
            const response = await queryUserCvSubmissionAttempts({
                debug: false,
                request: {
                    filters: {
                        limit: USER_CV_SUBMISSION_ATTEMPTS_PAGE_SIZE,
                        pageNumber,
                        sorts: defaultUserCvSubmissionAttemptsSorts,
                    },
                },
            })

            const payload = response.data?.userCvSubmissionAttempts?.data
            if (!payload) {
                throw new Error("CV submission attempts not found")
            }

            return payload
        },
        {
            refreshInterval: (data) => {
                const latest = data?.data?.[0]
                if (
                    latest?.status === "Pending" ||
                    latest?.status === "Uploaded" ||
                    latest?.status === "Analysing"
                ) {
                    return 3000
                }
                return 0
            },
        },
    )

    return {
        ...swr,
        pageNumber,
        setPageNumber,
        pageSize: USER_CV_SUBMISSION_ATTEMPTS_PAGE_SIZE,
    }
}

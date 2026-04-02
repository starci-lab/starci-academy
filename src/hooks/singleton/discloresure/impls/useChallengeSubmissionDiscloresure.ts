import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useChallengeSubmissionDisclosure = () => {
    const { challengeSubmission } = use(DiscloresureContext)!
    return challengeSubmission
}

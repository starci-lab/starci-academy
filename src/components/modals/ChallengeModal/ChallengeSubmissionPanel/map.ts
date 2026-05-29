import {
    SiGithub,
    SiGoogledrive,
} from "@icons-pack/react-simple-icons"
import {
    SubmissionType,
} from "@/modules/types"
import type {
    SubmissionIconMap,
} from "./types"

/** Brand icon shown next to a submission title, keyed by its expected link type. */
export const SUBMISSION_ICON_MAP: SubmissionIconMap = {
    [SubmissionType.GithubUrl]: SiGithub,
    [SubmissionType.GoogleDocsUrl]: SiGoogledrive,
}

import useSWRMutation from "swr/mutation"
import { mutateSplitCvFromText } from "@/modules/api/graphql/mutations/mutation-split-cv-from-text"
import { type SplitCvFromTextRequest } from "@/modules/api/graphql/mutations/types/split-cv-from-text"

type MutateSplitCvFromTextResult = Awaited<ReturnType<typeof mutateSplitCvFromText>>

/**
 * SWR mutation wrapper for {@link mutateSplitCvFromText} — AI-parses a pasted
 * CV text into blocks (ingest path, not persisted; caller loads the result
 * into the editor and autosaves it like any other edit).
 */
export const useMutateSplitCvFromTextSwr = () => {
    return useSWRMutation<
        MutateSplitCvFromTextResult,
        Error,
        string,
        SplitCvFromTextRequest
    >(
        "MUTATE_SPLIT_CV_FROM_TEXT_SWR",
        async (_key, { arg }) => {
            return mutateSplitCvFromText({
                request: arg,
            })
        },
    )
}

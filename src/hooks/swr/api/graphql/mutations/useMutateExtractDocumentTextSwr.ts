import useSWRMutation from "swr/mutation"
import { mutateExtractDocumentText } from "@/modules/api/graphql/mutations/mutation-extract-document-text"
import { type ExtractDocumentTextRequest } from "@/modules/api/graphql/mutations/types/extract-document-text"

type MutateExtractDocumentTextResult = Awaited<ReturnType<typeof mutateExtractDocumentText>>

/**
 * SWR mutation wrapper for {@link mutateExtractDocumentText} — extracts plain
 * text from an uploaded document (CV / job description) by its storage key
 * (not persisted; caller loads the result into the paste field for review).
 */
export const useMutateExtractDocumentTextSwr = () => {
    return useSWRMutation<
        MutateExtractDocumentTextResult,
        Error,
        string,
        ExtractDocumentTextRequest
    >(
        "MUTATE_EXTRACT_DOCUMENT_TEXT_SWR",
        async (_key, { arg }) => {
            return mutateExtractDocumentText({
                request: arg,
            })
        },
    )
}

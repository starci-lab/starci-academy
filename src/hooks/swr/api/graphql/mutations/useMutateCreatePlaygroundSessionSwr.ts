import useSWRMutation from "swr/mutation"
import { mutateCreatePlaygroundSession } from "@/modules/api/graphql/mutations/mutation-create-playground-session"
import { type CreatePlaygroundSessionRequest } from "@/modules/api/graphql/mutations/types/create-playground-session"

type MutateCreatePlaygroundSessionResult = Awaited<
    ReturnType<typeof mutateCreatePlaygroundSession>
>

/** SWR mutation for {@link mutateCreatePlaygroundSession}. */
export const useMutateCreatePlaygroundSessionSwr = () => {
    return useSWRMutation<
        MutateCreatePlaygroundSessionResult,
        Error,
        string,
        CreatePlaygroundSessionRequest
    >(
        "MUTATE_CREATE_PLAYGROUND_SESSION_SWR",
        async (_key, { arg }) => mutateCreatePlaygroundSession({ request: arg }),
    )
}

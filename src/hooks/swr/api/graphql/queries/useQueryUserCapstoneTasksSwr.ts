import { queryUserCapstoneTasks } from "@/modules/api"
import useSWR from "swr"

/**
 * SWR hook for a user's passed capstone tasks by id. Public — works for anonymous
 * viewers. Returns [] on absent data; pass null/undefined userId to disable.
 *
 * @param userId - id of the user whose capstone tasks to fetch
 * @returns the SWR handle (data = array of passed capstone tasks)
 */
export const useQueryUserCapstoneTasksSwr = (userId: string | null | undefined) => {
    const swr = useSWR(
        userId ? ["QUERY_USER_CAPSTONE_TASKS_SWR", userId] : null,
        async () => {
            const data = await queryUserCapstoneTasks({
                request: { userId: userId as string },
            })
            if (!data || !data.data) {
                throw new Error("Failed to fetch user capstone tasks")
            }
            return data.data.userCapstoneTasks?.data ?? []
        },
    )
    return swr
}

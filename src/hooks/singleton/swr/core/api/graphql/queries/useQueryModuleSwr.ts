import { GraphQLHeadersKey, queryModule } from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setModule } from "@/redux/slices"

/**
 * The core function to query a module by id with SWR.
 */
export const useQueryModuleSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const moduleId = useAppSelector((state) => state.course.moduleId)
    const courseId = useAppSelector((state) => state.course.id)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled
            ? [
                "QUERY_MODULE_SWR",
                moduleId,
                enrolled,
            ]
            : null,
        async () => {
            if (!moduleId) {
                throw new Error("Module id not found")
            }
            const data = await queryModule({
                request: { 
                    id: moduleId 
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
                token,
            })
            if (!data || !data.data) {
                throw new Error("Module not found")
            }
            dispatch(setModule(data.data.module.data))
            return data.data
        }
    )

    return swr
}


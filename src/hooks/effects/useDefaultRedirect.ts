import { useAppDispatch, useAppSelector } from "@/redux"
import { setSelectedTaskId } from "@/redux/slices"
import { pathConfig } from "@/resources/path"
import type { MilestoneEntity } from "@/modules/types"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import _ from "lodash"

/**
 * First task id in course order: milestones by `orderIndex`, then tasks by `orderIndex`.
 * Matches ordering used in the personal-project milestone sidebar.
 */
const getFirstPersonalProjectTaskId = (
    milestones: Array<MilestoneEntity>,
): string | undefined => {
    const orderedMilestones = [...milestones].sort((a, b) => a.sortIndex - b.sortIndex)
    for (const milestone of orderedMilestones) {
        const tasks = milestone.tasks
        if (!tasks?.length) {
            continue
        }
        const orderedTasks = [...tasks].sort((a, b) => a.sortIndex - b.sortIndex)
        const first = orderedTasks[0]
        if (first?.id) {
            return first.id
        }
    }
    return undefined
}

/**
 * Redirects bare learn URLs to a sensible default: first module, or first personal-project task.
 */
export const useDefaultRedirect = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)

    useEffect(() => {
        if (!course || !courseDisplayId) {
            return
        }

        const learnModuleBase = pathConfig().locale(locale).course(courseDisplayId).learn().module().build()
        if (pathname === learnModuleBase) {
            const modules = _.cloneDeep(course.modules ?? []).sort((prev, next) => prev.sortIndex - next.sortIndex)
            const firstModuleId = modules[0]?.id
            if (!firstModuleId) {
                return
            }
            router.push(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .learn()
                    .module(firstModuleId)
                    .build(),
            )
            return
        }

        const personalProjectBase = pathConfig()
            .locale(locale)
            .course(courseDisplayId)
            .learn()
            .personalProject()
            .build()
        const onPersonalProjectBase =
            pathname === personalProjectBase
            || pathname === `${personalProjectBase}/`

        if (onPersonalProjectBase) {
            const firstTaskId = getFirstPersonalProjectTaskId(milestoneEntities)
            if (!firstTaskId) {
                return
            }
            dispatch(setSelectedTaskId(firstTaskId))
            router.replace(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .learn()
                    .personalProject(firstTaskId)
                    .build(),
            )
        }
    }, [
        course,
        courseDisplayId,
        dispatch,
        locale,
        milestoneEntities,
        pathname,
        router,
    ])
}

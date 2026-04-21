import { useAppSelector } from "@/redux"
import { pathConfig } from "@/resources/path"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import _ from "lodash"

/**
 * useDefaultRedirect is a hook that is used to redirect to the default path.
 */
export const useDefaultRedirect = () => {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    useEffect(() => {
        if (!course || !courseDisplayId) return
        if (pathname === pathConfig().locale(locale).course(courseDisplayId).learn().module().build()) {
            router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().module(
                    _.cloneDeep(course?.modules ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex)[0].displayId
                ).build()
            )
        }
    }, [pathname, locale, course, courseDisplayId])
}
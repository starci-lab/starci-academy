import React from "react"
import { CourseCard } from "./CourseCard"
import { Spacer } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
export const Courses = () => {
    const courses = useAppSelector((state) => state.course.entities)
    const t = useTranslations()
    return (
        <div className="flex flex-col items-center">
            <div className="text-2xl font-bold flex gap-1 text-center">{t("courses.featuredTitle")}</div>
            <Spacer y={4} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses?.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    )
}

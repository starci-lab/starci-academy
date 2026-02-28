import React from "react"
import type { Course as CourseType } from "@/types"
import { Curriculum } from "./Curriculum"

export interface CourseProps {
    course: CourseType
}
export const Course = ({ course }: CourseProps) => {
    return (
        <div>
            <Curriculum course={course} />
        </div>
    )
}
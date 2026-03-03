import React from "react"
import { CourseCard } from "./CourseCard"
import { data } from "../../../data"

export const Courses = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    )
}

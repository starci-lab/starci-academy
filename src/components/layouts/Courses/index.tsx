import React from "react"
import { CourseCard } from "./CourseCard"
import { data } from "../../../data"
import { Spacer } from "@heroui/react"
export const Courses = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="text-2xl font-bold flex gap-1 text-center">Khóa học tiêu biểu</div>
            <Spacer y={4} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    )
}

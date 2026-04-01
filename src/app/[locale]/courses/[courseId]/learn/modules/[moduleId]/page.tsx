"use client"
import React from "react"
import { Learn } from "@/components/layouts"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks/singleton"

const Page = () => {
    const course = useAppSelector((state) => state.course.course)
    const { isLoading } = useQueryCourseSwr()
    return (
        <Learn 
            course={course ?? undefined} 
            isLoading={isLoading} 
        />
    )
}

export default Page
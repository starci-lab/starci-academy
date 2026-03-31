"use client"
import React from "react"
import { Course } from "@/components/layouts"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks/singleton"

const Page = () => {
    const course = useAppSelector((state) => state.course.course)
    const { isLoading } = useQueryCourseSwr()
    return (
        <Course 
            course={course ?? undefined} 
            isLoading={isLoading} 
        />
    )
}

export default Page
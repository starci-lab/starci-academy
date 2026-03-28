"use client"
import React from "react"
import { notFound, useParams } from "next/navigation"
import { data } from "@/data"
import { Course } from "@/components/layouts"

const Page = () => {
    const { id } = useParams()
    const course = data.find((course) => course.id === id)
    if (!course) {
        return notFound()
    }
    return (
        <Course course={course} />
    )
}

export default Page
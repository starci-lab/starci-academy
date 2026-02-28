"use client"
import { Accordion, AccordionItem } from "@heroui/react"
import React from "react"
import type { Course as CourseType } from "@/types"

export interface CurriculumProps {
    course: CourseType
}
export const Curriculum = ({ course }: CurriculumProps) => {
    return (
        <Accordion>
            {course.modules.map((module) => (
                <AccordionItem key={module.id} aria-label={module.name} title={module.name} subtitle={module.description}>
                    {module.description}
                </AccordionItem>
            ))}
        </Accordion>
    )
}
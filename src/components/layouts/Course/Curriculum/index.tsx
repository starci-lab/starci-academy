"use client"
import { Accordion, AccordionItem, Chip, Spacer } from "@heroui/react"
import React from "react"
import type { Course as CourseType } from "@/types"
import { ClockIcon } from "@phosphor-icons/react"

export interface CurriculumProps {
    course: CourseType
}
export const Curriculum = ({ course }: CurriculumProps) => {
    return (
        <Accordion>
            {course.modules.map((module) => (
                <AccordionItem 
                    classNames={{
                        titleWrapper: "gap-2"
                    }}
                    key={module.id} 
                    aria-label={module.name} 
                    title={module.name} 
                    subtitle={
                        <div>
                            <div>{module.description}</div>
                            <Spacer y={2}/>
                            <Chip startContent={<ClockIcon size={16} />} size="sm" color="primary" variant="flat">{module.duration}</Chip>
                        </div>
                    }
                >
                    {module.content}
                </AccordionItem>
            ))}
        </Accordion>
    )
}
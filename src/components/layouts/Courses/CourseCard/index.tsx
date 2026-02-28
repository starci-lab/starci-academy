import React from "react"
import { Card, CardBody, CardFooter, CardHeader, Image, Button } from "@heroui/react"
import { Course } from "../../../../types"

export interface CourseCardProps {
    course: Course
}
export const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <Card>
            <CardHeader>
                <Image src={course.image} alt={course.name} />
            </CardHeader>
            <CardBody>
                <h1>{course.name}</h1>
            </CardBody>
            <CardFooter>
                <Button>View Camp</Button>
            </CardFooter>
        </Card>
    )
}

import React from "react"
import { Card, CardBody, CardFooter, Image, Button, Spacer } from "@heroui/react"
import { Course } from "../../../../types"

export interface CourseCardProps {
    course: Course
}
export const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <Card>
            <CardBody>
                <Image src={course.image} alt={course.name} />
                <Spacer y={4} />
                <div className="font-bold">{course.name}</div>
                <Spacer y={4} />
                <div className="text-sm text-foreground-500 text-justify italic">{course.description}</div>
            </CardBody>
            <CardFooter>
                <div>
                    <Button color="primary" size="lg" className="w-full">View Course</Button>
                    <Spacer y={4} />
                    <div className="text-sm text-foreground-500 text-justify">
                        <div>
                            <span className="font-bold">Price:</span> {course.price} VND
                        </div>
                        <div>
                            <span className="font-bold">Location:</span> {course.location}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

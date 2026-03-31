import React from "react"
import { Card, CardBody, CardFooter, Image, Button, Spacer } from "@heroui/react"
import { Course } from "../../../../types"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
export interface CourseCardProps {
    course: Course
}
export const CourseCard = ({ course }: CourseCardProps) => {
    const originalPrice = course.originalPrice
    const actualPrice = course.pricing.find(pricing => pricing.phase === course.currentPhase)?.price
    const router = useRouter()
    const t = useTranslations()
    return (
        <Card>
            <CardBody>
                <Image src={course.image} alt={course.name} />
                <Spacer y={4} />
                <div className="font-bold">{course.name}</div>
                <Spacer y={4} />
                <div className="text-sm text-foreground-500 text-justify italic line-clamp-3">{course.description}</div>
            </CardBody>
            <CardFooter>
                <div className="w-full">
                    <Button color="primary" size="lg" className="w-full" onPress={() => router.push(`/courses/${course.id}`)}>{t("courses.viewCourse")}</Button>
                    <Spacer y={2} />
                    <div className="text-sm text-justify flex gap-2">
                        <span className="line-through text-foreground-500">{originalPrice} VND</span>
                        <span>{actualPrice} VND</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

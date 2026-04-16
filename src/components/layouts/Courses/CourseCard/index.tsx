import React from "react"
import { Button, Card, CardContent, CardFooter } from "@heroui/react"
import { CourseEntity } from "@/modules/types"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { pathConfig } from "@/resources/path"
import { Spacer } from "@/components/reuseable"

export interface CourseCardProps {
    course: CourseEntity
}
export const CourseCard = ({ course }: CourseCardProps) => {
    const locale = useLocale()
    const originalPrice = course.originalPrice
    const actualPrice = course.pricingPhases?.find((pricingPhase) => pricingPhase.phase === course.currentPhase)?.price
    const router = useRouter()
    const t = useTranslations()
    return (
        <Card>
            <CardContent>
                <img src={course.coverImageUrl ?? ""} alt={course.title} />
                <Spacer y={4} />
                <div className="font-bold">{course.title}</div>
                <Spacer y={4} />
                <div className="text-sm text-foreground-500 text-justify italic line-clamp-3">{course.description}</div>
            </CardContent>
            <CardFooter>
                <div className="w-full">
                    <Button variant="primary" size="lg" className="w-full" onPress={() => router.push(pathConfig().locale(locale).course(course.displayId).build())}>{t("courses.viewCourse")}</Button>
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

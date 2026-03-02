"use client"
import React from "react"
import type { Course as CourseType } from "@/types"
import { Curriculum } from "./Curriculum"
import { Alert, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, Link, Spacer } from "@heroui/react"
import { LightbulbFilamentIcon, SealCheckIcon } from "@phosphor-icons/react"
import { Stepper } from "./Stepper"

export interface CourseProps {
    course: CourseType
}
export const Course = ({ course }: CourseProps) => {
    return (
        <div>
            <Breadcrumbs>
                <BreadcrumbItem>
                    <Link href="/">Home</Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link href="/khoa-hoc">Courses</Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link href={`/khoa-hoc/${course.id}`}>{course.name}</Link>
                </BreadcrumbItem>
            </Breadcrumbs>
            <Spacer y={6} />
            <div className="text-4xl font-bold">{course.name}</div>
            <Spacer y={12} />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                <div className="order-2 md:order-1 md:col-span-3">
                    <Alert icon={<LightbulbFilamentIcon size={24} />} className="text-sm" color="secondary" variant="faded">{course.description}</Alert>
                    <Spacer y={6} />
                    <Curriculum course={course} />
                </div>
                <Card className="order-1 md:order-2 md:col-span-2 bg-inherit border border-divider h-fit">
                    <CardBody>
                        <Stepper course={course} />
                        <Spacer y={12} />
                        <div className="flex flex-col gap-2 text-foreground-500">
                            {course.commitmentTexts.map((text, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <SealCheckIcon size={20} />
                                    <div key={index} className="text-sm">
                                        {text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                    <CardFooter>
                        <div className="w-full">
                            <Button color="primary" size="lg" className="w-full">Đăng ký</Button>
                            <Spacer y={4} />
                            <div className="text-sm text-foreground-500">
                                0 người đã đăng ký
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
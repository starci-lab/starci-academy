"use client"

import React from "react"
import {
    CourseBreadcrumbs,
} from "./CourseBreadcrumbs"
import {
    CourseHeader,
} from "./CourseHeader"
import {
    PrerequisitesAlert,
} from "./PrerequisitesAlert"
import {
    Modules,
} from "./Modules"
import {
    QnA,
} from "./QnA"
import {
    EnrollCard,
} from "./EnrollCard"
import {
    CourseDetailAd,
} from "./CourseDetailAd"

/**
 * Course detail container.
 *
 * Pure composition: each section (breadcrumbs, header, prerequisites, modules,
 * Q&A, enroll card) is self-contained and reads its own data (course redux,
 * enrollment SWR singleton) and owns its handlers, so this container just lays
 * them out with no props.
 */
export const Course = () => {
    return (
        <div className="p-3 max-w-[1280px] mx-auto">
            <CourseBreadcrumbs />
            <div className="h-12" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
                <div className="order-2 md:order-1 md:col-span-3 flex min-w-0 flex-col">
                    <CourseHeader />
                    <div className="h-6 shrink-0" />
                    <PrerequisitesAlert />
                    <div className="h-6" />
                    <Modules />
                    <div className="h-6" />
                    <QnA />
                </div>
                <div className="order-1 md:order-2 md:col-span-2 flex flex-col gap-6">
                    <EnrollCard />
                    <CourseDetailAd />
                </div>
            </div>
        </div>
    )
}

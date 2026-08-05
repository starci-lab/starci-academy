"use client"

import React, { PropsWithChildren } from "react"
import { LearnShellLayout } from "@/components/layouts/LearnShellLayout"

/**
 * Layout for every `/courses/[courseId]/learn` surface. Which rails a surface
 * gets, and which surfaces require enrolment, are the Layout's own decisions —
 * a route file names its Layout and nothing else.
 */
const Layout = ({ children }: PropsWithChildren) => (
    <LearnShellLayout>{children}</LearnShellLayout>
)

export default Layout

"use client"

import React from "react"
import type { PropsWithChildren } from "react"
import { HeadhuntingCompaniesLayout } from "@/components/layouts/HeadhuntingCompaniesLayout"

/**
 * Course shell with the learn nav rail for headhunting-company routes, which
 * sit outside `/learn` but still read as part of the course.
 */
const Layout = ({ children }: PropsWithChildren) => (
    <HeadhuntingCompaniesLayout>{children}</HeadhuntingCompaniesLayout>
)

export default Layout

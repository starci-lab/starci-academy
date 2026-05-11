"use client"

import React, { PropsWithChildren } from "react"
import { Breadcrumbs, Button, FieldError, Input, TextField } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { usePersonalProjectGithubUrlFormik } from "@/hooks/singleton"
import { MilestoneSidebar } from "@/components/layouts/MilestoneSidebar"

const Layout = ({ children }: PropsWithChildren) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const githubUrlFormik = usePersonalProjectGithubUrlFormik()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="col-span-3 lg:border-r lg:/60">
                <div className="p-6">
                    <Breadcrumbs>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale().build())}>
                            {t("nav.home")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course().build())}>
                            {t("nav.courses")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).build())}>
                            {course?.title || t("nav.courses")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item>
                            <span>{t("course.finalProjectTitle")}</span>
                        </Breadcrumbs.Item>
                    </Breadcrumbs>
                    <div className="h-12" />
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="mb-3 text-base font-medium">{t("finalProject.page.submitGithub.title")}</div>
                            <TextField isInvalid={!!(githubUrlFormik.touched.githubUrl && githubUrlFormik.errors.githubUrl)}>
                                <Input
                                    variant="secondary"
                                    placeholder={t("finalProject.page.submitGithub.placeholder")}
                                    name="githubUrl"
                                    value={githubUrlFormik.values.githubUrl}
                                    onChange={(event) => githubUrlFormik.setFieldValue("githubUrl", event.target.value)}
                                    onBlur={() => githubUrlFormik.setFieldTouched("githubUrl", true)}
                                />
                                <FieldError>{githubUrlFormik.errors.githubUrl || githubUrlFormik.status?.error}</FieldError>
                            </TextField>
                            <div className="flex items-center gap-2 mt-3">
                                <Button
                                    isPending={githubUrlFormik.isSubmitting}
                                    isDisabled={!githubUrlFormik.isValid}
                                    onPress={() => githubUrlFormik.submitForm()}
                                >
                                    {t("finalProject.page.submitGithub.cta")}
                                </Button>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
            <MilestoneSidebar className="col-span-2" />
        </div>
    )
}

export default Layout

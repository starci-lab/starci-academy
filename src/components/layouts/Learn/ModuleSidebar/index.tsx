import React, { useMemo } from "react"
import { useAppSelector } from "@/redux"
import { StarCiAccordion, StarCiAccordionItem } from "@/components/atomic"
import _ from "lodash"
import { cn } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { pathConfig } from "@/resources"
import { BracketsCurlyIcon } from "@phosphor-icons/react"

export const ModuleSidebar = () => {
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const moduleDisplayId = useAppSelector((state) => state.module.displayId)
    const modules = useMemo(() => _.cloneDeep(course?.modules ?? []), [course?.modules])
    const activeModule = useMemo(() => modules.find((module) => module.displayId === moduleDisplayId), [modules, moduleDisplayId])
    const router = useRouter()
    const locale = useLocale()
    return (
        <StarCiAccordion 
            className="px-0" 
            selectedKeys={moduleDisplayId ? [moduleDisplayId] : []}
            onSelectionChange={(selection) => {
                const key = Array.from(selection)[0]
                if (key) {
                    router.push(
                        pathConfig().locale(locale).course(courseDisplayId).learn().module(key.toString()).build()
                    )
                }
            }
            }
        >
            {
                modules.map(
                    (module) => (
                        <StarCiAccordionItem key={module.displayId}
                            aria-label={module.title} 
                            title={<div className={cn("cursor-pointer", module.id === activeModule?.id ? "text-primary" : "")}>{module.title}</div>}>
                            <div className="text-sm text-start w-full ml-4 gap-3 flex flex-col">
                                {
                                    _.cloneDeep(module.previewContents)?.
                                        sort((previous, current) => previous.orderIndex - current.orderIndex)
                                        .map(
                                            (content) => (
                                                <div key={content.id} className="flex items-center gap-3 text-xs text-foreground-500">
                                                    <BracketsCurlyIcon className="w-5 h-5 min-w-5 min-h-5" />
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                            content.text,
                                                        }}
                                                    />
                                                </div>
                                            )
                                        )
                                }
                            </div>
                        </StarCiAccordionItem>
                    )
                )
            }
        </StarCiAccordion>
    )
}
"use client"

import React from "react"
import { Spacer } from "@/components/reuseable"
import { BracketsCurlyIcon, ClockIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks/singleton"
import {
    StarCiAccordion,
    StarCiAccordionItem,
    StarCiChip,
    StarCiSkeleton,
} from "@/components/atomic"
import { AccordionHeading, AccordionTrigger, AccordionPanel } from "@heroui/react"
import _ from "lodash"

export const Modules = () => {
    const modules = useAppSelector((state) => state.course.entity?.modules)
    const { isLoading } = useQueryCourseSwr()
    const list = modules ?? []
    const t = useTranslations()
    return (
        <div>
            {isLoading ? (
                <StarCiAccordion className="px-0">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <StarCiAccordionItem
                            key={index}
                            aria-label={t("module.aria", { index: index + 1 })}
                        >
                            <AccordionHeading><AccordionTrigger>
                                <div className="flex flex-col gap-2">
                                    <StarCiSkeleton className="h-4 w-[30%] my-[4px]" />
                                    <div>
                                        <StarCiSkeleton className="h-[14px] w-[60%] my-[3px]" />
                                        <StarCiSkeleton className="h-[14px] w-[40%] my-[3px]" />
                                    </div>
                                </div>
                            </AccordionTrigger></AccordionHeading>
                            <AccordionPanel>{""}</AccordionPanel>
                        </StarCiAccordionItem>
                    ))}
                </StarCiAccordion>
            ) : (
                <StarCiAccordion>
                    {
                        list.map(
                            (module) => (
                                <StarCiAccordionItem 
                                    className="gap-2"
                                    key={module.id} 
                                    aria-label={module.title} 
                                >
                                    <AccordionHeading><AccordionTrigger>
                                        <div>
                                            <div>{module.title}</div>
                                            <div>
                                                <div>{module.description}</div>
                                                <Spacer y={2}/>
                                                <StarCiChip size="sm" color="accent" variant="soft"><ClockIcon size={16} />{0}</StarCiChip>
                                            </div>
                                        </div>
                                    </AccordionTrigger></AccordionHeading>
                                    <AccordionPanel>
                                        <div className="text-sm text-start w-full ml-4 gap-3 flex flex-col">
                                            {
                                                _.cloneDeep(module.previewContents)?.
                                                    sort((previous, current) => previous.orderIndex - current.orderIndex)
                                                    .map(
                                                        (content) => (
                                                            <div key={content.id} className="flex items-center gap-3">
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
                                    </AccordionPanel>
                                </StarCiAccordionItem>
                            )
                        )
                    }
                </StarCiAccordion>
            )}
        </div>
    )
}

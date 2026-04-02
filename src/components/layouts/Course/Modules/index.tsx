"use client"

import React from "react"
import { Spacer } from "@heroui/react"
import { BracketsCurlyIcon, ClockIcon } from "@phosphor-icons/react"
import type { ModuleEntity } from "@/modules/types"
import { useTranslations } from "next-intl"
import {
    StarCiAccordion,
    StarCiAccordionItem,
    StarCiChip,
    StarCiSkeleton,
} from "@/components/atomic"
import _ from "lodash"

export interface ModulesProps {
    modules?: Array<ModuleEntity>
    isLoading: boolean
}

export const Modules = ({ modules, isLoading }: ModulesProps) => {
    const list = modules ?? []
    const t = useTranslations()
    if (!isLoading && list.length === 0) {
        return null
    }

    return (
        <div>
            {isLoading ? (
                <StarCiAccordion className="px-0">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <StarCiAccordionItem
                            key={index}
                            aria-label={t("module.aria", { index: index + 1 })}
                            title={
                                <div className="flex flex-col gap-2">
                                    <StarCiSkeleton className="h-4 w-[30%] my-[4px]" />
                                    <div>
                                        <StarCiSkeleton className="h-[14px] w-[60%] my-[3px]" />
                                        <StarCiSkeleton className="h-[14px] w-[40%] my-[3px]" />
                                    </div>
                                </div>
                            }
                        >
                        </StarCiAccordionItem>
                    ))}
                </StarCiAccordion>
            ) : (
                <StarCiAccordion>
                    {
                        list.map(
                            (module) => (
                                <StarCiAccordionItem 
                                    classNames={{
                                        titleWrapper: "gap-2"
                                    }}
                                    key={module.id} 
                                    aria-label={module.title} 
                                    title={module.title} 
                                    subtitle={
                                        <div>
                                            <div>{module.description}</div>
                                            <Spacer y={2}/>
                                            <StarCiChip startContent={<ClockIcon size={16} />} size="sm" color="primary" variant="flat">{0}</StarCiChip>
                                        </div>
                                    }
                                >
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
                                                                        content.data,
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
            )}
        </div>
    )
}

"use client"

import { Button, Modal, cn } from "@heroui/react"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import type { ComponentProps } from "react"
import React from "react"

/**
 * Centered modal header with optional back control and subtitle, aligned with legacy modal layout.
 *
 * @param props.title — Primary heading content.
 * @param props.description — Optional content below the title (e.g. chips or metadata).
 * @param props.onPrev — When set, shows a back button that invokes this handler.
 */
export interface AppModalHeaderProps extends Omit<ComponentProps<typeof Modal.Header>, "title"> {
    /** Primary heading content. */
    title: React.ReactNode
    /** Optional content below the title. */
    description?: React.ReactNode
    /** Renders a back control when provided. */
    onPrev?: () => void
}

export const AppModalHeader = ({ title, description, onPrev, className, ...rest }: AppModalHeaderProps) => {
    return (
        <Modal.Header className={cn("justify-center pb-2 max-w-full", className)} {...rest}>
            {onPrev ? (
                <div className="absolute left-4 top-[14px]">
                    <Button size="sm" variant="ghost" isIconOnly onPress={onPrev}>
                        <ArrowLeftIcon />
                    </Button>
                </div>
            ) : null}
            <div className="text-center">
                <div className="text-lg font-bold">{title}</div>
                {description ? (
                    <>
                        <div className="h-2" aria-hidden />
                        <div className="w-full text-xs font-normal text-foreground-500">{description}</div>
                    </>
                ) : null}
            </div>
        </Modal.Header>
    )
}

import {
    Modal,
    ModalContainer,
    ModalDialog,
    ModalBackdrop,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseTrigger,
    cn,
} from "@heroui/react"
import type {
    ModalRootProps,
    ModalContainerProps,
    ModalDialogProps,
    ModalBodyProps,
    ModalFooterProps,
    ModalHeaderProps,
} from "@heroui/react"
import React from "react"
import { Spacer } from "@/components/reuseable"
import { StarCiButton } from "../StarCiButton"
import { ArrowLeftIcon } from "@phosphor-icons/react"

export const StarCiModal = (props: ModalRootProps) => {
    return <Modal {...props} />
}

export const StarCiModalContainer = (props: ModalContainerProps) => {
    return <ModalContainer {...props} />
}

export const StarCiModalDialog = (props: ModalDialogProps) => {
    return <ModalDialog {...props} />
}

export const StarCiModalBackdrop = ModalBackdrop

export const StarCiModalContent = ({ children, className, ...props }: ModalContainerProps & { children?: React.ReactNode }) => {
    return (
        <ModalContainer className={className} {...props}>
            <ModalDialog>
                {children as React.ReactNode}
            </ModalDialog>
        </ModalContainer>
    )
}

export interface StarCiModalHeaderProps extends ModalHeaderProps {
    title: string;
    description?: React.ReactNode;
    onPrev?: () => void;
}

export const StarCiModalHeader = ({ title, description, onPrev, ...props }: StarCiModalHeaderProps) => {
    return (
        <ModalHeader className="justify-center pb-2" {...props}>
            {onPrev && (
                <div className="absolute left-4 top-[14px]">
                    <StarCiButton size="sm" variant="ghost" isIconOnly onPress={onPrev}>
                        <ArrowLeftIcon />
                    </StarCiButton>
                </div>
            )}
            <div className="text-center">
                <div className="text-lg font-bold">{title}</div>
                {description && (
                    <>
                        <Spacer y={2}/>
                        <div className="text-xs text-foreground-500 font-normal">{description}</div>
                    </>
                )}
            </div>
        </ModalHeader>
    )
}

export const StarCiModalBody = (props: ModalBodyProps) => {
    return <ModalBody className={cn("gap-0 p-4", props.className)} {...props} />
}

export const StarCiModalFooter = (props: ModalFooterProps) => {
    return <ModalFooter className={cn("p-4 justify-center pt-2", props.className)} {...props} />
}

export const StarCiModalCloseTrigger = ModalCloseTrigger

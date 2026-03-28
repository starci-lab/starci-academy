
import {
    Modal,
    ModalProps,
    ModalContentProps,
    ModalBodyProps,
    ModalContent,
    ModalHeader,
    ModalBody,
    cn,
    ModalFooter,
    ModalFooterProps,
    HTMLHeroUIProps,
    Spacer
} from "@heroui/react"
import React from "react"
import { StarCiButton } from "../StarCiButton"
import { ArrowLeftIcon } from "@phosphor-icons/react"

export const StarCiModal = (props: ModalProps) => {
    return <Modal {...props} />
}

export const StarCiModalContent = (props: ModalContentProps) => {
    return <ModalContent {...props} />
}

export interface StarCiModalHeaderProps extends HTMLHeroUIProps<"div"> {
    title: string;
    description?: React.ReactNode;
    onPrev?: () => void;
}

export const StarCiModalHeader = ({ title, description, onPrev, ...props }: StarCiModalHeaderProps) => {
    return (
        <ModalHeader className="justify-center pb-2" {...props}>
            {onPrev && (
                <div className="absolute left-4 top-[14px]">
                    <StarCiButton size="sm" variant="light" isIconOnly radius="full" onPress={onPrev}>
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

import React from "react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    cn,
} from "@heroui/react"
import type { CardRootProps, CardContentProps, CardHeaderProps, CardFooterProps } from "@heroui/react"
import { Spacer } from "@/components/reuseable"

export const StarCiCard = (props: CardRootProps) => {
    return <Card {...props} className={cn(props.className)} />
}

export const StarCiCardBody = (props: CardContentProps) => {
    return <CardContent {...props} className={cn(props.className)} />
}

export interface StarCiCardHeaderProps extends CardHeaderProps {
  title: string;
  description?: React.ReactNode;
}
export const StarCiCardHeader = ({ title, description, ...props }: StarCiCardHeaderProps) => {
    return (
        <CardHeader className="justify-center" {...props}>
            <div className="text-center">
                <div className="text-lg font-bold">{title}</div>
                <Spacer y={2}/>
                {description && (
                    <div className="text-xs text-foreground-500">{description}</div>
                )}
            </div>
        </CardHeader>
    )
}

export const StarCiCardFooter = (props: CardFooterProps) => {
    return <CardFooter {...props} />
}

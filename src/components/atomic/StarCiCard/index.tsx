import React from "react"
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    HTMLHeroUIProps,
    Spacer,
    cn,
} from "@heroui/react"
import { CardProps } from "@heroui/react"

export const StarCiCard = (props: CardProps) => {
    return <Card shadow="sm" {...props} className={cn(props.className)} />
}

export const StarCiCardBody = (props: HTMLHeroUIProps<"div">) => {
    return <CardBody {...props} className={cn(props.className)} />
}

export interface StarCiCardHeaderProps extends HTMLHeroUIProps<"div"> {
  title: string;
  description?: React.ReactNode;
}
export const StarCiCardHeader = (props: StarCiCardHeaderProps) => {
    return (
        <CardHeader className="justify-center" {...props}>
            <div className="text-center">
                <div className="text-lg font-bold">{props.title}</div>
                <Spacer y={2}/>
                {props.description && (
                    <div className="text-xs text-foreground-500">{props.description}</div>
                )}
            </div>
        </CardHeader>
    )
}

export const StarCiCardFooter = (props: HTMLHeroUIProps<"div">) => {
    return <CardFooter {...props} />
}

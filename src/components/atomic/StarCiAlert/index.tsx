import { Alert, AlertProps, cn } from "@heroui/react"
import React from "react"

export const StarCiAlert = (props: AlertProps) => {
    return <Alert 
        {...props} 
        classNames={
            { 
                title: cn("mb-2 text-sm", props.classNames?.title), 
                description: cn("text-xs", props.classNames?.description),
                ...props.classNames, 
            }
        } 
    />
}   
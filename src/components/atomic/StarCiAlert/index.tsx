import { Alert } from "@heroui/react"
import type { AlertRootProps } from "@heroui/react"
import React from "react"

export const StarCiAlert = (props: AlertRootProps) => {
    return <Alert 
        {...props} 
        className="bg-transparent border-divider border"
    />
}   

import { cn, Skeleton, SkeletonProps } from "@heroui/react"
import React from "react"

export const StarCiSkeleton = (props: SkeletonProps) => {
    return <Skeleton {...props} disableAnimation className={cn(props.className, "rounded-medium")}/>
}
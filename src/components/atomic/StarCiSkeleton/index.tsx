import { cn, Skeleton } from "@heroui/react"
import type { SkeletonRootProps } from "@heroui/react"
import React from "react"

export const StarCiSkeleton = (props: SkeletonRootProps) => {
    return <Skeleton {...props} animationType="none" className={cn(props.className, "rounded-medium")}/>
}

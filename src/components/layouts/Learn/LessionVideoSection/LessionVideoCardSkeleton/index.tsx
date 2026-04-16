import { Card, Skeleton } from "@heroui/react"
import React from "react"

export const LessionVideoCardSkeleton = () => {
    return (
        <Card>
            <Card.Content>
                <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="aspect-video h-full object-cover rounded-md" />
                    <div className="flex flex-col gap-3 col-span-2">
                        <Skeleton className="h-4 my-1 w-[40%]" />
                        <Skeleton className="h-[14px] my-[3px] w-[70%]" />
                        <Skeleton className="h-[14px] my-[3px] w-[60%]" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            </Card.Content>
        </Card>
    )
}

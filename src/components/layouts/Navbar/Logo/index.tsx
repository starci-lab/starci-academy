import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Link,
} from "@heroui/react"
import { pathConfig } from "@/resources/path"
import { useRouter } from "@/i18n/navigation"
import React from "react"
import { cn } from "@heroui/react"
import { WithClassNames } from "@/modules/types"

/**
 * Logo props interface
 */
export type LogoProps = WithClassNames<undefined>
/**
 * Logo is the logo component for the application.
 */
export const Logo = ({ className }: LogoProps) => {
    /**
     * Router hook
     */
    const router = useRouter()
    return (
        <Link
            onPress={() => router.push(pathConfig().locale().build())} 
            className={cn(className)}
        >
            <Avatar>
                {/**
             * Avatar image
             */}
                <AvatarImage src="/logo.svg" />
                {/**
             * Avatar fallback
             */}
                <AvatarFallback>
                SA
                </AvatarFallback>
            </Avatar>
            {/**
             * Logo text
             */}
            <div className="font-semibold">StarCi Academy</div>
        </Link>
    )
}
import {
    cn,
    Link,
} from "@heroui/react"
import { pathConfig } from "@/resources/path"
import { useRouter } from "@/i18n/navigation"
import React from "react"
import { WithClassNames } from "@/modules/types"
import Image from "next/image"

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
            <Image src="/logo.svg" alt="Logo" width={80} height={100} />
        </Link>
    )
}
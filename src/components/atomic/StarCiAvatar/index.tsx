import {
    Avatar,
    AvatarFallbackProps,
    AvatarImageProps,
    type AvatarRootProps,
} from "@heroui/react"
import React from "react"

/**
 * StarCiAvatar is the avatar component for the application.
 */
export const StarCiAvatar = (props: AvatarRootProps) => {
    return (
        <Avatar {...props}/>
    )
}

/**
 * StarCiAvatarImage is the image component for the avatar.
 */
export const StarCiAvatarImage = (props: AvatarImageProps) => {
    return <Avatar.Image {...props}/>
}

/**
 * StarCiAvatarFallback is the fallback component for the avatar.
 */
export const StarCiAvatarFallback = (props: AvatarFallbackProps) => {
    return <Avatar.Fallback {...props}/>
}
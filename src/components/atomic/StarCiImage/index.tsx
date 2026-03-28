import { Image, ImageProps } from "@heroui/react"
import React from "react"

export const StarCiImage = (props: ImageProps) => {
    return <Image {...props} src={!props.src ? undefined : props.src} />
}
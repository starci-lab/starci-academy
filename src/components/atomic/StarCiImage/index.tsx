import React from "react"

interface ImageProps extends React.ComponentPropsWithRef<"img"> {
    children?: React.ReactNode
}

export const StarCiImage = (props: ImageProps) => {
    return <img {...props} src={!props.src ? undefined : props.src} />
}

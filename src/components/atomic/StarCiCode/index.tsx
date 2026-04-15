import React from "react"

interface CodeProps extends React.ComponentPropsWithRef<"code"> {
    children?: React.ReactNode
}

export const StarCiCode = (props: CodeProps) => {
    return <code {...props} className={`px-2 py-1 rounded-md bg-default-100 text-sm ${props.className ?? ""}`} />
}

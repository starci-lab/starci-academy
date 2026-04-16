import type { Metadata } from "next"
import "./globals.css"
import { PropsWithChildren } from "react"

export const metadata: Metadata = {
    title: "StarCi Academy",
    description: "StarCi Academy is a platform for learning and growing",
}

const Layout = ({ children }: PropsWithChildren) => {
    return children
}

export default Layout
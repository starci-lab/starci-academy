import React from "react"
import { LoginPage } from "@/components/features/auth/LoginPage"

/** The auth-guard redirect target (`src/proxy.ts`) for protected routes; also directly navigable. */
const Page = () => {
    return (
        <LoginPage />
    )
}

export default Page

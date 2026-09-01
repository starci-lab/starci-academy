"use client"

import * as Sentry from "@sentry/nextjs"
import {useEffect} from "react"

interface GlobalErrorProps {
    error: Error & {digest?: string}
    reset: () => void
}

const ERROR_TITLE = "Something went wrong"
const ERROR_MESSAGE = "StarCi could not load this page. Please try again."
const RETRY_LABEL = "Try again"

const GlobalError = ({error, reset}: GlobalErrorProps) => {
    useEffect(() => {
        Sentry.captureException(error)
    }, [error])

    return (
        <html lang="vi">
            <body>
                <main>
                    <h1>{ERROR_TITLE}</h1>
                    <p>{ERROR_MESSAGE}</p>
                    <button type="button" onClick={reset}>
                        {RETRY_LABEL}
                    </button>
                </main>
            </body>
        </html>
    )
}

export default GlobalError

import React from "react"
import { FlashcardReviewPage } from "@/components/layouts/flashcard-review"

/**
 * Route `/[locale]/review` — flashcard review session (SM-2). Thin route file:
 * mounts the review component; all logic/UI lives in the component.
 */
const Page = () => {
    return <FlashcardReviewPage />
}

export default Page

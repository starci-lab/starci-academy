"use client"

import React from "react"
import { ChallengeModalBody } from "./ChallengeModalBody"

/**
 * Challenge modal. Challenges use the criteria-based per-language schema
 * (per-language jsonb buckets + criteria), rendered by {@link ChallengeModalBody}.
 */
export const ChallengeModal = () => {
    return <ChallengeModalBody />
}

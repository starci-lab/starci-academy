"use client"

import React from "react"
import { useAppSelector } from "@/redux"
import { ChallengeModalLegacy } from "./ChallengeModalLegacy"
import { ChallengeV2Modal } from "./ChallengeV2Modal"

/**
 * Challenge modal switch. A non-null `verified` day marks a SCHEMA V2 challenge → render the V2
 * modal (per-language jsonb buckets + criteria); otherwise fall back to the legacy relational modal.
 */
export const ChallengeModal = () => {
    const verified = useAppSelector((state) => state.challenge.entity?.verified)
    return verified ? <ChallengeV2Modal /> : <ChallengeModalLegacy />
}

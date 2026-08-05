"use client"

import React from "react"
import { ProfileRedirectPage } from "@/components/pages/ProfileRedirectPage"

/** Bare /profile — resolves the signed-in learner then hands off to their own profile. */
const Page = () => <ProfileRedirectPage />

export default Page

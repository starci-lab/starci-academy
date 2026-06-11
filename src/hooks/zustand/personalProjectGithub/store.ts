"use client"

import { create } from "zustand"

/**
 * Zustand store for the personal-project GitHub form — SHARED between PersonalProjectSubmission
 * (enters url/branch, shows errors) and Task (reads isSubmitting, triggers submit). Previously a
 * formik singleton.
 */
interface PersonalProjectGithubStoreState {
    /** GitHub repo URL. */
    githubUrl: string
    /** Git branch. */
    branch: string
    /** Chosen programming language to grade against (typescript/java/csharp/go). */
    lang: string
    /** Whether githubUrl has been blurred/touched. */
    touchedGithubUrl: boolean
    /** Whether branch has been blurred/touched. */
    touchedBranch: boolean
    /** Manually-set error for githubUrl (from sync/submit); null when none. */
    githubUrlError: string | null
    /** Manually-set error for branch. */
    branchError: string | null
    /** Whether a submit (AI review) is in flight. */
    isSubmitting: boolean
    /** Whether the form has been seeded from enrollment yet (seed-once). */
    seeded: boolean
    setGithubUrl: (value: string) => void
    setBranch: (value: string) => void
    setLang: (value: string) => void
    setTouchedGithubUrl: (value: boolean) => void
    setTouchedBranch: (value: boolean) => void
    setGithubUrlError: (value: string | null) => void
    setBranchError: (value: string | null) => void
    setIsSubmitting: (value: boolean) => void
    /** Seed githubUrl + branch once from enrollment. */
    seed: (githubUrl: string, branch: string) => void
}

/** Shared store for the personal-project GitHub form. */
export const usePersonalProjectGithubStore = create<PersonalProjectGithubStoreState>((set) => ({
    githubUrl: "",
    branch: "main",
    lang: "typescript",
    touchedGithubUrl: false,
    touchedBranch: false,
    githubUrlError: null,
    branchError: null,
    isSubmitting: false,
    seeded: false,
    setGithubUrl: (githubUrl) => set({ githubUrl, githubUrlError: null }),
    setBranch: (branch) => set({ branch, branchError: null }),
    setLang: (lang) => set({ lang }),
    setTouchedGithubUrl: (touchedGithubUrl) => set({ touchedGithubUrl }),
    setTouchedBranch: (touchedBranch) => set({ touchedBranch }),
    setGithubUrlError: (githubUrlError) => set({ githubUrlError }),
    setBranchError: (branchError) => set({ branchError }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    seed: (githubUrl, branch) => set({ githubUrl, branch, seeded: true }),
}))

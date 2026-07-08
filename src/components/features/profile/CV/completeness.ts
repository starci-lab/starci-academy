/**
 * A lightweight "how complete is this CV" scorer for the sidebar meter — a
 * pragmatic weighting over the fields recruiters look for FIRST, computed
 * client-side straight from the draft (no extra fetch). Not a rigor score;
 * just a nudge toward the next thing worth filling in.
 */

import { CvBlockType } from "@/modules/types/enums/cv-block-type"
import type { CvBlock, CvDocument } from "./types"

/** One weighted completeness check — `check(doc)` returns whether it passes. */
interface CompletenessCheck {
    /** i18n key for the nudge shown when this check FAILS (the "next thing missing"). */
    hintKey: string
    /** Relative weight toward the 0..100 score (weights sum to 100 below). */
    weight: number
    /** Whether this check passes for the given document. */
    check: (doc: CvDocument) => boolean
}

const findBlock = (doc: CvDocument, type: CvBlockType): CvBlock | undefined =>
    doc.blocks.find((block) => block.type === type)

const hasNonEmptyString = (value: unknown): boolean => typeof value === "string" && value.trim().length > 0

const CHECKS: Array<CompletenessCheck> = [
    {
        hintKey: "cv.builder.completeness.hints.personalName",
        weight: 15,
        check: (doc) => hasNonEmptyString(findBlock(doc, CvBlockType.Personal)?.items[0]?.fields.name),
    },
    {
        hintKey: "cv.builder.completeness.hints.personalEmail",
        weight: 15,
        check: (doc) => hasNonEmptyString(findBlock(doc, CvBlockType.Personal)?.items[0]?.fields.email),
    },
    {
        hintKey: "cv.builder.completeness.hints.summary",
        weight: 15,
        check: (doc) => hasNonEmptyString(findBlock(doc, CvBlockType.Summary)?.items[0]?.fields.text),
    },
    {
        hintKey: "cv.builder.completeness.hints.project",
        weight: 25,
        check: (doc) => (findBlock(doc, CvBlockType.Project)?.items.length ?? 0) > 0,
    },
    {
        hintKey: "cv.builder.completeness.hints.skills",
        weight: 15,
        check: (doc) => (findBlock(doc, CvBlockType.Skills)?.items.length ?? 0) > 0,
    },
    {
        hintKey: "cv.builder.completeness.hints.education",
        weight: 15,
        check: (doc) => (findBlock(doc, CvBlockType.Education)?.items.length ?? 0) > 0,
    },
]

/** Result of {@link computeCvCompleteness}. */
export interface CvCompletenessResult {
    /** 0..100 weighted completeness score. */
    percent: number
    /** i18n key for the top missing item's nudge, or `null` when everything checked passes. */
    nextHintKey: string | null
}

/**
 * Scores a CV draft's completeness (0..100) and surfaces the highest-weighted
 * MISSING item as a one-line nudge — cheap, derived purely from `doc.blocks`.
 *
 * @param doc - the CV draft to score.
 * @returns {@link CvCompletenessResult}.
 */
export const computeCvCompleteness = (doc: CvDocument): CvCompletenessResult => {
    let earned = 0
    let nextHintKey: string | null = null
    // checks are ordered by weight desc, so the first failing one is the
    // highest-impact nudge to surface.
    for (const item of CHECKS) {
        if (item.check(doc)) {
            earned += item.weight
        } else if (!nextHintKey) {
            nextHintKey = item.hintKey
        }
    }
    return { percent: earned, nextHintKey }
}

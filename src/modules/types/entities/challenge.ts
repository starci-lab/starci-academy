import type { AbstractEntity } from "./abstract"
import type { ChallengeStepEntity } from "./challenge-step"
import type { ChallengeReferenceEntity } from "./challenge-reference"
import type { ChallengeTranslationEntity } from "./challenge-translation"
import type { ChallengeOutputEntity } from "./challenge-output"
import type { ChallengeRequirementEntity } from "./challenge-requirement"
import type { ChallengePrerequisiteEntity } from "./challenge-prerequisite"
import type { ChallengeDifficulty } from "../enums/challenge-difficulty"
import type { ModuleEntity } from "./module"
import type { ChallengeOutputV2Entity } from "./challenge-output-v2"
import type { ChallengePrerequisiteV2Entity } from "./challenge-prerequisite-v2"
import type { ChallengeRequirementV2Entity } from "./challenge-requirement-v2"
import type { ChallengeStepV2Entity } from "./challenge-step-v2"

/**
 * Hands-on challenge attached to a module (title, brief, description, guided steps, ordered inputs).
 */
export interface ChallengeEntity extends AbstractEntity {
    /** Challenge title. */
    title: string
    /** Full instructions (e.g. markdown). */
    description: string
    /** Points / score when completed. */
    score: number
    /** Relative difficulty. */
    difficulty: ChallengeDifficulty
    /** Optional card thumbnail. */
    thumbnailUrl: string | null
    /** Pure ordering index used to sort/reorder (1-based). */
    sortIndex: number
    /** Default locale for this row. */
    defaultLocale: string
    /** Parent module when nested in a graph. */
    module?: ModuleEntity
    /** Ordered guided steps (instructions). */
    steps?: Array<ChallengeStepEntity>
    /** External URL references. */
    references?: Array<ChallengeReferenceEntity>
    /** Structured requirement rows tied to this challenge. */
    requirements?: Array<ChallengeRequirementEntity>
    /** Structured expected output rows tied to this challenge. */
    outputs?: Array<ChallengeOutputEntity>
    /** Structured prerequisite rows tied to this challenge. */
    prerequisites?: Array<ChallengePrerequisiteEntity>
    /** Localized overrides for title, brief, description. */
    translations?: Array<ChallengeTranslationEntity>
    /**
     * Day this challenge was verified/audited. Non-null marks a SCHEMA V2 challenge (drives the
     * V2 modal switch); legacy challenges leave it null/undefined.
     */
    verified?: string | null
    /** SCHEMA V2 requirement items (`ChallengeRequirementV2Entity`). */
    requirementsV2?: Array<ChallengeRequirementV2Entity>
    /** SCHEMA V2 step items (`ChallengeStepV2Entity`). */
    stepsV2?: Array<ChallengeStepV2Entity>
    /** SCHEMA V2 output items (`ChallengeOutputV2Entity`). */
    outputsV2?: Array<ChallengeOutputV2Entity>
    /** SCHEMA V2 prerequisite items (`ChallengePrerequisiteV2Entity`). */
    prerequisitesV2?: Array<ChallengePrerequisiteV2Entity>
}

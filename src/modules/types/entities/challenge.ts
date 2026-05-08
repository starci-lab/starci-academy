import type { AbstractEntity } from "./abstract"
import type { ChallengeStepEntity } from "./challenge-step"
import type { ChallengeReferenceEntity } from "./challenge-reference"
import type { ChallengeTranslationEntity } from "./challenge-translation"
import type { ChallengeOutputEntity } from "./challenge-output"
import type { ChallengeRequirementEntity } from "./challenge-requirement"
import type { ChallengePrerequisiteEntity } from "./challenge-prerequisite"
import type { ChallengeDifficulty } from "../enums/challenge-difficulty"
import type { ModuleEntity } from "./module"

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
    /** Order within the module challenge list. */
    orderIndex: number
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
}

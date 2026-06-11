import type { AbstractEntity } from "./abstract"



/**

 * Per-programming-language row of a SCHEMA V2 prerequisite item.

 * Mirrors Nest `ChallengePrerequisiteV2LangEntity` / `challenge_prerequisite_v2_langs`.

 * CDN payload exposes resolved `text` per request locale (no nested `translations`).

 */

export interface ChallengePrerequisiteV2LangEntity extends AbstractEntity {

    /** Programming language for this prerequisite content. */

    lang: string

    /** Display order within the parent prerequisite item's language list. */

    /** Pure ordering index used to sort/reorder (1-based). */
    sortIndex: number

    /** Default locale for this language row. */

    defaultLocale: string

    /** Localized prerequisite text for the active request locale. */

    text?: string

}



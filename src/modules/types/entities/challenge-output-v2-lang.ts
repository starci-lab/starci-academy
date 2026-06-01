import type { AbstractEntity } from "./abstract"



/**

 * Per-programming-language row of a SCHEMA V2 output item.

 * Mirrors Nest `ChallengeOutputV2LangEntity` / `challenge_output_v2_langs`.

 * CDN payload exposes resolved `text` per request locale (no nested `translations`).

 */

export interface ChallengeOutputV2LangEntity extends AbstractEntity {

    /** Programming language for this output content. */

    lang: string

    /** Display order within the parent output item's language list. */

    orderIndex: number

    /** Default locale for this language row. */

    defaultLocale: string

    /** Localized output text for the active request locale. */

    text?: string

}



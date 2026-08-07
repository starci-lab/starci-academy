import React from "react"
import { Typography } from "@heroui/react"
import { getLanguageColor, getLanguageLabel } from "@/modules/utils/language"

/** Props for {@link LanguageChip}. */
export interface LanguageChipProps {
    /** Language enum value (e.g. `typescript`, `csharp`). Drives colour + label. */
    language: string
}

/**
 * GitHub-style language indicator — a small brand-coloured dot followed by the
 * language's proper display name (`csharp`→C#, `cpp`→C++), like the language tag
 * on a GitHub repo card. No pill/box; the dot carries the colour. Pure block;
 * colour + label come from the shared {@link getLanguageColor}/{@link getLanguageLabel}.
 *
 * @param props - {@link LanguageChipProps}
 * @see Story: .storybook/stories/blocks/chips/LanguageChip/LanguageChip.stories
 */
export const LanguageChip = ({ language}: LanguageChipProps) => {
    return (
        <span className={"inline-flex items-center gap-2"}>
            <span
                aria-hidden
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: getLanguageColor(language) }}
            />
            <Typography type="body-xs" color="muted">
                {getLanguageLabel(language)}
            </Typography>
        </span>
    )
}

import type { ComponentType } from "react"
import { CvBlockType } from "@/modules/types/enums/cv-block-type"
import type { CvBlockEditorProps } from "../../types"
import { AchievementBlockEditor } from "./AchievementBlockEditor"
import { ActivityBlockEditor } from "./ActivityBlockEditor"
import { CertificationBlockEditor } from "./CertificationBlockEditor"
import { EducationBlockEditor } from "./EducationBlockEditor"
import { ExperienceBlockEditor } from "./ExperienceBlockEditor"
import { InterestBlockEditor } from "./InterestBlockEditor"
import { LanguageBlockEditor } from "./LanguageBlockEditor"
import { PersonalBlockEditor } from "./PersonalBlockEditor"
import { ProjectBlockEditor } from "./ProjectBlockEditor"
import { SkillsBlockEditor } from "./SkillsBlockEditor"
import { SummaryBlockEditor } from "./SummaryBlockEditor"

/**
 * Maps a {@link CvBlockType} to the editor component that renders/edits it —
 * every entry takes exactly the {@link CvBlockEditorProps} contract. Add a new
 * block type's editor HERE (plus a metadata entry in `../BlockRegistry`), not
 * by branching on `CvBlockType` ad hoc in `CvBlockStack`.
 */
export const CV_BLOCK_EDITOR_REGISTRY: Record<CvBlockType, ComponentType<CvBlockEditorProps>> = {
    [CvBlockType.Personal]: PersonalBlockEditor,
    [CvBlockType.Summary]: SummaryBlockEditor,
    [CvBlockType.Experience]: ExperienceBlockEditor,
    [CvBlockType.Education]: EducationBlockEditor,
    [CvBlockType.Skills]: SkillsBlockEditor,
    [CvBlockType.Project]: ProjectBlockEditor,
    [CvBlockType.Achievement]: AchievementBlockEditor,
    [CvBlockType.Certification]: CertificationBlockEditor,
    [CvBlockType.Language]: LanguageBlockEditor,
    [CvBlockType.Activity]: ActivityBlockEditor,
    [CvBlockType.Interest]: InterestBlockEditor,
}

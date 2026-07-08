import { CvBlockType } from "@/modules/types/enums/cv-block-type"
import type { CvBlockTypeMeta } from "../types"

/**
 * The 7 canonical block types (`CV-BUILDER-BLOCK-EDITOR-BRAINSTORM.md`, "BẢNG
 * CHỐT") — the single source for their default title / repeatability /
 * AI-affordance metadata. The "+ Thêm block" picker + the (not yet built)
 * block-type → editor-component resolver both read this map instead of
 * branching on `CvBlockType` ad hoc.
 *
 * `personal` and `summary` are singleton + non-repeatable (one fields set,
 * kept on `block.items[0]` for a uniform `CvBlock` shape across every type).
 * Every other type is repeatable (N items) and may appear at most once as a
 * BLOCK but hold many items (e.g. many `experience` entries inside the one
 * "Kinh nghiệm" block) — "singleton" here means "at most one BLOCK of this
 * type in the document", not "at most one item".
 */
export const CV_BLOCK_TYPE_REGISTRY: Record<CvBlockType, CvBlockTypeMeta> = {
    [CvBlockType.Personal]: {
        type: CvBlockType.Personal,
        titleKey: "cv.blocks.personal.title",
        repeatable: false,
        singleton: true,
        aiAssisted: false,
    },
    [CvBlockType.Summary]: {
        type: CvBlockType.Summary,
        titleKey: "cv.blocks.summary.title",
        repeatable: false,
        singleton: true,
        aiAssisted: false,
    },
    [CvBlockType.Experience]: {
        type: CvBlockType.Experience,
        titleKey: "cv.blocks.experience.title",
        repeatable: true,
        singleton: true,
        aiAssisted: false,
    },
    [CvBlockType.Education]: {
        type: CvBlockType.Education,
        titleKey: "cv.blocks.education.title",
        repeatable: true,
        singleton: true,
        aiAssisted: false,
    },
    [CvBlockType.Skills]: {
        type: CvBlockType.Skills,
        titleKey: "cv.blocks.skills.title",
        repeatable: true,
        singleton: true,
        aiAssisted: false,
    },
    [CvBlockType.Project]: {
        type: CvBlockType.Project,
        titleKey: "cv.blocks.project.title",
        repeatable: true,
        singleton: true,
        aiAssisted: true,
    },
    [CvBlockType.Achievement]: {
        type: CvBlockType.Achievement,
        titleKey: "cv.blocks.achievement.title",
        repeatable: true,
        singleton: true,
        aiAssisted: false,
    },
    [CvBlockType.Certification]: {
        type: CvBlockType.Certification,
        titleKey: "cv.blocks.certification.title",
        repeatable: true,
        singleton: true,
        aiAssisted: false,
    },
    [CvBlockType.Language]: {
        type: CvBlockType.Language,
        titleKey: "cv.blocks.language.title",
        repeatable: true,
        singleton: true,
        aiAssisted: false,
    },
    [CvBlockType.Activity]: {
        type: CvBlockType.Activity,
        titleKey: "cv.blocks.activity.title",
        repeatable: true,
        singleton: true,
        aiAssisted: false,
    },
    [CvBlockType.Interest]: {
        type: CvBlockType.Interest,
        titleKey: "cv.blocks.interest.title",
        repeatable: true,
        singleton: true,
        aiAssisted: false,
    },
}

/** Ordered list of every canonical block type — drives the "+ Thêm block" menu order. */
export const CV_BLOCK_TYPE_ORDER: Array<CvBlockType> = [
    CvBlockType.Personal,
    CvBlockType.Summary,
    CvBlockType.Experience,
    CvBlockType.Education,
    CvBlockType.Skills,
    CvBlockType.Project,
    CvBlockType.Achievement,
    CvBlockType.Certification,
    CvBlockType.Language,
    CvBlockType.Activity,
    CvBlockType.Interest,
]

/**
 * English default title per block type — used instead of the i18n (Vietnamese)
 * `titleKey` default when the document's `style.language` is `"en"` (see
 * `CvEditor.onAddBlock`). Kept as a flat literal map (not i18n) because it is
 * the CV's OWN language, independent of the app's UI locale.
 */
export const CV_BLOCK_TYPE_DEFAULT_TITLE_EN: Record<CvBlockType, string> = {
    [CvBlockType.Personal]: "Personal information",
    [CvBlockType.Summary]: "Summary",
    [CvBlockType.Experience]: "Experience",
    [CvBlockType.Education]: "Education",
    [CvBlockType.Skills]: "Skills",
    [CvBlockType.Project]: "Projects",
    [CvBlockType.Achievement]: "Achievements",
    [CvBlockType.Certification]: "Certifications",
    [CvBlockType.Language]: "Languages",
    [CvBlockType.Activity]: "Activities",
    [CvBlockType.Interest]: "Interests",
}

/**
 * Shared FE-owned block model for the CV block editor (`cv_blocks` document).
 *
 * The backend persists `blocks`/`style` as opaque JSONB — THIS file is the
 * single source of truth for their shape on the frontend (per
 * `CV-BUILDER-BLOCK-EDITOR-BRAINSTORM.md`, "CHỐT AI + PERSISTENCE": *"FE sở
 * hữu schema block (TS types); BE lưu JSONB + validate nhẹ"*). Every block
 * editor component, the live preview, and the LaTeX/PDF mapping all import
 * from here — do not redeclare a parallel shape elsewhere
 * (`concepts/single-source-render`).
 */

import type { CvBlockItemSource } from "@/modules/types/enums/cv-block-item-source"
import type { CvBlockType } from "@/modules/types/enums/cv-block-type"

/**
 * One field/line inside a block item — deliberately loose (`Record<string, string>`)
 * rather than a rigid per-type interface, because each {@link CvBlockType} shapes
 * its items differently (a "personal" item has `{name, email, ...}`, an
 * "experience" item has `{company, role, startDate, endDate, bullets}`, etc.) and
 * new block types will keep adding new item shapes. Per-block editor components
 * know which keys their own block type reads/writes; the shared model only
 * guarantees `id` + (for project items) `source`/`sourceRef`.
 */
export type CvBlockItemFields = Record<string, unknown>

/**
 * One repeatable entry inside a {@link CvBlock} (one job at "experience", one
 * school at "education", one project at "project", ...).
 */
export interface CvBlockItem {
    /** Stable client-side id (uuid) — used as the React key + for reordering/removal. */
    id: string
    /**
     * Origin of this item. Only ever set on `project` block items — every other
     * block type's items are implicitly self-reported and omit this field.
     */
    source?: CvBlockItemSource
    /**
     * When `source` is `verified`, the `user_milestone_task_attempts.id` this
     * item was picked from (`myPickableCvAchievements`). Absent for `self` items.
     */
    sourceRef?: string
    /** The item's own fields — shape depends on the owning block's `type`. */
    fields: CvBlockItemFields
}

/**
 * One section of the CV document (`cv_blocks.blocks[]` — a JSONB array, order
 * preserved by array order, `order` field kept in sync for explicit sorting
 * after reorder-by-drag).
 */
export interface CvBlock {
    /** Stable client-side id (uuid) — used as the React key + for reordering/removal. */
    id: string
    /** Which kind of block this is — selects the editor component + PDF partial. */
    type: CvBlockType
    /**
     * Caller-facing title for this block (e.g. "Kinh nghiệm làm việc"). Editable
     * for repeatable custom blocks the learner adds via "+ Thêm block"; the 7
     * canonical block types ship a sensible i18n default the learner can still
     * override.
     */
    title: string
    /** Display order among sibling blocks (0-based). Kept in sync with array order. */
    order: number
    /**
     * Repeatable entries. Empty for a freshly-added block (or unused for
     * `personal`/`summary`, which hold their single set of fields on `items[0]`
     * for a uniform shape across every block type).
     */
    items: Array<CvBlockItem>
}

/** Relative font-size scale for the whole rendered document. */
export type CvFontScale = "sm" | "md" | "lg"

/** CV document language — drives default block titles + AI prompt language. */
export type CvLanguage = "vi" | "en"

/**
 * Which visual TEMPLATE (layout) renders the CV — same block data, different
 * arrangement. `CvHtmlDocument` dispatches on this. `classic`/`modern`/`minimal`
 * are single-column (ATS-safe); `sidebar` is two-column (visually distinctive,
 * but riskier for ATS parsers + can collapse to one column in the `.docx`
 * export — flagged in the gallery). See `CV-TEMPLATES-BRAINSTORM.md`.
 */
export type CvTemplate = "classic" | "modern" | "sidebar" | "minimal"

/** Templates rendered as two columns — flagged (ATS risk + weak `.docx` support). */
export const CV_TWO_COLUMN_TEMPLATES: ReadonlySet<CvTemplate> = new Set<CvTemplate>(["sidebar"])

/** `{ font, accent, fontScale, language, template }` — the knobs the style rail exposes (`cv_blocks.style`). */
export interface CvStyle {
    /** Font family key (maps to a LaTeX font package server-side). */
    font: string
    /** Accent color (hex) used for section rules/headings in the rendered PDF. */
    accent: string
    /** Relative font-size scale applied to every block (default "md"). */
    fontScale?: CvFontScale
    /** CV language — drives new-block default titles + AI prompt language (default "vi"). */
    language?: CvLanguage
    /** Visual template/layout (default "classic"). */
    template?: CvTemplate
}

/** One CV document (`CvBlocksDocument` — `cv_blocks` row). One user owns many. */
export interface CvDocument {
    /** `cv_blocks.id`. */
    id: string
    /** User-facing name for this CV (document-tab label). */
    label: string
    /** Ordered blocks (parsed JSONB — see {@link CvBlock}). */
    blocks: Array<CvBlock>
    /** `{font, accent}` (parsed JSONB — see {@link CvStyle}). */
    style: CvStyle
    /** MinIO/CDN key of the last rendered PDF; null until `renderCvBlocks` has run once. */
    pdfCdnKey: string | null
    /** ISO 8601 creation timestamp. */
    createdAt: string
    /** ISO 8601 last-update timestamp. */
    updatedAt: string
}

/** Default style applied to a brand-new {@link CvDocument}. */
export const DEFAULT_CV_STYLE: CvStyle = {
    font: "inter",
    accent: "#E84393",
    fontScale: "md",
    language: "vi",
    template: "classic",
}

/**
 * Per-block-editor component contract.
 *
 * Every block editor (`ExperienceBlockEditor`, `ProjectBlockEditor`, ...) is a
 * dumb, controlled component that plugs into the big-form stack with EXACTLY
 * this prop shape — the stack (not yet built in this pass) owns the
 * `blocks: CvBlock[]` array and threads one `CvBlock` + its index down to each
 * editor, never the other way around.
 *
 * ```tsx
 * export interface XBlockEditorProps extends CvBlockEditorProps {}
 * export const XBlockEditor = ({ block, onChange, onRemove, onAiRewrite }: XBlockEditorProps) => { ... }
 * ```
 *
 * - `block` — the `CvBlock` this instance edits (read-only in, changes flow
 *   back out via `onChange`; never mutate `block` in place).
 * - `onChange(next)` — call with a NEW `CvBlock` (same `id`) whenever the user
 *   edits a field, adds/removes/reorders an item. The parent stack persists
 *   the whole `blocks` array via `updateCvBlocks` (debounced autosave — the
 *   editor itself never calls the mutation directly).
 * - `onRemove()` — the user removed this ENTIRE block from the document (the
 *   "×" on the block's own header, distinct from per-item remove which the
 *   editor handles internally via `onChange`).
 * - `onAiRewrite(itemId, instruction?)` — optional; only blocks with an
 *   "✨ AI viết giúp" affordance (`summary`, `experience`, `project`) wire
 *   this. Resolves to the rewritten `CvBlockItem["fields"]` for that one item
 *   (or the whole block's single fields set for `summary`) — the editor is
 *   responsible for its OWN spinner/retry-in-place UI while the call is in
 *   flight; a failure must never block the rest of the form.
 */
export interface CvBlockEditorProps {
    /** The block this editor instance renders/edits. */
    block: CvBlock
    /** Emit a replacement block (same `id`) after any edit. */
    onChange: (next: CvBlock) => void
    /** Remove this entire block from the document. */
    onRemove: () => void
    /**
     * Ask the AI to rewrite one item's prose (or the block's own fields when it
     * has no items, e.g. `summary`). Omitted on block types with no AI affordance.
     */
    onAiRewrite?: (itemId: string | undefined, instruction?: string) => Promise<CvBlockItemFields>
}

/**
 * Registry mapping a {@link CvBlockType} to metadata needed to render its row
 * in the "+ Thêm block" picker and (once built) resolve its editor component.
 * Lives in `BlockRegistry/index.ts` (sibling of this file) — add a new block
 * TYPE by adding one entry there, not by branching all over the workspace.
 */
export interface CvBlockTypeMeta {
    /** The block type this entry describes. */
    type: CvBlockType
    /** i18n key for this block type's default title (e.g. `cv.blocks.experience.title`). */
    titleKey: string
    /** Whether this block type supports multiple items (vs. a single fields set on `items[0]`). */
    repeatable: boolean
    /** Whether this block type may only appear once in a document (e.g. `personal`, `summary`). */
    singleton: boolean
    /** Whether this block type has an "✨ AI viết giúp" affordance. */
    aiAssisted: boolean
}

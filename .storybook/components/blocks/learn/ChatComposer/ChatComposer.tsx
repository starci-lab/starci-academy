import React from "react"
import type { ReactNode } from "react"
import { cn, ScrollShadow, Typography } from "@heroui/react"
import { MagnifyingGlassIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react"
import { Button } from "../../buttons/Button/Button"
import { ChipButtonList, type ChipButtonItem } from "../../buttons/ChipButtonList/ChipButtonList"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported from
 * `src/components/features/learn/ContentAiChat/index.tsx` (the composer region,
 * ~:1400-1493). One function: "soạn & gửi tin" — everything the learner touches to
 * type a question, pick a model, open the retrieval-skill menu, and send. Distinct
 * from the thread block ({@link ChatThread}) which only RENDERS turns.
 *
 * Three regions, all owned by this one block (mirrors the source's in-flow layout,
 * top to bottom):
 * - **selection box** (:1402-1421) — while a passage is selected, the plain input
 *   moves OUT of the composer into its own bordered box, preceded by up to 3
 *   quick-ask chips (only before the first turn: :1404-1418).
 * - **skill menu** (:1426-1454) — an IN-FLOW `role="listbox"` region (NOT a
 *   popover) that appears ABOVE the composer when toggled; a hint line + a
 *   {@link ChipButtonList} `direction="column"` of the 4 retrieval skills
 *   (challenges/flashcards/lessons/related).
 * - **composer** (:1462-1493) — the rounded chrome box: the plain input (unless a
 *   passage is selected, in which case this box holds ONLY the action row), then
 *   an action row of `modelPicker` slot (left) + skill-menu toggle + send (right).
 *
 * The input (:936-958) is a BARE `<input>` — not a HeroUI field — so the composer
 * never nests a second border/ring inside its own ring. Enter sends; Escape closes
 * the skill menu.
 */

/** One quick-ask / skill-menu row item (re-exported from {@link ChipButtonList}). */
export type { ChipButtonItem }

/** Selected-passage mode: drives the "input rời khỏi composer" layout (:1402-1421, :1463). */
export interface ChatComposerSelection {
    /** `true` → a passage is selected; the input moves into its own box above the composer. */
    hasSelection: boolean
    /** Quick-ask chips (secondary, full-width, column) — offered only before the first turn. */
    quickAsks?: Array<ChipButtonItem>
    /** `true` → render `quickAsks` (caller gates this on "no messages yet", :1404). */
    showQuickAsks?: boolean
}

/** Props for the {@link ChatComposer} block. */
export interface ChatComposerProps {
    /** Current draft text. */
    value: string
    /** Fired on every keystroke. */
    onChange: (value: string) => void
    /** Fired by Enter or the send button. The caller owns the empty/streaming guard (source `onSend`, :709-716). */
    onSubmit: () => void
    /** Input placeholder (also the fallback aria-label). */
    placeholder?: string
    /** Input accessible name; defaults to `placeholder`. */
    ariaLabel?: string
    /** `true` → the send button shows its pending spinner and locks press (:1485). */
    isStreaming?: boolean
    /** `true` → disable the whole composer (input + every action button). */
    isDisabled?: boolean
    /** Whether the retrieval-skill menu region is open (:1426). */
    isSkillMenuOpen: boolean
    /** Fired by the magnifier toggle (:1477) or Escape while the menu is open (:952-955). */
    onToggleSkillMenu: () => void
    /** Hint line shown atop the skill menu (source `contentAi.commands.hint`, :1433). */
    skillMenuHint?: ReactNode
    /** `aria-label` on the skill-menu `listbox` region (source `contentAi.commands.aria`, :1429). */
    skillMenuAriaLabel?: string
    /** The 4 retrieval-skill rows (challenges/flashcards/lessons/related, :1436-1451). */
    skills: Array<ChipButtonItem>
    /** Selected-passage mode — omit when nothing is selected. */
    selection?: ChatComposerSelection
    /** Model picker slot (real UI = `GradeModelDropdown`, task="chatting", placement="top start", :908-920). */
    modelPicker?: ReactNode
    /** Send button `aria-label` (source `contentAi.send`, :1486). */
    sendAriaLabel?: string
    /** Skill-menu toggle button `aria-label` (source `contentAi.commands.aria`, :1475). */
    skillsToggleAriaLabel?: string
    /** Extra classes on the root. */
    className?: string
    /** Anatomy tag: names the root so a PARENT panel can badge this whole composer. */
    anatPart?: string
    /** When on, emit `data-anat-part` on each part so a {@link BlockAnatomy} panel can badge them on-render. */
    showAnatomy?: boolean
}

/**
 * ChatComposer — the "soạn & gửi tin" region: selected-passage quick-asks, the
 * in-flow retrieval-skill menu, and the composer chrome itself (input + model
 * picker + skill toggle + send).
 *
 * @param props - {@link ChatComposerProps}
 */
export const ChatComposer = ({
    value,
    onChange,
    onSubmit,
    placeholder = "Hỏi AI về bài học này…",
    ariaLabel,
    isStreaming = false,
    isDisabled = false,
    isSkillMenuOpen,
    onToggleSkillMenu,
    skillMenuHint = "Chọn một kỹ năng để tìm nhanh nội dung liên quan",
    skillMenuAriaLabel = "Kỹ năng truy hồi",
    skills,
    selection,
    modelPicker,
    sendAriaLabel = "Gửi",
    skillsToggleAriaLabel = "Kỹ năng truy hồi",
    className,
    anatPart,
    showAnatomy = false,
}: ChatComposerProps) => {
    const hasSelection = selection?.hasSelection ?? false
    const showQuickAsks = hasSelection
        && (selection?.showQuickAsks ?? false)
        && (selection?.quickAsks?.length ?? 0) > 0

    // Plain input — no HeroUI field chrome, so it never nests a second border/ring
    // inside whichever box currently owns it (composer, or the selection box).
    const inputField = (
        <input
            type="text"
            aria-label={ariaLabel ?? placeholder}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
            placeholder={placeholder}
            value={value}
            disabled={isDisabled}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.preventDefault()
                    onSubmit()
                }
                if (event.key === "Escape" && isSkillMenuOpen) {
                    event.preventDefault()
                    onToggleSkillMenu()
                }
            }}
            data-anat-part={showAnatomy ? "input" : undefined}
        />
    )

    return (
        <div className={cn("flex flex-col gap-2", className)} data-anat-part={anatPart}>
            {/* selected-passage quick-asks + input (the excerpt itself is pinned at
                the top of the rail, out of this block's scope). Quick-asks show only
                before the first turn (:1400-1421). */}
            {hasSelection ? (
                <div className="flex flex-col gap-2 rounded-xl border border-default bg-transparent px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
                    {showQuickAsks ? (
                        <ChipButtonList
                            items={selection?.quickAsks ?? []}
                            direction="column"
                            variant="secondary"
                            anatPart={showAnatomy ? "ChipButtonList.QuickAsk" : undefined}
                            showAnatomy={showAnatomy}
                        />
                    ) : null}
                    {inputField}
                </div>
            ) : null}

            {/* retrieval-skill menu — an IN-FLOW region (not a popover) sitting above
                the composer; the ⌥ composer button toggles it (:1423-1454). */}
            {isSkillMenuOpen ? (
                <div
                    role="listbox"
                    aria-label={skillMenuAriaLabel}
                    className="flex flex-col overflow-hidden rounded-2xl border border-default bg-surface"
                >
                    <div className="px-3 pb-1 pt-2">
                        <Typography
                            type="body-xs"
                            color="muted"
                            data-anat-part={showAnatomy ? "Typography.Hint" : undefined}
                        >
                            {skillMenuHint}
                        </Typography>
                    </div>
                    <ScrollShadow hideScrollBar className="max-h-64 min-h-0 overflow-y-auto p-1">
                        <ChipButtonList
                            items={skills}
                            direction="column"
                            variant="ghost"
                            anatPart={showAnatomy ? "ChipButtonList.Skills" : undefined}
                            showAnatomy={showAnatomy}
                        />
                    </ScrollShadow>
                </div>
            ) : null}

            {/* composer — input lives here UNLESS a passage is selected (it moved to
                the selection box above); the action row always renders (:1461-1493). */}
            <div className="flex flex-col gap-2 rounded-2xl bg-default px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
                {!hasSelection ? inputField : null}
                <div className="flex w-full items-center justify-between gap-2">
                    <div className="min-w-0 overflow-hidden">
                        {modelPicker}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {/* NOTE (TODO port): base Button doesn't forward `aria-expanded` —
                            the source sets it on the real HeroUI button (:1476). Open/closed
                            is still conveyed visually (the listbox region appears right above). */}
                        <Button
                            iconOnly
                            size="sm"
                            variant="tertiary"
                            ariaLabel={skillsToggleAriaLabel}
                            isDisabled={isDisabled}
                            onPress={onToggleSkillMenu}
                            icon={<MagnifyingGlassIcon aria-hidden focusable="false" />}
                            anatPart={showAnatomy ? "Button.ToggleSkill" : undefined}
                        />
                        <Button
                            iconOnly
                            size="sm"
                            variant="primary"
                            isPending={isStreaming}
                            isDisabled={isDisabled}
                            ariaLabel={sendAriaLabel}
                            onPress={onSubmit}
                            icon={<PaperPlaneTiltIcon aria-hidden focusable="false" />}
                            anatPart={showAnatomy ? "Button.Send" : undefined}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

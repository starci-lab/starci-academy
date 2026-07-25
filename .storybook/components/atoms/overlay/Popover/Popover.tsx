import type { ComponentType, ReactNode, SVGProps } from "react"
import { Popover as HeroPopover, Button as HeroButton } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Popover.Base`: the ONE constrained click-panel atom over HeroUI Popover.
 *
 * Bọc HeroUI `Popover` TỐI ĐA (alias `HeroPopover`) + một `Button` (alias
 * `HeroButton`) làm trigger pressable (react-aria `DialogTrigger` bắt buộc trigger là
 * pressable). Atom SỞ HỮU chrome: dialog surface, placement, arrow, heading.
 *
 * NAMESPACE (thầy chốt 2026-07-25): atom KHÔNG export component trần — mọi thành
 * viên đi qua `Popover.*` (hôm nay chỉ có `Base`), khớp `Chip.*` / `Button.*`.
 *
 * KHÔNG `children` (luật ② thầy chốt 2026-07-25): nhãn nút mở đi bằng PROP DỮ LIỆU
 * `triggerLabel` (+ `triggerIcon` là COMPONENT, atom tự ép scale). Popover KHÔNG
 * buộc phải bọc phần tử khác — trigger do chính atom dựng — nên KHÔNG thuộc ngoại
 * lệ wrapper (chỉ `Tooltip`/`Badge` được giữ `children`).
 *
 * STRICT §4: `content` là THÂN panel (ReactNode — được giữ vì là nội dung, không phải
 * children), `heading` (tuỳ chọn) render `Popover.Heading`. `isOpen`/`defaultOpen` để
 * STORY pin panel mở (soi tĩnh).
 *
 * Overlay portal: `Popover.Content` render RA NGOÀI render-box nên badge on-render chỉ
 * neo được `Trigger`; các part panel vẫn hiện trong legend + Cây.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** An icon passed as a COMPONENT (e.g. `CircleInfo`), rendered by the atom at trigger scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/** Props for {@link PopoverBase}. */
export interface PopoverBaseProps {
    /** Trigger button label (nhãn, KHÔNG phải children). */
    triggerLabel: ReactNode
    /** Leading icon of the trigger as a COMPONENT reference. Atom ép `size-3.5` (scale chữ nút). */
    triggerIcon?: IconComponent
    /** Panel body. */
    content: ReactNode
    /** Optional bold heading line above the body. */
    heading?: ReactNode
    /** Trigger button visual. Default `"secondary"`. */
    triggerVariant?: "primary" | "secondary" | "tertiary" | "ghost"
    /** Placement of the panel relative to the trigger. Default `"bottom"`. */
    placement?: "top" | "bottom" | "left" | "right" | "bottom start" | "bottom end" | "top start" | "top end"
    /** Render the little arrow pointing at the trigger. Default `true`. */
    showArrow?: boolean
    /** Controlled open — pin the panel open (STORY soak). */
    isOpen?: boolean
    /** Uncontrolled initial-open state. */
    defaultOpen?: boolean
    /** Open-state change handler (uncontrolled/controlled). */
    onOpenChange?: (isOpen: boolean) => void
    /** Dev/spec: emit `data-anat-part` on Trigger/Content/Heading so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    /** Extra classes on the trigger. */
    className?: string
}

/**
 * The base popover atom. See file header for the strict contract.
 *
 * @param props - {@link PopoverBaseProps}
 */
const PopoverBase = ({
    triggerLabel,
    triggerIcon: TriggerIcon,
    content,
    heading,
    triggerVariant = "secondary",
    placement = "bottom",
    showArrow = true,
    isOpen,
    defaultOpen,
    onOpenChange,
    showAnatomy = false,
    className,
}: PopoverBaseProps) => {
    return (
        <HeroPopover isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
            <HeroButton variant={triggerVariant} className={className} data-anat-part={showAnatomy ? "Trigger" : undefined}>
                {TriggerIcon ? (
                    // Atom sở hữu glyph scale — `!` bắt buộc vì HeroUI có rule `.button svg` specificity cao hơn.
                    <span
                        aria-hidden
                        data-anat-part={showAnatomy ? "TriggerIcon" : undefined}
                        className="inline-flex shrink-0 [&_svg]:!size-3.5"
                    >
                        <TriggerIcon />
                    </span>
                ) : null}
                {triggerLabel}
            </HeroButton>
            <HeroPopover.Content
                placement={placement}
                className="w-64 max-w-[calc(100vw-2rem)]"
                data-anat-part={showAnatomy ? "Content" : undefined}
            >
                {showArrow ? <HeroPopover.Arrow data-anat-part={showAnatomy ? "Arrow" : undefined} /> : null}
                {heading ? (
                    <HeroPopover.Heading className="mb-1 text-sm font-semibold text-foreground" data-anat-part={showAnatomy ? "Heading" : undefined}>
                        {heading}
                    </HeroPopover.Heading>
                ) : null}
                <div className="text-sm text-muted" data-anat-part={showAnatomy ? "Body" : undefined}>
                    {content}
                </div>
            </HeroPopover.Content>
        </HeroPopover>
    )
}

/**
 * `Popover.*` — the click-panel ATOM namespace. `Popover.Base` là atom popover DUY
 * NHẤT (heading/arrow/placement đều là LEAF prop-driven của nó).
 */
export const Popover = {
    Base: PopoverBase,
}

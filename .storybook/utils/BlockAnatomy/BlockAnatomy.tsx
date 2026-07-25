"use client"
/* eslint-disable starci-fe/no-fractional-spacing -- DEV/SPEC: rail/pill của cây dùng
   nấc phụ (ml-[3px] · pb-2.5) có chủ ý; đây là đồ nghề, không phải app UI trên §10. */

import React, { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { type AnatomyTier } from "@sb-utils/AnatomyOverlay/anatomy-context"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ĐỒ NGHỀ — BlockAnatomy: XEM CÂY DOM mà một leaf thực sự dựng ra.
 *
 * Rút gọn 2026-07-26 (thầy chốt qua 3 lượt cắt): panel chỉ còn HAI thứ — bản render
 * + cây part. KHÔNG badge chồng lên hình · KHÔNG bấm · KHÔNG bảng số · KHÔNG tab.
 * Mấy thứ đó rối hơn là giúp (neo: badge 1·2·3 đè kín một cái chip 60px).
 *
 * MỘT ĐƯỜNG DUY NHẤT. Trước đó trò để bản cũ chạy song song cho story chưa migrate,
 * hậu quả:  vẫn hiện badge sau khi đã đổi. Hai bản cho cùng
 * một việc thì bản cũ sẽ sống mãi.
 *
 * CẤU TRÚC luôn suy từ DOM (leo ancestor của ) — không ai gõ tay
 * được nên không trôi được. Phần người viết chỉ còn WHY.
 *
 * ⚠️ GIỚI HẠN — part render qua PORTAL (popover/dropdown) nằm ngoài render-box nên
 * không leo được ancestor chain; chúng không xuất hiện trong cây.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Chú giải cho MỘT part — chỉ WHY, KHÔNG cấu trúc (cấu trúc suy từ DOM). */
export interface AnatomyAnnotation {
    /** Part này làm gì trong leaf này. */
    role?: string
    /** Tầng của part. */
    tier?: AnatomyTier
    /** Ghi chú trạng thái (vd `"skeleton"`). */
    state?: string
    /** Story id của chính part đó — bấm số để nhảy sang. */
    storyId?: string
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — BlockAnatomy: the anatomy axis for ONE LEAF.
 *
 * ANATOMY IS PER-LEAF. A block has several LEAVES — distinct-composition
 * states/scenarios (a shape WITH ProgressMeter vs one WITHOUT · `loading` →
 * Skeleton · `error` → EmptyState · `empty` · `search-empty`). Each leaf is its
 * OWN Storybook story, and EACH wraps its render in its OWN BlockAnatomy — there
 * is NO single consolidated "Anatomy" story. This panel therefore describes ONE
 * leaf: the parts THAT leaf composes, nothing more.
 *
 * Two calm views, toggled by HeroUI `Tabs` (variant="primary" — the segmented
 * pill for a panel-content switch):
 * - **Sơ đồ** — the leaf renders CLEAN; each part carries only a small numbered
 *   {@link Chip} anchor (via {@link AnatomyOverlay} reading this panel's context).
 *   A {@link Table} legend maps number → name · role · tier. Content is never covered.
 * - **Cây** — no render: just this leaf's composition TREE (what contains what).
 *
 * Rendered with HeroUI (Tabs · Chip · Table) + Phosphor icons. Dev/spec only,
 * NO `@/components` imports (HeroUI + storybook-local ports only).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One node of a leaf's composition. `children` nests a sub-block's own parts. */
export interface AnatomyNode {
    /** MUST match the `label` its {@link AnatomyOverlay} passes (e.g. `"TextField · Input"`). */
    name: string
    tier: AnatomyTier
    /** What this part does in this leaf. */
    role?: string
    /** Tone/state note for this part (e.g. `"warning"`). Shown as a chip. */
    state?: string
    /**
     * Storybook story/docs id of THIS part's own component (e.g.
     * `"design-cards-continuecard-plain--progress"`). When set, clicking the
     * part's numbered chip (or legend #) jumps to that story so you can inspect
     * the ref directly. Absent → the chip toggles the spotlight instead.
     */
    storyId?: string
    children?: Array<AnatomyNode>
}

/** Storybook manager route for a story id (breaks out of the preview iframe). */
const storyHref = (storyId: string) => `/?path=/story/${storyId}`

/** Props for the {@link BlockAnatomy} panel (ONE leaf). */
export interface BlockAnatomyProps {
    /** Block/design display name (header + tree root). */
    name: string
    tier: AnatomyTier
    /**
     * THIS leaf's composed parts (children of the block root), in visual order.
     *
     * @deprecated Đường CŨ — mảng này khai LẠI cấu trúc bằng tay nên trôi khỏi hình
     * (neo: `TruthList` khai `Skeleton.Indicator` mà block thật đã bỏ). Story mới
     * dùng {@link BlockAnatomyProps.annotate}: cây dựng từ DOM, tay chỉ ghi WHY.
     */
    parts: Array<AnatomyNode>
    /**
     * ĐƯỜNG MỚI — bật chế độ **XEM CÂY DOM** (thầy chốt 2026-07-26).
     *
     * Panel rút còn hai thứ: bản render + cây `data-anat-part` mà nó thực sự dựng ra.
     * **KHÔNG badge chồng lên hình, KHÔNG bấm, KHÔNG bảng số** — mấy thứ đó rối hơn
     * là giúp (neo: badge 1·2·3 đè lên một cái chip 60px, chữ không đọc nổi).
     *
     * Bảng này CHỈ để chú thích thêm (`role`/`tier`) cho part nào cần; cấu trúc
     * luôn đến từ DOM. Bỏ trống `annotate` cũng chạy được — cây vẫn hiện.
     */
    annotate?: Record<string, AnatomyAnnotation>
    /** THIS leaf's live render (pass the component in this exact state). */
    children: ReactNode
    /** Leaf label shown in the header (e.g. `"Đang tải"`, `"Có tiến độ"`). */
    leaf?: string
    /** Short one-liner: what makes THIS leaf's composition/shape what it is. */
    note?: ReactNode
    /** Optional fuller rationale for the whole composite (usually only on the main leaf). */
    reason?: ReactNode
    /** Optional usage snippet for THIS leaf (e.g. `<Chip.Base isSkeleton text="…" />`) — shown as a code block. */
    code?: string
}

/**
 * MÀU TẦNG cho cây DOM (thầy duyệt 2026-07-26) — bảng PHÂN LOẠI, cố ý KHÔNG dùng
 * token ngữ nghĩa (`warning`/`success`/`danger`): tầng là loại, không phải trạng
 * thái. Cùng lý lẽ đã áp cho ramp độ khó của `VariantChip`.
 */
const TIER_PILL: Record<AnatomyTier, string> = {
    block: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    primitive: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    design: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    atom: "bg-default text-muted",
}

/** Thanh dẫn dọc — cùng hệ màu với pill, nhạt hơn một nấc. */
const TIER_RAIL: Record<AnatomyTier, string> = {
    block: "border-purple-400",
    primitive: "border-blue-400",
    design: "border-emerald-400",
    atom: "border-default",
}

/** Nhãn tầng hiện ra — `primitive` là tên CŨ của tầng layout (§13). */
const TIER_NAME: Record<AnatomyTier, string> = {
    block: "block",
    primitive: "layout",
    design: "design",
    atom: "atom",
}
/**
 * Rút mảng `parts` VIẾT TAY (đường cũ) thành bảng chú giải phẳng.
 *
 * Chỉ giữ phần WHY (`role`/`tier`/`state`/`storyId`) — phần **cấu trúc** trong đó bị
 * BỎ, vì cấu trúc nay luôn suy từ DOM. Nhờ vậy 1394 story cũ giữ nguyên chữ giải
 * thích mà KHÔNG phải sửa file nào.
 */
const flattenParts = (nodes: Array<AnatomyNode>, into: Record<string, AnatomyAnnotation> = {}) => {
    nodes.forEach((node) => {
        if (!(node.name in into)) {
            into[node.name] = { role: node.role, tier: node.tier, state: node.state, storyId: node.storyId }
        }
        if (node.children) {
            flattenParts(node.children, into)
        }
    })
    return into
}

export const BlockAnatomy = ({ name, tier, parts, children, leaf, note, reason, code, annotate }: BlockAnatomyProps) => {
    // MỘT ĐƯỜNG DUY NHẤT (thầy chốt 2026-07-26): anatomy = CÔNG CỤ XEM CÂY DOM.
    // Không còn bản badge/tab/bảng-số nào chạy song song — hai bản là hai trải nghiệm
    // cho cùng một việc, và story cũ sẽ mãi kẹt ở bản cũ (neo: `Screens/CourseContents`
    // vẫn hiện badge sau khi đã đổi, vì nó không truyền `annotate`).
    //
    // `parts` cũ KHÔNG bị vứt: rút lấy phần WHY làm chú giải, cấu trúc lấy từ DOM.
    return (
        <BlockAnatomyDerived
            {...{ name, tier, children, leaf, note, reason, code }}
            annotate={annotate ?? flattenParts(parts ?? [])}
        />
    )
}

/**
 * ĐƯỜNG MỚI — GIỮ NGUYÊN panel gốc (tab Sơ đồ/Cây · switch badge · legend · bảng),
 * chỉ đổi **nguồn** của `parts`: thay vì viết tay thì SUY TỪ DOM.
 *
 * Hai lượt là bình thường: lượt 1 render với `parts` rỗng để có DOM, lượt 2 render
 * lại với cây đã suy. So chuỗi JSON trước khi `setState` để không lặp vô hạn.
 */
const BlockAnatomyDerived = ({
    name,
    tier,
    children,
    leaf,
    note,    annotate,
}: Omit<BlockAnatomyProps, "parts"> & { annotate: Record<string, AnatomyAnnotation> }) => {
    const hostRef = useRef<HTMLDivElement>(null)
    const [derived, setDerived] = useState<Array<AnatomyNode>>([])
    useEffect(() => {
        const host = hostRef.current
        if (!host) {
            return
        }
        let raf = 0
        const scan = () => {
            const els = Array.from(host.querySelectorAll<HTMLElement>("[data-anat-part]"))
            const order: Array<string> = []
            els.forEach((el) => {
                const nm = el.getAttribute("data-anat-part") ?? ""
                // ⭐ `annotate` là DANH SÁCH TRẮNG (§11a, thầy chốt 2026-07-26).
                //
                // DOM phát ra cả RUỘT của component con (`Feedback.Callout` phát
                // `Icon`/`Content`/`Title`/`Description`/`Action`). Vẽ chúng ở đây là
                // ĐÀO VÀO cái đã có story riêng — kể hai lần, và đẻ ra node không bấm
                // được vì chúng là KHE chứ không phải component.
                //
                // Nên cây chỉ nhận node mà tác giả KHAI: đó đúng là tập component mà
                // leaf này COMPOSE. Hệ quả: mọi node trong cây đều có story ⇒ đều bấm
                // được. Muốn xem sâu hơn thì bấm vào, không drill tại chỗ.
                if (nm && nm in annotate && !order.includes(nm)) {
                    order.push(nm)
                }
            })
            // CHA = tổ tiên GẦN NHẤT cũng mang `data-anat-part`. Cấu trúc đến từ DOM.
            const firstEl = new Map<string, HTMLElement>()
            els.forEach((el) => {
                const nm = el.getAttribute("data-anat-part") ?? ""
                if (nm && !firstEl.has(nm)) {
                    firstEl.set(nm, el)
                }
            })
            const parentOf = new Map<string, string | null>()
            order.forEach((nm) => {
                let node = firstEl.get(nm)?.parentElement ?? null
                let parent: string | null = null
                while (node && node !== host) {
                    const up = node.getAttribute("data-anat-part")
                    if (up && order.includes(up)) {
                        parent = up
                        break
                    }
                    node = node.parentElement
                }
                parentOf.set(nm, parent)
            })
            const toNode = (nm: string): AnatomyNode => {
                const meta = annotate[nm]
                const kids = order.filter((child) => parentOf.get(child) === nm)
                return {
                    name: nm,
                    tier: meta?.tier ?? "primitive",
                    role: meta?.role,
                    state: meta?.state,
                    storyId: meta?.storyId,
                    ...(kids.length > 0 ? { children: kids.map(toNode) } : {}),
                }
            }
            const next = order.filter((nm) => parentOf.get(nm) === null).map(toNode)
            // So chuỗi TRƯỚC khi set — nếu không sẽ setState mỗi lượt render → lặp.
            setDerived((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
        }
        raf = requestAnimationFrame(scan)
        const ro = new ResizeObserver(() => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(scan)
        })
        ro.observe(host)
        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
        }
    }, [children, annotate])

    /**
     * Một nhánh — TÊN + pill tier + vai trò. Không số, không badge, không bấm.
     * Thanh dẫn dọc mang MÀU CỦA CHA: liếc màu là biết nhánh này đẻ từ tầng nào,
     * khỏi phải dò ngược lên.
     */
    const Branch = ({ node, depth }: { node: AnatomyNode; depth: number }) => (
        <div
            className={cn(
                depth > 0 && "ml-[3px] border-l-2 pl-3",
                depth > 0 && TIER_RAIL[node.tier],
            )}
        >
            <div className="flex flex-wrap items-baseline gap-2 py-1">
                {/* Có `storyId` → tên part thành LINK mở đúng story của chính nó
                (target `_top` để thoát iframe preview). Không có → chữ thường. */}
                {node.storyId ? (
                    <a
                        href={storyHref(node.storyId)}
                        target="_top"
                        className="font-mono text-xs text-accent underline-offset-2 hover:underline"
                    >
                        {node.name}
                    </a>
                ) : (
                    <span className="font-mono text-xs text-foreground">{node.name}</span>
                )}
                <span className={cn("rounded-full px-2 text-[11px] font-medium leading-5", TIER_PILL[node.tier])}>
                    {TIER_NAME[node.tier]}
                </span>
                {node.state ? (
                    <span className="rounded-full border border-default px-2 text-[11px] leading-5 text-muted">
                        {node.state}
                    </span>
                ) : null}
                {node.role ? <span className="text-xs text-muted">· {node.role}</span> : null}
            </div>
            {node.children?.map((child) => (
                <Branch key={child.name} node={child} depth={depth + 1} />
            ))}
        </div>
    )

    /** Đếm mọi node trong cây (kể cả lồng) để ghi số part ở đầu khung. */
    const countNodes = (nodes: Array<AnatomyNode>): number =>
        nodes.reduce((sum, node) => sum + 1 + countNodes(node.children ?? []), 0)

    return (
        <div ref={hostRef} className="flex flex-col gap-4">
            <div>{children}</div>
            <div className="rounded-xl border border-default bg-surface p-4">
                <div className="mb-2 flex flex-wrap items-baseline gap-2 border-b border-default pb-2.5">
                    <span className="font-mono text-sm text-foreground">{name}</span>
                    <span className={cn("rounded-full px-2 text-[11px] font-medium leading-5", TIER_PILL[tier])}>
                        {TIER_NAME[tier]}
                    </span>
                    {leaf ? <span className="text-[11px] text-muted">· {leaf}</span> : null}
                    <span className="ml-auto text-[11px] text-muted">{countNodes(derived)} part</span>
                </div>
                {derived.length > 0 ? (
                    derived.map((node) => <Branch key={node.name} node={node} depth={1} />)
                ) : (
                    <p className="text-xs text-muted">Không có part nào — component này không phơi `data-anat-part`.</p>
                )}
                {note ? <p className="mt-3 text-xs text-muted">{note}</p> : null}
            </div>
        </div>
    )
}

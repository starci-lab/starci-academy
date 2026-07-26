"use client"
/* eslint-disable starci-fe/no-fractional-spacing -- DEV/SPEC: rail/pill của cây dùng
   nấc phụ (ml-[3px] · pb-2.5) có chủ ý; đây là đồ nghề, không phải app UI trên §10. */

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { type AnatomyTier } from "@sb-utils/AnatomyOverlay/anatomy-context"
import { CodeSnippet } from "@sb-utils/BlockAnatomy/CodeSnippet"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ĐỒ NGHỀ — BlockAnatomy: panel BA TAB dưới khung render của MỘT leaf.
 *
 * Thầy chốt 2026-07-26 (qua prototype): panel là **công cụ bắt lỗi**, không phải
 * chú thích. Ba tab, mỗi tab trả lời đúng một câu hỏi:
 *
 * | Tab | Câu hỏi | Luật |
 * |---|---|---|
 * | **States** | prop sở hữu leaf này có đủ giá trị chưa? | ⛔ KHÔNG vẽ lại hình — khung trên render rồi. Ô xanh = đã render · ô ĐỎ = union có mà leaf chưa render. Header ghi `n/N`. |
 * | **Deps** | leaf này dựng lại story nào? | chỉ component CÓ story riêng, bấm nhảy được. Rỗng thì nói thẳng. |
 * | **Code** | gọi thế nào? | snippet + nút Copy. |
 *
 * Ô đỏ chính là thứ đáng lẽ bắt được `danger` sót khỏi mảng `VARIANTS` của
 * `Button.Base` — trước khi nó mọc thành một story `Danger` lạc chỗ (§12g).
 *
 * CẤU TRÚC cây luôn suy từ DOM (leo ancestor của `data-anat-part`) — không ai gõ
 * tay được nên không trôi được. Phần người viết chỉ còn WHY + bảng phủ.
 *
 * ✍️ Chữ HIỆN RA MÀN HÌNH viết TIẾNG ANH (thầy chốt 2026-07-26: panel nửa Việt
 * nửa thuật-ngữ đọc rất khó). JSDoc/comment thì vẫn tiếng Việt, và neo § nằm ở đây.
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
    /** Story id của chính part đó — bấm để nhảy sang. */
    storyId?: string
}

/**
 * MỘT Ô của bảng phủ ở tab **States** — một giá trị của prop SỞ HỮU leaf này.
 *
 * Khai **ĐỦ TẬP GIÁ TRỊ** của prop, kể cả giá trị leaf CHƯA render (`rendered: false`)
 * — đó mới là chỗ panel có ích: ô đỏ tố cáo giá trị bị bỏ quên (§12g).
 * Prop boolean thì hai ô là đủ: `false` (mặc định) và `true`.
 */
export interface AnatomyStateCell {
    /** Giá trị của prop, viết y như lúc gọi (`"primary"`, `"lg"`, `"true"`). */
    value: string
    /** Một câu NGẮN bằng tiếng Anh: giá trị này dùng lúc nào. */
    hint?: string
    /** Khung story ở trên có render giá trị này không. `false` ⇒ ô ĐỎ. */
    rendered: boolean
}

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
     * `"design-cards-continuecard-plain--progress"`). When set, the part's name
     * becomes a link that jumps straight to that story.
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
     * DEPS — **story KHÁC** mà leaf này dựa vào (thầy chốt 2026-07-26).
     *
     * CHỈ khai component CÓ story riêng. Span nội bộ của atom (`Label`, `Icon`,
     * `Spinner`, `SuffixIcon`) KHÔNG phải deps — khai chúng chỉ làm nhiễu cây, vì
     * bấm vào không nhảy đi đâu được.
     *
     * OPTIONAL: atom lá bọc thẳng HeroUI thì KHÔNG có deps — bỏ hẳn prop này
     * (neo: `Button.Base` rỗng · `Button.Group` khai đúng cái nó dựng lại).
     *
     * @deprecated Đường CŨ khai LẠI cấu trúc bằng tay nên trôi khỏi hình (neo:
     * `TruthList` khai `Skeleton.Indicator` mà block thật đã bỏ). Story mới dùng
     * {@link BlockAnatomyProps.annotate}: cây dựng từ DOM, tay chỉ ghi WHY.
     */
    parts?: Array<AnatomyNode>
    /**
     * ĐƯỜNG MỚI — chú giải cho cây DOM (thầy chốt 2026-07-26).
     *
     * Cấu trúc cây LUÔN đến từ DOM; bảng này chỉ thêm `role`/`tier`/`storyId` cho
     * part nào cần, và đồng thời là **DANH SÁCH TRẮNG**: part không khai thì không
     * vào cây. Bỏ trống cũng chạy — tab Deps khi đó báo "no deps".
     */
    annotate?: Record<string, AnatomyAnnotation>
    /**
     * TAB **States** — bảng PHỦ của prop SỞ HỮU leaf này (§12g).
     *
     * ⛔ KHÔNG vẽ lại hình ở đây: khung story bên trên đã render rồi. Tab này chỉ
     * đối chiếu "prop này có những giá trị nào" với "leaf render được mấy giá trị".
     *
     * Bỏ trống thì tab States biến mất — hợp lý cho block/design (leaf tách theo
     * CẤU TRÚC chứ không theo prop, §14d.2), chỉ tầng atom mới cần bảng phủ.
     */
    states?: Array<AnatomyStateCell>
    /** THIS leaf's live render (pass the component in this exact state). */
    children: ReactNode
    /** Leaf label shown in the header (e.g. `"Prop variant"`). */
    leaf?: string
    /** Short one-liner: what makes THIS leaf's composition/shape what it is. */
    note?: ReactNode
    /** Optional fuller rationale for the whole composite (usually only on the main leaf). */
    reason?: ReactNode
    /** Usage snippet for THIS leaf — shown in the Code tab with a Copy button. */
    code?: string
}

/**
 * MÀU TẦNG cho cây DOM (thầy duyệt 2026-07-26) — bảng PHÂN LOẠI, cố ý KHÔNG dùng
 * token ngữ nghĩa (`warning`/`success`/`danger`): tầng là loại, không phải trạng
 * thái. Cùng lý lẽ đã áp cho ramp độ khó của `VariantChip`.
 *
 * ⚠️ Ngược lại, bảng phủ ở tab States thì ĐÚNG là ngữ nghĩa (đủ / thiếu) nên ở đó
 * dùng thẳng token `success`/`danger`.
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

/** Ba tab của panel. Thứ tự cố định: phủ → phụ thuộc → cách gọi. */
type PanelTab = "states" | "deps" | "code"

/** Nhãn tab hiện trên UI — tiếng Anh, một từ. */
const TAB_LABEL: Record<PanelTab, string> = {
    states: "States",
    deps: "Deps",
    code: "Code",
}

/** Pill nhỏ dùng chung cho tier/state — gom lại để ba chỗ không lệch nhau. */
const PILL = "rounded-full px-2 text-[11px] font-medium leading-5"

/**
 * Rút mảng `parts` VIẾT TAY (đường cũ) thành bảng chú giải phẳng.
 *
 * Chỉ giữ phần WHY (`role`/`tier`/`state`/`storyId`) — phần **cấu trúc** trong đó bị
 * BỎ, vì cấu trúc nay luôn suy từ DOM. Nhờ vậy story cũ giữ nguyên chữ giải thích
 * mà KHÔNG phải sửa file nào.
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

export const BlockAnatomy = ({
    name,
    tier,
    parts,
    children,
    leaf,
    note,
    reason,
    code,
    states,
    annotate,
}: BlockAnatomyProps) => {
    // MỘT ĐƯỜNG DUY NHẤT (thầy chốt 2026-07-26): cấu trúc luôn suy từ DOM. Không có
    // bản panel nào chạy song song — hai bản cho cùng một việc thì bản cũ sống mãi.
    //
    // `parts` cũ KHÔNG bị vứt: rút lấy phần WHY làm chú giải, cấu trúc lấy từ DOM.
    return (
        <BlockAnatomyDerived
            {...{ name, tier, children, leaf, note, reason, code, states }}
            annotate={annotate ?? flattenParts(parts ?? [])}
        />
    )
}

/**
 * Ruột của panel: quét DOM ra cây, rồi bày ba tab quanh nó.
 *
 * Hai lượt render là bình thường: lượt 1 chưa có cây (chưa có DOM), lượt 2 render lại
 * với cây đã suy. So chuỗi JSON trước khi `setState` để không lặp vô hạn.
 */
const BlockAnatomyDerived = ({
    name,
    tier,
    children,
    leaf,
    note,
    reason,
    code,
    states,
    annotate,
}: Omit<BlockAnatomyProps, "parts"> & { annotate: Record<string, AnatomyAnnotation> }) => {
    const hostRef = useRef<HTMLDivElement>(null)
    const [derived, setDerived] = useState<Array<AnatomyNode>>([])
    // Shiki cần biết nền sáng hay tối; đọc từ chính DOM đang bọc panel.
    const [isDark, setIsDark] = useState(false)
    useEffect(() => {
        const host = hostRef.current
        if (!host) {
            return
        }
        let raf = 0
        const scan = () => {
            setIsDark(Boolean(host.closest(".dark")) || document.documentElement.classList.contains("dark"))
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
     * Một nhánh — TÊN + pill tier + vai trò. Không số, không badge chồng lên hình.
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
                <span className={cn(PILL, TIER_PILL[node.tier])}>{TIER_NAME[node.tier]}</span>
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

    /** Đếm mọi node trong cây (kể cả lồng) để ghi số lên tab Deps. */
    const countNodes = (nodes: Array<AnatomyNode>): number =>
        nodes.reduce((sum, node) => sum + 1 + countNodes(node.children ?? []), 0)

    const stateCells = states ?? []
    const coveredCount = stateCells.filter((cell) => cell.rendered).length
    const missingCount = stateCells.length - coveredCount
    const depsCount = countNodes(derived)

    // Tab nào KHÔNG có dữ liệu thì không mọc ra: block/design không khai `states`,
    // story chưa viết snippet thì không có `code`. Deps luôn có (rỗng cũng đáng nói).
    const tabs: Array<PanelTab> = [
        ...(stateCells.length > 0 ? (["states"] as const) : []),
        "deps" as const,
        ...(code ? (["code"] as const) : []),
    ]
    const [picked, setPicked] = useState<PanelTab | null>(null)
    // Không dùng effect để chốt tab mặc định: cứ suy tại chỗ, tab bị gỡ thì rơi về đầu.
    const activeTab: PanelTab = picked && tabs.includes(picked) ? picked : tabs[0]

    const [isCopied, setIsCopied] = useState(false)
    const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(() => {
        // Dọn timer "Copied" khi story đổi leaf — tránh setState sau unmount.
        return () => {
            if (copyTimer.current) {
                clearTimeout(copyTimer.current)
            }
        }
    }, [])
    const handleCopy = () => {
        void navigator.clipboard?.writeText(code ?? "")
        setIsCopied(true)
        if (copyTimer.current) {
            clearTimeout(copyTimer.current)
        }
        copyTimer.current = setTimeout(() => setIsCopied(false), 1200)
    }

    return (
        <div ref={hostRef} className="flex flex-col gap-4">
            {/* Khung render THẬT của leaf. Bảng phủ bên dưới KHÔNG vẽ lại hình. */}
            <div>{children}</div>

            <div className="overflow-hidden rounded-xl border border-default bg-surface">
                <div className="flex flex-wrap items-baseline gap-2 border-b border-default px-4 py-3">
                    <span className="font-mono text-sm text-foreground">{name}</span>
                    <span className={cn(PILL, TIER_PILL[tier])}>{TIER_NAME[tier]}</span>
                    {leaf ? <span className="text-[11px] text-muted">· {leaf}</span> : null}
                    {stateCells.length > 0 ? (
                        <span
                            className={cn(
                                "ml-auto text-[11px] font-semibold",
                                missingCount > 0 ? "text-danger-soft-foreground" : "text-muted",
                            )}
                        >
                            {coveredCount}/{stateCells.length} states
                        </span>
                    ) : null}
                </div>

                {/* Một tab thì khỏi bày thanh tab — story cũ (chỉ có Deps) trông y như trước. */}
                {tabs.length > 1 ? (
                    <div role="tablist" aria-label="Anatomy views" className="flex gap-1 border-b border-default px-3">
                        {tabs.map((tabId) => {
                            const isActive = tabId === activeTab
                            const count = tabId === "states" ? stateCells.length : tabId === "deps" ? depsCount : null
                            return (
                                <button
                                    key={tabId}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setPicked(tabId)}
                                    className={cn(
                                        "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-semibold",
                                        isActive
                                            ? "border-accent text-foreground"
                                            : "border-transparent text-muted hover:text-foreground",
                                    )}
                                >
                                    {TAB_LABEL[tabId]}
                                    {count === null ? null : (
                                        <span className="rounded-full bg-default px-1.5 text-[11px] font-bold leading-4 text-muted">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                ) : null}

                <div className="p-4">
                    {activeTab === "states" ? (
                        <div className="flex flex-col gap-3">
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {stateCells.map((cell) => (
                                    <div
                                        key={cell.value}
                                        className={cn(
                                            "flex items-center gap-2 rounded-lg border px-3 py-2",
                                            cell.rendered
                                                ? "border-default bg-surface"
                                                : "border-danger bg-danger-soft",
                                        )}
                                    >
                                        <span
                                            aria-hidden
                                            className={cn(
                                                "size-1.5 shrink-0 rounded-full",
                                                cell.rendered ? "bg-success" : "bg-danger",
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                "font-mono text-xs",
                                                cell.rendered ? "text-foreground" : "text-danger-soft-foreground",
                                            )}
                                        >
                                            {cell.value}
                                        </span>
                                        {cell.hint ? (
                                            <span className="truncate text-[11px] text-muted">{cell.hint}</span>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                            {missingCount > 0 ? (
                                <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger-soft-foreground">
                                    Red means the prop accepts this value but the render above skips it. Left alone, it
                                    grows into a stray story somewhere else.
                                </p>
                            ) : (
                                <p className="text-xs text-muted">
                                    Every value this prop accepts is rendered above.
                                </p>
                            )}
                        </div>
                    ) : null}

                    {activeTab === "deps" ? (
                        derived.length > 0 ? (
                            derived.map((node) => <Branch key={node.name} node={node} depth={1} />)
                        ) : (
                            <p className="rounded-lg border border-dashed border-default px-3 py-3 text-xs text-muted">
                                No deps — this leaf rebuilds nothing that has a story of its own.
                            </p>
                        )
                    ) : null}

                    {activeTab === "code" && code ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="rounded-lg border border-default px-2 py-1 text-[11px] font-medium text-muted hover:text-foreground"
                                >
                                    {isCopied ? "Copied" : "Copy"}
                                </button>
                            </div>
                            <CodeSnippet code={code} isDark={isDark} />
                        </div>
                    ) : null}
                </div>

                {/* WHY của cả leaf — nằm NGOÀI tab để đổi tab không mất mạch đọc. */}
                {reason || note ? (
                    <div className="flex flex-col gap-1.5 border-t border-default px-4 py-3">
                        {reason ? <p className="text-xs text-foreground">{reason}</p> : null}
                        {note ? <p className="text-xs text-muted">{note}</p> : null}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

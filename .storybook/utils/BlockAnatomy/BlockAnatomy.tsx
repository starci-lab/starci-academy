"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { type AnatomyTier } from "@sb-utils/AnatomyOverlay/anatomy-context"
import { CodeSnippet } from "@sb-utils/BlockAnatomy/CodeSnippet"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ĐỒ NGHỀ — BlockAnatomy: panel HAI TAB dưới khung render của MỘT leaf.
 *
 * Thầy chốt 2026-07-26 (qua prototype), rồi RÚT GỌN cùng ngày sau khi soi thật
 * trên Storybook: tab **States** bị bỏ hẳn — khung render bên trên ĐÃ hiện đủ mọi
 * giá trị rồi, một tab riêng chỉ lặp lại đúng thứ mắt vừa thấy bằng chữ. Còn hai
 * tab, mỗi tab trả lời đúng một câu hỏi:
 *
 * | Tab | Câu hỏi | Luật |
 * |---|---|---|
 * | **Deps** | leaf này dựng lại story nào? | chỉ component CÓ `storyId` — bấm nhảy được. KHÔNG có thì THÔI, tab không mọc ra (không còn dòng "no deps" placeholder). |
 * | **Code** | gọi thế nào? | snippet + nút Copy. |
 *
 * CẤU TRÚC cây luôn suy từ DOM (leo ancestor của `data-anat-part`) — không ai gõ
 * tay được nên không trôi được. Phần người viết chỉ còn WHY + `storyId`.
 *
 * ✍️ Chữ HIỆN RA MÀN HÌNH viết TIẾNG ANH (thầy chốt 2026-07-26: panel nửa Việt
 * nửa thuật-ngữ đọc rất khó). JSDoc/comment thì vẫn tiếng Việt, và neo § nằm ở đây.
 *
 * 📝 `reason`/`note`/`role` viết bằng MARKDOWN (thầy chốt 2026-07-26) — chúng vốn
 * đã đầy `` `backtick` `` quanh tên prop, trước đây hiện ra dấu huyền thô trên màn
 * hình. Xem {@link Prose}.
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
     * CHỈ khai component CÓ story riêng, VÀ PHẢI kèm `storyId` — entry thiếu
     * `storyId` không bấm nhảy đi đâu được nên KHÔNG được tính là dep (thầy chốt
     * 2026-07-26 lần 2: "deps không có thì thôi"). Span nội bộ của atom (`Label`,
     * `Icon`, `Spinner`, `SuffixIcon`) cũng KHÔNG phải deps cùng lý do.
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
     * vào cây. Entry KHÔNG có `storyId` cũng không vào cây (đọc kỹ ở
     * {@link BlockAnatomyProps.parts}). Bỏ trống hoặc rỗng sau lọc → tab Deps
     * KHÔNG hiện ra (thay vì báo "no deps" như trước 2026-07-26).
     */
    annotate?: Record<string, AnatomyAnnotation>
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
    screen: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100",
    block: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    primitive: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    design: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    atom: "bg-default text-muted",
}

/** Thanh dẫn dọc — cùng hệ màu với pill, nhạt hơn một nấc. */
const TIER_RAIL: Record<AnatomyTier, string> = {
    screen: "border-rose-400",
    block: "border-purple-400",
    primitive: "border-blue-400",
    design: "border-emerald-400",
    atom: "border-default",
}

/** Nhãn tầng hiện ra — `primitive` là tên CŨ của tầng layout (§13). */
const TIER_NAME: Record<AnatomyTier, string> = {
    screen: "screen",
    block: "block",
    primitive: "layout",
    design: "design",
    atom: "atom",
}

/**
 * Hai tab của panel. Thứ tự cố định: phụ thuộc → cách gọi.
 *
 * ⚠️ `"states"` đã gỡ khỏi union 2026-07-26 (thầy chốt bỏ tab States). Giữ lại thành
 * viên chết trong type là mở đường cho ai đó nhét lại tab — nên xoá hẳn.
 */
type PanelTab = "deps" | "code"

/** Nhãn tab hiện trên UI — tiếng Anh, một từ. */
const TAB_LABEL: Record<PanelTab, string> = {
    deps: "Deps",
    code: "Code",
}

/** Pill nhỏ dùng chung cho tier/state — gom lại để ba chỗ không lệch nhau. */
const PILL = "rounded-full px-2 text-[11px] font-medium leading-5"

/**
 * Bản đồ thẻ cho {@link Prose} — dựng SẴN ở module scope, không tạo lại mỗi render
 * (react-markdown so sánh tham chiếu; object mới mỗi lượt sẽ ép parse lại).
 *
 * `p` → `<span className="block">` chứ KHÔNG phải `<p>`: mấy chỗ gọi đang nằm sẵn
 * trong `<p>`/`<span>` (dòng `role` trong cây), mà `<p>` lồng `<p>` thì trình duyệt
 * tự cắt thẻ và cây DOM vỡ ngay.
 */
/**
 * What every markdown override receives. ONE named shape for all of them: eight slots with the
 * identical body would otherwise carry eight copies of the same inline type, and eight copies
 * are eight chances to drift.
 */
interface ProseSlotProps {
    /** Rendered children of the markdown node. */
    children?: ReactNode
}

/** The `a` slot additionally receives the href. */
interface ProseLinkProps extends ProseSlotProps {
    /** Link target as written in the markdown source. */
    href?: string
}

const PROSE_MARKS = {
    code: ({ children }: ProseSlotProps) => (
        <code className="rounded bg-default px-1 font-mono text-[0.9em] text-foreground">{children}</code>
    ),
    strong: ({ children }: ProseSlotProps) => (
        <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: ProseSlotProps) => <em className="italic">{children}</em>,
    a: ({ href, children }: ProseLinkProps) => (
        <a href={href} target="_top" className="text-accent underline-offset-2 hover:underline">
            {children}
        </a>
    ),
    ul: ({ children }: ProseSlotProps) => <ul className="list-disc pl-4">{children}</ul>,
    ol: ({ children }: ProseSlotProps) => <ol className="list-decimal pl-4">{children}</ol>,
}

/**
 * BLOCK — đoạn văn đứng riêng (`reason`/`note` dưới panel). `p` → `<span
 * className="block">` chứ KHÔNG phải `<p>`: chỗ gọi có khi đã nằm trong `<p>`/`<span>`,
 * mà `<p>` lồng `<p>` thì trình duyệt tự cắt thẻ và cây DOM vỡ.
 */
const PROSE_COMPONENTS = {
    ...PROSE_MARKS,
    p: ({ children }: ProseSlotProps) => <span className="block">{children}</span>,
}

/**
 * INLINE — chữ nằm CÙNG DÒNG với thứ khác (`· {leaf}` trên header, `· {role}` trong
 * cây). Để `block` ở đó thì dấu `·` bị đẩy lên một dòng riêng.
 */
const PROSE_COMPONENTS_INLINE = {
    ...PROSE_MARKS,
    p: ({ children }: ProseSlotProps) => <>{children}</>,
}

/**
 * Chữ giải thích của panel, render MARKDOWN (thầy chốt 2026-07-26).
 *
 * Chỉ string mới đi qua markdown; `reason`/`note` khai kiểu `ReactNode` nên story
 * nào đưa JSX vẫn render y nguyên — không ép chuỗi hoá thứ vốn đã là node.
 */
/** Props for {@link Prose}. */
interface ProseProps {
    /** Only a `string` goes through markdown; a node is rendered as-is. */
    children?: ReactNode
    /** Placement class only. */
    className?: string
    /** `true` → `p` renders as a fragment so the text stays on the caller's line. */
    inline?: boolean
}

const Prose = ({ children, className, inline = false }: ProseProps) => {
    if (typeof children !== "string") {
        return <span className={className}>{children}</span>
    }
    return (
        <span className={className}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={inline ? PROSE_COMPONENTS_INLINE : PROSE_COMPONENTS}>
                {children}
            </ReactMarkdown>
        </span>
    )
}

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
    annotate,
}: BlockAnatomyProps) => {
    // MỘT ĐƯỜNG DUY NHẤT (thầy chốt 2026-07-26): cấu trúc luôn suy từ DOM. Không có
    // bản panel nào chạy song song — hai bản cho cùng một việc thì bản cũ sống mãi.
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
                // ⭐ `annotate` là DANH SÁCH TRẮNG (§11a, thầy chốt 2026-07-26) — VÀ từ
                // 2026-07-26 (lần 2) còn lọc thêm: chỉ nhận part có `storyId` THẬT.
                //
                // DOM phát ra cả RUỘT của component con (`Feedback.Callout` phát
                // `Icon`/`Content`/`Title`/`Description`/`Action`). Vẽ chúng ở đây là
                // ĐÀO VÀO cái đã có story riêng — kể hai lần, và đẻ ra node không bấm
                // được vì chúng là KHE chứ không phải component.
                //
                // Trước đây chỉ cần CÓ MẶT trong `annotate` là vào cây, kể cả khi
                // `storyId` bỏ trống — ra một "dep" không bấm đi đâu được (neo:
                // `Spinner.Base` tự khai part "Spinner" trỏ vào chính nó). "Deps" giờ
                // đúng nghĩa: có `storyId` mới tính, không thì THÔI — không vào cây,
                // không chiếm chỗ trong tab.
                if (nm && annotate[nm]?.storyId && !order.includes(nm)) {
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
        // Quét NGAY, rAF chỉ là lượt bù (bắt phần DOM còn đang lắp dở).
        //
        // ⚠️ 2026-07-26: trước đây quét CHỈ nằm trong `requestAnimationFrame`. Iframe
        // preview bị trình duyệt throttle (tab nền, cửa sổ không vẽ) thì rAF KHÔNG BAO
        // GIỜ fire → `derived` rỗng vĩnh viễn → tab Deps biến mất dù story khai đúng.
        // Nhìn ra đúng như một lỗi cấu hình story, mà thật ra là panel không chạy.
        scan()
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
    /** Props for one {@link Branch} of the derived tree. */
    interface BranchProps {
        /** The node being drawn. */
        node: AnatomyNode
        /** Nesting depth — drives the rail colour and indent. */
        depth: number
    }

    const Branch = ({ node, depth }: BranchProps) => (
        <div
            className={cn(
                depth > 0 && "border-l-2 pl-3",
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
                {node.role ? (
                    <span className="text-xs text-muted">
                        · <Prose inline>{node.role}</Prose>
                    </span>
                ) : null}
            </div>
            {node.children?.map((child) => (
                <Branch key={child.name} node={child} depth={depth + 1} />
            ))}
        </div>
    )

    /** Đếm mọi node trong cây (kể cả lồng) để ghi số lên tab Deps. */
    const countNodes = (nodes: Array<AnatomyNode>): number =>
        nodes.reduce((sum, node) => sum + 1 + countNodes(node.children ?? []), 0)

    const depsCount = countNodes(derived)

    // Tab nào KHÔNG có dữ liệu thì không mọc ra: Deps rỗng (sau khi lọc storyId)
    // thì THÔI, không hiện tab; story chưa viết snippet thì không có `code`.
    const tabs: Array<PanelTab> = [
        ...(depsCount > 0 ? (["deps"] as const) : []),
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
        <div ref={hostRef} className="flex flex-col gap-6">
            {/* Khung render THẬT của leaf. Bảng phủ bên dưới KHÔNG vẽ lại hình. */}
            <div>{children}</div>

            <div className="overflow-hidden rounded-xl border border-default bg-surface">
                <div className="flex flex-wrap items-baseline gap-2 border-b border-default px-4 py-3">
                    <span className="font-mono text-sm text-foreground">{name}</span>
                    <span className={cn(PILL, TIER_PILL[tier])}>{TIER_NAME[tier]}</span>
                    {/* `leaf` cũng đầy `` `tên prop` `` nên đi qua markdown như reason/note. */}
                    {leaf ? (
                        <span className="text-[11px] text-muted">
                            · <Prose inline>{leaf}</Prose>
                        </span>
                    ) : null}
                </div>

                {/* Một tab thì khỏi bày thanh tab — story cũ (chỉ có Deps) trông y như trước. */}
                {tabs.length > 1 ? (
                    <div role="tablist" aria-label="Anatomy views" className="flex gap-1 border-b border-default px-3">
                        {tabs.map((tabId) => {
                            const isActive = tabId === activeTab
                            const count = tabId === "deps" ? depsCount : null
                            return (
                                <button
                                    key={tabId}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setPicked(tabId)}
                                    className={cn(
                                        "-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-semibold",
                                        isActive
                                            ? "border-accent text-foreground"
                                            : "border-transparent text-muted hover:text-foreground",
                                    )}
                                >
                                    {TAB_LABEL[tabId]}
                                    {count === null ? null : (
                                        <span className="rounded-full bg-default px-2 text-[11px] font-bold leading-4 text-muted">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                ) : null}

                <div className="p-4">
                    {activeTab === "deps" ? (
                        derived.map((node) => <Branch key={node.name} node={node} depth={1} />)
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
                    <div className="flex flex-col gap-1 border-t border-default px-4 py-3">
                        {reason ? <Prose className="text-xs text-foreground">{reason}</Prose> : null}
                        {note ? <Prose className="text-xs text-muted">{note}</Prose> : null}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

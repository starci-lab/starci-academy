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
 * | **Structure** | leaf này LỒNG những gì trong nó? | chỉ component CÓ `storyId` — bấm nhảy được. KHÔNG có thì THÔI, tab không mọc ra. ⚠️ Tên cũ là "Deps" và SAI: cây suy từ DOM nên nó tả CẤU TRÚC, còn phụ thuộc phải đọc từ IMPORT (thầy chốt 2026-07-27). |
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

/**
 * ONE STATE of a leaf: what it renders, why that state exists, and how to call it.
 *
 * A leaf usually has several states that all come from DATA (a seat count, a null price, an
 * empty list). Before 2026-07-27 the panel had no idea they existed — the author stacked them
 * by hand inside `children` with ad-hoc labels, so there was nowhere to explain a single state
 * and nowhere to put its own snippet. Worse, the deps tree was derived from the DOM of ALL the
 * stacked states at once, which made it correct for NONE of them: a state that renders nothing
 * still showed the nodes of its neighbours.
 *
 * Only the SELECTED state is mounted, so the tree the panel derives belongs to that state and
 * to nothing else.
 */
export interface AnatomyState {
    /** Tab label — say what DATA produces the state (`"seats = 0"`, not `"empty"`). */
    name: string
    /** The component rendered in exactly that state. */
    render: ReactNode
    /** Why this state exists / what changes in it. Markdown allowed. */
    why?: ReactNode
    /** Snippet for THIS state — the props that produce it. */
    code?: string
}

/** Props for the {@link BlockAnatomy} panel (ONE leaf). */
export interface BlockAnatomyProps {
    /** Block/design display name (header + tree root). */
    name: string
    tier: AnatomyTier
    /**
     * The leaf's states — newest API (teacher picked layout C, 2026-07-27): a row of state tabs,
     * the selected state rendered large, and its OWN why/deps/code beside it.
     *
     * OPTIONAL on purpose. 663 leaves already pass `children` + one `note` + one `code`; they keep
     * working and are shown as a single implicit state, so both models live side by side while
     * stories migrate one at a time.
     */
    states?: Array<AnatomyState>
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
    /**
     * THIS leaf's live render. Legacy path — a leaf that declares {@link BlockAnatomyProps.states}
     * passes each render inside its state instead, and leaves this out.
     */
    children?: ReactNode
    /** Leaf label shown in the header (e.g. `"Prop variant"`). */
    leaf?: string
    /** Short one-liner: what makes THIS leaf's composition/shape what it is. */
    note?: ReactNode
    /** Optional fuller rationale for the whole composite (usually only on the main leaf). */
    reason?: ReactNode
    /** Usage snippet for THIS leaf — shown in the Code tab with a Copy button. */
    code?: string
    /**
     * Class cho RIÊNG khung render (thường là `mx-auto max-w-xl`) — bề ngang của CHỦ THỂ.
     *
     * Trước 2026-07-27 story tự bọc cả `BlockAnatomy` trong một `div.max-w-xl`, nên panel thừa
     * hưởng luôn 576px: ba cột chữ nhồi vào đó thành `Copy` bị cắt, `why` gãy sáu dòng, cây deps
     * gãy năm dòng (thầy bắt qua ảnh). Bề ngang là thuộc tính của thứ ĐANG ĐƯỢC VẼ, không phải
     * của cái panel nói về nó, nên nó vào đây và panel giữ nguyên bề ngang vùng chứa.
     */
    renderClassName?: string
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
    frame: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    composite: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
    design: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    atom: "bg-default text-muted",
}

/** Thanh dẫn dọc — cùng hệ màu với pill, nhạt hơn một nấc. */
const TIER_RAIL: Record<AnatomyTier, string> = {
    screen: "border-rose-400",
    block: "border-purple-400",
    frame: "border-blue-400",
    composite: "border-sky-400",
    design: "border-emerald-400",
    atom: "border-default",
}

/**
 * Nhãn tầng hiện ra. `frame` và `composite` thay cho `primitive` (2026-07-27): tầng cũ đo ra
 * hai bản chất — 7 khung slot-trơ và 37 component sở hữu vai nội dung.
 */
const TIER_NAME: Record<AnatomyTier, string> = {
    screen: "screen",
    block: "block",
    frame: "frame",
    composite: "composite",
    design: "design",
    atom: "atom",
}

/** Props for {@link SideHeading}. */
interface SideHeadingProps {
    /** Section label — one or two words, lower case. */
    children: ReactNode
}

/**
 * Nhãn nhỏ của một mục trong panel bên (`why this state` · `deps` · `code`).
 *
 * Tách ra vì ba chỗ dùng cùng một hình: viết tay ba lần thì lần thứ tư sẽ lệch.
 */
const SideHeading = ({ children }: SideHeadingProps) => (
    <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">{children}</h4>
)

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
    states,
    children,
    leaf,
    note,
    reason,
    code,
    annotate,
    renderClassName,
}: BlockAnatomyProps) => {
    // MỘT ĐƯỜNG DUY NHẤT (thầy chốt 2026-07-26): cấu trúc luôn suy từ DOM. Không có
    // bản panel nào chạy song song — hai bản cho cùng một việc thì bản cũ sống mãi.
    //
    // `parts` cũ KHÔNG bị vứt: rút lấy phần WHY làm chú giải, cấu trúc lấy từ DOM.
    return (
        <BlockAnatomyDerived
            {...{ name, tier, states, children, leaf, note, reason, code, renderClassName }}
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
    states,
    children,
    leaf,
    note,
    reason,
    code,
    annotate,
    renderClassName,
}: Omit<BlockAnatomyProps, "parts"> & { annotate: Record<string, AnatomyAnnotation> }) => {
    const hostRef = useRef<HTMLDivElement>(null)

    /**
     * Bộ state của leaf. Story cũ (`children` + một `note` + một `code`) được coi là MỘT state
     * ẩn danh, nên 663 leaf hiện có không phải sửa gì mà vẫn lên đúng bố cục mới.
     */
    const stateList: Array<AnatomyState> =
        states && states.length > 0
            ? states
            : [{ name: leaf ?? "Default", render: children, why: note, code }]

    /**
     * Leaf CHƯA di trú sang `states[]`. Nhãn của panel phải nói khác đi, vì tác giả có thể đã
     * xếp NHIỀU state bằng tay trong `children`: dán "why this state" lên đó là nói dối, một
     * câu chú thích cho hai ba state. Neo: `TrialConversionStrip.Default` xếp 2 hàng dữ liệu
     * trong `children` và panel dán ngay "WHY THIS STATE" lên cả hai (thầy bắt 2026-07-27).
     */
    const isLegacyLeaf = !states || states.length === 0

    const [pickedState, setPickedState] = useState(0)
    // Kẹp chỉ số tại chỗ thay vì dùng effect: story đổi leaf làm mảng ngắn lại thì rơi về 0,
    // không cần một lượt render dư để sửa state.
    const activeIndex = pickedState < stateList.length ? pickedState : 0
    const active = stateList[activeIndex]

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
            // ⭐ Gom node theo PHẦN TỬ, không theo TÊN (thầy chốt 2026-07-27).
            //
            // Bản cũ khoá theo chuỗi tên: `firstEl` chỉ giữ phần tử ĐẦU TIÊN của mỗi tên, nên hai
            // `Stack.H` trong cùng một cây NHẬP làm một và cây đọc sai. Cách né đang dùng là bịa
            // tên riêng (`Stack.H.PriceRow`, `Stack.V.Price`) — nhưng đó không phải tên component,
            // và người đọc bấm vào sẽ tra một cái tên không tồn tại.
            //
            // Khoá theo phần tử thì cùng một component xuất hiện bao nhiêu lần cũng được, mỗi lần
            // là một node riêng, và TÊN quay về đúng vai của nó: nhãn để tra chú giải, không phải
            // định danh.
            const nodeEls = els.filter((el) => {
                const nm = el.getAttribute("data-anat-part") ?? ""
                return Boolean(nm && annotate[nm]?.storyId)
            })
            const parentElOf = new Map<HTMLElement, HTMLElement | null>()
            nodeEls.forEach((el) => {
                let node = el.parentElement
                let parent: HTMLElement | null = null
                while (node && node !== host) {
                    if (nodeEls.includes(node)) {
                        parent = node
                        break
                    }
                    node = node.parentElement
                }
                parentElOf.set(el, parent)
            })
            const toNode = (el: HTMLElement): AnatomyNode => {
                const nm = el.getAttribute("data-anat-part") ?? ""
                const meta = annotate[nm]
                const kids = nodeEls.filter((child) => parentElOf.get(child) === el)
                return {
                    name: nm,
                    tier: meta?.tier ?? "composite",
                    role: meta?.role,
                    state: meta?.state,
                    storyId: meta?.storyId,
                    ...(kids.length > 0 ? { children: kids.map(toNode) } : {}),
                }
            }
            const next = nodeEls.filter((el) => parentElOf.get(el) === null).map(toNode)
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
    // `activeIndex` PHẢI nằm trong deps: với API `states`, `children` không đổi khi bấm sang
    // state khác, nên nếu chỉ khai `[children, annotate]` thì effect không chạy lại và cây deps
    // đứng nguyên của state trước. Đo được: state `seatsRemaining = null` render 0 node mà panel
    // vẫn hiện 4 link của state đầu.
    }, [children, annotate, activeIndex])

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
        void navigator.clipboard?.writeText(active.code ?? "")
        setIsCopied(true)
        if (copyTimer.current) {
            clearTimeout(copyTimer.current)
        }
        copyTimer.current = setTimeout(() => setIsCopied(false), 1200)
    }

    return (
        <div ref={hostRef} className="flex flex-col gap-6">
            {/* HÌNH của state đang chọn — CHỈ state này được mount, nên cây deps panel suy ra
                thuộc đúng nó. Trước 2026-07-27 mọi state xếp chung trong `children` nên cây
                trộn lẫn và không đúng với state nào cả. */}
            <div className={renderClassName}>{active.render}</div>

            {/* `@container` NGAY TRÊN panel (thầy chốt A, 2026-07-27): biến `@app-md:` bên dưới
                đo BỀ NGANG CỦA PANEL. Thiếu dòng này thì nó đo `@container` gần nhất là CANVAS,
                nên luật hai cột bung ra ngay cả khi panel chỉ rộng 576px — đúng cái đã làm `Copy`
                bị cắt và `why` gãy sáu dòng. */}
            <div
                data-sb-anatomy-panel=""
                className="@container overflow-hidden rounded-xl border border-default bg-surface"
            >
                <div className="flex flex-wrap items-baseline gap-2 border-b border-default px-4 py-3">
                    <span className="font-mono text-sm text-foreground">{name}</span>
                    <span className={cn(PILL, TIER_PILL[tier])}>{TIER_NAME[tier]}</span>
                    {/* `leaf` cũng đầy `` `tên prop` `` nên đi qua markdown như reason/note. */}
                    {leaf ? (
                        <span className="text-[11px] text-muted">
                            · <Prose inline>{leaf}</Prose>
                        </span>
                    ) : null}
                    {stateList.length > 1 ? (
                        <span className="ml-auto text-[11px] text-muted">
                            {stateList.length} states
                        </span>
                    ) : null}
                </div>

                {/* Hàng tab STATE. Một state thì khỏi bày — leaf cũ trông y như trước. */}
                {stateList.length > 1 ? (
                    <div role="tablist" aria-label="States" className="flex flex-wrap gap-1 border-b border-default px-3">
                        {stateList.map((one, index) => (
                            <button
                                key={one.name}
                                type="button"
                                role="tab"
                                aria-selected={index === activeIndex}
                                onClick={() => setPickedState(index)}
                                className={cn(
                                    "-mb-px border-b-2 px-3 py-2 font-mono text-xs font-semibold",
                                    index === activeIndex
                                        ? "border-accent text-foreground"
                                        : "border-transparent text-muted hover:text-foreground",
                                )}
                            >
                                {one.name}
                            </button>
                        ))}
                    </div>
                ) : null}

                {/* ⭐ MỘT CỘT (thầy chốt 2026-07-27, sửa bố cục C): why · deps · code xếp DỌC,
                    mỗi thứ một hàng full-width.
                    Bản hai cột nhét code vào rãnh `20rem` nên snippet phải cuộn ngang — mà code
                    là thứ người ta COPY, không phải liếc. Đọc một dòng code bị cắt làm đôi tốn
                    hơn nhiều so với việc phải cuộn dọc thêm một nấc. */}
                <div className="flex flex-col gap-3 p-4">
                    <div className="flex flex-col gap-3">
                        {active.why ? (
                            <div>
                                <SideHeading>{isLegacyLeaf ? "note (whole leaf)" : "why this state"}</SideHeading>
                                <Prose className="text-xs text-foreground">{active.why}</Prose>
                            </div>
                        ) : null}
                        {derived.length > 0 ? (
                            <div>
                                {/* ⭐ "STRUCTURE", khong phai "deps" (thay chot 2026-07-27). Cay nay suy tu DOM bang
                                    cach leo to tien `data-anat-part`, nen no ta CAI GI LONG TRONG CAI GI —
                                    tuc CAU TRUC. "Deps" la mot loi hua khac han: phu thuoc la thu doc tu
                                    IMPORT, va hai thu do khong trung nhau. Bang chung: `Popover.Content`
                                    render qua portal nen `KeyValue.List` khai dung van khong hien, con
                                    `Popover.Trigger`/`Popover.Content` hien thanh ANH EM du logic long nhau.
                                    Dat ten dung thi nguoi doc thoi cho doi thu no khong lam duoc. */}
                                <SideHeading>{isLegacyLeaf ? "structure" : "structure of this state"}</SideHeading>
                                {derived.map((node) => <Branch key={node.name} node={node} depth={1} />)}
                            </div>
                        ) : null}
                    </div>

                    {active.code ? (
                        <div className="flex flex-col gap-2 border-t border-default pt-3">
                            <div className="flex items-center justify-between">
                                <SideHeading>code</SideHeading>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="rounded-lg border border-default px-2 py-1 text-[11px] font-medium text-muted hover:text-foreground"
                                >
                                    {isCopied ? "Copied" : "Copy"}
                                </button>
                            </div>
                            <CodeSnippet code={active.code} isDark={isDark} />
                        </div>
                    ) : null}
                </div>

                {/* WHY của CẢ LEAF — nằm dưới, ngoài vùng state: đổi state không mất mạch đọc. */}
                {reason ? (
                    <div className="border-t border-default px-4 py-3">
                        <Prose className="text-xs text-foreground">{reason}</Prose>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

"use client"

import React from "react"
import { Handle, type NodeProps, Position } from "@xyflow/react"
import { Button, Typography, cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { TRACK_CONFIG, type TrackKey } from "./data"
import { LANDING_TRACK_TAG } from "../constants"

/** React Flow node-type id for a knowledge-graph concept. */
export const CONCEPT_NODE_TYPE = "concept" as const

/** Data carried on a concept node. */
export interface ConceptNodeData {
    label: string
    track: TrackKey
    /** Dim when another node is hovered and this one isn't connected to it. */
    dimmed?: boolean
    /** This node is the one whose popover is open. */
    selected?: boolean
    /** Open the flagship course that teaches this concept. */
    onOpenCourse?: (track: TrackKey) => void
    [key: string]: unknown
}

/** Centred, invisible handle — edges connect node CENTRES (straight, force-graph style),
 * not edge anchors. Not user-connectable. */
const centreHandleClass = "!size-0 !min-w-0 !border-0 !bg-transparent"
const centreHandleStyle = { left: "50%", top: "50%", transform: "translate(-50%, -50%)" } as const

/**
 * A glowing concept pill (coloured dot per track + label) used as a React Flow node in
 * the {@link KnowledgeGraph}. When `selected`, a small popover floats above it with a
 * one-line blurb (i18n by node id) + a "Vào khóa" CTA. The pill sits on the graph's
 * `bg-surface` panel — fill is `bg-background` so chips read against it.
 *
 * @param props - React Flow {@link NodeProps} carrying {@link ConceptNodeData}.
 */
export const ConceptNode = ({ id, data }: NodeProps) => {
    const { label, track, dimmed, selected, onOpenCourse } = data as ConceptNodeData
    const t = useTranslations()
    const cfg = TRACK_CONFIG[track]
    return (
        <div className="relative">
            <div
                className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium whitespace-nowrap text-foreground transition-opacity duration-300",
                    cfg.ring,
                    dimmed && "opacity-25",
                    selected && "ring-2 ring-accent",
                )}
                style={{ boxShadow: `0 0 16px -4px ${cfg.glow}` }}
            >
                <Handle type="target" position={Position.Top} isConnectable={false} className={centreHandleClass} style={centreHandleStyle} />
                <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", cfg.dot)} />
                {label}
                <Handle type="source" position={Position.Bottom} isConnectable={false} className={centreHandleClass} style={centreHandleStyle} />
            </div>

            {selected ? (
                <div
                    className="nodrag nopan absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 cursor-default rounded-2xl border border-default bg-surface p-3 text-left"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="mb-1 flex items-center gap-1.5">
                        <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", cfg.dot)} />
                        <span className="text-xs font-semibold text-foreground">{label}</span>
                        <span className="ml-auto text-[10px] text-muted">{LANDING_TRACK_TAG[track]}</span>
                    </div>
                    <Typography type="body-xs" color="muted" className="whitespace-normal">
                        {t(`landing.treasure.graph.${id}`)}
                    </Typography>
                    <Button variant="primary" size="sm" className="mt-2" onPress={() => onOpenCourse?.(track)}>
                        {t("landing.courses.view")}
                        <ArrowRightIcon aria-hidden focusable="false" className="size-3.5" />
                    </Button>
                </div>
            ) : null}
        </div>
    )
}

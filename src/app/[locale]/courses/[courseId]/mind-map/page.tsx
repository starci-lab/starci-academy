"use client"

import React from "react"
import { MindMapPage } from "@/components/pages/MindMapPage"

/**
 * Public course mind map — outside the authenticated learn shell, so the module
 * graph spans the full viewport with its own floating chrome and no rail.
 */
const Page = () => <MindMapPage variant="standalone" />

export default Page

"use client"

import React from "react"
import { ContentBodyV2 } from "./ContentBodyV2"

/**
 * Lesson content body. Legacy (V1) content has been retired — every lesson now
 * ships per-language `bodies`, so this renders the V2 body unconditionally.
 *
 * DEBT: with V1 gone this is a passthrough, and the `V2` suffix names a version that
 * no longer has a sibling. The two folders should fold into one under this name; that
 * is a rename, so it is left visible here rather than done half-way.
 */
export const ContentBody = () => <ContentBodyV2 />

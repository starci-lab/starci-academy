import type { GraphQLResponse } from "../../types"
import type { CourseEntity } from "@/modules/types/entities/course"

/**
 * One row of the viewer's shopping cart (mirrors backend `CartItemEntity`). Its
 * `course` is the SAME {@link CourseEntity} shape the course pages already query
 * (title, cover, pricing phases, value props …) so `PriceTag` + the course cards
 * render the exact same personalised price.
 */
export interface CartItemEntity {
    /** Cart-row id. */
    id: string
    /** Owner user id. */
    userId: string
    /** Course id this row points at. */
    courseId: string
    /** The full course entity (pricing loaded) shown in the cart line. */
    course: CourseEntity
    /** When the row was added. */
    createdAt: string
}

/** Apollo response for the `myCart` query. */
export interface QueryMyCartResponse {
    /** Top-level `myCart` field wrapping the standard API response. */
    myCart: GraphQLResponse<Array<CartItemEntity>>
}

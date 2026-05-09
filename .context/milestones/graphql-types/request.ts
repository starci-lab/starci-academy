import {
    Field,
    ID,
    InputType,
} from "@nestjs/graphql"


/** Request for the milestones GraphQL query (by courseId). */
@InputType({
    description: "Request for fetching milestones by course id.",
})
export class MilestonesRequest {
    /**
     * Course id to fetch milestones for.
     */
    @Field(
        () => ID,
        {
            description: "Course id to fetch milestones for.",
            nullable: true,
        }
    )
        courseId?: string

    /**
     * Course display id to fetch milestones for.
     */
    @Field(
        () => ID,
        {
            description: "Course display id to fetch milestones for.",
            nullable: true,
        }
    )
        courseDisplayId?: string
}

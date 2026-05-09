import {
    Field,
    ObjectType,
} from "@nestjs/graphql"
import {
    EnrollmentMilestoneEntity,
} from "@modules/databases"
import {
    AbstractGraphQLResponse,
    IAbstractGraphQLResponse,
} from "@modules/api"

@ObjectType({
    description: "Response for submit personal project idea mutation.",
})
export class SubmitPersonalProjectIdealResponse
    extends AbstractGraphQLResponse
    implements IAbstractGraphQLResponse<EnrollmentMilestoneEntity>
{
    @Field(() => EnrollmentMilestoneEntity,
        {
            nullable: true,
            description: "The updated enrollment milestone.",
        })
        data: EnrollmentMilestoneEntity
}

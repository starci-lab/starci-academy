import {
    ObjectType,
} from "@nestjs/graphql"
import {
    AbstractGraphQLResponse,
    IAbstractGraphQLResponse,
} from "@modules/api"

@ObjectType({
    description: "Response for submit challenge submission mutation.",
})
export class SubmitChallengeSubmissionResponse
    extends AbstractGraphQLResponse
    implements IAbstractGraphQLResponse
{
}

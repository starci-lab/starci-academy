import {
    ICommand,
} from "@nestjs/cqrs"

export class SubmitPersonalGithubUrlCommand implements ICommand {
    constructor(
        public readonly params: {
            readonly enrollmentId: string
            readonly githubUrl: string
            readonly userId: string
        },
    ) {}
}

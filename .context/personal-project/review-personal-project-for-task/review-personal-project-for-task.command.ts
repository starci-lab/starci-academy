import {
    ICommand,
} from "@nestjs/cqrs"

export class ReviewPersonalProjectForTaskCommand implements ICommand {
    constructor(
        public readonly params: {
            readonly enrollmentMilestoneId: string
            readonly githubUrl: string
            readonly branch?: string
            readonly userId: string
        },
    ) {}
}

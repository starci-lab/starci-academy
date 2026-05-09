import {
    Module,
} from "@nestjs/common"
import {
    ReviewPersonalProjectForTaskResolver,
} from "./review-personal-project-for-task.resolver"
import {
    ReviewPersonalProjectForTaskService,
} from "./review-personal-project-for-task.service"
import {
    ReviewPersonalProjectForTaskHandler,
} from "./review-personal-project-for-task.handler"

@Module({
    providers: [
        ReviewPersonalProjectForTaskResolver,
        ReviewPersonalProjectForTaskService,
        ReviewPersonalProjectForTaskHandler,
    ],
})
export class ReviewPersonalProjectForTaskModule { }

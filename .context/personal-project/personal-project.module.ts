import {
    Module,
} from "@nestjs/common"
import {
    ConfigurableModuleClass,
} from "./personal-project.module-definition"
import {
    SubmitPersonalProjectIdealModule,
} from "./submit-personal-project-ideal"
import {
    ReviewPersonalProjectForTaskModule,
} from "./review-personal-project-for-task"

@Module({
    imports: [
        SubmitPersonalProjectIdealModule,
        ReviewPersonalProjectForTaskModule,
    ],
})
export class PersonalProjectMutationsModule extends ConfigurableModuleClass {}

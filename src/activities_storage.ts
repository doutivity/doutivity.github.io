import {ActivitiesResponse} from "./models";

export class ActivitiesStorage {
    private activitiesURL: string;
    private showPageCount: string;
    private response: ActivitiesResponse;

    constructor() {
    }

    get(activitiesURL: string, showPageCount: string): ActivitiesResponse | null {
        if (this.activitiesURL === activitiesURL && this.showPageCount === showPageCount) {
            return this.response;
        }

        return null;
    }

    set(activitiesURL: string, showPageCount: string, response: ActivitiesResponse) {
        this.activitiesURL = activitiesURL;
        this.showPageCount = showPageCount;
        this.response = response;
    }
}

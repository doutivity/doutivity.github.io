export class TextResponse {
    constructor(private readonly value: string) {
    }

    text(): Promise<string> {
        return Promise.resolve(this.value);
    }
}

export class User {
    constructor(
        public readonly username: string,
        public readonly avatar: string,
    ) {
    }
}

export class ActivitiesResponse {
    constructor(
        public readonly user: User,
        public readonly pages: number,
        public readonly totalPageCount: number,
        public readonly $originalCommentPageGroup: Array<any>,
    ) {
    }
}

export class TextResponse {
    constructor(private readonly value: string) {
    }

    text(): Promise<string> {
        return Promise.resolve(this.value);
    }
}

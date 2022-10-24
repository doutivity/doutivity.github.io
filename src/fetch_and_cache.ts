import {Storage} from "./storage";
import {TextResponse} from "./models";

const storage = new Storage("dou:", 30 * 60 * 1000, 30 * 1000);
storage.clear(false, false);

export class DelayCounter {
    constructor(
        private readonly step: number,
        private delay: number,
    ) {
    }

    increment(): number {
        const result = this.delay;

        this.delay += this.step;

        return result;
    }
}

export function fetchAndCache(url: string, delay: DelayCounter): Promise<TextResponse> {
    const cached = storage.get(url);
    if (cached !== null) {
        return Promise.resolve(new TextResponse(cached))
    }

    const ms = delay.increment();

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            fetch(url)
                .then(function (response) {
                    return response.text();
                })
                .then(function (text) {
                    storage.set(url, text);

                    resolve(new TextResponse(text));
                })
                .catch(reject);
        }, ms);
    });
}

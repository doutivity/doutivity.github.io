import {Storage} from "./storage";
import {TextResponse} from "./models";

const storage = new Storage("dou:", 60 * 60 * 1000);
storage.clear(false);

export function fetchAndCache(url: string, delay: number): Promise<TextResponse> {
    return new Promise(function (resolve, reject) {
        const cached = storage.get(url);
        if (cached !== null) {
            resolve(new TextResponse(cached));

            return;
        }

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
        }, delay);
    });
}

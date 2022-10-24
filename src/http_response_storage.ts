interface Item {
    text: string,
    created: number,
}

export class HttpResponseStorage {
    constructor(
        private readonly prefix: string,
        private readonly ttl: number,
        private readonly ttlMemoryQuota: number,
    ) {
    }

    get(url: string): string | null {
        const source = localStorage.getItem(this.toKey(url));
        if (source === null) {
            return null;
        }

        const item = JSON.parse(source) as Item;
        return item.text;
    }

    set(url: string, text: string, attempt: number = 0) {
        try {
            localStorage.setItem(this.toKey(url), JSON.stringify(toItem(text)));
        } catch (e) {
            console.error(e, attempt);

            this.clear(attempt >= 3, true);

            this.set(url, text, attempt + 1);
        }
    }

    clear(force: boolean, quota: boolean) {
        const keys = [];
        const now = Date.now();

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (this.isKey(key)) {
                const item = JSON.parse(localStorage.getItem(key)) as Item;

                if (force) {
                    keys.push(key);
                } else if (quota && (item.created + this.ttlMemoryQuota) < now) {
                    keys.push(key);
                } else if ((item.created + this.ttl) < now) {
                    keys.push(key);
                }
            }
        }

        for (const key of keys) {
            localStorage.removeItem(key);
        }
    }

    private toKey(url: string): string {
        return this.prefix + url;
    }

    private isKey(key: string): boolean {
        return key.startsWith(this.prefix);
    }
}

function toItem(text: string): Item {
    return {
        text: text,
        created: Date.now(),
    };
}

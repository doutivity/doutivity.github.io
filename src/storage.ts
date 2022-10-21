interface Item {
    text: string,
    expired: number,
}

export class Storage {
    constructor(private readonly prefix: string, private readonly ttl: number) {
    }

    get(url: string): string | null {
        const item = localStorage.getItem(this.toKey(url));
        if (item === null) {
            return null;
        }

        return (JSON.parse(item) as Item).text;
    }

    set(url: string, text: string) {
        localStorage.setItem(this.toKey(url), JSON.stringify(this.toItem(text)));
    }

    clear(force: boolean) {
        const keys = [];
        const now = Date.now();

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (this.isKey(key)) {
                const item = JSON.parse(localStorage.getItem(key)) as Item;

                if (force || item.expired < now) {
                    keys.push(key);
                }
            }
        }

        for (const key of keys) {
            localStorage.removeItem(key);
        }
    }

    private toItem(text: string): Item {
        return {
            text: text,
            expired: Date.now() + this.ttl,
        };
    }

    private toKey(url: string): string {
        return this.prefix + url;
    }

    private isKey(key: string): boolean {
        return key.startsWith(this.prefix);
    }
}

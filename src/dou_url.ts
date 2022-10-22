const prefix = "https://dou.ua/users/"

class DOUxURL {
    constructor(
        public readonly original: string,
        public readonly userURL: string,
        public readonly activitiesURL: string,
        public readonly success: boolean,
    ) {
    }
}

export function parseDOUxURL(original: string): DOUxURL {
    if (!original.startsWith(prefix, 0)) {
        return new DOUxURL(original, "", "", false);
    }

    const end = original.indexOf("/", prefix.length);
    if (end === -1) {
        return new DOUxURL(original, "", "", false);
    }

    const userURL = original.substring(0, end) + "/";
    const activitiesURL = original.substring(0, end) + "/activities/";

    return new DOUxURL(original, userURL, activitiesURL, true);
}

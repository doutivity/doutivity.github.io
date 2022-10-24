import urlStateContainer from "./framework/activity_url_state_container";
import {
    ACTIVITY_SEARCH_QUERY,
    ACTIVITY_ANCHOR_CRITERIA_NAME,
    ACTIVITY_CODE_CRITERIA_NAME,
    ACTIVITY_SUPPORT_CRITERIA_NAME,
    ACTIVITY_SOURCE_CRITERIA_NAME,
} from "./framework/activity_criteria_names";

export function buildMatcher(): ($comment: HTMLElement) => boolean {
    const query = urlStateContainer.getCriteria(ACTIVITY_SEARCH_QUERY, "").toLowerCase();
    const anchorAliases = urlStateContainer.getCriteria(ACTIVITY_ANCHOR_CRITERIA_NAME, []);
    const codeAliases = urlStateContainer.getCriteria(ACTIVITY_CODE_CRITERIA_NAME, []);
    const supportAliases = urlStateContainer.getCriteria(ACTIVITY_SUPPORT_CRITERIA_NAME, []);
    const sourceAliases = urlStateContainer.getCriteria(ACTIVITY_SOURCE_CRITERIA_NAME, []);

    const matchQuery = buildMatchQuery(query);
    const matchAnchor = buildMatchAnchor(anchorAliases);
    const matchSupport = buildMatchSupport(supportAliases);
    const matchCode = buildMatchCode(codeAliases);
    const matchSource = buildMatchSource(sourceAliases);

    return function ($comment: HTMLElement): boolean {
        return matchAnchor($comment)
            && matchCode($comment)
            && matchSupport($comment)
            && matchSource($comment)
            && matchQuery($comment);
    }
}

function buildMatchQuery(query: string) {
    if (query === "") {
        return matchAll;
    }

    return function ($comment: HTMLElement) {
        return $comment
            .querySelector(".comment-item .b-typo")
            .textContent.toLowerCase()
            .indexOf(query) !== -1;
    };
}

function buildMatchAnchor(aliases: Array<string>) {
    if (aliases.length === 1) {
        const [alias] = aliases;

        switch (alias) {
            case "with-anchor":
                return function ($comment: HTMLElement) {
                    return $comment.querySelector(".comment-item .b-typo a") !== null
                };
            case "without-anchor":
                return function ($comment: HTMLElement) {
                    return $comment.querySelector(".comment-item .b-typo a") === null
                };
        }
    }

    return matchAll;
}

function buildMatchSupport(aliases: Array<string>) {
    if (aliases.length === 1) {
        const [alias] = aliases;

        switch (alias) {
            case "with-support":
                return function ($comment: HTMLElement) {
                    return $comment.querySelector(".sup-users") !== null;
                };
            case "without-support":
                return function ($comment: HTMLElement) {
                    return $comment.querySelector(".sup-users") === null;
                };
        }
    }

    return matchAll;
}

function buildMatchCode(aliases: Array<string>) {
    if (aliases.length === 1) {
        const [alias] = aliases;

        switch (alias) {
            case "with-code":
                return function ($comment: HTMLElement) {
                    return $comment.querySelector("pre") !== null;
                };
            case "without-code":
                return function ($comment: HTMLElement) {
                    return $comment.querySelector("pre") === null;
                };
        }
    }

    return matchAll;
}

function buildMatchSource(aliases: Array<string>) {
    if (aliases.length === 0) {
        return matchAll;
    }

    return function ($comment: HTMLElement) {
        const $commentURL = $comment.querySelector("a.date");
        if ($commentURL === null) {
            return false;
        }

        const commentURL = $commentURL.getAttribute("href");

        for (const alias of aliases) {
            if (alias === "forums") {
                if (commentURL.startsWith("https://dou.ua/forums/")) {
                    return true;
                }
            } else if (alias === "lenta") {
                if (commentURL.startsWith("https://dou.ua/lenta/")) {
                    return true;
                }
            } else if (alias === "calendar") {
                if (commentURL.startsWith("https://dou.ua/calendar/")) {
                    return true;
                }
            } else if (alias === "gamedev") {
                if (commentURL.startsWith("https://gamedev.dou.ua/")) {
                    return true;
                }
            }
        }

        return false;
    }
}

function matchAll($comment: HTMLElement) {
    return true;
}

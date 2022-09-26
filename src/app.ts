import activityUrlStateContainer from "./framework/activity_url_state_container";
import {setStateByURLMapper} from "./framework/set_state_by_url";
import {
    ACTIVITY_SEARCH_QUERY,
    ACTIVITY_SUPPORTED_CRITERIA_NAME,
    ACTIVITY_URL
} from "./framework/activity_criteria_names";
import {toEnter} from "./framework/enter";

{
    const showPageCount = 3;

    const {
        setInputStateByURL,
        setCheckboxStateByURL,
    } = setStateByURLMapper(activityUrlStateContainer)

    const $urlForm = document.getElementById("js-url-form") as HTMLFormElement;
    const $url = $urlForm.elements["url"] as HTMLInputElement;
    let $originalCommentPageGroup = [];
    const $comments = document.getElementById("js-content-comments");
    const $stats = document.getElementById("js-stats");

    const $activityForm = document.getElementById("js-activities-form") as HTMLFormElement;
    const $search = $activityForm.elements["search"] as HTMLInputElement;
    const $supported = $activityForm.elements["supported"] as HTMLInputElement;

    setInputStateByURL($url, ACTIVITY_URL);
    setInputStateByURL($search, ACTIVITY_SEARCH_QUERY);
    setCheckboxStateByURL($supported, ACTIVITY_SUPPORTED_CRITERIA_NAME);

    function onCheckboxChange($checkbox: HTMLInputElement, criteriaName: string) {
        $checkbox.addEventListener("change", function () {
            activityUrlStateContainer.setBoolCriteria(criteriaName, $checkbox.checked);
            activityUrlStateContainer.storeCurrentState();

            search();
        });
    }

    function getPageCount($doc: Document): number {
        const $pages = $doc.querySelectorAll(".page");

        if ($pages.length === 0) {
            return 1;
        }

        const $last = $pages[$pages.length - 1];

        return parseInt($last.textContent, 10);
    }

    function fetchActivities(onSuccess: () => void) {
        const activityURL = $url.value;
        if (activityURL === "") {
            $originalCommentPageGroup = [];
            $comments.innerHTML = "";

            return;
        }

        $originalCommentPageGroup = [];
        fetch(activityURL)
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                const parser = new DOMParser();

                const $doc = parser.parseFromString(html, "text/html");

                $originalCommentPageGroup = [$doc.querySelector("ul.items")];

                const totalPageCount = getPageCount($doc);
                if (totalPageCount === 1) {
                    onSuccess();

                    return;
                }

                const pages = Math.min(showPageCount, totalPageCount);

                const requests = [];

                for (let page = 2; page <= pages; page++) {
                    requests.push(fetch(`${activityURL}/${page}/`));
                }

                Promise.all(requests)
                    .then(function (responses) {
                        return Promise.all(responses.map(response => response.text()))
                    })
                    .then(function (htmls) {
                        for (const html of htmls) {
                            const parser = new DOMParser();

                            const $doc = parser.parseFromString(html, "text/html");

                            $originalCommentPageGroup.push($doc.querySelector("ul.items"));
                        }

                        onSuccess();
                    });
            })
            .catch(console.error);
    }

    function search() {
        const $matched = [];
        let totalCount = 0;

        const query = activityUrlStateContainer.getCriteria(ACTIVITY_SEARCH_QUERY, "").toLowerCase();
        const supported = activityUrlStateContainer.getCriteria(ACTIVITY_SUPPORTED_CRITERIA_NAME, false);

        const matchQuery = (function () {
            if (query === "") {
                return function ($comment: HTMLElement) {
                    return true;
                };
            }

            return function ($comment: HTMLElement) {
                return $comment
                    .querySelector(".comment-item .b-typo")
                    .textContent.toLowerCase()
                    .indexOf(query) !== -1;
            };
        })();

        const matchSupported = (function () {
            if (supported === false) {
                return function ($comment: HTMLElement) {
                    return true;
                };
            }

            return function ($comment: HTMLElement) {
                return $comment.querySelector(".sup-users") !== null;
            };
        })();

        for (const $originalComments of $originalCommentPageGroup) {
            for (const $originalComment of $originalComments.children) {
                totalCount += 1;

                if (matchSupported($originalComment) && matchQuery($originalComment)) {
                    $matched.push($originalComment.cloneNode(true));
                }
            }
        }

        $stats.innerHTML = `${$matched.length} from ${totalCount}`;
        $comments.innerHTML = "";
        $comments.append(...$matched);
    }

    function handleFetchActivities() {
        activityUrlStateContainer.setStringCriteria(ACTIVITY_URL, $url.value);
        activityUrlStateContainer.storeCurrentState();

        fetchActivities(() => {
            // NOP
        });
    }

    $url.addEventListener("keyup", toEnter(handleFetchActivities));

    function handleSearch() {
        activityUrlStateContainer.setStringCriteria(ACTIVITY_SEARCH_QUERY, $search.value);
        activityUrlStateContainer.storeCurrentState();

        search();
    }

    $search.addEventListener("keyup", toEnter(handleSearch));

    onCheckboxChange($supported, ACTIVITY_SUPPORTED_CRITERIA_NAME);

    $urlForm.onsubmit = handleFetchActivities;
    $activityForm.onsubmit = handleSearch;

    fetchActivities(search);
}

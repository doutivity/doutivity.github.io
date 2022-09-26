import activityUrlStateContainer from "./framework/activity_url_state_container";
import {setStateByURLMapper} from "./framework/set_state_by_url";
import {ACTIVITY_SEARCH_QUERY, ACTIVITY_URL} from "./framework/activity_criteria_names";
import {toEnter} from "./framework/enter";

{
    const {
        setInputStateByURL,
    } = setStateByURLMapper(activityUrlStateContainer)

    const $urlForm = document.getElementById("js-url-form") as HTMLFormElement;
    const $url = $urlForm.elements["url"] as HTMLInputElement;
    let $originalCommentPageGroup = [];
    const $comments = document.getElementById("js-content-comments");

    const $activityForm = document.getElementById("js-activities-form") as HTMLFormElement;
    const $search = $activityForm.elements["search"] as HTMLInputElement;

    setInputStateByURL($url, ACTIVITY_URL);
    setInputStateByURL($search, ACTIVITY_SEARCH_QUERY);

    function fetchActivities(onSuccess: () => void) {
        if ($url.value === "") {
            $originalCommentPageGroup = [];
            $comments.innerHTML = "";

            return;
        }

        $originalCommentPageGroup = [];
        fetch($url.value)
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                const parser = new DOMParser();

                const doc = parser.parseFromString(html, "text/html");

                $originalCommentPageGroup = [doc.querySelector("ul.items")];

                onSuccess();
            })
            .catch(console.error);
    }

    function search() {
        const $matched = [];

        const query = activityUrlStateContainer.getCriteria(ACTIVITY_SEARCH_QUERY, "").toLowerCase();

        for (const $originalComments of $originalCommentPageGroup) {
            for (const $originalComment of $originalComments.children) {
                if (query === "" || $originalComment.textContent.toLowerCase().indexOf(query) !== -1) {
                    $matched.push($originalComment.cloneNode(true));
                }
            }
        }

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

    $url.addEventListener("keyup", toEnter(handleFetchActivities))

    function handleSearch() {
        activityUrlStateContainer.setStringCriteria(ACTIVITY_SEARCH_QUERY, $search.value);
        activityUrlStateContainer.storeCurrentState();

        search();
    }

    $search.addEventListener("keyup", toEnter(handleSearch))

    $urlForm.onsubmit = handleFetchActivities;
    $activityForm.onsubmit = handleSearch;

    fetchActivities(search);
}

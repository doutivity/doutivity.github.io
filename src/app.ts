import {
    USER_URL,
    ACTIVITY_SEARCH_QUERY,
    ACTIVITY_PAGES,
    ACTIVITY_ANCHOR_CRITERIA_NAME,
    ACTIVITY_CODE_CRITERIA_NAME,
    ACTIVITY_SUPPORT_CRITERIA_NAME,
    ACTIVITY_SOURCE_CRITERIA_NAME,
} from "./framework/activity_criteria_names";
import urlStateContainer from "./framework/activity_url_state_container";
import {setStateByURLMapper} from "./framework/set_state_by_url";
import {Checkboxes, InputCheckboxes} from "./framework/checkboxes";
import {toEnter} from "./framework/enter";

import {parseDOUxURL} from "./dou_url";
import {DelayCounter, fetchAndCache} from "./fetch_and_cache";
import {ActivitiesResponse, User} from "./models";
import {buildMatcher} from "./matches";

function fetchActivities(activityURL: string, showPages: string, render: (response: ActivitiesResponse | null) => void) {
    const delay = new DelayCounter(250, 0);

    fetchAndCache(activityURL, delay)
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            const parser = new DOMParser();

            const $doc = parser.parseFromString(html, "text/html");

            const $username = $doc.querySelector("div.top_wide.profile-head div.b-author div.name a");
            const $avatar = $doc.querySelector("div.top_wide.profile-head div.b-author img.g-avatar") as HTMLImageElement;
            const user = new User(
                $username.innerHTML,
                $avatar.src,
            );

            const $originalCommentPageGroup = [$doc.querySelector("ul.items")];

            const totalPageCount = getPageCount($doc);
            if (totalPageCount === 1) {
                render(new ActivitiesResponse(
                    user,
                    1,
                    1,
                    $originalCommentPageGroup,
                ));

                return;
            }

            let pages = 0;
            if (showPages === "") {
                pages = Math.min(5, totalPageCount);
            } else if (showPages === "all") {
                pages = totalPageCount
            } else {
                pages = Math.min(parseInt(showPages), totalPageCount);
            }

            const requests = [];
            for (let page = 2; page <= pages; page++) {
                requests.push(fetchAndCache(`${activityURL}/${page}/`, delay));
            }

            Promise.all(requests)
                .then(function (responses) {
                    return Promise.all(responses.map(response => response.text()))
                })
                .then(function (htmls) {
                    const parser = new DOMParser();

                    for (const html of htmls) {
                        const $doc = parser.parseFromString(html, "text/html");

                        $originalCommentPageGroup.push($doc.querySelector("ul.items"));
                    }

                    render(new ActivitiesResponse(
                        user,
                        pages,
                        totalPageCount,
                        $originalCommentPageGroup,
                    ));
                });
        })
        .catch(console.error);
}

function search(response: ActivitiesResponse | null) {
    if (response === null) {
        $main.style.visibility = "hidden";

        return;
    }

    $main.style.visibility = "";
    $profileAvatar.src = response.user.avatar;
    $profileUsername.innerHTML = response.user.username;

    const $matched = [];
    let totalCount = 0;

    const match = buildMatcher();

    for (const $originalComments of response.$originalCommentPageGroup) {
        for (const $originalComment of $originalComments.children) {
            totalCount += 1;

            if (match($originalComment)) {
                $matched.push($originalComment.cloneNode(true));
            }
        }
    }


    $commentsCountStats.innerHTML = `Знайдено коментарів ${$matched.length} з ${totalCount}`;
    $commentsPageStats.innerHTML = `На ${response.pages} сторінках з ${response.totalPageCount}`;
    $comments.innerHTML = "";
    $comments.append(...$matched);
}

const {
    setInputStateByURL,
    setCheckboxesStateByURL,
    setCheckboxStateByURL,
} = setStateByURLMapper(urlStateContainer);

const $userURL = document.getElementById("js-user-url") as HTMLInputElement;
const $search = document.getElementById("js-search-query") as HTMLInputElement;
const $showPageCount = document.getElementById("js-show-page-count") as HTMLInputElement;
const $anchorCheckboxes = new InputCheckboxes(document.querySelectorAll("input.js-criteria-anchor") as any as Array<HTMLInputElement>);
const $codeCheckboxes = new InputCheckboxes(document.querySelectorAll("input.js-criteria-code") as any as Array<HTMLInputElement>);
const $supportCheckboxes = new InputCheckboxes(document.querySelectorAll("input.js-criteria-support") as any as Array<HTMLInputElement>);
const $sourceCheckboxes = new InputCheckboxes(document.querySelectorAll("input.js-criteria-source") as any as Array<HTMLInputElement>);
const $submit = document.getElementById("js-search-submit") as HTMLButtonElement;
const $main = document.getElementById("js-main");
const $profileAvatar = document.getElementById("js-profile-avatar") as HTMLImageElement;
const $profileUsername = document.getElementById("js-profile-username");
const $commentsCountStats = document.getElementById("js-comments-count-stats");
const $commentsPageStats = document.getElementById("js-comments-page-stats");
const $comments = document.getElementById("js-content-comments");

{
    const parsedURL = parseDOUxURL(urlStateContainer.getCriteria(USER_URL, ""));
    $userURL.value = parsedURL.userURL;
    $submit.disabled = parsedURL.activitiesURL === "";
}
setInputStateByURL($search, ACTIVITY_SEARCH_QUERY);
setInputStateByURL($showPageCount, ACTIVITY_PAGES);
setCheckboxesStateByURL($anchorCheckboxes, ACTIVITY_ANCHOR_CRITERIA_NAME);
setCheckboxesStateByURL($codeCheckboxes, ACTIVITY_CODE_CRITERIA_NAME);
setCheckboxesStateByURL($supportCheckboxes, ACTIVITY_SUPPORT_CRITERIA_NAME);
setCheckboxesStateByURL($sourceCheckboxes, ACTIVITY_SOURCE_CRITERIA_NAME);

function onSelectboxChange($selectbox: HTMLInputElement, criteriaName: string) {
    $selectbox.addEventListener("change", function () {
        urlStateContainer.setStringCriteria(criteriaName, $selectbox.value);
        urlStateContainer.storeCurrentState();

        handleSearch();
    });
}

function onCheckboxesChange($checkboxes: Checkboxes, criteriaName: string) {
    $checkboxes.onChange(function (state: Array<string>) {
        urlStateContainer.setArrayCriteria(criteriaName, state);
        urlStateContainer.storeCurrentState();

        handleSearch();
    });
}

function handleSearch() {
    const parsedURL = parseDOUxURL($userURL.value);
    urlStateContainer.setStringCriteria(USER_URL, parsedURL.userURL);
    urlStateContainer.setStringCriteria(ACTIVITY_SEARCH_QUERY, $search.value);
    urlStateContainer.storeCurrentState();

    if (parsedURL.activitiesURL === "") {
        search(null);

        return;
    }

    fetchActivities(parsedURL.activitiesURL, $showPageCount.value, search);
}

$userURL.addEventListener("keyup", function (event) {
    const parsedURL = parseDOUxURL($userURL.value);
    $submit.disabled = parsedURL.activitiesURL === "";
    
    toEnter(handleSearch)(event);
});
$search.addEventListener("keyup", toEnter(handleSearch));

onSelectboxChange($showPageCount, ACTIVITY_PAGES);
onCheckboxesChange($anchorCheckboxes, ACTIVITY_ANCHOR_CRITERIA_NAME);
onCheckboxesChange($codeCheckboxes, ACTIVITY_CODE_CRITERIA_NAME);
onCheckboxesChange($supportCheckboxes, ACTIVITY_SUPPORT_CRITERIA_NAME);
onCheckboxesChange($sourceCheckboxes, ACTIVITY_SOURCE_CRITERIA_NAME);

$submit.addEventListener("click", handleSearch);

function getPageCount($doc: Document): number {
    const $pages = $doc.querySelectorAll(".page");

    if ($pages.length === 0) {
        return 1;
    }

    const $last = $pages[$pages.length - 1];

    return parseInt($last.textContent, 10);
}

handleSearch();

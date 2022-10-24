import UrlStateContainer from "./url_state_container"
import {
    IdentityCriteriaConverter,
    CheckedCriteriaConverter,
    MultiSelectCriteriaConverter,
} from "./criteria_converter";
import {
    USER_URL,
    ACTIVITY_SEARCH_QUERY,
    ACTIVITY_PAGES,
    ACTIVITY_ANCHOR_CRITERIA_NAME,
    ACTIVITY_CODE_CRITERIA_NAME,
    ACTIVITY_SUPPORT_CRITERIA_NAME,
    ACTIVITY_SOURCE_CRITERIA_NAME,
    ACTIVITY_CRITERIA_NAMES,
} from "./activity_criteria_names";

const identityCriteriaConverter = new IdentityCriteriaConverter();
const multiSelectCriteriaConverter = new MultiSelectCriteriaConverter();

const activityUrlStateContainer = new UrlStateContainer(ACTIVITY_CRITERIA_NAMES, {
    [USER_URL]: identityCriteriaConverter,
    [ACTIVITY_SEARCH_QUERY]: identityCriteriaConverter,
    [ACTIVITY_PAGES]: identityCriteriaConverter,
    [ACTIVITY_ANCHOR_CRITERIA_NAME]: multiSelectCriteriaConverter,
    [ACTIVITY_CODE_CRITERIA_NAME]: multiSelectCriteriaConverter,
    [ACTIVITY_SUPPORT_CRITERIA_NAME]: multiSelectCriteriaConverter,
    [ACTIVITY_SOURCE_CRITERIA_NAME]: multiSelectCriteriaConverter,
});

export default activityUrlStateContainer;

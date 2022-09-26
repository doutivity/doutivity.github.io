import UrlStateContainer from "./url_state_container"
import {
    IdentityCriteriaConverter,
    CheckedCriteriaConverter,
} from "./criteria_converter";
import {
    ACTIVITY_URL,
    ACTIVITY_SEARCH_QUERY,
    ACTIVITY_SUPPORTED_CRITERIA_NAME,
    ACTIVITY_CRITERIA_NAMES,
} from "./activity_criteria_names";

const identityCriteriaConverter = new IdentityCriteriaConverter();
const checkedCriteriaConverter = new CheckedCriteriaConverter();

const activityUrlStateContainer = new UrlStateContainer(ACTIVITY_CRITERIA_NAMES, {
    [ACTIVITY_URL]: identityCriteriaConverter,
    [ACTIVITY_SEARCH_QUERY]: identityCriteriaConverter,
    [ACTIVITY_SUPPORTED_CRITERIA_NAME]: checkedCriteriaConverter,
});

export default activityUrlStateContainer;

import UrlStateContainer from "./url_state_container"
import {
    IdentityCriteriaConverter,
} from "./criteria_converter";
import {
    ACTIVITY_URL,
    ACTIVITY_SEARCH_QUERY,
    ACTIVITY_CRITERIA_NAMES,
} from "./activity_criteria_names";

const identityCriteriaConverter = new IdentityCriteriaConverter();

const activityUrlStateContainer = new UrlStateContainer(ACTIVITY_CRITERIA_NAMES, {
    [ACTIVITY_URL]: identityCriteriaConverter,
    [ACTIVITY_SEARCH_QUERY]: identityCriteriaConverter,
});

export default activityUrlStateContainer;

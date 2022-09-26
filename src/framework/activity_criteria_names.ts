import UniqueName from "./unique_name";

const unique = new UniqueName();

export const ACTIVITY_URL = unique.unique("url");
export const ACTIVITY_SEARCH_QUERY = unique.unique("q");
export const ACTIVITY_SUPPORTED_CRITERIA_NAME = unique.unique("supported");
export const ACTIVITY_CRITERIA_NAMES = unique.names();

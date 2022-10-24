import UniqueName from "./unique_name";

const unique = new UniqueName();

export const USER_URL = unique.unique("url");
export const ACTIVITY_SEARCH_QUERY = unique.unique("q");
export const ACTIVITY_PAGES = unique.unique("pages");
export const ACTIVITY_ANCHOR_CRITERIA_NAME = unique.unique("anchor");       // with-anchor, without-anchor
export const ACTIVITY_CODE_CRITERIA_NAME = unique.unique("code");           // with-code-block, without-code-block
export const ACTIVITY_SUPPORT_CRITERIA_NAME = unique.unique("support");     // with-support, without-support
export const ACTIVITY_SOURCE_CRITERIA_NAME = unique.unique("source");       // forums, lenta, calendar
export const ACTIVITY_CRITERIA_NAMES = unique.names();

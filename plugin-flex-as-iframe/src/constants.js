// task
export const TASK_STATUS = [
    "reserved",
    "assigned",
    "canceled",
    "wrapping",
    "completed",
    "transferring"
];
export const TASK_EVENTS = [
    "updated",
    "wrapup",
    "completed",
    "transferInitiated",
    "canceled"
];
export const FLEX_TASK_EVENTS = [
    "updated",
    "wrapup",
    "completed",
    "canceled",
    "participantAdded",
    "transferInitiated"
];


// reservation
export const RESERVATION_STATUS = [
    "pending",
    "accepted",
    "rejected",
    "timeout",
    "canceled",
    "rescinded",
    "wrapping",
    "completed",
];
export const RESERVATION_EVENTS = [
    "accepted",
    "completed",
    "canceled",
    "rejected",
    "rescinded",
    "timeout",
    "wrapup"
];
export const FLEX_RESERVATION_EVENTS = [
    "accepted",
    "rejected",
    "timeout",
    "canceled",
    "rescinded",
    "completed",
    "wrapup"
];

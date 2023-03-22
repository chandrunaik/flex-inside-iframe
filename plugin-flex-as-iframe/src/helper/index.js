export function sendMessageToCRM(eventName, payload) {
    let data = JSON.stringify({ eventName, payload });

    parent.postMessage(data, "*");
};
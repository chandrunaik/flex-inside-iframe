import { Actions } from "@twilio/flex-ui";
import { sendMessageToCRM } from '../helper'


export function registerListenerExtensions() {

    Actions.addListener("afterSetActivity", (payload) => {
        let data = {
            visibility: payload.activityName
        };

        sendMessageToCRM("afterSetActivity", data);
    });

    Actions.addListener("afterToggleMute", () => {
        sendMessageToCRM("toggleMute");
    });
}